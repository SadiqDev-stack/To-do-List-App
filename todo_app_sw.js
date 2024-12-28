const cacheName = 'todo_app_cache';
const app_asset = [
   'icon.png',
   'manifest.json',
   'todo_app.html',
   'todo_app.css',
   'todo_app.js'
  ]

self.addEventListener('install',ins => {
  
  ins.waitUntil(
     caches.open(cacheName).then(cach => {
       return cach.addAll(app_asset)
     })
    )
  
})


self.addEventListener('fetch',req => {
  
  req.respondWith(
    
    fetch(req.request).catch(() => {
      return caches.match(req.request)
    })
    
    )
 
})