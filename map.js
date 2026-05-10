const defaultPoints = [
  {id:'p1',title:'Yonge Street Light Corridor',lat:43.6532,lng:-79.3832,area:'commercial',condition:'Over-lit',time:'10:42 PM',size:'large',favorite:false,img:'',note:'This commercial street has a dense layer of storefront lights, street lamps, and car headlights.',analysis:'The strongest light comes from signs and building fronts. Some lighting may stay brighter than needed after the main evening rush.'},
  {id:'p2',title:'Harbourfront Reflection Zone',lat:43.6408,lng:-79.3818,area:'commercial',condition:'Mixed',time:'9:18 PM',size:'medium',favorite:false,img:'',note:'Light from buildings and paths reflects on glass, wet surfaces, and water.',analysis:'This location is useful for studying how artificial light spreads through reflection instead of only direct brightness.'},
  {id:'p3',title:'University Avenue Contrast',lat:43.6596,lng:-79.3892,area:'commercial',condition:'Balanced',time:'11:05 PM',size:'medium',favorite:true,img:'',note:'The street is wide and the building lights create a strong black-and-white structure.',analysis:'This sample has clear contrast between illuminated surfaces and dark gaps, making it good for visual analysis.'},
  {id:'p4',title:'Residential Edge Sample',lat:43.6673,lng:-79.4012,area:'residential',condition:'Dim',time:'10:12 PM',size:'small',favorite:false,img:'',note:'The residential edge feels softer, with smaller points of light spread across the street.',analysis:'Compared with commercial areas, this zone has lower light pollution, but some street lamps may still spill light outside the road.'}
];

let points = JSON.parse(localStorage.getItem('noctis_points') || 'null') || defaultPoints;
let currentId = null;
let adding = false;
let activeFilter = 'all';

const map = L.map('map', { zoomControl:true }).setView([43.6532,-79.3832], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19, attribution:'© OpenStreetMap' }).addTo(map);
const layer = L.layerGroup().addTo(map);

function placeholder(title){
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='900' height='650'><rect width='100%' height='100%' fill='#111'/><g fill='none' stroke='#eee' opacity='.55'>${Array.from({length:22},(_,i)=>`<path d='M${i*45} 0 C ${400-i*8} ${120+i*10}, ${300+i*12} ${380-i*4}, 900 ${i*30}'/>`).join('')}</g><text x='45' y='560' fill='#eee' font-size='42' font-family='Arial' letter-spacing='4'>${title}</text><text x='45' y='610' fill='#aaa' font-size='18' font-family='monospace'>NOCTIS / by Shun</text></svg>`)}`;
}

function saveLocal(){
  localStorage.setItem('noctis_points', JSON.stringify(points));
}

function markerHtml(p){
  const cls = `photo-marker ${p.size==='large'?'large':''} ${p.favorite?'favorite':''}`;
  return `<div class='${cls}'></div>`;
}

function shouldShow(p){
  return activeFilter === 'all' || (activeFilter === 'favorite' ? p.favorite : p.area === activeFilter);
}

function renderMarkers(){
  layer.clearLayers();
  points.filter(shouldShow).forEach(p=>{
    const icon = L.divIcon({html:markerHtml(p),className:'',iconSize:[1,1]});
    const m = L.marker([p.lat,p.lng],{icon}).addTo(layer);
    m.on('mouseover',()=>{
      const img = p.img || placeholder(p.title);
      m.setIcon(L.divIcon({html:`<img class='marker-thumb' src='${img}'/>`,className:'',iconSize:[74,74]}));
    });
    m.on('mouseout',()=>m.setIcon(icon));
    m.on('click',()=>openModal(p.id));
  });
  renderArchive();
}

function renderArchive(){
  const box = document.getElementById('archiveList');
  box.innerHTML = '';
  points.filter(shouldShow).forEach(p=>{
    const div = document.createElement('div');
    div.className = 'archive-item';
    div.innerHTML = `<img src='${p.img||placeholder(p.title)}'><div><h3>${p.title}</h3><p>${p.area} / ${p.condition}</p></div>`;
    div.onclick = () => openModal(p.id);
    box.appendChild(div);
  });
}

function autoResizeTitle(){
  const t = document.getElementById('modalTitle');
  t.style.height = 'auto';
  t.style.height = Math.min(t.scrollHeight, 150) + 'px';
}

function openModal(id){
  currentId = id;
  const p = points.find(x=>x.id===id);
  document.getElementById('photoModal').classList.remove('hidden');
  document.getElementById('modalImage').src = p.img || placeholder(p.title);
  document.getElementById('analysisOverlay').classList.toggle('hidden', Boolean(p.img));
  document.getElementById('modalTitle').value = p.title;
  autoResizeTitle();
  document.getElementById('modalLocation').textContent = `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`;
  document.getElementById('modalTimeInput').value = p.time || '';
  document.getElementById('modalArea').textContent = p.area;
  document.getElementById('modalCondition').textContent = p.condition;
  document.getElementById('modalNote').value = p.note;
  document.getElementById('modalAnalysis').value = p.analysis;
  document.getElementById('favoriteBtn').textContent = p.favorite ? '★ Saved' : '☆ Save';
}

function closeModal(){
  document.getElementById('photoModal').classList.add('hidden');
}

document.getElementById('closeModal').onclick = closeModal;
document.getElementById('closeBackdrop').onclick = closeModal;

document.getElementById('favoriteBtn').onclick = () => {
  const p = points.find(x=>x.id===currentId);
  p.favorite = !p.favorite;
  saveLocal();
  openModal(currentId);
  renderMarkers();
};

document.getElementById('modalTitle').addEventListener('input', autoResizeTitle);

document.getElementById('saveBtn').onclick = () => {
  const p = points.find(x=>x.id===currentId);
  p.title = document.getElementById('modalTitle').value;
  p.time = document.getElementById('modalTimeInput').value;
  p.note = document.getElementById('modalNote').value;
  p.analysis = document.getElementById('modalAnalysis').value;
  saveLocal();
  renderMarkers();
  openModal(currentId);
};

document.getElementById('deleteBtn').onclick = () => {
  if(!currentId) return;
  const p = points.find(x=>x.id===currentId);
  const ok = confirm(`Delete this photo point?\n${p ? p.title : ''}`);
  if(!ok) return;
  points = points.filter(x => x.id !== currentId);
  currentId = null;
  saveLocal();
  closeModal();
  renderMarkers();
};

document.getElementById('imageInput').onchange = e => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const p = points.find(x=>x.id===currentId);
    p.img = reader.result;
    saveLocal();
    openModal(currentId);
    renderMarkers();
  };
  reader.readAsDataURL(file);
};

document.getElementById('addPointBtn').onclick = () => {
  adding = true;
  document.getElementById('addPointBtn').textContent = 'Now click the map to place a photo point';
};

map.on('click',e=>{
  if(!adding) return;
  const id = 'local_' + Date.now();
  points.push({
    id,
    title:'New Light Sample',
    lat:e.latlng.lat,
    lng:e.latlng.lng,
    area:'commercial',
    condition:'Unknown',
    time:'10:00 PM',
    size:'medium',
    favorite:false,
    img:'',
    note:'Write your photography observation here.',
    analysis:'Write about light strength, light sources, reflection, and energy-saving ideas here.'
  });
  adding = false;
  document.getElementById('addPointBtn').textContent = '+ Add Photo Point';
  saveLocal();
  renderMarkers();
  openModal(id);
});

document.getElementById('clearLocalBtn').onclick = () => {
  localStorage.removeItem('noctis_points');
  points = JSON.parse(JSON.stringify(defaultPoints));
  renderMarkers();
};

document.querySelectorAll('.map-topbar button').forEach(btn=>{
  btn.onclick = () => {
    activeFilter = btn.dataset.filter;
    renderMarkers();
  };
});

renderMarkers();
