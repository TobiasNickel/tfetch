var fetch = require('node-fetch');
var tough = require('tough-cookie');
var fs = require('fs')
var Cookie = tough.Cookie;

module.exports = tfetch;

function tfetch(){
    var cookieJar = new tough.CookieJar();

    function setCookie(cookie,url){
        if(!cookie){
            return Promise.resolve();
        }
        return new Promise((resolve,reject)=>{
            cookieJar.setCookie(cookie,url,(err,data)=>{
                if(err){reject(err)}else{resolve(data)}
            });
        });
    }
    
    function getCookies(url){
        return new Promise((resolve,reject)=>{
            cookieJar.getCookies(url,(err,cookies)=>{
                if(err){reject(err)}else{resolve(cookies)}
            });
        });
    }

    async function newFetch(url,options={},...args){
        const oldCookies = await getCookies(url);
        console.log('oldCookies',oldCookies)
        if(oldCookies.length){
            if(!options.headers)options.headers={};
            options.headers['cookie'] = oldCookies.join('; ');
        }
        var answer = await fetch(url,options,...args)
        const cookieString = answer.headers.get('set-cookie');
        await setCookie(cookieString, answer.url);
        console.log(cookieJar);
        return answer
    }

    newFetch.clearCookies = ()=>{
        cookieJar.store.idx={};
    }

    //newFetch.cookieJar = cookieJar; 
    newFetch.getCookiesIndex = ()=>{
        //cookieJar.store.
        return cookieJar.serializeSync();
    }
    newFetch.setCookieIndex = (data)=>{
        if(Buffer.isBuffer(data))data = data+'';
        if(typeof data=='string'){
            try{
                data = JSON.parse(data);
            }catch(e){
                data = JSON.parse(fs.readFileSync(data)+'');
            }
        }
        newFetch.clearCookies();
        data.cookies.forEach(cookieDefinition=>{
            var cookie = Cookie.fromJSON(cookieDefinition)
            console.log(cookie)
            cookieJar.setCookieSync(cookie,(cookie.secure?'https':'http')+'://'+cookie.domain+cookie.path);
        });
        
    }
    return newFetch;
}