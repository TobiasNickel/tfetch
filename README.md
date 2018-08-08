# tfetch
a wrapper for node-fetch with tough-cookie

## Motivation
I like the http apis of fetch. They are awesome. And I want to use them. 

using node-fetch in node, sadly does not send any header. That is good, so it is giving us full control. Still, I don't want to handle cookies by hand. So I provide a wrapper for node-fetch. 

Having the cookiesupport in node, just allow you to write scrits that login, do stuff and logout. How cool is that. That is usefull for testing or accessing a website.

Having that,  I will make sure that is can work well together with [fetchival](https://github.com/typicode/fetchival).
