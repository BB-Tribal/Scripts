
/************************/
/*    InspectRaba.js    */
/*     Versión 1.1      */
/*   by Rabagalan73    */
/************************/

// ─────────────────────────────────────────────────────────────────────────────
//  CONFIGURACIÓN DEL MUNDO
//  numUnits: 10 = sin arqueros | 12 = con arqueros
// ─────────────────────────────────────────────────────────────────────────────
var IR_CONFIG = {
    numUnits:       10,    // Unidades en este mundo
    farmVillage:    20000, // Pop disponible para tropas en un pueblo estándar
    regenInfDay:    700,   // Infantería regenerada por día (estimación media)
    regenCavDay:    600,   // Caballería regenerada por día (estimación media)
    cavAvgFarm:     4.5,   // Coste medio de pop por unidad de caballería
    fakeThreshold:  2000,  // Pop mínima enviada para considerar el informe informativo (no fake)
};

// Coste de granja según número de unidades del mundo
//                     lanza sword  hacha  espía  cab.lig  cab.pes  ariete  catap  palad  noble
var IR_FARM_10 = [     1,    1,     1,     2,     4,       6,       5,      8,     10,    100  ];
//                     lanza sword  hacha  arqu   espía    cab.lig  arq.m   cab.p  ariete catap  palad  noble
var IR_FARM_12 = [     1,    1,     1,     1,     2,       4,       5,      6,     5,     8,     10,    100  ];

// Índices ofensivos (para calcular % de off) por orden de unidades
//  10u: hacha(2), espía(3), cab.lig(4), cab.pes(5), ariete(6), catap(7), palad(8)
var IR_OFF_IDX_10 = [2, 3, 4, 5, 6, 7, 8];
var IR_OFF_IDX_12 = [2, 3, 4, 5, 6, 7, 8, 9, 10];

// Texto del quickedit-label → índice de unidad requerida (para desambiguar el parser)
var IR_LABEL_REQUIRED_10 = {
    'Ariete': 6, 'Hacha': 2, 'Lanza': 0, 'Espada': 1,
    'Caball': 4, 'Pesada': 5, 'Catap': 7, 'Noble': 9,
};
var IR_LABEL_REQUIRED_12 = {
    'Ariete': 8, 'Hacha': 2, 'Lanza': 0, 'Espada': 1,
    'Arquer': 3, 'Caball': 5, 'Pesada': 7, 'Catap': 9, 'Noble': 11,
};

// Tipos de pueblo → estilo visual
var IR_TYPES = {
    off:           { label: 'OFF',          color: '#c62828', bg: 'rgba(198,40,40,0.13)'  },
    off_blindado:  { label: 'OFF BLIND.',  color: '#8b0000', bg: 'rgba(139,0,0,0.18)'    },
    deff:          { label: 'DEFF',         color: '#1565c0', bg: 'rgba(21,101,192,0.11)' },
    deff_blindado: { label: 'DEFF BLIND.',  color: '#0d47a1', bg: 'rgba(13,71,161,0.17)'  },
    deff_chance:   { label: 'DEFF ★',      color: '#1976d2', bg: 'rgba(25,118,210,0.11)' },
    mixto:         { label: 'MIXTO',        color: '#2e7d32', bg: 'rgba(46,125,50,0.11)'  },
    empty:         { label: 'VACÍO',        color: '#777',    bg: 'rgba(120,120,120,0.08)'},
    barbarian:     { label: 'ABND.',        color: '#777',    bg: 'rgba(120,120,120,0.08)'},
    unknown:       { label: '?',            color: '#888',    bg: 'rgba(100,100,100,0.08)'},
    sin_nota:      { label: 'SIN NOTA',     color: '#aaa',    bg: 'rgba(150,150,150,0.06)'},
};

// ─────────────────────────────────────────────────────────────────────────────
//  PARSER DE TROPAS: divide string concatenado en N enteros sin ceros iniciales
// ─────────────────────────────────────────────────────────────────────────────

function irDFS(str, pos, remaining, current, results, minVals) {
    if (results.length >= 4) return;
    if (pos === str.length && remaining === 0) {
        if (!minVals || current.every(function(v, i){ return v >= (minVals[i] || 0); }))
            results.push(current.slice());
        return;
    }
    if (pos >= str.length || remaining === 0) return;

    var maxLen = str.length - pos - (remaining - 1);
    for (var len = 1; len <= Math.min(maxLen, 6); len++) {
        var token = str.substring(pos, pos + len);
        if (len > 1 && token[0] === '0') break; // sin ceros iniciales
        var val = parseInt(token, 10);
        if (val > 99999) break;
        current.push(val);
        irDFS(str, pos + len, remaining - 1, current, results, minVals);
        current.pop();
    }
}

function irSplitUnitString(str, numUnits, minVals) {
    if (!str || str.length === 0) return null;
    var results = [];
    irDFS(str, 0, numUnits, [], results, minVals || null);
    return results.length > 0 ? results : null;
}

// Elige la mejor solución entre los candidatos usando la unidad requerida por el label
function irPickBestSplit(candidates, requiredIdx) {
    if (!candidates || candidates.length === 0) return null;
    if (candidates.length === 1) return candidates[0];
    if (requiredIdx != null) {
        var filtered = candidates.filter(function(c){ return c[requiredIdx] > 0; });
        if (filtered.length === 1) return filtered[0];
        if (filtered.length > 0) return filtered[0];
    }
    return candidates[0];
}

// Calcula el coste de granja de un array de unidades
function irCalcFarm(units, farmArr) {
    return units.reduce(function(sum, v, i){ return sum + v * (farmArr[i] || 0); }, 0);
}

// ─────────────────────────────────────────────────────────────────────────────
//  EXTRACCIÓN DE BLOQUES DE TROPAS DESDE EL TOOLTIP
// ─────────────────────────────────────────────────────────────────────────────

function irExtractTroopBlocks(noteTitle) {
    var cantArr = [], perdArr = [];
    var cantRe  = /Cantidad:\s*(\d{5,})/g;
    var perdRe  = /Pérdidas:\s*(\d+)/g;
    var m;
    while ((m = cantRe.exec(noteTitle)) !== null) cantArr.push(m[1]);
    while ((m = perdRe.exec(noteTitle)) !== null) perdArr.push(m[1]);

    if (cantArr.length === 0) return null;

    // Nombre del atacante en el informe incrustado
    var attNameMatch = noteTitle.match(/Atacante:\s*\n?\s*(.+?)(?:\n|$)/);
    var attName = attNameMatch ? attNameMatch[1].trim() : null;

    return {
        attacker: { cant: cantArr[0] || '', perd: perdArr[0] || '0' },
        defender: { cant: cantArr[1] || '', perd: perdArr[1] || '0' },
        attackerName: attName,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
//  ANÁLISIS DE TROPAS SUPERVIVIENTES
// ─────────────────────────────────────────────────────────────────────────────

function irAnalyzeTroops(noteTitle, playerName, unitLabel) {
    var n      = IR_CONFIG.numUnits;
    var farmArr = n === 12 ? IR_FARM_12 : IR_FARM_10;
    var offIdx  = n === 12 ? IR_OFF_IDX_12 : IR_OFF_IDX_10;
    var labelMap = n === 12 ? IR_LABEL_REQUIRED_12 : IR_LABEL_REQUIRED_10;

    var blocks = irExtractTroopBlocks(noteTitle);
    if (!blocks) return null;

    // Determinar si la aldea analizada es el atacante o defensor en el informe
    var useBlock = null;
    if (blocks.attackerName && playerName &&
        blocks.attackerName.toLowerCase().trim() === playerName.toLowerCase().trim()) {
        useBlock = blocks.attacker;
    } else {
        useBlock = blocks.attacker; // default: usar bloque atacante
    }

    if (!useBlock || !useBlock.cant || useBlock.cant.length === 0) return null;

    // Parsear pérdidas primero para usarlas como restricción
    var perdResults = irSplitUnitString(useBlock.perd, n, null);
    var perdUnits   = perdResults ? perdResults[0] : null;

    // Parsear cantidad con restricción mínima = pérdidas
    var cantResults = irSplitUnitString(useBlock.cant, n, perdUnits);
    if (!cantResults || cantResults.length === 0) return null;

    // Determinar la unidad requerida por el label del ataque actual
    var requiredIdx = null;
    for (var key in labelMap) {
        if (unitLabel && unitLabel.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
            requiredIdx = labelMap[key];
            break;
        }
    }

    var cantUnits = irPickBestSplit(cantResults, requiredIdx);
    if (!cantUnits) return null;

    // Supervivientes = Cantidad - Pérdidas
    var survivors = cantUnits.map(function(v, i){
        return Math.max(0, v - (perdUnits ? (perdUnits[i] || 0) : 0));
    });

    // Farm de supervivientes (solo unidades ofensivas)
    var survivorFarm = 0;
    offIdx.forEach(function(i){ survivorFarm += survivors[i] * (farmArr[i] || 0); });

    // Farm total enviada (atacante)
    var totalFarm = 0;
    offIdx.forEach(function(i){ totalFarm += cantUnits[i] * (farmArr[i] || 0); });

    var survivorPct = IR_CONFIG.farmVillage > 0
        ? Math.min(100, Math.round(survivorFarm / IR_CONFIG.farmVillage * 100))
        : 0;

    return {
        survivors: survivors,
        cantUnits: cantUnits,
        survivorFarm: survivorFarm,
        survivorPct: survivorPct,
        totalFarm: totalFarm,
        ambiguous: cantResults.length > 1,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
//  PARSER DE NOTA
// ─────────────────────────────────────────────────────────────────────────────

function irParseNote(title) {
    var r = {
        hasNote: false, type: 'sin_nota',
        battleDate: null, battleDaysAgo: null,
        outcome: null, outcomePlayer: null,
        points: null, blindajePop: null,
    };
    if (!title || title.trim() === '') return r;
    if (!title.includes('ANALISIS DE PUEBLO') && !title.includes('ANÁLISIS DE PUEBLO')) return r;

    r.hasNote = true;

    if      (/Posible Ofensivo Blindado/i.test(title))      r.type = 'off_blindado';
    else if (/Posible Ofensivo/i.test(title))               r.type = 'off';
    else if (/Alta Probabilidad de Defensivo/i.test(title)) r.type = 'deff_chance';
    else if (/Posible Defensivo Blindado/i.test(title))     r.type = 'deff_blindado';
    else if (/Posible Defensivo/i.test(title))              r.type = 'deff';
    else if (/Posible Mixto/i.test(title))                  r.type = 'mixto';
    else if (/Pueblo Vacío/i.test(title))                   r.type = 'empty';
    else if (/Pueblo Abandonado/i.test(title))              r.type = 'barbarian';
    else                                                     r.type = 'unknown';

    // Fecha de la batalla (Enviado:)
    var envM = title.match(/Enviado:\s*(\d{2})\.(\d{2})\.(\d{2,4})\s+(\d{2}):(\d{2}):(\d{2})/);
    if (envM) {
        var yr = parseInt(envM[3]); if (yr < 100) yr += 2000;
        r.battleDate = new Date(yr, parseInt(envM[2])-1, parseInt(envM[1]),
                                parseInt(envM[4]), parseInt(envM[5]), parseInt(envM[6]));
        r.battleDaysAgo = Math.max(0, (Date.now() - r.battleDate.getTime()) / 864e5);
    }

    // Resultado
    var outM = title.match(/(.+?)\s+ha\s+(ganado|perdido)/);
    if (outM) { r.outcomePlayer = outM[1].trim(); r.outcome = outM[2]; }

    // Puntos
    var pO = title.match(/Puntos:\s*([\d.,]+)/);
    var pN = title.match(/PUEBLO.*?([\d.,]+)\s*pts/);
    r.points = pO ? pO[1].trim() : (pN ? pN[1].trim() : null);

    // Blindaje pop
    var bM = title.match(/BLINDAJE.*?([\d.]+)\s*pop/i);
    if (bM) r.blindajePop = parseInt(bM[1].replace(/\./g,''));

    return r;
}

// ─────────────────────────────────────────────────────────────────────────────
//  ESTIMACIÓN DE REGEN
// ─────────────────────────────────────────────────────────────────────────────

function irEstimateRegen(days) {
    var regenPop = (IR_CONFIG.regenInfDay + IR_CONFIG.regenCavDay * IR_CONFIG.cavAvgFarm) * days;
    return Math.min(100, Math.round(regenPop / IR_CONFIG.farmVillage * 100));
}

// ─────────────────────────────────────────────────────────────────────────────
//  GENERADOR DE ETIQUETA
// ─────────────────────────────────────────────────────────────────────────────

function irGenerateLabel(atk) {
    var note   = atk.note;
    var troops = atk.troops;

    if (!note.hasNote) return '[?]';

    var type = note.type;

    if (type === 'deff_blindado') return '[🛡★]';
    if (type === 'deff_chance')   return '[🛡?]';
    if (type === 'deff')          return '[🛡]';
    if (type === 'mixto')         return '[MIXTO]';
    if (type === 'empty')         return '[VACÍO]';
    if (type === 'barbarian')     return '[ABND]';
    if (type === 'unknown')       return '[?]';

    // OFF / OFF BLINDADO
    if (type === 'off' || type === 'off_blindado') {
        if (!troops) return '[🪓?]';
        if (troops.totalFarm < IR_CONFIG.fakeThreshold) return '[🪓?]';

        var regenPct = note.battleDaysAgo != null ? irEstimateRegen(note.battleDaysAgo) : 0;
        var total    = Math.min(100, troops.survivorPct + regenPct);
        var suffix   = type === 'off_blindado' ? ' B★' : '';
        return '[~' + total + '% 🪓' + suffix + ']';
    }

    return '[?]';
}

// ─────────────────────────────────────────────────────────────────────────────
//  RENOMBRAR (simulando click en rename-icon, igual que RenombrarEntrates.js)
// ─────────────────────────────────────────────────────────────────────────────

function irSleep(ms) { return new Promise(function(r){ setTimeout(r, ms); }); }

async function irRenameOne(commandId, newLabel) {
    var qe = document.querySelector('.quickedit[data-id="' + commandId + '"]');
    if (!qe) return false;
    var renameIcon = qe.querySelector('.rename-icon');
    if (!renameIcon) return false;

    // Si ya tiene cualquiera de los 3 prefijos, no tocar
    var currentLabel = qe.querySelector('.quickedit-label');
    var currentText  = currentLabel ? currentLabel.textContent.trim() : '';
    if (currentText.startsWith('[❓]') || currentText.startsWith('[💥]') || currentText.startsWith('[✔️]')) return 'already';

    $(renameIcon).click();
    await irSleep(300);

    var input = $(qe).find('input[type=text]');
    if (input.length === 0) return false;
    var current = input.val().trim();
    var prefix  = '[❓] ' + newLabel;
    input.val(current ? prefix + ' ' + current : prefix);
    $(qe).find('input[type=button]').click();
    await irSleep(260); // ~4 por segundo
    return true;
}

async function irMarkAs(commandId, newPrefix) {
    var qe = document.querySelector('.quickedit[data-id="' + commandId + '"]');
    if (!qe) return false;
    var renameIcon = qe.querySelector('.rename-icon');
    if (!renameIcon) return false;

    $(renameIcon).click();
    await irSleep(300);

    var input = $(qe).find('input[type=text]');
    if (input.length === 0) return false;
    var current = input.val().trim();
    // Sustituir cualquier prefijo existente, si no anteponer
    var updated = (current.startsWith('[❓]') || current.startsWith('[💥]') || current.startsWith('[✔️]'))
        ? newPrefix + current.slice(current.indexOf(']') + 1)
        : newPrefix + ' ' + current;
    input.val(updated);
    $(qe).find('input[type=button]').click();
    await irSleep(260);
    return true;
}

async function irRenameAll(attacks) {
    var btn = document.getElementById('ir-btn-all');
    if (btn) { btn.disabled = true; btn.textContent = 'Renombrando...'; }

    var done = 0;
    for (var i = 0; i < attacks.length; i++) {
        var atk   = attacks[i];
        var label = irGenerateLabel(atk);
        var ok    = await irRenameOne(atk.id, label);
        if (ok) done++;

        // Actualizar progreso en el footer
        var foot = document.getElementById('ir-foot-status');
        if (foot) foot.textContent = done + '/' + attacks.length;
    }

    if (btn) { btn.textContent = '✔ Hecho (' + done + ')'; }
}

// ─────────────────────────────────────────────────────────────────────────────
//  PARSEAR TABLA DE ATAQUES
// ─────────────────────────────────────────────────────────────────────────────

function irParseIncomings() {
    var results = [];
    document.querySelectorAll('#incomings_table tr.nowrap').forEach(function(row) {
        var qe = row.querySelector('.quickedit');
        if (!qe) return;
        var id = qe.getAttribute('data-id');

        var labelEl  = row.querySelector('.quickedit-label');
        var labelTxt = labelEl ? labelEl.textContent.trim() : '';
        var unitStr  = labelTxt.split('|')[0].trim();

        var cells = row.querySelectorAll('td');
        var destEl    = cells[1] ? cells[1].querySelector('a') : null;
        var originCell= cells[2];
        var originLink= originCell ? originCell.querySelector('a[href*="info_village"]') : null;
        var playerEl  = cells[3] ? cells[3].querySelector('a') : null;

        var destTxt   = destEl    ? destEl.textContent.trim()    : '—';
        var originTxt = originLink? originLink.textContent.trim() : '—';
        var playerTxt = playerEl  ? playerEl.textContent.trim()  : '—';
        var distTxt   = cells[4]  ? cells[4].textContent.trim()  : '—';
        var arrTxt    = cells[5]  ? cells[5].textContent.replace(/\s+/g,' ').trim() : '—';
        var countdownEl = cells[6] ? cells[6].querySelector('span') : null;
        var countdown = countdownEl ? countdownEl.textContent.trim() : '';

        var noteImg    = originCell ? originCell.querySelector('.icon_village_notes') : null;
        var noteTitle  = noteImg    ? noteImg.getAttribute('data-title') : '';
        var villageUrl = originLink ? originLink.href : null;
        var note     = irParseNote(noteTitle);

        // Análisis de tropas (solo si es OFF y tiene informe)
        var troops = null;
        if (note.hasNote && note.type && note.type.startsWith('off')) {
            troops = irAnalyzeTroops(noteTitle, playerTxt, unitStr);
        }

        var currentLabel = labelEl ? labelEl.textContent.trim() : '';

        results.push({ id, unitStr, destination: destTxt, origin: originTxt,
                        player: playerTxt, distance: distTxt, arrival: arrTxt,
                        countdown, note, troops, noteTitle, currentLabel, villageUrl });
    });
    return results;
}

// ─────────────────────────────────────────────────────────────────────────────
//  DANGER BADGE
// ─────────────────────────────────────────────────────────────────────────────

function irDangerBadge(pct) {
    var levels = [
        { min: 80, label: '⚠ CRÍTICO',    bg: '#b71c1c', color: '#fff' },
        { min: 60, label: '⚠ MUY PELIG.', bg: '#c62828', color: '#fff' },
        { min: 40, label: '⚠ PELIGROSO',  bg: '#e65100', color: '#fff' },
        { min: 20, label: '~ MODERADO',   bg: '#f9a825', color: '#000' },
        { min:  0, label: '✓ BAJO',       bg: '#2e7d32', color: '#fff' },
    ];
    var l = levels.find(function(x){ return pct >= x.min; }) || levels[levels.length-1];
    return '<span class="ir-danger" style="background:' + l.bg + ';color:' + l.color + '">' + l.label + '</span>';
}

// ─────────────────────────────────────────────────────────────────────────────
//  RENDER DE CARD
// ─────────────────────────────────────────────────────────────────────────────

function irRenderCard(atk) {
    var note   = atk.note;
    var troops = atk.troops;
    var meta   = IR_TYPES[note.type] || IR_TYPES.sin_nota;

    // Fecha y tiempo transcurrido
    var battleStr = '', agoStr = '';
    if (note.battleDate) {
        var d = note.battleDate;
        battleStr = d.getDate().toString().padStart(2,'0') + '.'
                  + (d.getMonth()+1).toString().padStart(2,'0') + '.'
                  + String(d.getFullYear()).slice(-2)
                  + ' ' + d.getHours().toString().padStart(2,'0')
                  + ':' + d.getMinutes().toString().padStart(2,'0');
        var days = Math.floor(note.battleDaysAgo);
        var hrs  = Math.floor((note.battleDaysAgo % 1) * 24);
        agoStr = days > 0 ? 'hace ' + days + 'd ' + (hrs>0 ? hrs+'h':'') : 'hace ' + hrs + 'h';
    }

    // Outcome badge
    var outBadge = '';
    if (note.outcome === 'ganado')  outBadge = '<span class="ir-out ir-won">✔ ganó</span>';
    if (note.outcome === 'perdido') outBadge = '<span class="ir-out ir-lost">✘ perdió</span>';

    // Bloque de OFF análisis
    var offBlock = '';
    if (troops) {
        var isFake = troops.totalFarm < IR_CONFIG.fakeThreshold;

        if (isFake) {
            // Ataque fake/pequeño: no podemos inferir la off real del pueblo
            offBlock = `
            <div class="ir-off-block">
                <div class="ir-off-row">
                    <span class="ir-fake-badge">⚠ FAKE / SIN DATOS</span>
                </div>
                <div class="ir-off-detail" style="margin-top:2px">
                    <span class="ir-lbl">Enviados:</span>
                    <span class="ir-val">${Math.round(troops.totalFarm).toLocaleString()} pop — informe no informativo</span>
                </div>
                <div class="ir-off-detail">
                    <span class="ir-lbl">Estado real:</span>
                    <span class="ir-val" style="color:#e65100">Desconocido — posiblemente viva</span>
                </div>
            </div>`;
        } else {
            var survivorPct = troops.survivorPct;
            var regenPct    = note.battleDaysAgo != null ? irEstimateRegen(note.battleDaysAgo) : 0;
            var totalPct    = Math.min(100, survivorPct + regenPct);

            var filled   = Math.round(totalPct / 10);
            var bar      = '█'.repeat(filled) + '░'.repeat(10 - filled);
            var barColor = totalPct >= 80 ? '#b71c1c' : totalPct >= 60 ? '#c62828'
                         : totalPct >= 40 ? '#e65100' : totalPct >= 20 ? '#f9a825' : '#2e7d32';

            offBlock = `
            <div class="ir-off-block">
                <div class="ir-off-row">
                    ${irDangerBadge(totalPct)}
                    <span class="ir-off-pct" style="color:${barColor}">~${totalPct}% OFF</span>
                    ${troops.ambiguous ? '<span class="ir-ambig" title="Múltiples interpretaciones posibles">~</span>' : ''}
                </div>
                <div class="ir-bar" style="color:${barColor}">${bar}</div>
                <div class="ir-off-detail">
                    <span class="ir-lbl">Vivos tras batalla:</span>
                    <span class="ir-val">${survivorPct}% (~${Math.round(troops.survivorFarm).toLocaleString()} pop off)</span>
                </div>
                <div class="ir-off-detail">
                    <span class="ir-lbl">Regen estimada:</span>
                    <span class="ir-val ir-regen">+${regenPct}%</span>
                </div>
            </div>`;
        }
    } else if (note.hasNote && note.type && note.type.startsWith('off') && note.battleDaysAgo != null) {
        // OFF pero sin tropas parseables
        offBlock = `
        <div class="ir-off-block">
            <div class="ir-off-row">
                <span class="ir-fake-badge">⚠ SIN DATOS DE TROPAS</span>
            </div>
            <div class="ir-off-detail" style="margin-top:2px">
                <span class="ir-val" style="color:#e65100">Estado real desconocido — posiblemente viva</span>
            </div>
        </div>`;
    }

    // Info adicional
    var info = '';
    if (note.hasNote) {
        if (battleStr) info += `<div class="ir-line"><span class="ir-lbl">Batalla:</span><span class="ir-val">${battleStr} <span class="ir-ago">${agoStr}</span></span></div>`;
        if (note.points) info += `<div class="ir-line"><span class="ir-lbl">Puntos:</span><span class="ir-val">${note.points}</span></div>`;
        if (note.blindajePop) info += `<div class="ir-line"><span class="ir-lbl">Blindaje:</span><span class="ir-val ir-blind">${note.blindajePop.toLocaleString()} pop</span></div>`;
    }

    var renameLabel = irGenerateLabel(atk);
    var lbl         = atk.currentLabel || '';
    var hasAny      = lbl.startsWith('[❓]') || lbl.startsWith('[💥]') || lbl.startsWith('[✔️]');
    var hasStamp    = lbl.startsWith('[💥]');
    var hasPass     = lbl.startsWith('[✔️]');

    var btnRename = `<button class="ir-btn-rename" ${hasAny ? 'disabled' : ''}
        onclick="irRenameOne('${atk.id}','${renameLabel}').then(function(r){if(r!='already'){this.textContent='✔';this.disabled=true;}}.bind(this))"
        title="Etiquetar: ${renameLabel}">${hasAny ? '✔' : '✏'}</button>`;

    var btnStamp = `<button class="ir-btn-mark" ${hasStamp ? 'disabled style="opacity:.4"' : ''}
        onclick="irMarkAs('${atk.id}','[💥]');this.disabled=true;this.style.opacity='.4';"
        title="Revisado — estampado">💥</button>`;

    var btnPass = `<button class="ir-btn-mark" ${hasPass ? 'disabled style="opacity:.4"' : ''}
        onclick="irMarkAs('${atk.id}','[✔️]');this.disabled=true;this.style.opacity='.4';"
        title="Revisado — pasa de largo">✔️</button>`;

    return `
    <div class="ir-card" style="border-left:3px solid ${meta.color};background:${meta.bg}">
        <div class="ir-card-head">
            <span class="ir-player">${atk.player}</span>
            <div style="display:flex;align-items:center;gap:5px">
                <span class="ir-badge" style="background:${meta.color}">${meta.label}</span>
                ${btnRename}${btnStamp}${btnPass}
            </div>
        </div>
        <div class="ir-origin">${atk.origin}</div>
        <div class="ir-sub">
            <span class="ir-unit">${atk.unitStr}</span>
            <span class="ir-dist">· ${atk.distance}u</span>
            ${atk.countdown ? '<span class="ir-countdown" id="ir-cd-' + atk.id + '">⏱ ' + atk.countdown + '</span>' : ''}
            ${outBadge}
        </div>
        ${offBlock}
        ${info ? '<div class="ir-info">' + info + '</div>' : ''}
        <div class="ir-card-foot">
            <span class="ir-rename-preview">${renameLabel}</span>
            ${note.hasNote && atk.villageUrl ? '<button class="ir-btn-note" onclick="irShowNote(this)" data-url="' + atk.villageUrl + '" data-origin="' + atk.origin + '">📋 Nota</button>' : ''}
        </div>
    </div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
//  MODAL
// ─────────────────────────────────────────────────────────────────────────────

function irShowModal(attacks) {
    $('#ir-panel').remove();
    $('#ir-css').remove();

    $('head').append(`<style id="ir-css">
        #ir-panel {
            position:fixed; top:70px; right:20px; z-index:99999;
            width:420px; max-height:82vh;
            background:#fdf8f0; border-radius:12px;
            box-shadow:0 12px 40px rgba(0,0,0,.45);
            border:1.5px solid #c8b89a;
            font-family:'Segoe UI',Tahoma,sans-serif;
            display:flex; flex-direction:column; overflow:hidden;
        }
        #ir-head {
            background:linear-gradient(135deg,#5a3a28 0%,#3b2010 50%,#1e0f06 100%);
            padding:11px 13px 9px;
            display:flex; align-items:center; justify-content:space-between;
            cursor:move; user-select:none;
            border-bottom:2px solid #c8a96e; flex-shrink:0;
        }
        #ir-head-title { font-size:14px; font-weight:900; color:#f5e6c8; letter-spacing:.5px; }
        #ir-head-sub   { font-size:9px; color:rgba(200,169,110,.8); text-transform:uppercase; letter-spacing:1px; margin-top:2px; }
        #ir-close {
            background:rgba(255,255,255,.1); border:none; cursor:pointer;
            width:23px; height:23px; border-radius:5px; font-size:12px;
            font-weight:900; color:#f5e6c8; display:flex; align-items:center; justify-content:center;
        }
        #ir-close:hover { background:rgba(200,50,50,.5); }
        #ir-body { overflow-y:auto; flex:1; padding:9px; display:flex; flex-direction:column; gap:7px; }
        .ir-card { border-radius:8px; padding:9px 11px; border:1px solid rgba(0,0,0,.07); }
        .ir-card-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:2px; }
        .ir-player { font-size:12px; font-weight:800; color:#2e1f14; }
        .ir-badge  { font-size:9px; font-weight:900; color:#fff; padding:2px 7px; border-radius:10px; text-transform:uppercase; letter-spacing:.5px; }
        .ir-origin { font-size:10px; color:#5a3e2b; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .ir-sub    { display:flex; align-items:center; gap:6px; font-size:10px; color:#888; flex-wrap:wrap; }
        .ir-unit      { color:#8b1a1a; font-weight:700; }
        .ir-countdown { color:#1565c0; font-weight:800; }
        .ir-out    { font-size:9px; font-weight:800; border-radius:8px; padding:1px 6px; }
        .ir-won    { background:rgba(46,125,50,.18); color:#2e7d32; }
        .ir-lost   { background:rgba(198,40,40,.15); color:#c62828; }
        .ir-off-block  { margin-top:6px; border-top:1px solid rgba(0,0,0,.07); padding-top:5px; display:flex; flex-direction:column; gap:3px; }
        .ir-off-row    { display:flex; align-items:center; gap:7px; }
        .ir-danger     { font-size:9px; font-weight:900; padding:2px 7px; border-radius:8px; }
        .ir-off-pct    { font-size:13px; font-weight:900; }
        .ir-ambig      { font-size:9px; color:#e65100; cursor:help; }
        .ir-fake-badge { font-size:9px; font-weight:900; color:#e65100; background:rgba(230,81,0,.12); padding:2px 7px; border-radius:8px; }
        .ir-bar        { font-size:11px; letter-spacing:1.5px; margin:1px 0; }
        .ir-off-detail { display:flex; gap:6px; font-size:10px; }
        .ir-info   { margin-top:5px; border-top:1px solid rgba(0,0,0,.07); padding-top:4px; display:flex; flex-direction:column; gap:2px; }
        .ir-line   { display:flex; gap:6px; font-size:10px; align-items:baseline; }
        .ir-lbl    { color:#999; min-width:58px; flex-shrink:0; }
        .ir-val    { font-weight:700; color:#333; }
        .ir-ago    { font-weight:400; color:#aaa; font-size:9px; }
        .ir-regen  { color:#2e7d32; }
        .ir-blind  { color:#c45e00; }
        #ir-foot   { background:#f0e8d8; border-top:1px solid #d8c9a8; padding:6px 13px; font-size:10px; color:#8b7355; display:flex; justify-content:space-between; align-items:center; flex-shrink:0; gap:8px; }
        #ir-btn-all { background:linear-gradient(135deg,#5a3a28,#1e0f06); color:#f5e6c8; border:none; border-radius:6px; padding:4px 10px; font-size:10px; font-weight:800; cursor:pointer; white-space:nowrap; }
        #ir-btn-all:hover { opacity:.85; }
        #ir-btn-all:disabled { opacity:.5; cursor:default; }
        .ir-btn-rename { background:rgba(90,58,40,.15); border:1px solid rgba(90,58,40,.25); border-radius:5px; padding:1px 6px; font-size:10px; cursor:pointer; color:#5a3a28; }
        .ir-btn-rename:hover { background:rgba(90,58,40,.28); }
        .ir-btn-rename:disabled { opacity:.5; cursor:default; }
        .ir-btn-mark { background:transparent; border:1px solid rgba(0,0,0,.15); border-radius:5px; padding:1px 5px; font-size:11px; cursor:pointer; line-height:1.4; }
        .ir-btn-mark:hover { background:rgba(0,0,0,.07); }
        .ir-btn-mark:disabled { cursor:default; }
        .ir-card-foot      { display:flex; align-items:center; justify-content:space-between; margin-top:4px; }
        .ir-rename-preview { font-size:9px; color:#aaa; font-style:italic; }
        .ir-btn-note       { background:rgba(21,101,192,.1); border:1px solid rgba(21,101,192,.25); border-radius:5px; padding:2px 7px; font-size:9px; cursor:pointer; color:#1565c0; font-weight:700; }
        .ir-btn-note:hover { background:rgba(21,101,192,.2); }
        #ir-note-popup     { position:fixed; z-index:999999; width:480px; max-height:520px; background:#fdf8f0; border:1.5px solid #c8b89a; border-radius:10px; box-shadow:0 8px 30px rgba(0,0,0,.4); display:flex; flex-direction:column; overflow:hidden; font-family:'Segoe UI',Tahoma,sans-serif; }
        #ir-note-popup-head{ background:linear-gradient(135deg,#5a3a28,#1e0f06); padding:8px 12px; display:flex; justify-content:space-between; align-items:center; color:#f5e6c8; font-size:11px; font-weight:800; flex-shrink:0; cursor:move; user-select:none; }
        #ir-note-popup-head button { background:rgba(255,255,255,.1); border:none; color:#f5e6c8; border-radius:4px; width:20px; height:20px; cursor:pointer; font-weight:900; font-size:11px; }
        #ir-note-popup-body{ overflow-y:auto; padding:10px 12px; font-size:10px; line-height:1.6; color:#3d2b1f; word-break:break-word; }
    </style>`);

    var withNote = attacks.filter(function(a){ return a.note.hasNote; }).length;
    var offCount = attacks.filter(function(a){ return a.note.type && a.note.type.startsWith('off'); }).length;
    var deffCount= attacks.filter(function(a){ return a.note.type && a.note.type.startsWith('deff'); }).length;

    $('body').append(`
    <div id="ir-panel">
        <div id="ir-head">
            <div>
                <div id="ir-head-title">⚔ InspectRaba</div>
                <div id="ir-head-sub">${attacks.length} ataques · ${withNote} con nota · ${offCount} OFF · ${deffCount} DEFF</div>
            </div>
            <button id="ir-close" onclick="$('#ir-panel').remove()">✕</button>
        </div>
        <div id="ir-body">${attacks.map(irRenderCard).join('')}</div>
        <div id="ir-foot">
            <span>InspectRaba v1.1 · Raba</span>
            <span id="ir-foot-status"></span>
            <button id="ir-btn-all" onclick="irRenameAll(irCurrentAttacks)">Renombrar todo</button>
        </div>
    </div>`);

    irMakeDraggable(document.getElementById('ir-panel'), document.getElementById('ir-head'));
    irStartCountdownSync(attacks);
}

function irShowNote(btn) {
    $('#ir-note-popup').remove();
    var url    = btn.getAttribute('data-url');
    var origin = btn.getAttribute('data-origin');

    $('body').append(`
    <div id="ir-note-popup">
        <div id="ir-note-popup-head">
            <span>📋 ${origin}</span>
            <button onclick="$('#ir-note-popup').remove()">✕</button>
        </div>
        <div id="ir-note-popup-body"><span style="color:#aaa;font-size:11px">Cargando...</span></div>
    </div>`);

    irPositionPopup(btn);
    irMakeDraggable(document.getElementById('ir-note-popup'), document.getElementById('ir-note-popup-head'));

    $.get(url, function(html) {
        var dom  = new DOMParser().parseFromString(html, 'text/html');
        var note = dom.querySelector('#own_village_note .village-note');
        var body = document.getElementById('ir-note-popup-body');
        if (!body) return;
        if (note && note.children[1]) {
            body.innerHTML = note.children[1].innerHTML;
        } else {
            body.innerHTML = '<span style="color:#aaa">Sin nota registrada.</span>';
        }
        irPositionPopup(btn);
    });
}

function irPositionPopup(btn) {
    var popup = document.getElementById('ir-note-popup');
    if (!popup) return;
    var rect = btn.getBoundingClientRect();
    popup.style.top  = Math.max(10, Math.min(rect.bottom + 6, window.innerHeight - 420)) + 'px';
    popup.style.left = Math.max(10, Math.min(rect.left,       window.innerWidth  - 340)) + 'px';
}

function irStartCountdownSync(attacks) {
    if (window.irCountdownInterval) clearInterval(window.irCountdownInterval);
    window.irCountdownInterval = setInterval(function() {
        if (!document.getElementById('ir-panel')) {
            clearInterval(window.irCountdownInterval);
            return;
        }
        attacks.forEach(function(atk) {
            var display = document.getElementById('ir-cd-' + atk.id);
            if (!display) return;
            var qe  = document.querySelector('.quickedit[data-id="' + atk.id + '"]');
            if (!qe) return;
            var row = qe.closest('tr');
            if (!row) return;
            var cells = row.querySelectorAll('td');
            var src   = cells[6] ? cells[6].querySelector('span') : null;
            if (src) display.textContent = '⏱ ' + src.textContent.trim();
        });
    }, 1000);
}

function irMakeDraggable(el, handle) {
    var sx, sy, sl, st;
    handle.addEventListener('mousedown', function(e) {
        var r = el.getBoundingClientRect();
        sx = e.clientX; sy = e.clientY; sl = r.left; st = r.top;
        el.style.left = sl+'px'; el.style.top = st+'px'; el.style.right='auto'; el.style.bottom='auto';
        function mv(e){ el.style.left=(sl+e.clientX-sx)+'px'; el.style.top=(st+e.clientY-sy)+'px'; }
        function up(){ document.removeEventListener('mousemove',mv); document.removeEventListener('mouseup',up); }
        document.addEventListener('mousemove',mv);
        document.addEventListener('mouseup',up);
    });
}

// ─────────────────────────────────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────────────────────────────────

(function() {
    var params = new URL(window.location.href).searchParams;
    if (params.get('screen') !== 'overview_villages' || params.get('mode') !== 'incomings') {
        UI.ErrorMessage('InspectRaba: Ejecuta desde la pantalla de ataques entrantes.', 3000);
        return;
    }
    if (!document.getElementById('incomings_table')) {
        UI.ErrorMessage('InspectRaba: No se encontró la tabla de ataques.', 3000);
        return;
    }
    window.irCurrentAttacks = irParseIncomings();
    irShowModal(window.irCurrentAttacks);
})();
