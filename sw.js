const CACHE="ef-command-ultimate-v3";
const CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-512-maskable.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  const url=new URL(e.request.url);
  if(url.hostname.endsWith("wikipedia.org")||url.hostname.endsWith("wikibooks.org")){
    e.respondWith(fetch(e.request).catch(()=>new Response(JSON.stringify({query:{pages:{}}}),{headers:{"Content-Type":"application/json"}})));return;
  }
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res}).catch(()=>caches.match("./index.html"))))
});