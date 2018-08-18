wrapper for node-fetch with tough-cookie

## Motivation
I like the http apis of fetch. They are awesome. And I want to use them. 

using node-fetch in node, sadly does not send any header. That is good, so it is giving us full control. Still, I don't want to handle cookies by hand. So I provide a wrapper for node-fetch. 

Having the cookiesupport in node, just allow you to write scrits that login, do stuff and logout. How cool is that. That is usefull for testing or accessing a website.

Having that,  I will make sure that is can work well together with [fetchival](https://github.com/typicode/fetchival).

## Demo
```js
const tnfetch = require('tnfetch');

// tnfetch is a function to that return a new fetch with its own cookie store
const fetch = tnfetch();

fetch('https://amazon.com').then(amazonCom=>{
    processHTML(amazonCom);
    // after query some webside, we can get the cookies
    // they are an array and can easily be saved with JSON.strinify
    // and filtered with cookies.filter(...)
    const cookies = fetch.getCookiesIndex();
    saveCookies(cookies);
    
    // when having cookies from somewhere you can createa new fetch 
    // and set them to be used in the session
    const session2Cookies = loadOtherCookies('session2');
    fetch = tnfetch();  // now it is new and has no cookies
    fetch.setCookieIndex(session2Cookies);

    return fetch('https://amazon.com/')
}).then(loggedInAmazonCom=>{
    processHTML(loggedInAmazonCom);
});

// a modified verison of fetchival, that will allow you to set fetch from the options
// not just on the global and it is no longer build for browser, only for node-fetch
const fetchival = tnfetch.fetchival;

const amazon = fetchival("https://amazon.com/",{fetch: tnfetch()});
// for the rest just see the documentation of fetchival, it is very clean

```

