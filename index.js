var fetch = require('node-fetch');
var tough = require('tough-cookie');
var fetchival = require('./fetchival.js');
var fs = require('fs')
var Cookie = tough.Cookie;

module.exports = tnfetch;
tnfetch.fetchival = fetchival("", { fetch: tnfetch() });

function tnfetch(options) {
    options = options || {};
    var cookieJar = new tough.CookieJar(undefined, {
        rejectPublicSuffixes: !!options.rejectPublicSuffixes || false,
    });

    function setCookie(cookie, url) {
        if (!cookie) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            cookieJar.setCookie(cookie, url, (err, data) => {
                if (err) { reject(err) } else { resolve(data) }
            });
        });
    }

    function getCookies(url) {
        return new Promise((resolve, reject) => {
            cookieJar.getCookies(url, (err, cookies) => {
                if (err) { reject(err) } else { resolve(cookies) }
            });
        });
    }

    async function newFetch(url, options = {}, ...args) {
        const oldCookies = await getCookies(url);
        if (oldCookies.length) {
            if (!options.headers) options.headers = {};
            options.headers['cookie'] = oldCookies.join('; ');
        }
        var answer = await fetch(url, options, ...args)
        const cookieString = answer.headers.get('set-cookie');
        await setCookie(cookieString, answer.url);
        return answer
    }

    newFetch.clearCookies = () => {
        cookieJar.store.idx = {};
    }

    newFetch.getCookiesIndex = () => {
        return cookieJar.serializeSync();
    }

    newFetch.setCookieIndex = (data) => {
        if (Buffer.isBuffer(data)) data = data + '';
        if (typeof data == 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                data = JSON.parse(fs.readFileSync(data) + '');
            }
        }
        newFetch.clearCookies();
        data.cookies.forEach(cookieDefinition => {
            const cookie = Cookie.fromJSON(cookieDefinition)
            const currentUrl = (cookie.secure ? 'https' : 'http') + '://' + cookie.domain + cookie.path;
            cookieJar.setCookieSync(cookie, currentUrl);
        });

    }

    return newFetch;
}