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

// ── CSS ──────────────────────────────────────────────────────
function injectRSCSS() {
    if (document.getElementById("rs-raba-style")) return;
    var style = document.createElement("style");
    style.id = "rs-raba-style";
    style.textContent = `
/* ===== Reset base ===== */
.rs-root *, .rs-root *::before, .rs-root *::after { box-sizing: border-box; }

/* ===== Overlay ===== */
.rs-overlay {
    position: fixed; inset: 0; z-index: 99999;
    display: flex; align-items: center; justify-content: center;
    background: ${RS.bgOverlay};
    backdrop-filter: blur(4px);
    animation: rsFadeIn .18s ease;
}
@keyframes rsFadeIn { from { opacity:0 } to { opacity:1 } }

/* ===== Modal ===== */
.rs-modal {
    width: min(700px, 96vw);
    max-height: 92vh;
    display: flex; flex-direction: column; overflow: hidden;
    background: ${RS.bgModal};
    border: 1px solid ${RS.border};
    border-radius: 16px;
    box-shadow: 0 24px 64px rgba(0,0,0,.6);
}
.rs-modal-sm { width: min(420px, 94vw); }
.rs-modal-lg { width: min(860px, 96vw); max-height: 94vh; }

/* ===== Header ===== */
.rs-head {
    display: flex; align-items: center; gap: 12px;
    padding: 18px 20px;
    background: ${RS.bgHeader};
    border-bottom: 1px solid ${RS.border};
    flex-shrink: 0;
}
.rs-head-icon {
    width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg, ${RS.accent}, ${RS.accentBlue});
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; line-height: 1;
}
.rs-head-title { font-size: 17px; font-weight: 700; color: ${RS.textHead}; letter-spacing: .2px; }
.rs-head-sub   { font-size: 11px; color: ${RS.textMuted}; margin-top: 2px; }
.rs-head-close {
    margin-left: auto;
    background: rgba(255,255,255,.05); border: 1px solid ${RS.border};
    color: ${RS.textMuted}; width: 28px; height: 28px;
    border-radius: 8px; cursor: pointer; font-size: 16px; line-height: 28px; text-align: center;
    transition: background .15s, color .15s;
}
.rs-head-close:hover { background: ${RS.danger}; color: #fff; border-color: ${RS.danger}; }
.rs-head-btn {
    background: rgba(255,255,255,.05); border: 1px solid ${RS.border};
    color: ${RS.textMuted}; width: 28px; height: 28px;
    border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 700;
    line-height: 28px; text-align: center; transition: background .15s, color .15s;
}
.rs-head-btn:hover { background: ${RS.accent}; color: #fff; border-color: ${RS.accent}; }

/* ===== Body ===== */
.rs-body {
    flex: 1; overflow-y: auto; padding: 20px;
}
.rs-body::-webkit-scrollbar { width: 6px; }
.rs-body::-webkit-scrollbar-thumb { background: ${RS.border}; border-radius: 10px; }
.rs-body::-webkit-scrollbar-track { background: transparent; }

/* ===== Footer ===== */
.rs-footer {
    padding: 12px 20px;
    background: ${RS.bgHeader};
    border-top: 1px solid ${RS.border};
    font-size: 11px; color: ${RS.textMuted};
    text-align: center; flex-shrink: 0;
}

/* ===== Form inputs ===== */
.rs-label {
    display: block; font-size: 11px; font-weight: 600;
    color: ${RS.textMuted}; text-transform: uppercase; letter-spacing: .6px;
    margin-bottom: 6px;
}
.rs-input {
    width: 100%; padding: 9px 12px;
    background: ${RS.bgCard}; border: 1.5px solid ${RS.border};
    border-radius: 8px; color: ${RS.textMain}; font-size: 13px;
    outline: none; transition: border-color .15s;
}
.rs-input:focus { border-color: ${RS.accent}; }
.rs-form-row { display: flex; gap: 12px; margin-bottom: 16px; }
.rs-form-col { flex: 1; }

/* ===== Buttons ===== */
.rs-btn {
    padding: 9px 20px; border: none; border-radius: 8px;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: opacity .15s, transform .1s;
}
.rs-btn:active { transform: scale(.97); }
.rs-btn-primary {
    background: linear-gradient(135deg, ${RS.accent}, ${RS.accentBlue});
    color: #fff;
}
.rs-btn-primary:hover { opacity: .88; }
.rs-btn-secondary {
    background: ${RS.bgCard}; border: 1.5px solid ${RS.border};
    color: ${RS.textMain};
}
.rs-btn-secondary:hover { border-color: ${RS.accent}; color: ${RS.accent}; }
.rs-btn-send {
    padding: 6px 14px; font-size: 12px; font-weight: 700;
    background: linear-gradient(135deg, ${RS.accent}, ${RS.accentBlue});
    color: #fff; border: none; border-radius: 6px; cursor: pointer;
    transition: opacity .15s;
}
.rs-btn-send:hover { opacity: .85; }
.rs-btn-send:disabled { opacity: .4; cursor: not-allowed; }

/* ===== Target card ===== */
.rs-target-card {
    display: flex; align-items: center; gap: 16px;
    padding: 14px 16px; margin-bottom: 20px;
    background: ${RS.bgCard}; border: 1px solid ${RS.border}; border-radius: 12px;
}
.rs-target-card img { width: 40px; height: 40px; border-radius: 8px; }
.rs-target-info { flex: 1; }
.rs-target-name { font-size: 14px; font-weight: 700; color: ${RS.textHead}; }
.rs-target-sub  { font-size: 12px; color: ${RS.textMuted}; margin-top: 3px; }
.rs-res-badges  { display: flex; gap: 10px; margin-top: 6px; flex-wrap: wrap; }
.rs-res-badge   { font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
.rs-badge-wood  { background: rgba(168,192,96,.15);  color: ${RS.wood};  border: 1px solid rgba(168,192,96,.3); }
.rs-badge-stone { background: rgba(176,160,144,.15); color: ${RS.stone}; border: 1px solid rgba(176,160,144,.3); }
.rs-badge-iron  { background: rgba(144,176,200,.15); color: ${RS.iron};  border: 1px solid rgba(144,176,200,.3); }

/* ===== Settings row ===== */
.rs-settings-bar {
    display: flex; gap: 10px; align-items: flex-end; margin-bottom: 20px;
    padding: 14px 16px; background: ${RS.bgCard};
    border: 1px solid ${RS.border}; border-radius: 12px;
}
.rs-settings-bar .rs-form-col { margin: 0; }

/* ===== Table ===== */
.rs-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.rs-table th {
    padding: 10px 12px; text-align: left;
    background: ${RS.bgHeader}; color: ${RS.textMuted};
    font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .5px;
    border-bottom: 1px solid ${RS.border};
}
.rs-table th:first-child { border-radius: 8px 0 0 0; }
.rs-table th:last-child  { border-radius: 0 8px 0 0; }
.rs-table td { padding: 10px 12px; border-bottom: 1px solid ${RS.border}; color: ${RS.textMain}; vertical-align: middle; }
.rs-table tr.rs-row-even td { background: ${RS.bgRow}; }
.rs-table tr.rs-row-odd  td { background: ${RS.bgRowAlt}; }
.rs-table tr:hover td { background: rgba(0,201,167,.05); }
.rs-table a { color: ${RS.accentBlue}; text-decoration: none; }
.rs-table a:hover { color: ${RS.accent}; }
.rs-dist-badge {
    display: inline-block; padding: 2px 8px;
    background: ${RS.bgCard}; border: 1px solid ${RS.border};
    border-radius: 20px; font-size: 11px; color: ${RS.textMuted};
}
.rs-table td.rs-td-center { text-align: center; }

/* ===== Help blocks ===== */
.rs-help-block {
    background: ${RS.bgCard}; border: 1px solid ${RS.border};
    border-radius: 10px; padding: 12px 14px;
}
.rs-help-tag {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .6px; color: ${RS.accent}; margin-bottom: 6px;
}
.rs-help-p {
    font-size: 13px; color: ${RS.textMuted}; line-height: 1.6; margin: 0;
}
.rs-help-p strong { color: ${RS.textMain}; }
.rs-help-p em { color: ${RS.accentBlue}; font-style: normal; }

/* ===== Panel principal (no overlay) ===== */
#rs-main-panel {
    background: ${RS.bgModal}; border: 1px solid ${RS.border};
    border-radius: 16px; margin: 12px 0; overflow: hidden;
}
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
          <div class="rs-head-icon">⚔️</div>
          <div>
            <div class="rs-head-title">${langShinko[0]}</div>
            <div class="rs-head-sub">${langShinko[1]}</div>
          </div>
        </div>
        <div class="rs-body">
          <label class="rs-label">${langShinko[7]}</label>
          <input class="rs-input" type="text" id="rs-coord-input" placeholder="500|500" style="margin-bottom:16px;">
          <div style="display:flex;justify-content:flex-end;">
            <button class="rs-btn rs-btn-primary" id="rs-coord-save">⚔️ ${langShinko[2]}</button>
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
    // Limpiar panel anterior si existe
    $("#rs-main-panel").remove();

    var targetImg   = sendBack[2] || "";
    var targetName  = sendBack[1] || "";
    var targetPlayer= sendBack[3] || "";
    var targetPts   = sendBack[4] || "";

    // Construir filas
    var rows = "";
    var rowIdx = 0;
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
        var rowClass = rowIdx % 2 === 0 ? "rs-row-even" : "rs-row-odd";
        rowIdx++;

        rows += `
        <tr class="${rowClass}" id="rs-row-${i}">
            <td><a href="${villagesData[i].url}">${villagesData[i].name}</a></td>
            <td><a href="">${targetName}</a></td>
            <td class="rs-td-center"><span class="rs-dist-badge">${dist}</span></td>
            <td class="rs-td-center" style="color:${RS.wood};font-weight:600;">${numberWithCommas(res.wood)}</td>
            <td class="rs-td-center" style="color:${RS.stone};font-weight:600;">${numberWithCommas(res.stone)}</td>
            <td class="rs-td-center" style="color:${RS.iron};font-weight:600;">${numberWithCommas(res.iron)}</td>
            <td class="rs-td-center">
                <button class="rs-btn-send" onclick="sendResource(${villagesData[i].id},${sendBack[0]},${res.wood},${res.stone},${res.iron},${i})">${langShinko[17]}</button>
            </td>
        </tr>`;
    }

    var panel = `
    <div id="rs-main-panel" class="rs-root">
      <!-- Cabecera del panel -->
      <div class="rs-head">
        <div class="rs-head-icon">⚔️</div>
        <div style="flex:1;">
          <div class="rs-head-title">${langShinko[10]}</div>
          <div class="rs-head-sub">${langShinko[0]}</div>
        </div>
        <button class="rs-head-btn" id="rs-help-btn" title="Ayuda">?</button>
      </div>

      <div class="rs-body">

        <!-- Tarjeta de destino -->
        <div class="rs-target-card">
          <img src="${targetImg}" onerror="this.style.display='none'">
          <div class="rs-target-info">
            <div class="rs-target-name">${targetName}</div>
            <div class="rs-target-sub">${langShinko[4]}: ${targetPlayer} &nbsp;·&nbsp; ${langShinko[6]}: ${numberWithCommas(targetPts)}</div>
            <div class="rs-res-badges" style="margin-top:10px;">
              <span class="rs-res-badge rs-badge-wood">🪵 ${langShinko[18]}: <span id="rs-wood-sent">0</span></span>
              <span class="rs-res-badge rs-badge-stone">🧱 ${langShinko[18]}: <span id="rs-stone-sent">0</span></span>
              <span class="rs-res-badge rs-badge-iron">⚙️ ${langShinko[18]}: <span id="rs-iron-sent">0</span></span>
            </div>
          </div>
        </div>

        <!-- Barra de configuración -->
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
          <button class="rs-btn rs-btn-primary"  id="rs-redo-btn">↺ ${langShinko[9]}</button>
        </div>

        <!-- Tabla de envíos -->
        <div style="border-radius:12px;overflow:hidden;border:1px solid ${RS.border};">
          <table class="rs-table" id="rs-send-table">
            <thead>
              <tr>
                <th>${langShinko[11]}</th>
                <th>${langShinko[12]}</th>
                <th>${langShinko[13]}</th>
                <th>🪵 ${langShinko[14]}</th>
                <th>🧱 ${langShinko[15]}</th>
                <th>⚙️ ${langShinko[16]}</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="rs-table-body">
              ${rows}
            </tbody>
          </table>
        </div>

      </div>
      ${rsFooter()}
    </div>`;

    $("#mobileHeader").eq(0).prepend(panel);
    $("#contentContainer").eq(0).prepend(panel);

    // Eventos
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

    sortTableTest(2);

    // Foco en el primer botón de envío
    var firstBtn = $(".rs-btn-send")[0];
    if (firstBtn) firstBtn.focus();
}

// ── Enviar recursos ──────────────────────────────────────────
function sendResource(sourceID, targetID, woodAmount, stoneAmount, ironAmount, rowNr) {
    $(".rs-btn-send").prop("disabled", true);

    setTimeout(function () {
        $("#rs-row-" + rowNr).remove();
        $(".rs-btn-send").prop("disabled", false);
        var firstBtn = $(".rs-btn-send")[0];
        if (firstBtn) firstBtn.focus();

        var remaining = $("#rs-send-table tbody tr").length;
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
