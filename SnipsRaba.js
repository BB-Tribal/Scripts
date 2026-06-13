/*
 * Script Name: Snipeos por Aldea
 * Version: v2.3.5
 * Author: Rabagalan73
 * Base: RedAlert (twscripts.dev)
 */

var scriptData = {
    prefix: 'singleVillageSnipe',
    name: 'Single Village Snipe',
    version: 'v2.3.5',
    author: 'Rabagalan73',
};

// ── Theme System ──────────────────────────────────────────
var SVS_THEMES = {
    navy:     { name:'Marino',    emoji:'&#x2693;', '--fg-bg':'#0c1220','--fg-bg2':'#131d2e','--fg-bg3':'#091628','--fg-border':'#1e3a5f','--fg-accent':'#3b82f6','--fg-accent2':'#1a3fa0','--fg-text':'#e2e8f0','--fg-text2':'#94a3b8','--fg-hover':'rgba(59,130,246,.12)','--fg-link':'#60a5fa','--fg-shadow':'rgba(0,0,0,.8)' },
    inferno:  { name:'Inferno',   emoji:'&#x1F525;', '--fg-bg':'#1c1f27','--fg-bg2':'#21242e','--fg-bg3':'#17191f','--fg-border':'#2c2f3c','--fg-accent':'#f5a623','--fg-accent2':'#e8700a','--fg-text':'#e2e8f0','--fg-text2':'#8892a4','--fg-hover':'rgba(245,166,35,.08)','--fg-link':'#f5a623','--fg-shadow':'rgba(0,0,0,.7)' },
    emerald:  { name:'Esmeralda', emoji:'&#x1F49A;', '--fg-bg':'#0a1a12','--fg-bg2':'#0d2119','--fg-bg3':'#061009','--fg-border':'#1a4a2e','--fg-accent':'#22c55e','--fg-accent2':'#15803d','--fg-text':'#d1fae5','--fg-text2':'#6ee7b7','--fg-hover':'rgba(34,197,94,.1)','--fg-link':'#4ade80','--fg-shadow':'rgba(0,0,0,.8)' },
    sakura:   { name:'Sakura',    emoji:'&#x1F338;', '--fg-bg':'#fdf2f8','--fg-bg2':'#fce7f3','--fg-bg3':'#fbcfe8','--fg-border':'#f9a8d4','--fg-accent':'#ec4899','--fg-accent2':'#db2777','--fg-text':'#1f2937','--fg-text2':'#6b7280','--fg-hover':'rgba(236,72,153,.07)','--fg-link':'#db2777','--fg-shadow':'rgba(236,72,153,.2)' },
    amethyst: { name:'Amethyst',  emoji:'&#x1F49C;', '--fg-bg':'#faf5ff','--fg-bg2':'#f3e8ff','--fg-bg3':'#ede9fe','--fg-border':'#d8b4fe','--fg-accent':'#7c3aed','--fg-accent2':'#6d28d9','--fg-text':'#1f2937','--fg-text2':'#6b7280','--fg-hover':'rgba(124,58,237,.07)','--fg-link':'#7c3aed','--fg-shadow':'rgba(124,58,237,.2)' },
    matrix:   { name:'Matrix',    emoji:'&#x1F7E2;', '--fg-bg':'#0a0f0a','--fg-bg2':'#0a1a0a','--fg-bg3':'#050a05','--fg-border':'#1a3d1a','--fg-accent':'#00ff41','--fg-accent2':'#00cc34','--fg-text':'#ccffcc','--fg-text2':'#4dff77','--fg-hover':'rgba(0,255,65,.07)','--fg-link':'#00ff41','--fg-shadow':'rgba(0,255,65,.3)' },
    midnight: { name:'Midnight',  emoji:'&#x1F319;', '--fg-bg':'#0f172a','--fg-bg2':'#1a2540','--fg-bg3':'#0a1020','--fg-border':'#334155','--fg-accent':'#3b82f6','--fg-accent2':'#2563eb','--fg-text':'#e2e8f0','--fg-text2':'#94a3b8','--fg-hover':'rgba(59,130,246,.09)','--fg-link':'#60a5fa','--fg-shadow':'rgba(0,0,0,.8)' },
    crimson:  { name:'Crimson',   emoji:'&#x1F534;', '--fg-bg':'#1a0505','--fg-bg2':'#220808','--fg-bg3':'#100303','--fg-border':'#7f1d1d','--fg-accent':'#ef4444','--fg-accent2':'#dc2626','--fg-text':'#fecaca','--fg-text2':'#f87171','--fg-hover':'rgba(239,68,68,.09)','--fg-link':'#f87171','--fg-shadow':'rgba(0,0,0,.8)' },
    obsidian: { name:'Obsidian',  emoji:'&#x1F5A4;', '--fg-bg':'#000000','--fg-bg2':'#0d0d0d','--fg-bg3':'#050505','--fg-border':'#1f1f1f','--fg-accent':'#06b6d4','--fg-accent2':'#0891b2','--fg-text':'#e2e8f0','--fg-text2':'#64748b','--fg-hover':'rgba(6,182,212,.07)','--fg-link':'#38bdf8','--fg-shadow':'rgba(0,0,0,.9)' },
    tribal:   { name:'Tribal',    emoji:'&#x1F3F0;', '--fg-bg':'#f4e8c4','--fg-bg2':'#ecdca8','--fg-bg3':'#e8d4a0','--fg-border':'#9b7b3a','--fg-accent':'#7a9b2a','--fg-accent2':'#5a7a1a','--fg-text':'#3d2b0e','--fg-text2':'#7a5c2e','--fg-hover':'rgba(122,155,42,.09)','--fg-link':'#5a7a1a','--fg-shadow':'rgba(61,43,14,.3)' },
};

function applySVSTheme(name) {
    var th = SVS_THEMES[name] || SVS_THEMES.navy;
    var get = function(k) { return th[k] || ''; };
    var el = document.getElementById('svs-theme-vars');
    if (!el) { el = document.createElement('style'); el.id = 'svs-theme-vars'; document.head.appendChild(el); }
    el.textContent = '.svs-container,.svs-modal-overlay{' +
        '--fg-bg:'      + get('--fg-bg')      + ';' +
        '--fg-bg2:'     + get('--fg-bg2')     + ';' +
        '--fg-bg3:'     + get('--fg-bg3')     + ';' +
        '--fg-border:'  + get('--fg-border')  + ';' +
        '--fg-accent:'  + get('--fg-accent')  + ';' +
        '--fg-accent2:' + get('--fg-accent2') + ';' +
        '--fg-text:'    + get('--fg-text')    + ';' +
        '--fg-text2:'   + get('--fg-text2')   + ';' +
        '--fg-hover:'   + get('--fg-hover')   + ';' +
        '--fg-link:'    + get('--fg-link')    + ';' +
        '--fg-shadow:'  + get('--fg-shadow')  + ';' +
    '}';
    localStorage.setItem('snips_theme', name);
}

function getSVSCurrentTheme() {
    return localStorage.getItem('snips_theme') || 'navy';
}

applySVSTheme(getSVSCurrentTheme());

// User Input
if (typeof DEBUG !== 'boolean') DEBUG = true;
if (typeof REMAINING_TIME_ALERT === 'undefined') REMAINING_TIME_ALERT = '0:00:10';

// Constants
var LS_PREFIX = 'raSingleVillageSnipe';
var TIME_INTERVAL = 60 * 60 * 1000 * 24 * 1;
var GROUP_ID = localStorage.getItem(`${LS_PREFIX}_chosen_group`) ?? 0;
var LAST_UPDATED_TIME = localStorage.getItem(`${LS_PREFIX}_last_updated`) ?? 0;

// Globals
var unitInfo,
    villages = [],
    troopCounts = [];

// SVG Icons
var SVS_ICONS = {
    target:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;flex-shrink:0"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    clock:    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;flex-shrink:0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    gear:     `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;flex-shrink:0"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    sword:    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;flex-shrink:0"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/></svg>`,
    play:     `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;flex-shrink:0"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    copy:     `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;flex-shrink:0"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    upload:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;flex-shrink:0"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
    download: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;flex-shrink:0"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    refresh:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;flex-shrink:0"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
    question: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>`,
    lightning:`<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;flex-shrink:0"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    check:    `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="vertical-align:middle;flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg>`,
    arrow:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;flex-shrink:0"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    checkCircle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    xCircle:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    infoCircle:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    warnCircle:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
};

// Translations
var translations = {
    es_ES: {
        'Single Village Snipe': 'Snipe de Aldea Individual',
        Help: 'Ayuda',
        'This script can only be run on a single village screen!': '¡Este script solo puede ejecutarse en la pantalla de información de aldea!',
        'Landing Time': 'Hora de llegada',
        'Calculate Launch Times': 'Calcular tiempos de envío',
        'Export as BB Code': 'Exportar BB Code',
        'Landing time was updated!': '¡Hora de llegada actualizada!',
        'Plan for:': 'Plan para:',
        'Landing Time:': 'Llegada:',
        Unit: 'Unidad',
        From: 'Desde',
        'Launch Time': 'Hora de envío',
        Command: 'Comando',
        Status: 'Estado',
        Send: 'Enviar',
        'Error fetching village groups!': '¡Error al cargar grupos de aldeas!',
        'Choose Units to Snipe': 'Elige unidades para el snipe',
        Group: 'Grupo',
        'No possible snipe options found!': '¡No se encontraron opciones de snipe!',
        Distance: 'Distancia',
        'An error occured while fetching troop counts!': '¡Error al obtener el recuento de tropas!',
        'snipe attempts found': 'intentos de snipe encontrados',
        'Nothing to export!': '¡Nada que exportar!',
        'Target:': 'Objetivo:',
        'Send in': 'Enviar en',
        'Destination Village': 'Aldea destino',
        Sigil: 'Sigilo',
        'Min. Amount': 'Cant. mínima',
        'Export Config': 'Exportar config',
        'Import Config': 'Importar config',
        'Configuration imported successfully!': '¡Configuración importada con éxito!',
        'Nothing to import!': '¡Nada que importar!',
        'There was an error fetching villages by group!': '¡Error al obtener aldeas por grupo!',
        'Reset Chosen Group': 'Resetear grupo',
        'Chosen group was reset!': '¡Grupo reiniciado!',
        'There was an error!': '¡Hubo un error!',
        'Configuration has been copied!': '¡Configuración copiada!',
        'BBCode have been copied!': '¡BBCode copiado!',
        'This script requires Premium Account!': '¡Este script requiere Cuenta Premium!',
        'Reset Script': 'Reiniciar script',
        'Script configuration has been reset!': '¡Configuración del script reiniciada!',
        'Send in:': 'Enviar en:',
        WB: 'WB',
        'Copied Command successfully': 'Comando copiado con éxito',
        'today at': 'hoy a las',
        'tomorrow at': 'mañana a las',
        on: 'el',
        'Target Config': 'Configuración del objetivo',
        'Advanced Settings': 'Ajustes avanzados',
        'Choose Units': 'Unidades para snipear',
        'Results': 'Resultados',
        'Help & Guide': 'Ayuda y guía',
        'Reset Group': 'Resetear grupo',
    },
    en_DK: {
        'Single Village Snipe': 'Single Village Snipe',
        Help: 'Help',
        'This script can only be run on a single village screen!': 'This script can only be run on a single village screen!',
        'Landing Time': 'Landing Time',
        'Calculate Launch Times': 'Calculate Launch Times',
        'Export as BB Code': 'Export as BB Code',
        'Landing time was updated!': 'Landing time was updated!',
        'Plan for:': 'Plan for:',
        'Landing Time:': 'Landing Time:',
        Unit: 'Unit',
        From: 'From',
        'Launch Time': 'Launch Time',
        Command: 'Command',
        Status: 'Status',
        Send: 'Send',
        'Error fetching village groups!': 'Error fetching village groups!',
        'Choose Units to Snipe': 'Choose Units to Snipe',
        Group: 'Group',
        'No possible snipe options found!': 'No possible snipe options found!',
        Distance: 'Distance',
        'An error occured while fetching troop counts!': 'An error occured while fetching troop counts!',
        'snipe attempts found': 'snipe attempts found',
        'Nothing to export!': 'Nothing to export!',
        'Target:': 'Target:',
        'Send in': 'Send in',
        'Destination Village': 'Destination Village',
        Sigil: 'Sigil',
        'Min. Amount': 'Min. Amount',
        'Export Config': 'Export Config',
        'Import Config': 'Import Config',
        'Configuration imported successfully!': 'Configuration imported successfully!',
        'Nothing to import!': 'Nothing to import!',
        'There was an error fetching villages by group!': 'There was an error fetching villages by group!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Chosen group was reset!': 'Chosen group was reset!',
        'There was an error!': 'There was an error!',
        'Configuration has been copied!': 'Configuration has been copied!',
        'BBCode have been copied!': 'BBCode have been copied!',
        'This script requires Premium Account!': 'This script requires Premium Account!',
        'Reset Script': 'Reset Script',
        'Script configuration has been reset!': 'Script configuration has been reset!',
        'Send in:': 'Send in:',
        WB: 'WB',
        'Copied Command successfully': 'Copied Command successfully',
        'today at': 'today at',
        'tomorrow at': 'tomorrow at',
        on: 'on',
        'Target Config': 'Target Configuration',
        'Advanced Settings': 'Advanced Settings',
        'Choose Units': 'Choose Units',
        'Results': 'Results',
        'Help & Guide': 'Help & Guide',
        'Reset Group': 'Reset Group',
    },
    it_IT: {
        'Single Village Snipe': 'Snipe Singolo Villaggio', Help: 'Aiuto',
        'This script can only be run on a single village screen!': 'Questo script può essere lanciato solo dalla panoramica del villaggio',
        'Landing Time': 'Tempo di arrivo', 'Calculate Launch Times': 'Calcola tempi di lancio',
        'Export as BB Code': 'Esporta in BB code', 'Landing time was updated!': 'Il tempo di arrivo è stato aggiornato!',
        'Plan for:': 'Plan per:', 'Landing Time:': 'Tempo di arrivo:', Unit: 'Unità', From: 'Da',
        'Launch Time': 'Tempo di lancio', Command: 'Comando', Status: 'Stato', Send: 'Invia',
        'Error fetching village groups!': 'Errore nel recupero gruppo!',
        'Choose Units to Snipe': "Scegli l'unità con cui ninjare", Group: 'Gruppo',
        'No possible snipe options found!': 'Nessuna combinazione disponibile!', Distance: 'Distanza',
        'An error occured while fetching troop counts!': 'Errore nel recupero conteggio truppe!',
        'snipe attempts found': 'Ninjata possibile trovata', 'Nothing to export!': "Non c'è niente da esportare!",
        'Target:': 'Target:', 'Send in': 'Lancia tra', 'Destination Village': 'Villaggio di destinazione',
        Sigil: 'Sigillo', 'Min. Amount': 'Qnt. Minima', 'Export Config': 'Esporta configurazione',
        'Import Config': 'Importa configurazione', 'Configuration imported successfully!': 'Configurazione importata con successo!',
        'Nothing to import!': "Non c'è nulla da importare!", 'There was an error fetching villages by group!': 'There was an error fetching villages by group!',
        'Reset Chosen Group': 'Reset Chosen Group', 'Chosen group was reset!': 'Chosen group was reset!',
        'There was an error!': "C'era un errore!", 'Configuration has been copied!': 'Configuration has been copied!',
        'BBCode have been copied!': 'BBCode have been copied!', 'This script requires Premium Account!': 'This script requires Premium Account!',
        'Reset Script': 'Reset Script', 'Script configuration has been reset!': 'Script configuration has been reset!',
        'Send in:': 'Send in:', WB: 'WB', 'Copied Command successfully': 'Copied Command successfully',
        'today at': 'today at', 'tomorrow at': 'tomorrow at', on: 'on',
        'Target Config': 'Configurazione Obiettivo', 'Advanced Settings': 'Impostazioni Avanzate',
        'Choose Units': 'Scegli Unità', 'Results': 'Risultati', 'Help & Guide': 'Aiuto e Guida', 'Reset Group': 'Reset Gruppo',
    },
    pt_PT: {
        'Single Village Snipe': 'Aldeia Única Snipe', Help: 'Ajuda',
        'This script can only be run on a single village screen!': 'Este script só pode ser executado num único ecrã da aldeia!',
        'Landing Time': 'Hora de chegada', 'Calculate Launch Times': 'Calcular os tempos de lançamento',
        'Export as BB Code': 'Exportar como Código BB', 'Landing time was updated!': 'A hora de aterragem foi atualizada!',
        'Plan for:': 'Plano para:', 'Landing Time:': 'hora de aterragem:', Unit: 'Unidade', From: 'de',
        'Launch Time': 'Hora do lançamento', Command: 'Comando', Status: 'Estado', Send: 'Enviar',
        'Error fetching village groups!': 'Erro a carregar os grupos de aldeias!',
        'Choose Units to Snipe': 'Escolha unidades para Snipe', Group: 'Grupo',
        'No possible snipe options found!': 'Não foram encontradas possíveis opções de snipe!', Distance: 'Distância',
        'An error occured while fetching troop counts!': 'Ocorreu um erro ao recolher as contagens das tropas!',
        'snipe attempts found': 'tentativas de snipe encontradas', 'Nothing to export!': 'Nada para exportar!',
        'Target:': 'Alvo:', 'Send in': 'Enviar em', 'Destination Village': 'Aldeia de Destino',
        Sigil: 'Sigil', 'Min. Amount': 'Min. quantidade', 'Export Config': 'Exportar Config',
        'Import Config': 'Importar Config', 'Configuration imported successfully!': 'Configuração importada com sucesso!',
        'Nothing to import!': 'Nada para importar!', 'There was an error fetching villages by group!': 'There was an error fetching villages by group!',
        'Reset Chosen Group': 'Reset Chosen Group', 'Chosen group was reset!': 'Chosen group was reset!',
        'There was an error!': 'There was an error!', 'Configuration has been copied!': 'Configuration has been copied!',
        'BBCode have been copied!': 'BBCode have been copied!', 'This script requires Premium Account!': 'This script requires Premium Account!',
        'Reset Script': 'Reset Script', 'Script configuration has been reset!': 'Script configuration has been reset!',
        'Send in:': 'Send in:', WB: 'WB', 'Copied Command successfully': 'Copied Command successfully',
        'today at': 'today at', 'tomorrow at': 'tomorrow at', on: 'on',
        'Target Config': 'Configuração do Alvo', 'Advanced Settings': 'Configurações Avançadas',
        'Choose Units': 'Escolher Unidades', 'Results': 'Resultados', 'Help & Guide': 'Ajuda e Guia', 'Reset Group': 'Reset Grupo',
    },
    de_DE: {
        'Single Village Snipe': 'Single Village Snipe', Help: 'Hilfe',
        'This script can only be run on a single village screen!': 'Das Skript kann nur auf der Dorfübersicht ausgeführt werden!',
        'Landing Time': 'Ankunftszeit', 'Calculate Launch Times': 'Abschickzeiten berechnen',
        'Export as BB Code': 'Als BB Code exportieren', 'Landing time was updated!': 'Ankunftszeit wurde aktualisiert!',
        'Plan for:': 'Plan für:', 'Landing Time:': 'Ankunftszeit:', Unit: 'Einheit', From: 'Von',
        'Launch Time': 'Abschickzeit', Command: 'Kommand', Status: 'Status', Send: 'Abschicken',
        'Error fetching village groups!': 'Fehler Dörfergruppen zu laden!',
        'Choose Units to Snipe': 'Wähle Einheiten zum berechnen', Group: 'Gruppe',
        'No possible snipe options found!': 'Keine möglichen Befehle gefunden!', Distance: 'Entfernung',
        'An error occured while fetching troop counts!': 'Ein Fehler ist beim laden der Truppen Informationen aufgetreten!',
        'snipe attempts found': 'möglichen Befehle gefunden', 'Nothing to export!': 'Keine Daten zum exportieren gefunden!',
        'Target:': 'Ziel:', 'Send in': 'Abschicken in', 'Destination Village': 'Ziel Dorf',
        Sigil: 'Faktor', 'Min. Amount': 'Min. Menge', 'Export Config': 'Konfiguration exportieren',
        'Import Config': 'Konfiguration importieren', 'Configuration imported successfully!': 'Konfiguration erfolgreich importiert!',
        'Nothing to import!': 'Keine Daten zum importieren!', 'There was an error fetching villages by group!': 'Fehler Dörfer bei Gruppen zu laden!',
        'Reset Chosen Group': 'Gewählte Gruppe zurücksetzen', 'Chosen group was reset!': 'Gewählte Gruppe wurde zurückgesetzt!',
        'There was an error!': 'Es gab einen Fehler!', 'Configuration has been copied!': 'Konfiguration wurde kopiert!',
        'BBCode have been copied!': 'BBCode wurde kopiert!', 'This script requires Premium Account!': 'Dieses Skript benötigt einen Premium Account!',
        'Reset Script': 'Skript zurücksetzen', 'Script configuration has been reset!': 'Script configuration wurde zurückgesetzt!',
        'Send in:': 'Abschicken in:', WB: 'WB', 'Copied Command successfully': 'Befehl erfolgreich kopiert.',
        'today at': 'heute um', 'tomorrow at': 'morgen um', on: 'am',
        'Target Config': 'Ziel Konfiguration', 'Advanced Settings': 'Erweiterte Einstellungen',
        'Choose Units': 'Einheiten wählen', 'Results': 'Ergebnisse', 'Help & Guide': 'Hilfe & Anleitung', 'Reset Group': 'Gruppe zurücksetzen',
    },
    pt_BR: {
        'Single Village Snipe': 'Snip de Aldeia Única', Help: 'Ajuda',
        'This script can only be run on a single village screen!': 'Este script só pode ser executado em uma única tela de aldeia!',
        'Landing Time': 'Hora de chegada', 'Calculate Launch Times': 'Calcular horários de lançamento',
        'Export as BB Code': 'Exportar como código BB', 'Landing time was updated!': 'A hora de chegada foi atualizada!',
        'Plan for:': 'Plano para:', 'Landing Time:': 'Chegada:', Unit: 'Unidade', From: 'Origem',
        'Launch Time': 'Hora do lançamento', Command: 'Comando', Status: 'Estado', Send: 'Enviar',
        'Error fetching village groups!': 'Erro a carregar os grupos de aldeias!',
        'Choose Units to Snipe': 'Escolha as unidades para o Snipe', Group: 'Grupo',
        'No possible snipe options found!': 'Nenhuma opção possível de ataque encontrado!', Distance: 'Distância',
        'An error occured while fetching troop counts!': 'Ocorreu um erro ao recolher as contagens das tropas!',
        'snipe attempts found': 'tentativas de snipe encontradas', 'Nothing to export!': 'Nada para exportar!',
        'Target:': 'Alvo:', 'Send in': 'Enviar em', 'Destination Village': 'Aldeia de Destino',
        Sigil: 'Afliçao', 'Min. Amount': 'Min. quantidade', 'Export Config': 'Exportar Config',
        'Import Config': 'Importar Config', 'Configuration imported successfully!': 'Configuração importada com sucesso!',
        'Nothing to import!': 'Nada para importar!', 'There was an error fetching villages by group!': 'Houve um erro ao importar as vilas por grupo!',
        'Reset Chosen Group': 'Reiniciar grupo escolhido', 'Chosen group was reset!': 'Grupo escolhido foi reiniciado!',
        'There was an error!': 'Houve um erro!', 'Configuration has been copied!': 'Configuração foi copiada!',
        'BBCode have been copied!': 'BBCode foi copiado!', 'This script requires Premium Account!': 'Este script requer uma conta premium!',
        'Reset Script': 'Reiniciar Script', 'Script configuration has been reset!': 'Configuração do Script foi reiniciada!',
        'Send in:': 'Enviar Em:', WB: 'WB', 'Copied Command successfully': 'Comando copiado com sucesso',
        'today at': 'hoje às', 'tomorrow at': 'amanhã às', on: 'em',
        'Target Config': 'Configuração do Alvo', 'Advanced Settings': 'Configurações Avançadas',
        'Choose Units': 'Escolher Unidades', 'Results': 'Resultados', 'Help & Guide': 'Ajuda e Guia', 'Reset Group': 'Reiniciar Grupo',
    },
};

// Init Debug
initDebug();

if (LAST_UPDATED_TIME !== null) {
    if (Date.parse(new Date()) >= LAST_UPDATED_TIME + TIME_INTERVAL) {
        fetchUnitInfo();
    } else {
        unitInfo = JSON.parse(localStorage.getItem(`${LS_PREFIX}_unit_info`));
    }
} else {
    fetchUnitInfo();
}

// ===== ALERT SOUND =====
function svsPlayAlert() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const t = ctx.currentTime;

        const tone = (freq, start, dur, type = 'sine', vol = 0.22) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, t + start);
            gain.gain.linearRampToValueAtTime(vol, t + start + 0.012);
            gain.gain.exponentialRampToValueAtTime(0.001, t + start + dur);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t + start);
            osc.stop(t + start + dur + 0.05);
        };

        // Dos pitidos cortos de aviso + tono largo de urgencia
        tone(880,  0,    0.09);
        tone(880,  0.14, 0.09);
        tone(1174, 0.30, 0.45, 'sine', 0.18);
        // Eco suave para dar profundidad
        tone(587,  0.30, 0.45, 'sine', 0.07);
    } catch (e) {
        TribalWars.playSound('chat');
    }
}

// ===== NOTIFICATION TOAST =====
function svsNotify(message, type = 'success') {
    const TOAST_CSS_ID = 'svsToastStyles';
    if (!document.getElementById(TOAST_CSS_ID)) {
        const style = document.createElement('style');
        style.id = TOAST_CSS_ID;
        style.textContent = `
            #svsToastContainer {
                position: fixed; top: 20px; right: 20px; z-index: 999999;
                display: flex; flex-direction: column; gap: 9px;
                pointer-events: none; width: 300px;
            }
            .svs-toast {
                display: flex; align-items: flex-start; gap: 11px;
                padding: 12px 15px; border-radius: 9px;
                border: 1px solid; border-left: 3px solid;
                box-shadow: 0 6px 24px rgba(0,0,0,0.55);
                font-family: 'Segoe UI', Tahoma, sans-serif;
                font-size: 13px; line-height: 1.45;
                pointer-events: all; cursor: default;
                opacity: 0; transform: translateX(16px);
                transition: opacity 0.22s ease, transform 0.22s ease;
            }
            .svs-toast.svs-toast-in { opacity: 1; transform: translateX(0); }
            .svs-toast-success { background: #091f10; border-color: #166534; color: #86efac; }
            .svs-toast-error   { background: #1f0909; border-color: #991b1b; color: #fca5a5; }
            .svs-toast-info    { background: #091220; border-color: #1e40af; color: #93c5fd; }
            .svs-toast-warning { background: #1f1509; border-color: #92400e; color: #fcd34d; }
            .svs-toast-icon    { flex-shrink: 0; margin-top: 1px; }
            .svs-toast-msg     { flex: 1; }
        `;
        document.head.appendChild(style);
    }

    let container = document.getElementById('svsToastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'svsToastContainer';
        document.body.appendChild(container);
    }

    const iconMap = { success: SVS_ICONS.checkCircle, error: SVS_ICONS.xCircle, info: SVS_ICONS.infoCircle, warning: SVS_ICONS.warnCircle };

    const toast = document.createElement('div');
    toast.className = `svs-toast svs-toast-${type}`;
    toast.innerHTML = `<span class="svs-toast-icon">${iconMap[type] || iconMap.info}</span><span class="svs-toast-msg">${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('svs-toast-in')));

    setTimeout(() => {
        toast.classList.remove('svs-toast-in');
        setTimeout(() => {
            toast.remove();
            if (!container.children.length) container.remove();
        }, 240);
    }, 3600);
}

// ===== INLINE MODAL =====
function svsShowModal(bodyHTML, title) {
    jQuery('#svsInlineModal').remove();

    const titleHTML = title
        ? `<div class="svs-modal-header">
               <div class="svs-modal-title">${title}</div>
               <a href="javascript:void(0);" class="svs-icon-btn svs-inline-modal-close" style="flex-shrink:0">✕</a>
           </div>`
        : '';

    const overlay = jQuery(`
        <div class="svs-modal-overlay" id="svsInlineModal" style="display:none">
            <div class="svs-modal" style="max-width:440px">
                ${titleHTML}
                <div class="svs-modal-body" style="padding:20px">
                    ${bodyHTML}
                </div>
            </div>
        </div>
    `);

    jQuery('body').append(overlay);
    jQuery('html, body').css('overflow', 'hidden');
    overlay.fadeIn(180);

    overlay.on('click', function (e) {
        if (jQuery(e.target).is('#svsInlineModal')) svsCloseModal();
    });
    overlay.find('.svs-inline-modal-close').on('click', svsCloseModal);
}

function svsCloseModal() {
    jQuery('#svsInlineModal').fadeOut(180, function () {
        jQuery(this).remove();
        jQuery('html, body').css('overflow', '');
    });
}

// ===== INITIALIZE =====
async function initVillageSnipe(groupId) {
    [villages, troopCounts] = await Promise.all([
        fetchAllPlayerVillagesByGroup(groupId),
        fetchTroopsForCurrentGroup(groupId),
    ]);
    const groups = await fetchVillageGroups();
    const unitsTable = buildUnitsChoserTable();
    const content = prepareContent(groups, unitsTable);
    renderUI(content);

    if (DEBUG) {
        console.debug(`${scriptInfo()} groupId: `, groupId);
        console.debug(`${scriptInfo()} villages: `, villages);
        console.debug(`${scriptInfo()} troopCounts: `, troopCounts);
    }

    setTimeout(function () {
        let destinationVillage;
        if (mobiledevice) {
            destinationVillage = jQuery('.mobileKeyValue').eq(0).find('div').eq(0).text().match(/\d+\|\d+/)[0];
        } else {
            destinationVillage = jQuery('#content_value table table td:eq(2)').text();
        }

        if (`${LS_PREFIX}_${destinationVillage}` in localStorage) {
            const savedConfig = JSON.parse(localStorage.getItem(`${LS_PREFIX}_${destinationVillage}`));
            const { landingTime, minAmount, sigil } = savedConfig;
            jQuery('#raLandingTime').val(landingTime);
            jQuery('#raMinAmount').val(minAmount);
            jQuery('#raSigil').val(sigil);
        } else {
            jQuery('#raLandingTime').val(new Date().toLocaleString('en-GB').replace(',', ''));
        }

        jQuery('#raDestinationVillage').val(destinationVillage);
    }, 100);

    if (!mobiledevice) {
        jQuery('html,body').animate({ scrollTop: jQuery('#raSingleVillageSnipe').offset().top - 8 }, 'slow');
    }

    // Unit card toggle visual
    jQuery('#raSingleVillageSnipe').off('change', '.ra-unit-selector').on('change', '.ra-unit-selector', function () {
        const label = jQuery(this).closest('.svs-unit-label');
        if (jQuery(this).is(':checked')) {
            label.addClass('is-checked');
            label.find('.svs-unit-check').html(SVS_ICONS.check);
        } else {
            label.removeClass('is-checked');
            label.find('.svs-unit-check').html('');
        }
    });

    // Theme panel
    jQuery('#svsThemeBtn').off('click').on('click', function (e) {
        e.preventDefault();
        jQuery('#svsThemePanel').toggleClass('open');
    });
    jQuery('#svsThemeClose').off('click').on('click', function () {
        jQuery('#svsThemePanel').removeClass('open');
    });
    jQuery('#svsThemeList').off('click').on('click', function (e) {
        var item = jQuery(e.target).closest('.svs-theme-item');
        if (!item.length) return;
        var name = item.data('svs-theme');
        applySVSTheme(name);
        jQuery('.svs-theme-item').removeClass('active');
        item.addClass('active');
    });

    // Help modal
    jQuery('#svsHelpBtn').off('click').on('click', function (e) {
        e.preventDefault();
        jQuery('html, body').css('overflow', 'hidden');
        jQuery('#svsHelpModal').fadeIn(180);
    });
    const closeHelp = function () {
        jQuery('#svsHelpModal').fadeOut(180, function () {
            jQuery('html, body').css('overflow', '');
        });
    };
    jQuery('#svsHelpModalClose').off('click').on('click', closeHelp);
    jQuery('#svsHelpModal').off('click').on('click', function (e) {
        if (jQuery(e.target).is('#svsHelpModal')) closeHelp();
    });

    calculateLaunchTimes();
    fillLandingTimeFromCommand();
    filterVillagesByChosenGroup();
    exportBBCode();
    exportConfig();
    importConfig();
    resetGroup();
    resetScriptHandler();
    autoFillLandingTimeFromUrl();
}

// Build UI content
function prepareContent(groups, unitsTable) {
    const groupsFilter = renderGroupsFilter(groups);

    return `
    <div class="svs-cards-row">
        <div class="svs-card">
            <div class="svs-card-header">
                ${SVS_ICONS.target}
                <span>${tt('Target Config')}</span>
            </div>
            <div class="svs-card-body">
                <div class="svs-field">
                    <label>${tt('Destination Village')}</label>
                    <input id="raDestinationVillage" type="text" value="" placeholder="500|500">
                </div>
                <div class="svs-field">
                    <label>${tt('Landing Time')} <span class="svs-label-hint">dd/mm/yyyy HH:mm:ss</span></label>
                    <input id="raLandingTime" type="text" value="" placeholder="01/01/2025 12:00:00">
                </div>
            </div>
        </div>

        <div class="svs-card">
            <div class="svs-card-header">
                ${SVS_ICONS.gear}
                <span>${tt('Advanced Settings')}</span>
            </div>
            <div class="svs-card-body">
                <div class="svs-fields-inline">
                    <div class="svs-field">
                        <label>${tt('Sigil')} <span class="svs-label-hint">%</span></label>
                        <input id="raSigil" type="text" value="0">
                    </div>
                    <div class="svs-field">
                        <label>${tt('Min. Amount')}</label>
                        <input id="raMinAmount" type="text" value="50">
                    </div>
                </div>
                <div class="svs-field">
                    <label>${tt('Group')}</label>
                    ${groupsFilter}
                </div>
            </div>
        </div>
    </div>

    <div class="svs-card svs-card-units">
        <div class="svs-card-header">
            ${SVS_ICONS.sword}
            <span>${tt('Choose Units')}</span>
            <span class="svs-card-header-hint">clic para seleccionar / deseleccionar</span>
        </div>
        ${unitsTable}
    </div>

    <div class="svs-actions">
        <a href="javascript:void(0);" id="calculateLaunchTimes" class="svs-btn svs-btn-primary">
            ${SVS_ICONS.play} ${tt('Calculate Launch Times')}
        </a>
        <a href="javascript:void(0);" id="exportBBCodeBtn" class="svs-btn svs-btn-secondary" data-snipe="">
            ${SVS_ICONS.copy} ${tt('Export as BB Code')}
        </a>
        <a href="javascript:void(0);" id="exportConfig" class="svs-btn svs-btn-secondary">
            ${SVS_ICONS.upload} ${tt('Export Config')}
        </a>
        <a href="javascript:void(0);" id="importConfig" class="svs-btn svs-btn-secondary">
            ${SVS_ICONS.download} ${tt('Import Config')}
        </a>
        <a href="javascript:void(0);" id="resetGroupBtn" class="svs-btn svs-btn-ghost">
            ${SVS_ICONS.refresh} ${tt('Reset Chosen Group')}
        </a>
    </div>

    <div style="display:none;" id="raPossibleCombinations" class="svs-results">
        <div class="svs-results-header">
            <div class="svs-count-badge">
                ${SVS_ICONS.lightning}
                <strong id="possibleCombinationsCount">0</strong>
                <span>${tt('snipe attempts found')}</span>
            </div>
        </div>
        <div id="possibleCombinationsTable"></div>
    </div>
    `;
}

// Render UI wrapper + styles
function renderUI(body) {
    const helpModal = buildHelpModal();

    const content = `
        <div class="svs-container" id="raSingleVillageSnipe">
            <div class="svs-header">
                <div class="svs-header-left">
                    <span class="svs-header-icon">${SVS_ICONS.target}</span>
                    <span class="svs-title">Snipeos por Aldea</span>
                    <span class="svs-version-badge">${scriptData.version}</span>
                </div>
                <div class="svs-header-right">
                    <a href="javascript:void(0);" id="svsThemeBtn" class="svs-icon-btn" title="Tema visual">🎨</a>
                    <a href="javascript:void(0);" id="svsHelpBtn" class="svs-icon-btn" title="${tt('Help & Guide')}">
                        ${SVS_ICONS.question}
                    </a>
                </div>
            </div>

            <div class="svs-body" id="raSingleVillageSnipeBody">
                ${body}
            </div>

            <div class="svs-footer">
                💖 Creado por <strong>rabagalan73</strong> para la reina <strong>M0bscene</strong> 💖
            </div>

            ${helpModal}

            <div class="svs-theme-panel" id="svsThemePanel">
                <div class="svs-theme-panel-head">
                    <span>🎨 Tema visual</span>
                    <button class="svs-theme-close-btn" id="svsThemeClose">✕</button>
                </div>
                <div class="svs-theme-list" id="svsThemeList">
                    ${Object.keys(SVS_THEMES).map(function(k) {
                        var t = SVS_THEMES[k];
                        var active = k === getSVSCurrentTheme() ? ' active' : '';
                        return '<div class="svs-theme-item' + active + '" data-svs-theme="' + k + '">' +
                            '<div class="svs-theme-dot" style="background:' + t['--fg-accent'] + ';border:2px solid ' + t['--fg-accent2'] + ';"></div>' +
                            '<span class="svs-theme-item-name">' + t.emoji + ' ' + t.name + '</span>' +
                        '</div>';
                    }).join('')}
                </div>
            </div>
        </div>

        <style>
        /* ===== Container ===== */
        .svs-container {
            position: relative; display: block; width: auto; clear: both;
            margin: 0 auto 20px;
            font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
            background: var(--fg-bg);
            border: 2px solid var(--fg-border);
            border-radius: 12px;
            box-shadow: 0 6px 32px var(--fg-shadow), inset 0 1px 0 rgba(59,130,246,0.07);
            box-sizing: border-box;
            overflow: visible;
        }
        .svs-container * { box-sizing: border-box; }

        /* Header */
        .svs-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 12px 20px 12px 18px;
            background: linear-gradient(135deg, var(--fg-bg3) 0%, var(--fg-bg2) 60%, var(--fg-bg3) 100%);
            border-bottom: 2px solid var(--fg-border);
            border-radius: 10px 10px 0 0;
        }
        .svs-header-left { display: flex; align-items: center; gap: 9px; overflow: hidden; }
        .svs-header-icon { color: var(--fg-link); display: flex; align-items: center; flex-shrink: 0; }
        .svs-title { font-size: 17px; font-weight: 700; color: var(--fg-text); letter-spacing: 0.3px; white-space: nowrap; }
        .svs-version-badge {
            background: var(--fg-hover); border: 1px solid var(--fg-border);
            color: var(--fg-link); font-size: 11px; font-weight: 700; padding: 2px 8px;
            border-radius: 20px; letter-spacing: 0.5px; flex-shrink: 0; white-space: nowrap;
        }
        .svs-header-right { display: flex; align-items: center; gap: 7px; flex-shrink: 0; margin-left: 10px; }
        .svs-icon-btn {
            width: 30px; height: 30px; border-radius: 50%;
            border: 1.5px solid var(--fg-border);
            background: var(--fg-hover);
            color: var(--fg-link); cursor: pointer;
            display: inline-flex; align-items: center; justify-content: center;
            transition: all 0.18s; text-decoration: none; flex-shrink: 0;
            font-size: 14px;
        }
        .svs-icon-btn:hover {
            background: var(--fg-hover); border-color: var(--fg-accent); color: var(--fg-link); transform: scale(1.08);
        }

        /* Body */
        .svs-body { padding: 18px; background: var(--fg-bg); }

        /* Cards Row */
        .svs-cards-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .svs-card {
            background: var(--fg-bg2); border: 1px solid var(--fg-border);
            border-radius: 9px; overflow: hidden;
        }
        .svs-card-units { margin-bottom: 14px; }
        .svs-card-header {
            display: flex; align-items: center; gap: 7px; padding: 9px 14px;
            background: var(--fg-hover); border-bottom: 1px solid var(--fg-border);
            font-size: 11px; font-weight: 700; color: var(--fg-link);
            text-transform: uppercase; letter-spacing: 0.9px;
        }
        .svs-card-header-hint {
            margin-left: auto; font-size: 10px; font-weight: 400;
            color: var(--fg-text2); text-transform: none; letter-spacing: 0;
        }
        .svs-card-body { padding: 14px; display: flex; flex-direction: column; gap: 11px; }
        .svs-fields-inline { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .svs-field { display: flex; flex-direction: column; gap: 4px; }
        .svs-field label {
            font-size: 11px; font-weight: 700; color: var(--fg-text2);
            text-transform: uppercase; letter-spacing: 0.7px;
            display: flex; align-items: center; gap: 5px;
        }
        .svs-label-hint { font-size: 10px; font-weight: 400; color: var(--fg-text2); text-transform: none; letter-spacing: 0; }
        .svs-field input[type="text"],
        .svs-field select {
            background: var(--fg-bg3); border: 1px solid var(--fg-border); border-radius: 6px;
            color: var(--fg-text); padding: 7px 11px; font-size: 13px; width: 100%;
            transition: border-color 0.18s, box-shadow 0.18s; outline: none;
            font-family: inherit; appearance: none; -webkit-appearance: none;
        }
        .svs-field input[type="text"]:focus, .svs-field select:focus {
            border-color: var(--fg-accent); box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
        }
        .svs-field input[type="text"]::placeholder { color: var(--fg-text2); }
        .svs-field select { cursor: pointer; }
        .svs-field select option { background: var(--fg-bg2); color: var(--fg-text); }

        /* Units Grid */
        .svs-units-grid { display: flex; flex-wrap: wrap; gap: 6px; padding: 12px 14px; }
        .svs-unit-label {
            display: flex; flex-direction: column; align-items: center; gap: 4px;
            padding: 7px 9px; background: var(--fg-bg2);
            border: 2px solid var(--fg-border); border-radius: 8px;
            cursor: pointer; transition: border-color 0.18s, background 0.18s, box-shadow 0.18s, transform 0.12s;
            min-width: 44px; position: relative; user-select: none;
        }
        .svs-unit-label:hover {
            border-color: var(--fg-accent); background: var(--fg-hover); transform: translateY(-1px);
        }
        .svs-unit-label.is-checked {
            border-color: var(--fg-accent); background: var(--fg-hover); box-shadow: 0 0 10px rgba(59,130,246,0.2);
        }
        .svs-unit-label img { width: 20px; height: 20px; }
        .svs-unit-label input[type="checkbox"] { position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none; }
        .svs-unit-check {
            width: 14px; height: 14px; border-radius: 3px; border: 1.5px solid var(--fg-border);
            background: var(--fg-bg3); display: flex; align-items: center; justify-content: center;
            color: transparent; transition: all 0.18s; flex-shrink: 0;
        }
        .svs-unit-label.is-checked .svs-unit-check { background: var(--fg-accent); border-color: var(--fg-accent); color: #fff; }

        /* Action Buttons */
        .svs-actions { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 14px; }
        .svs-btn {
            display: inline-flex; align-items: center; gap: 5px;
            padding: 8px 14px; border-radius: 7px; border: 1px solid;
            font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.18s;
            text-decoration: none; letter-spacing: 0.3px; font-family: inherit;
            line-height: 1; white-space: nowrap;
        }
        .svs-btn-primary {
            background: linear-gradient(135deg, var(--fg-accent2) 0%, var(--fg-accent) 100%);
            border-color: var(--fg-accent2); color: #fff; font-size: 13px; padding: 9px 18px;
            box-shadow: 0 2px 10px rgba(37,99,235,0.35);
        }
        .svs-btn-primary:hover {
            background: linear-gradient(135deg, var(--fg-accent) 0%, var(--fg-link) 100%);
            box-shadow: 0 4px 16px rgba(37,99,235,0.55); transform: translateY(-1px); color: #fff;
        }
        .svs-btn-secondary { background: var(--fg-hover); border-color: var(--fg-border); color: var(--fg-text2); }
        .svs-btn-secondary:hover { background: var(--fg-hover); border-color: var(--fg-accent); color: var(--fg-text); }
        .svs-btn-ghost { background: transparent; border-color: var(--fg-border); color: var(--fg-text2); }
        .svs-btn-ghost:hover { background: var(--fg-hover); border-color: var(--fg-border); color: var(--fg-text2); }

        /* Results */
        .svs-results { margin-bottom: 14px; }
        .svs-results-header { margin-bottom: 10px; }
        .svs-count-badge {
            display: inline-flex; align-items: center; gap: 7px;
            background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.35);
            color: #4ade80; font-size: 13px; padding: 6px 14px; border-radius: 20px;
        }
        .svs-count-badge strong { font-size: 15px; }

        /* Results Table */
        .svs-table {
            width: 100%; border-collapse: separate; border-spacing: 0;
            border-radius: 8px; overflow: hidden; border: 1px solid var(--fg-border); font-size: 13px;
        }
        .svs-table thead tr { background: linear-gradient(135deg, var(--fg-accent2) 0%, var(--fg-accent) 100%) !important; }
        .svs-table thead th {
            padding: 9px 11px !important; text-align: center !important; font-size: 10px !important;
            font-weight: 700 !important; color: #fff !important; text-transform: uppercase !important;
            letter-spacing: 0.9px !important; border-bottom: 1px solid var(--fg-accent2) !important;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3) !important; background: transparent !important;
        }
        .svs-table thead th:first-child { text-align: left; padding-left: 14px; }
        .svs-table tbody tr { transition: background 0.12s; }
        .svs-table tbody tr:nth-child(odd)  { background: var(--fg-bg2); }
        .svs-table tbody tr:nth-child(even) { background: var(--fg-bg3); }
        .svs-table tbody tr:hover { background: var(--fg-hover) !important; }
        .svs-table tbody td {
            padding: 7px 11px; text-align: center; color: var(--fg-text);
            border-bottom: 1px solid var(--fg-border); vertical-align: middle;
        }
        .svs-table tbody td:first-child { text-align: left; padding-left: 14px; }
        .svs-table tbody tr:last-child td { border-bottom: none; }

        .svs-row-num {
            width: 24px; height: 24px; border-radius: 50%;
            background: var(--fg-hover); color: var(--fg-link);
            font-size: 11px; font-weight: 700;
            display: inline-flex; align-items: center; justify-content: center;
        }
        .svs-village-link { color: var(--fg-link); text-decoration: none; font-weight: 600; transition: color 0.14s; }
        .svs-village-link:hover { color: var(--fg-text); text-decoration: underline; }
        .svs-unit-cell { display: inline-flex; align-items: center; justify-content: center; gap: 5px; }
        .svs-unit-cell img { width: 20px; height: 20px; }
        .svs-unit-amount { font-size: 12px; color: var(--fg-text); font-weight: 600; }
        .svs-timer-cell { font-family: 'Courier New', monospace; font-size: 13px; font-weight: 700; color: #fbbf24; letter-spacing: 1px; }
        .svs-btn-send {
            display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px;
            background: linear-gradient(135deg, #14532d 0%, #166534 100%);
            border: 1px solid #15803d; border-radius: 6px; color: #4ade80;
            font-size: 11px; font-weight: 700; text-decoration: none; transition: all 0.18s; white-space: nowrap;
        }
        .svs-btn-send:hover {
            background: linear-gradient(135deg, #166534 0%, #15803d 100%);
            color: #86efac; transform: translateY(-1px); box-shadow: 0 2px 8px rgba(34,197,94,0.25);
        }

        /* Command row selected highlight */
        .ra-chosen-command td {
            background: linear-gradient(135deg, var(--fg-accent2) 0%, var(--fg-accent) 100%) !important;
            color: #fff !important;
            font-weight: 600 !important;
            border-top: 1px solid var(--fg-accent) !important;
            border-bottom: 1px solid var(--fg-accent2) !important;
            text-shadow: 0 1px 2px rgba(0,0,0,0.4) !important;
        }
        .ra-chosen-command td a,
        .ra-chosen-command td a:visited {
            color: var(--fg-link) !important;
            text-decoration: none !important;
        }

        /* Footer */
        .svs-footer {
            padding: 9px 18px; background: var(--fg-bg2);
            border-top: 1px solid var(--fg-border); border-radius: 0 0 10px 10px;
            text-align: center; font-size: 11px; color: var(--fg-text2); font-style: italic;
        }
        .svs-footer strong { font-style: normal; color: var(--fg-text2); }

        /* Shared Modal */
        .svs-modal-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.78); z-index: 99999;
            display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .svs-modal {
            background: var(--fg-bg); border: 2px solid var(--fg-border); border-radius: 12px;
            max-width: 580px; width: 100%; max-height: 85vh;
            overflow: hidden;
            display: flex; flex-direction: column;
            box-shadow: 0 20px 60px rgba(0,0,0,0.85);
        }
        .svs-modal-overlay { overflow: hidden; }
        .svs-modal-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 15px 20px;
            background: linear-gradient(135deg, var(--fg-bg3) 0%, var(--fg-bg2) 100%);
            border-bottom: 1px solid var(--fg-border);
        }
        .svs-modal-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: var(--fg-text); }
        .svs-modal-body {
            padding: 22px; overflow-x: hidden; overflow-y: auto;
            color: var(--fg-text2); line-height: 1.65; font-size: 13px;
            background: var(--fg-bg);
        }
        .svs-modal-body label {
            display: block; font-size: 11px; font-weight: 700; color: var(--fg-text2);
            text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 6px;
        }
        .svs-modal-body textarea {
            width: 100%; resize: vertical;
            background: var(--fg-bg3); border: 1px solid var(--fg-border); border-radius: 6px;
            color: var(--fg-text); padding: 9px 11px; font-family: 'Courier New', monospace;
            font-size: 12px; line-height: 1.5; outline: none;
            transition: border-color 0.18s, box-shadow 0.18s;
        }
        .svs-modal-body textarea:focus { border-color: var(--fg-accent); box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
        .svs-modal-body textarea { overflow-x: hidden; word-break: break-all; }

        /* Scrollbar personalizado */
        .svs-modal-body::-webkit-scrollbar { width: 5px; }
        .svs-modal-body::-webkit-scrollbar-track { background: transparent; }
        .svs-modal-body::-webkit-scrollbar-thumb { background: var(--fg-border); border-radius: 10px; }
        .svs-modal-body::-webkit-scrollbar-thumb:hover { background: var(--fg-accent); }
        .svs-modal-body textarea::-webkit-scrollbar { width: 5px; height: 5px; }
        .svs-modal-body textarea::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
        .svs-modal-body textarea::-webkit-scrollbar-thumb { background: var(--fg-border); border-radius: 10px; }
        .svs-modal-body textarea::-webkit-scrollbar-thumb:hover { background: var(--fg-accent); }
        .svs-modal-body textarea::-webkit-scrollbar-corner { background: transparent; }
        .svs-modal-body h4 {
            color: var(--fg-link); font-size: 11px; text-transform: uppercase; letter-spacing: 0.9px;
            margin: 18px 0 8px; padding-bottom: 5px; border-bottom: 1px solid var(--fg-border);
        }
        .svs-modal-body h4:first-child { margin-top: 0; }
        .svs-modal-body p { margin: 0 0 10px; color: var(--fg-text2); }
        .svs-modal-body ul, .svs-modal-body ol { margin: 0 0 10px; padding-left: 20px; }
        .svs-modal-body li { margin-bottom: 5px; color: var(--fg-text2); }
        .svs-modal-body strong { color: var(--fg-text); }
        .svs-modal-body .svs-help-field {
            display: flex; gap: 10px; align-items: flex-start; padding: 8px 12px;
            background: var(--fg-bg2); border: 1px solid var(--fg-border); border-radius: 7px; margin-bottom: 7px;
        }
        .svs-modal-body .svs-help-field-icon { color: var(--fg-link); flex-shrink: 0; margin-top: 1px; }
        .svs-modal-body .svs-help-field-name { font-weight: 700; color: var(--fg-text); display: block; margin-bottom: 2px; }
        .svs-modal-body .svs-tip {
            background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.25);
            border-radius: 7px; padding: 9px 13px; margin-bottom: 7px; color: #4ade80; font-size: 12px;
        }
        .svs-modal-body .svs-tip::before { content: '💡 '; }
        .svs-modal-action-row { display: flex; gap: 8px; margin-top: 12px; }
        .svs-modal-action-row .svs-btn { flex: 1; justify-content: center; }

        /* ── Theme Panel ── */
        .svs-theme-panel {
            display: none; position: absolute; top: 0; right: 0; bottom: 0;
            width: 210px; background: var(--fg-bg2);
            border-left: 1px solid var(--fg-border);
            z-index: 200; flex-direction: column;
            box-shadow: -6px 0 24px rgba(0,0,0,.3);
            border-radius: 0 10px 10px 0;
        }
        .svs-theme-panel.open { display: flex; }
        .svs-theme-panel-head {
            background: linear-gradient(135deg, var(--fg-bg3) 0%, var(--fg-bg2) 100%);
            padding: 11px 14px; display: flex; align-items: center; justify-content: space-between;
            border-bottom: 1px solid var(--fg-border); flex-shrink: 0;
            border-radius: 0 10px 0 0;
        }
        .svs-theme-panel-head span { font-size: 12px; font-weight: 700; color: var(--fg-text); }
        .svs-theme-close-btn {
            background: rgba(255,255,255,.05); border: 1px solid var(--fg-border);
            color: var(--fg-text2); width: 22px; height: 22px; border-radius: 5px;
            cursor: pointer; font-size: 11px; display: flex; align-items: center;
            justify-content: center; line-height: 1; transition: all .15s;
        }
        .svs-theme-close-btn:hover { background: var(--fg-hover); color: var(--fg-text); }
        .svs-theme-list {
            padding: 8px; display: flex; flex-direction: column; gap: 4px;
            overflow-y: auto; flex: 1;
        }
        .svs-theme-item {
            display: flex; align-items: center; gap: 8px; padding: 7px 9px;
            border-radius: 7px; border: 1.5px solid transparent; cursor: pointer;
            transition: border-color .15s, background .15s; background: var(--fg-bg);
        }
        .svs-theme-item:hover { border-color: var(--fg-border); }
        .svs-theme-item.active { border-color: var(--fg-accent) !important; }
        .svs-theme-dot { width: 22px; height: 22px; border-radius: 5px; flex-shrink: 0; }
        .svs-theme-item-name { font-size: 12px; font-weight: 600; color: var(--fg-text); }

        /* Mobile */
        ${mobiledevice ? `
            .svs-container { margin: 5px; border-radius: 9px; }
            .svs-cards-row { grid-template-columns: 1fr; }
            .svs-fields-inline { grid-template-columns: 1fr 1fr; }
            .svs-hide-mobile { display: none !important; }
            .svs-title { font-size: 14px; }
        ` : ''}
        </style>
    `;

    if (jQuery('.svs-container').length < 1) {
        if (mobiledevice) {
            jQuery('#mobileContent').prepend(content);
        } else {
            jQuery('#contentContainer').prepend(content);
        }
    } else {
        jQuery('#raSingleVillageSnipeBody').html(body);
    }
}

// Build Help Modal HTML
function buildHelpModal() {
    return `
    <div class="svs-modal-overlay" id="svsHelpModal" style="display:none;">
        <div class="svs-modal">
            <div class="svs-modal-header">
                <div class="svs-modal-title">
                    ${SVS_ICONS.question}
                    <span>${tt('Help & Guide')} — Snipeos por Aldea</span>
                </div>
                <a href="javascript:void(0);" id="svsHelpModalClose" class="svs-icon-btn">✕</a>
            </div>
            <div class="svs-modal-body">
                <h4>¿Qué hace este script?</h4>
                <p>Calcula los tiempos exactos de envío para realizar un <strong>snipe</strong> en una aldea objetivo. Un snipe consiste en enviar tropas defensivas de forma que lleguen en el mismo segundo que un ataque enemigo, protegiéndolas en el campo de batalla.</p>

                <h4>Campos de configuración</h4>
                <div class="svs-help-field">
                    <span class="svs-help-field-icon">${SVS_ICONS.target}</span>
                    <div><span class="svs-help-field-name">Aldea destino</span>Coordenadas de la aldea a defender. Formato: <strong>X|Y</strong> (ej: 500|500). Se autocompletará con la aldea actual.</div>
                </div>
                <div class="svs-help-field">
                    <span class="svs-help-field-icon">${SVS_ICONS.clock}</span>
                    <div><span class="svs-help-field-name">Hora de llegada</span>Momento exacto del ataque enemigo. Formato: <strong>dd/mm/yyyy HH:mm:ss</strong>. También puedes hacer clic en un comando de la tabla para autocompletarlo — la fila se resaltará en azul.</div>
                </div>
                <div class="svs-help-field">
                    <span class="svs-help-field-icon">${SVS_ICONS.gear}</span>
                    <div><span class="svs-help-field-name">Sigilo (%)</span>Porcentaje de reducción de velocidad por sigilo del paladín. Usa <strong>0</strong> si no aplica.</div>
                </div>
                <div class="svs-help-field">
                    <span class="svs-help-field-icon">${SVS_ICONS.sword}</span>
                    <div><span class="svs-help-field-name">Cantidad mínima</span>Número mínimo de unidades que debe tener una aldea para ser incluida en los resultados.</div>
                </div>

                <h4>Cómo usar el script</h4>
                <ol>
                    <li>Abre la pantalla de <strong>información de aldea</strong>.</li>
                    <li>Rellena la <strong>aldea destino</strong> y la <strong>hora de llegada</strong> del ataque.</li>
                    <li>Ajusta el <strong>sigilo</strong> y la <strong>cantidad mínima</strong>.</li>
                    <li>Selecciona las <strong>unidades</strong> con las que snipear.</li>
                    <li>Pulsa <strong>"Calcular tiempos de envío"</strong>.</li>
                    <li>Envía tropas con el botón <strong>Enviar</strong> de cada fila cuando el temporizador llegue al momento.</li>
                </ol>

                <h4>Botones de acción</h4>
                <ul>
                    <li>${SVS_ICONS.copy} <strong>Exportar BB Code</strong> — Genera una tabla para el foro del juego.</li>
                    <li>${SVS_ICONS.upload} <strong>Exportar config</strong> — Copia la configuración para guardarla.</li>
                    <li>${SVS_ICONS.download} <strong>Importar config</strong> — Carga una configuración exportada.</li>
                    <li>${SVS_ICONS.refresh} <strong>Resetear grupo</strong> — Vuelve a mostrar aldeas de todos los grupos.</li>
                </ul>

                <h4>Consejos</h4>
                <div class="svs-tip">Haz clic en una fila de la tabla de comandos para autocompletar la hora de llegada — la fila se resaltará en azul.</div>
                <div class="svs-tip">El temporizador se actualiza en tiempo real. Cuando queden <strong>10 segundos</strong> sonará una alerta de audio.</div>
                <div class="svs-tip">El script guarda automáticamente la configuración por aldea destino.</div>
            </div>
        </div>
    </div>
    `;
}

// Build Units Chooser
function buildUnitsChoserTable() {
    const storedChosenUnits = JSON.parse(localStorage.getItem(`${LS_PREFIX}_chosen_units`));
    const defaultChecked = ['spear', 'sword', 'archer', 'heavy', 'catapult'];

    if (DEBUG) console.debug(`${scriptInfo()} storedChosenUnits:`, storedChosenUnits);

    let unitsHTML = `<div class="svs-units-grid">`;

    game_data.units.forEach((unit) => {
        if (unit !== 'spy' && unit !== 'militia') {
            let isChecked = storedChosenUnits !== null && storedChosenUnits !== undefined
                ? storedChosenUnits.includes(unit)
                : defaultChecked.includes(unit);

            unitsHTML += `
                <label class="svs-unit-label${isChecked ? ' is-checked' : ''}" for="unit_${unit}">
                    <img src="/graphic/unit/unit_${unit}.webp" alt="${unit}">
                    <input name="ra_chosen_units" type="checkbox" ${isChecked ? 'checked' : ''} id="unit_${unit}" class="ra-unit-selector" value="${unit}">
                    <span class="svs-unit-check">${isChecked ? SVS_ICONS.check : ''}</span>
                </label>
            `;
        }
    });

    unitsHTML += `</div>`;
    return unitsHTML;
}

// Build Combinations Table
function buildCombinationsTable(snipes, destinationVillage) {
    let table = `
        <table class="svs-table" width="100%">
            <thead>
                <tr>
                    <th style="width:32px">#</th>
                    <th style="text-align:left">${tt('From')}</th>
                    <th>${tt('Unit')}</th>
                    <th class="svs-hide-mobile">${tt('Distance')}</th>
                    <th>${tt('Launch Time')}</th>
                    <th>${tt('Send in')}</th>
                    <th>${tt('Send')}</th>
                </tr>
            </thead>
            <tbody>
    `;

    const serverTime = getServerTime().getTime();

    snipes.forEach((snipe, index) => {
        const { id, name, coords, unit, distance, launchTime, formattedLaunchTime, unitAmount } = snipe;
        const [toX, toY] = destinationVillage.split('|');
        const continent = getContinentByCoord(coords);
        const timeTillLaunch = secondsToHms((launchTime - serverTime) / 1000);

        let rallyPointData = game_data.market !== 'uk' ? `&x=${toX}&y=${toY}&${unit}=${unitAmount}` : '';
        let sitterData = game_data.player.sitter > 0 ? `t=${game_data.player.id}` : '';
        let commandUrl = `/game.php?${sitterData}&village=${id}&screen=place${rallyPointData}`;

        table += `
            <tr>
                <td><span class="svs-row-num">${index + 1}</span></td>
                <td>
                    <a href="${game_data.link_base_pure}info_village&id=${id}" target="_blank" rel="noopener noreferrer" class="svs-village-link">
                        ${name} (${coords}) K${continent}
                    </a>
                </td>
                <td>
                    <div class="svs-unit-cell">
                        <img src="/graphic/unit/unit_${unit}.webp" alt="${unit}">
                        <span class="svs-unit-amount">${formatAsNumber(unitAmount)}</span>
                    </div>
                </td>
                <td class="svs-hide-mobile" style="font-size:12px;color:#94a3b8">${parseFloat(distance).toFixed(2)}</td>
                <td style="font-size:11px;color:#94a3b8;font-family:monospace">${formattedLaunchTime}</td>
                <td class="svs-timer-cell"><span class="timer" data-endtime>${timeTillLaunch}</span></td>
                <td>
                    <a href="${commandUrl}" target="_blank" rel="noopener noreferrer" class="svs-btn-send">
                        ${SVS_ICONS.arrow} ${tt('Send')}
                    </a>
                </td>
            </tr>
        `;
    });

    table += `</tbody></table>`;
    return table;
}

// Action Handler: Export Config
function exportConfig() {
    jQuery('#exportConfig').on('click', function () {
        const data = {
            destinationVillage: jQuery('#raDestinationVillage').val(),
            landingTime: jQuery('#raLandingTime').val(),
            sigil: jQuery('#raSigil').val(),
            minAmount: jQuery('#raMinAmount').val(),
        };
        const json = JSON.stringify(data);

        svsShowModal(`
            <div class="svs-field" style="margin-bottom:14px">
                <label>Configuración exportada</label>
                <textarea readonly id="svsExportConfigTA" style="height:80px">${json}</textarea>
            </div>
            <div class="svs-modal-action-row">
                <a href="javascript:void(0);" id="svsExportCopyBtn" class="svs-btn svs-btn-primary">
                    ${SVS_ICONS.copy} Copiar al portapapeles
                </a>
            </div>
        `, `${SVS_ICONS.upload} Exportar configuración`);

        setTimeout(() => {
            jQuery('#svsExportConfigTA').select();
            document.execCommand('copy');
            svsNotify(tt('Configuration has been copied!'), 'success');

            jQuery('#svsExportCopyBtn').on('click', function () {
                jQuery('#svsExportConfigTA').select();
                document.execCommand('copy');
                svsNotify(tt('Configuration has been copied!'), 'success');
            });
        }, 200);
    });
}

// Action Handler: Import Config
function importConfig() {
    jQuery('#importConfig').on('click', function () {
        svsShowModal(`
            <div class="svs-field" style="margin-bottom:14px">
                <label>Pega la configuración exportada</label>
                <textarea id="svsImportConfigTA" placeholder='{"destinationVillage":"500|500",...}' style="height:100px"></textarea>
            </div>
            <div class="svs-modal-action-row">
                <a href="javascript:void(0);" id="svsImportConfirmBtn" class="svs-btn svs-btn-primary">
                    ${SVS_ICONS.download} Importar configuración
                </a>
            </div>
        `, `${SVS_ICONS.download} Importar configuración`);

        jQuery(document).off('click.svsImport').on('click.svsImport', '#svsImportConfirmBtn', function () {
            const config = jQuery('#svsImportConfigTA').val().trim();
            if (!config.length) {
                svsNotify(tt('Nothing to import!'), 'error');
                return;
            }
            try {
                const data = JSON.parse(config);
                const { destinationVillage, landingTime, minAmount, sigil } = data;
                jQuery('#raDestinationVillage').val(destinationVillage);
                jQuery('#raLandingTime').val(landingTime);
                jQuery('#raSigil').val(sigil);
                jQuery('#raMinAmount').val(minAmount);
                svsCloseModal();
                jQuery('#calculateLaunchTimes').trigger('click');
                svsNotify(tt('Configuration imported successfully!'), 'success');
            } catch (e) {
                svsNotify(tt('There was an error!'), 'error');
            }
            jQuery(document).off('click.svsImport');
        });
    });
}

// Action Handler: Reset chosen group
function resetGroup() {
    jQuery('#resetGroupBtn').on('click', function (e) {
        e.preventDefault();
        localStorage.removeItem(`${LS_PREFIX}_chosen_group`);
        svsNotify(tt('Chosen group was reset!'), 'info');
        initVillageSnipe(0);
    });
}

// Action Handler: Calculate Launch Times
function calculateLaunchTimes() {
    jQuery('#calculateLaunchTimes').on('click', function (e) {
        e.preventDefault();

        const landingTimeString = jQuery('#raLandingTime').val().trim();
        const destinationVillage = jQuery('#raDestinationVillage').val().trim();
        const minAmount = parseInt(jQuery('#raMinAmount').val().trim());
        const chosenUnits = [];

        jQuery('.ra-unit-selector').each(function () {
            if (jQuery(this).is(':checked')) chosenUnits.push(this.value);
        });

        if (chosenUnits.length) {
            localStorage.setItem(`${LS_PREFIX}_chosen_units`, JSON.stringify(chosenUnits));
        }

        handleSaveConfig();

        if (DEBUG) {
            console.debug(`${scriptInfo()} landingTimeString:`, landingTimeString);
            console.debug(`${scriptInfo()} destinationVillage:`, destinationVillage);
            console.debug(`${scriptInfo()} minAmount:`, minAmount);
            console.debug(`${scriptInfo()} chosenUnits:`, chosenUnits);
        }

        const landingTime = getLandingTime(landingTimeString);
        const serverTime = getServerTime();
        const possibleSnipes = [];
        const realSnipes = [];

        villages.forEach((village) => {
            const { id, name, coords } = village;
            const distance = calculateDistance(coords, destinationVillage);

            chosenUnits.forEach((unit) => {
                const launchTime = getLaunchTime(unit, landingTime, distance);
                if (launchTime > serverTime.getTime()) {
                    const formattedLaunchTime = formatDateTime(launchTime);
                    if (distance > 0) {
                        possibleSnipes.push({ id, name, unit, coords, distance, launchTime, formattedLaunchTime });
                    }
                }
            });
        });

        possibleSnipes.sort((a, b) => a.launchTime - b.launchTime);

        possibleSnipes.forEach((snipe) => {
            const { id, unit } = snipe;
            troopCounts.forEach((villageTroops) => {
                if (!chosenUnits.includes('snob')) {
                    if (villageTroops.villageId === id && villageTroops[unit] >= minAmount) {
                        realSnipes.push({ ...snipe, unitAmount: villageTroops[unit] });
                    }
                } else {
                    if (villageTroops.villageId === id && villageTroops[unit] >= 1) {
                        realSnipes.push({ ...snipe, unitAmount: villageTroops[unit] });
                    }
                }
            });
        });

        if (DEBUG) {
            console.debug(`${scriptInfo()} troopCounts:`, troopCounts);
            console.debug(`${scriptInfo()} realSnipes:`, realSnipes);
        }

        if (realSnipes.length > 0) {
            const snipeCombinationsTable = buildCombinationsTable(realSnipes, destinationVillage);
            jQuery('#raPossibleCombinations').show();
            jQuery('#possibleCombinationsCount').text(realSnipes.length);
            jQuery('#possibleCombinationsTable').html(snipeCombinationsTable);
            jQuery('#exportBBCodeBtn').attr('data-snipe', JSON.stringify(realSnipes));

            jQuery(window.TribalWars).off().on('global_tick', function () {
                const remainingTime = jQuery('#possibleCombinationsTable .svs-table tbody tr:eq(0) span[data-endtime]').text().trim();
                if (remainingTime === REMAINING_TIME_ALERT) svsPlayAlert();
                document.title = tt('Send in:') + ' ' + remainingTime;
            });

            Timing.tickHandlers.timers.handleTimerEnd = function (e) {
                jQuery(this).closest('tr').remove();
            };
            Timing.tickHandlers.timers.init();
        } else {
            svsNotify(tt('No possible snipe options found!'), 'warning');
            jQuery('#raPossibleCombinations').hide();
            jQuery('#possibleCombinationsCount').text(0);
            jQuery('#possibleCombinationsTable').html('');
            jQuery('#exportBBCodeBtn').attr('data-snipe', '');
        }
    });
}

// Action Handler: Fill landing time from command row click
function fillLandingTimeFromCommand() {
    jQuery('#commands_outgoings table tbody tr.command-row, #commands_incomings table tbody tr.command-row').on('click', function () {
        try {
            jQuery('#commands_outgoings table tbody tr.command-row').removeClass('ra-chosen-command');
            jQuery('#commands_incomings table tbody tr.command-row').removeClass('ra-chosen-command');
            jQuery(this).addClass('ra-chosen-command');

            const commandLandingTime = jQuery(this).find('td:eq(1)').text().trim();
            const landingTime = getTimeFromString(commandLandingTime);
            jQuery('#raLandingTime').val(landingTime);
            svsNotify(tt('Landing time was updated!'), 'success');
        } catch (error) {
            svsNotify(tt('There was an error!'), 'error');
            console.error(`${scriptInfo()} Error: `, error);
        }
    });
}

// Action Handler: Filter by group
function filterVillagesByChosenGroup() {
    jQuery('#raGroupsFilter').on('change', function (e) {
        e.preventDefault();
        if (DEBUG) console.debug(`${scriptInfo()} selected group ID: `, e.target.value);
        localStorage.setItem(`${LS_PREFIX}_chosen_group`, e.target.value);
        initVillageSnipe(e.target.value);
    });
}

// Helper: Copy to clipboard
function copyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.style.cssText = 'position:fixed;top:0;left:0;width:2em;height:2em;padding:0;border:none;outline:none;box-shadow:none;background:transparent;';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        svsNotify(tt('Copied Command successfully'), 'success');
    } catch (err) {}
    document.body.removeChild(textArea);
}

// Action Handler: Export BB Code
function exportBBCode() {
    jQuery('#exportBBCodeBtn').on('click', function (e) {
        e.preventDefault();
        const snipeAttempts = jQuery(this).attr('data-snipe');
        if (!snipeAttempts) {
            svsNotify(tt('Nothing to export!'), 'error');
            return;
        }
        const bbCode = getBBCodeExport(JSON.parse(snipeAttempts)).trim();

        svsShowModal(`
            <div class="svs-field" style="margin-bottom:14px">
                <label>BB Code generado</label>
                <textarea readonly id="svsBBCodeTA" style="height:120px">${bbCode}</textarea>
            </div>
            <div class="svs-modal-action-row">
                <a href="javascript:void(0);" id="svsBBCopyBtn" class="svs-btn svs-btn-primary">
                    ${SVS_ICONS.copy} Copiar BB Code
                </a>
            </div>
        `, `${SVS_ICONS.copy} Exportar BB Code`);

        setTimeout(() => {
            jQuery('#svsBBCodeTA').select();
            document.execCommand('copy');
            svsNotify(tt('BBCode have been copied!'), 'success');

            jQuery('#svsBBCopyBtn').on('click', function () {
                jQuery('#svsBBCodeTA').select();
                document.execCommand('copy');
                svsNotify(tt('BBCode have been copied!'), 'success');
            });
        }, 200);
    });
}

// Action Handler: Reset script (kept for safety, no button in UI)
function resetScriptHandler() {
    jQuery('#resetScriptBtn').on('click', function (e) {
        e.preventDefault();
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith(`${LS_PREFIX}_`)) localStorage.removeItem(key);
        });
        svsNotify(tt('Script configuration has been reset!'), 'info');
        setTimeout(() => window.location.reload(), 500);
    });
}

// Save config for destination village
function handleSaveConfig() {
    const landingTime = jQuery('#raLandingTime').val().trim();
    const destinationVillage = jQuery('#raDestinationVillage').val().trim();
    const minAmount = parseInt(jQuery('#raMinAmount').val().trim());
    const sigil = parseInt(jQuery('#raSigil').val().trim());
    const chosenUnits = [];

    jQuery('.ra-unit-selector').each(function () {
        if (jQuery(this).is(':checked')) chosenUnits.push(this.value);
    });

    if (chosenUnits.length) {
        localStorage.setItem(`${LS_PREFIX}_chosen_units`, JSON.stringify(chosenUnits));
    }

    localStorage.setItem(`${LS_PREFIX}_${destinationVillage}`, JSON.stringify({
        landingTime, destinationVillage, sigil, minAmount, chosenUnits
    }));
}

// Fill landing time from URL param
function autoFillLandingTimeFromUrl() {
    setTimeout(() => {
        const landingTime = getParameterByName('landingTime');
        if (landingTime) {
            jQuery('#raLandingTime').val(formatDateTime(parseInt(landingTime)));
        }
    }, 100);
}

// Render Groups Filter
function renderGroupsFilter(groups) {
    const groupId = localStorage.getItem(`${LS_PREFIX}_chosen_group`) ?? 0;
    let groupsFilter = `<select name="ra_groups_filter" id="raGroupsFilter">`;
    for (const [_, group] of Object.entries(groups.result)) {
        const { group_id, name } = group;
        const isSelected = parseInt(group_id) === parseInt(groupId) ? 'selected' : '';
        if (name !== undefined) {
            groupsFilter += `<option value="${group_id}" ${isSelected}>${name}</option>`;
        }
    }
    groupsFilter += `</select>`;
    return groupsFilter;
}

// Helper: Seconds to HH:MM:SS
function secondsToHms(timestamp) {
    const hours = Math.floor(timestamp / 60 / 60);
    const minutes = Math.floor(timestamp / 60) - hours * 60;
    const seconds = timestamp % 60;
    return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
}

// Helper: BB Code export
function getBBCodeExport(snipes) {
    const landingTime = jQuery('#raLandingTime').val().trim();
    const destinationVillage = jQuery('#raDestinationVillage').val().trim();

    let bbCode = `[size=12][b]${tt('Target:')}[/b] ${destinationVillage}\n[b]${tt('Landing Time:')}[/b] ${landingTime}[/size]\n\n`;
    bbCode += `[table][**]${tt('Unit')}[||]${tt('From')}[||]${tt('Launch Time')}[||]${tt('Command')}[||]${tt('Status')}[/**]\n`;

    snipes.forEach((plan) => {
        const { coords, formattedLaunchTime, id, unit, unitAmount } = plan;
        const [toX, toY] = destinationVillage.split('|');
        let rallyPointData = game_data.market !== 'uk' ? `&x=${toX}&y=${toY}&${unit}=${unitAmount}` : '';
        let sitterData = game_data.player.sitter > 0 ? `t=${game_data.player.id}` : '';
        let commandUrl = `/game.php?${sitterData}&village=${id}&screen=place${rallyPointData}`;
        bbCode += `[*][unit]${unit}[/unit] ${formatAsNumber(unitAmount)}[|] ${coords} [|]${formattedLaunchTime}[|][url=${window.location.origin}${commandUrl}]${tt('Send')}[/url][|]\n`;
    });

    bbCode += `[/table]`;
    return bbCode;
}

// Helper: Get continent from coords
function getContinentByCoord(coord) {
    let [x, y] = Array.from(coord.split('|')).map((e) => parseInt(e));
    for (let i = 0; i < 1000; i += 100) {
        for (let j = 0; j < 1000; j += 100) {
            if (i >= x && x < i + 100 && j >= y && y < j + 100) {
                return parseInt(y / 100) + '' + parseInt(x / 100);
            }
        }
    }
}

// Helper: Calculate distance
function calculateDistance(from, to) {
    const [x1, y1] = from.split('|');
    const [x2, y2] = to.split('|');
    return Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2));
}

// Helper: Get launch time
function getLaunchTime(unit, landingTime, distance) {
    const msPerSec = 1000;
    const msPerMin = msPerSec * 60;
    const sigilRatio = 1 + (+jQuery('#raSigil').val()) / 100;
    const unitSpeed = unitInfo.config[unit].speed;
    const unitTime = (distance * unitSpeed * msPerMin) / sigilRatio;
    const launchTime = new Date();
    launchTime.setTime(Math.round((landingTime - unitTime) / msPerSec) * msPerSec);
    return launchTime.getTime();
}

// Helper: Get server time
function getServerTime() {
    const serverTime = jQuery('#serverTime').text();
    const serverDate = jQuery('#serverDate').text();
    const [day, month, year] = serverDate.split('/');
    return new Date(year + '-' + month + '-' + day + ' ' + serverTime);
}

// Helper: Format date/time
function formatDateTime(date) {
    let d = new Date(date);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getDate()}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// Helper: Parse landing time string to Date
function getLandingTime(landingTime) {
    const [landingDay, landingHour] = landingTime.split(' ');
    const [day, month, year] = landingDay.split('/');
    const [hours, minutes, seconds] = landingHour.split(':');
    return new Date(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
}

// Helper: Fetch player villages by group
async function fetchAllPlayerVillagesByGroup(groupId) {
    try {
        let fetchVillagesUrl = game_data.player.sitter > 0
            ? game_data.link_base_pure + `groups&ajax=load_villages_from_group&t=${game_data.player.id}`
            : game_data.link_base_pure + 'groups&ajax=load_villages_from_group';

        return await jQuery.post({
            url: fetchVillagesUrl,
            data: { group_id: groupId },
            dataType: 'json',
            headers: { 'TribalWars-Ajax': 1 },
        }).then(({ response }) => {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(response.html, 'text/html');
            const tableRows = jQuery(htmlDoc).find('#group_table > tbody > tr').not(':eq(0)');

            if (tableRows.length) {
                let villagesList = [];
                tableRows.each(function () {
                    const villageId = jQuery(this).find('td:eq(0) a').attr('data-village-id') ?? jQuery(this).find('td:eq(0) a').attr('href').match(/\d+/)[0];
                    villagesList.push({
                        id: parseInt(villageId),
                        name: jQuery(this).find('td:eq(0)').text().trim(),
                        coords: jQuery(this).find('td:eq(1)').text().trim(),
                    });
                });
                return villagesList;
            }
            return [];
        });
    } catch (error) {
        svsNotify(tt('There was an error fetching villages by group!'), 'error');
        console.error(`${scriptInfo()} Error:`, error);
        return [];
    }
}

// Helper: Fetch village groups
async function fetchVillageGroups() {
    let fetchGroups = game_data.player.sitter > 0
        ? game_data.link_base_pure + `groups&mode=overview&ajax=load_group_menu&t=${game_data.player.id}`
        : game_data.link_base_pure + 'groups&mode=overview&ajax=load_group_menu';

    return await jQuery.get(fetchGroups)
        .then((response) => response)
        .catch((error) => {
            svsNotify(tt('Error fetching village groups!'), 'error');
            console.error(`${scriptInfo()} Error:`, error);
        });
}

// Helper: Fetch world unit info
function fetchUnitInfo() {
    jQuery.ajax({ url: '/interface.php?func=get_unit_info' }).done(function (response) {
        unitInfo = xml2json($(response));
        localStorage.setItem(`${LS_PREFIX}_unit_info`, JSON.stringify(unitInfo));
        localStorage.setItem(`${LS_PREFIX}_last_updated`, Date.parse(new Date()));
    });
}

// Helper: Fetch home troop counts for group
async function fetchTroopsForCurrentGroup(groupId) {
    const mobileCheck = $('#mobileHeader').length > 0;

    return await jQuery.get(
        game_data.link_base_pure + `overview_villages&mode=combined&group=${groupId}&page=-1`
    ).then(async (response) => {
        const htmlDoc = jQuery.parseHTML(response);
        const homeTroops = [];

        if (mobileCheck) {
            jQuery(htmlDoc).find('.overview-container > div').each((i, el) => {
                const villageId = jQuery(el).find('.quickedit-vn').data('id');
                const troopCounts = { villageId };
                jQuery(el).find('.overview-units-row > div.unit-row-item').each((j, unitElement) => {
                    const img = jQuery(unitElement).find('img');
                    const span = jQuery(unitElement).find('span.unit-row-name');
                    if (img.length && span.length) {
                        let unitType = img.attr('src').split('unit_')[1].replace('@2x.webp', '').replace('.png', '');
                        troopCounts[unitType] = parseInt(span.text()) || 0;
                    }
                });
                homeTroops.push(troopCounts);
            });
        } else {
            const combinedTableRows = jQuery(htmlDoc).find('#combined_table tr.nowrap');
            const combinedTableHead = jQuery(htmlDoc).find('#combined_table tr:eq(0) th');
            const combinedTableHeader = [];

            jQuery(combinedTableHead).each(function () {
                const thImage = jQuery(this).find('img').attr('src');
                combinedTableHeader.push(thImage ? thImage.split('/').pop().replace('.webp', '') : null);
            });

            combinedTableRows.each(function () {
                let rowTroops = {};
                combinedTableHeader.forEach((tableHeader, index) => {
                    if (tableHeader && tableHeader.includes('unit_')) {
                        const villageId = jQuery(this).find('td:eq(1) span.quickedit-vn').attr('data-id');
                        rowTroops = {
                            ...rowTroops,
                            villageId: parseInt(villageId),
                            [tableHeader.replace('unit_', '')]: parseInt(jQuery(this).find(`td:eq(${index})`).text()),
                        };
                    }
                });
                homeTroops.push(rowTroops);
            });
        }

        return homeTroops;
    }).catch((error) => {
        svsNotify(tt('An error occured while fetching troop counts!'), 'error');
        console.error(`${scriptInfo()} Error:`, error);
    });
}

// Helper: Parse time string with today/tomorrow patterns
function getTimeFromString(timeLand) {
    let dateLand = '';
    let serverDate = document.getElementById('serverDate').innerText.split('/');

    let TIME_PATTERNS = { today: 'today at %s', tomorrow: 'tomorrow at %s', later: 'on %1 at %2' };
    if (window.lang) {
        TIME_PATTERNS = {
            today: window.lang['aea2b0aa9ae1534226518faaefffdaad'],
            tomorrow: window.lang['57d28d1b211fddbb7a499ead5bf23079'],
            later: window.lang['0cb274c906d622fa8ce524bcfbb7552d'],
        };
    }

    let todayPattern = new RegExp(TIME_PATTERNS.today.replace('%s', '([\\d+|:]+)')).exec(timeLand);
    let tomorrowPattern = new RegExp(TIME_PATTERNS.tomorrow.replace('%s', '([\\d+|:]+)')).exec(timeLand);

    let time = timeLand.match(/\d+:\d+:\d+:\d+/) ?? timeLand.match(/\d+:\d+:\d+/);
    time = time && time[0];

    if (todayPattern !== null) {
        dateLand = serverDate[0] + '/' + serverDate[1] + '/' + serverDate[2] + ' ' + time;
    } else if (tomorrowPattern !== null) {
        let tomorrowDate = new Date(serverDate[1] + '/' + serverDate[0] + '/' + serverDate[2]);
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        dateLand = ('0' + tomorrowDate.getDate()).slice(-2) + '/' + ('0' + (tomorrowDate.getMonth() + 1)).slice(-2) + '/' + tomorrowDate.getFullYear() + ' ' + time;
    } else {
        let on = timeLand.match(/\d+.\d+/)[0].split('.');
        dateLand = on[0] + '/' + on[1] + '/' + serverDate[2] + ' ' + time;
    }

    return dateLand;
}

// Helper: Format as localized number
function formatAsNumber(number) {
    return parseInt(number).toLocaleString('de');
}

// Helper: XML to JSON
var xml2json = function ($xml) {
    var data = {};
    $.each($xml.children(), function (i) {
        var $this = $(this);
        data[$this.prop('tagName')] = $this.children().length > 0 ? xml2json($this) : $.trim($this.text());
    });
    return data;
};

// Helper: Get URL parameter
function getParameterByName(name, url = window.location.href) {
    return new URL(url).searchParams.get(name);
}

// Helper: Script info string
function scriptInfo() {
    return `[${scriptData.name} ${scriptData.version}]`;
}

// Helper: Debug init
function initDebug() {
    console.debug(`${scriptInfo()} Iniciado 🚀`);
    if (DEBUG) {
        console.debug(`${scriptInfo()} Market:`, game_data.market);
        console.debug(`${scriptInfo()} World:`, game_data.world);
        console.debug(`${scriptInfo()} Screen:`, game_data.screen);
        console.debug(`${scriptInfo()} Locale:`, game_data.locale);
        console.debug(`${scriptInfo()} Premium:`, game_data.features.Premium.active);
    }
}

// Helper: Translator
function tt(string) {
    const gameLocale = game_data.locale;
    if (translations[gameLocale] !== undefined && translations[gameLocale][string] !== undefined) {
        return translations[gameLocale][string];
    }
    return translations['en_DK'][string] ?? string;
}

// Count API
async function countAPI() {
    await jQuery.ajax({
        url: 'https://twscripts.dev/count/',
        method: 'POST',
        data: {
            scriptData: scriptData,
            world: game_data.world,
            market: game_data.market,
            enableCountApi: true,
            referralScript: 'https://twscripts.dev/scripts/twSDK.js?url=https://twscripts.dev/scripts/singleVillageSnipe.js',
        },
        dataType: 'JSON',
    }).then(({ message }) => {
        if (message) console.debug(`${scriptInfo()} Script ejecutado ${formatAsNumber(parseInt(message))} veces.`);
    });
}

// Initialize Script
(async function () {
    if (!game_data.features.Premium.active) {
        svsNotify(tt('This script requires Premium Account!'), 'error');
        return;
    }

    const gameScreen = getParameterByName('screen');

    if (gameScreen === 'info_village') {
        try {
            initVillageSnipe(GROUP_ID);
            await countAPI();
        } catch (error) {
            svsNotify(tt('There was an error!'), 'error');
            console.error(`${scriptInfo()} Error:`, error);
        }
    } else {
        svsNotify(tt('This script can only be run on a single village screen!'), 'info');
        setTimeout(function () {
            window.location.assign(game_data.link_base_pure + 'info_village&id=' + game_data.village.id);
        }, 500);
    }
})();
