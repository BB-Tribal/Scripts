// ============================================================
//  ResourceSenderRaba — Envío de recursos para acuñación
//  Interfaz rediseñada: modals, paleta oscura & teal.
// ============================================================

var warehouseCapacity = [];
var allWoodTotals = [];
var allClayTotals = [];
var allIronTotals = [];
var availableMerchants = [];
var totalMerchants = [];
var farmSpaceUsed = [];
var farmSpaceTotal = [];
var villagesData = [];
var allWoodObjects, allClayObjects, allIronObjects, allVillages;
var data, totalWood = 0, totalStone = 0, totalIron = 0, resLimit = 0;
var sendBack;
var coordinate;
var totalWoodSent = 0, totalStoneSent = 0, totalIronSent = 0;

if (typeof woodPercentage == 'undefined') {
    woodPercentage = 28000 / 83000;
    stonePercentage = 30000 / 83000;
    ironPercentage = 25000 / 83000;
}

// ── Paleta & tokens ─────────────────────────────────────────
var RS = {
    bgOverlay  : "rgba(10,12,18,0.72)",
    bgModal    : "#1c1f27",
    bgHeader   : "#13151c",
    bgBody     : "#1c1f27",
    bgRow      : "#21242e",
    bgRowAlt   : "#191c24",
    bgCard     : "#252831",
    border     : "#2c2f3c",
    accent     : "#00c9a7",
    accentDark : "#009e84",
    accentBlue : "#4f8ef7",
    danger     : "#f0506e",
    textMain   : "#e2e8f0",
    textMuted  : "#8892a4",
    textHead   : "#ffffff",
    wood       : "#a8c060",
    stone      : "#b0a090",
    iron       : "#90b0c8",
};

// ── Idioma ───────────────────────────────────────────────────
var langShinko = [
    "Envío de recursos para acuñación",        // 0
    "Introduce la coordenada de destino",       // 1
    "Guardar",                                  // 2
    "Creador",                                  // 3
    "Jugador",                                  // 4
    "Aldea",                                    // 5
    "Puntos",                                   // 6
    "Coordenada de destino",                    // 7
    "Mantener % de almacén",                    // 8
    "Recalcular envíos / cambiar destino",      // 9
    "Envío de recursos",                        // 10
    "Aldea origen",                             // 11
    "Aldea destino",                            // 12
    "Distancia",                                // 13
    "Madera",                                   // 14
    "Barro",                                    // 15
    "Hierro",                                   // 16
    "Enviar recursos",                          // 17
    "Enviado",                                  // 18
    "¡Listo!",                                  // 19
    "Cerrar",                                   // 20
    "¡Todos los recursos han sido enviados!",   // 21
    "Formato inválido. Usa X|Y (ej: 500|500)",  // 22
];

if (game_data.locale == "es_ES" || game_data.locale == "es_MX" || game_data.locale == "es_AR") {
    langShinko = [
        "Envío de recursos para acuñación",        // 0
        "Introduce la coordenada de destino",       // 1
        "Guardar",                                  // 2
        "Creador",                                  // 3
        "Jugador",                                  // 4
        "Aldea",                                    // 5
        "Puntos",                                   // 6
        "Coordenada de destino",                    // 7
        "Mantener % de almacén",                    // 8
        "Recalcular envíos / cambiar destino",      // 9
        "Envío de recursos",                        // 10
        "Aldea origen",                             // 11
        "Aldea destino",                            // 12
        "Distancia",                                // 13
        "Madera",                                   // 14
        "Barro",                                    // 15
        "Hierro",                                   // 16
        "Enviar recursos",                          // 17
        "Enviado",                                  // 18
        "¡Listo!",                                  // 19
        "Cerrar",                                   // 20
        "¡Todos los recursos han sido enviados!",   // 21
        "Formato inválido. Usa X|Y (ej: 500|500)",  // 22
    ];
}
if (game_data.locale == "nl_NL") {
    langShinko = [
        "Grondstoffen versturen voor vlagfarmen",
        "Geef coordinaat in om naar te sturen",
        "Opslaan",
        "Scripter",
        "Speler",
        "Dorp",
        "Punten",
        "Coordinaat om naar te sturen",
        "Hou WH% achter",
        "Herbereken gs/doelwit",
        "Gs versturen",
        "Oorsprong",
        "Doelwit",
        "Afstand",
        "Hout",
        "Leem",
        "Ijzer",
        "Verstuur grondstoffen",
        "Verstuurd",
        "Klaar!",
        "Sluiten",
        "Alle grondstoffen zijn verstuurd!",
        "Ongeldig formaat. Gebruik X|Y",
    ];
}
if (game_data.locale == "it_IT") {
    langShinko = [
        "Script pushing per coniare",
        "Inserire le coordinate a cui mandare risorse",
        "Salva",
        "Creatrice",
        "Giocatore",
        "Villaggio",
        "Punti",
        "Coordinate a cui mandare",
        "Conserva % magazzino",
        "Ricalcola trasporti",
        "Invia risorse",
        "Villaggio di origine",
        "Villaggio di destinazione",
        "Distanza",
        "Legno",
        "Argilla",
        "Ferro",
        "Manda risorse",
        "Inviato",
        "Fatto!",
        "Chiudi",
        "Tutte le risorse sono state inviate!",
        "Formato non valido. Usa X|Y",
    ];
}
if (game_data.locale == "pt_BR") {
    langShinko = [
        "Enviar recursos para cunhagem de moedas",
        "Insira coordenada para enviar recursos",
        "Salvar",
        "Criador",
        "Jogador",
        "Aldeia",
        "Pontos",
        "Enviar para",
        "Manter % no armazém",
        "Recalcular transporte",
        "Enviar recursos",
        "Origem",
        "Destino",
        "Distância",
        "Madeira",
        "Argila",
        "Ferro",
        "Enviar recursos",
        "Enviado",
        "Pronto!",
        "Fechar",
        "Todos os recursos foram enviados!",
        "Formato inválido. Use X|Y",
    ];
}

// ── Temas visuales ───────────────────────────────────────────
var RS_THEMES = {
    teal:     { name:'Teal',     emoji:'&#x1F30A;', '--fg-bg':'#1c1f27','--fg-bg2':'#13151c','--fg-bg3':'#252831','--fg-border':'#2c2f3c','--fg-accent':'#00c9a7','--fg-accent2':'#009e84','--fg-text':'#e2e8f0','--fg-text2':'#8892a4','--fg-hover':'rgba(0,201,167,.05)','--fg-link':'#4f8ef7','--fg-shadow':'rgba(0,0,0,.7)' },
    inferno:  { name:'Inferno',  emoji:'&#x1F525;', '--fg-bg':'#1c1f27','--fg-bg2':'#13151c','--fg-bg3':'#252831','--fg-border':'#2c2f3c','--fg-accent':'#f5a623','--fg-accent2':'#e8700a','--fg-text':'#e2e8f0','--fg-text2':'#8892a4','--fg-hover':'rgba(245,166,35,.05)','--fg-link':'#4f8ef7','--fg-shadow':'rgba(0,0,0,.7)' },
    sakura:   { name:'Sakura',   emoji:'&#x1F338;', '--fg-bg':'#fdf2f8','--fg-bg2':'#fce7f3','--fg-bg3':'#ffffff','--fg-border':'#f9a8d4','--fg-accent':'#ec4899','--fg-accent2':'#db2777','--fg-text':'#1f2937','--fg-text2':'#6b7280','--fg-hover':'rgba(236,72,153,.07)','--fg-link':'#db2777','--fg-shadow':'rgba(236,72,153,.2)' },
    amethyst: { name:'Amethyst', emoji:'&#x1F49C;', '--fg-bg':'#faf5ff','--fg-bg2':'#f3e8ff','--fg-bg3':'#ffffff','--fg-border':'#d8b4fe','--fg-accent':'#7c3aed','--fg-accent2':'#6d28d9','--fg-text':'#1f2937','--fg-text2':'#6b7280','--fg-hover':'rgba(124,58,237,.07)','--fg-link':'#7c3aed','--fg-shadow':'rgba(124,58,237,.2)' },
    matrix:   { name:'Matrix',   emoji:'&#x1F7E2;', '--fg-bg':'#0a0f0a','--fg-bg2':'#050805','--fg-bg3':'#0f1a0f','--fg-border':'#1a3d1a','--fg-accent':'#00ff41','--fg-accent2':'#00cc34','--fg-text':'#ccffcc','--fg-text2':'#4dff77','--fg-hover':'rgba(0,255,65,.05)','--fg-link':'#00ff41','--fg-shadow':'rgba(0,255,65,.3)' },
    midnight: { name:'Midnight', emoji:'&#x1F319;', '--fg-bg':'#0f172a','--fg-bg2':'#080d1a','--fg-bg3':'#1e293b','--fg-border':'#334155','--fg-accent':'#3b82f6','--fg-accent2':'#2563eb','--fg-text':'#e2e8f0','--fg-text2':'#94a3b8','--fg-hover':'rgba(59,130,246,.07)','--fg-link':'#60a5fa','--fg-shadow':'rgba(0,0,0,.8)' },
    crimson:  { name:'Crimson',  emoji:'&#x1F534;', '--fg-bg':'#1a0505','--fg-bg2':'#0d0202','--fg-bg3':'#2d0a0a','--fg-border':'#7f1d1d','--fg-accent':'#ef4444','--fg-accent2':'#dc2626','--fg-text':'#fecaca','--fg-text2':'#f87171','--fg-hover':'rgba(239,68,68,.07)','--fg-link':'#f87171','--fg-shadow':'rgba(0,0,0,.8)' },
    arctic:   { name:'Arctic',   emoji:'&#x274C;',  '--fg-bg':'#f0f9ff','--fg-bg2':'#e0f2fe','--fg-bg3':'#ffffff','--fg-border':'#bae6fd','--fg-accent':'#0ea5e9','--fg-accent2':'#0284c7','--fg-text':'#0c4a6e','--fg-text2':'#0369a1','--fg-hover':'rgba(14,165,233,.07)','--fg-link':'#0ea5e9','--fg-shadow':'rgba(14,165,233,.2)' },
    obsidian: { name:'Obsidian', emoji:'&#x1F5A4;', '--fg-bg':'#000000','--fg-bg2':'#0a0a0a','--fg-bg3':'#111111','--fg-border':'#1f1f1f','--fg-accent':'#06b6d4','--fg-accent2':'#0891b2','--fg-text':'#e2e8f0','--fg-text2':'#64748b','--fg-hover':'rgba(6,182,212,.05)','--fg-link':'#38bdf8','--fg-shadow':'rgba(0,0,0,.9)' },
};

function applyRSTheme(themeName) {
    var th = RS_THEMES[themeName] || RS_THEMES.teal;
    var vars = Object.keys(th).filter(function(k) { return k.indexOf('--') === 0; })
        .map(function(k) { return k + ':' + th[k]; }).join(';');
    var el = document.getElementById('rs-theme-vars');
    if (!el) { el = document.createElement('style'); el.id = 'rs-theme-vars'; document.head.appendChild(el); }
    el.textContent = '.rs-root, #rs-main-panel { ' + vars + ' }';
    localStorage.setItem('farmGod_theme', themeName);
}

function getRSCurrentTheme() {
    return localStorage.getItem('farmGod_theme') || 'teal';
}

function buildRSThemePanel() {
    var curTheme = getRSCurrentTheme();
    var items = Object.keys(RS_THEMES).map(function(key) {
        var th = RS_THEMES[key];
        return '<div class="rs-theme-item ' + (curTheme === key ? 'active' : '') + '" data-theme="' + key + '">' +
            '<div class="rs-theme-dot" style="background:linear-gradient(135deg,' + th['--fg-accent'] + ',' + th['--fg-accent2'] + ');box-shadow:0 2px 6px ' + th['--fg-shadow'] + ';"></div>' +
            '<div><div class="rs-theme-item-name">' + th.emoji + ' ' + th.name + '</div>' +
            '<div class="rs-theme-item-sub" style="color:' + th['--fg-accent'] + '">' + th['--fg-bg'] + '</div></div>' +
            '</div>';
    }).join('');
    return '<div class="rs-theme-overlay" id="rs-theme-overlay"></div>' +
        '<div class="rs-theme-panel" id="rs-theme-panel">' +
        '<div class="rs-theme-panel-head"><span>&#127912; Tema visual</span>' +
        '<button class="rs-theme-close" id="rs-theme-close" type="button">&#x2715;</button></div>' +
        '<div class="rs-theme-list">' + items + '</div></div>';
}

function bindRSThemeHandlers() {
    $(document).off('click.rsTheme')
        .on('click.rsTheme', '#rs-settings-btn', function() {
            $('#rs-theme-panel, #rs-theme-overlay').addClass('open');
        })
        .on('click.rsTheme', '#rs-theme-close, #rs-theme-overlay', function() {
            $('#rs-theme-panel, #rs-theme-overlay').removeClass('open');
        })
        .on('click.rsTheme', '.rs-theme-item', function() {
            var name = $(this).data('theme');
            applyRSTheme(name);
            $('.rs-theme-item').removeClass('active');
            $(this).addClass('active');
        });
}

// ── CSS ──────────────────────────────────────────────────────
function injectRSCSS() {
    if (document.getElementById("rs-raba-style")) return;
    applyRSTheme(getRSCurrentTheme());
    var style = document.createElement("style");
    style.id = "rs-raba-style";
    style.textContent = `
/* ===== Reset ===== */
.rs-root *, .rs-root *::before, .rs-root *::after { box-sizing: border-box; }

/* ===== Overlay ===== */
.rs-overlay { position:fixed; inset:0; z-index:99999; display:flex; align-items:center; justify-content:center; background:rgba(10,12,18,0.72); backdrop-filter:blur(4px); animation:rsFadeIn .18s ease; }
@keyframes rsFadeIn { from{opacity:0} to{opacity:1} }

/* ===== Modal ===== */
.rs-modal { position:relative; width:min(700px,96vw); max-height:92vh; display:flex; flex-direction:column; overflow:hidden; background:var(--fg-bg); border:1px solid var(--fg-border); border-radius:16px; box-shadow:0 24px 64px var(--fg-shadow); }
.rs-modal-sm { width:min(440px,94vw); }
.rs-modal-lg { width:min(860px,96vw); max-height:94vh; }

/* ===== Header ===== */
.rs-head { display:flex; align-items:center; gap:10px; padding:16px 18px; background:var(--fg-bg2); border-bottom:1px solid var(--fg-border); flex-shrink:0; position:relative; overflow:hidden; }
.rs-head::before { content:""; position:absolute; top:-40px; right:-40px; width:160px; height:160px; background:radial-gradient(circle,var(--fg-accent) 0%,transparent 70%); opacity:.06; pointer-events:none; }
.rs-head-icon { width:38px; height:38px; border-radius:10px; flex-shrink:0; background:linear-gradient(135deg,var(--fg-accent),var(--fg-accent2)); display:flex; align-items:center; justify-content:center; font-size:18px; line-height:1; box-shadow:0 4px 12px var(--fg-shadow); }
.rs-head-title { font-size:16px; font-weight:800; color:var(--fg-text); letter-spacing:-.2px; }
.rs-head-sub   { font-size:11px; color:var(--fg-text2); margin-top:2px; }
.rs-head-close { margin-left:auto; background:transparent; border:1.5px solid var(--fg-border); color:var(--fg-text2); width:28px; height:28px; border-radius:8px; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; transition:background .15s,color .15s,border-color .15s; }
.rs-head-close:hover { background:#ef4444; color:#fff; border-color:#ef4444; }
.rs-settings-btn { background:transparent; border:1.5px solid var(--fg-border); color:var(--fg-text2); width:28px; height:28px; border-radius:8px; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; transition:border-color .15s,color .15s,transform .3s; }
.rs-settings-btn:hover { border-color:var(--fg-accent); color:var(--fg-accent); transform:rotate(60deg); }
.rs-head-btn { background:transparent; border:1.5px solid var(--fg-border); color:var(--fg-text2); width:28px; height:28px; border-radius:8px; cursor:pointer; font-size:13px; font-weight:700; display:flex; align-items:center; justify-content:center; transition:background .15s,color .15s,border-color .15s; }
.rs-head-btn:hover { background:var(--fg-accent); color:var(--fg-bg2); border-color:var(--fg-accent); }

/* ===== Body ===== */
.rs-body { flex:1; overflow-y:auto; padding:18px; }
.rs-body::-webkit-scrollbar { width:6px; }
.rs-body::-webkit-scrollbar-thumb { background:var(--fg-border); border-radius:10px; }
.rs-body::-webkit-scrollbar-track { background:transparent; }

/* ===== Footer ===== */
.rs-footer { padding:9px 18px; background:var(--fg-bg2); border-top:1px solid var(--fg-border); font-size:10px; color:var(--fg-text2); text-align:center; flex-shrink:0; }

/* ===== Form inputs ===== */
.rs-label { display:block; font-size:11px; font-weight:600; color:var(--fg-text2); text-transform:uppercase; letter-spacing:.6px; margin-bottom:6px; }
.rs-input { width:100%; padding:8px 11px; background:var(--fg-bg3); border:1.5px solid var(--fg-border); border-radius:8px; color:var(--fg-text); font-size:13px; outline:none; transition:border-color .15s; }
.rs-input:focus { border-color:var(--fg-accent); }
.rs-form-row { display:flex; gap:12px; margin-bottom:14px; }
.rs-form-col { flex:1; }

/* ===== Buttons ===== */
.rs-btn { padding:8px 18px; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; transition:opacity .15s,transform .1s; }
.rs-btn:active { transform:scale(.97); }
.rs-btn-primary { background:linear-gradient(135deg,var(--fg-accent),var(--fg-accent2)); color:var(--fg-bg2); font-weight:700; position:relative; overflow:hidden; }
.rs-btn-primary::after { content:""; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent); transform:translateX(-100%); transition:transform .4s; }
.rs-btn-primary:hover::after { transform:translateX(100%); }
.rs-btn-primary:hover { opacity:.9; }
.rs-btn-secondary { background:var(--fg-bg3); border:1.5px solid var(--fg-border); color:var(--fg-text); }
.rs-btn-secondary:hover { border-color:var(--fg-accent); color:var(--fg-accent); }

/* ===== Target card ===== */
.rs-target-card { display:flex; align-items:center; gap:14px; padding:13px 15px; margin-bottom:16px; background:var(--fg-bg3); border:1px solid var(--fg-border); border-radius:12px; }
.rs-target-card img { width:38px; height:38px; border-radius:8px; }
.rs-target-info { flex:1; min-width:0; }
.rs-target-name { font-size:14px; font-weight:700; color:var(--fg-text); }
.rs-target-sub  { font-size:12px; color:var(--fg-text2); margin-top:3px; }
.rs-res-badges  { display:flex; gap:8px; margin-top:8px; flex-wrap:wrap; }
.rs-res-badge   { font-size:11px; font-weight:600; padding:3px 10px; border-radius:20px; }
.rs-badge-wood  { background:rgba(168,192,96,.15);  color:#a8c060; border:1px solid rgba(168,192,96,.3); }
.rs-badge-stone { background:rgba(176,160,144,.15); color:#b0a090; border:1px solid rgba(176,160,144,.3); }
.rs-badge-iron  { background:rgba(144,176,200,.15); color:#90b0c8; border:1px solid rgba(144,176,200,.3); }

/* ===== Settings bar ===== */
.rs-settings-bar { display:flex; gap:10px; align-items:flex-end; margin-bottom:16px; padding:13px 15px; background:var(--fg-bg3); border:1px solid var(--fg-border); border-radius:12px; }
.rs-settings-bar .rs-form-col { margin:0; }

/* ===== Help blocks ===== */
.rs-help-block { background:var(--fg-bg3); border:1px solid var(--fg-border); border-radius:10px; padding:12px 14px; }
.rs-help-tag { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:var(--fg-accent); margin-bottom:6px; }
.rs-help-p { font-size:13px; color:var(--fg-text2); line-height:1.6; margin:0; }
.rs-help-p strong { color:var(--fg-text); }
.rs-help-p em { color:var(--fg-link); font-style:normal; }

/* ===== Panel principal ===== */
#rs-main-panel { position:relative; background:var(--fg-bg); border:1px solid var(--fg-border); border-radius:16px; margin:12px 0; overflow:hidden; }

/* ===== Cards de envío ===== */
.rs-cards-section { border-radius:12px; overflow:hidden; border:1px solid var(--fg-border); }
.rs-cards-head { padding:10px 14px; background:var(--fg-bg2); border-bottom:1px solid var(--fg-border); display:flex; align-items:center; gap:8px; }
.rs-cards-title { font-size:11px; font-weight:700; color:var(--fg-text2); text-transform:uppercase; letter-spacing:.5px; flex:1; }
.rs-cards-badge { display:inline-flex; align-items:center; justify-content:center; min-width:20px; height:18px; padding:0 6px; background:var(--fg-accent); color:var(--fg-bg2); border-radius:9px; font-size:10px; font-weight:800; }
.rs-cards-grid { padding:10px; display:grid; grid-template-columns:repeat(auto-fill,minmax(148px,1fr)); gap:7px; background:var(--fg-bg); }
.rs-village-card { background:var(--fg-bg3); border:1.5px solid var(--fg-border); border-radius:10px; overflow:hidden; display:flex; flex-direction:column; transition:border-color .18s,transform .15s,box-shadow .18s; }
.rs-village-card:hover { border-color:var(--fg-accent); transform:translateY(-2px); box-shadow:0 6px 18px var(--fg-shadow); }
.rs-vc-head { padding:9px 11px 8px; background:linear-gradient(135deg,var(--fg-accent),var(--fg-accent2)); display:flex; align-items:flex-start; justify-content:space-between; gap:5px; }
.rs-vc-name { font-size:11px; font-weight:700; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,.3); flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0; }
.rs-vc-name a { color:inherit; text-decoration:none; }
.rs-vc-dist { font-size:10px; font-weight:600; padding:2px 6px; background:rgba(0,0,0,.25); border-radius:7px; color:#fff; flex-shrink:0; white-space:nowrap; }
.rs-vc-body { padding:7px 10px; display:flex; flex-direction:column; gap:2px; flex:1; }
.rs-vc-res { display:flex; align-items:center; gap:4px; font-size:11px; line-height:1.55; }
.rs-vc-res-val { font-weight:600; }
.rs-vc-foot { padding:6px 8px; border-top:1px solid var(--fg-border); }
.rs-btn-send-card { width:100%; padding:5px 8px; border:none; border-radius:6px; background:var(--fg-bg2); color:var(--fg-text2); font-size:10px; font-weight:700; cursor:pointer; transition:background .15s,color .15s; }
.rs-btn-send-card:hover { background:var(--fg-accent); color:var(--fg-bg2); }
.rs-btn-send-card:disabled { opacity:.4; cursor:not-allowed; }

/* ===== Theme panel ===== */
.rs-theme-overlay { position:absolute; inset:0; background:rgba(0,0,0,.45); backdrop-filter:blur(3px); z-index:9; opacity:0; pointer-events:none; transition:opacity .22s; }
.rs-theme-overlay.open { opacity:1; pointer-events:all; }
.rs-theme-panel { position:absolute; top:0; right:0; bottom:0; width:220px; background:var(--fg-bg2); border-left:1px solid var(--fg-border); z-index:10; display:flex; flex-direction:column; transform:translateX(100%); transition:transform .25s cubic-bezier(.4,0,.2,1); }
.rs-theme-panel.open { transform:translateX(0); }
.rs-theme-panel-head { padding:14px 16px; border-bottom:1px solid var(--fg-border); display:flex; align-items:center; justify-content:space-between; }
.rs-theme-panel-head span { font-size:13px; font-weight:700; color:var(--fg-text); }
.rs-theme-close { width:24px; height:24px; border:1px solid var(--fg-border); border-radius:6px; background:transparent; color:var(--fg-text2); cursor:pointer; font-size:11px; display:flex; align-items:center; justify-content:center; transition:border-color .1s,color .1s; }
.rs-theme-close:hover { border-color:var(--fg-accent); color:var(--fg-accent); }
.rs-theme-list { padding:10px; display:flex; flex-direction:column; gap:5px; overflow-y:auto; flex:1; }
.rs-theme-item { display:flex; align-items:center; gap:10px; padding:9px 11px; border-radius:8px; border:1.5px solid transparent; cursor:pointer; transition:border-color .15s,background .15s; background:var(--fg-bg3); }
.rs-theme-item:hover { border-color:var(--fg-border); }
.rs-theme-item.active { border-color:var(--fg-accent) !important; }
.rs-theme-dot { width:26px; height:26px; border-radius:7px; flex-shrink:0; }
.rs-theme-item-name { font-size:12px; font-weight:600; color:var(--fg-text); }
.rs-theme-item-sub { font-size:10px; margin-top:1px; }
    `;
    document.head.appendChild(style);
}

// ── Helpers ──────────────────────────────────────────────────
function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x)) x = x.replace(pattern, "$1.$2");
    return x;
}

function checkDistance(x1, y1, x2, y2) {
    var a = x1 - x2, b = y1 - y2;
    return Math.round(Math.hypot(a, b));
}

function rsFooter() {
    return `<div class="rs-footer">⚔️ Creado por <strong>rabagalan73</strong> para la reina <strong>M0bscene</strong> ⚔️</div>`;
}

// ── sessionStorage ───────────────────────────────────────────
if ("resLimit" in sessionStorage) {
    resLimit = parseInt(sessionStorage.getItem("resLimit", resLimit));
} else {
    sessionStorage.setItem("resLimit", resLimit);
}

// ── Petición de datos de aldeas ──────────────────────────────
var URLReq;
if (game_data.player.sitter > 0) {
    URLReq = `game.php?t=${game_data.player.id}&screen=overview_villages&mode=prod&page=-1&`;
} else {
    URLReq = "game.php?&screen=overview_villages&mode=prod&page=-1&";
}

$.get(URLReq).done(function (page) {
    if ($("#mobileHeader")[0]) {
        allWoodObjects  = $(page).find(".res.mwood,.warn_90.mwood,.warn.mwood");
        allClayObjects  = $(page).find(".res.mstone,.warn_90.mstone,.warn.mstone");
        allIronObjects  = $(page).find(".res.miron,.warn_90.miron,.warn.miron");
        var allWarehouses = $(page).find(".mheader.ressources");
        allVillages     = $(page).find(".quickedit-vn");
        var allFarms    = $(page).find(".header.population");
        var allMerchants= $(page).find('a[href*="market"]');

        for (var i = 0; i < allWoodObjects.length; i++) {
            allWoodTotals.push(allWoodObjects[i].textContent.replace(/\./g,'').replace(',',''));
        }
        for (var i = 0; i < allClayObjects.length; i++) {
            allClayTotals.push(allClayObjects[i].textContent.replace(/\./g,'').replace(',',''));
        }
        for (var i = 0; i < allIronObjects.length; i++) {
            allIronTotals.push(allIronObjects[i].textContent.replace(/\./g,'').replace(',',''));
        }
        for (var i = 0; i < allVillages.length; i++) {
            warehouseCapacity.push(allWarehouses[i].parentElement.innerText);
            for (var j = 1; j < allMerchants.length; j++) {
                availableMerchants.push(allMerchants[j].innerText);
            }
            totalMerchants.push("999");
            farmSpaceUsed.push(allFarms[i].parentElement.innerText.match(/(\d*)\/(\d*)/)[1]);
            farmSpaceTotal.push(allFarms[i].parentElement.innerText.match(/(\d*)\/(\d*)/)[2]);
        }
    } else {
        allWoodObjects = $(page).find(".res.wood,.warn_90.wood,.warn.wood");
        allClayObjects = $(page).find(".res.stone,.warn_90.stone,.warn.stone");
        allIronObjects = $(page).find(".res.iron,.warn_90.iron,.warn.iron");
        allVillages    = $(page).find(".quickedit-vn");

        for (var i = 0; i < allWoodObjects.length; i++) {
            allWoodTotals.push(allWoodObjects[i].textContent.replace(/\./g,'').replace(',',''));
        }
        for (var i = 0; i < allClayObjects.length; i++) {
            allClayTotals.push(allClayObjects[i].textContent.replace(/\./g,'').replace(',',''));
        }
        for (var i = 0; i < allIronObjects.length; i++) {
            allIronTotals.push(allIronObjects[i].textContent.replace(/\./g,'').replace(',',''));
        }
        for (var i = 0; i < allVillages.length; i++) {
            warehouseCapacity.push(allIronObjects[i].parentElement.nextElementSibling.innerHTML);
            availableMerchants.push(allIronObjects[i].parentElement.nextElementSibling.nextElementSibling.innerText.match(/(\d*)\/(\d*)/)[1]);
            totalMerchants.push(allIronObjects[i].parentElement.nextElementSibling.nextElementSibling.innerText.match(/(\d*)\/(\d*)/)[2]);
            farmSpaceUsed.push(allIronObjects[i].parentElement.nextElementSibling.nextElementSibling.nextElementSibling.innerText.match(/(\d*)\/(\d*)/)[1]);
            farmSpaceTotal.push(allIronObjects[i].parentElement.nextElementSibling.nextElementSibling.nextElementSibling.innerText.match(/(\d*)\/(\d*)/)[2]);
        }
    }

    for (var i = 0; i < allVillages.length; i++) {
        villagesData.push({
            id                : allVillages[i].dataset.id,
            url               : allVillages[i].children[0].children[0].href,
            coord             : allVillages[i].innerText.trim().match(/\d+\|\d+/)[0],
            name              : allVillages[i].innerText.trim(),
            wood              : allWoodTotals[i],
            stone             : allClayTotals[i],
            iron              : allIronTotals[i],
            availableMerchants: availableMerchants[i],
            totalMerchants    : totalMerchants[i],
            warehouseCapacity : warehouseCapacity[i],
            farmSpaceUsed     : farmSpaceUsed[i],
            farmSpaceTotal    : farmSpaceTotal[i],
        });
    }
});

// ── Init ─────────────────────────────────────────────────────
injectRSCSS();
askCoordinate();

// ── Modal: pedir coordenada inicial ─────────────────────────
function askCoordinate() {
    var html = `
    <div class="rs-overlay rs-root" id="rs-coord-overlay">
      <div class="rs-modal rs-modal-sm">
        <div class="rs-head">
          <div class="rs-head-icon">&#x2694;&#xFE0F;</div>
          <div>
            <div class="rs-head-title">${langShinko[0]}</div>
            <div class="rs-head-sub">${langShinko[1]}</div>
          </div>
        </div>
        <div class="rs-body">
          <label class="rs-label">${langShinko[7]}</label>
          <input class="rs-input" type="text" id="rs-coord-input" placeholder="500|500" style="margin-bottom:16px;">
          <div style="display:flex;justify-content:flex-end;">
            <button class="rs-btn rs-btn-primary" id="rs-coord-save">&#x2694;&#xFE0F; ${langShinko[2]}</button>
          </div>
        </div>
        ${rsFooter()}
      </div>
    </div>`;

    $("body").append(html);

    $("#rs-coord-save").on("click", function () {
        var val = $("#rs-coord-input").val();
        var match = val.match(/\d+\|\d+/);
        if (!match) { alert(langShinko[22]); return; }
        coordinate = match[0];
        sessionStorage.setItem("coordinate", coordinate);
        $("#rs-coord-overlay").remove();
        coordToId(coordinate);
    });
}

// ── Panel principal ──────────────────────────────────────────
function createList() {
    $("#rs-main-panel").remove();

    var targetImg    = sendBack[2] || "";
    var targetName   = sendBack[1] || "";
    var targetPlayer = sendBack[3] || "";
    var targetPts    = sendBack[4] || "";

    // Construir y ordenar datos por distancia
    var cardData = [];
    for (var i = 0; i < villagesData.length; i++) {
        var res = calculateResAmounts(
            villagesData[i].wood, villagesData[i].stone,
            villagesData[i].iron, villagesData[i].warehouseCapacity,
            villagesData[i].availableMerchants
        );
        if (res.wood + res.stone + res.iron === 0) continue;
        if (villagesData[i].id == sendBack[0]) continue;
        var coords = villagesData[i].coord.split('|');
        var dist = checkDistance(sendBack[5], sendBack[6], coords[0], coords[1]);
        cardData.push({ v: villagesData[i], res: res, dist: dist, idx: i });
    }
    cardData.sort(function(a, b) { return a.dist - b.dist; });

    // Construir cards
    var cards = cardData.map(function(d) {
        return `<div class="rs-village-card" id="rs-card-${d.idx}">
            <div class="rs-vc-head">
                <span class="rs-vc-name"><a href="${d.v.url}">${d.v.name}</a></span>
                <span class="rs-vc-dist">${d.dist}</span>
            </div>
            <div class="rs-vc-body">
                <div class="rs-vc-res"><span style="color:#a8c060">&#x1FAB5;</span><span class="rs-vc-res-val" style="color:#a8c060">&nbsp;${numberWithCommas(d.res.wood)}</span></div>
                <div class="rs-vc-res"><span style="color:#b0a090">&#x1F9F1;</span><span class="rs-vc-res-val" style="color:#b0a090">&nbsp;${numberWithCommas(d.res.stone)}</span></div>
                <div class="rs-vc-res"><span style="color:#90b0c8">&#x2699;&#xFE0F;</span><span class="rs-vc-res-val" style="color:#90b0c8">&nbsp;${numberWithCommas(d.res.iron)}</span></div>
            </div>
            <div class="rs-vc-foot">
                <button class="rs-btn-send-card" onclick="sendResource(${d.v.id},${sendBack[0]},${d.res.wood},${d.res.stone},${d.res.iron},${d.idx})">${langShinko[17]}</button>
            </div>
        </div>`;
    }).join('');

    var panel = `
    <div id="rs-main-panel" class="rs-root">
      <div class="rs-head">
        <div class="rs-head-icon">&#x2694;&#xFE0F;</div>
        <div style="flex:1;">
          <div class="rs-head-title">${langShinko[10]}</div>
          <div class="rs-head-sub">${langShinko[0]}</div>
        </div>
        <button class="rs-settings-btn" id="rs-settings-btn" type="button" title="Tema visual">&#9881;</button>
        <button class="rs-head-btn" id="rs-help-btn" title="Ayuda">?</button>
      </div>

      <div class="rs-body">
        <div class="rs-target-card">
          <img src="${targetImg}" onerror="this.style.display='none'">
          <div class="rs-target-info">
            <div class="rs-target-name">${targetName}</div>
            <div class="rs-target-sub">${langShinko[4]}: ${targetPlayer} &nbsp;&middot;&nbsp; ${langShinko[6]}: ${numberWithCommas(targetPts)}</div>
            <div class="rs-res-badges" style="margin-top:8px;">
              <span class="rs-res-badge rs-badge-wood">&#x1FAB5; ${langShinko[18]}: <span id="rs-wood-sent">0</span></span>
              <span class="rs-res-badge rs-badge-stone">&#x1F9F1; ${langShinko[18]}: <span id="rs-stone-sent">0</span></span>
              <span class="rs-res-badge rs-badge-iron">&#x2699;&#xFE0F; ${langShinko[18]}: <span id="rs-iron-sent">0</span></span>
            </div>
          </div>
        </div>

        <div class="rs-settings-bar">
          <div class="rs-form-col">
            <label class="rs-label">${langShinko[7]}</label>
            <input class="rs-input" type="text" id="rs-coord-target" value="${coordinate}" placeholder="500|500">
          </div>
          <div class="rs-form-col" style="max-width:120px;">
            <label class="rs-label">${langShinko[8]}</label>
            <input class="rs-input" type="number" id="rs-res-percent" value="${resLimit}" min="0" max="100" style="width:100%;">
          </div>
          <button class="rs-btn rs-btn-secondary" id="rs-save-btn">${langShinko[2]}</button>
          <button class="rs-btn rs-btn-primary" id="rs-redo-btn">&#8635; ${langShinko[9]}</button>
        </div>

        <div class="rs-cards-section">
          <div class="rs-cards-head">
            <span class="rs-cards-title">${langShinko[11]}</span>
            <span class="rs-cards-badge">${cardData.length}</span>
          </div>
          <div class="rs-cards-grid" id="rs-cards-grid">${cards}</div>
        </div>
      </div>

      ${rsFooter()}
      ${buildRSThemePanel()}
    </div>`;

    $("#mobileHeader").eq(0).prepend(panel);
    $("#contentContainer").eq(0).prepend(panel);

    function applyInputsAndRedo() {
        var matchCoord = $("#rs-coord-target").val().match(/\d+\|\d+/);
        if (!matchCoord) { alert(langShinko[22]); return; }
        coordinate = matchCoord[0];
        sessionStorage.setItem("coordinate", coordinate);
        resLimit = parseInt($("#rs-res-percent").val()) || 0;
        sessionStorage.setItem("resLimit", resLimit);
        reDo();
    }

    $("#rs-save-btn").on("click", applyInputsAndRedo);
    $("#rs-redo-btn").on("click", applyInputsAndRedo);
    $("#rs-help-btn").on("click", showRSHelp);
    bindRSThemeHandlers();

    var firstBtn = $(".rs-btn-send-card")[0];
    if (firstBtn) firstBtn.focus();
}

// ── Enviar recursos ──────────────────────────────────────────
function sendResource(sourceID, targetID, woodAmount, stoneAmount, ironAmount, rowNr) {
    $(".rs-btn-send-card").prop("disabled", true);

    setTimeout(function () {
        $("#rs-card-" + rowNr).remove();
        $(".rs-btn-send-card").prop("disabled", false);
        var firstBtn = $(".rs-btn-send-card")[0];
        if (firstBtn) firstBtn.focus();

        var remaining = $(".rs-village-card").length;
        if (remaining === 0) {
            showRSAlert(langShinko[21]);
        }
    }, 200);

    TribalWars.post("market", { ajaxaction: "map_send", village: sourceID },
        { target_id: targetID, wood: woodAmount, stone: stoneAmount, iron: ironAmount },
        function (e) {
            Dialog.close();
            UI.SuccessMessage(e.message);
            totalWoodSent  += woodAmount;
            totalStoneSent += stoneAmount;
            totalIronSent  += ironAmount;
            $("#rs-wood-sent").text(numberWithCommas(totalWoodSent));
            $("#rs-stone-sent").text(numberWithCommas(totalStoneSent));
            $("#rs-iron-sent").text(numberWithCommas(totalIronSent));
        }, !1
    );
}

// ── Alert modal ──────────────────────────────────────────────
function showRSHelp() {
    if ($("#rs-help-overlay")[0]) return;
    var html = `
    <div class="rs-overlay rs-root" id="rs-help-overlay">
      <div class="rs-modal rs-modal-sm">
        <div class="rs-head">
          <div class="rs-head-icon">?</div>
          <div style="flex:1;">
            <div class="rs-head-title">Ayuda — Envío de recursos</div>
            <div class="rs-head-sub">Cómo usar el script</div>
          </div>
          <button class="rs-head-btn" id="rs-help-close">✕</button>
        </div>
        <div class="rs-body" style="display:flex;flex-direction:column;gap:14px;">

          <div class="rs-help-block">
            <div class="rs-help-tag">1 · Coordenada de destino</div>
            <p class="rs-help-p">Introduce las coordenadas de la aldea a la que quieres enviar recursos (formato <strong>X|Y</strong>, ej: <em>500|500</em>). El script buscará automáticamente los datos de esa aldea.</p>
          </div>

          <div class="rs-help-block">
            <div class="rs-help-tag">2 · Mantener % de almacén</div>
            <p class="rs-help-p">Porcentaje mínimo de almacén que se conservará en cada aldea origen. Con <strong>0%</strong> se envía todo lo disponible. Con <strong>20%</strong> se deja un 20% del almacén en cada aldea antes de calcular el envío.</p>
          </div>

          <div class="rs-help-block">
            <div class="rs-help-tag">3 · Guardar / Recalcular</div>
            <p class="rs-help-p">Ambos botones aplican los cambios de coordenada y porcentaje y regeneran la tabla de envíos. Úsalos cuando cambies el destino o el % de almacén.</p>
          </div>

          <div class="rs-help-block">
            <div class="rs-help-tag">4 · Tabla de envíos</div>
            <p class="rs-help-p">Lista todas las aldeas propias que tienen recursos disponibles para enviar, ordenadas por distancia al destino. Pulsa <strong>"Enviar recursos"</strong> en cada fila para ejecutar el envío. La fila desaparece tras el envío y el contador superior se actualiza.</p>
          </div>

          <div class="rs-help-block">
            <div class="rs-help-tag">5 · Proporciones de recursos</div>
            <p class="rs-help-p">Los recursos se envían en proporción fija optimizada para acuñación de monedas: <strong>Madera 28k · Barro 30k · Hierro 25k</strong> por cada 83k de capacidad de mercaderes. Si algún recurso escasea, la proporción se ajusta automáticamente hacia abajo.</p>
          </div>

        </div>
        ${rsFooter()}
      </div>
    </div>`;

    $("body").append(html);
    $("#rs-help-close").on("click", function () { $("#rs-help-overlay").remove(); });
    $("#rs-help-overlay").on("click", function (e) {
        if ($(e.target).is("#rs-help-overlay")) $("#rs-help-overlay").remove();
    });
}

function showRSAlert(msg) {
    var html = `
    <div class="rs-overlay rs-root" id="rs-alert-overlay">
      <div class="rs-modal rs-modal-sm">
        <div class="rs-head">
          <div class="rs-head-icon">✅</div>
          <div><div class="rs-head-title">${langShinko[19]}</div></div>
        </div>
        <div class="rs-body" style="text-align:center;padding:30px 20px;">
          <p style="color:${RS.textMain};font-size:14px;margin-bottom:20px;">${msg}</p>
          <button class="rs-btn rs-btn-primary" id="rs-alert-close">${langShinko[20]}</button>
        </div>
        ${rsFooter()}
      </div>
    </div>`;
    $("body").append(html);
    $("#rs-alert-close").on("click", function () { $("#rs-alert-overlay").remove(); });
}

// ── Lógica de cálculo ────────────────────────────────────────
function calculateResAmounts(wood, stone, iron, warehouse, merchants) {
    var merchantCarry = merchants * 1000;
    var leaveBehind   = Math.floor(warehouse / 100 * resLimit);
    var localWood  = Math.max(0, wood  - leaveBehind);
    var localStone = Math.max(0, stone - leaveBehind);
    var localIron  = Math.max(0, iron  - leaveBehind);

    var mWood  = merchantCarry * woodPercentage;
    var mStone = merchantCarry * stonePercentage;
    var mIron  = merchantCarry * ironPercentage;

    var perc = 1;
    if (mWood > localWood) {
        perc = localWood / mWood;
        mWood *= perc; mStone *= perc; mIron *= perc;
    }
    if (mStone > localStone) {
        perc = localStone / mStone;
        mWood *= perc; mStone *= perc; mIron *= perc;
    }
    if (mIron > localIron) {
        perc = localIron / mIron;
        mWood *= perc; mStone *= perc; mIron *= perc;
    }

    return { wood: Math.floor(mWood), stone: Math.floor(mStone), iron: Math.floor(mIron) };
}

function coordToId(coord) {
    var url;
    if (game_data.player.sitter > 0) {
        url = `game.php?t=${game_data.player.id}&screen=api&ajax=target_selection&input=${coord}&type=coord`;
    } else {
        url = `/game.php?&screen=api&ajax=target_selection&input=${coord}&type=coord`;
    }
    $.get(url, function (json) {
        var d = (parseFloat(game_data.majorVersion) > 8.217) ? json : JSON.parse(json);
        sendBack = [d.villages[0].id, d.villages[0].name, d.villages[0].image,
                    d.villages[0].player_name, d.villages[0].points,
                    d.villages[0].x, d.villages[0].y];
        createList();
    });
}

function reDo() {
    coordToId(coordinate);
}

// ── Ordenar tabla por distancia ──────────────────────────────
function sortTableTest(n) {
    var table = document.getElementById("rs-send-table");
    if (!table) return;
    var switching = true, dir = "asc", switchcount = 0;
    while (switching) {
        switching = false;
        var rows = table.rows;
        for (var i = 1; i < rows.length - 1; i++) {
            var x = rows[i].getElementsByTagName("td")[n];
            var y = rows[i + 1].getElementsByTagName("td")[n];
            var shouldSwitch = false;
            if (dir === "asc"  && Number(x.innerText) > Number(y.innerText)) shouldSwitch = true;
            if (dir === "desc" && Number(x.innerText) < Number(y.innerText)) shouldSwitch = true;
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount++;
                break;
            }
        }
        if (!shouldSwitch && switchcount === 0 && dir === "asc") {
            dir = "desc";
            switching = true;
        }
    }
}
