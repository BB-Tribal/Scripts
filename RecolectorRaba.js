javascript:
// RecolectorRaba - rabagalan73 para la reina M0bscene 💖
(function () {

if (window.location.href.indexOf('screen=place&mode=scavenge') < 0) {
    window.location.assign(game_data.link_base_pure + "place&mode=scavenge");
    return;
}

$('#recoPanel').remove();
$('#recoRabaCSS').remove();

// === DATOS DEL MUNDO ===
var duration_factor, duration_exponent, duration_initial_seconds;
if (parseFloat(game_data.majorVersion) < 8.177) {
    var _si = JSON.parse($('html').find('script:contains("ScavengeScreen")').html().match(/\{.*\:\{.*\:.*\}\}/g)[0]);
    duration_factor          = _si[1].duration_factor;
    duration_exponent        = _si[1].duration_exponent;
    duration_initial_seconds = _si[1].duration_initial_seconds;
} else {
    duration_factor          = window.ScavengeScreen.village.options[1].base.duration_factor;
    duration_exponent        = window.ScavengeScreen.village.options[1].base.duration_exponent;
    duration_initial_seconds = window.ScavengeScreen.village.options[1].base.duration_initial_seconds;
}

var catNames = [];
$('.title').each(function (i) { if (i < 4) catNames.push($(this).text().trim()); });
var catIcons = ['🐢', '🌿', '⚡', '💎'];

var unitCap = { spear:25, sword:15, axe:10, archer:10, light:80, marcher:50, heavy:50, knight:100 };
var worldUnits = ['spear','sword','axe','light','heavy'];
if ($('.units-entry-all[data-unit=archer]').text()  !== '') worldUnits.push('archer');
if ($('.units-entry-all[data-unit=marcher]').text() !== '') worldUnits.push('marcher');
if ($('.units-entry-all[data-unit=knight]').text()  !== '') worldUnits.push('knight');

var _chipHours = [1,2,3,4,6,8,10,12];
var _rawHours = parseFloat(localStorage.getItem('ScavengeTime')) || 6;
var hours = _chipHours.indexOf(_rawHours) !== -1 ? _rawHours : 6;
var checkboxValues      = JSON.parse(localStorage.getItem('checkboxValues')) || {};
var currentDistributions = [];
var priorityOrder  = (function () {
    var saved = localStorage.getItem('recoRabaPriority');
    var order = saved ? JSON.parse(saved).filter(function(u){ return worldUnits.indexOf(u) !== -1; }) : worldUnits.slice();
    worldUnits.forEach(function(u){ if (order.indexOf(u) === -1) order.push(u); });
    return order;
})();

// === CSS ===
$('head').append(`<style id="recoRabaCSS">
#recoPanel {
    position: fixed;
    top: 80px; left: 20px;
    z-index: 9999;
    width: fit-content;
    min-width: 280px;
    background: #fffdf8;
    border-radius: 6px;
    box-shadow: 4px 4px 18px rgba(0,0,0,0.20), 0 1px 4px rgba(0,0,0,0.10);
    font-family: 'Segoe UI', Tahoma, sans-serif;
    user-select: none;
    cursor: default;
}
@media (max-width: 600px) {
    #recoPanel {
        left: 50% !important;
        transform: translateX(-50%) !important;
        top: 60px !important;
        min-width: 300px;
        max-width: 92vw;
        width: 92vw;
        max-height: 85vh;
        overflow-y: auto;
    }
}
/* Cabecera */
#recoPanel .reco-head {
    background: linear-gradient(135deg, #ab47bc 0%, #9c27b0 45%, #7b1fa2 100%);
    padding: 8px 10px 10px 14px;
    display: flex; align-items: center; justify-content: space-between;
    cursor: move;
    border-radius: 6px 6px 0 0;
    min-height: 52px;
}
#recoPanel .reco-head-center {
    flex: 1; text-align: center;
}
#recoPanel .reco-head-title {
    font-size: 15px; font-weight: 800; color: #fff;
    letter-spacing: 0.4px; line-height: 1.2;
}
#recoPanel .reco-head-subtitle {
    font-size: 9px; color: rgba(255,255,255,0.80);
    letter-spacing: 0.8px; text-transform: uppercase;
    font-weight: 500; margin-top: 2px;
}
/* Footer */
#recoPanel .reco-footer {
    background: #fdf5ff; border-top: 1.5px solid #f3e5f5;
    padding: 7px 12px; text-align: center;
    font-size: 10px; color: #7b1fa2; font-style: italic;
    border-radius: 0 0 6px 6px;
}
#recoPanel .reco-footer strong { font-style: normal; color: #6a1b9a; }
#recoPanel .reco-head-close {
    background: rgba(0,0,0,0.18); border: none; cursor: pointer;
    width: 24px; height: 24px; border-radius: 5px;
    font-size: 12px; font-weight: 900; color: #fff;
    line-height: 1; display: flex; align-items: center; justify-content: center;
    transition: background 0.15s; flex-shrink: 0;
}
#recoPanel .reco-head-close:hover { background: rgba(0,0,0,0.35); }
#recoPanel .reco-head-help {
    background: rgba(255,255,255,0.22); border: none; border-radius: 50%;
    cursor: pointer; width: 24px; height: 24px;
    font-size: 11px; font-weight: 900; color: #fff;
    line-height: 1; display: flex; align-items: center; justify-content: center;
    margin-right: 6px; transition: background 0.15s; flex-shrink: 0;
}
#recoPanel .reco-head-help:hover { background: rgba(255,255,255,0.40); }

/* Tooltip de ayuda */
#recoHelpBox {
    display: none;
    position: absolute;
    top: 38px; right: 10px;
    width: 260px;
    background: #fff;
    border: 1.5px solid #e1bee7;
    border-radius: 8px;
    box-shadow: 0 6px 20px rgba(106,27,154,0.15);
    z-index: 10000;
    padding: 12px 14px;
    font-size: 11px; color: #444; line-height: 1.6;
    cursor: default;
}
#recoHelpBox h4 {
    font-size: 10px; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.8px; color: #7b1fa2; margin: 10px 0 3px;
    border-bottom: 1px solid #f3e5f5; padding-bottom: 3px;
}
#recoHelpBox h4:first-child { margin-top: 0; }
#recoHelpBox p { margin: 0 0 4px; }
#recoHelpBox .reco-help-close {
    position: absolute; top: 7px; right: 9px;
    background: none; border: none; cursor: pointer;
    font-size: 12px; color: #ccc;
}
#recoHelpBox .reco-help-close:hover { color: #9c27b0; }

/* Cuerpo */
#recoPanel .reco-body { padding: 10px 12px; display: flex; flex-direction: column; gap: 10px; }

/* Separador de sección */
#recoPanel .reco-sep {
    font-size: 9px; font-weight: 800; text-transform: uppercase;
    letter-spacing: 1px; color: #7b1fa2;
    border-bottom: 1px solid #e8d5f0;
    padding-bottom: 4px; margin-bottom: 2px;
}

/* Tropas */
.reco-troop-row {
    display: flex; flex-wrap: nowrap; justify-content: center; gap: 5px;
}
.reco-tc {
    display: flex; flex-direction: column; align-items: center;
    background: #fff; border: 1.5px solid #e1bee7;
    border-radius: 7px; min-width: 44px; flex-shrink: 0;
    overflow: hidden; cursor: grab;
    transition: border-color 0.15s, box-shadow 0.15s;
}
.reco-tc:hover { border-color: #9c27b0; box-shadow: 0 2px 8px rgba(156,39,176,0.15); }
.reco-tc-img { background: #f3e5f5; width: 100%; text-align: center; padding: 5px 3px; }
.reco-tc-chk { padding: 3px 0; }
.reco-tc-n {
    background: #f3e5f5; width: 100%; text-align: center;
    font-size: 10px; font-weight: 700; color: #6a1b9a; padding: 2px 0;
}
.reco-drag-hint { font-size: 9px; color: #ccc; text-align: center; margin-top: 5px; }

/* Grid 2x2 categorías */
.reco-cat-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }

/* Tiempo — chips */
.reco-time-block { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.reco-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
.reco-chip {
    padding: 5px 13px; border-radius: 50px;
    border: 1.5px solid #f0a0c8; background: #fff;
    font-size: 11px; font-weight: 700; color: #7b1fa2;
    cursor: pointer; transition: all 0.15s; line-height: 1;
    user-select: none;
}
.reco-chip:hover { border-color: #9c27b0; background: #f3e5f5; }
.reco-chip.reco-chip-active {
    background: linear-gradient(135deg, #ab47bc 0%, #9c27b0 100%);
    border-color: #9c27b0; color: #fff;
    box-shadow: 0 2px 8px rgba(156,39,176,0.35);
}
.reco-duration { font-size: 10px; color: #7b1fa2; font-style: italic; text-align: center; }

/* Categorías */
.reco-cat-list { display: contents; }
.reco-cat-row {
    display: flex; align-items: center; gap: 6px;
    background: #fff; border: 1.5px solid #e1bee7;
    border-radius: 7px; padding: 4px 8px;
    transition: all 0.15s;
}
.reco-cat-row.reco-active {
    border-color: #9c27b0;
    background: linear-gradient(135deg, #f3e5f5, #fff5fb);
}
.reco-cat-row { flex-direction: column; align-items: stretch; gap: 4px; }
.reco-cat-row-top { display: flex; align-items: center; gap: 6px; }
.reco-cat-row-icon { font-size: 13px; line-height: 1; }
.reco-cat-row-name { font-size: 10px; font-weight: 700; color: #6a1b9a; flex: 1; }
.reco-cat-row-val { font-size: 11px; font-weight: 800; color: #7b1fa2; }
.reco-cat-ok  { font-size: 11px; font-weight: 900; color: #388e3c; margin-left: 4px; }
.reco-cat-err { font-size: 11px; font-weight: 900; color: #d32f2f; margin-left: 4px; }
/* Botón enviar todo */
#recoSendAll {
    width: 100%; padding: 10px; border: none; border-radius: 8px; cursor: pointer;
    background: linear-gradient(135deg, #ab47bc 0%, #7b1fa2 100%);
    color: #fff; font-size: 13px; font-weight: 800; letter-spacing: 0.4px;
    box-shadow: 0 3px 12px rgba(123,31,162,0.45), inset 0 1px 0 rgba(255,255,255,0.15);
    transition: all 0.15s; position: relative; overflow: hidden;
}
#recoSendAll:hover {
    background: linear-gradient(135deg, #ba68c8 0%, #8e24aa 100%);
    box-shadow: 0 5px 18px rgba(123,31,162,0.55);
    transform: translateY(-1px);
}
#recoSendAll:active { transform: translateY(0); box-shadow: 0 2px 6px rgba(123,31,162,0.4); }
.reco-cat-troops { display: flex; flex-wrap: wrap; gap: 4px 8px; padding-top: 2px; min-height: 16px; }
.reco-cat-troop { display: flex; align-items: center; gap: 2px; font-size: 10px; font-weight: 700; color: #37474f; }
.reco-cat-troop img { width: 16px; height: 16px; image-rendering: auto; }
</style>`);

// === HTML UN SOLO PANEL ===
var troopCards = worldUnits.map(function(unit) {
    return `<div class="reco-tc" data-unit="${unit}">
        <div class="reco-tc-img"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_${unit}.png" style="display:block;margin:auto;max-width:none;height:auto;image-rendering:auto;"></div>
        <div class="reco-tc-chk"><input type="checkbox" id="recoChk_${unit}" style="width:16px;height:16px;accent-color:#9c27b0;cursor:pointer;"></div>
        <div class="reco-tc-n" id="recoN_${unit}">${getUnitCount(unit)}</div>
    </div>`;
}).join('');

var catRows = catNames.map(function(name, i) {
    return `<div class="reco-cat-row" id="recoCat_${i}">
        <div class="reco-cat-row-top">
            <span class="reco-cat-row-icon">${catIcons[i]||'📦'}</span>
            <span class="reco-cat-row-name">${name}</span>
            <span class="reco-cat-row-val" id="recoCatV_${i}">—</span>
            <span id="recoCatOk_${i}"></span>
        </div>
        <div class="reco-cat-troops" id="recoCatTroops_${i}"></div>
    </div>`;
}).join('');

$('body').append(`
<div id="recoPanel">
    <div class="reco-tab"></div>
    <div class="reco-head" style="position:relative;">
        <div style="width:54px;"></div>
        <div class="reco-head-center">
            <div class="reco-head-title">💜 Recolector Simple 💜</div>
            <div class="reco-head-subtitle">Calcula y rellena tus tropas automáticamente</div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:5px;align-self:flex-start;">
            <button class="reco-head-help" id="recoHelpBtn" title="Ayuda">?</button>
            <button class="reco-head-close" id="recoCloseBtn">✕</button>
        </div>
        <div id="recoHelpBox">
            <button class="reco-help-close" onclick="$('#recoHelpBox').hide()">✕</button>
            <h4>🎖️ Tropas</h4>
            <p>Marca las tropas que quieres usar para recolectar. Las que estén desmarcadas se quedan en la aldea.</p>
            <p>El número debajo de cada tropa es cuántas tienes disponibles en este momento.</p>
            <p><strong>Arrastra</strong> las tarjetas para cambiar el orden de prioridad: las tropas de la izquierda se asignan primero a las categorías más rentables.</p>
            <h4>⏰ Tiempo</h4>
            <p>Indica cuántas horas quieres que dure la recolección. El script calculará cuántas tropas enviar a cada categoría para que vuelvan aproximadamente en ese tiempo.</p>
            <h4>📦 Distribución</h4>
            <p>Muestra cuántas tropas se enviarán a cada categoría de recolección.</p>
            <p>El número (ej: <strong>325 tropas</strong>) es el total de unidades que se asignan a ese slot. No es recursos — es la cantidad de soldados que se envían para llenar ese hueco de recolección según tus horas elegidas.</p>
            <p>Las categorías resaltadas en rosa son las que recibirán tropas. Las que muestran <em>—</em> no tienen suficientes tropas disponibles o están bloqueadas.</p>
        </div>
    </div>
    <div class="reco-body">

        <div>
            <div class="reco-sep">🎖️ Tropas · arrastra para prioridad</div>
            <div id="recoTroopRow" class="reco-troop-row">${troopCards}</div>
        </div>

        <div>
            <div class="reco-sep">📦 Distribución</div>
            <div class="reco-cat-grid2">${catRows}</div>
        </div>

        <div>
            <div class="reco-sep">⏰ Tiempo de recolección</div>
            <div class="reco-time-block">
                <div class="reco-chips" id="recoChips">
                    ${[1,2,3,4,6,8,10,12].map(function(h){ return '<div class="reco-chip' + (h===hours?' reco-chip-active':'') + '" data-h="'+h+'">'+h+'h</div>'; }).join('')}
                </div>
                <div class="reco-duration" id="recoDuration"></div>
            </div>
        </div>

        <button id="recoSendAll">⚡ Enviar todo</button>

    </div>
    <div class="reco-footer">💖 Creado por <strong>rabagalan73</strong> para la reina <strong>M0bscene</strong> 💖</div>
</div>`);

// === DRAGGABLE ===
$('#recoPanel').draggable({ handle: '.reco-tab, .reco-head', scroll: false, cancel: 'button,input' });

// === CERRAR ===
$('#recoCloseBtn').on('click', function() {
    _obs.disconnect();
    clearTimeout(_obsTimer);
    $(document).off('click.recoFarm');
    $('#recoPanel').remove();
    $('#recoRabaCSS').remove();
    $('input.unitsInput').val('').trigger('change');
});

// === AYUDA ===
$('#recoHelpBtn').on('click', function(e) {
    e.stopPropagation();
    $('#recoHelpBox').toggle();
});
$(document).on('click.recoFarm', function(e) {
    if (!$(e.target).closest('#recoHelpBox, #recoHelpBtn').length) {
        $('#recoHelpBox').hide();
    }
});

// === RESTAURAR CHECKBOXES ===
worldUnits.forEach(function(unit) {
    var val = checkboxValues.hasOwnProperty(unit) ? checkboxValues[unit] : true;
    $('#recoChk_' + unit).prop('checked', val);
});

// === TOUCH PUNCH (drag en móvil) ===
function loadTouchPunch(cb) {
    if (!('ontouchstart' in window)) { cb(); return; }
    if (window._touchPunchLoaded) { cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js';
    s.onload = function() { window._touchPunchLoaded = true; cb(); };
    document.head.appendChild(s);
}

// === SORTABLE TROPAS ===
loadTouchPunch(function() {
$('#recoTroopRow').sortable({
    axis: 'x', revert: false, containment: 'parent',
    forceHelperSize: true, tolerance: 'pointer', delay: 0, distance: 5, scroll: false,
    stop: function() {
        var newOrder = [];
        $('#recoTroopRow .reco-tc').each(function(){ newOrder.push($(this).data('unit')); });
        priorityOrder = newOrder;
        localStorage.setItem('recoRabaPriority', JSON.stringify(priorityOrder));
        recalculate();
    }
}).disableSelection();

// Reordenar según localStorage
(function() {
    var c = document.getElementById('recoTroopRow');
    if (!c) return;
    priorityOrder.forEach(function(unit) {
        var el = c.querySelector('[data-unit="' + unit + '"]');
        if (el) c.appendChild(el);
    });
})();
}); // loadTouchPunch

// === EVENTOS ===
worldUnits.forEach(function(unit) {
    $('#recoChk_' + unit).on('change', function() {
        checkboxValues[unit] = this.checked;
        localStorage.setItem('checkboxValues', JSON.stringify(checkboxValues));
        recalculate();
    });
});

$('#recoChips').on('click', '.reco-chip', function() {
    var v = parseFloat($(this).data('h'));
    if (isNaN(v) || v <= 0) return;
    hours = v;
    localStorage.setItem('ScavengeTime', hours);
    $('#recoChips .reco-chip').removeClass('reco-chip-active');
    $(this).addClass('reco-chip-active');
    recalculate();
});

// === HELPERS ===
function getUnitCount(unit) {
    var m = $('.units-entry-all[data-unit=' + unit + ']').text().match(/\((\d+)\)/);
    return m ? parseInt(m[1]) : 0;
}

function getAvail() {
    var a = {};
    worldUnits.forEach(function(u) {
        a[u] = $('#recoChk_' + u).is(':checked') ? getUnitCount(u) : 0;
    });
    return a;
}

function calcHaul(h) {
    var t = h * 3600;
    return Math.pow(Math.pow(t / duration_factor - duration_initial_seconds, 1 / duration_exponent) / 100, 0.5);
}

function carryToDuration(carry) {
    // Inversa de calcHaul: dado carry (capacidad de carga), devuelve segundos
    return (Math.pow(carry * carry * 100, duration_exponent) + duration_initial_seconds) * duration_factor;
}

function isSlotUnlocked(i) {
    var $opt = $('.scavenge-option').eq(i);
    if ($opt.hasClass('locked')) return false;
    if ($opt.find('.inactive-view, .active-view').length === 0) return false;
    return true;
}

function isSlotAvailable(i) {
    // Disponible = desbloqueado Y no está actualmente recolectando
    var $opt = $('.scavenge-option').eq(i);
    if ($opt.hasClass('locked')) return false;
    if ($opt.find('.inactive-view').length === 0) return false;
    return true;
}

function buildHaul(target, avail) {
    var remaining = target, result = {};
    priorityOrder.forEach(function(unit) {
        var cap = unitCap[unit] || 0, a = avail[unit] || 0;
        if (remaining <= 0 || cap === 0 || a === 0) { result[unit] = 0; return; }
        var send = Math.min(a, Math.ceil(remaining / cap));
        remaining -= send * cap;
        result[unit] = send;
    });
    return result;
}

function fancyTime(secs) {
    if (secs <= 0) return '—';
    var h = Math.floor(secs / 3600);
    var m = Math.floor((secs % 3600) / 60);
    var s = Math.floor(secs % 60);
    return h + 'h ' + (m < 10 ? '0' : '') + m + 'm ' + (s < 10 ? '0' : '') + s + 's';
}

function recalculate() {
    var avail = getAvail();
    var totalLoot = 0;
    worldUnits.forEach(function(u) { totalLoot += (avail[u] || 0) * (unitCap[u] || 0); });

    var haul      = calcHaul(hours);
    var haulsOrig = [haul / 0.10, haul / 0.25, haul / 0.50, haul / 0.75];

    // Slots disponibles (no bloqueados y no recolectando) ordenados de más a menos rentable
    var activeSlots = [];
    [3, 2, 1, 0].forEach(function(i) { if (isSlotAvailable(i)) activeSlots.push(i); });

    var dists = [{}, {}, {}, {}];
    var finalScale = 1;

    // Reparto proporcional: todos los slots activos corren el mismo tiempo.
    // Si algún slot queda con < 10 tropas, se elimina el menos rentable y se repite.
    while (activeSlots.length > 0) {
        var totalActiveHaul = 0;
        activeSlots.forEach(function(i) { totalActiveHaul += haulsOrig[i]; });
        var scale = (totalActiveHaul > 0 && totalLoot < totalActiveHaul)
            ? totalLoot / totalActiveHaul : 1;
        finalScale = scale;

        var rem = $.extend({}, avail);
        var tempDists = {};
        var minTroops = Infinity;

        activeSlots.forEach(function(i) {
            tempDists[i] = buildHaul(haulsOrig[i] * scale, rem);
            var t = 0;
            for (var u in tempDists[i]) { t += tempDists[i][u]; rem[u] = Math.max(0, (rem[u]||0) - tempDists[i][u]); }
            if (t < minTroops) minTroops = t;
        });

        if (minTroops >= 10) {
            activeSlots.forEach(function(i) { dists[i] = tempDists[i]; });
            break;
        }
        activeSlots.shift(); // quitar el más rentable (Grande primero): los slots menos eficientes absorben más tropas
    }

    currentDistributions = dists;

    // Actualizar cards de categorías
    catNames.forEach(function(name, i) {
        var total = 0, dist = currentDistributions[i];
        for (var u in dist) total += dist[u];
        var card      = document.getElementById('recoCat_' + i);
        var val       = document.getElementById('recoCatV_' + i);
        var okEl      = document.getElementById('recoCatOk_' + i);
        var troopsEl  = document.getElementById('recoCatTroops_' + i);

        if (okEl) {
            if (total === 0) {
                okEl.textContent = ''; okEl.className = '';
            } else if (finalScale >= 0.999) {
                okEl.className = 'reco-cat-ok'; okEl.textContent = '✓';
            } else {
                okEl.className = 'reco-cat-err'; okEl.textContent = '✗';
            }
        }
        if (val)  val.textContent = total > 0 ? total + ' tropas' : '—';
        if (card) card.classList.toggle('reco-active', total > 0);
        if (troopsEl) {
            if (total > 0) {
                troopsEl.innerHTML = priorityOrder.map(function(u) {
                    var n = dist[u] || 0;
                    if (!n) return '';
                    return '<span class="reco-cat-troop">' +
                        '<img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_' + u + '.png">' +
                        n +
                        '</span>';
                }).join('');
            } else {
                troopsEl.innerHTML = '';
            }
        }
    });

    // Actualizar contadores de tropas
    worldUnits.forEach(function(u) {
        var el = document.getElementById('recoN_' + u);
        if (el) el.textContent = getUnitCount(u);
    });

    // Duración
    var dur = document.getElementById('recoDuration');
    if (dur) {
        if (finalScale < 0.999) {
            var estSecs = carryToDuration(haul * finalScale);
            dur.innerHTML = 'Duración objetivo: ' + fancyTime(hours * 3600) +
                '<br><span style="color:#d32f2f;font-weight:800;">⚠ Estimado real: ~' + fancyTime(estSecs) + '</span>';
        } else {
            dur.innerHTML = 'Duración máx: ' + fancyTime(hours * 3600);
        }
    }

    // Rellenar inputs de TODOS los slots disponibles a la vez
    fillAllSlots();
}

function fillSharedInputs(dist) {
    for (var unit in dist) {
        $('input.unitsInput[name="' + unit + '"]')
            .val(dist[unit] > 0 ? dist[unit] : '')
            .trigger('change');
    }
}

function fillAllSlots() {
    var filled = false;
    [3, 2, 1, 0].forEach(function(i) {
        if (filled || !isSlotAvailable(i)) return;
        var $btn = $('.scavenge-option').eq(i).find('.free_send_button');
        var dist = currentDistributions[i] || {};
        var total = 0;
        for (var u in dist) total += dist[u];
        if ($btn.length && !$btn.hasClass('btn-disabled') && total >= 10) {
            fillSharedInputs(dist);
            filled = true;
        }
    });
    if (!filled) $('input.unitsInput').val('').trigger('change');
}

// === CLICK EN "INICIAR" — rellena los inputs correctos antes de que el juego envíe ===
$(document).on('click', '.free_send_button', function() {
    var $option = $(this).closest('.scavenge-option');
    var catIdx  = -1;
    catNames.forEach(function(name, i) {
        if ($option.find('.title').text().trim() === name) catIdx = i;
    });
    if (catIdx !== -1) fillSharedInputs(currentDistributions[catIdx] || {});
    // El juego gestiona el envío con su propio handler
});

// === DETECTAR SLOTS QUE COMPLETAN (vuelven a estar disponibles) ===
var _prevAvailable = [false, false, false, false];
var _obsTimer = null;
var _obs = new MutationObserver(function() {
    clearTimeout(_obsTimer);
    _obsTimer = setTimeout(function() {
        var changed = false;
        for (var i = 0; i < 4; i++) {
            var now = isSlotAvailable(i);
            if (now && !_prevAvailable[i]) changed = true; // slot pasó de activo a libre
            _prevAvailable[i] = now;
        }
        if (changed) recalculate();
    }, 250);
});
_obs.observe(document.querySelector('.options-container') || document.body,
    { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });

// === ENVIAR TODO ===
$('#recoSendAll').on('click', function() {
    var queue = [];
    [3, 2, 1, 0].forEach(function(i) {
        if (!isSlotAvailable(i)) return;
        var $btn = $('.scavenge-option').eq(i).find('.free_send_button');
        var total = 0;
        var dist = currentDistributions[i] || {};
        for (var u in dist) total += dist[u];
        if ($btn.length && !$btn.hasClass('btn-disabled') && total >= 10) queue.push(i);
    });
    sendNext(queue);
});

function sendNext(queue) {
    if (!queue.length) return;
    var i    = queue.shift();
    var $opt = $('.scavenge-option').eq(i);
    var $btn = $opt.find('.free_send_button');
    if (!$btn.length || $btn.hasClass('btn-disabled')) { sendNext(queue); return; }
    fillSharedInputs(currentDistributions[i] || {});
    $btn.trigger('click');
    var waited = 0;
    var poll = setInterval(function() {
        waited += 150;
        var $newBtn = $('.scavenge-option').eq(i).find('.free_send_button');
        if (!$newBtn.length || $newBtn.hasClass('btn-disabled')) {
            clearInterval(poll);
            setTimeout(function() { sendNext(queue); }, 400);
        } else if (waited > 6000) {
            clearInterval(poll);
        }
    }, 150);
}

recalculate();
for (var i = 0; i < 4; i++) _prevAvailable[i] = isSlotAvailable(i);

})();
