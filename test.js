var tfetch = require('./index');
var fetch = tfetch();
var fs = require('fs');

var url='http://amazon.com/'
var cookiePath = './cookies.json';

fetch(url).then(r=>r.text()).then(data=>{
    console.log(data.length);
    return fetch(url).then(r=>r.text())
}).then(data=>{
    console.log(data.length);
    fs.writeFileSync(
        cookiePath,
        JSON.stringify(fetch.getCookiesIndex(), undefined, '  '))
    //var cookieData = fs.readFileSync( "./cookies.json")+'';
    fetch = tfetch();
    fetch.setCookieIndex(cookiePath)
    console.log('last')
    return fetch(url).then(r=>r.text())
}).then(data=>{
    console.log(data.length);

}).catch(err=>console.log(err));