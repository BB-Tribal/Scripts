/*
 * Script: Contador de Ofensivas by Raba
 * Versión: 2.3
 * Descripción: Extrae y cuenta las ofensivas de los miembros analizando sus pueblos
 * Autor: Rabagalan73
 * Uso: Ejecutar desde /game.php?screen=ally&mode=members_troops
 * Criterio: SUPER >20650 | FULL 19000-20650 | 3/4 17000-19000 | MEDIA 15000-17000
 * Población Ofensiva: Hacha(1) + Ligera(4) + Arq.Caballo(5) + Ariete(5) + Catapulta(8)
 */

var scriptData = {
    name: 'Ofensivas Counter',
    version: 'v2.3',
    author: 'Rabagalan73'
};

// Población por unidad
var unitPopulation = {
    spear: 1,    // Lancero
    sword: 1,    // Espada
    axe: 1,      // Hacha
    archer: 1,   // Arquero
    spy: 2,      // Espía
    light: 4,    // Caballería Ligera
    marcher: 5,  // Arquero a Caballo
    heavy: 6,    // Caballería Pesada
    ram: 5,      // Ariete
    catapult: 8, // Catapulta
    knight: 1,   // Paladín
    snob: 100    // Noble
};

// Orden canónico de las columnas de tropas en la tabla de "Aldea/Coordenadas + tropas"
// que devuelve la página de miembros de la tribu. Si el mundo no tiene arqueros
// (archer/marcher), esas columnas no existen y todo lo siguiente se desplaza,
// así que el índice de cada unidad se calcula según las unidades reales de game_data.units
// en vez de usar una posición fija.
var UNIT_COLUMN_ORDER = ['spear', 'sword', 'axe', 'archer', 'spy', 'light', 'marcher', 'heavy', 'ram', 'catapult', 'knight', 'snob'];
var presentUnitColumns = UNIT_COLUMN_ORDER.filter(function(u) { return game_data.units.indexOf(u) !== -1; });
function getUnitColIndex(unit) {
    var pos = presentUnitColumns.indexOf(unit);
    return pos === -1 ? -1 : pos + 2; // +2 = columnas Aldea y Coordenadas
}

// Criterios de ofensivas por población
var OFFENSIVE_SUPER_THRESHOLD = 20650;      // SUPER OFF: > 20650
var OFFENSIVE_FULL_MIN = 19000;             // FULL OFF: 19000-20650
var OFFENSIVE_FULL_MAX = 20650;
var OFFENSIVE_THREE_QUARTERS_MIN = 17000;   // 3/4 OFF: 17000-19000
var OFFENSIVE_THREE_QUARTERS_MAX = 19000;
var OFFENSIVE_MEDIUM_MIN = 15000;           // MEDIA OFF: 15000-17000
var OFFENSIVE_MEDIUM_MAX = 17000;

// Umbrales personalizados por el usuario (persisten entre sesiones)
var OFFENSIVE_THRESHOLDS_KEY = 'ofensivas_thresholds';
function loadOffensiveThresholds() {
    try {
        var saved = JSON.parse(localStorage.getItem(OFFENSIVE_THRESHOLDS_KEY));
        if (saved && saved.media > 0 && saved.tres4 > saved.media && saved.full > saved.tres4 && saved.super > saved.full) {
            OFFENSIVE_MEDIUM_MIN = saved.media;
            OFFENSIVE_MEDIUM_MAX = saved.tres4;
            OFFENSIVE_THREE_QUARTERS_MIN = saved.tres4;
            OFFENSIVE_THREE_QUARTERS_MAX = saved.full;
            OFFENSIVE_FULL_MIN = saved.full;
            OFFENSIVE_FULL_MAX = saved.super;
            OFFENSIVE_SUPER_THRESHOLD = saved.super;
        }
    } catch (e) { /* ignorar, se usan los valores por defecto */ }
}
loadOffensiveThresholds();

function getThresholdsText(bold) {
    var b1 = bold ? '<b>' : '', b2 = bold ? '</b>' : '';
    return b1 + 'SUPER:' + b2 + ' &gt;' + OFFENSIVE_SUPER_THRESHOLD.toLocaleString('es-ES') +
        ' | ' + b1 + 'FULL:' + b2 + ' ' + OFFENSIVE_FULL_MIN.toLocaleString('es-ES') + '-' + OFFENSIVE_FULL_MAX.toLocaleString('es-ES') +
        ' | ' + b1 + '3/4:' + b2 + ' ' + OFFENSIVE_THREE_QUARTERS_MIN.toLocaleString('es-ES') + '-' + OFFENSIVE_THREE_QUARTERS_MAX.toLocaleString('es-ES') +
        ' | ' + b1 + 'MEDIA:' + b2 + ' ' + OFFENSIVE_MEDIUM_MIN.toLocaleString('es-ES') + '-' + OFFENSIVE_MEDIUM_MAX.toLocaleString('es-ES');
}

// Verificar que estamos en la página correcta
if (game_data.screen !== 'ally' || !window.location.href.includes('mode=members_troops')) {
    UI.ErrorMessage('Este script debe ejecutarse desde la página de Tropas de la tribu (Tribu → Miembros → Tropas)', 5000);
    throw new Error('Página incorrecta');
}

// Variables globales
var allMembersData = [];
var currentMemberIndex = 0;
var membersList = [];

//////////////////////////////////
//    OBTENER LISTA MIEMBROS    //
//////////////////////////////////

function getMembersList() {
    var members = [];
    var select = $('select[name="player_id"]');
    
    if (!select.length) {
        UI.ErrorMessage('No se encontró el selector de jugadores', 3000);
        return null;
    }
    
    select.find('option').each(function() {
        var value = $(this).val();
        var name = $(this).text().trim();
        
        if (value && value !== '' && name !== 'Seleccionar miembro') {
            members.push({
                id: value,
                name: name
            });
        }
    });
    
    return members;
}

//////////////////////////////////
//    ANALIZAR MIEMBRO          //
//////////////////////////////////

function analyzeMember(playerId, playerName, callback) {
    // Hacer POST para obtener datos del jugador
    $.ajax({
        url: window.location.href,
        type: 'POST',
        data: { player_id: playerId },
        success: function(response) {
            var offensives = extractOffensivesFromResponse(response, playerName, playerId);
            callback(offensives);
        },
        error: function() {
            console.error('Error al analizar jugador: ' + playerName);
            callback(null);
        }
    });
}

//////////////////////////////////
//   EXTRAER OFENSIVAS          //
//////////////////////////////////

function extractOffensivesFromResponse(html, playerName, playerId) {
    var $html = $(html);
    var table = $html.find('#ally_content table.vis').last();
    
    if (!table.length) {
        return null;
    }
    
    var offensiveSuperVillages = [];
    var offensiveFullVillages = [];
    var offensiveThreeQuartersVillages = [];
    var offensiveMediumVillages = [];
    var totalAxe = 0, totalLight = 0, totalMarcher = 0, totalRam = 0, totalCatapult = 0;
    var totalOffensivePopulation = 0;
    var villageCount = 0;
    
    // Analizar cada fila de la tabla (pueblos del jugador)
    table.find('tbody tr').each(function(index) {
        var row = $(this);
        
        // Saltar cabecera y resumen
        if (index === 0 || row.find('td').first().text().trim() === 'Resumen') {
            return;
        }
        
        var cells = row.find('td');
        if (cells.length < (2 + presentUnitColumns.length)) return;

        // Extraer tropas ofensivas del pueblo (índices según unidades reales del mundo)
        var villageName = cells.eq(0).text().trim();
        var villageLink = cells.eq(0).find('a').first().attr('href') || '';
        if (villageLink && villageLink.charAt(0) !== '/' && villageLink.indexOf('http') !== 0) {
            villageLink = '/' + villageLink;
        }
        var idxAxe = getUnitColIndex('axe');
        var idxLight = getUnitColIndex('light');
        var idxMarcher = getUnitColIndex('marcher');
        var idxRam = getUnitColIndex('ram');
        var idxCatapult = getUnitColIndex('catapult');
        var axe = idxAxe === -1 ? 0 : (parseInt(cells.eq(idxAxe).text().trim().replace(/\./g, '').replace(/\s/g, '')) || 0);
        var light = idxLight === -1 ? 0 : (parseInt(cells.eq(idxLight).text().trim().replace(/\./g, '').replace(/\s/g, '')) || 0);
        var marcher = idxMarcher === -1 ? 0 : (parseInt(cells.eq(idxMarcher).text().trim().replace(/\./g, '').replace(/\s/g, '')) || 0);
        var ram = idxRam === -1 ? 0 : (parseInt(cells.eq(idxRam).text().trim().replace(/\./g, '').replace(/\s/g, '')) || 0);
        var catapult = idxCatapult === -1 ? 0 : (parseInt(cells.eq(idxCatapult).text().trim().replace(/\./g, '').replace(/\s/g, '')) || 0);
        
        // Calcular población ofensiva del pueblo
        // Hacha(1) + Ligera(4) + Arq.Caballo(5) + Ariete(5) + Catapulta(8)
        var offensivePopulation = (axe * unitPopulation.axe) + 
                                   (light * unitPopulation.light) + 
                                   (marcher * unitPopulation.marcher) + 
                                   (ram * unitPopulation.ram) + 
                                   (catapult * unitPopulation.catapult);
        
        totalAxe += axe;
        totalLight += light;
        totalMarcher += marcher;
        totalRam += ram;
        totalCatapult += catapult;
        totalOffensivePopulation += offensivePopulation;
        villageCount++;
        
        var villageData = {
            village: villageName,
            link: villageLink,
            axe: axe,
            light: light,
            marcher: marcher,
            ram: ram,
            catapult: catapult,
            offensivePopulation: offensivePopulation,
            deleted: false  // Campo para marcar ofensivas eliminadas
        };
        
        // Clasificar ofensivas
        if (offensivePopulation > OFFENSIVE_SUPER_THRESHOLD) {
            // SUPER OFF: > 20650
            villageData.type = 'SUPER';
            offensiveSuperVillages.push(villageData);
        } else if (offensivePopulation >= OFFENSIVE_FULL_MIN && offensivePopulation <= OFFENSIVE_FULL_MAX) {
            // FULL OFF: 19000-20650
            villageData.type = 'FULL';
            offensiveFullVillages.push(villageData);
        } else if (offensivePopulation >= OFFENSIVE_THREE_QUARTERS_MIN && offensivePopulation < OFFENSIVE_THREE_QUARTERS_MAX) {
            // 3/4 OFF: 17000-19000
            villageData.type = '3/4';
            offensiveThreeQuartersVillages.push(villageData);
        } else if (offensivePopulation >= OFFENSIVE_MEDIUM_MIN && offensivePopulation < OFFENSIVE_MEDIUM_MAX) {
            // MEDIA OFF: 15000-17000
            villageData.type = 'MEDIA';
            offensiveMediumVillages.push(villageData);
        }
    });
    
    return {
        player: playerName,
        playerId: playerId,
        offensiveSuperCount: offensiveSuperVillages.length,
        offensiveFullCount: offensiveFullVillages.length,
        offensiveThreeQuartersCount: offensiveThreeQuartersVillages.length,
        offensiveMediumCount: offensiveMediumVillages.length,
        offensiveSuperVillages: offensiveSuperVillages,
        offensiveFullVillages: offensiveFullVillages,
        offensiveThreeQuartersVillages: offensiveThreeQuartersVillages,
        offensiveMediumVillages: offensiveMediumVillages,
        totalAxe: totalAxe,
        totalLight: totalLight,
        totalMarcher: totalMarcher,
        totalRam: totalRam,
        totalCatapult: totalCatapult,
        totalOffensivePopulation: totalOffensivePopulation,
        villageCount: villageCount
    };
}

//////////////////////////////////
//   PROCESAR TODOS MIEMBROS    //
//////////////////////////////////

function processAllMembers() {
    if (currentMemberIndex >= membersList.length) {
        // Terminado - ocultar barra de progreso
        hideProgressBar();
        displayResults(allMembersData);
        return;
    }
    
    var member = membersList[currentMemberIndex];
    
    analyzeMember(member.id, member.name, function(data) {
        if (data) {
            allMembersData.push(data);
        }
        
        currentMemberIndex++;
        
        // Actualizar barra de progreso
        updateProgressBar();
        
        // Continuar con el siguiente miembro (delay reducido)
        setTimeout(function() {
            processAllMembers();
        }, 100);
    });
}

//////////////////////////////////
//    INICIAR ANÁLISIS          //
//////////////////////////////////

function startAnalysis() {
    membersList = getMembersList();
    
    if (!membersList || membersList.length === 0) {
        UI.ErrorMessage('No se encontraron miembros en la tribu', 3000);
        return;
    }
    
    UI.SuccessMessage('🚀 Iniciando análisis de ' + membersList.length + ' miembros...', 3000);
    
    allMembersData = [];
    currentMemberIndex = 0;
    
    // Mostrar barra de progreso
    showProgressBar();
    
    processAllMembers();
}

//////////////////////////////////
//     BARRA DE PROGRESO        //
//////////////////////////////////

function showProgressBar() {
    var html = '<div id="offensive_progress_bar" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #f4e4bc; border: 3px solid #7d510f; padding: 0; z-index: 10000; width: 500px; border-radius: 5px; box-shadow: 0 0 20px rgba(0,0,0,0.5);">';
    
    // Header
    html += '<div style="background: #c1a264; padding: 15px 20px; border-bottom: 2px solid #7d510f; border-radius: 3px 3px 0 0;">';
    html += '<h3 style="margin: 0; color: #000; text-align: center;">⚔️ Analizando Ofensivas</h3>';
    html += '</div>';
    
    // Contenido
    html += '<div style="padding: 20px;">';
    html += '<p id="progress_text" style="text-align: center; margin: 0 0 15px 0; font-weight: bold; color: #000;">Analizando jugador 0 de ' + membersList.length + '</p>';
    
    // Barra de progreso contenedor
    html += '<div style="background: #7d510f; border-radius: 10px; padding: 3px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);">';
    html += '<div id="progress_bar_fill" style="background: linear-gradient(to bottom, #90EE90 0%, #00ff00 50%, #90EE90 100%); height: 30px; border-radius: 8px; width: 0%; transition: width 0.3s ease; box-shadow: 0 2px 4px rgba(0,255,0,0.4); position: relative; overflow: hidden;">';
    
    // Efecto de brillo animado
    html += '<div style="position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); animation: shimmer 2s infinite;"></div>';
    
    html += '</div>';
    html += '</div>';
    
    html += '<p id="progress_percentage" style="text-align: center; margin: 10px 0 0 0; font-size: 14px; color: #666;">0%</p>';
    html += '</div>';
    html += '</div>';
    
    // Overlay oscuro
    var overlay = '<div id="progress_overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999;"></div>';
    
    // Agregar animación CSS
    var style = '<style>';
    style += '@keyframes shimmer { 0% { left: -100%; } 100% { left: 200%; } }';
    style += '</style>';
    
    $('body').append(style);
    $('body').append(overlay);
    $('body').append(html);
}

function updateProgressBar() {
    var progress = (currentMemberIndex / membersList.length) * 100;
    $('#progress_bar_fill').css('width', progress + '%');
    $('#progress_percentage').text(Math.round(progress) + '%');
    $('#progress_text').text('Analizando jugador ' + currentMemberIndex + ' de ' + membersList.length);
}

function hideProgressBar() {
    $('#offensive_progress_bar').remove();
    $('#progress_overlay').remove();
}

//////////////////////////////////
//      MOSTRAR RESULTADOS      //
//////////////////////////////////

function displayResults(data) {
    if (!data || data.length === 0) {
        UI.ErrorMessage('No se encontraron datos de miembros', 3000);
        return;
    }
    
    // Ordenar por número de ofensivas SUPER, luego FULL, luego 3/4, luego MEDIA
    data.sort(function(a, b) {
        if (b.offensiveSuperCount !== a.offensiveSuperCount) {
            return b.offensiveSuperCount - a.offensiveSuperCount;
        }
        if (b.offensiveFullCount !== a.offensiveFullCount) {
            return b.offensiveFullCount - a.offensiveFullCount;
        }
        if (b.offensiveThreeQuartersCount !== a.offensiveThreeQuartersCount) {
            return b.offensiveThreeQuartersCount - a.offensiveThreeQuartersCount;
        }
        return b.offensiveMediumCount - a.offensiveMediumCount;
    });
    
    // Calcular totales
    var totalOffensivesSuper = 0;
    var totalOffensivesFull = 0;
    var totalOffensivesThreeQuarters = 0;
    var totalOffensivesMedium = 0;
    var totalVillages = 0;
    
    data.forEach(function(member) {
        totalOffensivesSuper += member.offensiveSuperCount;
        totalOffensivesFull += member.offensiveFullCount;
        totalOffensivesThreeQuarters += member.offensiveThreeQuartersCount;
        totalOffensivesMedium += member.offensiveMediumCount;
        totalVillages += member.villageCount;
    });
    
    // Crear el HTML de la tabla
    var html = '<div id="offensive_counter_results" style="margin-top: 20px;">';
    html += '<h3>⚔️ Contador de Ofensivas de la Tribu</h3>';
    html += '<p style="font-size: 11px; color: #666;">';
    html += getThresholdsText(true) + '<br>';
    html += '<i>Población Ofensiva = Hacha(1) + Ligera(4) + Arq.Caballo(5) + Ariete(5) + Catapulta(8)</i>';
    html += '</p>';
    
    // Resumen general
    var totalOffensivesAll = totalOffensivesSuper + totalOffensivesFull + totalOffensivesThreeQuarters + totalOffensivesMedium;
    html += '<table class="vis" style="width: 100%; margin-bottom: 15px;">';
    html += '<tbody>';
    html += '<tr><th colspan="8" style="text-align: center; background-color: #f4e4bc;">Resumen General</th></tr>';
    html += '<tr>';
    html += '<td style="padding: 6px;"><b>SUPER:</b></td><td style="color: #FF0000; font-weight: bold; font-size: 16px;">' + totalOffensivesSuper + '</td>';
    html += '<td style="padding: 6px;"><b>FULL:</b></td><td style="color: #00CC00; font-weight: bold; font-size: 16px;">' + totalOffensivesFull + '</td>';
    html += '<td style="padding: 6px;"><b>3/4:</b></td><td style="color: #FFA500; font-weight: bold; font-size: 16px;">' + totalOffensivesThreeQuarters + '</td>';
    html += '<td style="padding: 6px;"><b>MEDIA:</b></td><td style="color: #9370DB; font-weight: bold; font-size: 16px;">' + totalOffensivesMedium + '</td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td style="padding: 6px;"><b>Total OFFs:</b></td><td style="font-weight: bold;">' + totalOffensivesAll + '</td>';
    html += '<td style="padding: 6px;"><b>Miembros:</b></td><td style="font-weight: bold;">' + data.length + '</td>';
    html += '<td style="padding: 6px;"><b>Promedio:</b></td><td style="font-weight: bold;">' + (totalOffensivesAll / data.length).toFixed(1) + '</td>';
    html += '<td style="padding: 6px;"><b>Pueblos:</b></td><td style="font-weight: bold;">' + totalVillages + '</td>';
    html += '</tr>';
    html += '</tbody></table>';
    
    // Tabla detallada
    html += '<table class="vis" style="width: 100%;">';
    html += '<tbody>';
    html += '<tr>';
    html += '<th>Jugador</th>';
    html += '<th>Pueblos</th>';
    html += '<th style="background-color: #FFB3B3;">SUPER</th>';
    html += '<th style="background-color: #90EE90;">FULL</th>';
    html += '<th style="background-color: #FFD580;">3/4</th>';
    html += '<th style="background-color: #E6B8E6;">MEDIA</th>';
    html += '<th><img src="https://dses.innogamescdn.com/asset/1525e0a2/graphic/unit/unit_axe.webp" title="Total Hachas"></th>';
    html += '<th><img src="https://dses.innogamescdn.com/asset/1525e0a2/graphic/unit/unit_light.webp" title="Total Ligeras"></th>';
    html += '<th><img src="https://dses.innogamescdn.com/asset/1525e0a2/graphic/unit/unit_marcher.webp" title="Total Arq.Caballo"></th>';
    html += '<th><img src="https://dses.innogamescdn.com/asset/1525e0a2/graphic/unit/unit_ram.webp" title="Total Arietes"></th>';
    html += '<th><img src="https://dses.innogamescdn.com/asset/1525e0a2/graphic/unit/unit_catapult.webp" title="Total Catapultas"></th>';
    html += '<th title="Población Ofensiva Total">Pob. OFF</th>';
    html += '<th>Detalles</th>';
    html += '</tr>';
    
    data.forEach(function(member, index) {
        var rowClass = (index % 2 === 0) ? 'row_a' : 'row_b';
        var superColor = member.offensiveSuperCount > 0 ? '#FF0000' : '#999';
        var fullColor = member.offensiveFullCount > 0 ? '#00CC00' : '#999';
        var threeQuartersColor = member.offensiveThreeQuartersCount > 0 ? '#FFA500' : '#999';
        var mediumColor = member.offensiveMediumCount > 0 ? '#9370DB' : '#999';
        var hasOffensives = member.offensiveSuperCount > 0 || member.offensiveFullCount > 0 || member.offensiveThreeQuartersCount > 0 || member.offensiveMediumCount > 0;
        
        html += '<tr class="' + rowClass + '" data-player-id="' + member.playerId + '">';
        html += '<td><a href="/game.php?screen=info_player&id=' + member.playerId + '">' + member.player + '</a></td>';
        html += '<td style="text-align: center;">' + member.villageCount + '</td>';
        html += '<td style="color: ' + superColor + '; font-weight: bold; font-size: 16px; text-align: center;">' + member.offensiveSuperCount + '</td>';
        html += '<td style="color: ' + fullColor + '; font-weight: bold; font-size: 16px; text-align: center;">' + member.offensiveFullCount + '</td>';
        html += '<td style="color: ' + threeQuartersColor + '; font-weight: bold; font-size: 16px; text-align: center;">' + member.offensiveThreeQuartersCount + '</td>';
        html += '<td style="color: ' + mediumColor + '; font-weight: bold; font-size: 16px; text-align: center;">' + member.offensiveMediumCount + '</td>';
        html += '<td style="text-align: center;">' + member.totalAxe.toLocaleString('es-ES') + '</td>';
        html += '<td style="text-align: center;">' + member.totalLight.toLocaleString('es-ES') + '</td>';
        html += '<td style="text-align: center;">' + member.totalMarcher.toLocaleString('es-ES') + '</td>';
        html += '<td style="text-align: center;">' + member.totalRam.toLocaleString('es-ES') + '</td>';
        html += '<td style="text-align: center;">' + member.totalCatapult.toLocaleString('es-ES') + '</td>';
        html += '<td style="text-align: center; font-weight: bold;">' + member.totalOffensivePopulation.toLocaleString('es-ES') + '</td>';
        
        // Botón para ver detalles
        if (hasOffensives) {
            html += '<td style="text-align: center;"><button class="btn btn-sm view_details" data-index="' + index + '">👁️ Ver</button></td>';
        } else {
            html += '<td style="text-align: center;">-</td>';
        }
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    
    // Botones de acción
    html += '<div style="margin-top: 15px; text-align: center;">';
    html += '<button id="copy_offensive_summary" class="btn" style="padding: 8px 20px;">📋 Copiar Resumen BBCode</button>';
    html += '<button id="export_offensive_csv" class="btn" style="padding: 8px 20px; margin-left: 10px;">📊 Exportar a CSV</button>';
    html += '<button id="refresh_analysis" class="btn" style="padding: 8px 20px; margin-left: 10px;">🔄 Actualizar</button>';
    html += '<button id="open_offensive_settings" class="btn" style="padding: 8px 20px; margin-left: 10px;">⚙️ Ajustes</button>';
    html += '</div>';
    
    html += '</div>';
    
    // Insertar en la página
    var container = $('#ally_content');
    $('#offensive_counter_results').remove(); // Eliminar si ya existe
    container.append(html);
    
    // Event listeners para botones
    $('#copy_offensive_summary').click(function() {
        copyBBCodeSummary(data, totalVillages);
    });
    
    $('#export_offensive_csv').click(function() {
        exportToCSV(data);
    });
    
    $('#refresh_analysis').click(function() {
        startAnalysis();
    });

    $('#open_offensive_settings').click(function() {
        showOffensiveSettings();
    });

    // Ver detalles de pueblos ofensivos
    $('.view_details').on('click', function() {
        var index = $(this).data('index');
        showOffensiveDetails(data[index]);
    });
    
    UI.SuccessMessage('✅ Análisis completado: ' + totalOffensivesSuper + ' SUPER, ' + totalOffensivesFull + ' FULL, ' + totalOffensivesThreeQuarters + ' 3/4, ' + totalOffensivesMedium + ' MEDIA', 4000);
}

//////////////////////////////////
//      AJUSTES (UMBRALES)      //
//////////////////////////////////

function showOffensiveSettings() {
    $('#offensive_settings_modal, #settings_overlay').remove();

    var html = '<div id="offensive_settings_modal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #f4e4bc; border: 3px solid #7d510f; padding: 0; z-index: 10001; width: 380px; border-radius: 5px; box-shadow: 0 0 20px rgba(0,0,0,0.5);">';

    html += '<div style="background: #c1a264; padding: 12px 20px; border-bottom: 2px solid #7d510f; border-radius: 3px 3px 0 0;">';
    html += '<h3 style="margin: 0; color: #000;">⚙️ Ajustes — Umbrales de Ofensiva</h3>';
    html += '</div>';

    html += '<div style="padding: 20px;">';
    html += '<p style="font-size: 11px; color: #666; margin: 0 0 14px 0;">Población ofensiva mínima para cada categoría. Deben quedar en orden ascendente (MEDIA &lt; 3/4 &lt; FULL &lt; SUPER).</p>';

    var fields = [
        { id: 'set_thr_media', label: '🟣 MEDIA desde', val: OFFENSIVE_MEDIUM_MIN },
        { id: 'set_thr_tres4', label: '🟠 3/4 desde', val: OFFENSIVE_THREE_QUARTERS_MIN },
        { id: 'set_thr_full', label: '🟢 FULL desde', val: OFFENSIVE_FULL_MIN },
        { id: 'set_thr_super', label: '🔴 SUPER desde', val: OFFENSIVE_SUPER_THRESHOLD }
    ];
    fields.forEach(function(f) {
        html += '<div style="margin-bottom: 10px;">';
        html += '<label style="display: block; font-size: 12px; font-weight: bold; color: #000; margin-bottom: 3px;">' + f.label + '</label>';
        html += '<input type="number" id="' + f.id + '" value="' + f.val + '" min="0" step="1" style="width: 100%; padding: 6px 8px; border: 1px solid #7d510f; border-radius: 4px; box-sizing: border-box;">';
        html += '</div>';
    });

    html += '<div style="display: flex; gap: 8px; margin-top: 16px;">';
    html += '<button id="btn_save_offensive_settings" class="btn" style="flex: 1; padding: 8px;">💾 Guardar y reanalizar</button>';
    html += '<button id="btn_reset_offensive_settings" class="btn" style="flex: 1; padding: 8px;">↩️ Por defecto</button>';
    html += '</div>';
    html += '<div style="text-align: center; margin-top: 10px;"><button id="btn_close_offensive_settings" class="btn">❌ Cerrar</button></div>';
    html += '</div></div>';

    var overlay = '<div id="settings_overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000;"></div>';

    $('body').append(overlay);
    $('body').append(html);

    $('#btn_save_offensive_settings').on('click', function() {
        var media = parseInt($('#set_thr_media').val());
        var tres4 = parseInt($('#set_thr_tres4').val());
        var full = parseInt($('#set_thr_full').val());
        var sup = parseInt($('#set_thr_super').val());

        if ([media, tres4, full, sup].some(function(v) { return isNaN(v) || v < 0; })) {
            alert('Introduce valores numéricos válidos.');
            return;
        }
        if (!(media < tres4 && tres4 < full && full < sup)) {
            alert('Los umbrales deben ir en orden ascendente: MEDIA < 3/4 < FULL < SUPER.');
            return;
        }

        localStorage.setItem(OFFENSIVE_THRESHOLDS_KEY, JSON.stringify({ media: media, tres4: tres4, full: full, super: sup }));
        loadOffensiveThresholds();
        closeOffensiveSettingsModal();
        UI.SuccessMessage('⚙️ Ajustes guardados, reanalizando...', 2000);
        startAnalysis();
    });

    $('#btn_reset_offensive_settings').on('click', function() {
        localStorage.removeItem(OFFENSIVE_THRESHOLDS_KEY);
        OFFENSIVE_MEDIUM_MIN = 15000;
        OFFENSIVE_MEDIUM_MAX = 17000;
        OFFENSIVE_THREE_QUARTERS_MIN = 17000;
        OFFENSIVE_THREE_QUARTERS_MAX = 19000;
        OFFENSIVE_FULL_MIN = 19000;
        OFFENSIVE_FULL_MAX = 20650;
        OFFENSIVE_SUPER_THRESHOLD = 20650;
        closeOffensiveSettingsModal();
        UI.SuccessMessage('↩️ Valores por defecto restaurados, reanalizando...', 2000);
        startAnalysis();
    });

    $('#btn_close_offensive_settings, #settings_overlay').on('click', closeOffensiveSettingsModal);
}

function closeOffensiveSettingsModal() {
    $('#settings_overlay').remove();
    $('#offensive_settings_modal').remove();
}

//////////////////////////////////
//      DETALLES OFENSIVAS      //
//////////////////////////////////

function updateMainTableCounters(memberData) {
    // Recalcular contadores excluyendo las ofensivas eliminadas
    var superCount = memberData.offensiveSuperVillages.filter(function(v) { return !v.deleted; }).length;
    var fullCount = memberData.offensiveFullVillages.filter(function(v) { return !v.deleted; }).length;
    var threeQuartersCount = memberData.offensiveThreeQuartersVillages.filter(function(v) { return !v.deleted; }).length;
    var mediumCount = memberData.offensiveMediumVillages.filter(function(v) { return !v.deleted; }).length;
    
    // Encontrar la fila del jugador en la tabla principal (coincidencia exacta por ID)
    var playerRow = $('#offensive_counter_results table.vis tbody tr[data-player-id="' + memberData.playerId + '"]');
    
    if (playerRow.length > 0) {
        // Actualizar las celdas de contadores (columnas 3, 4, 5, 6 - índices 2, 3, 4, 5)
        var cells = playerRow.find('td');
        
        // SUPER
        var superColor = superCount > 0 ? '#FF0000' : '#999';
        cells.eq(2).html(superCount).css({'color': superColor, 'font-weight': 'bold', 'font-size': '16px', 'text-align': 'center'});
        
        // FULL
        var fullColor = fullCount > 0 ? '#00CC00' : '#999';
        cells.eq(3).html(fullCount).css({'color': fullColor, 'font-weight': 'bold', 'font-size': '16px', 'text-align': 'center'});
        
        // 3/4
        var threeQuartersColor = threeQuartersCount > 0 ? '#FFA500' : '#999';
        cells.eq(4).html(threeQuartersCount).css({'color': threeQuartersColor, 'font-weight': 'bold', 'font-size': '16px', 'text-align': 'center'});
        
        // MEDIA
        var mediumColor = mediumCount > 0 ? '#9370DB' : '#999';
        cells.eq(5).html(mediumCount).css({'color': mediumColor, 'font-weight': 'bold', 'font-size': '16px', 'text-align': 'center'});

        // Nota: el botón "Ver" (celda 12) no se toca aquí a propósito. Los pueblos nunca
        // se eliminan de los arrays (solo se marcan deleted), así que el botón debe seguir
        // disponible siempre para poder reabrir el modal y deshacer eliminaciones, aunque
        // en este momento no queden ofensivas activas para ese jugador.
    }
    
    // Recalcular totales globales
    var totalSuper = 0, totalFull = 0, totalThreeQuarters = 0, totalMedium = 0;
    allMembersData.forEach(function(member) {
        totalSuper += member.offensiveSuperVillages.filter(function(v) { return !v.deleted; }).length;
        totalFull += member.offensiveFullVillages.filter(function(v) { return !v.deleted; }).length;
        totalThreeQuarters += member.offensiveThreeQuartersVillages.filter(function(v) { return !v.deleted; }).length;
        totalMedium += member.offensiveMediumVillages.filter(function(v) { return !v.deleted; }).length;
    });
    
    var totalAll = totalSuper + totalFull + totalThreeQuarters + totalMedium;
    
    // Actualizar la tabla de resumen general
    var summaryTable = $('#offensive_counter_results table.vis').first();
    var summaryRows = summaryTable.find('tbody tr');
    
    // Primera fila de totales
    var firstRowCells = summaryRows.eq(1).find('td');
    firstRowCells.eq(1).html(totalSuper);
    firstRowCells.eq(3).html(totalFull);
    firstRowCells.eq(5).html(totalThreeQuarters);
    firstRowCells.eq(7).html(totalMedium);
    
    // Segunda fila - Total OFFs
    var secondRowCells = summaryRows.eq(2).find('td');
    secondRowCells.eq(1).html(totalAll);
    secondRowCells.eq(5).html((totalAll / allMembersData.length).toFixed(1));
}

function showOffensiveDetails(memberData) {
    var html = '<div id="offensive_details_modal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #f4e4bc; border: 3px solid #7d510f; padding: 0; z-index: 10000; max-height: 80vh; overflow-y: auto; box-shadow: 0 0 20px rgba(0,0,0,0.5); min-width: 650px; border-radius: 5px;">';
    
    // Header con estilo TW
    html += '<div style="background: #c1a264; padding: 10px 20px; border-bottom: 2px solid #7d510f; border-radius: 3px 3px 0 0;">';
    html += '<h3 style="margin: 0; color: #000;">⚔️ Ofensivas - ' + memberData.player + '</h3>';
    html += '</div>';
    
    // Contenido
    html += '<div style="padding: 20px; background: #f4e4bc;">';
    html += '<p style="margin: 5px 0;"><b>SUPER: ' + memberData.offensiveSuperCount + '</b> | <b>FULL: ' + memberData.offensiveFullCount + '</b> | <b>3/4: ' + memberData.offensiveThreeQuartersCount + '</b> | <b>MEDIA: ' + memberData.offensiveMediumCount + '</b></p>';
    html += '<p style="font-size: 10px; color: #666; margin: 5px 0 15px 0;"><i>' + getThresholdsText(false) + '</i></p>';
    
    html += '<table class="vis" style="width: 100%; margin-top: 10px;">';
    html += '<thead>';
    html += '<tr>';
    html += '<th>Tipo</th>';
    html += '<th>Pueblo</th>';
    html += '<th><img src="https://dses.innogamescdn.com/asset/1525e0a2/graphic/unit/unit_axe.webp" title="Hachas"></th>';
    html += '<th><img src="https://dses.innogamescdn.com/asset/1525e0a2/graphic/unit/unit_light.webp" title="Ligeras"></th>';
    html += '<th><img src="https://dses.innogamescdn.com/asset/1525e0a2/graphic/unit/unit_marcher.webp" title="Arq.Caballo"></th>';
    html += '<th><img src="https://dses.innogamescdn.com/asset/1525e0a2/graphic/unit/unit_ram.webp" title="Arietes"></th>';
    html += '<th><img src="https://dses.innogamescdn.com/asset/1525e0a2/graphic/unit/unit_catapult.webp" title="Catapultas"></th>';
    html += '<th>Pob. OFF</th>';
    html += '<th title="Eliminar ofensiva (no se exportará)">⚙️</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';
    
    // Mostrar todas las categorías en orden
    var allVillages = [];
    memberData.offensiveSuperVillages.forEach(function(v) { allVillages.push(v); });
    memberData.offensiveFullVillages.forEach(function(v) { allVillages.push(v); });
    memberData.offensiveThreeQuartersVillages.forEach(function(v) { allVillages.push(v); });
    memberData.offensiveMediumVillages.forEach(function(v) { allVillages.push(v); });
    
    allVillages.forEach(function(village, index) {
        var rowClass = (index % 2 === 0) ? 'row_a' : 'row_b';
        var typeColor, typeBg;
        
        if (village.type === 'SUPER') {
            typeColor = '#FF0000';
            typeBg = '#FFB3B3';
        } else if (village.type === 'FULL') {
            typeColor = '#00CC00';
            typeBg = '#90EE90';
        } else if (village.type === '3/4') {
            typeColor = '#FFA500';
            typeBg = '#FFD580';
        } else {
            typeColor = '#9370DB';
            typeBg = '#E6B8E6';
        }
        
        var rowStyle = village.deleted ? 'opacity: 0.4; text-decoration: line-through;' : '';
        var deleteStatus = village.deleted ? '✓' : '✗';
        var deleteColor = village.deleted ? '#999' : '#d9534f';
        
        html += '<tr class="' + rowClass + ' village-row" data-village-index="' + index + '" style="' + rowStyle + '">';
        html += '<td style="background-color: ' + typeBg + '; text-align: center; font-weight: bold;">' + village.type + '</td>';
        var villageCell = village.link
            ? '<a href="' + village.link + '" target="_blank" style="color:#5b3a00; text-decoration:underline;">' + village.village + '</a>'
            : village.village;
        html += '<td>' + villageCell + '</td>';
        html += '<td style="text-align: center;">' + village.axe.toLocaleString('es-ES') + '</td>';
        html += '<td style="text-align: center;">' + village.light.toLocaleString('es-ES') + '</td>';
        html += '<td style="text-align: center;">' + village.marcher.toLocaleString('es-ES') + '</td>';
        html += '<td style="text-align: center;">' + village.ram.toLocaleString('es-ES') + '</td>';
        html += '<td style="text-align: center;">' + village.catapult.toLocaleString('es-ES') + '</td>';
        html += '<td style="text-align: center; font-weight: bold; color: ' + typeColor + ';">' + village.offensivePopulation.toLocaleString('es-ES') + '</td>';
        html += '<td style="text-align: center;"><button class="btn-delete-village" data-village-index="' + index + '" style="padding: 3px 8px; background: ' + deleteColor + '; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">' + deleteStatus + '</button></td>';
        html += '</tr>';
    });
    
    html += '</tbody>';
    html += '</table>';
    
    html += '<div style="margin-top: 15px; text-align: center;">';
    html += '<button id="btn_close_details" class="btn">❌ Cerrar</button>';
    html += '</div>';
    html += '</div>'; // Cierre del contenido
    html += '</div>'; // Cierre del modal
    
    // Overlay oscuro
    var overlay = '<div id="details_overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999;"></div>';
    
    $('body').append(overlay);
    $('body').append(html);
    
    // Handler para eliminar/restaurar ofensivas
    $('.btn-delete-village').on('click', function() {
        var villageIndex = $(this).data('village-index');
        var village = allVillages[villageIndex];
        
        // Toggle del estado deleted
        village.deleted = !village.deleted;
        
        // Actualizar la fila visualmente
        var row = $(this).closest('tr');
        if (village.deleted) {
            row.css({'opacity': '0.4', 'text-decoration': 'line-through'});
            $(this).text('✓').css('background', '#999');
        } else {
            row.css({'opacity': '1', 'text-decoration': 'none'});
            $(this).text('✗').css('background', '#d9534f');
        }
        
        // Recalcular contadores en el encabezado del modal
        var superCount = 0, fullCount = 0, threeQuartersCount = 0, mediumCount = 0;
        allVillages.forEach(function(v) {
            if (!v.deleted) {
                if (v.type === 'SUPER') superCount++;
                else if (v.type === 'FULL') fullCount++;
                else if (v.type === '3/4') threeQuartersCount++;
                else if (v.type === 'MEDIA') mediumCount++;
            }
        });
        
        $('#offensive_details_modal p').first().html(
            '<b>SUPER: ' + superCount + '</b> | ' +
            '<b>FULL: ' + fullCount + '</b> | ' +
            '<b>3/4: ' + threeQuartersCount + '</b> | ' +
            '<b>MEDIA: ' + mediumCount + '</b>' +
            ' <span style="color: #999; font-size: 10px;">(sin eliminadas)</span>'
        );
        
        // Actualizar contadores en la tabla principal
        updateMainTableCounters(memberData);
        
        UI.InfoMessage(village.deleted ? '🗑️ Ofensiva eliminada (no se exportará)' : '↩️ Ofensiva restaurada', 1500);
    });
    
    // Cerrar al hacer clic
    $('#btn_close_details, #details_overlay').on('click', function() {
        $('#details_overlay').remove();
        $('#offensive_details_modal').remove();
    });
}

//////////////////////////////////
//      COPIAR BBCODE           //
//////////////////////////////////

function copyBBCodeSummary(data, totalVillages) {
    // Recalcular totales excluyendo ofensivas eliminadas
    var totalSuper = 0, totalFull = 0, totalThreeQuarters = 0, totalMedium = 0;
    data.forEach(function(member) {
        totalSuper += member.offensiveSuperVillages.filter(function(v) { return !v.deleted; }).length;
        totalFull += member.offensiveFullVillages.filter(function(v) { return !v.deleted; }).length;
        totalThreeQuarters += member.offensiveThreeQuartersVillages.filter(function(v) { return !v.deleted; }).length;
        totalMedium += member.offensiveMediumVillages.filter(function(v) { return !v.deleted; }).length;
    });
    
    var totalAll = totalSuper + totalFull + totalThreeQuarters + totalMedium;
    var bbcode = '[b][size=14][color=#DAA520]⚔️ OFENSIVAS DE LA TRIBU ⚔️[/color][/size][/b]\n';
    bbcode += '[color=#8B4513]━━━━━━━━━━━━━━━━━━━━━━━━━[/color]\n\n';
    bbcode += '[b]SUPER:[/b] [color=#FF0000]' + totalSuper + '[/color] | ';
    bbcode += '[b]FULL:[/b] [color=#00ff00]' + totalFull + '[/color] | ';
    bbcode += '[b]3/4:[/b] [color=#FFA500]' + totalThreeQuarters + '[/color] | ';
    bbcode += '[b]MEDIA:[/b] [color=#9370DB]' + totalMedium + '[/color]\n';
    bbcode += '[b]Total Ofensivas:[/b] ' + totalAll + '\n';
    bbcode += '[b]Total de Pueblos:[/b] ' + totalVillages + '\n';
    bbcode += '[b]Miembros Analizados:[/b] ' + data.length + '\n';
    bbcode += '[i]' + getThresholdsText(false).replace('&gt;', '>') + '[/i]\n';
    bbcode += '[i]Pob. OFF = Hacha(1) + Ligera(4) + Arq.Caballo(5) + Ariete(5) + Catapulta(8)[/i]\n\n';
    bbcode += '[color=#8B4513]━━━━━━━━━━━━━━━━━━━━━━━━━[/color]\n';
    bbcode += '[b]TOP 10 JUGADORES CON MÁS OFENSIVAS:[/b]\n\n';
    
    var top10 = data.slice(0, 10);
    top10.forEach(function(member, index) {
        // Recalcular contadores excluyendo eliminadas
        var memberSuperCount = member.offensiveSuperVillages.filter(function(v) { return !v.deleted; }).length;
        var memberFullCount = member.offensiveFullVillages.filter(function(v) { return !v.deleted; }).length;
        var memberThreeQuartersCount = member.offensiveThreeQuartersVillages.filter(function(v) { return !v.deleted; }).length;
        var memberMediumCount = member.offensiveMediumVillages.filter(function(v) { return !v.deleted; }).length;
        
        bbcode += (index + 1) + '. [player]' + member.player + '[/player] - ';
        bbcode += '[color=#FF0000][b]' + memberSuperCount + '[/b][/color] SUPER + ';
        bbcode += '[color=#00ff00][b]' + memberFullCount + '[/b][/color] FULL + ';
        bbcode += '[color=#FFA500][b]' + memberThreeQuartersCount + '[/b][/color] 3/4 + ';
        bbcode += '[color=#9370DB][b]' + memberMediumCount + '[/b][/color] MEDIA ';
        bbcode += '(' + member.totalOffensivePopulation.toLocaleString('es-ES') + ' pob. total)\n';
        
        // Listar pueblos SUPER (filtrar eliminadas)
        var superVillages = member.offensiveSuperVillages.filter(function(v) { return !v.deleted; });
        if (superVillages.length > 0) {
            bbcode += '   [b][color=#FF0000]SUPER:[/color][/b]\n';
            superVillages.forEach(function(village) {
                bbcode += '   • ' + village.village + ' - [b]' + village.offensivePopulation.toLocaleString('es-ES') + '[/b] pob.\n';
            });
        }
        
        // Listar pueblos FULL (filtrar eliminadas)
        var fullVillages = member.offensiveFullVillages.filter(function(v) { return !v.deleted; });
        if (fullVillages.length > 0) {
            bbcode += '   [b][color=#00ff00]FULL:[/color][/b]\n';
            fullVillages.forEach(function(village) {
                bbcode += '   • ' + village.village + ' - [b]' + village.offensivePopulation.toLocaleString('es-ES') + '[/b] pob.\n';
            });
        }
        
        // Listar pueblos 3/4 (filtrar eliminadas)
        var threeQuartersVillages = member.offensiveThreeQuartersVillages.filter(function(v) { return !v.deleted; });
        if (threeQuartersVillages.length > 0) {
            bbcode += '   [b][color=#FFA500]3/4:[/color][/b]\n';
            threeQuartersVillages.forEach(function(village) {
                bbcode += '   • ' + village.village + ' - [b]' + village.offensivePopulation.toLocaleString('es-ES') + '[/b] pob.\n';
            });
        }
        
        // Listar pueblos MEDIA (filtrar eliminadas)
        var mediumVillages = member.offensiveMediumVillages.filter(function(v) { return !v.deleted; });
        if (mediumVillages.length > 0) {
            bbcode += '   [b][color=#9370DB]MEDIA:[/color][/b]\n';
            mediumVillages.forEach(function(village) {
                bbcode += '   • ' + village.village + ' - [b]' + village.offensivePopulation.toLocaleString('es-ES') + '[/b] pob.\n';
            });
        }
        bbcode += '\n';
    });
    
    bbcode += '[color=#8B4513]━━━━━━━━━━━━━━━━━━━━━━━━━[/color]';
    
    // Copiar al portapapeles
    var textarea = $('<textarea>');
    textarea.val(bbcode);
    $('body').append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    
    UI.SuccessMessage('✅ Resumen BBCode copiado al portapapeles', 2000);
}

//////////////////////////////////
//      EXPORTAR CSV            //
//////////////////////////////////

function exportToCSV(data) {
    var csv = 'Jugador,ID,Total Pueblos,OFFs SUPER,OFFs FULL,OFFs 3/4,OFFs MEDIA,Total Hachas,Total Ligeras,Total Arq.Caballo,Total Arietes,Total Catapultas,Pob. Ofensiva Total\n';
    
    data.forEach(function(member) {
        // Recalcular contadores excluyendo eliminadas
        var memberSuperCount = member.offensiveSuperVillages.filter(function(v) { return !v.deleted; }).length;
        var memberFullCount = member.offensiveFullVillages.filter(function(v) { return !v.deleted; }).length;
        var memberThreeQuartersCount = member.offensiveThreeQuartersVillages.filter(function(v) { return !v.deleted; }).length;
        var memberMediumCount = member.offensiveMediumVillages.filter(function(v) { return !v.deleted; }).length;
        
        csv += member.player + ',';
        csv += member.playerId + ',';
        csv += member.villageCount + ',';
        csv += memberSuperCount + ',';
        csv += memberFullCount + ',';
        csv += memberThreeQuartersCount + ',';
        csv += memberMediumCount + ',';
        csv += member.totalAxe + ',';
        csv += member.totalLight + ',';
        csv += member.totalMarcher + ',';
        csv += member.totalRam + ',';
        csv += member.totalCatapult + ',';
        csv += member.totalOffensivePopulation + '\n';
        
        // Si tiene pueblos SUPER (filtrar eliminadas)
        if (member.offensiveSuperVillages && member.offensiveSuperVillages.length > 0) {
            member.offensiveSuperVillages.forEach(function(village) {
                if (!village.deleted) {
                    csv += ',SUPER,' + village.village + ',,,,,' ;
                    csv += village.axe + ',';
                    csv += village.light + ',';
                    csv += village.marcher + ',';
                    csv += village.ram + ',';
                    csv += village.catapult + ',';
                    csv += village.offensivePopulation + '\n';
                }
            });
        }
        
        // Si tiene pueblos FULL (filtrar eliminadas)
        if (member.offensiveFullVillages && member.offensiveFullVillages.length > 0) {
            member.offensiveFullVillages.forEach(function(village) {
                if (!village.deleted) {
                    csv += ',FULL,' + village.village + ',,,,,' ;
                    csv += village.axe + ',';
                    csv += village.light + ',';
                    csv += village.marcher + ',';
                    csv += village.ram + ',';
                    csv += village.catapult + ',';
                    csv += village.offensivePopulation + '\n';
                }
            });
        }
        
        // Si tiene pueblos 3/4 (filtrar eliminadas)
        if (member.offensiveThreeQuartersVillages && member.offensiveThreeQuartersVillages.length > 0) {
            member.offensiveThreeQuartersVillages.forEach(function(village) {
                if (!village.deleted) {
                    csv += ',3/4,' + village.village + ',,,,,' ;
                    csv += village.axe + ',';
                    csv += village.light + ',';
                    csv += village.marcher + ',';
                    csv += village.ram + ',';
                    csv += village.catapult + ',';
                    csv += village.offensivePopulation + '\n';
                }
            });
        }
        
        // Si tiene pueblos MEDIA (filtrar eliminadas)
        if (member.offensiveMediumVillages && member.offensiveMediumVillages.length > 0) {
            member.offensiveMediumVillages.forEach(function(village) {
                if (!village.deleted) {
                    csv += ',MEDIA,' + village.village + ',,,,,' ;
                    csv += village.axe + ',';
                    csv += village.light + ',';
                    csv += village.marcher + ',';
                    csv += village.ram + ',';
                    csv += village.catapult + ',';
                    csv += village.offensivePopulation + '\n';
                }
            });
        }
    });
    
    // Crear descarga
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'ofensivas_tribu_' + game_data.world + '.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    UI.SuccessMessage('✅ CSV exportado correctamente', 2000);
}

//////////////////////////////////
//      EJECUTAR SCRIPT         //
//////////////////////////////////

console.log('=== ' + scriptData.name + ' ' + scriptData.version + ' ===');
console.log('Autor: ' + scriptData.author);

// Iniciar el análisis
startAnalysis();
