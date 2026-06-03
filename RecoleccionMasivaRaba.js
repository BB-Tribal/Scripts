javascript:
//mass scavenging - Adaptado por rabagalan73
serverTimeTemp = $("#serverDate")[0].innerText + " " + $("#serverTime")[0].innerText;
serverTime = serverTimeTemp.match(/^([0][1-9]|[12][0-9]|3[01])[\/\-]([0][1-9]|1[012])[\/\-](\d{4})( (0?[0-9]|[1][0-9]|[2][0-3])[:]([0-5][0-9])([:]([0-5][0-9]))?)?$/);
serverDate = Date.parse(serverTime[3] + "/" + serverTime[2] + "/" + serverTime[1] + serverTime[4]);
var is_mobile = !!navigator.userAgent.match(/iphone|android|blackberry/ig) || false;
var scavengeInfo;
var tempElementSelection="";

//relocate to mass scavenging page
if (window.location.href.indexOf('screen=place&mode=scavenge_mass') < 0) {
    //relocate
    window.location.assign(game_data.link_base_pure + "place&mode=scavenge_mass");
}

$("#massScavengeSophie").remove();
//set global variables

if (typeof version == 'undefined') {
    version = "new";
}


//set translations
var langShinko = [
    "Mass scavenging",
    "Select unit types/ORDER to scavenge with (drag units to order)",
    "Select categories to use",
    "When do you want your scav runs to return (approximately)?",
    "Runtime here",
    "Calculate runtimes for each page",
    "Creator: ",
    "Mass scavenging: send per 50 villages",
    "Launch group "
]

if (game_data.locale == "ro_RO") {
    //romanian server
    langShinko = [
        "Curatare in masa",
        "Selecteaza tipul unitatii/ORDONEAZA sa curete cu (trage unitatea pentru a ordona)",
        "Selecteaza categoria",
        "Cand vrei sa se intoarca trupele de la curatare (aproximativ)",
        "Durata aici",
        "Calculeaza durata pentru fiecare pagina",
        "Creator: ",
        "Cueatare in masa: trimite pe 50 de sate",
        "Lanseaza grup "
    ]
}
if (game_data.locale == "ar_AE") {
    //arabic server
    langShinko = [
        "الاغارات",
        "اختار الوحدات المستخدمة فى الاغارات",
        "اختار انواع   الاغارات المستخدمة ",
        " ما المده المده الزمنيه المراد ارسال الاغارات بها",
        "ضع االمده هنا",
        "حساب المده لكل صفحه ",
        "Creator: ",
        "الاغارات : ترسل لكل 50 قريه على حدى ",
        " تشغيل المجموعة "
    ]
}
if (game_data.locale == "el_GR") {
    //greek server
    langShinko = [
        "Μαζική σάρωση",
        "Επιλέξτε τις μονάδες με τις οποίες θα κάνετε σάρωση",
        "Επιλέξτε επίπεδα σάρωσης που θα χρησιμοποιηθούν",
        "Χρόνος Σάρωσης (Ώρες.Λεπτά)",
        "Χρόνος",
        "Υπολόγισε χρόνους σάρωσης για κάθε σελίδα.",
        "Δημιουργός: ",
        "Μαζική σάρωση: Αποστολή ανα 50 χωριά",
        "Αποστολή ομάδας "
    ]
}
if (game_data.locale == "nl_NL") {
    //dutch server
    langShinko = [
        "Massa rooftochten",
        "Kies welke troeptypes je wil mee roven, sleep om prioriteit te ordenen",
        "Kies categorieën die je wil gebruiken",
        "Wanneer wil je dat je rooftochten terug zijn?",
        "Looptijd hier invullen",
        "Bereken rooftochten voor iedere pagina",
        "Scripter: ",
        "Massa rooftochten: verstuur per 50 dorpen",
        "Verstuur groep "
    ]
}
if (game_data.locale == "it_IT") {
    //Italian server
    langShinko = [
        "Rovistamento di massa",
        "Seleziona i tipi da unità con cui rovistare",
        "Seleziona quali categorie utilizzare",
        "Inserisci la durata voluta dei rovistamenti in ORE",
        "Inserisci qui il tempo",
        "Calcola tempi per tutte le pagine",
        "Creatore: ",
        "Rovistamento di massa: manda su 50 villaggi",
        "Lancia gruppo"
    ]
}
if (game_data.locale == "es_ES" || game_data.locale == "es_MX" || game_data.locale == "es_AR" || game_data.locale == "es") {
    //Spanish server
    langShinko = [
        "Recolección Masiva",
        "Selecciona los tipos de tropa y el ORDEN para recolectar (arrastra para ordenar)",
        "Selecciona las categorías a usar",
        "¿Cuándo quieres que vuelvan tus recolecciones (aproximadamente)?",
        "Duración aquí",
        "Calcular tiempos para cada página",
        "Creado por: ",
        "Recolección masiva: enviar por cada 200 aldeas",
        "Lanzar grupo "
    ]
}
// Forzar español si no se detectó idioma específico y la interfaz muestra texto español
if (langShinko[0] === "Mass scavenging") {
    langShinko = [
        "Recolección Masiva",
        "Selecciona los tipos de tropa y el ORDEN para recolectar (arrastra para ordenar)",
        "Selecciona las categorías a usar",
        "¿Cuándo quieres que vuelvan tus recolecciones (aproximadamente)?",
        "Duración aquí",
        "Calcular tiempos para cada página",
        "Creado por: ",
        "Recolección masiva: enviar por cada 200 aldeas",
        "Lanzar grupo "
    ]
}

//loading settings

// troop types

if (localStorage.getItem("troopTypeEnabled") == null) {
    console.log("No troopTypeEnabled found, making new one")
    worldUnits = game_data.units;
    var troopTypeEnabled = {}
    for (var i = 0; i < worldUnits.length; i++) {
        if (worldUnits[i] != "militia" && worldUnits[i] != "snob" && worldUnits[i] != "ram" && worldUnits[i] != "catapult" && worldUnits[i] != "spy") {
            troopTypeEnabled[worldUnits[i]] = false
        }
    };
    localStorage.setItem("troopTypeEnabled", JSON.stringify(troopTypeEnabled));
}
else {
    console.log("Getting which troop types are enabled from storage");
    var troopTypeEnabled = JSON.parse(localStorage.getItem("troopTypeEnabled"));
}

// keepHome

if (localStorage.getItem("keepHome") == null) {
    console.log("No units set to keep home, creating")
    var keepHome = {
        "spear": 0,
        "sword": 0,
        "axe": 0,
        "archer": 0,
        "light": 0,
        "marcher": 0,
        "heavy": 0,
        "knight": 0
    }
    localStorage.setItem("keepHome", JSON.stringify(keepHome));
}
else {
    console.log("Grabbing which units to keep home");
    var keepHome = JSON.parse(localStorage.getItem("keepHome"));
}

// categories enabled

if (localStorage.getItem("categoryEnabled") == null) {
    console.log("No category enabled setting found, making new one")
    var categoryEnabled = [true, true, true, true];
    localStorage.setItem("categoryEnabled", JSON.stringify(categoryEnabled));
}
else {
    console.log("Getting which category types are enabled from storage");
    var categoryEnabled = JSON.parse(localStorage.getItem("categoryEnabled"));
}

//priority

if (localStorage.getItem("prioritiseHighCat") == null) {
    console.log("No priority/balance setting found, making new one")
    var prioritiseHighCat = false;
    localStorage.setItem("prioritiseHighCat", JSON.stringify(prioritiseHighCat));
}
else {
    console.log("Getting prioritiseHighCat from storage");
    var prioritiseHighCat = JSON.parse(localStorage.getItem("prioritiseHighCat"));
}

//Time element

if (localStorage.getItem("timeElement") == null) {
    console.log("No timeElement selected, use Date");
    localStorage.setItem("timeElement", "Date");
    tempElementSelection = "Date";
}
else {
    console.log("Getting which element from localstorage");
    tempElementSelection = localStorage.getItem("timeElement");

}

// sendorder

if (localStorage.getItem("sendOrder") == null) {
    console.log("No sendorder found, making new one")
    worldUnits = game_data.units;
    var sendOrder = [];
    for (var i = 0; i < worldUnits.length; i++) {
        if (worldUnits[i] != "militia" && worldUnits[i] != "snob" && worldUnits[i] != "ram" && worldUnits[i] != "catapult" && worldUnits[i] != "spy") {
            sendOrder.push(worldUnits[i])
        }
    };
    console.log(sendOrder);
    localStorage.setItem("sendOrder", JSON.stringify(sendOrder));
}
else {
    console.log("Getting sendorder from storage");
    var sendOrder = JSON.parse(localStorage.getItem("sendOrder"));
}

// Migración: añadir paladín (knight) si el mundo lo tiene y no estaba en localStorage previo
if (game_data.units.indexOf('knight') !== -1) {
    if (!keepHome.hasOwnProperty('knight')) {
        keepHome['knight'] = 0;
        localStorage.setItem('keepHome', JSON.stringify(keepHome));
    }
    if (!troopTypeEnabled.hasOwnProperty('knight')) {
        troopTypeEnabled['knight'] = false;
        localStorage.setItem('troopTypeEnabled', JSON.stringify(troopTypeEnabled));
    }
    if (sendOrder.indexOf('knight') === -1) {
        sendOrder.push('knight');
        localStorage.setItem('sendOrder', JSON.stringify(sendOrder));
    }
}

// runtimes

if (localStorage.getItem("runTimes") == null) {
    console.log("No runTimes found, making new one")
    var runTimes = {
        "off": 4,
        "def": 3
    }
    localStorage.setItem("runTimes", JSON.stringify(runTimes));
}
else {
    console.log("Getting runTimes from storage");
    var runTimes = JSON.parse(localStorage.getItem("runTimes"));
    runTimes.off = Math.round(runTimes.off * 10) / 10;
    runTimes.def = Math.round(runTimes.def * 10) / 10;
}

if (typeof premiumBtnEnabled == 'undefined') {
    var premiumBtnEnabled = false;
}

/*if (game_data.units.indexOf("archer") == -1) {
    sendOrder.splice(sendOrder.indexOf('archer'), 1);
    delete troopTypeEnabled["archer"];
}
if (game_data.units.indexOf("marcher") == -1) {
    sendOrder.splice(sendOrder.indexOf('marcher'), 1);
    delete troopTypeEnabled["marcher"];
}*/

if (game_data.player.sitter > 0) {
    URLReq = `game.php?t=${game_data.player.id}&screen=place&mode=scavenge_mass`;
}
else {
    URLReq = "game.php?&screen=place&mode=scavenge_mass";
}
var arrayWithData;
var enabledCategories = [];
var availableUnits = [];
var squad_requests = [];
var squad_requests_premium = [];
var scavengeInfo;
var duration_factor = 0;
var duration_exponent = 0;
var duration_initial_seconds = 0;
var categoryNames = JSON.parse("[" + $.find('script:contains("ScavengeMassScreen")')[0].innerHTML.match(/\{.*\:\{.*\:.*\}\}/g) + "]")[0];
//basic setting, to be safe
var time = {
    'off': 0,
    'def': 0
};



//colors for UI
if (typeof colors == 'undefined') {
    // Fondo blanco limpio, rosa solo como acento profesional
    var backgroundColor = "#ffffff";
    var borderColor = "#e8b4cb";
    var headerColor = "#fce4ec";
    var titleColor = "#880e4f";
    cssClassesSophie = `
<style>
/* ===== RECOLECCIÓN MASIVA – DISEÑO PROFESIONAL ROSA ===== */

/* Ventana principal */
#massScavengeSophie, #massScavengeFinal {
    font-family: 'Segoe UI', Tahoma, Geneva, sans-serif !important;
    background: #ffffff !important;
    border-radius: 14px !important;
    overflow: hidden !important;
    box-shadow: 0 10px 36px rgba(136,14,79,0.22), 0 2px 8px rgba(0,0,0,0.10) !important;
    border: 1.5px solid #e8b4cb !important;
    width: 620px !important;
}

@media (max-width: 700px) {
    #massScavengeSophie, #massScavengeFinal {
        width: 94vw !important;
        max-height: 88vh !important;
        overflow-y: auto !important;
        cursor: default !important;
    }
    .raba-header { padding: 12px 44px 12px 14px !important; min-height: 50px !important; }
    .raba-title { font-size: 15px !important; }
    .raba-body { padding: 10px 10px !important; }
    .raba-main-cols { flex-direction: column !important; gap: 10px !important; margin-top: 10px !important; }
    .raba-left-col, .raba-right-col { flex: unset !important; width: 100% !important; }
    .raba-troops { gap: 3px !important; padding: 2px 0 6px !important; min-height: unset !important; }
    .raba-troop-card { min-width: 38px !important; max-width: 42px !important; border-radius: 7px !important; }
    .raba-troop-img { padding: 4px 3px !important; }
    .raba-troop-img img { width: 22px !important; height: 22px !important; }
    .raba-troop-label { font-size: 7px !important; padding: 2px 0 !important; letter-spacing: 0 !important; }
    .raba-troop-input { padding: 3px 3px 4px !important; }
    .raba-troop-input input { width: 32px !important; font-size: 10px !important; padding: 2px !important; }
    .raba-troop-check { padding: 2px 0 !important; }
    #massScavengeSophie input[type="checkbox"] { width: 14px !important; height: 14px !important; }
    .raba-section-title { font-size: 9px !important; margin-bottom: 8px !important; }
    .raba-time-block { overflow: hidden !important; }
    .raba-time-row { padding: 5px 6px !important; gap: 4px !important; grid-template-columns: 26px 1fr 1fr !important; }
    .raba-time-cell { min-width: 0 !important; overflow: hidden !important; }
    .raba-time-cell input { font-size: 10px !important; padding: 3px 2px !important; min-width: 0 !important; box-sizing: border-box !important; }
    .raba-time-row input[type="text"].runTime_off,
    .raba-time-row input[type="text"].runTime_def { font-size: 11px !important; padding: 3px 2px !important; }
    .raba-time-hdr { font-size: 9px !important; padding: 5px 2px !important; }
    .raba-duration-txt { font-size: 9px !important; }
    .raba-radio-lbl { font-size: 13px !important; }
    .btnSophie, input.btnSophie { padding: 8px 16px !important; font-size: 12px !important; }
    #massScavengeSophie input[type="checkbox"] { width: 16px !important; height: 16px !important; }
    #massScavengeSophie input[type="radio"] { width: 15px !important; height: 15px !important; }
}

/* Título principal – barra rosa intensa */
#massScavengeSophieTitle,
#massScavengeFinal #massScavengeSophieTitle {
    background: linear-gradient(135deg, #e91e8c 0%, #c2185b 100%) !important;
    padding: 14px 50px !important;
}
#massScavengeSophieTitle * { color: #ffffff !important; text-decoration: none !important; }

/* Tablas: colapsar bordes, visible y limpio */
#massScavengeSophie table,
#massScavengeFinal table {
    border-collapse: collapse !important;
    width: 100% !important;
    box-shadow: none !important;
}
#massScavengeSophie table tr,
#massScavengeSophie table td,
#massScavengeFinal table tr,
#massScavengeFinal table td {
    border: 1px solid #e8b4cb !important;
}

/* Cabeceras de sub-sección: rosa suave con texto oscuro */
#massScavengeSophie td[style*="background-color:#fce4ec"],
#massScavengeSophie tr[style*="background-color:#fce4ec"] {
    background-color: #fce4ec !important;
}
#massScavengeSophie td[style*="background-color:#fce4ec"] font,
#massScavengeSophie td[style*="background-color:#fce4ec"] * {
    color: #880e4f !important;
    font-weight: 600 !important;
}

/* Filas de datos: blanco puro */
#massScavengeSophie td[style*="background-color:#ffffff"],
#massScavengeSophie tr td[style*="background-color:#ffffff"] {
    background-color: #ffffff !important;
}

/* HR separadores */
#massScavengeSophie hr {
    border: none !important;
    border-top: 2px solid #fce4ec !important;
    margin: 0 !important;
}

/* ---- Celdas de tropa individualmente con tarjeta ---- */
#imgRow {
    background: #fff8fc !important;
}
#imgRow > td {
    border: 1.5px solid #e8b4cb !important;
    border-radius: 8px !important;
    background: #ffffff !important;
    padding: 0 !important;
    margin: 3px !important;
    transition: border-color 0.15s, box-shadow 0.15s !important;
    vertical-align: top !important;
}
#imgRow > td:hover {
    border-color: #e91e8c !important;
    box-shadow: 0 2px 10px rgba(233,30,140,0.18) !important;
}
#imgRow > td > table { border: none !important; }
#imgRow > td > table tr,
#imgRow > td > table td { border: none !important; background: transparent !important; }
#imgRow > td > table tr:nth-child(1) td { background: #fce4ec !important; border-radius: 6px 6px 0 0 !important; }
#imgRow > td > table tr:nth-child(3) td { background: #fce4ec !important; font-weight: 600 !important; color: #880e4f !important; font-size: 11px !important; }

/* ---- Botones principales ---- */
.btnSophie, input.btnSophie, .btn.btnSophie {
    background: linear-gradient(135deg, #e91e8c 0%, #c2185b 100%) !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 9px 28px !important;
    font-weight: 700 !important;
    font-size: 13px !important;
    letter-spacing: 0.5px !important;
    box-shadow: 0 3px 12px rgba(194,24,91,0.35) !important;
    cursor: pointer !important;
    outline: none !important;
    transition: all 0.15s ease !important;
}
.btnSophie:hover, input.btnSophie:hover {
    background: linear-gradient(135deg, #f06292 0%, #e91e8c 100%) !important;
    box-shadow: 0 5px 18px rgba(194,24,91,0.50) !important;
    transform: translateY(-1px) !important;
}
.btnSophie:active, input.btnSophie:active {
    transform: translateY(0) !important;
    box-shadow: 0 2px 6px rgba(194,24,91,0.35) !important;
}

/* ---- Checkboxes personalizados ---- */
#massScavengeSophie input[type="checkbox"] {
    -webkit-appearance: none !important;
    appearance: none !important;
    width: 20px !important;
    height: 20px !important;
    border: 2px solid #e8b4cb !important;
    border-radius: 5px !important;
    background: #ffffff !important;
    cursor: pointer !important;
    position: relative !important;
    display: inline-block !important;
    vertical-align: middle !important;
    transition: all 0.15s !important;
}
#massScavengeSophie input[type="checkbox"]:checked {
    background: #e91e8c !important;
    border-color: #c2185b !important;
}
#massScavengeSophie input[type="checkbox"]:checked::after {
    content: "✓" !important;
    position: absolute !important;
    top: 50% !important; left: 50% !important;
    transform: translate(-50%, -50%) !important;
    color: white !important;
    font-size: 13px !important;
    font-weight: 900 !important;
    line-height: 1 !important;
}
#massScavengeSophie input[type="checkbox"]:hover { border-color: #e91e8c !important; }

/* ---- Radio buttons personalizados ---- */
#massScavengeSophie input[type="radio"] {
    -webkit-appearance: none !important;
    appearance: none !important;
    width: 18px !important;
    height: 18px !important;
    border: 2px solid #e8b4cb !important;
    border-radius: 50% !important;
    background: #ffffff !important;
    cursor: pointer !important;
    position: relative !important;
    display: inline-block !important;
    vertical-align: middle !important;
    transition: all 0.15s !important;
}
#massScavengeSophie input[type="radio"]:checked { border-color: #e91e8c !important; }
#massScavengeSophie input[type="radio"]:checked::after {
    content: "" !important;
    position: absolute !important;
    top: 50% !important; left: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: 9px !important; height: 9px !important;
    background: #e91e8c !important;
    border-radius: 50% !important;
    display: block !important;
}
#massScavengeSophie input[type="radio"]:hover { border-color: #e91e8c !important; }

/* ---- Inputs texto / fecha / hora ---- */
#massScavengeSophie input[type="text"],
#massScavengeSophie input[type="date"],
#massScavengeSophie input[type="time"] {
    border: 1.5px solid #e8b4cb !important;
    border-radius: 6px !important;
    padding: 5px 10px !important;
    background: #ffffff !important;
    color: #5d0030 !important;
    font-size: 13px !important;
    font-family: 'Segoe UI', Tahoma, sans-serif !important;
    outline: none !important;
    transition: border-color 0.15s, box-shadow 0.15s !important;
}
#massScavengeSophie input[type="text"]:focus,
#massScavengeSophie input[type="date"]:focus,
#massScavengeSophie input[type="time"]:focus {
    border-color: #e91e8c !important;
    box-shadow: 0 0 0 3px rgba(233,30,140,0.12) !important;
}

/* ---- Botón X (cerrar) ---- */
#x {
    position: absolute !important; background: #c2185b !important; color: white !important;
    top: 0 !important; right: 0 !important; width: 36px !important; height: 36px !important;
    border: none !important; font-weight: 900 !important; font-size: 14px !important;
    cursor: pointer !important; transition: background 0.15s !important;
    line-height: 36px !important; text-align: center !important;
}
#x:hover { background: #880e4f !important; }

/* ---- Botón engranaje ---- */
#cog {
    position: absolute !important; background: rgba(255,255,255,0.22) !important; color: white !important;
    top: 0 !important; right: 36px !important; width: 36px !important; height: 36px !important;
    border: none !important; font-size: 15px !important; cursor: pointer !important;
    line-height: 36px !important; text-align: center !important; transition: background 0.15s !important;
}
#cog:hover { background: rgba(255,255,255,0.38) !important; }

/* Filas alternas de tabla de lanzamiento final */
#massScavengeSophieFinalTable tr:nth-child(odd) td { background: #fff8fc !important; }
#massScavengeSophieFinalTable tr:nth-child(even) td { background: #ffffff !important; }

/* ===== NUEVO LAYOUT MODERNO ===== */
.raba-header {
    background: linear-gradient(135deg, #f06292 0%, #e91e8c 45%, #c2185b 100%);
    padding: 18px 56px 16px 20px;
    position: relative;
    display: flex;
    align-items: center;
    min-height: 68px;
    box-shadow: 0 3px 12px rgba(194,24,91,0.30);
}
.raba-title {
    font-size: 20px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 0.5px;
    flex: 1;
    text-align: center;
}
.raba-body { padding: 16px 18px; background: #ffffff; }

/* Título de sección */
.raba-section-title {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: #c2185b;
    padding-bottom: 8px;
    border-bottom: 2px solid #fce4ec;
    margin-bottom: 12px;
    margin-top: 0;
}

/* Contenedor de tropas (drag) */
.raba-troops {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    gap: 8px;
    padding: 4px 2px 8px;
    overflow-x: auto;
    min-height: 90px;
}
.raba-troop-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1.5px solid #e8b4cb;
    border-radius: 10px;
    background: #ffffff;
    cursor: grab;
    min-width: 72px;
    flex-shrink: 0;
    overflow: hidden;
    transition: border-color 0.15s, box-shadow 0.15s;
    user-select: none;
}
.raba-troop-card:hover {
    border-color: #e91e8c;
    box-shadow: 0 2px 10px rgba(233,30,140,0.18);
}
.raba-troop-img { background: #fce4ec; width: 100%; text-align: center; padding: 8px 6px; }
.raba-troop-check { padding: 6px 0; }
.raba-troop-label {
    background: #fce4ec; width: 100%; text-align: center;
    font-size: 10px; font-weight: 700; color: #880e4f;
    padding: 4px 0; text-transform: uppercase; letter-spacing: 0.4px;
}
.raba-troop-input { padding: 5px 6px 6px; width: 100%; box-sizing: border-box; text-align: center; }
.raba-troop-input input { width: 52px !important; text-align: center; }

/* Layout dos columnas */
.raba-main-cols { display: flex; gap: 16px; margin-top: 18px; align-items: flex-start; }
.raba-left-col { flex: 1.15; min-width: 0; }
.raba-right-col { flex: 1; min-width: 0; }

/* Bloque de tiempo */
.raba-time-block { display: flex; flex-direction: column; gap: 0; border: 1.5px solid #e8b4cb; border-radius: 10px; overflow: hidden; }
.raba-time-row {
    display: grid;
    grid-template-columns: 34px 1fr 1fr;
    gap: 8px;
    align-items: center;
    padding: 8px 10px;
    border-bottom: 1px solid #fce4ec;
    background: #ffffff;
    box-sizing: border-box;
    min-width: 0;
}
.raba-time-row:last-child { border-bottom: none; background: #fff8fc; }
.raba-time-row > * { min-width: 0; }
.raba-time-hdr {
    font-size: 11px; font-weight: 700; color: #880e4f;
    text-align: center; padding: 7px 4px; background: #fce4ec;
}
.raba-time-cell { display: flex; flex-direction: column; gap: 4px; align-items: stretch; min-width: 0; }
.raba-time-cell input { width: 100% !important; box-sizing: border-box !important; min-width: 0 !important; font-size: 12px !important; padding: 5px 6px !important; }
.raba-radio-lbl {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 3px; cursor: pointer; font-size: 16px; line-height: 1;
}
.raba-radio-lbl input[type="radio"] {
    width: 14px !important; height: 14px !important;
    flex-shrink: 0; margin: 0 !important;
}
.raba-duration-txt { font-size: 10px; color: #c2185b; font-weight: 600; text-align: center; font-style: italic; line-height: 1.4; }
/* Inputs de horas en fila de texto */
.raba-time-row input[type="text"].runTime_off,
.raba-time-row input[type="text"].runTime_def {
    width: 100% !important; box-sizing: border-box !important; text-align: center; font-size: 14px !important; font-weight: 700; padding: 6px 4px !important;
}

/* Checkboxes y radios ocultos (lógica) — override del estilo genérico */
#massScavengeSophie #category1,
#massScavengeSophie #category2,
#massScavengeSophie #category3,
#massScavengeSophie #category4,
#massScavengeSophie #settingPriorityBalanced,
#massScavengeSophie #settingPriorityPriority {
    display: none !important;
    width: 0 !important; height: 0 !important;
    position: absolute !important; opacity: 0 !important;
}

/* Categorías toggle cards */
.raba-cat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.raba-cat-toggle {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 12px 6px; border: 2px solid #e8b4cb; border-radius: 10px;
    cursor: pointer; background: #ffffff; transition: all 0.15s;
    text-align: center; gap: 5px;
}
.raba-cat-toggle:hover { border-color: #e91e8c; background: #fff5fb; }
.raba-cat-toggle.raba-cat-active {
    border-color: #e91e8c !important;
    background: linear-gradient(135deg, #fce4ec, #fff0f6) !important;
    box-shadow: 0 2px 10px rgba(233,30,140,0.15);
}
.raba-cat-icon { font-size: 22px; line-height: 1; }
.raba-cat-name { font-size: 11px; font-weight: 700; color: #880e4f; line-height: 1.2; }
.raba-cat-active .raba-cat-name { color: #c2185b; }

/* Segmented control distribución */
.raba-segment {
    display: flex; border: 2px solid #e8b4cb; border-radius: 10px;
    overflow: hidden; margin-top: 4px;
}
.raba-seg-btn {
    flex: 1; text-align: center; padding: 10px 6px;
    font-size: 11px; font-weight: 700; color: #880e4f;
    cursor: pointer; transition: all 0.15s; background: #ffffff;
    border-right: 1px solid #e8b4cb; line-height: 1.3;
}
.raba-seg-btn:last-of-type { border-right: none; }
.raba-seg-btn:hover { background: #fff0f6; }
.raba-seg-btn.raba-seg-active {
    background: linear-gradient(135deg, #e91e8c, #c2185b) !important;
    color: #ffffff !important;
}

/* Footer */
.raba-footer {
    background: #fff8fc; border-top: 1.5px solid #fce4ec;
    padding: 14px 18px 12px; display: flex;
    flex-direction: column; align-items: center; gap: 8px;
}
.raba-creator { font-size: 11px; color: #c2185b; opacity: 0.8; font-style: italic; }
.raba-creator strong { font-style: normal; color: #880e4f; }
</style>`
}
else {
    if (colors == 'pink') {
        //pink theme
        var colors = {
            "backgroundColor": "#FEC5E5",
            "borderColor": "#FF1694",
            "headerColor": "#F699CD",
            "titleColor": "#E11584"
        };
        var backgroundColor = colors.backgroundColor;
        var borderColor = colors.borderColor;
        var headerColor = colors.headerColor;
        var titleColor = colors.titleColor;
        cssClassesSophie = `
        <style>
        .btnSophie
        {
            background-image: linear-gradient(#FEC5E5 0%, #FD5DA8 30%, #FF1694 80%, #E11584 100%);
        }
        .btnSophie:hover
        { 
            background-image: linear-gradient(#F2B8C6 0%, #FCBACB 30%, #FA86C4 80%, #FE7F9C 100%);
        }
        #x {
            position: absolute;
            background: red;
            color: white;
            top: 0px;
            right: 0px;
            width: 30px;
            height: 30px;
        }
        #cog {
            position: absolute;
            background: #FEC5E5;
            color: white;
            top: 0px;
            right: 30px;
            width: 30px;
            height: 30px;
        }
        </style>`
    }
    else if (colors == "swedish") {
        //yellow/blue

        var colors = {
            "backgroundColor": "#fecd00",
            "borderColor": "#03456b",
            "headerColor": "#006aa8",
            "titleColor": "#ffffdf"
        };
        var backgroundColor = colors.backgroundColor;
        var borderColor = colors.borderColor;
        var headerColor = colors.headerColor;
        var titleColor = colors.titleColor;
        cssClassesSophie = `
        <style>
        .btnSophie
        {
            background-image: linear-gradient(#00a1fe 0%, #5d9afd 30%, #1626ff 80%, #1f15e1 100%);
        }
        .btnSophie:hover
        { 
            background-image: linear-gradient(#b8bcf2 0%, #babbfc 30%, #8c86fa 80%, #969fff 100%);
        }
        #x {
            position: absolute;
            background: red;
            color: white;
            top: 0px;
            right: 0px;
            width: 30px;
            height: 30px;
        }
        #cog {
            position: absolute;
            background: #fecd00;
            color: white;
            top: 0px;
            right: 30px;
            width: 30px;
            height: 30px;
        }
        </style>`


    }
    else if (colors == "minimalistGray") {
        //gray

        var colors = {
            "backgroundColor": "#f1f1f1",
            "borderColor": "#777777",
            "headerColor": "#ded9d9",
            "titleColor": "#383834"
        };
        var backgroundColor = colors.backgroundColor;
        var borderColor = colors.borderColor;
        var headerColor = colors.headerColor;
        var titleColor = colors.titleColor;
        cssClassesSophie = `
        <style>
        .btnSophie
        {
            background-image: linear-gradient(#00a1fe 0%, #5d9afd 30%, #1626ff 80%, #1f15e1 100%);
            color:white
        }
        .btnSophie:hover
        { 
            background-image: linear-gradient(#b8bcf2 0%, #babbfc 30%, #8c86fa 80%, #969fff 100%);
            color: white
        }
        #x {
            position: absolute;
            background: red;
            color: white;
            top: 0px;
            right: 0px;
            width: 30px;
            height: 30px;
        }
        #cog {
            position: absolute;
            background: #f1f1f1;
            color: white;
            top: 0px;
            right: 30px;
            width: 30px;
            height: 30px;
        }
        </style>`


    }
    else if (colors == "TW") {
        //TW
        console.log("Changing to TW theme");
        var backgroundColor = "#F4E4BC";
        var borderColor = "#ecd7ac";
        var headerColor = "#c6a768";
        var titleColor = "#803000";
        cssClassesSophie = `
        <style>
        .sophRowA {
            background-color: #f4e4bc;
            color: black;
            }
            .sophRowB {
            background-color: #fff5da;
            color: black;
            }
            .sophHeader {
            background-color: #c6a768;
            font-weight: bold;
            color: #803000;
            }
            .sophLink
            {
                color:#803000;
            }
        .btnSophie
        {
            linear-gradient(to bottom, #947a62 0%,#7b5c3d 22%,#6c4824 30%,#6c4824 100%)
            color:white
        }
        .btnSophie:hover
        { 
            linear-gradient(to bottom, #b69471 0%,#9f764d 22%,#8f6133 30%,#6c4d2d 100%);
            color: white
        }
        #x {
            position: absolute;
            background: red;
            color: white;
            top: 0px;
            right: 0px;
            width: 30px;
            height: 30px;
        }
        #cog {
            position: absolute;
            background: #f4e4bc;
            color: white;
            top: 0px;
            right: 30px;
            width: 30px;
            height: 30px;
        }
        </style>`
    }
    else {
        //standard → rosa por defecto (igual que el tema principal)
        var backgroundColor = "#fff0f6";
        var borderColor = "#f8bbd0";
        var headerColor = "#e91e8c";
        var titleColor = "#ffffff";
        cssClassesSophie = `<style>
            #massScavengeSophie,#massScavengeFinal{font-family:'Segoe UI',Tahoma,sans-serif!important;border-radius:16px!important;overflow:hidden!important;box-shadow:0 12px 40px rgba(194,24,91,.30),0 4px 12px rgba(0,0,0,.12)!important;border:none!important;}
            #massScavengeSophie table,#massScavengeSophie tr,#massScavengeSophie td{border-color:transparent!important;border-width:0!important;}
            .sophRowA{background-color:#fce4ec;color:#880e4f;}
            .sophRowB{background-color:#fff0f6;color:#880e4f;}
            .sophHeader{background:linear-gradient(135deg,#f06292 0%,#e91e8c 60%,#c2185b 100%)!important;font-weight:700!important;}
            .btnSophie,input.btnSophie{background:linear-gradient(135deg,#f06292 0%,#e91e8c 55%,#c2185b 100%)!important;color:#fff!important;border:none!important;border-radius:24px!important;padding:8px 24px!important;font-weight:700!important;box-shadow:0 4px 14px rgba(233,30,140,.45)!important;cursor:pointer!important;outline:none!important;}
            .btnSophie:hover,input.btnSophie:hover{background:linear-gradient(135deg,#f48fb1 0%,#f06292 50%,#e91e8c 100%)!important;box-shadow:0 6px 20px rgba(233,30,140,.60)!important;transform:translateY(-2px)!important;}
            #massScavengeSophie input[type="checkbox"]{-webkit-appearance:none;appearance:none;width:22px!important;height:22px!important;border:2px solid #f48fb1!important;border-radius:6px!important;background:#fff!important;cursor:pointer!important;position:relative!important;display:inline-block!important;vertical-align:middle!important;}
            #massScavengeSophie input[type="checkbox"]:checked{background:#e91e8c!important;border-color:#c2185b!important;}
            #massScavengeSophie input[type="checkbox"]:checked::after{content:"✓"!important;position:absolute!important;top:50%!important;left:50%!important;transform:translate(-50%,-50%)!important;color:white!important;font-size:14px!important;font-weight:900!important;line-height:1!important;}
            #massScavengeSophie input[type="radio"]{-webkit-appearance:none;appearance:none;width:20px!important;height:20px!important;border:2px solid #f48fb1!important;border-radius:50%!important;background:#fff!important;cursor:pointer!important;position:relative!important;display:inline-block!important;vertical-align:middle!important;}
            #massScavengeSophie input[type="radio"]:checked{border-color:#e91e8c!important;}
            #massScavengeSophie input[type="radio"]:checked::after{content:""!important;position:absolute!important;top:50%!important;left:50%!important;transform:translate(-50%,-50%)!important;width:10px!important;height:10px!important;background:#e91e8c!important;border-radius:50%!important;display:block!important;}
            #massScavengeSophie input[type="text"],#massScavengeSophie input[type="date"],#massScavengeSophie input[type="time"]{border:1.5px solid #f48fb1!important;border-radius:8px!important;padding:5px 10px!important;background:#fff8fc!important;color:#880e4f!important;font-size:13px!important;outline:none!important;}
            #imgRow td{border:1.5px solid #f8bbd0!important;border-radius:10px!important;background:#fff8fc!important;}
            #imgRow td td{border:none!important;}
            #x{position:absolute!important;background:#c2185b!important;color:white!important;top:0!important;right:0!important;width:34px!important;height:34px!important;border:none!important;font-weight:900!important;cursor:pointer!important;border-radius:0 0 0 10px!important;line-height:34px!important;text-align:center!important;}
            #x:hover{background:#880e4f!important;}
            #cog{position:absolute!important;background:rgba(255,255,255,.25)!important;color:white!important;top:0!important;right:34px!important;width:34px!important;height:34px!important;border:none!important;font-size:16px!important;cursor:pointer!important;border-radius:0 0 0 8px!important;line-height:34px!important;text-align:center!important;}
            hr{border:none!important;border-top:1.5px solid #f8bbd0!important;margin:0 12px!important;}
            </style>`
    }
}




//adding UI classes to page
$("#contentContainer").eq(0).prepend(cssClassesSophie);
$("#mobileHeader").eq(0).prepend(cssClassesSophie);



$.getAll = function (
    urls, // array of URLs
    onLoad, // called when any URL is loaded, params (index, data)
    onDone, // called when all URLs successfully loaded, no params
    onError // called when a URL load fails or if onLoad throws an exception, params (error)
) {
    var numDone = 0;
    var lastRequestTime = 0;
    var minWaitTime = 200; // ms between requests
    loadNext();
    function loadNext() {
        if (numDone == urls.length) {
            onDone();
            return;
        }

        let now = Date.now();
        let timeElapsed = now - lastRequestTime;
        if (timeElapsed < minWaitTime) {
            let timeRemaining = minWaitTime - timeElapsed;
            setTimeout(loadNext, timeRemaining);
            return;
        }
        console.log('Getting ', urls[numDone]);
        $("#progress").css("width", `${(numDone + 1) / urls.length * 100}%`);
        lastRequestTime = now;
        $.get(urls[numDone])
            .done((data) => {
                try {
                    onLoad(numDone, data);
                    ++numDone;
                    loadNext();
                } catch (e) {
                    onError(e);
                }
            })
            .fail((xhr) => {
                onError(xhr);
            })
    }
};

//get scavenging data that is in play for this world, every world has different exponent, factor, and initial seconds. Also getting the URLS of each mass scavenging page
//we can limit the amount of pages we need to call this way, since the mass scavenging pages have all the data that is necessary: troopcounts, which categories per village are unlocked, and if rally point exists.
function getData() {
    $("#massScavengeSophie").remove();
    URLs = [];
    $.get(URLReq, function (data) {
        if ($(".paged-nav-item").length > 0) {
            amountOfPages = parseInt($(".paged-nav-item")[$(".paged-nav-item").length - 1].href.match(/page=(\d+)/)[1]);
        }
        else {
            amountOfPages = 0;
        }
        for (var i = 0; i <= amountOfPages; i++) {
            //push url that belongs to scavenging page i
            URLs.push(URLReq + "&page=" + i);
            //get world data
            tempData = JSON.parse($(data).find('script:contains("ScavengeMassScreen")').html().match(/\{.*\:\{.*\:.*\}\}/g)[0]);
            duration_exponent = tempData[1].duration_exponent;
            duration_factor = tempData[1].duration_factor;
            duration_initial_seconds = tempData[1].duration_initial_seconds;
        }
        console.log(URLs);

    })
        .done(function () {
            //here we get all the village data and make an array with it, we won't be able to parse unless we add brackets before and after the string
            arrayWithData = "[";
            $.getAll(URLs,
                (i, data) => {
                    thisPageData = $(data).find('script:contains("ScavengeMassScreen")').html().match(/\{.*\:\{.*\:.*\}\}/g)[2];
                    arrayWithData += thisPageData + ",";
                },
                () => {
                    //on done
                    arrayWithData = arrayWithData.substring(0, arrayWithData.length - 1);
                    //closing bracket so we can parse the data into a useable array
                    arrayWithData += "]";
                    scavengeInfo = JSON.parse(arrayWithData);
                    // count and calculate per village how many troops per category need to be sent. 
                    // Once count is finished, make a new UI element, and group all the results per 200.
                    // According to morthy, that is the limit at which the server will accept squad pushes.
                    count = 0;
                    for (var i = 0; i < scavengeInfo.length; i++) {
                        calculateHaulCategories(scavengeInfo[i]);
                        count++;
                    }
                    if (count == scavengeInfo.length) {
                        //Post here
                        console.log("Done");
                        //need to split all the scavenging runs per 200, server limit according to morty
                        squads = {};
                        squads_premium = {};
                        per200 = 0;
                        groupNumber = 0;
                        squads[groupNumber] = [];
                        squads_premium[groupNumber] = [];
                        for (var k = 0; k < squad_requests.length; k++) {
                            if (per200 == 200) {
                                groupNumber++;
                                squads[groupNumber] = [];
                                squads_premium[groupNumber] = [];
                                per200 = 0;
                            }
                            per200++;
                            squads[groupNumber].push(squad_requests[k]);
                            squads_premium[groupNumber].push(squad_requests_premium[k]);
                        }

                        //create html send screen with button per launch
                        console.log("Creating launch options");
                        var totalGroups = Object.keys(squads).length;
                        var totalVillages = new Set(squad_requests.map(function(r){ return r.village_id; })).size;
                        htmlWithLaunchButtons = `
                        <div id="massScavengeFinal" class="ui-widget-content" style="position:fixed;cursor:move;z-index:50;width:auto;min-width:280px;max-width:340px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 10px 36px rgba(136,14,79,0.28);border:1.5px solid #e8b4cb;font-family:'Segoe UI',Tahoma,sans-serif;">
                          <!-- Header -->
                          <div style="background:linear-gradient(135deg,#f06292 0%,#e91e8c 45%,#c2185b 100%);padding:16px 48px 14px 20px;position:relative;min-height:62px;display:flex;align-items:center;">
                            <button onclick="closeWindow('massScavengeFinal')" style="background:#c2185b;color:#fff;border:none;width:28px;height:28px;font-size:13px;font-weight:900;cursor:pointer;position:absolute;right:8px;top:50%;transform:translateY(-50%);border-radius:6px;line-height:28px;text-align:center;transition:background 0.15s;" onmouseover="this.style.background='#880e4f'" onmouseout="this.style.background='#c2185b'">✕</button>
                            <div style="flex:1;text-align:center;">
                              <div style="font-size:17px;font-weight:800;color:#fff;letter-spacing:0.4px;">🌸 Lanzar Recolección</div>
                              <div style="font-size:10px;color:rgba(255,255,255,0.82);margin-top:3px;letter-spacing:0.8px;text-transform:uppercase;">${totalVillages} aldeas · ${totalGroups} grupo${totalGroups !== 1 ? 's' : ''}</div>
                            </div>
                          </div>
                          <!-- Descripción -->
                          <div style="padding:10px 18px;background:#fff8fc;border-bottom:1.5px solid #fce4ec;">
                            <p style="margin:0;font-size:12px;color:#880e4f;text-align:center;">Lanza cada grupo en orden · El servidor acepta máx. 200 aldeas por envío.</p>
                          </div>
                          <!-- Botones de grupos -->
                          <div id="massScavengeSophieFinalTable" style="padding:14px 18px;display:flex;flex-direction:column;gap:8px;max-height:320px;overflow-y:auto;">`;
                        for (var s = 0; s < totalGroups; s++) {
                            var fromV = s * 200 + 1;
                            var toV = Math.min((s + 1) * 200, totalVillages);
                            htmlWithLaunchButtons += `
                            <div id="sendRow${s}" style="display:flex;align-items:center;gap:10px;background:#fff0f6;border:1.5px solid #e8b4cb;border-radius:10px;padding:10px 14px;">
                              <div style="flex:1;">
                                <div style="font-size:13px;font-weight:700;color:#880e4f;">🚀 Grupo ${s + 1}</div>
                                <div style="font-size:11px;color:#c2185b;margin-top:2px;">Aldeas ${fromV} – ${toV}</div>
                              </div>
                              <input type="button" class="btn btnSophie" id="sendMassGroup" onclick="sendGroup(${s},false)" value="Lanzar" style="padding:7px 18px;font-size:13px;">
                              <input type="button" class="btn btn-pp btn-send-premium" id="sendMassPremium" onclick="sendGroup(${s},true)" value="Premium" style="display:none;padding:7px 14px;font-size:12px;">
                            </div>`;
                        }
                        htmlWithLaunchButtons += `
                          </div>
                        </div>`;
                        //appending to page
                        console.log("Creating launch UI");
                        $(".maincell").eq(0).prepend(htmlWithLaunchButtons);
                        $("#mobileContent").eq(0).prepend(htmlWithLaunchButtons);

                        if (is_mobile == false) {
                            $("#massScavengeFinal").draggable();
                        }
                        for (var prem = 0; prem < $("#sendMassPremium").length; prem++) {
                            if (premiumBtnEnabled == true) {
                                $($("#sendMassPremium")[prem]).show();
                            }
                        }
                        try { $("#sendMass")[0].focus(); } catch(e) {}
                    }
                },
                (error) => {
                    console.error(error);
                });
        }
        )
}

//first UI, will always open as soon as you run the script.
html = `
<div id="massScavengeSophie" class="ui-widget-content" style="width:720px;background:#fff;cursor:move;z-index:50;border-radius:14px;overflow:hidden;box-shadow:0 10px 36px rgba(136,14,79,0.22);border:1.5px solid #e8b4cb;font-family:'Segoe UI',Tahoma,sans-serif;">

  <!-- CABECERA -->
  <div class="raba-header">
    <button class="btn" id="x" onclick="closeWindow('massScavengeSophie')" style="background:rgba(0,0,0,0.20);color:#fff;border:none;width:36px;height:36px;font-size:16px;font-weight:900;cursor:pointer;position:absolute;right:0;top:0;bottom:0;height:100%;border-radius:0;line-height:1;display:flex;align-items:center;justify-content:center;">✕</button>
    <div style="flex:1;text-align:center;padding:4px 0;">
      <div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:0.5px;line-height:1.2;">🌸 ${langShinko[0]} 🌸</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.82);margin-top:4px;letter-spacing:0.8px;font-weight:500;text-transform:uppercase;">Gestiona y lanza tu recolección masiva de recursos</div>
    </div>
  </div>

  <!-- CUERPO PRINCIPAL -->
  <div class="raba-body">

    <!-- SECCIÓN TROPAS -->
    <div class="raba-section-title">🎖️ SELECCIONA LAS TROPAS Y ORDEN PARA RECOLECTAR (ARRASTRA PARA ORDENAR)</div>
    <div id="imgRow" class="raba-troops"></div>

    <!-- DOS COLUMNAS -->
    <div class="raba-main-cols">

      <!-- COLUMNA IZQUIERDA: TIEMPO DE RETORNO -->
      <div class="raba-left-col">
        <div class="raba-section-title">⏰ ${langShinko[3]}</div>
        <div class="raba-time-block">
          <!-- Fila 0: cabeceras de columna -->
          <div style="display:grid;grid-template-columns:34px 1fr 1fr;gap:8px;background:#fce4ec;border-bottom:2px solid #e8b4cb;box-sizing:border-box;padding:0 10px;">
            <div></div>
            <div class="raba-time-hdr">⚔️ Ofensivas</div>
            <div class="raba-time-hdr">🛡️ Defensivas</div>
          </div>
          <!-- Fila 1: por fecha -->
          <div class="raba-time-row">
            <label class="raba-radio-lbl" title="Seleccionar por fecha">
              <input type="radio" id="timeSelectorDate" name="timeSelector" style="accent-color:#e91e8c;">
            </label>
            <div class="raba-time-cell">
              <input type="date" id="offDay" name="offDay" value="${setDayToField(runTimes.off)}">
              <input type="time" id="offTime" name="offTime" value="${setTimeToField(runTimes.off)}">
            </div>
            <div class="raba-time-cell">
              <input type="date" id="defDay" name="defDay" value="${setDayToField(runTimes.def)}">
              <input type="time" id="defTime" name="defTime" value="${setTimeToField(runTimes.def)}">
            </div>
          </div>
          <!-- Fila 2: por horas -->
          <div class="raba-time-row">
            <label class="raba-radio-lbl" title="Seleccionar por horas">
              <input type="radio" id="timeSelectorHours" name="timeSelector" style="accent-color:#e91e8c;">
            </label>
            <div style="display:flex;align-items:center;gap:5px;min-width:0;">
              <input type="text" class="runTime_off" value="${runTimes['off']}" onclick="this.select();" style="flex:1;min-width:0;">
              <span style="font-size:11px;font-weight:800;color:#c2185b;letter-spacing:0.5px;flex-shrink:0;">horas</span>
            </div>
            <div style="display:flex;align-items:center;gap:5px;min-width:0;">
              <input type="text" class="runTime_def" value="${runTimes['def']}" onclick="this.select();" style="flex:1;min-width:0;">
              <span style="font-size:11px;font-weight:800;color:#c2185b;letter-spacing:0.5px;flex-shrink:0;">horas</span>
            </div>
          </div>
          <!-- Fila 3: duración calculada -->
          <div class="raba-time-row">
            <div></div>
            <div class="raba-duration-txt" id="offDisplay"></div>
            <div class="raba-duration-txt" id="defDisplay"></div>
          </div>
        </div>
      </div>

      <!-- COLUMNA DERECHA: CATEGORÍAS + DISTRIBUCIÓN -->
      <div class="raba-right-col">

        <div class="raba-section-title">📦 ${langShinko[2]}</div>
        <!-- Inputs ocultos (lógica intacta) -->
        <input type="checkbox" id="category1" name="cat1" style="display:none">
        <input type="checkbox" id="category2" name="cat2" style="display:none">
        <input type="checkbox" id="category3" name="cat3" style="display:none">
        <input type="checkbox" id="category4" name="cat4" style="display:none">
        <!-- Toggle cards -->
        <div class="raba-cat-grid">
          <div class="raba-cat-toggle" id="catTog1">
            <span class="raba-cat-icon">🐢</span>
            <span class="raba-cat-name">${categoryNames[1].name}</span>
          </div>
          <div class="raba-cat-toggle" id="catTog2">
            <span class="raba-cat-icon">🌿</span>
            <span class="raba-cat-name">${categoryNames[2].name}</span>
          </div>
          <div class="raba-cat-toggle" id="catTog3">
            <span class="raba-cat-icon">⚡</span>
            <span class="raba-cat-name">${categoryNames[3].name}</span>
          </div>
          <div class="raba-cat-toggle" id="catTog4">
            <span class="raba-cat-icon">💎</span>
            <span class="raba-cat-name">${categoryNames[4].name}</span>
          </div>
        </div>

        <!-- Distribución: segmented control -->
        <div class="raba-section-title" style="margin-top:16px;">⚖️ Distribución de tropas</div>
        <div class="raba-segment">
          <input type="radio" id="settingPriorityBalanced" name="prio" style="display:none">
          <div class="raba-seg-btn" id="segBtnBalanced">⚖️ Equilibrado</div>
          <input type="radio" id="settingPriorityPriority" name="prio" style="display:none">
          <div class="raba-seg-btn" id="segBtnPriority">🎯 Prioridad alta</div>
        </div>

      </div>
    </div><!-- /raba-main-cols -->
  </div><!-- /raba-body -->

  <!-- PIE DE PÁGINA -->
  <div class="raba-footer">
    <input type="button" class="btn btnSophie" id="sendMass" onclick="readyToSend()" value="🚀 ${langShinko[5]}">
    <div class="raba-creator">💖 Creado por <strong>rabagalan73</strong> para la reina <strong>M0bscene</strong> 💖</div>
  </div>

</div>
`;
$(".maincell").eq(0).prepend(html);
$("#mobileContent").eq(0).prepend(html);
if (game_data.locale == "ar_AE") {
    $("#sophieImg").attr("src", "https://media2.giphy.com/media/qYr8p3Dzbet5S/giphy.gif");
}
$("#massScavengeSophie").css("position", "fixed");
if (is_mobile == false) {
    $("#massScavengeSophie").draggable();
} else {
    // En móvil: centrar el modal en pantalla
    $("#massScavengeSophie").css({
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: Math.min(window.innerWidth * 0.94, 620) + "px",
        maxHeight: (window.innerHeight * 0.88) + "px",
        overflowY: "auto",
        cursor: "default"
    });
}

// Sincronizar estado visual de toggle cards de categorías
function syncCatToggles() {
    [1,2,3,4].forEach(function(n) {
        var cb = document.getElementById('category' + n);
        var lbl = document.getElementById('catTog' + n);
        if (cb && lbl) lbl.classList.toggle('raba-cat-active', cb.checked);
    });
}
function syncSegBtns() {
    var isBalanced = document.getElementById('settingPriorityBalanced').checked;
    document.getElementById('segBtnBalanced').classList.toggle('raba-seg-active', isBalanced);
    document.getElementById('segBtnPriority').classList.toggle('raba-seg-active', !isBalanced);
}
// Click directo en cards de categoría (sin label for, sin doble disparo)
[1,2,3,4].forEach(function(n) {
    document.getElementById('catTog' + n).addEventListener('click', function() {
        var cb = document.getElementById('category' + n);
        cb.checked = !cb.checked;
        syncCatToggles();
    });
});
// Click directo en segmented control
document.getElementById('segBtnBalanced').addEventListener('click', function() {
    document.getElementById('settingPriorityBalanced').checked = true;
    syncSegBtns();
});
document.getElementById('segBtnPriority').addEventListener('click', function() {
    document.getElementById('settingPriorityPriority').checked = true;
    syncSegBtns();
});
syncCatToggles();
syncSegBtns();

$("#offDisplay")[0].innerText = fancyTimeFormat(runTimes.off * 3600);
$("#defDisplay")[0].innerText = fancyTimeFormat(runTimes.def * 3600);
if (tempElementSelection == "Date") {
    $(`#timeSelectorDate`).prop("checked", true);
    selectType("Date");
    updateTimers();
}
else {
    $(`#timeSelectorHours`).prop("checked", true);
    selectType("Hours");
    updateTimers();
}
$("#offDay")[0].addEventListener("input", function () {
    updateTimers();
}, false)



$("#defDay")[0].addEventListener("input", function () {
    updateTimers();
}, false)

$("#offTime")[0].addEventListener("input", function () {
    updateTimers();
}, false)

$("#defTime")[0].addEventListener("input", function () {
    updateTimers();
}, false)


$(".runTime_off")[0].addEventListener("input", function () {
    updateTimers();
}, false)

$(".runTime_def")[0].addEventListener("input", function () {
    updateTimers();
}, false)

$("#timeSelectorDate")[0].addEventListener("input", function () {
    selectType('Date');
    updateTimers();
}, false)

$("#timeSelectorHours")[0].addEventListener("input", function () {
    selectType('Hours');
    updateTimers();
}, false)

//create checkboxes and add them to the UI


for (var i = 0; i < sendOrder.length; i++) {
    $("#imgRow").eq(0).append(`<div class="raba-troop-card">
      <div class="raba-troop-img"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_${sendOrder[i]}.png" title="${sendOrder[i]}" alt="" style="display:block;margin:auto;max-width:none;height:auto;image-rendering:auto;"></div>
      <div class="raba-troop-check"><input type="checkbox" id="${sendOrder[i]}" name="${sendOrder[i]}" style="width:18px;height:18px;accent-color:#e91e8c;cursor:pointer;"></div>
      <div class="raba-troop-label">Reserva</div>
      <div class="raba-troop-input"><input type="text" id="${sendOrder[i]}Backup" name="${sendOrder[i]}" value="${keepHome[sendOrder[i]]}" size="4" style="width:52px;text-align:center;border:1.5px solid #e8b4cb;border-radius:6px;padding:3px;font-size:12px;"></div>
    </div>`);
}

// Inicializar sortable UNA SOLA VEZ después de añadir todos los cards
(function loadTouchPunch(cb) {
    if (!('ontouchstart' in window)) { cb(); return; }
    if (window._touchPunchLoaded) { cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js';
    s.onload = function() { window._touchPunchLoaded = true; cb(); };
    document.head.appendChild(s);
})(function() {
    $("#imgRow").sortable({
        axis: "x",
        revert: false,
        containment: "parent",
        forceHelperSize: true,
        tolerance: "pointer",
        delay: 0,
        distance: 5,
        scroll: false
    }).disableSelection();
});

if (prioritiseHighCat == true) {
    console.log('setting high priority cat')
    $(`#settingPriorityPriority`).prop("checked", true);
}
else {
    console.log('setting balanced')
    $(`#settingPriorityBalanced`).prop("checked", true);
}

enableCorrectTroopTypes();
if (typeof syncCatToggles === 'function') syncCatToggles();



//focus calculate button!
$("#sendMass").focus();

function readyToSend() {

    //check if every setting is chosen, otherwise alert and abort

    if ($("#settingPriorityPriority")[0].checked == false && $("#settingPriorityBalanced")[0].checked == false) {
        // no setting chosen
        alert("¡No has elegido cómo dividir tus tropas! Elige entre priorizar categorías superiores o distribuir de forma equilibrada.");
        throw Error("didn't choose type");
    }

    if ($("#category1").is(":checked") == false && $("#category2").is(":checked") == false && $("#category3").is(":checked") == false && $("#category4").is(":checked") == false) {
        // no category chosen
        alert("¡No has seleccionado ninguna categoría de recolección!");
        throw Error("didn't choose category");
    }


    // Limpiar arrays globales para evitar acumulación si se calcula más de una vez
    enabledCategories = [];
    squad_requests = [];
    squad_requests_premium = [];

    //get trooptypes we wanna use, and runtime
    console.log(sendOrder);
    for (var i = 0; i < sendOrder.length; i++) {
        troopTypeEnabled[sendOrder[i]] = $(`:checkbox#${sendOrder[i]}`).is(":checked");
    }
    for (var i = 0; i < sendOrder.length; i++) {
        keepHome[sendOrder[i]] = $(`#${sendOrder[i]}Backup`).val();
    }
    console.log(troopTypeEnabled);
    enabledCategories.push($("#category1").is(":checked"));
    enabledCategories.push($("#category2").is(":checked"));
    enabledCategories.push($("#category3").is(":checked"));
    enabledCategories.push($("#category4").is(":checked"));

    if ($("#timeSelectorDate")[0].checked == true) {
        localStorage.setItem("timeElement", "Date");
        time.off = Date.parse($("#offDay").val().replace(/-/g, "/") + " " + $("#offTime").val());
        time.def = Date.parse($("#defDay").val().replace(/-/g, "/") + " " + $("#defTime").val());
        time.off = (time.off - serverDate) / 1000 / 3600;
        time.def = (time.def - serverDate) / 1000 / 3600;
    }
    else {
        localStorage.setItem("timeElement", "Hours");
        time.off = $('.runTime_off').val();
        time.def = $('.runTime_def').val();
    }

    console.log("Time off: " + time.off);
    console.log("Time def: " + time.def);
    if (time.off > 24 || time.def > 24) {
        alert("¡Tu tiempo de recolección supera las 24 horas!");
    }


    //Dialog.show("content", time.off + " " + time.def);


    console.log(sendOrder);
    if ($("#settingPriorityPriority")[0].checked == true) {
        prioritiseHighCat = true;
    }
    else {
        prioritiseHighCat = false;
    }

    sendOrder = [];
    for (var k = 0; k < $("#imgRow :checkbox").length; k++) {
        sendOrder.push($("#imgRow :checkbox")[k].name)
    }

    console.log("Runtimes: Off: " + time.off + " Def: " + time.def);
    localStorage.setItem("troopTypeEnabled", JSON.stringify(troopTypeEnabled));
    localStorage.setItem("keepHome", JSON.stringify(keepHome));
    localStorage.setItem("categoryEnabled", JSON.stringify(enabledCategories));
    localStorage.setItem("prioritiseHighCat", JSON.stringify(prioritiseHighCat));
    localStorage.setItem("sendOrder", JSON.stringify(sendOrder));
    localStorage.setItem("runTimes", JSON.stringify({ off: Math.round(time.off * 10) / 10, def: Math.round(time.def * 10) / 10 }));

    console.log("Saved priority: " + prioritiseHighCat);
    console.table(troopTypeEnabled);
    console.table(time);
    console.table(sendOrder);
    console.table(enabledCategories);
    categoryEnabled = enabledCategories;

    getData();
}

function sendGroup(groupNr, premiumEnabled) {
    if (premiumEnabled == true) {
        actuallyEnabled = false;
        actuallyEnabled = confirm("¿Seguro que quieres enviar la recolección con premium? Cancelar enviará sin premium. *** DEPENDIENDO DEL NÚMERO DE TROPAS/ALDEAS, ESTO PUEDE CONSUMIR MUCHOS PP. ¡ÚSALO SOLO SI PUEDES PERMITÍRTELO! ***");
    }
    else {
        actuallyEnabled = false;
    }
    if (actuallyEnabled == true) {
        tempSquads = squads_premium[groupNr];
    }
    else {
        tempSquads = squads[groupNr];
    }
    //Send one group(one page worth of scavenging)
    $(':button[id^="sendMass"]').prop('disabled', true)
    $(':button[id^="sendMassPremium"]').prop('disabled', true)
    TribalWars.post('scavenge_api', 
    { ajaxaction: 'send_squads' }, 
    { "squad_requests": tempSquads }, function () {
        UI.SuccessMessage("¡Grupo enviado correctamente!");
    },
        !1
    );

    //once group is sent, remove the row from the table
    setTimeout(function () { 
        $(`#sendRow${groupNr}`).remove(); 
        $(':button[id^="sendMass"]').prop('disabled', false);
        $(':button[id^="sendMassPremium"]').prop('disabled', false);
        try { $("#sendMass")[0].focus(); } catch(e) {}
    }, 200);
}



function calculateHaulCategories(data) {
    //check if village has rally point
    if (data.has_rally_point == true) {
        console.log("can scavenge");
        var troopsAllowed = {};
        for (key in troopTypeEnabled) {
            if (troopTypeEnabled[key] == true) {
                if (data.unit_counts_home[key] - keepHome[key] > 0) {
                    troopsAllowed[key] = data.unit_counts_home[key] - keepHome[key];
                }
                else {
                    troopsAllowed[key] = 0;
                }
            }
        }
        var unitType = {
            "spear": 'def',
            "sword": 'def',
            "axe": 'off',
            "archer": 'def',
            "light": 'off',
            "marcher": 'off',
            "heavy": 'def',
            "knight": 'def',
        }

        var typeCount = { 'off': 0, 'def': 0 };

        for (var prop in troopsAllowed) {
            typeCount[unitType[prop]] = typeCount[unitType[prop]] + troopsAllowed[prop];
        }

        totalLoot = 0;

        //check what the max possible loot is
        for (key in troopsAllowed) {
            if (key == "spear") totalLoot += troopsAllowed[key] * (data.unit_carry_factor * 25);
            if (key == "sword") totalLoot += troopsAllowed[key] * (data.unit_carry_factor * 15);
            if (key == "axe") totalLoot += troopsAllowed[key] * (data.unit_carry_factor * 10);
            if (key == "archer") totalLoot += troopsAllowed[key] * (data.unit_carry_factor * 10);
            if (key == "light") totalLoot += troopsAllowed[key] * (data.unit_carry_factor * 80);
            if (key == "marcher") totalLoot += troopsAllowed[key] * (data.unit_carry_factor * 50);
            if (key == "heavy") totalLoot += troopsAllowed[key] * (data.unit_carry_factor * 50);
            if (key == "knight") totalLoot += troopsAllowed[key] * (data.unit_carry_factor * 100);
        }
        console.log("Loot possible from this village: " + totalLoot);
        if (totalLoot == 0) {
            //can't loot from here, end
            return;
        }
        if (typeCount.off > typeCount.def) {
            haul = parseInt(((time.off * 3600) / duration_factor - duration_initial_seconds) ** (1 / (duration_exponent)) / 100) ** (1 / 2);
        } else {
            haul = parseInt(((time.def * 3600) / duration_factor - duration_initial_seconds) ** (1 / (duration_exponent)) / 100) ** (1 / 2);
        }

        haulCategoryRate = {};
        //check which categories are enabled


        if (data.options[1].is_locked == true || data.options[1].scavenging_squad != null) {
            haulCategoryRate[1] = 0;
        } else {
            haulCategoryRate[1] = haul / 0.1;
        }
        if (data.options[2].is_locked == true || data.options[2].scavenging_squad != null) {
            haulCategoryRate[2] = 0;
        } else {
            haulCategoryRate[2] = haul / 0.25;
        }
        if (data.options[3].is_locked == true || data.options[3].scavenging_squad != null) {
            haulCategoryRate[3] = 0;
        } else {
            haulCategoryRate[3] = haul / 0.50;
        }
        if (data.options[4].is_locked == true || data.options[4].scavenging_squad != null) {
            haulCategoryRate[4] = 0;
        } else {
            haulCategoryRate[4] = haul / 0.75;
        }
        console.log(haulCategoryRate);

        for (var i = 0; i < enabledCategories.length; i++) {
            if (enabledCategories[i] == false) haulCategoryRate[i + 1] = 0;
        }


        totalHaul = haulCategoryRate[1] + haulCategoryRate[2] + haulCategoryRate[3] + haulCategoryRate[4];

        unitsReadyForSend = calculateUnitsPerVillage(troopsAllowed);

        for (var k = 0; k < Object.keys(unitsReadyForSend).length; k++) {
            candidate_squad = { "unit_counts": unitsReadyForSend[k], "carry_max": 9999999999 };
            if (data.options[k + 1].is_locked == false) {
                squad_requests.push({ "village_id": data.village_id, "candidate_squad": candidate_squad, "option_id": k + 1, "use_premium": false })
                squad_requests_premium.push({ "village_id": data.village_id, "candidate_squad": candidate_squad, "option_id": k + 1, "use_premium": true })

            }
        }
    }
    else {
        console.log("no rally point");
    }
}

function enableCorrectTroopTypes() {
    worldUnits = game_data.units;
    for (var i = 0; i < worldUnits.length; i++) {
        if (worldUnits[i] != "militia" && worldUnits[i] != "snob" && worldUnits[i] != "ram" && worldUnits[i] != "catapult" && worldUnits[i] != "spy") {
            if (troopTypeEnabled[worldUnits[i]] == true) $(`#${worldUnits[i]}`).prop("checked", true);
        }
    }
    for (var i = 0; i < categoryEnabled.length; i++) {
        if (categoryEnabled[i] == true) {
            $(`#category${i + 1}`).prop("checked", true);
        }
    }
}

function calculateUnitsPerVillage(troopsAllowed) {
    var unitHaul = {
        "spear": 25,
        "sword": 15,
        "axe": 10,
        "archer": 10,
        "light": 80,
        "marcher": 50,
        "heavy": 50,
        "knight": 100
    };
    //calculate HERE :D
    console.log(troopsAllowed)
    unitsReadyForSend = {};
    unitsReadyForSend[0] = {};
    unitsReadyForSend[1] = {};
    unitsReadyForSend[2] = {};
    unitsReadyForSend[3] = {};
    if (totalLoot > totalHaul) {
        //too many units
        console.log("too many units")
        //prioritise higher category first
        if (version != "old") {
            for (var j = 3; j >= 0; j--) {
                var reach = haulCategoryRate[j + 1];
                sendOrder.forEach((unit) => {
                    if (troopsAllowed.hasOwnProperty(unit) && reach > 0) {
                        var amountNeeded = Math.floor(reach / unitHaul[unit]);

                        if (amountNeeded > troopsAllowed[unit]) {
                            unitsReadyForSend[j][unit] = troopsAllowed[unit];
                            reach = reach - (troopsAllowed[unit] * unitHaul[unit]);
                            troopsAllowed[unit] = 0;
                        } else {
                            unitsReadyForSend[j][unit] = amountNeeded;
                            reach = 0;
                            troopsAllowed[unit] = troopsAllowed[unit] - amountNeeded;
                        }
                    }
                });
            }
        }
        else {
            for (var j = 0; j < 4; j++) {
                for (key in troopsAllowed) {
                    unitsReadyForSend[j][key] = Math.floor((haulCategoryRate[j + 1] * (troopsAllowed[key] / totalLoot)));
                }
            }

        }
    }
    else {
        //not enough units, spread evenly
        troopNumber = 0;
        for (key in troopsAllowed) {
            troopNumber += troopsAllowed[key];
        }
        console.log(troopNumber);
        if (prioritiseHighCat != true && troopNumber > 130) {
            for (var j = 0; j < 4; j++) {
                console.log("not enough units, but even balance")
                for (key in troopsAllowed) {
                    unitsReadyForSend[j][key] = Math.floor((totalLoot / totalHaul * haulCategoryRate[j + 1]) * (troopsAllowed[key] / totalLoot));
                }
            }
        }
        else {
            //prioritise higher category first
            for (var j = 3; j >= 0; j--) {
                var reach = haulCategoryRate[j + 1];
                sendOrder.forEach((unit) => {
                    if (troopsAllowed.hasOwnProperty(unit) && reach > 0) {
                        var amountNeeded = Math.floor(reach / unitHaul[unit]);

                        if (amountNeeded > troopsAllowed[unit]) {
                            unitsReadyForSend[j][unit] = troopsAllowed[unit];
                            reach = reach - (troopsAllowed[unit] * unitHaul[unit]);
                            troopsAllowed[unit] = 0;
                        } else {
                            unitsReadyForSend[j][unit] = amountNeeded;
                            reach = 0;
                            troopsAllowed[unit] = troopsAllowed[unit] - amountNeeded;
                        }
                    }
                });
            }
        }
    }
    return unitsReadyForSend;
}

function resetSettings() {
    localStorage.removeItem("troopTypeEnabled");
    localStorage.removeItem("categoryEnabled");
    localStorage.removeItem("prioritiseHighCat");
    localStorage.removeItem("sendOrder");
    localStorage.removeItem("runTimes");
    localStorage.removeItem("keepHome");
    UI.BanneredRewardMessage("Ajustes restablecidos");
    window.location.reload();
}

function closeWindow(title) {
    $("#" + title).remove();
}

function settings() {
    alert("¡Próximamente!");
}

function zeroPadded(val) {
    if (val >= 10)
        return val;
    else
        return '0' + val;
}

function setTimeToField(runtimeType) {

    d = Date.parse(new Date(serverDate)) + runtimeType * 1000 * 3600;
    d = new Date(d);
    d = zeroPadded(d.getHours()) + ":" + zeroPadded(d.getMinutes());
    return d;
}
function setDayToField(runtimeType) {

    d = Date.parse(new Date(serverDate)) + runtimeType * 1000 * 3600;
    d = new Date(d);
    d = d.getFullYear() + "-" + zeroPadded(d.getMonth() + 1) + "-" + zeroPadded(d.getDate());
    return d;
}

function fancyTimeFormat(time) {
    if (time < 0) {
        return "¡La hora está en el pasado!"
    }
    else {
        // Hours, minutes and seconds
        var hrs = ~~(time / 3600);
        var mins = ~~((time % 3600) / 60);
        var secs = ~~time % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "Duración máx: ";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }
        else {
            ret += "0:" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }
}

function updateTimers() {
    if ($("#timeSelectorDate")[0].checked == true) {
        console.log("datebox")
        $("#offDisplay")[0].innerText = fancyTimeFormat((Date.parse($("#offDay").val().replace(/-/g, "/") + " " + $("#offTime").val()) - serverDate) / 1000)
        $("#defDisplay")[0].innerText = fancyTimeFormat((Date.parse($("#defDay").val().replace(/-/g, "/") + " " + $("#defTime").val()) - serverDate) / 1000)
    }
    else {
        console.log("Textbox ")
        $("#offDisplay")[0].innerText = fancyTimeFormat($(".runTime_off").val() * 3600)
        $("#defDisplay")[0].innerText = fancyTimeFormat($(".runTime_def").val() * 3600)
    }
}

function selectType(type) {
    console.log("clicked" + type);
    switch (type) {
        case 'Hours':
            if ($("#timeSelectorDate")[0].checked == true) {
                $("#offDay").eq(0).removeAttr('disabled');
                $("#defDay").eq(0).removeAttr('disabled');
                $("#offTime").eq(0).removeAttr('disabled');;
                $("#defTime").eq(0).removeAttr('disabled');
                $(".runTime_off").prop("disabled", true);
                $(".runTime_def").prop("disabled", true);
            }
            else {
                $("#offDay").prop("disabled", true);
                $("#defDay").prop("disabled", true);
                $("#offTime").prop("disabled", true);
                $("#defTime").prop("disabled", true);
                $(".runTime_off").eq(0).removeAttr('disabled');
                $(".runTime_def").eq(0).removeAttr('disabled');
            }
            break;
        case 'Date':
            if ($("#timeSelectorHours")[0].checked == true) {
                $("#offDay").prop("disabled", true);
                $("#defDay").prop("disabled", true);
                $("#offTime").prop("disabled", true);
                $("#defTime").prop("disabled", true);
                $(".runTime_off").eq(0).removeAttr('disabled');
                $(".runTime_def").eq(0).removeAttr('disabled');
            }
            else {
                $("#offDay").eq(0).removeAttr('disabled');
                $("#defDay").eq(0).removeAttr('disabled');
                $("#offTime").eq(0).removeAttr('disabled');;
                $("#defTime").eq(0).removeAttr('disabled');
                $(".runTime_off").prop("disabled", true);
                $(".runTime_def").prop("disabled", true);
            }
            break;
        default:
            break;

    }
}
/* This is some notes just for me so I know what I'm working with data wise

Structure of the array:
scavengInfo[i].

village_id
player_id
village_name
res :{wood,stone,iron}
res_rate:{wood,stone,iron}
storage_max
unit_counts_home:{spear,sword, etc}
unit_carry_factor
has_rally_point (true or false)

options[1]
base_id: 1
village_id
is_locked: (true or false)
unlock_time: null
scavenging_squad: null
*/