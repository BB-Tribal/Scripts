javascript:
(function () {

// ╔══════════════════════════════════════════════════════╗
//  LANG
// ╚══════════════════════════════════════════════════════╝
var _fcLang = {
    title:       'Fake Coordinado',
    badge:       '⚔️ HERRAMIENTA',
    subtitle:    'Calcula los lanzamientos exactos',
    targetLabel: 'Pueblos Objetivo',
    targetPH:    'Pega coordenadas o cualquier texto…\nEj: 500|500  501|502\n\nPuedes pegar un reporte, lista o script entero — el script detecta las coordenadas automáticamente.',
    hitLabel:    'Hora de Impacto',
    calcBtn:     'Calcular Lanzamientos',
    settTitle:   'Ajustes',
    settSub:     'Tema, tipografía y tropas',
    troopsLabel: 'Tropas a Enviar',
    fontLabel:   'Tipografía',
    helpTitle:   'Ayuda',
    helpSub:     'Cómo usar el script',
    resTitle:    'Lanzamientos',
    resSub:      '{n} resultados calculados',
    launchIn:    'Lanzar en',
    launchAt:    'Hora de lanzamiento',
    dist:        'Distancia',
    rallyBtn:    'Ir a Plaza',
    noResults:   'Sin resultados. Revisa coordenadas y hora de impacto.',
    rallyTitle:  'Fake Coordinado',
    rallyTarget: 'Objetivo',
    rallyLaunch: 'Lanzar a las',
    rallyCD:     'Tiempo restante',
    rallyDist:   'Distancia',
    rallyUnits:  'Tropas',
    launching:   '¡LANZAR AHORA!',
    save:        'Guardar',
    close:       '✕',
    back:        '← Volver',
    format:      'Formato',
    fmtText:     'Texto',
    fmtPicker:   'Selector',
    source:      'Origen',
    target:      'Objetivo',
    fields:      'campos',
};

// ╔══════════════════════════════════════════════════════╗
//  FONTS
// ╚══════════════════════════════════════════════════════╝
var fonts = {
    modern:  { label: 'Moderno',  css: "'Segoe UI', system-ui, sans-serif" },
    classic: { label: 'Clásico',  css: "Georgia, 'Times New Roman', serif" },
    clean:   { label: 'Limpio',   css: "'Arial', Helvetica, sans-serif" },
    mono:    { label: 'Técnico',  css: "'Courier New', Courier, monospace" },
};

// ╔══════════════════════════════════════════════════════╗
//  THEMES
// ╚══════════════════════════════════════════════════════╝
var FC_THEMES = {
    emerald:  { name:'Esmeralda', emoji:'&#x1F49A;', '--fg-bg':'#ffffff','--fg-bg2':'#f0fdf4','--fg-bg3':'#ecfdf5','--fg-border':'#d1fae5','--fg-accent':'#065f46','--fg-accent2':'#064e3b','--fg-text':'#1f2937','--fg-text2':'#6b7280','--fg-hover':'rgba(6,95,70,.07)','--fg-link':'#047857','--fg-shadow':'rgba(6,78,59,.25)' },
    inferno:  { name:'Inferno',   emoji:'&#x1F525;', '--fg-bg':'#1c1f27','--fg-bg2':'#13151c','--fg-bg3':'#252831','--fg-border':'#2c2f3c','--fg-accent':'#f5a623','--fg-accent2':'#e8700a','--fg-text':'#e2e8f0','--fg-text2':'#8892a4','--fg-hover':'rgba(245,166,35,.05)','--fg-link':'#4f8ef7','--fg-shadow':'rgba(0,0,0,.7)' },
    sakura:   { name:'Sakura',    emoji:'&#x1F338;', '--fg-bg':'#fdf2f8','--fg-bg2':'#fce7f3','--fg-bg3':'#ffffff','--fg-border':'#f9a8d4','--fg-accent':'#ec4899','--fg-accent2':'#db2777','--fg-text':'#1f2937','--fg-text2':'#6b7280','--fg-hover':'rgba(236,72,153,.07)','--fg-link':'#db2777','--fg-shadow':'rgba(236,72,153,.2)' },
    amethyst: { name:'Amethyst',  emoji:'&#x1F49C;', '--fg-bg':'#faf5ff','--fg-bg2':'#f3e8ff','--fg-bg3':'#ffffff','--fg-border':'#d8b4fe','--fg-accent':'#7c3aed','--fg-accent2':'#6d28d9','--fg-text':'#1f2937','--fg-text2':'#6b7280','--fg-hover':'rgba(124,58,237,.07)','--fg-link':'#7c3aed','--fg-shadow':'rgba(124,58,237,.2)' },
    matrix:   { name:'Matrix',    emoji:'&#x1F7E2;', '--fg-bg':'#0a0f0a','--fg-bg2':'#050805','--fg-bg3':'#0f1a0f','--fg-border':'#1a3d1a','--fg-accent':'#00ff41','--fg-accent2':'#00cc34','--fg-text':'#ccffcc','--fg-text2':'#4dff77','--fg-hover':'rgba(0,255,65,.05)','--fg-link':'#00ff41','--fg-shadow':'rgba(0,255,65,.3)' },
    midnight: { name:'Midnight',  emoji:'&#x1F319;', '--fg-bg':'#0f172a','--fg-bg2':'#080d1a','--fg-bg3':'#1e293b','--fg-border':'#334155','--fg-accent':'#3b82f6','--fg-accent2':'#2563eb','--fg-text':'#e2e8f0','--fg-text2':'#94a3b8','--fg-hover':'rgba(59,130,246,.07)','--fg-link':'#60a5fa','--fg-shadow':'rgba(0,0,0,.8)' },
    crimson:  { name:'Crimson',   emoji:'&#x1F534;', '--fg-bg':'#1a0505','--fg-bg2':'#0d0202','--fg-bg3':'#2d0a0a','--fg-border':'#7f1d1d','--fg-accent':'#ef4444','--fg-accent2':'#dc2626','--fg-text':'#fecaca','--fg-text2':'#f87171','--fg-hover':'rgba(239,68,68,.07)','--fg-link':'#f87171','--fg-shadow':'rgba(0,0,0,.8)' },
    arctic:   { name:'Arctic',    emoji:'&#x1F30A;', '--fg-bg':'#f0f9ff','--fg-bg2':'#e0f2fe','--fg-bg3':'#ffffff','--fg-border':'#bae6fd','--fg-accent':'#0ea5e9','--fg-accent2':'#0284c7','--fg-text':'#0c4a6e','--fg-text2':'#0369a1','--fg-hover':'rgba(14,165,233,.07)','--fg-link':'#0ea5e9','--fg-shadow':'rgba(14,165,233,.2)' },
    obsidian: { name:'Obsidian',  emoji:'&#x1F5A4;', '--fg-bg':'#000000','--fg-bg2':'#0a0a0a','--fg-bg3':'#111111','--fg-border':'#1f1f1f','--fg-accent':'#06b6d4','--fg-accent2':'#0891b2','--fg-text':'#e2e8f0','--fg-text2':'#64748b','--fg-hover':'rgba(6,182,212,.05)','--fg-link':'#38bdf8','--fg-shadow':'rgba(0,0,0,.9)' },
    tribal:   { name:'Tribal',    emoji:'&#x1F3F0;', '--fg-bg':'#f4e8c4','--fg-bg2':'#e8d4a0','--fg-bg3':'#fdf5e0','--fg-border':'#9b7b3a','--fg-accent':'#7a9b2a','--fg-accent2':'#5a7a1a','--fg-text':'#3d2b0e','--fg-text2':'#7a5c2e','--fg-hover':'rgba(122,155,42,.09)','--fg-link':'#5a7a1a','--fg-shadow':'rgba(61,43,14,.3)' },
};

function applyFCTheme(name) {
    var th = FC_THEMES[name] || FC_THEMES.emerald;
    var vars = Object.keys(th).filter(function(k) { return k.indexOf('--') === 0; })
        .map(function(k) { return k + ':' + th[k]; }).join(';');
    var el = document.getElementById('fc-theme-vars');
    if (!el) { el = document.createElement('style'); el.id = 'fc-theme-vars'; document.head.appendChild(el); }
    el.textContent = '.fc-overlay, .fc-box, #fcLoader { ' + vars + ' }';
    localStorage.setItem('fakeCoor_theme', name);
}

function getFCCurrentTheme() {
    return localStorage.getItem('fakeCoor_theme') || 'emerald';
}

// ╔══════════════════════════════════════════════════════╗
//  STORAGE KEYS
// ╚══════════════════════════════════════════════════════╝
var KEY_DATE    = 'fakeCoorDate';
var KEY_PENDING = 'fakeCoorPending';
var KEY_FONT    = 'fakeCoorFont';
var KEY_TROOPS  = 'fakeCoorTroops';
var KEY_FMT     = 'fakeCoorTimeFmt';
var KEY_THEME    = 'fakeCoor_theme';
var KEY_ALL_UNITS = 'fakeCoorAllUnits';

var currentFont = localStorage.getItem(KEY_FONT) || 'mono';
var timeFmt     = localStorage.getItem(KEY_FMT)  || 'text';

// ╔══════════════════════════════════════════════════════╗
//  HELPERS
// ╚══════════════════════════════════════════════════════╝
function pad(n) { return n < 10 ? '0' + n : '' + n; }

function msToHMS(ms) {
    var s = Math.floor(ms / 1000);
    return pad(Math.floor(s / 3600)) + ':' + pad(Math.floor((s % 3600) / 60)) + ':' + pad(s % 60);
}

// Returns how many ms the server clock is ahead of UTC (e.g. +7200000 for UTC+2).
// Computed fresh each call so DST changes are picked up automatically.
function getFCServerOffset() {
    try {
        var te = document.getElementById('serverTime');
        var de = document.getElementById('serverDate');
        if (!te || !de) return 0;
        var t  = te.textContent.trim();
        var dm = de.textContent.trim().match(/(\d+)\/(\d+)\/(\d+)/);
        if (!dm) return 0;
        return Date.parse(dm[3] + '-' + dm[2] + '-' + dm[1] + 'T' + t + 'Z') - Date.now();
    } catch(e) { return 0; }
}

// Converts a server-time string (ISO "YYYY-MM-DDTHH:MM" or text "Mon DD YYYY HH:MM:SS")
// into a datetime-local value, treating the input as server time in both cases.
function toDatetimeLocal(dateStr) {
    var ep = /^\d{4}-\d{2}-\d{2}T/.test(dateStr) ? Date.parse(dateStr + 'Z') : Date.parse(dateStr + ' UTC');
    if (isNaN(ep)) return '';
    var d = new Date(ep);
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth()+1) + '-' + pad(d.getUTCDate()) +
           'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes());
}

// Parses the time input (server time) into a real UTC Date, accounting for server timezone.
function fromInput(val) {
    var sOff = getFCServerOffset();
    var ep = /^\d{4}-\d{2}-\d{2}T/.test(val) ? Date.parse(val + 'Z') - sOff : Date.parse(val + ' UTC') - sOff;
    return isNaN(ep) ? null : new Date(ep);
}

function extractCoords(src) {
    var m = src.match(/\d+\|\d+/ig);
    return m ? m[m.length - 1] : null;
}

function calcDist(to, from) {
    var t = extractCoords(to).match(/(\d+)\|(\d+)/);
    var s = extractCoords(from).match(/(\d+)\|(\d+)/);
    return Math.sqrt(Math.pow(s[1]-t[1], 2) + Math.pow(s[2]-t[2], 2));
}

function fontCSS() { return fonts[currentFont] ? fonts[currentFont].css : fonts.modern.css; }

function fcOverlayClose(selector) {
    var _downOnOverlay = false;
    $(document).on('mousedown', selector, function(e) {
        _downOnOverlay = e.target === this;
    });
    $(document).on('mouseup', selector, function(e) {
        if (_downOnOverlay && e.target === this) $(this).remove();
        _downOnOverlay = false;
    });
}

// ╔══════════════════════════════════════════════════════╗
//  CSS
// ╚══════════════════════════════════════════════════════╝
function buildCSS() {
    var f = fontCSS();
    return `
.fc-overlay {
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,.65);z-index:99999;
    display:flex;align-items:center;justify-content:center;
    font-family:${f};
}
.fc-box {
    background:var(--fg-bg);border-radius:16px;
    box-shadow:0 28px 70px var(--fg-shadow),0 0 0 1px rgba(255,255,255,.06);
    overflow:hidden;
}
.fc-head {
    background:linear-gradient(160deg,var(--fg-accent2) 0%,var(--fg-accent) 100%);
    padding:18px 20px 16px;
    display:flex;align-items:center;justify-content:space-between;gap:10px;
    border-bottom:1px solid rgba(255,255,255,.06);
}
.fc-head-center { flex:1;text-align:center;min-width:0; }
.fc-head-brand  { display:flex;align-items:center;gap:12px;flex:1;min-width:0; }
.fc-head-logo {
    width:42px;height:42px;flex-shrink:0;
    background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);
    border-radius:11px;display:flex;align-items:center;justify-content:center;
    font-size:21px;box-shadow:inset 0 1px 0 rgba(255,255,255,.1);
}
.fc-head-text   { min-width:0; }
.fc-head-title  { font-size:17px;font-weight:800;color:#ffffff;letter-spacing:.2px;line-height:1.2;text-shadow:0 1px 3px rgba(0,0,0,.3); }
.fc-head-sub    { font-size:11px;color:rgba(255,255,255,.78);margin-top:3px;letter-spacing:.3px; }
.fc-head-btns   { display:flex;gap:5px;flex-shrink:0; }
.fc-icon-btn {
    background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);cursor:pointer;
    width:28px;height:28px;border-radius:8px;
    font-size:13px;color:rgba(255,255,255,.85);font-weight:900;
    display:flex;align-items:center;justify-content:center;
    transition:all .15s;flex-shrink:0;
}
.fc-icon-btn:hover { background:rgba(255,255,255,.14);color:#fff;border-color:rgba(255,255,255,.25); }
.fc-body { padding:18px 20px;display:flex;flex-direction:column;gap:13px; }
.fc-card {
    background:var(--fg-bg2);border:1px solid var(--fg-border);
    border-radius:11px;padding:13px 15px;
}
.fc-card-label {
    font-size:10px;font-weight:800;text-transform:uppercase;
    letter-spacing:.9px;color:var(--fg-accent);margin-bottom:8px;
    display:flex;align-items:center;gap:5px;
}
.fc-textarea {
    width:100%;box-sizing:border-box;
    background:var(--fg-bg3);border:1px solid var(--fg-border);border-radius:8px;
    padding:10px 12px;font-size:12px;color:var(--fg-text);
    resize:vertical;font-family:inherit;min-height:100px;outline:none;
    transition:border-color .15s;
}
.fc-textarea:focus { border-color:var(--fg-accent);box-shadow:0 0 0 3px rgba(51,65,85,.1); }
.fc-textarea.error { border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,.1); }
.fc-error-msg {
    display:none;align-items:center;gap:6px;
    margin-top:7px;padding:7px 11px;
    background:#fef2f2;border:1px solid #fecaca;border-radius:7px;
    font-size:11px;font-weight:600;color:#dc2626;
}
.fc-input {
    flex:1;min-width:0;
    background:var(--fg-bg3);border:1px solid var(--fg-border);border-radius:8px;
    padding:9px 12px;font-size:13px;color:var(--fg-text);
    font-family:inherit;outline:none;transition:border-color .15s;
}
.fc-input:focus { border-color:var(--fg-accent);box-shadow:0 0 0 3px rgba(51,65,85,.1); }
input[type="datetime-local"].fc-input { padding:7px 12px; }
.fc-fmt-row   { display:flex;gap:6px;margin-bottom:9px; }
.fc-fmt-btn {
    padding:4px 12px;border-radius:20px;
    border:1px solid var(--fg-border);background:var(--fg-bg3);
    font-size:11px;font-weight:600;color:var(--fg-text2);
    cursor:pointer;transition:all .15s;
}
.fc-fmt-btn:hover { border-color:var(--fg-accent);color:var(--fg-text); }
.fc-fmt-btn.active { background:var(--fg-accent2);border-color:var(--fg-accent2);color:#fff; }
.fc-troop-grid  { display:flex;flex-wrap:wrap;gap:7px; }
.fc-troop-item {
    display:flex;flex-direction:column;align-items:center;gap:3px;
    background:var(--fg-bg3);border:1px solid var(--fg-border);border-radius:9px;
    padding:7px 6px;min-width:44px;transition:border-color .15s;
}
.fc-troop-item:hover { border-color:var(--fg-accent); }
.fc-troop-n {
    width:38px;text-align:center;
    background:var(--fg-bg2);border:1px solid var(--fg-border);border-radius:5px;
    padding:3px 2px;font-size:11px;font-weight:700;color:var(--fg-text);
    outline:none;font-family:inherit;
}
.fc-troop-n:focus { border-color:var(--fg-accent);background:var(--fg-bg3); }
.fc-font-row { display:flex;gap:6px;flex-wrap:wrap; }
.fc-font-btn {
    padding:5px 13px;border-radius:20px;
    border:1px solid var(--fg-border);background:var(--fg-bg3);
    font-size:11px;font-weight:600;color:var(--fg-text2);
    cursor:pointer;transition:all .15s;
}
.fc-font-btn:hover { border-color:var(--fg-accent);color:var(--fg-text); }
.fc-font-btn.active { background:var(--fg-accent2);border-color:var(--fg-accent2);color:#fff; }
.fc-theme-grid { display:flex;flex-wrap:wrap;gap:6px; }
.fc-theme-chip {
    display:flex;align-items:center;gap:6px;padding:5px 10px;border-radius:20px;
    border:1.5px solid var(--fg-border);background:var(--fg-bg3);
    cursor:pointer;transition:all .15s;
}
.fc-theme-chip:hover { border-color:var(--fg-accent); }
.fc-theme-chip.active { border-color:var(--fg-accent) !important;background:var(--fg-bg2); }
.fc-theme-dot { width:12px;height:12px;border-radius:50%;flex-shrink:0; }
.fc-theme-chip-name { font-size:11px;font-weight:600;color:var(--fg-text); }
.fc-btn {
    width:100%;padding:13px;
    background:linear-gradient(135deg,var(--fg-accent) 0%,var(--fg-accent2) 100%);
    border:none;border-radius:11px;cursor:pointer;
    color:#fff;font-size:14px;font-weight:800;
    font-family:inherit;box-shadow:0 4px 16px var(--fg-shadow);transition:all .15s;
}
.fc-btn:hover  { transform:translateY(-1px);box-shadow:0 6px 22px var(--fg-shadow);filter:brightness(1.1); }
.fc-btn:active { transform:translateY(0); }
.fc-footer {
    background:var(--fg-bg2);border-top:1px solid var(--fg-border);
    padding:8px 20px;text-align:center;
    font-size:10px;color:var(--fg-text2);font-style:italic;
}
#fcResBox {
    width:min(1050px,96vw);max-height:92vh;
    display:flex;flex-direction:column;overflow:hidden;
}
.fc-res-body { overflow-y:auto;overflow-x:hidden;max-height:480px; }
.fc-res-body::-webkit-scrollbar { width:6px; }
.fc-res-body::-webkit-scrollbar-track { background:var(--fg-bg2); }
.fc-res-body::-webkit-scrollbar-thumb { background:var(--fg-accent);border-radius:10px; }
.fc-res-body::-webkit-scrollbar-thumb:hover { background:var(--fg-accent2); }
.fc-res-table { width:100%;border-collapse:collapse;table-layout:fixed;border-spacing:0; }
.fc-res-table thead { position:sticky;top:0;z-index:2; }
.fc-res-table thead tr,
.fc-res-table thead tr td,
.fc-res-table thead tr th { background:var(--fg-accent2) !important;border:none !important; }
.fc-res-table thead th {
    padding:11px 16px;font-size:9px;font-weight:800;
    text-transform:uppercase;letter-spacing:.8px;color:rgba(255,255,255,.55) !important;
    text-align:left;border-bottom:2px solid var(--fg-accent) !important;
    background:var(--fg-accent2) !important;
}
.fc-res-table thead th:nth-child(1) { width:36px; }
.fc-res-table thead th:nth-child(2) { width:auto; }
.fc-res-table thead th:nth-child(3) { width:190px; }
.fc-res-table thead th:nth-child(4) { width:40px;text-align:center; }
.fc-res-table thead th:nth-child(5) { width:88px; }
.fc-res-table thead th:nth-child(6) { width:105px; }
.fc-res-table thead th:nth-child(7) { width:140px; }
.fc-res-table thead th:nth-child(8) { width:110px;text-align:right; }
.fc-res-table tbody tr {
    border-bottom:1px solid var(--fg-border);
    transition:background .12s,box-shadow .12s;
}
.fc-res-table tbody tr:last-child { border-bottom:none; }
.fc-res-table tbody tr.fc-target-row:hover { background:var(--fg-bg2);box-shadow:inset 3px 0 0 var(--fg-accent); }
.fc-res-table tbody tr.sent { opacity:.3; }
.fc-res-table td { padding:13px 16px;vertical-align:middle;color:var(--fg-text); }
.fc-group-head td {
    background:var(--fg-bg2);border-top:1px solid var(--fg-border);border-bottom:1px solid var(--fg-border);
    padding:9px 16px;
}
.fc-group-head:first-child td { border-top:none; }
.fc-group-icon { font-size:14px;margin-right:7px;vertical-align:-1px; }
.fc-group-name { font-size:13px;font-weight:800;color:var(--fg-accent2);text-decoration:none; }
.fc-group-name:hover { color:var(--fg-accent);text-decoration:underline; }
.fc-group-count {
    float:right;font-size:10px;font-weight:700;color:var(--fg-accent);
    background:var(--fg-bg3);border:1px solid var(--fg-border);border-radius:20px;padding:2px 10px;
}
.fc-target-row td:nth-child(2) { padding-left:24px; }
.fc-res-num {
    font-size:11px;font-weight:800;color:#fff;
    background:var(--fg-accent2);border-radius:6px;
    padding:3px 8px;display:inline-block;
}
.fc-res-route { display:flex;flex-direction:column;gap:3px;min-width:0; }
.fc-res-src {
    font-size:12px;font-weight:800;color:var(--fg-accent2);
    text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:280px;display:block;
}
.fc-res-src:hover { color:var(--fg-accent);text-decoration:underline; }
.fc-res-arr { color:var(--fg-border);font-size:9px;font-weight:900;line-height:1; }
.fc-res-tgt {
    font-size:12px;font-weight:600;color:var(--fg-text);
    text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:280px;display:block;
}
.fc-res-tgt:hover { color:var(--fg-accent);text-decoration:underline; }
.fc-res-dist-pill {
    display:inline-flex;align-items:center;gap:4px;
    font-size:11px;font-weight:700;color:var(--fg-accent);
    background:var(--fg-bg2);border:1px solid var(--fg-border);
    border-radius:20px;padding:4px 12px;white-space:nowrap;
}
.fc-res-timer-wrap { display:flex;flex-direction:column;gap:2px; }
.fc-res-timer-lbl  { font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:var(--fg-text2); }
.fc-res-timer {
    font-size:20px;font-weight:900;color:var(--fg-accent2);
    font-variant-numeric:tabular-nums;
    font-family:'Courier New',Courier,monospace;letter-spacing:.5px;
}
@keyframes fcPulse { 0%,100%{opacity:1}50%{opacity:.3} }
.fc-res-localtime { font-size:12px;font-weight:600;color:var(--fg-text2);white-space:nowrap; }
.fc-rally-btn {
    padding:8px 16px;border-radius:8px;
    background:linear-gradient(135deg,var(--fg-accent2),var(--fg-accent));
    border:none;cursor:pointer;color:#fff;
    font-size:11px;font-weight:800;font-family:inherit;
    white-space:nowrap;letter-spacing:.2px;
    box-shadow:0 2px 8px var(--fg-shadow);transition:all .15s;
}
.fc-rally-btn:hover { transform:translateY(-1px);box-shadow:0 4px 14px var(--fg-shadow);filter:brightness(1.1); }
.fc-empty-state {
    padding:40px 30px;display:flex;flex-direction:column;align-items:center;
    text-align:center;gap:8px;
}
.fc-empty-icon {
    width:64px;height:64px;border-radius:50%;
    background:var(--fg-bg2);border:1px solid var(--fg-border);
    display:flex;align-items:center;justify-content:center;
    font-size:28px;margin-bottom:4px;
}
.fc-empty-title { font-size:16px;font-weight:800;color:var(--fg-accent2); }
.fc-empty-text  { font-size:12px;color:var(--fg-text2);margin-bottom:6px; }
.fc-empty-hints {
    list-style:none;padding:0;margin:0 0 4px;text-align:left;
    display:flex;flex-direction:column;gap:6px;max-width:340px;
}
.fc-empty-hints li {
    font-size:11px;color:var(--fg-text);padding:8px 12px;
    background:var(--fg-bg2);border:1px solid var(--fg-border);border-radius:8px;
    position:relative;padding-left:28px;
}
.fc-empty-hints li:before {
    content:'›';position:absolute;left:12px;top:50%;transform:translateY(-50%);
    color:var(--fg-accent);font-weight:900;font-size:14px;
}
.fc-empty-hints b { color:var(--fg-accent2); }
#fcLoader {
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,.6);z-index:999999;
    display:flex;align-items:center;justify-content:center;
    font-family:${f};
}
#fcLoader .fcl-box {
    background:var(--fg-bg);border-radius:16px;padding:30px 36px;
    box-shadow:0 20px 50px rgba(0,0,0,.3);text-align:center;min-width:260px;
}
#fcLoader .fcl-spinner {
    width:36px;height:36px;border:3px solid var(--fg-border);
    border-top-color:var(--fg-accent);border-radius:50%;
    animation:fcSpin .7s linear infinite;margin:0 auto 14px;
}
@keyframes fcSpin { to{transform:rotate(360deg);} }
#fcLoader .fcl-title { font-size:14px;font-weight:800;color:var(--fg-accent2);margin-bottom:4px; }
#fcLoader .fcl-sub   { font-size:11px;color:var(--fg-text2);margin-bottom:14px; }
#fcLoader .fcl-bar-wrap { background:var(--fg-bg2);border-radius:20px;height:6px;overflow:hidden; }
#fcLoader .fcl-bar { height:100%;background:linear-gradient(90deg,var(--fg-accent2),var(--fg-accent));border-radius:20px;transition:width .15s; }
#fcLoader .fcl-count { font-size:11px;color:var(--fg-accent);font-weight:700;margin-top:8px; }
#fcHelpBox, #fcSettBox {
    width:420px;max-width:96vw;max-height:88vh;
    display:flex;flex-direction:column;
}
.fc-help-body, .fc-sett-body {
    overflow-y:auto;flex:1;padding:18px 20px;
    display:flex;flex-direction:column;gap:12px;
}
.fc-help-section { display:flex;flex-direction:column;gap:5px; }
.fc-help-title {
    font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;
    color:var(--fg-accent);display:flex;align-items:center;gap:5px;
}
.fc-help-text { font-size:12px;color:var(--fg-text);line-height:1.6; }
.fc-help-sep  { height:1px;background:var(--fg-border);margin:2px 0; }
.fc-res-src { font-size:12px;font-weight:600;color:var(--fg-accent2);text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block; }
.fc-res-src:hover { color:var(--fg-accent);text-decoration:underline; }
.fc-pagination { display:flex;align-items:center;gap:4px;padding:10px 16px;border-top:1px solid var(--fg-border);flex-wrap:wrap; }
.fc-page-btn, .fc-page-num { border:none;border-radius:6px;cursor:pointer;font-family:inherit;background:var(--fg-bg2);color:var(--fg-text);padding:5px 10px;font-size:12px;font-weight:600;transition:all .15s; }
.fc-page-btn:disabled { opacity:.35;cursor:default;pointer-events:none; }
.fc-page-btn:not(:disabled):hover, .fc-page-num:hover { background:var(--fg-accent2);color:#fff; }
.fc-page-num.active { background:var(--fg-accent);color:#fff; }
.fc-page-ellipsis { color:var(--fg-text2);font-size:12px;padding:0 3px; }
.fc-page-info { margin-left:auto;font-size:11px;color:var(--fg-text2);font-weight:600; }
.fc-seg-ctrl { display:flex;border-radius:8px;overflow:hidden;border:1px solid var(--fg-border);margin-top:6px; }
.fc-seg-btn { flex:1;border:none;padding:9px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;background:var(--fg-bg2);color:var(--fg-text2);transition:all .15s; }
.fc-seg-btn.active { background:var(--fg-accent);color:#fff; }
.fc-seg-btn:not(.active):hover { background:var(--fg-border);color:var(--fg-text); }
    `;
}

// ╔══════════════════════════════════════════════════════╗
//  SCREEN DETECTION
// ╚══════════════════════════════════════════════════════╝
var params     = new URL(window.location.href).searchParams;
var gameScreen = params.get('screen');
var gameMode   = params.get('mode');

if (gameScreen === 'place') { handleRallyPage(); return; }

if (gameScreen !== 'overview_villages' || gameMode !== 'combined') {
    window.location.assign(game_data.link_base_pure + 'overview_villages&mode=combined');
    return;
}

// ╔══════════════════════════════════════════════════════╗
//  DATA INIT
// ╚══════════════════════════════════════════════════════╝
var ALL_UNITS = ['spear','sword','axe','archer','spy','light','marcher','heavy','ram','catapult','knight','snob'];
var worldUnits = ALL_UNITS.filter(function(u) {
    var base = ['spear','sword','axe','spy','light','heavy','ram','catapult'];
    if (base.indexOf(u) >= 0) return true;
    return $('[data-unit=' + u + ']').length > 0;
});

var savedTroops = JSON.parse(localStorage.getItem(KEY_TROOPS) || '{"ram":1,"spy":1}');

var coordListOwn = [], testDistances = [], timedFakeList = [];
var savedCoords = '';
var ramSpeedMs;
var unitSpeeds = {};

var unitNames = {
    spear: 'Lancero', sword: 'Espada', axe: 'Hacha', archer: 'Arquero',
    spy: 'Espía', light: 'C. Ligera', marcher: 'Arq. Caballo',
    heavy: 'C. Pesada', ram: 'Ariete', catapult: 'Catapulta',
    knight: 'Paladín', snob: 'Noble'
};

$.get('/interface.php?func=get_unit_info', function(xml) {
    $(xml).find('config').children().each(function(i, u) {
        var name = $(u).prop('nodeName');
        var spd  = parseFloat($(u).find('speed').text());
        if (!isNaN(spd)) unitSpeeds[name] = spd;
    });
    ramSpeedMs = (unitSpeeds.ram || 0) * 60000;
});

var msPerMin = 60000, msPerDay = 86400000, minsPerDay = 1440;
var _srvNow = Date.now() + getFCServerOffset();
var _tmrw   = new Date((Math.floor(_srvNow / msPerDay) + 1) * msPerDay);
var _MN     = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var defDate = _MN[_tmrw.getUTCMonth()] + ' ' + _tmrw.getUTCDate() + ' ' + _tmrw.getUTCFullYear() + ' 00:00:00';
var saved = localStorage.getItem(KEY_DATE);
if (saved && Date.parse(saved) >= Date.parse(defDate)) defDate = saved;
else localStorage.setItem(KEY_DATE, defDate);

// ╔══════════════════════════════════════════════════════╗
//  INJECT CSS
// ╚══════════════════════════════════════════════════════╝
applyFCTheme(getFCCurrentTheme());
$('#fakeCoorCSS').remove();
$('head').append('<style id="fakeCoorCSS">' + buildCSS() + '</style>');

// ╔══════════════════════════════════════════════════════╗
//  BUILD HEADER BUTTONS HTML
// ╚══════════════════════════════════════════════════════╝
function subHeaderHTML(logo, title, subtitle, leftBtnHTML) {
    return '<div class="fc-head">' +
        '<div class="fc-head-brand">' +
            '<div class="fc-head-logo">' + logo + '</div>' +
            '<div class="fc-head-text">' +
                '<div class="fc-head-title">' + title + '</div>' +
                '<div class="fc-head-sub">' + subtitle + '</div>' +
            '</div>' +
        '</div>' +
        '<div class="fc-head-btns">' +
            (leftBtnHTML || '') +
            '<button class="fc-icon-btn fc-close-btn">' + _fcLang.close + '</button>' +
        '</div>' +
    '</div>';
}

function headerHTML(title, subtitle) {
    return '<div class="fc-head">' +
        '<div class="fc-head-brand">' +
            '<div class="fc-head-logo">🏹</div>' +
            '<div class="fc-head-text">' +
                '<div class="fc-head-title">' + title + '</div>' +
                '<div class="fc-head-sub">' + subtitle + '</div>' +
            '</div>' +
        '</div>' +
        '<div class="fc-head-btns">' +
            '<button class="fc-icon-btn" id="fcHelpBtn" title="Ayuda">?</button>' +
            '<button class="fc-icon-btn" id="fcSettBtn" title="Ajustes">⚙️</button>' +
            '<button class="fc-icon-btn fc-close-btn">' + _fcLang.close + '</button>' +
        '</div>' +
    '</div>';
}

// ╔══════════════════════════════════════════════════════╗
//  MODAL 1 — MAIN
// ╚══════════════════════════════════════════════════════╝
function timeInputHTML() {
    var fmtBtns = '<div class="fc-fmt-row">' +
        '<button class="fc-fmt-btn' + (timeFmt==='text'   ? ' active' : '') + '" data-fmt="text">'   + _fcLang.fmtText   + '</button>' +
        '<button class="fc-fmt-btn' + (timeFmt==='picker' ? ' active' : '') + '" data-fmt="picker">' + _fcLang.fmtPicker + '</button>' +
    '</div>';
    var inp = timeFmt === 'picker'
        ? '<input class="fc-input" id="fcTime" type="datetime-local" value="' + toDatetimeLocal(defDate) + '">'
        : '<input class="fc-input" id="fcTime" type="text" value="' + defDate + '" placeholder="May 30 2026 00:00:00">';
    return fmtBtns + inp;
}

$('.fc-overlay#fcMainOverlay').remove();
$('body').append(
    '<div class="fc-overlay" id="fcMainOverlay">' +
    '<div class="fc-box" style="width:460px;max-width:96vw;max-height:90vh;overflow-y:auto;">' +
    headerHTML(_fcLang.title, _fcLang.subtitle) +
    '<div class="fc-body">' +
        '<div class="fc-card">' +
            '<div class="fc-card-label">🎯 ' + _fcLang.targetLabel + '</div>' +
            '<textarea class="fc-textarea" id="fcCoords" placeholder="' + _fcLang.targetPH + '"></textarea>' +
            '<div class="fc-error-msg" id="fcCoordsErr">⚠️ Introduce al menos una coordenada objetivo.</div>' +
        '</div>' +
        '<div class="fc-card">' +
            '<div class="fc-card-label">⏰ ' + _fcLang.hitLabel + '</div>' +
            '<div id="fcTimeWrap">' + timeInputHTML() + '</div>' +
        '</div>' +
        '<button class="fc-btn" id="fcCalc">⚡ ' + _fcLang.calcBtn + '</button>' +
    '</div>' +
    '<div class="fc-footer">💚 Creado por <strong style="font-style:normal;">rabagalan73</strong> para la reina <strong style="font-style:normal;">M0bscene</strong> 💚</div>' +
    '</div></div>'
);

// ╔══════════════════════════════════════════════════════╗
//  EVENTS — MODAL 1
// ╚══════════════════════════════════════════════════════╝
fcOverlayClose('#fcMainOverlay');
$('#fcMainOverlay').on('click', '.fc-close-btn', function() { $('#fcMainOverlay').remove(); });

$('#fcMainOverlay').on('click', '.fc-fmt-btn', function() {
    timeFmt = $(this).data('fmt');
    localStorage.setItem(KEY_FMT, timeFmt);
    var cur = $('#fcTime').val();
    $('.fc-fmt-btn').removeClass('active'); $(this).addClass('active');
    if (timeFmt === 'picker') {
        $('#fcTime').replaceWith('<input class="fc-input" id="fcTime" type="datetime-local" value="' + toDatetimeLocal(cur) + '">');
    } else {
        var d = new Date(cur);
        var txt = isNaN(d) ? defDate : d.toString().replace(/\w+\s*/i,'').replace(/(\d*:\d*:\d*)(.*)/i,'$1');
        $('#fcTime').replaceWith('<input class="fc-input" id="fcTime" type="text" value="' + txt + '" placeholder="May 30 2026 00:00:00">');
    }
});

$('#fcMainOverlay').on('click', '#fcHelpBtn', function(e) {
    e.stopPropagation(); openHelp();
});
$('#fcMainOverlay').on('click', '#fcSettBtn', function(e) {
    e.stopPropagation(); openSettings();
});

$('#fcCalc').on('click', function() {
    var troops = JSON.parse(localStorage.getItem(KEY_TROOPS) || '{"ram":1,"spy":1}');
    var time   = $('#fcTime').val();
    localStorage.setItem(KEY_DATE, time);
    runCalculation(time, troops);
});

// ╔══════════════════════════════════════════════════════╗
//  MODAL — HELP
// ╚══════════════════════════════════════════════════════╝
function openHelp() {
    $('#fcHelpOverlay').remove();
    var sections = [
        ['🎯 Pueblos Objetivo', 'Introduce las coordenadas de los pueblos a atacar (formato 500|500). No hace falta limpiarlas: puedes pegar un reporte, una lista numerada o un texto entero — el script detecta las coordenadas automáticamente.'],
        ['⏰ Hora de Impacto', 'La hora a la que quieres que lleguen los fakes. Puedes escribirla como texto (May 30 2026 00:00:00) o activar el Selector para usar el calendario del navegador.'],
        ['🔧 Ajustes — Tropas', 'Define qué tropas y cuántas se enviarán en cada fake. Se rellenan automáticamente al pulsar "Ir a Plaza". La unidad más lenta de las configuradas se usa como referencia para calcular los tiempos.'],
        ['🔧 Ajustes — Tipografía', 'Cambia la fuente de toda la interfaz del script. La preferencia se guarda automáticamente.'],
        ['⚡ Calcular', 'Recorre todos tus pueblos, calcula la distancia a cada objetivo según la velocidad de la unidad de referencia (la más lenta configurada) y determina a qué hora lanzar cada ataque para que llegue exactamente a la hora de impacto. Solo muestra pueblos que tengan esa unidad.'],
        ['🏹 Ir a Plaza', 'Abre la plaza de reuniones del pueblo origen apuntando al objetivo, rellena las tropas configuradas y muestra una tarjeta con la cuenta atrás de lanzamiento (sincronizada con el reloj del servidor). La tarjeta se mantiene al confirmar el ataque.'],
    ];
    var html = sections.map(function(s) {
        return '<div class="fc-help-section"><div class="fc-help-title">' + s[0] + '</div><div class="fc-help-text">' + s[1] + '</div></div><div class="fc-help-sep"></div>';
    }).join('');

    $('body').append(
        '<div class="fc-overlay" id="fcHelpOverlay">' +
        '<div class="fc-box" id="fcHelpBox">' +
        subHeaderHTML('?', _fcLang.helpTitle, _fcLang.helpSub) +
        '<div class="fc-help-body">' + html + '</div>' +
        '<div class="fc-footer">💚 Creado por <strong style="font-style:normal;">rabagalan73</strong> para la reina <strong style="font-style:normal;">M0bscene</strong> 💚</div>' +
        '</div></div>'
    );
    fcOverlayClose('#fcHelpOverlay');
    $('#fcHelpOverlay').on('click', '.fc-close-btn', function() { $('#fcHelpOverlay').remove(); });
}

// ╔══════════════════════════════════════════════════════╗
//  MODAL — SETTINGS
// ╚══════════════════════════════════════════════════════╝
function openSettings() {
    $('#fcSettOverlay').remove();
    var st      = JSON.parse(localStorage.getItem(KEY_TROOPS) || '{"ram":1,"spy":1}');
    var allMode = localStorage.getItem(KEY_ALL_UNITS) === '1';

    var troopCards = worldUnits.map(function(u) {
        var v = st[u] || 0;
        return '<div class="fc-troop-item">' +
            '<img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_' + u + '.png" style="width:16px;height:16px;image-rendering:auto;" title="' + u + '">' +
            '<input class="fc-troop-n" id="fcs_' + u + '" type="number" min="0" value="' + v + '">' +
        '</div>';
    }).join('');

    var fontBtns = Object.keys(fonts).map(function(k) {
        return '<button class="fc-font-btn' + (k===currentFont?' active':'') + '" data-font="' + k + '" style="font-family:' + fonts[k].css + '">' + fonts[k].label + '</button>';
    }).join('');

    var currentTheme = getFCCurrentTheme();
    var themeChips = Object.keys(FC_THEMES).map(function(k) {
        var t = FC_THEMES[k];
        var active = (k === currentTheme) ? ' active' : '';
        return '<div class="fc-theme-chip' + active + '" data-fc-theme="' + k + '">' +
            '<span class="fc-theme-dot" style="background:' + t['--fg-accent'] + ';"></span>' +
            '<span class="fc-theme-chip-name">' + t.name + '</span>' +
        '</div>';
    }).join('');

    $('body').append(
        '<div class="fc-overlay" id="fcSettOverlay">' +
        '<div class="fc-box" id="fcSettBox">' +
        subHeaderHTML('⚙️', _fcLang.settTitle, _fcLang.settSub) +
        '<div class="fc-sett-body">' +
            '<div class="fc-card">' +
                '<div class="fc-card-label">🎨 Tema visual</div>' +
                '<div class="fc-theme-grid" id="fcsTheme">' + themeChips + '</div>' +
            '</div>' +
            '<div class="fc-card">' +
                '<div class="fc-card-label">🔤 ' + _fcLang.fontLabel + '</div>' +
                '<div class="fc-font-row" id="fcsFont">' + fontBtns + '</div>' +
            '</div>' +
            '<div class="fc-card">' +
                '<div class="fc-card-label">⚡ Modo de cálculo</div>' +
                '<div class="fc-seg-ctrl" id="fcsMode">' +
                    '<button class="fc-seg-btn' + (!allMode ? ' active' : '') + '" data-mode="custom">🎯 Personalizado</button>' +
                    '<button class="fc-seg-btn' + ( allMode ? ' active' : '') + '" data-mode="all">🌐 Cualquiera</button>' +
                '</div>' +
            '</div>' +
            '<div class="fc-card" id="fcsTroopCard" style="' + (allMode ? 'opacity:.45;pointer-events:none;' : '') + '">' +
                '<div class="fc-card-label"><span class="icon header lc"> </span>&nbsp;' + _fcLang.troopsLabel + '</div>' +
                '<div class="fc-troop-grid">' + troopCards + '</div>' +
            '</div>' +
            '<button class="fc-btn" id="fcSettSave">✅ ' + _fcLang.save + '</button>' +
        '</div>' +
        '<div class="fc-footer">💚 Creado por <strong style="font-style:normal;">rabagalan73</strong> para la reina <strong style="font-style:normal;">M0bscene</strong> 💚</div>' +
        '</div></div>'
    );

    fcOverlayClose('#fcSettOverlay');
    $('#fcSettOverlay').on('click', '.fc-close-btn', function() { $('#fcSettOverlay').remove(); });

    $('#fcSettOverlay').on('click', '#fcsMode .fc-seg-btn', function() {
        $('#fcsMode .fc-seg-btn').removeClass('active');
        $(this).addClass('active');
        var isAll = $(this).data('mode') === 'all';
        $('#fcsTroopCard').css({ opacity: isAll ? '.45' : '1', pointerEvents: isAll ? 'none' : 'auto' });
    });

    $('#fcSettOverlay').on('click', '.fc-theme-chip', function() {
        var name = $(this).data('fc-theme');
        applyFCTheme(name);
        $('.fc-theme-chip').removeClass('active');
        $(this).addClass('active');
    });

    $('#fcSettOverlay').on('click', '.fc-font-btn', function() {
        currentFont = $(this).data('font');
        localStorage.setItem(KEY_FONT, currentFont);
        $('.fc-font-btn').removeClass('active'); $(this).addClass('active');
        $('#fakeCoorCSS').text(buildCSS());
        $('.fc-overlay').css('font-family', fontCSS());
        $('#fcRallyCard').css('font-family', fontCSS());
    });

    $('#fcSettSave').on('click', function() {
        var isAll = $('#fcsMode .fc-seg-btn.active').data('mode') === 'all';
        localStorage.setItem(KEY_ALL_UNITS, isAll ? '1' : '0');
        var troops = {};
        worldUnits.forEach(function(u) { troops[u] = parseInt($('#fcs_' + u).val()) || 0; });
        localStorage.setItem(KEY_TROOPS, JSON.stringify(troops));
        $('#fcSettOverlay').remove();
    });
}

// ╔══════════════════════════════════════════════════════╗
//  CALCULATION
// ╚══════════════════════════════════════════════════════╝
function grabVillages() {
    coordListOwn.length = 0;
    for (var i = 1; i < $('#combined_table tr').length; i++) {
        var row = $('#combined_table tr')[i];
        var id  = $(row.children[1].children[0]).attr('data-id');
        var txt = row.children[1].innerText || '';
        var cm  = txt.match(/(\d+\|\d+)/);
        if (!cm) continue;
        var nameMatch = txt.replace(cm[0], '')
                           .replace(/\(\s*\)/g, '')
                           .replace(/\s+/g, ' ')
                           .trim();
        var units = {};
        for (var j = 0; j < game_data.units.length; j++)
            units[game_data.units[j]] = parseInt(row.children[8+j].innerText) || 0;
        coordListOwn.push({ ID: id, Coord: cm[0], Name: nameMatch, Units: units });
    }
}

function runCalculation(timeStr, troops) {
    testDistances.length = 0; timedFakeList.length = 0;
    savedCoords = $('#fcCoords').val();
    grabVillages();
    var targets = savedCoords.match(/\d+\|\d+/g);
    if (!targets || !targets.length) {
        $('#fcCoords').addClass('error');
        $('#fcCoordsErr').css('display','flex');
        $('#fcCoords').one('input', function() { $(this).removeClass('error'); $('#fcCoordsErr').hide(); });
        return;
    }
    $('#fcCoords').removeClass('error'); $('#fcCoordsErr').hide();

    var landTime = fromInput(timeStr);
    if (!landTime) { $('#fcTime').css({'border-color':'#ef4444','box-shadow':'0 0 0 3px rgba(239,68,68,.1)'}); return; }

    if (!unitSpeeds || Object.keys(unitSpeeds).length === 0) {
        $('#fcTime').css({'border-color':'','box-shadow':''});
        alert('Cargando velocidades de unidades, espera un momento y vuelve a intentarlo.');
        return;
    }

    var allUnitsMode    = localStorage.getItem(KEY_ALL_UNITS) === '1';
    var configuredUnits = Object.keys(troops).filter(function(u) { return troops[u] > 0 && unitSpeeds[u]; });
    var refUnit, refSpeedMs = 0;

    if (!allUnitsMode) {
        if (configuredUnits.length > 0) {
            configuredUnits.forEach(function(u) {
                var spd = unitSpeeds[u] * 60000;
                if (spd > refSpeedMs) { refSpeedMs = spd; refUnit = u; }
            });
        } else {
            refUnit    = unitSpeeds.ram ? 'ram' : 'catapult';
            refSpeedMs = (unitSpeeds[refUnit] || 0) * 60000;
        }
        if (!refSpeedMs) { alert('No se pudo determinar la velocidad de la unidad de referencia.'); return; }
    }

    var serverNow = Date.now();

    for (var i = 0; i < coordListOwn.length; i++)
        for (var j = 0; j < targets.length; j++)
            testDistances.push({ source: coordListOwn[i], target: targets[j], distance: calcDist(targets[j], coordListOwn[i].Coord) });

    testDistances.sort(function(a,b) { return a.distance - b.distance; });

    if (allUnitsMode) {
        // Build unique-speed map (one representative unit per distinct speed)
        var speedMap = {};
        worldUnits.forEach(function(u) {
            if (!unitSpeeds[u]) return;
            var spd = unitSpeeds[u] * 60000;
            if (!speedMap[spd]) speedMap[spd] = u;
        });
        var speedKeys = Object.keys(speedMap);
        for (var i = 0; i < testDistances.length; i++) {
            var td = testDistances[i];
            for (var si = 0; si < speedKeys.length; si++) {
                var spd = parseFloat(speedKeys[si]);
                var ru  = speedMap[speedKeys[si]];
                // Check if this village has any unit belonging to this speed group
                var hasAny = false;
                for (var wi = 0; wi < worldUnits.length; wi++) {
                    var wu = worldUnits[wi];
                    if (unitSpeeds[wu] && Math.abs(unitSpeeds[wu] * 60000 - spd) < 0.01 && (td.source.Units[wu] || 0) > 0) { hasAny = true; break; }
                }
                if (!hasAny) continue;
                var lt  = +landTime - td.distance * spd;
                var ttl = lt - serverNow;
                if (ttl > 0)
                    timedFakeList.push({ source: td.source, target: td.target, distance: td.distance, ttl: ttl, launchTime: lt, troops: {}, refUnit: ru });
            }
        }
    } else {
        for (var i = 0; i < testDistances.length; i++) {
            var td = testDistances[i];
            var hasUnit = configuredUnits.length > 0
                ? (td.source.Units[refUnit] || 0) >= (troops[refUnit] || 1)
                : (td.source.Units.ram > 0 || td.source.Units.catapult > 0);
            if (hasUnit) {
                var lt  = +landTime - td.distance * refSpeedMs;
                var ttl = lt - serverNow;
                if (ttl > 0)
                    timedFakeList.push({ source: td.source, target: td.target, distance: td.distance, ttl: ttl, launchTime: lt, troops: troops, refUnit: refUnit });
            }
        }
    }
    timedFakeList.sort(function(a,b) { return a.ttl - b.ttl; });

    var uniqueTargets = timedFakeList.reduce(function(acc, item) {
        if (acc.indexOf(item.target) === -1) acc.push(item.target);
        return acc;
    }, []);
    var targetIdMap   = {};
    var targetNameMap = {};
    if (uniqueTargets.length === 0) { showResults(); return; }

    var total = uniqueTargets.length;
    var done  = 0;
    $('#fcLoader').remove();
    $('body').append(
        '<div id="fcLoader"><div class="fcl-box">' +
        '<div class="fcl-spinner"></div>' +
        '<div class="fcl-title">Resolviendo pueblos...</div>' +
        '<div class="fcl-sub">Consultando ' + total + ' coordenadas · ' + (allUnitsMode ? '🌐 <strong>Todas las unidades</strong>' : 'Ref: <img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_' + refUnit + '.png" style="width:13px;height:13px;vertical-align:-2px;margin:0 2px;"><strong>' + (unitNames[refUnit] || refUnit) + '</strong>') + '</div>' +
        '<div class="fcl-bar-wrap"><div class="fcl-bar" id="fclBar" style="width:0%"></div></div>' +
        '<div class="fcl-count" id="fclCount">0 / ' + total + '</div>' +
        '</div></div>'
    );

    var queue = uniqueTargets.slice();
    function processNext() {
        if (queue.length === 0) {
            $('#fcLoader').remove();
            showResults(targetIdMap, targetNameMap);
            return;
        }
        var coords = queue.shift();
        var tx = coords.match(/(\d+)\|(\d+)/);
        $.get('/game.php?village=' + game_data.village.id + '&screen=api&ajax=target_selection&input=' + tx[1] + '|' + tx[2] + '&type=coord&request_id=1&limit=5&offset=0')
            .done(function(data) {
                if (data.villages && data.villages.length) {
                    targetIdMap[coords]   = data.villages[0].id;
                    targetNameMap[coords] = data.villages[0].name || '';
                }
            })
            .always(function() {
                done++;
                var pct = Math.round(done / total * 100);
                $('#fclBar').css('width', pct + '%');
                $('#fclCount').text(done + ' / ' + total);
                setTimeout(processNext, 120);
            });
    }
    processNext();
}

// ╔══════════════════════════════════════════════════════╗
//  MODAL 2 — RESULTS
// ╚══════════════════════════════════════════════════════╝
function showResults(targetIdMap, targetNameMap) {
    targetIdMap   = targetIdMap   || {};
    targetNameMap = targetNameMap || {};
    $('#fcMainOverlay, #fcResOverlay').remove();

    var PAGE_SIZE = 20;
    var _fcPage   = 0;
    var total     = timedFakeList.length;
    var pageCount = Math.ceil(total / PAGE_SIZE) || 1;

    function buildRows(page) {
        if (!total) return '';
        var html  = '';
        var sOff  = getFCServerOffset();
        var nowMs = Date.now();
        var start = page * PAGE_SIZE;
        var end   = Math.min(start + PAGE_SIZE, total);
        for (var i = start; i < end; i++) {
            var item = timedFakeList[i];
            var src  = item.source;
            var srcLabel = src.Name ? src.Name + ' (' + src.Coord + ')' : src.Coord;
            var srcHTML  = '<a class="fc-res-src" href="/game.php?screen=info_village&id=' + src.ID + '" target="_blank">' + srcLabel + '</a>';
            var tx       = item.target.match(/(\d+)\|(\d+)/);
            var tgtHTML  = targetIdMap[item.target]
                ? '<a class="fc-res-tgt" href="/game.php?screen=info_village&id=' + targetIdMap[item.target] + '" target="_blank">' + (targetNameMap[item.target] ? targetNameMap[item.target] + ' (' + item.target + ')' : item.target) + '</a>'
                : '<span class="fc-res-tgt">' + (targetNameMap[item.target] ? targetNameMap[item.target] + ' (' + item.target + ')' : item.target) + '</span>';
            var unitIcon = '<img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_' + item.refUnit + '.png" style="width:16px;height:16px;vertical-align:-3px;" title="' + (unitNames[item.refUnit] || item.refUnit) + '">';
            var _ldS     = new Date(item.launchTime + sOff);
            var _nowS    = new Date(nowMs + sOff);
            var _sameDay = _ldS.getUTCFullYear() === _nowS.getUTCFullYear() && _ldS.getUTCMonth() === _nowS.getUTCMonth() && _ldS.getUTCDate() === _nowS.getUTCDate();
            var _ldT     = pad(_ldS.getUTCHours()) + ':' + pad(_ldS.getUTCMinutes()) + ':' + pad(_ldS.getUTCSeconds());
            var timeStr  = _sameDay ? 'Hoy ' + _ldT : pad(_ldS.getUTCDate()) + '/' + pad(_ldS.getUTCMonth()+1) + ' ' + _ldT;
            var ms       = item.launchTime - nowMs;
            var timerCol = ms < 30000 ? '#ef4444' : ms < 1800000 ? '#d97706' : '';
            html +=
                '<tr id="fcCard_' + i + '" class="fc-target-row">' +
                '<td><span class="fc-res-num">' + (i+1) + '</span></td>' +
                '<td><div class="fc-res-route">' + srcHTML + '</div></td>' +
                '<td><div class="fc-res-route">' + tgtHTML + '</div></td>' +
                '<td style="text-align:center">' + unitIcon + '</td>' +
                '<td><span class="fc-res-dist-pill">📏 ' + Math.round(item.distance) + '</span></td>' +
                '<td><div class="fc-res-timer timer" id="fcTimer_' + i + '" style="color:' + timerCol + '">' + (ms > 0 ? msToHMS(ms) : '¡YA!') + '</div></td>' +
                '<td><span class="fc-res-localtime">🕐 ' + timeStr + '</span></td>' +
                '<td style="text-align:right"><button class="fc-rally-btn" onclick="fcGoRally(' + i + ',' + src.ID + ',' + tx[1] + ',' + tx[2] + ')">🏹 ' + _fcLang.rallyBtn + '</button></td>' +
                '</tr>';
        }
        return html;
    }

    function buildPager(page) {
        if (pageCount <= 1) return '';
        var prev = '<button class="fc-page-btn" id="fcPagePrev"' + (page > 0 ? '' : ' disabled') + '>‹ Ant</button>';
        var next = '<button class="fc-page-btn" id="fcPageNext"' + (page < pageCount-1 ? '' : ' disabled') + '>Sig ›</button>';
        var nums = '';
        for (var p = 0; p < pageCount; p++) {
            if (p === 0 || p === pageCount-1 || (p >= page-2 && p <= page+2)) {
                nums += '<button class="fc-page-num' + (p===page?' active':'') + '" data-p="' + p + '">' + (p+1) + '</button>';
            } else if (p === page-3 || p === page+3) {
                nums += '<span class="fc-page-ellipsis">…</span>';
            }
        }
        var showing = (page*PAGE_SIZE+1) + '–' + Math.min((page+1)*PAGE_SIZE, total);
        return '<div class="fc-pagination">' + prev + nums + next + '<span class="fc-page-info">' + showing + ' / ' + total + '</span></div>';
    }

    function renderPage(page) {
        _fcPage = page;
        document.getElementById('fcResBody').innerHTML = buildRows(page);
        document.getElementById('fcResPager').innerHTML = buildPager(page);
    }

    var allMode  = localStorage.getItem(KEY_ALL_UNITS) === '1';
    var subTitle = _fcLang.resSub.replace('{n}', total);
    if (!allMode && total && timedFakeList[0].refUnit) {
        var ru = timedFakeList[0].refUnit;
        subTitle += ' · <img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_' + ru + '.png" style="width:13px;height:13px;vertical-align:-2px;margin:0 2px;"> ' + (unitNames[ru] || ru);
    } else if (allMode && total) {
        subTitle += ' · 🌐 Todas las unidades';
    }

    $('body').append(
        '<div class="fc-overlay" id="fcResOverlay">' +
        '<div class="fc-box" id="fcResBox">' +
        subHeaderHTML('🏹', _fcLang.resTitle, subTitle, '<button class="fc-icon-btn" id="fcResBack" title="' + _fcLang.back + '">←</button>') +
        '<div class="fc-res-body">' +
            (!total
            ? '<div class="fc-empty-state">' +
                '<div class="fc-empty-icon">🔍</div>' +
                '<div class="fc-empty-title">Sin lanzamientos</div>' +
                '<div class="fc-empty-text">No se encontraron pueblos que cumplan las condiciones.</div>' +
                '<ul class="fc-empty-hints">' +
                    '<li>Revisa que las <b>coordenadas</b> sean correctas.</li>' +
                    '<li>Comprueba que la <b>hora de impacto</b> dé tiempo a llegar.</li>' +
                    '<li>Asegúrate de tener la <b>unidad configurada</b> en tus pueblos.</li>' +
                '</ul>' +
                '<button class="fc-btn" id="fcEmptyBack" style="max-width:200px;margin-top:6px;">← Volver</button>' +
              '</div>'
            : '<table class="fc-res-table">' +
                '<thead><tr>' +
                    '<th>#</th>' +
                    '<th>' + _fcLang.source + '</th>' +
                    '<th>' + _fcLang.target + '</th>' +
                    '<th></th>' +
                    '<th>' + _fcLang.dist + '</th>' +
                    '<th>' + _fcLang.launchIn + '</th>' +
                    '<th>' + _fcLang.launchAt + '</th>' +
                    '<th></th>' +
                '</tr></thead>' +
                '<tbody id="fcResBody"></tbody>' +
              '</table>') +
        '</div>' +
        '<div id="fcResPager"></div>' +
        '<div class="fc-footer">💚 Creado por <strong style="font-style:normal;">rabagalan73</strong> para la reina <strong style="font-style:normal;">M0bscene</strong> 💚</div>' +
        '</div></div>'
    );

    if (total) renderPage(0);

    fcOverlayClose('#fcResOverlay');
    $('#fcResOverlay').on('click', '.fc-close-btn', function() { clearInterval(_resTimer); $('#fcResOverlay').remove(); });
    $('#fcResBack').on('click', function() { clearInterval(_resTimer); $('#fcResOverlay').remove(); openMain(); });
    $('#fcEmptyBack').on('click', function() { $('#fcResOverlay').remove(); openMain(); });
    $('#fcResOverlay').on('click', '#fcPagePrev', function() { if (_fcPage > 0) renderPage(_fcPage - 1); });
    $('#fcResOverlay').on('click', '#fcPageNext', function() { if (_fcPage < pageCount-1) renderPage(_fcPage + 1); });
    $('#fcResOverlay').on('click', '.fc-page-num', function() { renderPage(parseInt($(this).data('p'))); });

    var _resTimer = setInterval(function() {
        if (!$('#fcResOverlay').length) { clearInterval(_resTimer); return; }
        for (var i = 0; i < timedFakeList.length; i++) {
            var el = document.getElementById('fcTimer_' + i);
            if (!el) continue;
            var ms = timedFakeList[i].launchTime - Date.now();
            if (ms <= 0) {
                el.textContent = '¡YA!';
                el.style.color = '#ef4444';
                el.style.animation = 'fcPulse 1s infinite';
                var row = document.getElementById('fcCard_' + i);
                if (row && !row.dataset.fading) {
                    row.dataset.fading = '1';
                    setTimeout(function(r) {
                        $(r).css({ transition: 'opacity 1s, max-height 0.6s', opacity: '0', maxHeight: r.offsetHeight + 'px' });
                        setTimeout(function() {
                            $(r).css({ maxHeight: '0', padding: '0', borderBottom: 'none', overflow: 'hidden' });
                            setTimeout(function() { $(r).remove(); }, 650);
                        }, 1000);
                    }, 10000, row);
                }
            } else {
                el.textContent = msToHMS(ms);
                el.style.color = ms < 1800000 ? (ms < 600000 ? '#ef4444' : '#d97706') : '';
            }
        }
    }, 1000);
}

function openMain() {
    $('#fcMainOverlay').remove();
    $('body').append(
        '<div class="fc-overlay" id="fcMainOverlay">' +
        '<div class="fc-box" style="width:460px;max-width:96vw;max-height:90vh;overflow-y:auto;">' +
        headerHTML(_fcLang.title, _fcLang.subtitle) +
        '<div class="fc-body">' +
            '<div class="fc-card">' +
                '<div class="fc-card-label">🎯 ' + _fcLang.targetLabel + '</div>' +
                '<textarea class="fc-textarea" id="fcCoords" placeholder="' + _fcLang.targetPH + '">' + (savedCoords || '') + '</textarea>' +
                '<div class="fc-error-msg" id="fcCoordsErr">⚠️ Introduce al menos una coordenada objetivo.</div>' +
            '</div>' +
            '<div class="fc-card">' +
                '<div class="fc-card-label">⏰ ' + _fcLang.hitLabel + '</div>' +
                '<div id="fcTimeWrap">' + timeInputHTML() + '</div>' +
            '</div>' +
            '<button class="fc-btn" id="fcCalc">⚡ ' + _fcLang.calcBtn + '</button>' +
        '</div>' +
        '<div class="fc-footer">💚 Creado por <strong style="font-style:normal;">rabagalan73</strong> para la reina <strong style="font-style:normal;">M0bscene</strong> 💚</div>' +
        '</div></div>'
    );
    fcOverlayClose('#fcMainOverlay');
    $('#fcMainOverlay').on('click', '.fc-close-btn', function() { $('#fcMainOverlay').remove(); });
    $('#fcMainOverlay').on('click', '.fc-fmt-btn', function() {
        timeFmt = $(this).data('fmt');
        localStorage.setItem(KEY_FMT, timeFmt);
        var cur = $('#fcTime').val();
        $('.fc-fmt-btn').removeClass('active'); $(this).addClass('active');
        if (timeFmt === 'picker') {
            $('#fcTime').replaceWith('<input class="fc-input" id="fcTime" type="datetime-local" value="' + toDatetimeLocal(cur) + '">');
        } else {
            var _fmtEp = /^\d{4}-\d{2}-\d{2}T/.test(cur) ? Date.parse(cur + 'Z') : Date.parse(cur + ' UTC');
            var _fmtD  = isNaN(_fmtEp) ? null : new Date(_fmtEp);
            var _MNF   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var txt    = _fmtD ? _MNF[_fmtD.getUTCMonth()] + ' ' + _fmtD.getUTCDate() + ' ' + _fmtD.getUTCFullYear() + ' ' + pad(_fmtD.getUTCHours()) + ':' + pad(_fmtD.getUTCMinutes()) + ':' + pad(_fmtD.getUTCSeconds()) : defDate;
            $('#fcTime').replaceWith('<input class="fc-input" id="fcTime" type="text" value="' + txt + '" placeholder="May 30 2026 00:00:00">');
        }
    });
    $('#fcMainOverlay').on('click', '#fcHelpBtn', function(e) { e.stopPropagation(); openHelp(); });
    $('#fcMainOverlay').on('click', '#fcSettBtn', function(e) { e.stopPropagation(); openSettings(); });
    $('#fcCalc').on('click', function() {
        var troops = JSON.parse(localStorage.getItem(KEY_TROOPS) || '{"ram":1,"spy":1}');
        var time   = $('#fcTime').val();
        localStorage.setItem(KEY_DATE, time);
        runCalculation(time, troops);
    });
}

// ╔══════════════════════════════════════════════════════╗
//  OPEN RALLY
// ╚══════════════════════════════════════════════════════╝
window.fcGoRally = function(idx, sourceID, x, y) {
    var item = timedFakeList[idx];
    var troops = item.troops || {};
    var pendingData = {
        sourceID:   sourceID,
        target:     item.target,
        launchTime: item.launchTime,
        distance:   Math.round(item.distance),
        troops:     troops,
    };
    pendingData.openedAt = Date.now();
    localStorage.setItem(KEY_PENDING, JSON.stringify(pendingData));

    $.get('/game.php?village='+sourceID+'&screen=api&ajax=target_selection&input='+x+'|'+y+'&type=coord&request_id=1&limit=5&offset=0')
        .done(function(data) {
            if (!data.villages || !data.villages.length) {
                alert('No se encontró el pueblo objetivo (' + x + '|' + y + ').');
                return;
            }
            $('#fcCard_' + idx).addClass('sent');
            var newWin = window.open('/game.php?village='+sourceID+'&screen=place&target='+data.villages[0].id);
            if (!newWin) { alert('El navegador bloqueó la ventana emergente. Permite los pop-ups para este sitio.'); return; }

            var targetID   = data.villages[0].id;
            var targetName = data.villages[0].name || '';
            pendingData.targetID   = targetID;
            pendingData.targetName = targetName;
            localStorage.setItem(KEY_PENDING, JSON.stringify(pendingData));

            function isPlaza(url)   { return url.indexOf('screen=place') >= 0 && url.indexOf('try=confirm') < 0; }
            function isConfirm(url) { return url.indexOf('screen=place') >= 0 && url.indexOf('try=confirm') >= 0; }

            function setupWindow() {
                try {
                    if (newWin.document.readyState !== 'complete') return;
                    var nw$ = newWin.$;
                    if (!nw$) return;
                    if (newWin.document.querySelector('input.unitsInput')) {
                        Object.keys(troops).forEach(function(u) {
                            if (troops[u] > 0)
                                nw$('input.unitsInput[name="' + u + '"]').val(troops[u]).trigger('change');
                        });
                    }
                    injectRallyCardInWindow(newWin, pendingData);
                } catch(e) {}
            }

            var flowState = 'plaza';
            var lastDoc = null;

            var watchdog = setInterval(function() {
                try {
                    if (newWin.closed) { clearInterval(watchdog); return; }
                    var url = newWin.location.href;
                    var doc = newWin.document;
                    if (doc !== lastDoc) {
                        var prevState = flowState;
                        if (prevState === 'confirm') {
                            flowState = 'done';
                        } else if (isConfirm(url)) {
                            flowState = 'confirm';
                            newWin.fcRallyClosed = false;
                        } else if (!isPlaza(url)) {
                            flowState = 'done';
                        }
                        if (flowState === 'done') { clearInterval(watchdog); localStorage.removeItem(KEY_PENDING); return; }
                        lastDoc = doc;
                    }
                    if (!newWin.fcRallyClosed &&
                        !doc.getElementById('fcRallyCard') &&
                        doc.readyState === 'complete' && newWin.$) {
                        setupWindow();
                    }
                } catch(e) { clearInterval(watchdog); }
            }, 600);

            newWin.addEventListener('load', setupWindow);
        });
};

// ╔══════════════════════════════════════════════════════╗
//  RALLY PAGE HANDLER
// ╚══════════════════════════════════════════════════════╝
function getServerOffset(winDoc) {
    try {
        var timeEl = winDoc.getElementById('serverTime');
        var dateEl = winDoc.getElementById('serverDate');
        if (!timeEl || !dateEl) return 0;
        var t = timeEl.textContent.trim();
        var d = dateEl.textContent.trim().match(/(\d+)\/(\d+)\/(\d+)/);
        if (!d) return 0;
        var serverMs = Date.parse(d[3] + '-' + d[2] + '-' + d[1] + 'T' + t + 'Z');
        return serverMs - Date.now();
    } catch(e) { return 0; }
}

function injectRallyCardInWindow(win, data) {
    var cf  = localStorage.getItem(KEY_FONT) || 'mono';
    var fnt = fonts[cf] ? fonts[cf].css : fonts.mono.css;
    var serverOffset = getServerOffset(win.document);
    var ms  = data.launchTime - Date.now();
    var _ldS = new Date(data.launchTime + serverOffset);
    var _launchStr = pad(_ldS.getUTCHours()) + ':' + pad(_ldS.getUTCMinutes()) + ':' + pad(_ldS.getUTCSeconds());

    // Inject theme vars into the rally window
    var themeName = localStorage.getItem(KEY_THEME) || 'emerald';
    var th = FC_THEMES[themeName] || FC_THEMES.emerald;
    var themeVars = Object.keys(th).filter(function(k) { return k.indexOf('--') === 0; })
        .map(function(k) { return k + ':' + th[k]; }).join(';');
    var themeStyle = win.document.getElementById('fc-theme-vars-rally');
    if (!themeStyle) {
        themeStyle = win.document.createElement('style');
        themeStyle.id = 'fc-theme-vars-rally';
        win.document.head.appendChild(themeStyle);
    }
    themeStyle.textContent = '#fcRallyCard { ' + themeVars + ' }';

    var troopHTML = Object.keys(data.troops || {}).filter(function(u) { return data.troops[u] > 0; }).map(function(u) {
        return '<span style="display:flex;align-items:center;gap:3px;font-size:11px;font-weight:700;color:var(--fg-accent2);">' +
            '<img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_' + u + '.png" style="width:14px;height:14px;">' +
            data.troops[u] + '</span>';
    }).join('');

    var targetLabel = data.targetName ? data.targetName + ' (' + data.target + ')' : data.target;
    var targetLink = data.targetID
        ? '<a href="/game.php?screen=info_village&id=' + data.targetID + '" style="color:var(--fg-link);font-weight:800;text-decoration:none;font-size:11px;" onmouseover="this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">' + targetLabel + '</a>'
        : '<span style="color:var(--fg-accent2);font-weight:800;font-size:11px;">' + targetLabel + '</span>';

    var old = win.document.getElementById('fcRallyCard');
    if (old) old.remove();
    var oldStyle = win.document.getElementById('fcRallyCSS');
    if (oldStyle) oldStyle.remove();

    var css =
        '#fcRallyCard{position:fixed;top:70px;right:16px;z-index:99999;background:var(--fg-bg);border-radius:14px;' +
        'box-shadow:0 12px 40px var(--fg-shadow),0 0 0 1px var(--fg-border);width:260px;font-family:' + fnt + ';overflow:hidden;user-select:none;}' +
        '#fcRallyCard .rh{background:linear-gradient(160deg,var(--fg-accent2),var(--fg-accent));padding:11px 14px;display:flex;align-items:center;justify-content:space-between;cursor:move;}' +
        '#fcRallyCard .rt{font-size:13px;font-weight:800;color:#fff;pointer-events:none;}' +
        '#fcRallyCard .rx{background:rgba(255,255,255,.1);border:none;cursor:pointer;width:22px;height:22px;border-radius:6px;font-size:11px;color:rgba(255,255,255,.85);font-weight:900;display:flex;align-items:center;justify-content:center;}' +
        '#fcRallyCard .rb{padding:12px 14px;display:flex;flex-direction:column;gap:7px;}' +
        '#fcRallyCard .rc{background:var(--fg-bg2);border:1px solid var(--fg-border);border-radius:9px;padding:9px 10px;text-align:center;}' +
        '#fcRallyCard .rcl{font-size:9px;color:var(--fg-text2);font-weight:800;text-transform:uppercase;letter-spacing:.6px;}' +
        '#fcRallyCard .rcv{font-size:22px;font-weight:900;color:var(--fg-accent2);font-variant-numeric:tabular-nums;margin-top:2px;font-family:Courier New,monospace;}' +
        '#fcRallyCard .rcv.urgent{color:#ef4444;}' +
        '#fcRallyCard .rr{display:flex;justify-content:space-between;align-items:center;font-size:11px;padding:6px 8px;background:var(--fg-bg2);border-radius:7px;}' +
        '#fcRallyCard .rl{color:var(--fg-text2);font-weight:600;}' +
        '#fcRallyCard .rv{color:var(--fg-accent2);font-weight:800;}' +
        '@keyframes fcP{0%,100%{opacity:1}50%{opacity:.3}}';

    var styleEl = win.document.createElement('style');
    styleEl.id = 'fcRallyCSS';
    styleEl.textContent = css;
    win.document.head.appendChild(styleEl);

    var html = '<div id="fcRallyCard">' +
        '<div class="rh" id="fcRallyHead"><span class="rt">🏹 Fake Coordinado</span><button class="rx" onclick="window.fcRallyClosed=true;document.getElementById(\'fcRallyCard\').remove()">✕</button></div>' +
        '<div class="rb">' +
            '<div class="rc"><div class="rcl">⏱ Tiempo restante</div><div class="rcv" id="fcRCTimer">' + (ms > 0 ? msToHMS(ms) : '¡LANZAR!') + '</div></div>' +
            '<div class="rr" style="flex-direction:column;align-items:flex-start;gap:3px;"><span class="rl">🎯 Objetivo</span><span class="rv">' + targetLink + '</span></div>' +
            '<div class="rr"><span class="rl">⏰ Lanzar a las</span><span class="rv">' + _launchStr + '</span></div>' +
            '<div class="rr"><span class="rl">📏 Distancia</span><span class="rv">' + data.distance + ' campos</span></div>' +
            (troopHTML ? '<div class="rr" style="flex-direction:column;align-items:flex-start;gap:5px;"><span class="rl">⚔️ Tropas</span><div style="display:flex;flex-wrap:wrap;gap:5px;">' + troopHTML + '</div></div>' : '') +
        '</div></div>';

    var div = win.document.createElement('div');
    div.innerHTML = html;
    win.document.body.appendChild(div.firstChild);

    // Draggable
    var card = win.document.getElementById('fcRallyCard');
    var head = win.document.getElementById('fcRallyHead');
    var dragX, dragY, startL, startT;
    head.addEventListener('mousedown', function(e) {
        var rect = card.getBoundingClientRect();
        startL = rect.left; startT = rect.top;
        card.style.right = 'auto';
        card.style.left = startL + 'px';
        card.style.top  = startT + 'px';
        dragX = e.clientX; dragY = e.clientY;
        function onMove(e) {
            card.style.left = (startL + e.clientX - dragX) + 'px';
            card.style.top  = (startT + e.clientY - dragY) + 'px';
        }
        function onUp() {
            win.document.removeEventListener('mousemove', onMove);
            win.document.removeEventListener('mouseup', onUp);
        }
        win.document.addEventListener('mousemove', onMove);
        win.document.addEventListener('mouseup', onUp);
    });

    // Countdown
    var launchTime = data.launchTime;
    function tickTimer() {
        var el = win.document.getElementById('fcRCTimer');
        if (!el) return false;
        var remaining = launchTime - Date.now();
        if (remaining <= 0) {
            el.textContent = '¡LANZAR!';
            el.style.color = '#ef4444';
            el.style.animation = 'fcP 1s infinite';
            return false;
        }
        el.textContent = msToHMS(remaining);
        if (remaining < 30000) {
            el.style.color = '#ef4444';
            el.style.animation = 'fcP 1s infinite';
        } else if (remaining < 300000) {
            el.style.color = '#d97706';
            el.style.animation = '';
        } else {
            el.style.color = 'var(--fg-accent2)';
            el.style.animation = '';
        }
        return true;
    }

    tickTimer();
    var serverTimeEl = win.document.getElementById('serverTime');
    if (serverTimeEl) {
        var observer = new win.MutationObserver(function() { tickTimer(); });
        observer.observe(serverTimeEl, { childList: true, characterData: true, subtree: true });
    } else {
        win.setInterval(tickTimer, 1000);
    }
}

function handleRallyPage() {
    var raw = localStorage.getItem(KEY_PENDING);
    if (!raw) return;
    var data = JSON.parse(raw);
    if (!data.openedAt || (Date.now() - data.openedAt) > 300000) {
        localStorage.removeItem(KEY_PENDING);
        return;
    }

    function fillTroops() {
        if (!document.querySelector('input.unitsInput')) return;
        Object.keys(data.troops || {}).forEach(function(u) {
            var v = data.troops[u];
            $('input.unitsInput[name="' + u + '"]').val(v > 0 ? v : '').trigger('change');
        });
    }

    var _rendered = false;
    function render() {
        fillTroops();
        if (!_rendered) { _rendered = true; injectRallyCardInWindow(window, data); }
    }

    if (document.readyState === 'complete') render();
    else $(document).ready(render);
    setTimeout(render, 800);
}

})();
void(0);
