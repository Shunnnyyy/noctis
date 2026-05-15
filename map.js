const defaultPoints = [
  {
    id: 'p1',
    title: 'Yonge Street Light Corridor',
    lat: 43.6532,
    lng: -79.3832,
    area: 'commercial',
    condition: 'Over-lit',
    time: '10:42 PM',
    intensity: 88,
    favorite: false,
    img: '',
    note: 'This commercial street has a dense layer of storefront lights, street lamps, and car headlights.',
    analysis: 'The strongest light comes from signs and building fronts. Some lighting may stay brighter than needed after the main evening rush.'
  },
  {
    id: 'p2',
    title: 'Harbourfront Reflection Zone',
    lat: 43.6408,
    lng: -79.3818,
    area: 'commercial',
    condition: 'Mixed',
    time: '9:18 PM',
    intensity: 68,
    favorite: false,
    img: '',
    note: 'Light from buildings and paths reflects on glass, wet surfaces, and water.',
    analysis: 'This location is useful for studying how artificial light spreads through reflection instead of only direct brightness.'
  },
  {
    id: 'p3',
    title: 'University Avenue Contrast',
    lat: 43.6596,
    lng: -79.3892,
    area: 'commercial',
    condition: 'Balanced',
    time: '11:05 PM',
    intensity: 58,
    favorite: true,
    img: '',
    note: 'The street is wide and the building lights create a strong black-and-white structure.',
    analysis: 'This sample has clear contrast between illuminated surfaces and dark gaps, making it good for visual analysis.'
  },
  {
    id: 'p4',
    title: 'Residential Edge Sample',
    lat: 43.6673,
    lng: -79.4012,
    area: 'residential',
    condition: 'Dim',
    time: '10:12 PM',
    intensity: 34,
    favorite: false,
    img: '',
    note: 'The residential edge feels softer, with smaller points of light spread across the street.',
    analysis: 'Compared with commercial areas, this zone has lower light pollution, but some street lamps may still spill light outside the road.'
  }
];

const storageKey = 'noctis_points';
const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
let points = (saved || defaultPoints).map(normalizePoint);
let currentId = null;
let adding = false;
let activeFilter = 'all';
let searchTerm = '';

const map = L.map('map', { zoomControl: true }).setView([43.6532, -79.3832], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

const layer = L.layerGroup().addTo(map);

function normalizePoint(point) {
  const intensity = Number(point.intensity);
  return {
    ...point,
    intensity: Number.isFinite(intensity) ? intensity : sizeToIntensity(point.size),
    favorite: Boolean(point.favorite)
  };
}

function sizeToIntensity(size) {
  if (size === 'large') return 85;
  if (size === 'small') return 35;
  return 60;
}

function placeholder(title) {
  const safeTitle = escapeHtml(title);
  const lines = Array.from({ length: 22 }, (_, i) => `<path d="M${i * 45} 0 C ${400 - i * 8} ${120 + i * 10}, ${300 + i * 12} ${380 - i * 4}, 900 ${i * 30}"/>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="650"><rect width="100%" height="100%" fill="#101010"/><g fill="none" stroke="#f4f1ea" opacity=".5">${lines}</g><circle cx="728" cy="130" r="86" fill="none" stroke="#d8ff6a" opacity=".72"/><text x="45" y="552" fill="#f4f1ea" font-size="40" font-family="Arial" font-weight="700">${safeTitle}</text><text x="45" y="604" fill="#aaa" font-size="18" font-family="monospace">NOCTIS / by Shun</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[char]);
}

function saveLocal() {
  localStorage.setItem(storageKey, JSON.stringify(points));
}

function markerHtml(point) {
  const size = 18 + Math.round(point.intensity * 0.26);
  const cls = `photo-marker ${point.favorite ? 'favorite' : ''}`;
  return `<div class="${cls}" style="--marker-size:${size}px" title="${escapeHtml(point.title)}"></div>`;
}

function pointMatchesSearch(point) {
  if (!searchTerm) return true;
  const body = [point.title, point.area, point.condition, point.time, point.note, point.analysis].join(' ').toLowerCase();
  return body.includes(searchTerm);
}

function shouldShow(point) {
  const filterMatch = activeFilter === 'all' || (activeFilter === 'favorite' ? point.favorite : point.area === activeFilter);
  return filterMatch && pointMatchesSearch(point);
}

function visiblePoints() {
  return points.filter(shouldShow);
}

function renderMarkers() {
  layer.clearLayers();
  visiblePoints().forEach(point => {
    const icon = L.divIcon({ html: markerHtml(point), className: '', iconSize: [1, 1] });
    const marker = L.marker([point.lat, point.lng], { icon }).addTo(layer);

    marker.on('mouseover', () => {
      const img = point.img || placeholder(point.title);
      marker.setIcon(L.divIcon({ html: `<img class="marker-thumb" src="${img}" alt="">`, className: '', iconSize: [78, 78] }));
    });
    marker.on('mouseout', () => marker.setIcon(icon));
    marker.on('click', () => openModal(point.id));
  });
  renderArchive();
  renderSummary();
}

function renderArchive() {
  const box = document.getElementById('archiveList');
  const shown = visiblePoints();
  box.innerHTML = '';

  if (!shown.length) {
    box.innerHTML = '<p class="archive-empty">No matching light samples. Change the filter or add a new point.</p>';
    return;
  }

  shown.forEach(point => {
    const div = document.createElement('div');
    div.className = 'archive-item';
    div.innerHTML = `
      <img src="${point.img || placeholder(point.title)}" alt="">
      <div>
        <h3>${escapeHtml(point.title)}</h3>
        <p>${escapeHtml(point.area)} / ${escapeHtml(point.condition)} / ${point.intensity}%</p>
      </div>
    `;
    div.onclick = () => {
      map.flyTo([point.lat, point.lng], Math.max(map.getZoom(), 16), { duration: 0.8 });
      openModal(point.id);
    };
    box.appendChild(div);
  });
}

function renderSummary() {
  const shown = visiblePoints();
  const pointCount = document.getElementById('pointCount');
  const filterLabel = document.getElementById('filterLabel');
  const averageIntensity = document.getElementById('averageIntensity');
  const analysisSummary = document.getElementById('analysisSummary');

  pointCount.textContent = `${shown.length} point${shown.length === 1 ? '' : 's'}`;
  filterLabel.textContent = activeFilter === 'all' ? 'All' : activeFilter;

  if (!shown.length) {
    averageIntensity.textContent = '0%';
    analysisSummary.textContent = 'No points match the current view.';
    return;
  }

  const avg = Math.round(shown.reduce((sum, point) => sum + point.intensity, 0) / shown.length);
  const bright = shown.filter(point => point.intensity >= 70).length;
  const favorites = shown.filter(point => point.favorite).length;
  averageIntensity.textContent = `${avg}%`;
  analysisSummary.textContent = `${bright} strong light area${bright === 1 ? '' : 's'} and ${favorites} saved sample${favorites === 1 ? '' : 's'} in the current view.`;
}

function autoResizeTitle() {
  const title = document.getElementById('modalTitle');
  title.style.height = 'auto';
  title.style.height = `${Math.min(title.scrollHeight, 150)}px`;
}

function updateIntensityLabel() {
  document.getElementById('intensityValue').textContent = `${document.getElementById('modalIntensity').value}%`;
}

function openModal(id) {
  currentId = id;
  const point = points.find(item => item.id === id);
  if (!point) return;

  document.getElementById('photoModal').classList.remove('hidden');
  document.getElementById('modalImage').src = point.img || placeholder(point.title);
  document.getElementById('analysisOverlay').classList.toggle('hidden', Boolean(point.img));
  document.getElementById('modalTitle').value = point.title;
  autoResizeTitle();
  document.getElementById('modalLocation').textContent = `${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`;
  document.getElementById('modalTimeInput').value = point.time || '';
  document.getElementById('modalAreaInput').value = point.area;
  document.getElementById('modalConditionInput').value = point.condition;
  document.getElementById('modalIntensity').value = point.intensity;
  updateIntensityLabel();
  document.getElementById('modalNote').value = point.note;
  document.getElementById('modalAnalysis').value = point.analysis;
  document.getElementById('favoriteBtn').textContent = point.favorite ? 'Saved' : 'Save';
}

function closeModal() {
  document.getElementById('photoModal').classList.add('hidden');
}

document.getElementById('closeModal').onclick = closeModal;
document.getElementById('closeBackdrop').onclick = closeModal;

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeModal();
});

document.getElementById('favoriteBtn').onclick = () => {
  const point = points.find(item => item.id === currentId);
  if (!point) return;
  point.favorite = !point.favorite;
  saveLocal();
  openModal(currentId);
  renderMarkers();
};

document.getElementById('modalTitle').addEventListener('input', autoResizeTitle);
document.getElementById('modalIntensity').addEventListener('input', updateIntensityLabel);

document.getElementById('saveBtn').onclick = () => {
  const point = points.find(item => item.id === currentId);
  if (!point) return;
  point.title = document.getElementById('modalTitle').value.trim() || 'Untitled Light Sample';
  point.time = document.getElementById('modalTimeInput').value.trim();
  point.area = document.getElementById('modalAreaInput').value;
  point.condition = document.getElementById('modalConditionInput').value;
  point.intensity = Number(document.getElementById('modalIntensity').value);
  point.note = document.getElementById('modalNote').value.trim();
  point.analysis = document.getElementById('modalAnalysis').value.trim();
  saveLocal();
  renderMarkers();
  openModal(currentId);
};

document.getElementById('deleteBtn').onclick = () => {
  if (!currentId) return;
  const point = points.find(item => item.id === currentId);
  const ok = confirm(`Delete this photo point?\n${point ? point.title : ''}`);
  if (!ok) return;
  points = points.filter(item => item.id !== currentId);
  currentId = null;
  saveLocal();
  closeModal();
  renderMarkers();
};

document.getElementById('imageInput').onchange = event => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const point = points.find(item => item.id === currentId);
    if (!point) return;
    point.img = reader.result;
    saveLocal();
    openModal(currentId);
    renderMarkers();
  };
  reader.readAsDataURL(file);
};

document.getElementById('addPointBtn').onclick = () => {
  adding = true;
  document.getElementById('addPointBtn').textContent = 'Click Map';
  map.getContainer().style.cursor = 'crosshair';
};

map.on('click', event => {
  if (!adding) return;
  const id = `local_${Date.now()}`;
  points.push({
    id,
    title: 'New Light Sample',
    lat: event.latlng.lat,
    lng: event.latlng.lng,
    area: 'commercial',
    condition: 'Unknown',
    time: '10:00 PM',
    intensity: 55,
    favorite: false,
    img: '',
    note: 'Write your photography observation here.',
    analysis: 'Write about light strength, light sources, reflection, and energy-saving ideas here.'
  });
  adding = false;
  map.getContainer().style.cursor = '';
  document.getElementById('addPointBtn').textContent = 'Add Point';
  saveLocal();
  renderMarkers();
  openModal(id);
});

document.getElementById('clearLocalBtn').onclick = () => {
  localStorage.removeItem(storageKey);
  points = defaultPoints.map(normalizePoint);
  renderMarkers();
};

document.getElementById('focusBtn').onclick = () => {
  const shown = visiblePoints();
  if (!shown.length) {
    map.flyTo([43.6532, -79.3832], 14, { duration: 0.8 });
    return;
  }
  const bounds = L.latLngBounds(shown.map(point => [point.lat, point.lng]));
  map.fitBounds(bounds.pad(0.28), { maxZoom: 15 });
};

document.getElementById('exportBtn').onclick = () => {
  const blob = new Blob([JSON.stringify(points, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `noctis-archive-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

document.getElementById('searchInput').addEventListener('input', event => {
  searchTerm = event.target.value.trim().toLowerCase();
  renderMarkers();
});

document.querySelectorAll('.map-topbar button').forEach(button => {
  button.onclick = () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll('.map-topbar button').forEach(item => item.classList.toggle('active', item === button));
    renderMarkers();
  };
});

renderMarkers();
