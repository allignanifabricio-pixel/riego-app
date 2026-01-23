self.addEventListener('install', event=>{
  console.log('Service Worker instalado');
});

self.addEventListener('fetch', event=>{
  // Para hacer offline, se podría agregar cache aquí
});