let arboles = JSON.parse(localStorage.getItem('arboles') || '[]');

const calendarEl = document.getElementById('calendar');
['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].forEach(d=>{
  const div=document.createElement('div'); div.textContent=d; calendarEl.appendChild(div);
});

function guardarArboles(){ localStorage.setItem('arboles', JSON.stringify(arboles)); }

function mostrarArboles(){
  const container=document.getElementById('arboles'); container.innerHTML='';
  arboles.forEach((arbol,index)=>{
    const div=document.createElement('div'); div.className='arbol';
    div.innerHTML=`<h3>${arbol.nombre}</h3><p>Riego cada ${arbol.frecuencia} días</p>
    <button class="editar">Editar</button>
    <button class="borrar">Borrar</button>`;
    div.querySelector('.editar').onclick=()=>{
      const n=prompt('Nombre del árbol:',arbol.nombre);
      const f=prompt('Frecuencia en días:',arbol.frecuencia);
      if(n && f){ arboles[index].nombre=n; arboles[index].frecuencia=parseInt(f); guardarArboles(); mostrarArboles();}
    };
    div.querySelector('.borrar').onclick=()=>{ if(confirm('¿Eliminar este árbol?')){arboles.splice(index,1); guardarArboles(); mostrarArboles();}};
    container.appendChild(div);
  });
}

document.getElementById('btnAgregar').onclick=()=>{
  const n=prompt('Nombre del árbol:'); const f=prompt('Cada cuántos días se riega:');
  if(n && f){ arboles.push({nombre:n,frecuencia:parseInt(f),ultimaRiego:Date.now()}); guardarArboles(); mostrarArboles();}
};

if('Notification' in window){ Notification.requestPermission(); }

function notificarRiego(){
  const hoy=new Date().setHours(0,0,0,0);
  arboles.forEach(arbol=>{
    const ultima=new Date(arbol.ultimaRiego).setHours(0,0,0,0);
    const diffDias=Math.floor((hoy-ultima)/(1000*60*60*24));
    if(diffDias>=arbol.frecuencia && Notification.permission==='granted'){
      new Notification(`Riego de ${arbol.nombre}`, {body:`Hoy toca regar ${arbol.nombre} 🌱`});
    }
  });
}

// En PWA real, se puede usar background sync o service worker para notificaciones
setInterval(notificarRiego,60000);

mostrarArboles();