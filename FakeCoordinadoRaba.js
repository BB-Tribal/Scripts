javascript:
(function () {

// ╔══════════════════════════════════════════════════════╗
//  LANG
// ╚══════════════════════════════════════════════════════╝
var lang = {
    title:       'Fake Coordinado',
    badge:       '⚔️ HERRAMIENTA',
    subtitle:    'Calcula los lanzamientos exactos',
    targetLabel: 'Pueblos Objetivo',
    targetPH:    'Pega coordenadas o cualquier texto…\nEj: 500|500  501|502\n\nPuedes pegar un reporte, lista o script entero — el script detecta las coordenadas automáticamente.',
    hitLabel:    'Hora de Impacto',
    calcBtn:     'Calcular Lanzamientos',
    settTitle:   'Ajustes',
    settSub:     'Tipografía y tropas por defecto',
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
//  STORAGE KEYS
// ╚══════════════════════════════════════════════════════╝
var KEY_DATE    = 'fakeCoorDate';
var KEY_PENDING = 'fakeCoorPending';
var KEY_FONT    = 'fakeCoorFont';
var KEY_TROOPS  = 'fakeCoorTroops';
var KEY_FMT     = 'fakeCoorTimeFmt';

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

function toDatetimeLocal(dateStr) {
    var d = new Date(dateStr);
    if (isNaN(d)) return '';
    return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) +
           'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function fromInput(val) {
    var d = new Date(val);
    return isNaN(d) ? null : d;
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
/* ── Overlay base ── */
.fc-overlay {
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,.65);z-index:99999;
    display:flex;align-items:center;justify-content:center;
    font-family:${f};
}
/* ── Box ── */
.fc-box {
    background:#ffffff;border-radius:16px;
    box-shadow:0 28px 70px rgba(0,0,0,.4),0 0 0 1px rgba(255,255,255,.06);
    overflow:hidden;
}
/* ── Header ── */
.fc-head {
    background:linear-gradient(160deg,#064e3b 0%,#065f46 100%);
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
    background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);cursor:pointer;
    width:28px;height:28px;border-radius:8px;
    font-size:13px;color:#6ee7b7;font-weight:900;
    display:flex;align-items:center;justify-content:center;
    transition:all .15s;flex-shrink:0;
}
.fc-icon-btn:hover { background:rgba(255,255,255,.14);color:#ecfdf5;border-color:rgba(255,255,255,.2); }
/* ── Body ── */
.fc-body { padding:18px 20px;display:flex;flex-direction:column;gap:13px; }
/* ── Card ── */
.fc-card {
    background:#f0fdf4;border:1px solid #d1fae5;
    border-radius:11px;padding:13px 15px;
}
.fc-card-label {
    font-size:10px;font-weight:800;text-transform:uppercase;
    letter-spacing:.9px;color:#065f46;margin-bottom:8px;
    display:flex;align-items:center;gap:5px;
}
/* ── Inputs ── */
.fc-textarea {
    width:100%;box-sizing:border-box;
    background:#fff;border:1px solid #a7f3d0;border-radius:8px;
    padding:10px 12px;font-size:12px;color:#064e3b;
    resize:vertical;font-family:inherit;min-height:100px;outline:none;
    transition:border-color .15s;
}
.fc-textarea:focus { border-color:#047857;box-shadow:0 0 0 3px rgba(51,65,85,.1); }
.fc-textarea.error { border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,.1); }
.fc-error-msg {
    display:none;align-items:center;gap:6px;
    margin-top:7px;padding:7px 11px;
    background:#fef2f2;border:1px solid #fecaca;border-radius:7px;
    font-size:11px;font-weight:600;color:#dc2626;
}
.fc-input {
    flex:1;min-width:0;
    background:#fff;border:1px solid #a7f3d0;border-radius:8px;
    padding:9px 12px;font-size:13px;color:#064e3b;
    font-family:inherit;outline:none;transition:border-color .15s;
}
.fc-input:focus { border-color:#047857;box-shadow:0 0 0 3px rgba(51,65,85,.1); }
input[type="datetime-local"].fc-input { padding:7px 12px; }
/* ── Format toggle ── */
.fc-fmt-row   { display:flex;gap:6px;margin-bottom:9px; }
.fc-fmt-btn {
    padding:4px 12px;border-radius:20px;
    border:1px solid #a7f3d0;background:#fff;
    font-size:11px;font-weight:600;color:#4b7a6a;
    cursor:pointer;transition:all .15s;
}
.fc-fmt-btn:hover { border-color:#047857;color:#064e3b; }
.fc-fmt-btn.active { background:#065f46;border-color:#065f46;color:#fff; }
/* ── Troops grid ── */
.fc-troop-grid  { display:flex;flex-wrap:wrap;gap:7px; }
.fc-troop-item {
    display:flex;flex-direction:column;align-items:center;gap:3px;
    background:#fff;border:1px solid #d1fae5;border-radius:9px;
    padding:7px 6px;min-width:44px;transition:border-color .15s;
}
.fc-troop-item:hover { border-color:#047857; }
.fc-troop-n {
    width:38px;text-align:center;
    background:#ecfdf5;border:1px solid #d1fae5;border-radius:5px;
    padding:3px 2px;font-size:11px;font-weight:700;color:#064e3b;
    outline:none;font-family:inherit;
}
.fc-troop-n:focus { border-color:#047857;background:#fff; }
/* ── Font buttons ── */
.fc-font-row { display:flex;gap:6px;flex-wrap:wrap; }
.fc-font-btn {
    padding:5px 13px;border-radius:20px;
    border:1px solid #d1fae5;background:#fff;
    font-size:11px;font-weight:600;color:#4b7a6a;
    cursor:pointer;transition:all .15s;
}
.fc-font-btn:hover { border-color:#047857;color:#064e3b; }
.fc-font-btn.active { background:#065f46;border-color:#065f46;color:#fff; }
/* ── Main CTA ── */
.fc-btn {
    width:100%;padding:13px;
    background:linear-gradient(135deg,#065f46 0%,#064e3b 100%);
    border:none;border-radius:11px;cursor:pointer;
    color:#ecfdf5;font-size:14px;font-weight:800;
    font-family:inherit;box-shadow:0 4px 16px rgba(15,23,42,.35);transition:all .15s;
}
.fc-btn:hover  { transform:translateY(-1px);box-shadow:0 6px 22px rgba(15,23,42,.5);background:linear-gradient(135deg,#047857 0%,#065f46 100%); }
.fc-btn:active { transform:translateY(0); }
/* ── Footer ── */
.fc-footer {
    background:#f0fdf4;border-top:1px solid #d1fae5;
    padding:8px 20px;text-align:center;
    font-size:10px;color:#6b7280;font-style:italic;
}

/* ── Results list ── */
#fcResBox {
    width:min(1050px,96vw);max-height:92vh;
    display:flex;flex-direction:column;overflow:hidden;
}
.fc-res-body { overflow-y:auto;overflow-x:hidden;max-height:480px; }
.fc-res-body::-webkit-scrollbar { width:6px; }
.fc-res-body::-webkit-scrollbar-track { background:#f0fdf4; }
.fc-res-body::-webkit-scrollbar-thumb { background:#047857;border-radius:10px; }
.fc-res-body::-webkit-scrollbar-thumb:hover { background:#064e3b; }
.fc-res-table { width:100%;border-collapse:collapse;table-layout:fixed;border-spacing:0; }
.fc-res-table thead { position:sticky;top:0;z-index:2; }
.fc-res-table thead tr,
.fc-res-table thead tr td,
.fc-res-table thead tr th { background:#064e3b !important;border:none !important; }
.fc-res-table thead th {
    padding:11px 16px;font-size:9px;font-weight:800;
    text-transform:uppercase;letter-spacing:.8px;color:rgba(255,255,255,.55) !important;
    text-align:left;border-bottom:2px solid #047857 !important;
    background:#064e3b !important;
}
.fc-res-table thead th:nth-child(1) { width:44px; }
.fc-res-table thead th:nth-child(2) { width:auto; }
.fc-res-table thead th:nth-child(3) { width:110px; }
.fc-res-table thead th:nth-child(4) { width:130px; }
.fc-res-table thead th:nth-child(5) { width:140px; }
.fc-res-table thead th:nth-child(6) { width:120px;text-align:right; }
.fc-res-table tbody tr {
    border-bottom:1px solid #f0fdf4;
    transition:background .12s,box-shadow .12s;
}
.fc-res-table tbody tr:last-child { border-bottom:none; }
.fc-res-table tbody tr.fc-target-row:hover { background:#f0fdf4;box-shadow:inset 3px 0 0 #047857; }
.fc-res-table tbody tr.sent { opacity:.3; }
.fc-res-table td { padding:13px 16px;vertical-align:middle; }
/* Cabecera de grupo (pueblo origen) */
.fc-group-head td {
    background:#ecfdf5;border-top:1px solid #d1fae5;border-bottom:1px solid #d1fae5;
    padding:9px 16px;
}
.fc-group-head:first-child td { border-top:none; }
.fc-group-icon { font-size:14px;margin-right:7px;vertical-align:-1px; }
.fc-group-name {
    font-size:13px;font-weight:800;color:#064e3b;text-decoration:none;
}
.fc-group-name:hover { color:#047857;text-decoration:underline; }
.fc-group-count {
    float:right;font-size:10px;font-weight:700;color:#047857;
    background:#fff;border:1px solid #d1fae5;border-radius:20px;padding:2px 10px;
}
/* Indentar el objetivo dentro del grupo */
.fc-target-row td:nth-child(2) { padding-left:24px; }
/* N° */
.fc-res-num {
    font-size:11px;font-weight:800;color:#d1fae5;
    background:#064e3b;border-radius:6px;
    padding:3px 8px;display:inline-block;
}
/* Origen → Objetivo */
.fc-res-route { display:flex;flex-direction:column;gap:3px;min-width:0; }
.fc-res-src {
    font-size:12px;font-weight:800;color:#064e3b;
    text-decoration:none;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:280px;
    display:block;
}
.fc-res-src:hover { color:#047857;text-decoration:underline; }
.fc-res-arr { color:#a7f3d0;font-size:9px;font-weight:900;line-height:1; }
.fc-res-tgt {
    font-size:12px;font-weight:600;color:#374151;
    text-decoration:none;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:280px;
    display:block;
}
.fc-res-tgt:hover { color:#047857;text-decoration:underline; }
/* Distancia */
.fc-res-dist-pill {
    display:inline-flex;align-items:center;gap:4px;
    font-size:11px;font-weight:700;color:#065f46;
    background:#ecfdf5;border:1px solid #d1fae5;
    border-radius:20px;padding:4px 12px;white-space:nowrap;
}
/* Countdown */
.fc-res-timer-wrap { display:flex;flex-direction:column;gap:2px; }
.fc-res-timer-lbl  { font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:#a7f3d0; }
.fc-res-timer {
    font-size:20px;font-weight:900;color:#064e3b;
    font-variant-numeric:tabular-nums;
    font-family:'Courier New',Courier,monospace;
    letter-spacing:.5px;
}
@keyframes fcPulse { 0%,100%{opacity:1}50%{opacity:.3} }
/* Hora local */
.fc-res-localtime { font-size:12px;font-weight:600;color:#6b7280;white-space:nowrap; }
/* Botón */
.fc-rally-btn {
    padding:8px 16px;border-radius:8px;
    background:linear-gradient(135deg,#065f46,#047857);
    border:none;cursor:pointer;color:#fff;
    font-size:11px;font-weight:800;font-family:inherit;
    white-space:nowrap;letter-spacing:.2px;
    box-shadow:0 2px 8px rgba(6,79,70,.3);transition:all .15s;
}
.fc-rally-btn:hover { transform:translateY(-1px);box-shadow:0 4px 14px rgba(6,79,70,.45);filter:brightness(1.1); }
.fc-empty { padding:40px;text-align:center;color:#a7f3d0;font-size:13px; }
.fc-empty-state {
    padding:40px 30px;display:flex;flex-direction:column;align-items:center;
    text-align:center;gap:8px;
}
.fc-empty-icon {
    width:64px;height:64px;border-radius:50%;
    background:#f0fdf4;border:1px solid #d1fae5;
    display:flex;align-items:center;justify-content:center;
    font-size:28px;margin-bottom:4px;
}
.fc-empty-title { font-size:16px;font-weight:800;color:#064e3b; }
.fc-empty-text  { font-size:12px;color:#6b7280;margin-bottom:6px; }
.fc-empty-hints {
    list-style:none;padding:0;margin:0 0 4px;text-align:left;
    display:flex;flex-direction:column;gap:6px;max-width:340px;
}
.fc-empty-hints li {
    font-size:11px;color:#475569;padding:8px 12px;
    background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;
    position:relative;padding-left:28px;
}
.fc-empty-hints li:before {
    content:'›';position:absolute;left:12px;top:50%;transform:translateY(-50%);
    color:#047857;font-weight:900;font-size:14px;
}
.fc-empty-hints b { color:#064e3b; }
#fcLoader {
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,.6);z-index:999999;
    display:flex;align-items:center;justify-content:center;
    font-family:${f};
}
#fcLoader .fcl-box {
    background:#fff;border-radius:16px;padding:30px 36px;
    box-shadow:0 20px 50px rgba(0,0,0,.3);text-align:center;min-width:260px;
}
#fcLoader .fcl-spinner {
    width:36px;height:36px;border:3px solid #d1fae5;
    border-top-color:#047857;border-radius:50%;
    animation:fcSpin .7s linear infinite;margin:0 auto 14px;
}
@keyframes fcSpin { to{transform:rotate(360deg);} }
#fcLoader .fcl-title { font-size:14px;font-weight:800;color:#064e3b;margin-bottom:4px; }
#fcLoader .fcl-sub   { font-size:11px;color:#6b7280;margin-bottom:14px; }
#fcLoader .fcl-bar-wrap { background:#f0fdf4;border-radius:20px;height:6px;overflow:hidden; }
#fcLoader .fcl-bar { height:100%;background:linear-gradient(90deg,#064e3b,#10b981);border-radius:20px;transition:width .15s; }
#fcLoader .fcl-count { font-size:11px;color:#047857;font-weight:700;margin-top:8px; }

/* ── Help & Settings modals ── */
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
    color:#047857;display:flex;align-items:center;gap:5px;
}
.fc-help-text { font-size:12px;color:#065f46;line-height:1.6; }
.fc-help-sep  { height:1px;background:#ecfdf5;margin:2px 0; }

/* ── Rally card ── */
#fakeCoorRallyCard {
    position:fixed;top:70px;right:16px;z-index:99999;
    background:#fff;border-radius:14px;
    box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 1px rgba(15,23,42,.08);
    width:258px;font-family:${f};overflow:hidden;
}
.fc-rc-head {
    background:linear-gradient(160deg,#064e3b 0%,#065f46 100%);
    padding:11px 14px;display:flex;align-items:center;justify-content:space-between;
}
.fc-rc-title { font-size:13px;font-weight:800;color:#ecfdf5; }
.fc-rc-close {
    background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);cursor:pointer;
    width:22px;height:22px;border-radius:6px;font-size:11px;
    color:#6ee7b7;font-weight:900;display:flex;align-items:center;justify-content:center;
}
.fc-rc-close:hover { background:rgba(255,255,255,.15);color:#ecfdf5; }
.fc-rc-body { padding:12px 14px;display:flex;flex-direction:column;gap:7px; }
.fc-rc-countdown {
    background:#f0fdf4;border:1px solid #d1fae5;
    border-radius:9px;padding:9px 10px;text-align:center;
}
.fc-rc-cd-lbl { font-size:9px;color:#4b7a6a;font-weight:800;text-transform:uppercase;letter-spacing:.6px; }
.fc-rc-cd-val { font-size:22px;font-weight:900;color:#064e3b;font-variant-numeric:tabular-nums;margin-top:2px; }
.fc-rc-cd-val.urgent { color:#ef4444; }
@keyframes fcPulse { 0%,100%{opacity:1}50%{opacity:.35} }
.fc-rc-row {
    display:flex;justify-content:space-between;align-items:center;
    font-size:11px;padding:6px 8px;background:#f0fdf4;border-radius:7px;
}
.fc-rc-lbl { color:#4b7a6a;font-weight:600; }
.fc-rc-val { color:#064e3b;font-weight:800; }
.fc-rc-troops { display:flex;flex-wrap:wrap;gap:5px; }
.fc-rc-troop  { display:flex;align-items:center;gap:3px;font-size:11px;font-weight:700;color:#064e3b; }
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
    // Base units always present; optional ones check DOM
    var base = ['spear','sword','axe','spy','light','heavy','ram','catapult'];
    if (base.indexOf(u) >= 0) return true;
    return $('[data-unit=' + u + ']').length > 0;
});

var savedTroops = JSON.parse(localStorage.getItem(KEY_TROOPS) || '{"ram":1,"spy":1}');

var coordListOwn = [], testDistances = [], timedFakeList = [];
var savedCoords = '';
var ramSpeedMs;
var unitSpeeds = {}; // minutos por campo para cada unidad

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

// Default date
var msPerMin = 60000, msPerDay = 86400000, minsPerDay = 1440;
var defDate = new Date();
defDate.setTime(((Math.floor(defDate.getTime() / msPerDay) + 1) * minsPerDay + defDate.getTimezoneOffset()) * msPerMin);
defDate = defDate.toString().replace(/\w+\s*/i,'').replace(/(\d*:\d*:\d*)(.*)/i,'$1');
var saved = localStorage.getItem(KEY_DATE);
if (saved && Date.parse(saved) >= Date.parse(defDate)) defDate = saved;
else localStorage.setItem(KEY_DATE, defDate);

// ╔══════════════════════════════════════════════════════╗
//  INJECT CSS
// ╚══════════════════════════════════════════════════════╝
$('#fakeCoorCSS').remove();
$('head').append('<style id="fakeCoorCSS">' + buildCSS() + '</style>');

// ╔══════════════════════════════════════════════════════╗
//  BUILD HEADER BUTTONS HTML
// ╚══════════════════════════════════════════════════════╝
// Header para modales secundarios: logo + título + (botón izq opcional) + cerrar
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
            '<button class="fc-icon-btn fc-close-btn">' + lang.close + '</button>' +
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
            '<button class="fc-icon-btn fc-close-btn">' + lang.close + '</button>' +
        '</div>' +
    '</div>';
}

// ╔══════════════════════════════════════════════════════╗
//  MODAL 1 — MAIN
// ╚══════════════════════════════════════════════════════╝
function timeInputHTML() {
    var fmtBtns = '<div class="fc-fmt-row">' +
        '<button class="fc-fmt-btn' + (timeFmt==='text'   ? ' active' : '') + '" data-fmt="text">'   + lang.fmtText   + '</button>' +
        '<button class="fc-fmt-btn' + (timeFmt==='picker' ? ' active' : '') + '" data-fmt="picker">' + lang.fmtPicker + '</button>' +
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
    headerHTML(lang.title, lang.subtitle) +
    '<div class="fc-body">' +
        '<div class="fc-card">' +
            '<div class="fc-card-label">🎯 ' + lang.targetLabel + '</div>' +
            '<textarea class="fc-textarea" id="fcCoords" placeholder="' + lang.targetPH + '"></textarea>' +
            '<div class="fc-error-msg" id="fcCoordsErr">⚠️ Introduce al menos una coordenada objetivo.</div>' +
        '</div>' +
        '<div class="fc-card">' +
            '<div class="fc-card-label">⏰ ' + lang.hitLabel + '</div>' +
            '<div id="fcTimeWrap">' + timeInputHTML() + '</div>' +
        '</div>' +
        '<button class="fc-btn" id="fcCalc">⚡ ' + lang.calcBtn + '</button>' +
    '</div>' +
    '<div class="fc-footer">💚 Creado por <strong style="font-style:normal;color:#059669;">rabagalan73</strong> para la reina <strong style="font-style:normal;color:#059669;">M0bscene</strong> 💚</div>' +
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
        subHeaderHTML('?', lang.helpTitle, lang.helpSub) +
        '<div class="fc-help-body">' + html + '</div>' +
        '<div class="fc-footer">💚 Creado por <strong style="font-style:normal;color:#059669;">rabagalan73</strong> para la reina <strong style="font-style:normal;color:#059669;">M0bscene</strong> 💚</div>' +
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
    var st = JSON.parse(localStorage.getItem(KEY_TROOPS) || '{"ram":1,"spy":1}');

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

    $('body').append(
        '<div class="fc-overlay" id="fcSettOverlay">' +
        '<div class="fc-box" id="fcSettBox">' +
        subHeaderHTML('⚙️', lang.settTitle, lang.settSub) +
        '<div class="fc-sett-body">' +
            '<div class="fc-card">' +
                '<div class="fc-card-label">🔤 ' + lang.fontLabel + '</div>' +
                '<div class="fc-font-row" id="fcsFont">' + fontBtns + '</div>' +
            '</div>' +
            '<div class="fc-card">' +
                '<div class="fc-card-label">⚔️ ' + lang.troopsLabel + '</div>' +
                '<div class="fc-troop-grid">' + troopCards + '</div>' +
            '</div>' +
            '<button class="fc-btn" id="fcSettSave">✅ ' + lang.save + '</button>' +
        '</div>' +
        '<div class="fc-footer">💚 Creado por <strong style="font-style:normal;color:#059669;">rabagalan73</strong> para la reina <strong style="font-style:normal;color:#059669;">M0bscene</strong> 💚</div>' +
        '</div></div>'
    );

    fcOverlayClose('#fcSettOverlay');
    $('#fcSettOverlay').on('click', '.fc-close-btn', function() { $('#fcSettOverlay').remove(); });

    $('#fcSettOverlay').on('click', '.fc-font-btn', function() {
        currentFont = $(this).data('font');
        localStorage.setItem(KEY_FONT, currentFont);
        $('.fc-font-btn').removeClass('active'); $(this).addClass('active');
        $('#fakeCoorCSS').text(buildCSS());
        $('.fc-overlay').css('font-family', fontCSS());
        $('#fcRallyCard').css('font-family', fontCSS());
    });

    $('#fcSettSave').on('click', function() {
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
        var nameMatch = txt.replace(cm[0], '')      // quitar coords
                           .replace(/\(\s*\)/g, '') // quitar paréntesis vacíos resultantes
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

    // Las velocidades aún no han cargado (AJAX async)
    if (!unitSpeeds || Object.keys(unitSpeeds).length === 0) {
        $('#fcTime').css({'border-color':'','box-shadow':''});
        alert('Cargando velocidades de unidades, espera un momento y vuelve a intentarlo.');
        return;
    }

    // Determinar unidad de referencia: la más lenta entre las configuradas
    var configuredUnits = Object.keys(troops).filter(function(u) { return troops[u] > 0 && unitSpeeds[u]; });
    var refUnit, refSpeedMs = 0;
    if (configuredUnits.length > 0) {
        // Más lenta = mayor minutos/campo, solo entre las configuradas
        configuredUnits.forEach(function(u) {
            var spd = unitSpeeds[u] * 60000;
            if (spd > refSpeedMs) { refSpeedMs = spd; refUnit = u; }
        });
    } else {
        // Sin tropas configuradas: usar ariete o catapulta (la que exista)
        refUnit = unitSpeeds.ram ? 'ram' : 'catapult';
        refSpeedMs = (unitSpeeds[refUnit] || 0) * 60000;
    }

    if (!refSpeedMs) {
        alert('No se pudo determinar la velocidad de la unidad de referencia.');
        return;
    }

    var stmp = $('#serverDate')[0].innerText + ' ' + $('#serverTime')[0].innerText;
    var sm   = stmp.match(/^([0][1-9]|[12][0-9]|3[01])[\/\-]([0][1-9]|1[012])[\/\-](\d{4})( (0?[0-9]|[1][0-9]|[2][0-3])[:]([0-5][0-9])([:]([0-5][0-9]))?)?$/);
    var serverNow = Date.parse(sm[2]+'/'+sm[1]+'/'+sm[3]+sm[4]);

    for (var i = 0; i < coordListOwn.length; i++)
        for (var j = 0; j < targets.length; j++)
            testDistances.push({ source: coordListOwn[i], target: targets[j], distance: calcDist(targets[j], coordListOwn[i].Coord) });

    testDistances.sort(function(a,b) { return a.distance - b.distance; });

    for (var i = 0; i < testDistances.length; i++) {
        var td = testDistances[i];
        // El pueblo debe tener la unidad de referencia (la más lenta), que marca el tiempo.
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
    timedFakeList.sort(function(a,b) { return a.ttl - b.ttl; });

    // Obtener IDs de pueblos destino para los enlaces
    var uniqueTargets = timedFakeList.reduce(function(acc, item) {
        if (acc.indexOf(item.target) === -1) acc.push(item.target);
        return acc;
    }, []);
    var targetIdMap   = {};
    var targetNameMap = {};
    if (uniqueTargets.length === 0) { showResults(); return; }

    // Mostrar loader
    var total = uniqueTargets.length;
    var done  = 0;
    $('#fcLoader').remove();
    $('body').append(
        '<div id="fcLoader"><div class="fcl-box">' +
        '<div class="fcl-spinner"></div>' +
        '<div class="fcl-title">Resolviendo pueblos...</div>' +
        '<div class="fcl-sub">Consultando ' + total + ' coordenadas · Ref: <img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_' + refUnit + '.png" style="width:13px;height:13px;vertical-align:-2px;margin:0 2px;"><strong>' + (unitNames[refUnit] || refUnit) + '</strong></div>' +
        '<div class="fcl-bar-wrap"><div class="fcl-bar" id="fclBar" style="width:0%"></div></div>' +
        '<div class="fcl-count" id="fclCount">0 / ' + total + '</div>' +
        '</div></div>'
    );

    // Cola secuencial con delay para evitar 429 Too Many Requests
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
//  MODAL 2 — RESULTS (cards)
// ╚══════════════════════════════════════════════════════╝
function showResults(targetIdMap, targetNameMap) {
    targetIdMap   = targetIdMap   || {};
    targetNameMap = targetNameMap || {};
    $('#fcMainOverlay, #fcResOverlay').remove();
    var rows = '';

    if (timedFakeList.length) {
        // Agrupar por pueblo origen, conservando el índice global (para los timers)
        var groups = {};
        var groupOrder = [];
        for (var i = 0; i < timedFakeList.length; i++) {
            var it = timedFakeList[i];
            var key = it.source.ID;
            if (!groups[key]) {
                groups[key] = { source: it.source, items: [] };
                groupOrder.push(key);
            }
            groups[key].items.push({ item: it, idx: i });
        }
        // Ordenar grupos por su lanzamiento más urgente
        groupOrder.sort(function(a, b) {
            return groups[a].items[0].item.ttl - groups[b].items[0].item.ttl;
        });

        groupOrder.forEach(function(key) {
            var g = groups[key];
            var src = g.source;
            var srcLabel = src.Name ? src.Name + ' (' + src.Coord + ')' : src.Coord;
            rows +=
                '<tr class="fc-group-head">' +
                '<td colspan="6">' +
                    '<span class="fc-group-icon">🏰</span>' +
                    '<a class="fc-group-name" href="/game.php?screen=info_village&id=' + src.ID + '" target="_blank" title="' + (src.Name || src.Coord) + '">' + srcLabel + '</a>' +
                    '<span class="fc-group-count">' + g.items.length + ' ' + (g.items.length === 1 ? 'objetivo' : 'objetivos') + '</span>' +
                '</td>' +
                '</tr>';

            g.items.forEach(function(entry, n) {
                var item = entry.item, i = entry.idx;
                var ld   = new Date(item.launchTime);
                var tx   = item.target.match(/(\d+)\|(\d+)/);
                var timeStr = ld.toLocaleDateString() === new Date().toLocaleDateString()
                    ? 'Hoy ' + ld.toLocaleTimeString()
                    : ld.toLocaleString();
                var tgtHTML = targetIdMap[item.target]
                    ? '<a class="fc-res-tgt" href="/game.php?screen=info_village&id=' + targetIdMap[item.target] + '" target="_blank" title="' + (targetNameMap[item.target] || item.target) + '">' + (targetNameMap[item.target] ? targetNameMap[item.target] + ' (' + item.target + ')' : item.target) + '</a>'
                    : '<span class="fc-res-tgt" title="' + item.target + '">' + (targetNameMap[item.target] ? targetNameMap[item.target] + ' (' + item.target + ')' : item.target) + '</span>';
                rows +=
                    '<tr id="fcCard_' + i + '" class="fc-target-row">' +
                    '<td><span class="fc-res-num">' + (n+1) + '</span></td>' +
                    '<td><div class="fc-res-route">' + tgtHTML + '</div></td>' +
                    '<td><span class="fc-res-dist-pill">📏 ' + Math.round(item.distance) + ' ' + lang.fields + '</span></td>' +
                    '<td>' +
                        '<div class="fc-res-timer-wrap">' +
                            '<div class="fc-res-timer-lbl">' + lang.launchIn + '</div>' +
                            '<div class="fc-res-timer timer" id="fcTimer_' + i + '" style="color:' + (item.ttl < 30000 ? '#ef4444' : item.ttl < 1800000 ? '#d97706' : '') + '">' + msToHMS(item.ttl) + '</div>' +
                        '</div>' +
                    '</td>' +
                    '<td><span class="fc-res-localtime">🕐 ' + timeStr + '</span></td>' +
                    '<td style="text-align:right"><button class="fc-rally-btn" onclick="fcGoRally(' + i + ',' + src.ID + ',' + tx[1] + ',' + tx[2] + ')">🏹 ' + lang.rallyBtn + '</button></td>' +
                    '</tr>';
            });
        });
    }

    var subTitle = lang.resSub.replace('{n}', timedFakeList.length);
    if (timedFakeList.length && timedFakeList[0].refUnit) {
        var ru = timedFakeList[0].refUnit;
        subTitle += ' · Ref: <img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_' + ru + '.png" style="width:13px;height:13px;vertical-align:-2px;margin:0 2px;"> ' + (unitNames[ru] || ru);
    }
    $('body').append(
        '<div class="fc-overlay" id="fcResOverlay">' +
        '<div class="fc-box" id="fcResBox">' +
        subHeaderHTML('🏹', lang.resTitle, subTitle, '<button class="fc-icon-btn" id="fcResBack" title="' + lang.back + '">←</button>') +
        '<div class="fc-res-body">' +
            (!timedFakeList.length
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
                '<thead><tr style="background:#064e3b;">' +
                    '<th style="background:#064e3b!important;color:rgba(255,255,255,.55)!important;">#</th>' +
                    '<th style="background:#064e3b!important;color:rgba(255,255,255,.55)!important;">' + lang.target + '</th>' +
                    '<th style="background:#064e3b!important;color:rgba(255,255,255,.55)!important;">' + lang.dist + '</th>' +
                    '<th style="background:#064e3b!important;color:rgba(255,255,255,.55)!important;">' + lang.launchIn + '</th>' +
                    '<th style="background:#064e3b!important;color:rgba(255,255,255,.55)!important;">' + lang.launchAt + '</th>' +
                    '<th style="background:#064e3b!important;"></th>' +
                '</tr></thead>' +
                '<tbody>' + rows + '</tbody>' +
              '</table>') +
        '</div>' +
        '<div class="fc-footer">💚 Creado por <strong style="font-style:normal;color:#059669;">rabagalan73</strong> para la reina <strong style="font-style:normal;color:#059669;">M0bscene</strong> 💚</div>' +
        '</div></div>'
    );

    fcOverlayClose('#fcResOverlay');
    $('#fcResOverlay').on('click', '.fc-close-btn', function() { clearInterval(_resTimer); $('#fcResOverlay').remove(); });
    $('#fcResBack').on('click', function() { clearInterval(_resTimer); $('#fcResOverlay').remove(); openMain(); });
    $('#fcEmptyBack').on('click', function() { $('#fcResOverlay').remove(); openMain(); });

    // Countdown propio — actualiza cada segundo
    var _resTimer = setInterval(function() {  // 200ms → máximo 200ms de lag visual
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
        headerHTML(lang.title, lang.subtitle) +
        '<div class="fc-body">' +
            '<div class="fc-card">' +
                '<div class="fc-card-label">🎯 ' + lang.targetLabel + '</div>' +
                '<textarea class="fc-textarea" id="fcCoords" placeholder="' + lang.targetPH + '">' + (savedCoords || '') + '</textarea>' +
                '<div class="fc-error-msg" id="fcCoordsErr">⚠️ Introduce al menos una coordenada objetivo.</div>' +
            '</div>' +
            '<div class="fc-card">' +
                '<div class="fc-card-label">⏰ ' + lang.hitLabel + '</div>' +
                '<div id="fcTimeWrap">' + timeInputHTML() + '</div>' +
            '</div>' +
            '<button class="fc-btn" id="fcCalc">⚡ ' + lang.calcBtn + '</button>' +
        '</div>' +
        '<div class="fc-footer">💚 Creado por <strong style="font-style:normal;color:#059669;">rabagalan73</strong> para la reina <strong style="font-style:normal;color:#059669;">M0bscene</strong> 💚</div>' +
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
            var d = new Date(cur);
            var txt = isNaN(d) ? defDate : d.toString().replace(/\w+\s*/i,'').replace(/(\d*:\d*:\d*)(.*)/i,'$1');
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
            // Re-guardar con el ID/nombre del objetivo ya resueltos
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

            // Máquina de estados: plaza → confirm → done
            // Solo se re-inyecta en páginas del flujo permitido
            var flowState = 'plaza'; // 'plaza' | 'confirm' | 'done'
            var lastDoc = null;

            var watchdog = setInterval(function() {
                try {
                    if (newWin.closed) { clearInterval(watchdog); return; }

                    var url = newWin.location.href;
                    var doc = newWin.document;

                    // Detectar cambio de página
                    if (doc !== lastDoc) {
                        var prevState = flowState;

                        if (prevState === 'confirm') {
                            // Desde confirm cualquier navegación es el fin
                            flowState = 'done';
                        } else if (isConfirm(url)) {
                            // Plaza → confirm: permitido, resetear flag de cierre
                            flowState = 'confirm';
                            newWin.fcRallyClosed = false;
                        } else if (!isPlaza(url)) {
                            // Plaza → otra página: fin
                            flowState = 'done';
                        }

                        if (flowState === 'done') { clearInterval(watchdog); localStorage.removeItem(KEY_PENDING); return; }
                        lastDoc = doc;
                    }

                    // Re-inyectar solo si: en flujo permitido, no cerrado, card ausente, página cargada
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
        var serverMs = new Date(d[3] + '-' + d[2] + '-' + d[1] + 'T' + t).getTime();
        return serverMs - Date.now();
    } catch(e) { return 0; }
}

function injectRallyCardInWindow(win, data) {
    var cf  = localStorage.getItem(KEY_FONT) || 'mono';
    var fnt = fonts[cf] ? fonts[cf].css : fonts.mono.css;
    var serverOffset = getServerOffset(win.document);
    var ld  = new Date(data.launchTime);
    var ms  = data.launchTime - (Date.now() + serverOffset);

    var troopHTML = Object.keys(data.troops || {}).filter(function(u) { return data.troops[u] > 0; }).map(function(u) {
        return '<span style="display:flex;align-items:center;gap:3px;font-size:11px;font-weight:700;color:#064e3b;">' +
            '<img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_' + u + '.png" style="width:14px;height:14px;">' +
            data.troops[u] + '</span>';
    }).join('');

    var targetLabel = data.targetName ? data.targetName + ' (' + data.target + ')' : data.target;
    var targetLink = data.targetID
        ? '<a href="/game.php?screen=info_village&id=' + data.targetID + '" style="color:#047857;font-weight:800;text-decoration:none;font-size:11px;" onmouseover="this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">' + targetLabel + '</a>'
        : '<span style="color:#064e3b;font-weight:800;font-size:11px;">' + targetLabel + '</span>';

    // Eliminar card e intervalo anteriores
    var old = win.document.getElementById('fcRallyCard');
    if (old) old.remove();
    var oldStyle = win.document.getElementById('fcRallyCSS');
    if (oldStyle) oldStyle.remove();

    var css = '#fcRallyCard{position:fixed;top:70px;right:16px;z-index:99999;background:#fff;border-radius:14px;' +
        'box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 1px rgba(6,78,59,.1);width:260px;font-family:' + fnt + ';overflow:hidden;user-select:none;}' +
        '#fcRallyCard .rh{background:linear-gradient(160deg,#064e3b,#065f46);padding:11px 14px;display:flex;align-items:center;justify-content:space-between;cursor:move;}' +
        '#fcRallyCard .rt{font-size:13px;font-weight:800;color:#ecfdf5;pointer-events:none;}' +
        '#fcRallyCard .rx{background:rgba(255,255,255,.1);border:none;cursor:pointer;width:22px;height:22px;border-radius:6px;font-size:11px;color:#a7f3d0;font-weight:900;display:flex;align-items:center;justify-content:center;}' +
        '#fcRallyCard .rb{padding:12px 14px;display:flex;flex-direction:column;gap:7px;}' +
        '#fcRallyCard .rc{background:#f0fdf4;border:1px solid #d1fae5;border-radius:9px;padding:9px 10px;text-align:center;}' +
        '#fcRallyCard .rcl{font-size:9px;color:#065f46;font-weight:800;text-transform:uppercase;letter-spacing:.6px;}' +
        '#fcRallyCard .rcv{font-size:22px;font-weight:900;color:#064e3b;font-variant-numeric:tabular-nums;margin-top:2px;font-family:Courier New,monospace;}' +
        '#fcRallyCard .rcv.urgent{color:#ef4444;}' +
        '#fcRallyCard .rr{display:flex;justify-content:space-between;align-items:center;font-size:11px;padding:6px 8px;background:#f8fafc;border-radius:7px;}' +
        '#fcRallyCard .rl{color:#64748b;font-weight:600;}' +
        '#fcRallyCard .rv{color:#064e3b;font-weight:800;}' +
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
            '<div class="rr"><span class="rl">⏰ Lanzar a las</span><span class="rv">' + ld.toLocaleTimeString() + '</span></div>' +
            '<div class="rr"><span class="rl">📏 Distancia</span><span class="rv">' + data.distance + ' campos</span></div>' +
            (troopHTML ? '<div class="rr" style="flex-direction:column;align-items:flex-start;gap:5px;"><span class="rl">⚔️ Tropas</span><div style="display:flex;flex-wrap:wrap;gap:5px;">' + troopHTML + '</div></div>' : '') +
        '</div></div>';

    var div = win.document.createElement('div');
    div.innerHTML = html;
    win.document.body.appendChild(div.firstChild);

    // ── Draggable ──
    var card = win.document.getElementById('fcRallyCard');
    var head = win.document.getElementById('fcRallyHead');
    var dragX, dragY, startL, startT;
    head.addEventListener('mousedown', function(e) {
        var rect = card.getBoundingClientRect();
        startL = rect.left;
        startT = rect.top;
        card.style.right = 'auto';
        card.style.left = startL + 'px';
        card.style.top  = startT + 'px';
        dragX = e.clientX;
        dragY = e.clientY;
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

    // ── Countdown ──
    var launchTime = data.launchTime;

    function tickTimer() {
        var el = win.document.getElementById('fcRCTimer');
        if (!el) return false;
        var remaining = launchTime - (Date.now() + serverOffset);
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
            el.style.color = '#064e3b';
            el.style.animation = '';
        }
        return true;
    }

    // Sincronizar observando el #serverTime del juego — tick exacto cuando el juego cambia de segundo
    tickTimer();
    var serverTimeEl = win.document.getElementById('serverTime');
    if (serverTimeEl) {
        var observer = new win.MutationObserver(function() { tickTimer(); });
        observer.observe(serverTimeEl, { childList: true, characterData: true, subtree: true });
    } else {
        // Fallback si no existe #serverTime
        win.setInterval(tickTimer, 1000);
    }
}

function handleRallyPage() {
    var raw = localStorage.getItem(KEY_PENDING);
    if (!raw) return;
    var data = JSON.parse(raw);
    // Solo válido si fue abierto hace menos de 5 minutos desde el script
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

    function render() {
        fillTroops();
        injectRallyCardInWindow(window, data);
    }

    if (document.readyState === 'complete') render();
    else $(document).ready(render);
    setTimeout(render, 800);
}

})();
void(0);
