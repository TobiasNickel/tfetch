var fetch = require('node-fetch');

function defaults(target, obj) {
    for (var prop in obj) target[prop] = target[prop] || obj[prop];
}

function getQuery(queryParams) {
    var arr = Object.keys(queryParams).map(function (k) {
        return k + '=' + encodeURIComponent(queryParams[k]);
    });
    return '?' + arr.join('&');
}

function _fetch(method, url, opts, data, queryParams) {
    opts.method = method;
    opts.headers = opts.headers || {};
    opts.responseAs = (opts.responseAs && ['json', 'text', 'response'].indexOf(opts.responseAs) >= 0) ? opts.responseAs : 'json';

    defaults(opts.headers, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });

    if (queryParams) {
        url += getQuery(queryParams);
    }

    if (data) {
        opts.body = JSON.stringify(data);
    } else {
        delete opts.body;
    }

    return (this.fetch || fetchival.fetch)(url, opts)
        .then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                if (opts.responseAs == "response")
                    return response;
                if (response.status == 204)
                    return null;
                return response[opts.responseAs]();
            }
            var err = new Error(response.statusText);
            err.response = response;
            throw err;
        });
}

/**
 * 
 * @param {string} url 
 * @param {{}} opts 
 */
function fetchival(url, opts) {
    opts = opts || {};

    /**
     * 
     * @param {String} u 
     * @param {{}} o 
     */
    var _ = function (u, o) {
        // Extend parameters with previous ones
        if(!u.startsWith('http')==0 || ![4,5].includes(u.indexOf('://'))){
            u = url + (u[0] === '/' ? '' : '/') + u;
        }
        o = o || {};
        defaults(o, opts);
        return fetchival(u, o);
    };

    _.fetch = opts.fetch;

    /**
     * 
     * @param {{}} queryParams 
     */
    _.get = function (queryParams) {
        return _fetch.call(_, 'GET', url, opts, null, queryParams);
    };

    /**
     * 
     * @param {{}} data 
     */
    _.post = function (data) {
        return _fetch.call(_, 'POST', url, opts, data);
    };

    /**
     * 
     * @param {{}} data 
     */
    _.put = function (data) {
        return _fetch.call(_, 'PUT', url, opts, data);
    };

    /**
     * 
     * @param {{}} data 
     */
    _.patch = function (data) {
        return _fetch.call(_, 'PATCH', url, opts, data);
    };

    _.delete = function () {
        return _fetch.call(_, 'DELETE', url, opts);
    };

    return _;
}

// Expose fetch so that other polyfills can be used
// Bind fetch to window to avoid TypeError: Illegal invocation
fetchival.fetch = fetch;

module.exports = fetchival;