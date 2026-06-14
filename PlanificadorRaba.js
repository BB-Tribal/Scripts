/*
 * Script Name: Planificador de Aldea Única
 * Version: v2.1.1
 * Last Updated: 2026-05-30
 * Mod: Alexa
 */

/* Copyright (c) 2026 - Modernized Version */

(function () {

const scriptData = {
    name: 'Planificador de Ataques',
    version: 'v2.1.1',
};

// ── Theme System ──────────────────────────────────────────
const RA_THEMES = {
    emerald:  { name:'Esmeralda', emoji:'&#x1F49A;', '--fg-bg':'#F8FAF8','--fg-bg2':'#EBF7ED','--fg-bg3':'#FFFFFF','--fg-border':'#C8DFC8','--fg-accent':'#16A34A','--fg-accent2':'#15803D','--fg-text':'#1A2E1A','--fg-text2':'#5A7A5A','--fg-hover':'#EBF7ED','--fg-link':'#16A34A','--fg-shadow':'rgba(0,0,0,.7)' },
    inferno:  { name:'Inferno',   emoji:'&#x1F525;', '--fg-bg':'#1c1f27','--fg-bg2':'#21242e','--fg-bg3':'#252831','--fg-border':'#2c2f3c','--fg-accent':'#f5a623','--fg-accent2':'#e8700a','--fg-text':'#e2e8f0','--fg-text2':'#8892a4','--fg-hover':'rgba(245,166,35,.08)','--fg-link':'#4f8ef7','--fg-shadow':'rgba(0,0,0,.7)' },
    sakura:   { name:'Sakura',    emoji:'&#x1F338;', '--fg-bg':'#fdf2f8','--fg-bg2':'#fce7f3','--fg-bg3':'#ffffff','--fg-border':'#f9a8d4','--fg-accent':'#ec4899','--fg-accent2':'#db2777','--fg-text':'#1f2937','--fg-text2':'#6b7280','--fg-hover':'rgba(236,72,153,.07)','--fg-link':'#db2777','--fg-shadow':'rgba(236,72,153,.2)' },
    amethyst: { name:'Amethyst',  emoji:'&#x1F49C;', '--fg-bg':'#faf5ff','--fg-bg2':'#f3e8ff','--fg-bg3':'#ffffff','--fg-border':'#d8b4fe','--fg-accent':'#7c3aed','--fg-accent2':'#6d28d9','--fg-text':'#1f2937','--fg-text2':'#6b7280','--fg-hover':'rgba(124,58,237,.07)','--fg-link':'#7c3aed','--fg-shadow':'rgba(124,58,237,.2)' },
    matrix:   { name:'Matrix',    emoji:'&#x1F7E2;', '--fg-bg':'#0a0f0a','--fg-bg2':'#0a1a0a','--fg-bg3':'#0f1a0f','--fg-border':'#1a3d1a','--fg-accent':'#00ff41','--fg-accent2':'#00cc34','--fg-text':'#ccffcc','--fg-text2':'#4dff77','--fg-hover':'rgba(0,255,65,.07)','--fg-link':'#00ff41','--fg-shadow':'rgba(0,255,65,.3)' },
    midnight: { name:'Midnight',  emoji:'&#x1F319;', '--fg-bg':'#0f172a','--fg-bg2':'#1a2540','--fg-bg3':'#1e293b','--fg-border':'#334155','--fg-accent':'#3b82f6','--fg-accent2':'#2563eb','--fg-text':'#e2e8f0','--fg-text2':'#94a3b8','--fg-hover':'rgba(59,130,246,.09)','--fg-link':'#60a5fa','--fg-shadow':'rgba(0,0,0,.8)' },
    crimson:  { name:'Crimson',   emoji:'&#x1F534;', '--fg-bg':'#1a0505','--fg-bg2':'#220808','--fg-bg3':'#2d0a0a','--fg-border':'#7f1d1d','--fg-accent':'#ef4444','--fg-accent2':'#dc2626','--fg-text':'#fecaca','--fg-text2':'#f87171','--fg-hover':'rgba(239,68,68,.09)','--fg-link':'#f87171','--fg-shadow':'rgba(0,0,0,.8)' },
    arctic:   { name:'Arctic',    emoji:'&#x1F30A;', '--fg-bg':'#f0f9ff','--fg-bg2':'#e0f2fe','--fg-bg3':'#ffffff','--fg-border':'#bae6fd','--fg-accent':'#0ea5e9','--fg-accent2':'#0284c7','--fg-text':'#0c4a6e','--fg-text2':'#0369a1','--fg-hover':'rgba(14,165,233,.07)','--fg-link':'#0ea5e9','--fg-shadow':'rgba(14,165,233,.2)' },
    obsidian: { name:'Obsidian',  emoji:'&#x1F5A4;', '--fg-bg':'#000000','--fg-bg2':'#0d0d0d','--fg-bg3':'#111111','--fg-border':'#1f1f1f','--fg-accent':'#06b6d4','--fg-accent2':'#0891b2','--fg-text':'#e2e8f0','--fg-text2':'#64748b','--fg-hover':'rgba(6,182,212,.07)','--fg-link':'#38bdf8','--fg-shadow':'rgba(0,0,0,.9)' },
    tribal:   { name:'Tribal',    emoji:'&#x1F3F0;', '--fg-bg':'#f4e8c4','--fg-bg2':'#ecdca8','--fg-bg3':'#fdf5e0','--fg-border':'#9b7b3a','--fg-accent':'#7a9b2a','--fg-accent2':'#5a7a1a','--fg-text':'#3d2b0e','--fg-text2':'#7a5c2e','--fg-hover':'rgba(122,155,42,.09)','--fg-link':'#5a7a1a','--fg-shadow':'rgba(61,43,14,.3)' },
};

function applyRATheme(name) {
    const th = RA_THEMES[name] || RA_THEMES.emerald;
    const get = k => th[k] || '';
    let el = document.getElementById('ra-theme-vars');
    if (!el) { el = document.createElement('style'); el.id = 'ra-theme-vars'; document.head.appendChild(el); }
    el.textContent = `#raSingleVillagePlanner, #raPlannerLauncher, #ra-wrong-screen-overlay {
        --bg-base:       ${get('--fg-bg')};
        --bg-card:       ${get('--fg-bg3')};
        --bg-card-hover: ${get('--fg-hover')};
        --bg-header:     ${get('--fg-accent2')};
        --accent-gold:   ${get('--fg-accent')};
        --accent-red:    ${get('--fg-accent')};
        --accent-red-h:  ${get('--fg-accent2')};
        --accent-green:  ${get('--fg-accent')};
        --accent-blue:   ${get('--fg-accent')};
        --color-text:    ${get('--fg-text')};
        --color-muted:   ${get('--fg-text2')};
        --color-border:  ${get('--fg-border')};
        --color-selected:${get('--fg-hover')};
        --ra-row-even:   ${get('--fg-bg2')};
        --ra-row-hover:  ${get('--fg-hover')};
        --ra-shadow:     ${get('--fg-shadow')};
    }`;
    localStorage.setItem('planificador_theme', name);
}

function getRACurrentTheme() {
    return localStorage.getItem('planificador_theme') || 'emerald';
}

applyRATheme(getRACurrentTheme());

// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;

// Constants
const LS_PREFIX = 'raSingleVillagePlanner';
const TIME_INTERVAL = 60 * 60 * 1000 * 24 * 365;
const GROUP_ID = localStorage.getItem(`${LS_PREFIX}_chosen_group`) ?? 0;
const LAST_UPDATED_TIME = parseInt(localStorage.getItem(`${LS_PREFIX}_last_updated`) ?? 0);

// Globals
let unitInfo;
let troopCounts = [];

// Translations
const translations = {
    en_DK: {
        'Single Village Planner': 'Single Village Planner',
        Help: 'Help',
        'This script can only be run on a single village screen!':
            'This script can only be run on a single village screen!',
        Village: 'Village',
        'Calculate Launch Times': 'Calculate Launch Times',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'Launch times are being calculated ...',
        'Missing user input!': 'Missing user input!',
        'Landing Time': 'Landing Time',
        'This village has no unit selected!':
            'This village has no unit selected!',
        'Prio.': 'Prio.',
        'No possible combinations found!': 'No possible combinations found!',
        'Export Plan as BB Code': 'Export Plan as BB Code',
        'Plan for:': 'Plan for:',
        'Landing Time:': 'Landing Time:',
        Unit: 'Unit',
        'Launch Time': 'Launch Time',
        Command: 'Command',
        Status: 'Status',
        Send: 'Send',
        From: 'From',
        Priority: 'Priority',
        'Early send': 'Early send',
        'Landing time was updated!': 'Landing time was updated!',
        'Error fetching village groups!': 'Error fetching village groups!',
        'Dist.': 'Dist.',
        'Villages list could not be fetched!':
            'Villages list could not be fetched!',
        Group: 'Group',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
        'An error occurred while fetching troop counts!': 'An error occurred while fetching troop counts!',
        Copy: 'Copy',
    },
    es_ES: {
        'Single Village Planner': 'Planificador de Aldea Única',
        Help: 'Ayuda',
        'This script can only be run on a single village screen!':
            '¡Este script solo se puede ejecutar en la pantalla de una aldea individual!',
        Village: 'Aldea',
        'Calculate Launch Times': 'Calcular Tiempos de Lanzamiento',
        Reset: 'Reiniciar',
        'Launch times are being calculated ...':
            'Se están calculando los tiempos de lanzamiento ...',
        'Missing user input!': '¡Falta entrada del usuario!',
        'Landing Time': 'Tiempo de Llegada',
        'This village has no unit selected!':
            '¡Esta aldea no tiene unidad seleccionada!',
        'Prio.': 'Prio.',
        'No possible combinations found!': '¡No se encontraron combinaciones posibles!',
        'Export Plan as BB Code': 'Exportar Plan como Código BB',
        'Plan for:': 'Plan para:',
        'Landing Time:': 'Tiempo de Llegada:',
        Unit: 'Unidad',
        'Launch Time': 'Tiempo de Lanzamiento',
        Command: 'Comando',
        Status: 'Estado',
        Send: 'Enviar',
        From: 'Desde',
        Priority: 'Prioridad',
        'Early send': 'Envío anticipado',
        'Landing time was updated!': '¡Tiempo de llegada actualizado!',
        'Error fetching village groups!': '¡Error al obtener grupos de aldeas!',
        'Dist.': 'Dist.',
        'Villages list could not be fetched!':
            '¡No se pudo obtener la lista de aldeas!',
        Group: 'Grupo',
        'Export Plan without tables': 'Exportar Plan sin tablas',
        'Chosen group was reset!': '¡Grupo seleccionado reiniciado!',
        'Reset Chosen Group': 'Reiniciar Grupo Seleccionado',
        'Script configuration was reset!': '¡Configuración del script reiniciada!',
        'An error occurred while fetching troop counts!': '¡Error al obtener conteos de tropas!',
        Copy: 'Copiar',
    },
    sk_SK: {
        'Single Village Planner': 'PlÃ¡novaÄ pre jednu dedinu',
        Help: 'Pomoc',
        'This script can only be run on a single village screen!':
            'Tento skript sa dÃ¡ spustiÅ¥ iba v nÃ¡hÄ¾ade dediny z mapy',
        Village: 'Dedina',
        'Calculate Launch Times': 'VÃ½poÄet Äasov odoslania',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'ÄŒasy odoslania sa vypoÄÃ­tavajÃº ...',
        'Missing user input!': 'ChÃ½ba oznaÄenie jednotiek!',
        'Landing Time': 'ÄŒas dopadu',
        'This village has no unit selected!':
            'TÃ¡to dedina nemÃ¡ oznaÄenÃº jednotku!',
        'Prio.': 'Prio.',
        'No possible combinations found!':
            'Å½iadne moÅ¾nÃ© kombinÃ¡cie sa nenaÅ¡li!',
        'Export Plan as BB Code': 'ExportovaÅ¥ PlÃ¡n ako BB KÃ³dy',
        'Plan for:': 'PlÃ¡n pre:',
        'Landing Time:': 'ÄŒas dopadu:',
        Unit: 'Jednotka',
        'Launch Time': 'ÄŒas odoslania:',
        Command: 'PrÃ­kaz',
        Status: 'Stav',
        Send: 'OdoslaÅ¥',
        From: 'Z',
        Priority: 'Priorita',
        'Early send': 'SkorÃ© odoslanie',
        'Landing time was updated!': 'ÄŒas dopadu aktualizovanÃ½!',
        'Error fetching village groups!': 'Chyba pri naÄÃ­tanÃ­ skupiny dedÃ­n',
        'Dist.': 'VzdialenosÅ¥',
        'Villages list could not be fetched!':
            'Villages list could not be fetched!',
        Group: 'Group',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
        'An error occurred while fetching troop counts!': 'An error occurred while fetching troop counts!',
        Copy: 'Copy',
    },
    nl_NL: {
        'Single Village Planner': 'Enkel Dorp Planner',
        Help: 'Help',
        'This script can only be run on a single village screen!':
            'Het script kan enkel worden uitgevoerd op het dorpsoverzicht via de kaart!',
        Village: 'Dorp',
        'Calculate Launch Times': 'Bereken verzendtijden',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'Verzendtijden worden berekend ...',
        'Missing user input!': 'Mis spelersinvoer!',
        'Landing Time': 'Landingstijd',
        'This village has no unit selected!':
            'Dit dorp heeft geen troepen geselecteerd!',
        'Prio.': 'Prioriteit.',
        'No possible combinations found!': 'Geen mogelijkheden gevonden!',
        'Export Plan as BB Code': 'Exporteer plan als BB Code',
        'Plan for:': 'Plan voor:',
        'Landing Time:': 'Landingstijd:',
        Unit: 'Eenheid',
        'Launch Time': 'Verzendtijd',
        Command: 'Bevel',
        Status: 'Status',
        Send: 'Zend',
        From: 'Van',
        Priority: 'Prioriteit',
        'Early send': 'Vroeg verzenden',
        'Landing time was updated!': 'Aankomsttijd is geupdate!',
        'Error fetching village groups!':
            'Fout met ophalen van dorpen uit groep!',
        'Dist.': 'Afstand',
        'Villages list could not be fetched!':
            'Villages list could not be fetched!',
        Group: 'Group',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
        'An error occurred while fetching troop counts!': 'An error occurred while fetching troop counts!',
        Copy: 'Kopiëren',
    },
    el_GR: {
        'Single Village Planner': 'Î‘Ï„Î¿Î¼Î¹ÎºÏŒ Î Î»Î¬Î½Î¿ Î§Ï‰ÏÎ¹Î¿Ï',
        Help: 'Î’Î¿Î®Î¸ÎµÎ¹Î±',
        'This script can only be run on a single village screen!':
            'Î‘Ï…Ï„Î¿ Ï„Î¿ Script Ï„ÏÎ­Ï‡ÎµÎ¹ Î±Ï€Î¿ Î Î»Î·ÏÎ¿Ï†Î¿ÏÎ¯ÎµÏ‚ Î§Ï‰ÏÎ¹Î¿Ï!',
        Village: 'Î§Ï‰ÏÎ¹ÏŒ',
        'Calculate Launch Times': 'Î¥Ï€Î¿Î»ÏŒÎ³Î¹ÏƒÎµ ÎÏÎ± Î•ÎºÎºÎ¯Î½Î·ÏƒÎ·Ï‚',
        Reset: 'Î•Ï€Î±Î½Î±Ï†Î¿ÏÎ¬',
        'Launch times are being calculated ...':
            'ÎŸÎ¹ Ï‡ÏÏŒÎ½Î¿Î¹ ÎµÎºÎºÎ¯Î½Î·ÏƒÎ·Ï‚ Ï…Ï€Î¿Î»Î¿Î³Î¯Î¶Î¿Î½Ï„Î±Î¹ ...',
        'Missing user input!': 'Î›ÎµÎ¯Ï€Î¿Ï…Î½ Ï„Î± Î´ÎµÎ´Î¿Î¼Î­Î½Î±!',
        'Landing Time': 'ÎÏÎ± Î¬Ï†Î¹Î¾Î·Ï‚',
        'This village has no unit selected!':
            'Î¤Î¿ Ï‡Ï‰ÏÎ¹ÏŒ Î´ÎµÎ½ Î­Ï‡ÎµÎ¹ ÎµÏ€Î¹Î»ÎµÎ³Î¼Î­Î½ÎµÏ‚ Î¼Î¿Î½Î¬Î´ÎµÏ‚!',
        'Prio.': 'Î ÏÎ¿Ï„.',
        'No possible combinations found!': 'No possible combinations found!',
        'Export Plan as BB Code': 'Î•Î¾Î±Î³Ï‰Î³Î® Ï€Î»Î¬Î½Î¿Ï… ÏƒÎµ BB Code',
        'Plan for:': 'Î Î»Î¬Î½Î¿ Î³Î¹Î±:',
        'Landing Time:': 'ÎÏÎ± Î¬Ï†Î¹Î¾Î·Ï‚:',
        Unit: 'ÎœÎ¿Î½Î¬Î´Î±',
        'Launch Time': 'ÎÏÎ± ÎµÎºÎºÎ¯Î½Î·ÏƒÎ·Ï‚',
        Command: 'Î•Î½Ï„Î¿Î»Î®',
        Status: 'ÎšÎ±Ï„Î¬ÏƒÏ„Î±ÏƒÎ·',
        Send: 'Î£Ï„ÎµÎ¯Î»Îµ',
        From: 'Î‘Ï€ÏŒ',
        Priority: 'Î ÏÎ¿Ï„ÎµÏÎ±Î¹ÏŒÏ„Î·Ï„Î±',
        'Early send': 'Î£Ï„Î¬Î»Î¸Î·ÎºÎ±Î½ Î½Ï‰ÏÎ¯Ï„ÎµÏÎ±',
        'Landing time was updated!': 'Î— ÏŽÏÎ± Î¬Ï†Î¹Î¾Î·Ï‚ Î±Î½Î±Î½ÎµÏŽÎ¸Î·ÎºÎµ!',
        'Error fetching village groups!':
            'Î£Ï†Î¬Î»Î¼Î± ÎºÎ±Ï„Î¬ Ï„Î·Î½ Î±Î½Î¬ÎºÏ„Î·ÏƒÎ· Î¿Î¼Î¬Î´Ï‰Î½ Ï‡Ï‰ÏÎ¹ÏŽÎ½!',
        'Dist.': 'Î‘Ï€ÏŒÏƒÏ„Î±ÏƒÎ·',
        'Villages list could not be fetched!':
            'Villages list could not be fetched!',
        Group: 'Group',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
        'An error occurred while fetching troop counts!': 'An error occurred while fetching troop counts!',
        Copy: 'Copy',
    },
    it_IT: {
        'Single Village Planner': 'Planner Singolo Villo',
        Help: 'Aiuto',
        'This script can only be run on a single village screen!':
            'Questo script puÃ² essere lanciato solo dalla panoramica del villaggio!',
        Village: 'Villaggio',
        Coords: 'Coordinate',
        Continent: 'Continente',
        'Calculate Launch Times': 'Calcola tempi di lancio',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'I tempi di lancio sono stati calcolati ...',
        'Missing user input!': 'Manca selezione truppe!',
        'Landing Time': 'Tempo di arrivo',
        'This village has no unit selected!':
            'Questo villaggio non ha le unitÃ  selezionate!',
        'Prio.': 'Prio.',
        'No possible combinations found!': 'Nessuna combinazione possibile!',
        'Export Plan as BB Code': 'Esporta il plan in BB code',
        'Plan for:': 'Plan per:',
        'Landing Time:': 'Tempo di arrivo:',
        Unit: 'UnitÃ ',
        'Launch Time': 'Tempo di lancio',
        Command: 'Comando',
        Status: 'Status',
        Send: 'Invia',
        From: 'Da',
        Priority: 'PrioritÃ ',
        'Early send': 'Anticipa invio',
        'Landing time was updated!': 'Il tempo di arrivo Ã¨ stato aggiornato!',
        'Error fetching village groups!': 'Errore nel recupero gruppo!',
        Group: 'Gruppo',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
        'An error occurred while fetching troop counts!': 'An error occurred while fetching troop counts!',
        Copy: 'Copia',
    },
    tr_TR: {
        'Single Village Planner': 'Tek KÃ¶y PlanlayÄ±cÄ±sÄ±',
        Help: 'YardÄ±m',
        'This script can only be run on a single village screen!':
            'Bu komut dosyasÄ± yalnÄ±zca tek bir kÃ¶y ekranÄ±nda Ã§alÄ±ÅŸtÄ±rÄ±labilir',
        Village: 'KÃ¶y',
        Coords: 'Koordinat',
        Continent: 'KÄ±ta',
        'Calculate Launch Times': 'BaÅŸlatma SÃ¼relerini HesaplayÄ±n',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'BaÅŸlatma sÃ¼releri hesaplanÄ±yor ...',
        'Missing user input!': 'Eksik kullanÄ±cÄ± giriÅŸi!',
        'Landing Time': 'iniÅŸ zamanÄ±',
        'This village has no unit selected!': 'Bu kÃ¶yde seÃ§ili birim yok!',
        'Prio.': 'Prio.',
        'No possible combinations found!': 'OlasÄ± kombinasyon bulunamadÄ±!',
        'Export Plan as BB Code': 'PlanÄ± BB Kodu Olarak DÄ±ÅŸa Aktar',
        'Plan for:': 'Plan iÃ§in:',
        'Landing Time:': 'Ä°niÅŸ zamanÄ±:',
        Unit: 'Birim',
        'Launch Time': 'BaÅŸlatma ZamanÄ±:',
        Command: 'Komut',
        Status: 'Durum',
        Send: 'GÃ¶nder',
        From: 'Z',
        Priority: 'Ã–ncelik',
        'Early send': 'erken gÃ¶nder',
        'Landing time was updated!': 'Ä°niÅŸ zamanÄ± gÃ¼ncellendi!',
        'Error fetching village groups!':
            'KÃ¶y gruplarÄ± getirilirken hata oluÅŸtu',
        'Dist.': 'Dist.',
        'Villages list could not be fetched!':
            'Villages list could not be fetched!',
        Group: 'Group',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
        'An error occurred while fetching troop counts!': 'An error occurred while fetching troop counts!',
        Copy: 'Kopyala',
    },
    pt_BR: {
        'Single Village Planner': 'Planeador para ataques em uma sÃ³ aldeia',
        Help: 'Ajuda',
        'This script can only be run on a single village screen!':
            'Este script sÃ³ pode ser usado na pÃ¡gina de uma sÃ³ aldeia!',
        Village: 'Aldeia',
        Coords: 'Coords',
        Continent: 'Continente',
        'Calculate Launch Times': 'Calcular tempos de envio',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'Os tempos de envio estÃ£o a ser calculados ...',
        'Missing user input!': 'Falta o input do utilizador!',
        'Landing Time': 'Tempo de chegada',
        'This village has no unit selected!':
            'Esta aldeia nÃ£o tem unidades selecionadas!',
        'Prio.': 'Prioridade',
        'No possible combinations found!':
            'NÃ£o foram encontradas combinaÃ§Ãµes possÃ­veis!',
        'Export Plan as BB Code': 'Exportar plano em cÃ³digo BB',
        'Plan for:': 'Plano para:',
        'Landing Time:': 'Tempo de chegada:',
        Unit: 'Unidade',
        'Launch Time': 'Tempo de envio',
        Command: 'Comando',
        Status: 'Estado',
        Send: 'Send',
        From: 'From',
        Priority: 'Prioridade',
        'Early send': 'Enviar cedo',
        'Landing time was updated!': 'O tempo de chegada foi atualizado!',
        'Error fetching village groups!':
            'Erro a ir buscar os grupos de aldeias!',
        'Dist.': 'Dist.',
        'Villages list could not be fetched!':
            'Villages list could not be fetched!',
        Group: 'Group',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
        'An error occurred while fetching troop counts!': 'An error occurred while fetching troop counts!',
        Copy: 'Copiar',
    },
    fr_FR: {
        'Single Village Planner': "Planificateur d'attaque village unique",
        Help: 'Aide',
        'This script can only be run on a single village screen!':
            "Ce script doit Ãªtre lancÃ© depuis la vu d'un village!",
        Village: 'Village',
        'Calculate Launch Times': "Calcul heure d'envoi",
        Reset: 'RÃ©initialiser',
        'Launch times are being calculated ...':
            "Heures d'envoi en cours de calcul ...",
        'Missing user input!': 'Aucun joueur renseignÃ©!',
        'Landing Time': "Heure d'arrivÃ©",
        'This village has no unit selected!':
            "Ce village n'a aucune unitÃ© sÃ©lectionnÃ©e!",
        'Prio.': 'Prio.',
        'No possible combinations found!': 'Aucune combinaison possible!',
        'Export Plan as BB Code': "Exporter le plan d'attaque en bb-code",
        'Plan for:': 'Plan pour:',
        'Landing Time:': "Heure d'arrivÃ©:",
        Unit: 'UnitÃ©',
        'Launch Time': "Heure d'envoi",
        Command: 'Ordre',
        Status: 'Status',
        Send: 'Envoyer',
        From: 'Origine',
        Priority: 'PrioritÃ©',
        'Early send': 'Envoi tÃ´t',
        'Landing time was updated!': "Heure d'arrivÃ© mis Ã  jour!",
        'Error fetching village groups!':
            'Erreur lors de la rÃ©cupÃ©ration des groupes de villages!',
        'Dist.': 'Dist.',
        'Villages list could not be fetched!':
            'Impossible de rÃ©cupÃ©rer la liste des villages!',
        Group: 'Groupe',
        'Export Plan without tables': 'Exporter le plan sans tableau',
        'Chosen group was reset!': 'Groupe sÃ©lectionnÃ© rÃ©initialisÃ©!',
        'Reset Chosen Group': 'RÃ©initialiser groupe(s) sÃ©lectionnÃ©e(s)',
        'Script configuration was reset!': 'Configuration rÃ©initialisÃ©e!',
        'An error occurred while fetching troop counts!': 'An error occurred while fetching troop counts!',
        Copy: 'Copier',
    },
};

// Init Debug
initDebug();

// Modal Manager
const raModalManager = {
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    },
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `ra-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },
    copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.select();
            document.execCommand('copy');
            this.showNotification('✅ Copiado al portapapeles', 'success');
        }
    }
};

// Fetch unit config only when needed
if (LAST_UPDATED_TIME !== null) {
    if (Date.parse(new Date()) >= LAST_UPDATED_TIME + TIME_INTERVAL) {
        fetchUnitInfo();
    } else {
        unitInfo = JSON.parse(localStorage.getItem(`${LS_PREFIX}_unit_info`));
    }
} else {
    fetchUnitInfo();
}

// Initialize Attack Planner
async function initAttackPlanner(groupId) {
    // run on script load
    const groups = await fetchVillageGroups();
    troopCounts = await fetchTroopsForCurrentGroup(groupId);
    let villages = await fetchAllPlayerVillagesByGroup(groupId);

    const destinationVillage = jQuery(
        '#content_value table table td:eq(2)'
    ).text();

    villages = villages.map((item) => {
        const distance = calculateDistance(item.coords, destinationVillage);
        return {
            ...item,
            distance: parseFloat(distance.toFixed(2)),
        };
    });

    villages = villages
        .filter(v => v.coords.trim() !== destinationVillage.trim())
        .sort((a, b) => a.distance - b.distance);

    const content = prepareContent(villages, groups);
    renderUI(content);

    // after script has been loaded events
    setTimeout(function () {
        // set a default landing time
        const today = new Date().toLocaleString('en-GB').replace(',', '');
        jQuery('#raLandingTime').val(today);

        // handle non-archer worlds
        if (!game_data.units.includes('archer')) {
            jQuery('.archer-world').hide();
        }

        // handle non-paladin worlds
        if (!game_data.units.includes('knight')) {
            jQuery('.paladin-world').hide();
        }
    }, 100);

    // scroll to element to focus user's attention
    jQuery('html,body').animate(
        { scrollTop: jQuery('#raSingleVillagePlanner').offset().top - 8 },
        'slow'
    );

    // action handlers
    choseUnit();
    changeVillagePriority();
    calculateLaunchTimes();
    resetAll();
    fillLandingTimeFromCommand();
    filterVillagesByChosenGroup();
    setAllUnits();
    resetGroup();
}

// Helper: Prepare UI with new modern structure
function prepareContent(villages, groups) {
    const villagesTable = renderVillagesTable(villages);
    const groupsFilter = renderGroupsFilter(groups);

    return `
        <!-- Configuration Card -->
        <div class="ra-card">
            <h3 class="ra-card-title">${tt('Calculate Launch Times')}</h3>
            <div class="ra-grid">
                <div class="ra-form-group">
                    <label for="raLandingTime">${tt('Landing Time')}</label>
                    <input id="raLandingTime" type="text" placeholder="dd/mm/yyyy HH:mm:ss" />
                </div>
                <div class="ra-form-group">
                    <label for="raGroupsFilter">${tt('Group')}</label>
                    ${groupsFilter}
                </div>
            </div>
            <div class="ra-btn-group">
                <button id="calculateLaunchTimes" class="ra-btn ra-btn-primary">
                    &#9876; ${tt('Calculate Launch Times')}
                </button>
                <button id="resetAll" class="ra-btn ra-btn-outline">
                    ${tt('Reset')}
                </button>
                <button id="resetGroupBtn" class="ra-btn ra-btn-outline">
                    ${tt('Reset Chosen Group')}
                </button>
            </div>
        </div>

        <!-- Villages Card -->
        <div class="ra-card">
            <h3 class="ra-card-title">${tt('Village')}s</h3>
            ${villagesTable}
        </div>

    `;
}

// Render UI with modern, professional design
function renderUI(body) {
    const content = `
        <!-- Launcher button (always visible) -->
        <button id="raPlannerLauncher" title="Abrir Planificador">⚔</button>

        <!-- Floating draggable panel -->
        <div class="ra-planner-container" id="raSingleVillagePlanner">
            <!-- Header / Drag Handle -->
            <div class="ra-header" id="raDragHandle">
                <div class="ra-header-left">
                    <div class="ra-header-icon">⚔</div>
                    <div>
                        <h1 class="ra-title">Planificador de Ataques</h1>
                        <p class="ra-subtitle">TACTICAL COMMAND CENTER · ${scriptData.version}</p>
                    </div>
                </div>
                <div class="ra-header-controls">
                    <div class="ra-header-badge">LIVE</div>
                    <button class="ra-ctrl-btn" id="raThemeBtn" title="Tema visual">🎨</button>
                    <button class="ra-ctrl-btn" id="raMinimizeBtn" title="Minimizar">─</button>
                    <button class="ra-ctrl-btn ra-ctrl-close" id="raCloseBtn" title="Cerrar">✕</button>
                </div>
            </div>

            <!-- Main Content -->
            <div class="ra-content" id="raPanelContent">
                ${body}
            </div>

            <!-- Footer -->
            <div class="ra-footer" id="raPanelFooter">
                <span class="ra-footer-credit">Desarrollado por <strong>rabagalan73</strong> · Para uso exclusivo de <strong>M0bscene</strong></span>
            </div>

            <!-- Theme Panel -->
            <div class="ra-theme-panel" id="raThemePanel">
                <div class="ra-theme-panel-head">
                    <span>🎨 Tema visual</span>
                    <button class="ra-theme-close" id="raThemeClose">✕</button>
                </div>
                <div class="ra-theme-list" id="raThemeList">
                    ${Object.entries(RA_THEMES).map(([k, t]) => {
                        const active = k === getRACurrentTheme() ? ' active' : '';
                        return `<div class="ra-theme-item${active}" data-ra-theme="${k}">
                            <div class="ra-theme-dot" style="background:${t['--fg-accent']};border:2px solid ${t['--fg-accent2']};"></div>
                            <span class="ra-theme-item-name">${t.emoji} ${t.name}</span>
                        </div>`;
                    }).join('')}
                </div>
            </div>

            <!-- Resize handle -->
            <div class="ra-resize-handle" id="raResizeHandle"></div>
        </div>

        <!-- Modals Container -->
        <div id="raModalsContainer"></div>

        <style>
            :root {
                --bg-base:       #F8FAF8;
                --bg-card:       #FFFFFF;
                --bg-card-hover: #F2F7F3;
                --bg-header:     #15803D;
                --accent-gold:   #16A34A;
                --accent-red:    #16A34A;
                --accent-red-h:  #15803D;
                --accent-green:  #22C55E;
                --accent-blue:   #16A34A;
                --color-text:    #1A2E1A;
                --color-muted:   #5A7A5A;
                --color-border:  #C8DFC8;
                --color-selected:#EBF7ED;
                --ra-row-even:   #EBF7ED;
                --ra-row-hover:  #EBF7ED;
                --ra-shadow:     rgba(0,0,0,.7);
                --transition:    all 0.2s ease;
            }

            @keyframes ra-fadeIn {
                from { opacity: 0; transform: translateY(8px); }
                to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes ra-slideRight {
                from { opacity: 0; transform: translateX(-12px); }
                to   { opacity: 1; transform: translateX(0); }
            }
            @keyframes ra-scaleIn {
                from { opacity: 0; transform: scale(0.96); }
                to   { opacity: 1; transform: scale(1); }
            }
            @keyframes ra-fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to   { opacity: 0; transform: translateY(-8px); }
            }
            @keyframes ra-pulse {
                0%, 100% { opacity: 1; }
                50%       { opacity: 0.4; }
            }

            /* ── Launcher button ── */
            #raPlannerLauncher {
                position: fixed;
                bottom: 60px;
                right: 32px;
                z-index: 9998;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                border: 2px solid #ffffff;
                background: var(--bg-header);
                color: #ffffff;
                font-size: 20px;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(34,197,94,0.35);
                transition: var(--transition);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #raPlannerLauncher:hover {
                background: var(--accent-gold);
                color: var(--bg-base);
                box-shadow: 0 6px 24px rgba(34,197,94,0.6);
                transform: scale(1.08);
            }

            /* ── Floating Panel Container ── */
            .ra-planner-container {
                position: fixed;
                top: 60px;
                right: 24px;
                width: 860px;
                max-width: 95vw;
                max-height: 88vh;
                z-index: 9997;
                background: var(--bg-base);
                border-radius: 12px;
                border: 1px solid var(--color-border);
                box-shadow: 0 24px 80px var(--ra-shadow), 0 0 0 1px rgba(34,197,94,0.08);
                overflow: hidden;
                display: flex;
                flex-direction: column;
                animation: ra-fadeIn 0.3s ease;
                font-family: 'Segoe UI', system-ui, sans-serif;
                color: var(--color-text);
                resize: none;
            }
            .ra-planner-container.ra-minimized .ra-content,
            .ra-planner-container.ra-minimized .ra-footer {
                display: none;
            }

            /* ── Header / Drag Handle ── */
            .ra-header {
                background: var(--bg-header);
                border-bottom: 1px solid #15803D;
                padding: 12px 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: grab;
                user-select: none;
                flex-shrink: 0;
            }
            .ra-header:active { cursor: grabbing; }
            .ra-header-left {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .ra-header-icon {
                font-size: 22px;
                line-height: 1;
                filter: drop-shadow(0 0 5px rgba(34,197,94,0.5));
            }
            .ra-title {
                margin: 0;
                font-size: 17px;
                font-weight: 700;
                color: #ffffff;
                letter-spacing: 0.3px;
            }
            .ra-subtitle {
                margin: 2px 0 0;
                font-size: 9px;
                font-weight: 600;
                color: rgba(255,255,255,0.75);
                letter-spacing: 1.5px;
                text-transform: uppercase;
            }
            .ra-header-controls {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .ra-header-badge {
                background: var(--accent-red);
                color: #D1FAE5;
                font-size: 9px;
                font-weight: 700;
                letter-spacing: 1.5px;
                padding: 2px 7px;
                border-radius: 4px;
                animation: ra-pulse 2s infinite;
            }
            .ra-ctrl-btn {
                background: rgba(255,255,255,0.15);
                border: 1px solid rgba(255,255,255,0.3);
                color: #ffffff;
                width: 24px;
                height: 24px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: var(--transition);
                line-height: 1;
                padding: 0;
            }
            .ra-ctrl-btn:hover {
                border-color: var(--accent-gold);
                color: var(--accent-gold);
            }
            .ra-ctrl-close:hover {
                border-color: #16A34A;
                color: #16A34A;
            }

            /* ── Scrollable Content ── */
            .ra-content {
                padding: 16px 20px;
                overflow-y: auto;
                flex: 1;
                min-height: 0;
            }

            /* ── Resize handle ── */
            .ra-resize-handle {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 18px;
                height: 18px;
                cursor: se-resize;
                background: linear-gradient(135deg, transparent 50%, var(--color-border) 50%);
                border-radius: 0 0 12px 0;
            }

            /* ── Cards ── */
            .ra-card {
                background: var(--bg-card);
                border-radius: 8px;
                border: 1px solid var(--color-border);
                padding: 16px;
                margin-bottom: 12px;
                animation: ra-slideRight 0.35s ease;
                transition: var(--transition);
            }
            .ra-card:hover {
                border-color: #3D4460;
            }
            .ra-card-title {
                font-size: 12px;
                font-weight: 700;
                color: var(--accent-gold);
                text-transform: uppercase;
                letter-spacing: 1.2px;
                margin: 0 0 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .ra-card-title::before {
                content: '';
                display: inline-block;
                width: 3px;
                height: 14px;
                background: var(--accent-gold);
                border-radius: 2px;
            }

            /* ── Grid ── */
            .ra-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 12px;
                margin-bottom: 14px;
            }

            /* ── Form Elements ── */
            .ra-form-group {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .ra-form-group label {
                font-size: 10px;
                font-weight: 700;
                color: var(--color-muted);
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .ra-form-group input,
            .ra-form-group select {
                padding: 9px 12px;
                background: var(--bg-base);
                border: 1px solid var(--color-border);
                border-radius: 6px;
                font-size: 13px;
                color: var(--color-text);
                font-family: 'Courier New', monospace;
                transition: var(--transition);
            }
            .ra-form-group input:focus,
            .ra-form-group select:focus {
                outline: none;
                border-color: var(--accent-gold);
                box-shadow: 0 0 0 2px rgba(245,158,11,0.15);
            }
            .ra-form-group select option {
                background: var(--bg-card);
            }

            /* ── Buttons ── */
            .ra-btn-group {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                margin-top: 14px;
            }
            .ra-btn {
                padding: 9px 18px;
                border: none;
                border-radius: 6px;
                font-size: 11px;
                font-weight: 700;
                cursor: pointer;
                transition: var(--transition);
                display: inline-flex;
                align-items: center;
                gap: 6px;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                text-decoration: none;
            }
            .ra-btn:active { transform: scale(0.97); }

            .ra-btn-primary {
                background: var(--accent-red);
                color: white;
                box-shadow: 0 4px 16px rgba(22,163,74,0.3);
            }
            .ra-btn-primary:hover {
                background: var(--accent-red-h);
                box-shadow: 0 6px 20px rgba(22,163,74,0.45);
                transform: translateY(-1px);
            }
            .ra-btn-secondary {
                background: #22C55E;
                color: #fff;
                box-shadow: 0 4px 16px rgba(34,197,94,0.25);
            }
            .ra-btn-secondary:hover {
                background: #16A34A;
                transform: translateY(-1px);
            }
            .ra-btn-outline {
                background: transparent;
                border: 1px solid var(--color-border);
                color: var(--color-muted);
            }
            .ra-btn-outline:hover {
                border-color: var(--accent-gold);
                color: var(--accent-gold);
                background: rgba(245,158,11,0.05);
            }

            /* ── Table ── */
            .ra-table {
                width: 100%;
                border-collapse: collapse;
            }
            .ra-table thead tr {
                background: var(--bg-header) !important;
                border-bottom: 2px solid var(--accent-red-h) !important;
            }
            .ra-table th {
                padding: 10px 8px;
                text-align: center;
                font-size: 10px;
                font-weight: 700;
                color: #ffffff !important;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                white-space: nowrap;
                background: transparent !important;
            }
            .ra-table th:first-child { text-align: left; }
            .ra-table td {
                padding: 7px 8px;
                border-bottom: 1px solid var(--color-border);
                font-size: 12px;
                color: var(--color-text);
                text-align: center;
            }
            .ra-table td:first-child { text-align: left; }
            .ra-table tbody tr { transition: var(--transition); }
            .ra-table tbody tr:nth-child(even) {
                background: var(--ra-row-even);
            }
            .ra-table tbody tr:hover {
                background: var(--ra-row-hover);
            }
            .ra-table tbody tr.ra-selected-village {
                background: var(--color-selected);
                border-left: 3px solid var(--accent-gold);
            }

            /* Unit images */
            .ra-table img {
                cursor: pointer;
                transition: var(--transition);
                filter: none;
            }
            .ra-table img:hover {
                filter: drop-shadow(0 0 4px rgba(22,163,74,0.5));
                transform: scale(1.15);
            }
            .ra-table img.ra-selected-unit {
                filter: drop-shadow(0 0 5px rgba(22,163,74,0.8)) !important;
                outline: 2px solid var(--accent-gold);
                outline-offset: 2px;
                border-radius: 3px;
            }

            /* Unit header toggle */
            .ra-unit-toggle img {
                filter: none;
                transition: var(--transition);
            }
            .ra-unit-toggle:hover img {
                filter: drop-shadow(0 0 4px rgba(22,163,74,0.4));
                transform: scale(1.1);
            }

            /* Priority icon */
            .ra-table td .icon.ra-priority-village {
                color: var(--accent-gold) !important;
                filter: drop-shadow(0 0 3px rgba(245,158,11,0.7));
            }

            /* Selected command row highlight */
            .ra-chosen-command td {
                background: var(--ra-row-hover) !important;
                border-top: 1px solid var(--accent-gold) !important;
                border-bottom: 1px solid var(--accent-gold) !important;
            }
            .ra-chosen-command td:first-child {
                border-left: 3px solid var(--accent-gold) !important;
            }

            /* Village link */
            .ra-table a {
                color: var(--color-text);
                text-decoration: none;
                transition: var(--transition);
            }
            .ra-table a:hover { color: var(--accent-gold); }

            /* Table scroll wrapper */
            .ra-table-wrapper {
                max-height: calc(6 * 44px + 44px);
                overflow-y: auto;
                border-radius: 0 0 6px 6px;
                border: 1px solid var(--color-border);
            }
            .ra-table-wrapper .ra-table thead {
                position: sticky;
                top: 0;
                z-index: 1;
            }
            .ra-table-wrapper::-webkit-scrollbar {
                width: 6px;
            }
            .ra-table-wrapper::-webkit-scrollbar-track {
                background: var(--bg-base);
            }
            .ra-table-wrapper::-webkit-scrollbar-thumb {
                background: var(--accent-gold);
                border-radius: 3px;
            }

            /* Count below unit */
            .ra-table small {
                display: block;
                font-size: 10px;
                color: var(--color-muted);
                margin-top: 2px;
                font-family: 'Courier New', monospace;
            }
            .ra-table small:not(:empty):not(:contains("0")) {
                color: #94A3B8;
            }

            /* ── Textarea ── */
            .ra-textarea {
                width: 100%;
                min-height: 110px;
                padding: 10px 12px;
                background: var(--bg-base);
                border: 1px solid var(--color-border);
                border-radius: 6px;
                font-size: 12px;
                font-family: 'Courier New', monospace;
                color: var(--color-text);
                resize: vertical;
                transition: var(--transition);
            }
            .ra-textarea:focus {
                outline: none;
                border-color: var(--accent-gold);
                box-shadow: 0 0 0 2px rgba(245,158,11,0.1);
            }

            /* ── Footer ── */
            .ra-footer {
                padding: 10px 24px;
                border-top: 1px solid #15803D;
                background: var(--bg-header);
                text-align: center;
            }
            .ra-footer-credit {
                font-size: 10px;
                color: rgba(255,255,255,0.8);
                letter-spacing: 0.5px;
            }
            .ra-footer-credit strong {
                color: #ffffff;
            }

            /* ── Notifications ── */
            .ra-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 6px;
                color: white;
                font-size: 13px;
                font-weight: 600;
                box-shadow: 0 8px 24px rgba(0,0,0,0.4);
                animation: ra-slideRight 0.3s ease;
                z-index: 10000;
                border-left: 4px solid transparent;
            }
            .ra-notification.success {
                background: #f0fdf4;
                border-color: #22C55E;
                color: #15803D;
            }
            .ra-notification.error {
                background: #f0fdf4;
                border-color: #16A34A;
                color: #166534;
            }
            .ra-notification.info {
                background: #f0fdf4;
                border-color: #4ADE80;
                color: #15803D;
            }

            /* ── Modal ── */
            .ra-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.7);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                animation: ra-fadeIn 0.25s ease;
            }
            .ra-modal {
                background: var(--bg-card);
                border: 1px solid var(--color-border);
                border-radius: 10px;
                box-shadow: 0 24px 80px rgba(0,0,0,0.6);
                max-width: 500px;
                width: 90%;
                max-height: 85vh;
                display: flex;
                flex-direction: column;
                animation: ra-scaleIn 0.25s ease;
            }
            .ra-modal-header {
                background: var(--bg-header);
                padding: 14px 18px;
                border-bottom: 1px solid var(--color-border);
                border-radius: 10px 10px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .ra-modal-header h2 {
                margin: 0;
                font-size: 14px;
                font-weight: 700;
                color: var(--color-text);
            }
            .ra-modal-close {
                background: transparent;
                border: 1px solid var(--color-border);
                color: var(--color-muted);
                font-size: 16px;
                cursor: pointer;
                width: 28px;
                height: 28px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: var(--transition);
            }
            .ra-modal-close:hover {
                border-color: var(--accent-green);
                color: var(--accent-green);
            }
            .ra-modal-body {
                padding: 16px;
                overflow-y: auto;
                flex: 1;
                font-size: 13px;
                color: var(--color-text);
            }
            .ra-modal-footer {
                padding: 12px 16px;
                border-top: 1px solid var(--color-border);
                display: flex;
                gap: 8px;
                justify-content: flex-end;
                background: var(--bg-header);
                border-radius: 0 0 10px 10px;
            }

            /* ── Phase 2 – Loading ── */
            .ra-phase2 {
                display: flex; flex-direction: column; align-items: center;
                justify-content: center; padding: 70px 20px; gap: 18px;
            }
            .ra-spinner {
                width: 40px; height: 40px;
                border: 3px solid var(--color-border);
                border-top-color: var(--accent-gold);
                border-radius: 50%;
                animation: ra-spin 0.75s linear infinite;
            }
            @keyframes ra-spin { to { transform: rotate(360deg); } }
            .ra-phase2-title { font-size: 15px; font-weight: 700; color: var(--color-text); }
            .ra-phase2-sub   { font-size: 12px; color: var(--color-muted); }

            /* ── Phase 3 – Results ── */
            .ra-phase3-header {
                display: flex; align-items: center; gap: 12px;
                margin-bottom: 14px; padding-bottom: 12px;
                border-bottom: 1px solid var(--color-border); flex-wrap: wrap;
            }
            .ra-phase3-meta { display: flex; gap: 8px; flex-wrap: wrap; flex: 1; }
            .ra-meta-pill {
                font-size: 11px; font-weight: 600; color: var(--color-muted);
                background: var(--bg-base); border: 1px solid var(--color-border);
                padding: 4px 10px; border-radius: 20px; white-space: nowrap;
            }
            .ra-meta-count { color: var(--accent-gold); border-color: var(--accent-gold); }

            /* ── Tabs ── */
            .ra-tabs {
                display: flex; gap: 2px; margin-bottom: 12px;
                border-bottom: 2px solid var(--color-border);
            }
            .ra-tab {
                padding: 8px 16px; border: none; background: transparent;
                color: var(--color-muted); font-size: 12px; font-weight: 700;
                cursor: pointer; border-radius: 6px 6px 0 0;
                transition: var(--transition);
                border-bottom: 2px solid transparent; margin-bottom: -2px;
                font-family: 'Segoe UI', system-ui, sans-serif;
            }
            .ra-tab:hover { color: var(--accent-gold); }
            .ra-tab-active {
                color: var(--accent-gold);
                border-bottom-color: var(--accent-gold);
                background: var(--color-selected);
            }

            /* ── Export buttons ── */
            .ra-export-btns { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
            .ra-btn-sm { padding: 6px 12px; font-size: 11px; }

            /* ── Visual Preview ── */
            .ra-preview-wrap {
                border: 1px solid var(--color-border); border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            }
            .ra-preview-header {
                background: var(--bg-base); padding: 10px 14px;
                display: flex; gap: 24px; font-size: 12px;
                color: var(--color-muted); border-bottom: 1px solid var(--color-border);
                flex-wrap: wrap;
            }
            .ra-preview-header strong { color: var(--color-text); }
            .ra-coord-link {
                color: var(--accent-gold);
                font-weight: 700;
                font-family: 'Courier New', monospace;
                text-decoration: none;
                background: var(--color-selected);
                border: 1px solid var(--color-border);
                border-radius: 3px;
                padding: 1px 5px;
                font-size: 11px;
                white-space: nowrap;
            }
            .ra-coord-link:hover { background: var(--ra-row-hover); }

            /* ── Theme Panel ── */
            .ra-theme-panel {
                position: absolute; top: 0; right: 0; bottom: 0;
                width: 220px; background: var(--bg-card);
                border-left: 1px solid var(--color-border);
                z-index: 200; display: flex; flex-direction: column;
                transform: translateX(100%); transition: transform .25s ease;
                box-shadow: -6px 0 24px rgba(0,0,0,.15);
            }
            .ra-theme-panel.open { transform: translateX(0); }
            .ra-theme-panel-head {
                background: var(--bg-header); padding: 11px 14px;
                display: flex; align-items: center; justify-content: space-between;
                flex-shrink: 0;
            }
            .ra-theme-panel-head span { font-size: 12px; font-weight: 700; color: #fff; }
            .ra-theme-close {
                background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.25);
                color: #fff; width: 22px; height: 22px; border-radius: 5px;
                cursor: pointer; font-size: 11px; display: flex; align-items: center;
                justify-content: center; line-height: 1;
            }
            .ra-theme-close:hover { background: rgba(255,255,255,.25); }
            .ra-theme-list {
                padding: 8px; display: flex; flex-direction: column; gap: 4px;
                overflow-y: auto; flex: 1;
            }
            .ra-theme-item {
                display: flex; align-items: center; gap: 8px; padding: 7px 9px;
                border-radius: 7px; border: 1.5px solid transparent; cursor: pointer;
                transition: border-color .15s, background .15s; background: var(--bg-base);
            }
            .ra-theme-item:hover { border-color: var(--color-border); }
            .ra-theme-item.active { border-color: var(--accent-gold) !important; }
            .ra-theme-dot {
                width: 22px; height: 22px; border-radius: 5px; flex-shrink: 0;
            }
            .ra-theme-item-name { font-size: 12px; font-weight: 600; color: var(--color-text); }

            /* ── Responsive ── */
            @media (max-width: 768px) {
                .ra-content { padding: 12px 14px; }
                .ra-grid { grid-template-columns: 1fr; }
                .ra-modal { width: 95%; }
                .ra-header { flex-direction: column; gap: 8px; }
            }
        </style>
    `;

    window._raPlannerPhase1HTML = body;

    if (jQuery('.ra-planner-container').length < 1) {
        jQuery('body').append(content);
        initPanelBehavior();
    } else {
        jQuery('#raPanelContent').html(body);
    }
}

function initPanelBehavior() {
    const panel = document.getElementById('raSingleVillagePlanner');
    const handle = document.getElementById('raDragHandle');
    const resizeHandle = document.getElementById('raResizeHandle');
    const launcher = document.getElementById('raPlannerLauncher');

    // ── Drag ──
    let dragging = false, dragOffX = 0, dragOffY = 0;

    handle.addEventListener('mousedown', (e) => {
        if (e.target.closest('.ra-ctrl-btn')) return;
        dragging = true;
        dragOffX = e.clientX - panel.getBoundingClientRect().left;
        dragOffY = e.clientY - panel.getBoundingClientRect().top;
        panel.style.transition = 'none';
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        let x = e.clientX - dragOffX;
        let y = e.clientY - dragOffY;
        x = Math.max(0, Math.min(x, window.innerWidth - panel.offsetWidth));
        y = Math.max(0, Math.min(y, window.innerHeight - 50));
        panel.style.left = x + 'px';
        panel.style.top = y + 'px';
        panel.style.right = 'auto';
    });

    document.addEventListener('mouseup', () => {
        dragging = false;
        panel.style.transition = '';
        document.body.style.userSelect = '';
    });

    // ── Resize ──
    let resizing = false, resizeStartX, resizeStartY, resizeStartW, resizeStartH;

    resizeHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        resizing = true;
        resizeStartX = e.clientX;
        resizeStartY = e.clientY;
        resizeStartW = panel.offsetWidth;
        resizeStartH = panel.offsetHeight;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!resizing) return;
        const w = Math.max(420, resizeStartW + (e.clientX - resizeStartX));
        const h = Math.max(200, resizeStartH + (e.clientY - resizeStartY));
        panel.style.width = w + 'px';
        panel.style.maxHeight = h + 'px';
    });

    document.addEventListener('mouseup', () => {
        resizing = false;
        document.body.style.userSelect = '';
    });

    // ── Minimize ──
    document.getElementById('raMinimizeBtn').addEventListener('click', () => {
        panel.classList.toggle('ra-minimized');
        document.getElementById('raMinimizeBtn').textContent =
            panel.classList.contains('ra-minimized') ? '□' : '─';
    });

    // ── Close / reopen ──
    document.getElementById('raCloseBtn').addEventListener('click', () => {
        panel.style.display = 'none';
        launcher.style.display = 'flex';
    });

    launcher.addEventListener('click', () => {
        panel.style.display = 'flex';
        launcher.style.display = 'none';
    });

    // ── Theme panel ──
    const themePanel = document.getElementById('raThemePanel');
    document.getElementById('raThemeBtn').addEventListener('click', () => {
        themePanel.classList.toggle('open');
    });
    document.getElementById('raThemeClose').addEventListener('click', () => {
        themePanel.classList.remove('open');
    });
    document.getElementById('raThemeList').addEventListener('click', (e) => {
        const item = e.target.closest('.ra-theme-item');
        if (!item) return;
        const name = item.dataset.raTheme;
        applyRATheme(name);
        document.querySelectorAll('.ra-theme-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
    });

    // Panel oculto al inicio — el launcher lo abre
    panel.style.display = 'none';
    launcher.style.display = 'flex';
}

// Action Handler: Here is the logic to collect units
function choseUnit() {
    jQuery('.ra-table td img').on('click', function () {
        // toggle state of chosen unit
        jQuery(this)
            .parent()
            .parent()
            .find('img')
            .not(this)
            .removeClass('ra-selected-unit');
        jQuery(this).toggleClass('ra-selected-unit');

        // toggle state of chosen village
        jQuery('#raAttackPlannerTable tbody tr').each(function () {
            const isAnyUnitSelected = jQuery(this).find(
                'img.ra-selected-unit'
            )[0];
            if (isAnyUnitSelected) {
                jQuery(this).addClass('ra-selected-village');
            } else {
                jQuery(this)
                    .find('td .icon')
                    .removeClass('ra-priority-village');
                jQuery(this).removeClass('ra-selected-village');
            }
        });
    });
}

// Action Handler: Change the village send priority
function changeVillagePriority() {
    jQuery('#raAttackPlannerTable tbody td .icon').on('click', function () {
        const isUnitSelectedForVillage = jQuery(this)
            .parent()
            .parent()
            .find('.ra-selected-unit')[0];
        if (isUnitSelectedForVillage) {
            jQuery(this).toggleClass('ra-priority-village');
        } else {
            raModalManager.showNotification('❌ ' + tt('This village has no unit selected!'), 'error');
        }
    });
}

// Action Handler: Grab the "chosen" villages and calculate their launch times based on the unit type
function calculateLaunchTimes() {
    jQuery('#calculateLaunchTimes').on('click', function (e) {
        e.preventDefault();

        const landingTimeString = jQuery('#raLandingTime').val().trim();
        const destinationVillage = jQuery('#content_value table table td:eq(2)').text();

        let villagesUnitsToSend = [];

        jQuery('#raAttackPlannerTable .ra-selected-unit').each(function () {
            const id = parseInt(jQuery(this).attr('data-village-id'));
            const unit = jQuery(this).attr('data-unit-type');
            const coords = jQuery(this).attr('data-village-coords');
            const isPrioVillage = jQuery(this).parent().parent().find('td .ra-priority-village')[0] ? true : false;
            const distance = calculateDistance(coords, destinationVillage);
            villagesUnitsToSend.push({ id, unit, coords, highPrio: isPrioVillage, distance });
        });

        if (landingTimeString === '' && villagesUnitsToSend.length === 0) {
            raModalManager.showNotification('❌ Falta el tiempo de llegada y no hay unidades seleccionadas', 'error');
            return;
        }
        if (landingTimeString === '') {
            raModalManager.showNotification('❌ Indica el tiempo de llegada (dd/mm/yyyy HH:mm:ss)', 'error');
            return;
        }
        if (villagesUnitsToSend.length === 0) {
            raModalManager.showNotification('❌ Selecciona al menos una unidad de la tabla de aldeas', 'error');
            return;
        }

        // Guardar estado antes de cambiar de fase
        window._raPlannerState = {
            landingTime: landingTimeString,
            selectedUnits: villagesUnitsToSend.map(v => ({ villageId: v.id, unit: v.unit, highPrio: v.highPrio })),
            groupId: jQuery('#raGroupsFilter').val(),
        };

        showPhase(2);

        setTimeout(() => {
            const landingTime = getLandingTime(landingTimeString);
            const plans = getPlans(landingTime, destinationVillage, villagesUnitsToSend);

            if (plans.length > 0) {
                showPhase(3, plans, destinationVillage, landingTimeString);
            } else {
                showPhase2Error(
                    '¡Sin combinaciones posibles!',
                    'No hay envíos que lleguen a tiempo con las unidades y aldeas seleccionadas.<br>Revisa el tiempo de llegada o selecciona unidades más rápidas.'
                );
            }
        }, 80);
    });
}

// ── Phase system ────────────────────────────────────────────────────────────

function showPhase(phase, plans, destinationVillage, landingTimeString) {
    const content = document.getElementById('raPanelContent');
    if (phase === 2) {
        content.innerHTML = renderPhase2();
    } else if (phase === 3) {
        content.innerHTML = renderPhase3(plans, destinationVillage, landingTimeString);
        initPhase3Events(plans, destinationVillage);
    } else {
        // Fase 1: restaurar contenido guardado y re-enlazar eventos
        jQuery('#raPanelContent').html(window._raPlannerPhase1HTML || '');
        choseUnit();
        changeVillagePriority();
        calculateLaunchTimes();
        resetAll();
        fillLandingTimeFromCommand();
        filterVillagesByChosenGroup();
        setAllUnits();
        resetGroup();
        if (!game_data.units.includes('archer')) jQuery('.archer-world').hide();
        if (!game_data.units.includes('knight')) jQuery('.paladin-world').hide();

        // Restaurar selecciones previas
        const s = window._raPlannerState;
        if (s) {
            jQuery('#raLandingTime').val(s.landingTime);
            if (s.groupId) jQuery('#raGroupsFilter').val(s.groupId);
            s.selectedUnits.forEach(u => {
                const img = jQuery(`#raAttackPlannerTable img[data-village-id="${u.villageId}"][data-unit-type="${u.unit}"]`);
                if (img.length) {
                    img.addClass('ra-selected-unit');
                    img.closest('tr').addClass('ra-selected-village');
                    if (u.highPrio) img.closest('tr').find('td .icon').addClass('ra-priority-village');
                }
            });
        }
    }
}

function renderPhase2() {
    return `
        <div class="ra-phase2" id="raPhase2Box">
            <div class="ra-spinner"></div>
            <div class="ra-phase2-title">Calculando tiempos de lanzamiento...</div>
            <div class="ra-phase2-sub">Procesando combinaciones de unidades y distancias</div>
        </div>
    `;
}

function showPhase2Error(title, desc) {
    const box = document.getElementById('raPhase2Box');
    if (!box) return;
    box.innerHTML = `
        <div style="font-size:42px;line-height:1;margin-bottom:14px;">❌</div>
        <div class="ra-phase2-title" style="color:#dc2626;">${title}</div>
        <div class="ra-phase2-sub" style="max-width:360px;text-align:center;line-height:1.6;margin-bottom:20px;">${desc}</div>
        <button id="raPhase2BackBtn" class="ra-btn ra-btn-outline">← Volver a configuración</button>
    `;
    document.getElementById('raPhase2BackBtn').addEventListener('click', () => showPhase(1));
}

function renderPhase3(plans, destinationVillage, landingTimeString) {
    const bbTable  = getBBCodePlans(plans, destinationVillage, landingTimeString);
    const bbSimple = getCodePlans(plans, destinationVillage, landingTimeString);
    const preview  = renderVisualPreview(plans, destinationVillage, landingTimeString);
    const n = plans.length;

    return `
        <div class="ra-phase3">
            <div class="ra-phase3-header">
                <button class="ra-btn ra-btn-outline ra-btn-sm" id="raBackBtn">← Volver</button>
                <div class="ra-phase3-meta">
                    <span class="ra-meta-pill">🎯 ${destinationVillage}</span>
                    <span class="ra-meta-pill">⏱ ${landingTimeString}</span>
                    <span class="ra-meta-pill ra-meta-count">${n} envío${n !== 1 ? 's' : ''}</span>
                </div>
            </div>

            <div class="ra-tabs">
                <button class="ra-tab ra-tab-active" data-tab="bbtable">📋 BB Tabla</button>
                <button class="ra-tab" data-tab="bbsimple">📄 BB Simple (Notas)</button>
                <button class="ra-tab" data-tab="preview">👁 Vista Previa</button>
            </div>

            <div class="ra-tab-panel" id="raTab-bbtable">
                <textarea class="ra-textarea" id="raExportPlanBBCode" readonly>${bbTable}</textarea>
                <div class="ra-export-btns">
                    <button class="ra-btn ra-btn-primary" id="raCopyBBTable">📋 Copiar</button>
                </div>
            </div>

            <div class="ra-tab-panel" id="raTab-bbsimple" style="display:none;">
                <textarea class="ra-textarea" id="raExportPlanCode" readonly>${bbSimple}</textarea>
                <div class="ra-export-btns">
                    <button class="ra-btn ra-btn-primary" id="raCopyBBSimple">📋 Copiar</button>
                    <button class="ra-btn ra-btn-secondary" id="raAddNoteBBSimple">📝 Agregar Nota</button>
                </div>
            </div>

            <div class="ra-tab-panel" id="raTab-preview" style="display:none;">
                ${preview}
            </div>
        </div>
    `;
}

function renderVisualPreview(plans, destinationVillage, landingTimeString) {
    let rows = '';
    plans.forEach((plan, i) => {
        const { unit, coords, launchTimeFormatted, highPrio, villageId } = plan;
        const [toX, toY] = destinationVillage.split('|');
        const sitterData = game_data.player.sitter > 0 ? `t=${game_data.player.id}&` : '';
        const rallyData  = game_data.market !== 'uk' ? `&x=${toX}&y=${toY}` : '';
        const url = `/game.php?${sitterData}village=${villageId}&screen=place${rallyData}`;
        const prioHtml = highPrio
            ? `<span style="color:#dc2626;font-weight:700;font-size:11px;">⚡ Prioritario</span>`
            : `<span style="color:#9ca3af;font-size:11px;">Normal</span>`;
        const rowNote = `[unit]${unit}[/unit] [coord]${coords}[/coord] ${launchTimeFormatted}`;
        rows += `
            <tr style="background:${i % 2 === 0 ? 'var(--ra-row-even)' : 'var(--bg-card)'};">
                <td style="padding:8px 12px;text-align:center;border-bottom:1px solid var(--color-border);">
                    <img src="/graphic/unit/unit_${unit}.webp" style="width:20px;height:20px;vertical-align:middle;" title="${unit}">
                </td>
                <td style="padding:8px 12px;font-size:12px;border-bottom:1px solid var(--color-border);">
                    <a href="/game.php?village=${villageId}&screen=info_village&id=${villageId}" target="_blank"
                       class="ra-coord-link" title="Ver ficha del pueblo">${coords}</a>
                </td>
                <td style="padding:8px 12px;text-align:center;border-bottom:1px solid var(--color-border);">${prioHtml}</td>
                <td style="padding:8px 12px;font-family:monospace;font-size:12px;font-weight:600;border-bottom:1px solid var(--color-border);color:var(--color-text);">${launchTimeFormatted}</td>
                <td style="padding:8px 12px;text-align:center;border-bottom:1px solid var(--color-border);white-space:nowrap;display:flex;gap:6px;align-items:center;justify-content:center;">
                    <a href="${url}" target="_blank"
                       style="background:var(--accent-gold);color:#fff;padding:4px 12px;border-radius:4px;text-decoration:none;font-size:11px;font-weight:700;display:inline-block;">
                        Enviar
                    </a>
                    <button class="ra-row-note-btn" data-note="${rowNote.replace(/"/g,'&quot;')}"
                        style="background:transparent;border:1px solid var(--color-border);border-radius:4px;cursor:pointer;padding:3px 7px;font-size:12px;color:var(--color-muted);transition:all .15s;"
                        title="Agregar esta orden como nota al pueblo">📝</button>
                </td>
            </tr>`;
    });

    return `
        <div class="ra-preview-wrap">
            <div class="ra-preview-header">
                <span>🎯 Plan para: <a href="/game.php?village=${game_data.village}&screen=info_village" target="_blank" class="ra-coord-link">${destinationVillage}</a></span>
                <span>⏱ Llegada: <strong>${landingTimeString}</strong></span>
            </div>
            <div style="overflow:auto;">
                <table style="width:100%;border-collapse:collapse;font-size:12px;font-family:'Segoe UI',system-ui,sans-serif;">
                    <thead>
                        <tr style="background:var(--bg-header);">
                            <th style="padding:10px 12px;color:#fff;font-weight:700;text-align:center;white-space:nowrap;">Unidad</th>
                            <th style="padding:10px 12px;color:#fff;font-weight:700;white-space:nowrap;">Desde</th>
                            <th style="padding:10px 12px;color:#fff;font-weight:700;text-align:center;white-space:nowrap;">Prioridad</th>
                            <th style="padding:10px 12px;color:#fff;font-weight:700;white-space:nowrap;">Lanzamiento</th>
                            <th style="padding:10px 12px;color:#fff;font-weight:700;text-align:center;white-space:nowrap;">Acción</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>`;
}

function initPhase3Events(plans, destinationVillage) {
    // Volver
    document.getElementById('raBackBtn').addEventListener('click', () => showPhase(1));

    // Tabs
    document.querySelectorAll('.ra-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.ra-tab').forEach(t => t.classList.remove('ra-tab-active'));
            document.querySelectorAll('.ra-tab-panel').forEach(p => p.style.display = 'none');
            this.classList.add('ra-tab-active');
            document.getElementById('raTab-' + this.dataset.tab).style.display = 'block';
        });
    });

    // Copiar
    document.getElementById('raCopyBBTable')?.addEventListener('click', () => raModalManager.copyToClipboard('raExportPlanBBCode'));
    document.getElementById('raCopyBBSimple')?.addEventListener('click', () => raModalManager.copyToClipboard('raExportPlanCode'));

    // Agregar nota — botones globales (textarea tabs)
    const bbTableContent  = document.getElementById('raExportPlanBBCode')?.value ?? '';
    const bbSimpleContent = document.getElementById('raExportPlanCode')?.value ?? '';

    document.getElementById('raAddNoteBBSimple')?.addEventListener('click', () => saveVillageNote(bbSimpleContent));

    // Agregar nota — botón por fila en vista previa
    document.querySelectorAll('.ra-row-note-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            saveVillageNote(this.dataset.note);
        });
    });
}

function saveVillageNote(newContent) {
    const msgArea  = document.getElementById('message');
    const saveBtn  = document.getElementById('note_submit_button');
    const editRows = jQuery('.edit_notes_row');

    if (!msgArea || !saveBtn) {
        raModalManager.showNotification('❌ No se encontró el área de notas del pueblo', 'error');
        return;
    }

    // Invisible ANTES de que TW muestre las filas — sin flash
    editRows.css('visibility', 'hidden');

    // Llamar al toggleEdit de TW: muestra las filas Y puebla el textarea con la nota existente
    if (typeof VillageInfo !== 'undefined' && VillageInfo.Notes) {
        VillageInfo.Notes.toggleEdit();
    } else {
        editRows.show();
    }

    // En este punto TW ya pobló #message de forma síncrona
    const existingContent = msgArea.value.trim();

    // Evitar duplicados
    if (existingContent.includes(newContent.trim())) {
        VillageInfo?.Notes ? VillageInfo.Notes.toggleEdit() : editRows.hide();
        editRows.css('visibility', '');
        raModalManager.showNotification('ℹ️ Esta orden ya está en la nota del pueblo', 'info');
        return;
    }

    // Nuevo contenido arriba, existente abajo
    msgArea.value = existingContent
        ? newContent + '\n───────────────────\n' + existingContent
        : newContent;

    // MutationObserver: limpiar visibility cuando TW oculte las filas en su callback
    const observer = new MutationObserver(() => {
        if (editRows.first().css('display') === 'none') {
            editRows.css('visibility', '');
            observer.disconnect();
        }
    });
    editRows.each(function () {
        observer.observe(this, { attributes: true, attributeFilter: ['style'] });
    });
    setTimeout(() => { observer.disconnect(); editRows.css('visibility', ''); }, 6000);

    // TW guarda, actualiza el UI y oculta las filas — no interferimos
    jQuery(saveBtn).trigger('click');

    raModalManager.showNotification('📝 Nota guardada en el pueblo', 'success');
}

// Action Handler: Reset all user input
function resetAll() {
    jQuery('#resetAll').on('click', function (e) {
        e.preventDefault();
        initAttackPlanner(GROUP_ID);
    });
}

// Action Handler: When a command is clicked fill landing time with the landing time of the command
function fillLandingTimeFromCommand() {
    jQuery(
        '#commands_outgoings table tbody tr.command-row, #commands_incomings table tbody tr.command-row'
    ).on('click', function () {
        jQuery('#commands_outgoings table tbody tr.command-row').removeClass(
            'ra-chosen-command'
        );
        jQuery(this).addClass('ra-chosen-command');

        const commandLandingTime =
            parseInt(jQuery(this).find('td:eq(2) span').attr('data-endtime')) *
            1000;

        const formattedNewLandingTime = formatDateTime(new Date(commandLandingTime));

        jQuery('#raLandingTime').val(formattedNewLandingTime);
        raModalManager.showNotification('⏰ ' + tt('Landing time was updated!'), 'success');
    });
}

// Action Handler: Filter villages shown by selected group
function filterVillagesByChosenGroup() {
    jQuery('#raGroupsFilter').on('change', function (e) {
        e.preventDefault();
        initAttackPlanner(e.target.value);
        localStorage.setItem(`${LS_PREFIX}_chosen_group`, e.target.value);
    });
}

// Action Handler: Reset chosen group
function resetGroup() {
    jQuery('#resetGroupBtn').on('click', function (e) {
        e.preventDefault();
        localStorage.removeItem(`${LS_PREFIX}_chosen_group`);
        raModalManager.showNotification('↺ ' + tt('Chosen group was reset!'), 'success');
        initAttackPlanner(0);
    });
}

// Action Handler: Set all villages to unit
function setAllUnits() {
    jQuery('#raAttackPlannerTable thead tr th.ra-unit-toggle').on(
        'click',
        function () {
            const chosenUnit = jQuery(this).find('img').attr('data-set-unit');
            jQuery('#raAttackPlannerTable tbody tr').each(function () {
                jQuery(this)
                    .find(`img[data-unit-type="${chosenUnit}"]`)
                    .trigger('click');
            });
        }
    );
}

// Prepare plans based on user input
function getPlans(landingTime, destinationVillage, villagesUnitsToSend) {
    let plans = [];

    // Prepare plans list
    villagesUnitsToSend.forEach((item) => {
        const launchTime = getLaunchTime(item.unit, landingTime, item.distance);
        const plan = {
            destination: destinationVillage,
            landingTime: landingTime,
            distance: item.distance,
            unit: item.unit,
            highPrio: item.highPrio,
            villageId: item.id,
            launchTime: launchTime,
            coords: item.coords,
            launchTimeFormatted: formatDateTime(launchTime),
        };
        plans.push(plan);
    });

    // Sort times array by nearest launch time
    plans.sort((a, b) => {
        return a.launchTime - b.launchTime;
    });

    console.debug('plans', plans);

    // Filter only valid launch times
    const filteredPlans = plans.filter((item) => {
        return item.launchTime >= getServerTime().getTime();
    });

    console.debug('filteredPlans', filteredPlans);

    return filteredPlans;
}

// Export plan as BB Code
function getBBCodePlans(plans, destinationVillage, landingTime) {
    landingTime = landingTime ?? jQuery('#raLandingTime').val().trim();

    let bbCode = `[size=12][b]${tt(
        'Plan for:'
    )}[/b] ${destinationVillage}\n[b]${tt(
        'Landing Time:'
    )}[/b] ${landingTime}[/size]\n\n`;
    bbCode += `[table][**]${tt('Unit')}[||]${tt('From')}[||]${tt(
        'Priority'
    )}[||]${tt('Launch Time')}[||]${tt('Command')}[||]${tt('Status')}[/**]\n`;

    plans.forEach((plan) => {
        const { unit, highPrio, coords, villageId, launchTimeFormatted } = plan;

        const [toX, toY] = destinationVillage.split('|');

        const priority = highPrio ? tt('Early send') : '';

        const rallyPointData =
            game_data.market !== 'uk' ? `&x=${toX}&y=${toY}` : '';
        const sitterData =
            game_data.player.sitter > 0 ? `t=${game_data.player.id}` : '';

        const commandUrl = `/game.php?${sitterData}&village=${villageId}&screen=place${rallyPointData}`;

        bbCode += `[*][unit]${unit}[/unit][|] [coord]${coords}[/coord] [|][b][color=#ff0000]${priority}[/color][/b][|]${launchTimeFormatted}[|][url=${
            window.location.origin
        }${commandUrl}]${tt('Send')}[/url][|]\n`;
    });

    bbCode += `[/table]`;
    return bbCode;
}

// Export plans without table
function getCodePlans(plans, destinationVillage, landingTime) {
    landingTime = landingTime ?? jQuery('#raLandingTime').val().trim();

    let planCode = `[size=12][b]${tt(
        'Plan for:'
    )}[/b] ${destinationVillage}\n[b]${tt(
        'Landing Time:'
    )}[/b] ${landingTime}[/size]\n\n`;

    plans.forEach((plan) => {
        const { unit, highPrio, coords, villageId, launchTimeFormatted } = plan;

        const [toX, toY] = destinationVillage.split('|');

        const priority = highPrio ? tt('Early send') : '';

        const rallyPointData =
            game_data.market !== 'uk' ? `&x=${toX}&y=${toY}` : '';
        const sitterData =
            game_data.player.sitter > 0 ? `t=${game_data.player.id}` : '';

        const commandUrl = `/game.php?${sitterData}&village=${villageId}&screen=place${rallyPointData}`;

        planCode += `[unit]${unit}[/unit] [coord]${coords}[/coord] [b][color=#ff0000]${priority}[/color][/b]${launchTimeFormatted}[url=${
            window.location.origin
        }${commandUrl}]${tt('Send')}[/url]\n`;
    });

    return planCode;
}

// Helper: Calculate distance between 2 villages
function calculateDistance(villageA, villageB) {
    const x1 = villageA.split('|')[0];
    const y1 = villageA.split('|')[1];

    const x2 = villageB.split('|')[0];
    const y2 = villageB.split('|')[1];

    const deltaX = Math.abs(x1 - x2);
    const deltaY = Math.abs(y1 - y2);

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    return distance;
}

// Helper: Get launch time of command
function getLaunchTime(unit, landingTime, distance) {
    const msPerSec = 1000;
    const secsPerMin = 60;
    const msPerMin = msPerSec * secsPerMin;

    const unitSpeed = unitInfo.config[unit].speed;
    const unitTime = distance * unitSpeed * msPerMin;

    const launchTime = new Date();
    launchTime.setTime(
        Math.round((landingTime - unitTime) / msPerSec) * msPerSec
    );

    return launchTime.getTime();
}

// Helper: Get server time
function getServerTime() {
    const serverTime = jQuery('#serverTime').text();
    const serverDate = jQuery('#serverDate').text();

    const [day, month, year] = serverDate.split('/');
    const serverTimeFormatted =
        year + '-' + month + '-' + day + ' ' + serverTime;
    const serverTimeObject = new Date(serverTimeFormatted);

    return serverTimeObject;
}

// Helper: Format date
function formatDateTime(date) {
    const currentDateTime = new Date(date);

    let currentYear = currentDateTime.getFullYear();
    let currentMonth = currentDateTime.getMonth();
    let currentDate = currentDateTime.getDate();
    let currentHours = '' + currentDateTime.getHours();
    let currentMinutes = '' + currentDateTime.getMinutes();
    let currentSeconds = '' + currentDateTime.getSeconds();

    currentMonth = currentMonth + 1;
    currentMonth = '' + currentMonth;
    currentMonth = currentMonth.padStart(2, '0');

    currentHours = currentHours.padStart(2, '0');
    currentMinutes = currentMinutes.padStart(2, '0');
    currentSeconds = currentSeconds.padStart(2, '0');

    const formatted_date =
        currentDate +
        '/' +
        currentMonth +
        '/' +
        currentYear +
        ' ' +
        currentHours +
        ':' +
        currentMinutes +
        ':' +
        currentSeconds;

    return formatted_date;
}

// Helper: Get landing time date object
function getLandingTime(landingTime) {
    const [landingDay, landingHour] = landingTime.split(' ');
    const [day, month, year] = landingDay.split('/');
    const landingTimeFormatted =
        year + '-' + month + '-' + day + ' ' + landingHour;
    const landingTimeObject = new Date(landingTimeFormatted);
    return landingTimeObject;
}

// Helper: Render own villages table
function renderVillagesTable(villages) {
    if (villages.length) {
        const destinationVillage = jQuery(
            '#content_value table table td:eq(2)'
        ).text();

        let villagesTable = `
		<div class="ra-table-wrapper">
		<table id="raAttackPlannerTable" class="ra-table" width="100%">
			<thead>
				<tr>
					<th width="30%">
						${tt('Village')} (${villages.length})
					</th>
					<th width="8%">
						${tt('Dist.')}
					</th>
					<th width="8%">
						${tt('Prio.')}
					</th>
					<th class="ra-unit-toggle" title="Spear">
						<img src="/graphic/unit/unit_spear.webp" data-set-unit="spear" style="cursor:pointer; width:24px; height:24px;">
					</th>
					<th class="ra-unit-toggle" title="Sword">
						<img src="/graphic/unit/unit_sword.webp" data-set-unit="sword" style="cursor:pointer; width:24px; height:24px;">
					</th>
					<th class="ra-unit-toggle" title="Axe">
						<img src="/graphic/unit/unit_axe.webp" data-set-unit="axe" style="cursor:pointer; width:24px; height:24px;">
					</th>
					<th class="archer-world ra-unit-toggle" title="Archer">
						<img src="/graphic/unit/unit_archer.webp" data-set-unit="archer" style="cursor:pointer; width:24px; height:24px;">
					</th>
					<th class="ra-unit-toggle" title="Spy">
						<img src="/graphic/unit/unit_spy.webp" data-set-unit="spy" style="cursor:pointer; width:24px; height:24px;">
					</th>
					<th class="ra-unit-toggle" title="Light">
						<img src="/graphic/unit/unit_light.webp" data-set-unit="light" style="cursor:pointer; width:24px; height:24px;">
					</th>
					<th class="archer-world ra-unit-toggle" title="Marcher">
						<img src="/graphic/unit/unit_marcher.webp" data-set-unit="marcher" style="cursor:pointer; width:24px; height:24px;">
					</th>
					<th class="ra-unit-toggle" title="Heavy">
						<img src="/graphic/unit/unit_heavy.webp" data-set-unit="heavy" style="cursor:pointer; width:24px; height:24px;">
					</th>
					<th class="ra-unit-toggle" title="Ram">
						<img src="/graphic/unit/unit_ram.webp" data-set-unit="ram" style="cursor:pointer; width:24px; height:24px;">
					</th>
					<th class="ra-unit-toggle" title="Catapult">
						<img src="/graphic/unit/unit_catapult.webp" data-set-unit="catapult" style="cursor:pointer; width:24px; height:24px;">
					</th>
					<th class="paladin-world ra-unit-toggle" title="Knight">
						<img src="/graphic/unit/unit_knight.webp" data-set-unit="knight" style="cursor:pointer; width:24px; height:24px;">
					</th>
					<th class="ra-unit-toggle" title="Snob">
						<img src="/graphic/unit/unit_snob.webp" data-set-unit="snob" style="cursor:pointer; width:24px; height:24px;">
					</th>
				</tr>
			</thead>
			<tbody>
	`;

        const villageCombinations = [];
        villages.forEach((village) => {
            troopCounts.forEach((villageTroops) => {
                if (villageTroops.villageId === village.id) {
                    villageCombinations.push({
                        ...village,
                        ...villageTroops,
                    });
                }
            });
        });

        villageCombinations.forEach((village) => {
            const {
                name,
                coords,
                id,
                spear,
                sword,
                axe,
                archer,
                spy,
                light,
                marcher,
                heavy,
                ram,
                catapult,
                knight,
                snob,
                distance,
            } = village;

            const continent = getContinentByCoord(coords);
            const link = game_data.link_base_pure + `info_village&id=${id}`;

            villagesTable += `
			<tr>
				<td width="30%">
					<a href="${link}" target="_blank" rel="noopener noreferrer">
						${name} (${coords}) K${continent}
					</a>
				</td>
				<td width="8%">${distance}</td>
				<td width="8%">
					<span class="icon header favorite_add"></span>
				</td>
				<td><img data-unit-type="spear" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_spear.webp" style="width:20px; height:20px;"><br><small>${formatAsNumber(spear)}</small></td>
				<td><img data-unit-type="sword" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_sword.webp" style="width:20px; height:20px;"><br><small>${formatAsNumber(sword)}</small></td>
				<td><img data-unit-type="axe" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_axe.webp" style="width:20px; height:20px;"><br><small>${formatAsNumber(axe)}</small></td>
				<td class="archer-world"><img data-unit-type="archer" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_archer.webp" style="width:20px; height:20px;"><br><small>${formatAsNumber(archer)}</small></td>
				<td><img data-unit-type="spy" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_spy.webp" style="width:20px; height:20px;"><br><small>${formatAsNumber(spy)}</small></td>
				<td><img data-unit-type="light" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_light.webp" style="width:20px; height:20px;"><br><small>${formatAsNumber(light)}</small></td>
				<td class="archer-world"><img data-unit-type="marcher" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_marcher.webp" style="width:20px; height:20px;"><br><small>${formatAsNumber(marcher)}</small></td>
				<td><img data-unit-type="heavy" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_heavy.webp" style="width:20px; height:20px;"><br><small>${formatAsNumber(heavy)}</small></td>
				<td><img data-unit-type="ram" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_ram.webp" style="width:20px; height:20px;"><br><small>${formatAsNumber(ram)}</small></td>
				<td><img data-unit-type="catapult" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_catapult.webp" style="width:20px; height:20px;"><br><small>${formatAsNumber(catapult)}</small></td>
				<td class="paladin-world"><img data-unit-type="knight" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_knight.webp" style="width:20px; height:20px;"><br><small>${formatAsNumber(knight)}</small></td>
				<td><img data-unit-type="snob" data-village-id="${id}" data-village-coords="${coords}" src="/graphic/unit/unit_snob.webp" style="width:20px; height:20px;"><br><small>${formatAsNumber(snob)}</small></td>
			</tr>
		`;
        });

        villagesTable += `
			</tbody>
		</table>
		</div>
	`;

        return villagesTable;
    } else {
        return `<p><b>${tt('Villages list could not be fetched!')}</b><br></p>`;
    }
}

// Helper: Render groups filter
function renderGroupsFilter(groups) {
    const groupId = localStorage.getItem(`${LS_PREFIX}_chosen_group`) || 0;
    let groupsFilter = `
		<select name="ra_groups_filter" id="raGroupsFilter">
	`;

    for (const [_, group] of Object.entries(groups.result)) {
        const { group_id, name } = group;
        const isSelected =
            parseInt(group_id) === parseInt(groupId) ? 'selected' : '';
        if (name !== undefined) {
            groupsFilter += `
				<option value="${group_id}" ${isSelected}>
					${name}
				</option>
			`;
        }
    }

    groupsFilter += `
		</select>
	`;

    return groupsFilter;
}

// Helper: Process coordinate and extract coordinate continent
function getContinentByCoord(coord) {
    if (!coord) return '';
    const coordParts = coord.split('|');
    return coordParts[1].charAt(0) + coordParts[0].charAt(0);
}

// Helper: Fetch player villages by group
async function fetchAllPlayerVillagesByGroup(groupId) {
    let villagesByGroup = [];

    try {
        const url =
            game_data.link_base_pure + 'groups&ajax=load_villages_from_group';
        villagesByGroup = await jQuery
            .post({
                url: url,
                data: { group_id: groupId },
            })
            .then((response) => {
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(
                    response.html,
                    'text/html'
                );
                const tableRows = jQuery(htmlDoc)
                    .find('#group_table > tbody > tr')
                    .not(':eq(0)');

                let villagesList = [];

                tableRows.each(function () {
                    const villageId =
                        jQuery(this)
                            .find('td:eq(0) a')
                            .attr('data-village-id') ??
                        jQuery(this)
                            .find('td:eq(0) a')
                            .attr('href')
                            .match(/\d+/)[0];
                    const villageName = jQuery(this)
                        .find('td:eq(0)')
                        .text()
                        .trim();
                    const villageCoords = jQuery(this)
                        .find('td:eq(1)')
                        .text()
                        .trim();

                    villagesList.push({
                        id: parseInt(villageId),
                        name: villageName,
                        coords: villageCoords,
                    });
                });

                return villagesList;
            })
            .catch((error) => {
                raModalManager.showNotification('❌ ' + tt('Villages list could not be fetched!'), 'error');
                return [];
            });
    } catch (error) {
        console.error(`${scriptInfo()} Error:`, error);
        raModalManager.showNotification('❌ ' + tt('Villages list could not be fetched!'), 'error');
        return [];
    }

    return villagesByGroup;
}

// Helper: Fetch village groups
async function fetchVillageGroups() {
    const villageGroups = await jQuery
        .get(
            game_data.link_base_pure +
                'groups&mode=overview&ajax=load_group_menu'
        )
        .then((response) => response)
        .catch((error) => {
            raModalManager.showNotification('❌ ' + tt('Error fetching village groups!'), 'error');
            console.error(`${scriptInfo()} Error:`, error);
        });

    return villageGroups;
}

// Helper: Fetch World Unit Info
function fetchUnitInfo() {
    jQuery
        .ajax({
            url: '/interface.php?func=get_unit_info',
        })
        .done(function (response) {
            unitInfo = xml2json($(response));
            localStorage.setItem(
                `${LS_PREFIX}_unit_info`,
                JSON.stringify(unitInfo)
            );
            localStorage.setItem(
                `${LS_PREFIX}_last_updated`,
                Date.parse(new Date())
            );
        });
}

// Helper: Fetch home troop counts for current group
async function fetchTroopsForCurrentGroup(groupId) {
    const troopsForGroup = await jQuery
        .get(
            game_data.link_base_pure +
                `overview_villages&mode=combined&group=${groupId}&`
        )
        .then((response) => {
            try {
                const htmlDoc = jQuery.parseHTML(response);
                const combinedTableRows = jQuery(htmlDoc).find(
                    '#combined_table tr.nowrap'
                );
                const combinedTableHead = jQuery(htmlDoc).find(
                    '#combined_table tr:eq(0) th'
                );

                const homeTroops = [];
                const combinedTableHeader = [];

                // collect possible buildings and troop types
                jQuery(combinedTableHead).each(function () {
                    const thImage = jQuery(this).find('img').attr('src');
                    if (thImage) {
                        let thImageFilename = thImage.split('/').pop();
                        thImageFilename = thImageFilename.replace('.webp', '');
                        combinedTableHeader.push(thImageFilename);
                    } else {
                        combinedTableHeader.push(null);
                    }
                });

                // collect possible troop types
                combinedTableRows.each(function () {
                    let rowTroops = {};

                    combinedTableHeader.forEach((tableHeader, index) => {
                        if (tableHeader) {
                            if (tableHeader.includes('unit_')) {
                                const villageId = jQuery(this)
                                    .find('td:eq(1) span.quickedit-vn')
                                    .attr('data-id');
                                const unitType = tableHeader.replace('unit_', '');
                                rowTroops = {
                                    ...rowTroops,
                                    villageId: parseInt(villageId),
                                    [unitType]: parseInt(
                                        jQuery(this).find(`td:eq(${index})`).text()
                                    ),
                                };
                            }
                        }
                    });

                    homeTroops.push(rowTroops);
                });

                return homeTroops;
            } catch (error) {
                raModalManager.showNotification('❌ ' + tt('An error occurred while fetching troop counts!'), 'error');
                console.error(`${scriptInfo()} Error:`, error);
                return [];
            }
        })
        .catch((error) => {
            raModalManager.showNotification('❌ ' + tt('An error occurred while fetching troop counts!'), 'error');
            console.error(`${scriptInfo()} Error:`, error);
            return [];
        });

    return troopsForGroup;
}

// Helper: XML to JSON converter
const xml2json = function ($xml) {
    const data = {};
    $.each($xml.children(), function (i) {
        const $this = $(this);
        if ($this.children().length > 0) {
            data[$this.prop('tagName')] = xml2json($this);
        } else {
            data[$this.prop('tagName')] = $.trim($this.text());
        }
    });
    return data;
};

// Helper: Clear script configuration
function resetScriptConfig() {
    localStorage.removeItem(`${LS_PREFIX}_unit_info`);
    localStorage.removeItem(`${LS_PREFIX}_chosen_group`);
    localStorage.removeItem(`${LS_PREFIX}_last_updated`);
    raModalManager.showNotification('✅ ' + tt('Script configuration was reset!'), 'success');
}

// Helper: Format as number
function formatAsNumber(number) {
    return parseInt(number).toLocaleString('de');
}

// Helper: Get parameter by name
function getParameterByName(name, url = window.location.href) {
    return new URL(url).searchParams.get(name);
}

// Helper: Generates script info
function scriptInfo() {
    return `[${scriptData.name} ${scriptData.version}]`;
}

// Helper: Prints universal debug information
function initDebug() {
    console.debug(`${scriptInfo()} It works 🚀!`);
    console.debug(`${scriptInfo()} HELP:`, scriptData.helpLink);
    if (DEBUG) {
        console.debug(`${scriptInfo()} Market:`, game_data.market);
        console.debug(`${scriptInfo()} World:`, game_data.world);
        console.debug(`${scriptInfo()} Screen:`, game_data.screen);
        console.debug(`${scriptInfo()} Game Version:`, game_data.majorVersion);
        console.debug(`${scriptInfo()} Game Build:`, game_data.version);
        console.debug(`${scriptInfo()} Locale:`, game_data.locale);
        console.debug(
            `${scriptInfo()} Premium:`,
            game_data.features.Premium.active
        );
    }
}

// Helper: Text Translator
function tt(string) {
    const gameLocale = game_data.locale;

    if (translations[gameLocale] !== undefined) {
        return translations[gameLocale][string];
    } else {
        return translations['en_DK'][string];
    }
}

function showWrongScreenError() {
    const id = 'ra-wrong-screen-overlay';
    if (document.getElementById(id)) return;

    jQuery('body').append(`
        <div id="${id}" style="
            position:fixed;inset:0;z-index:99999;
            display:flex;align-items:center;justify-content:center;
            background:rgba(0,0,0,0.55);backdrop-filter:blur(3px);
            animation:ra-fadeIn .25s ease;font-family:'Segoe UI',system-ui,sans-serif;">
            <div style="
                background:var(--bg-card);border-radius:12px;
                box-shadow:0 24px 80px var(--ra-shadow);
                border:1px solid var(--color-border);
                max-width:400px;width:92%;overflow:hidden;
                animation:ra-scaleIn .25s ease;">
                <!-- Header -->
                <div style="background:var(--bg-header);padding:14px 18px;display:flex;align-items:center;gap:10px;">
                    <span style="font-size:22px;">⚔</span>
                    <div>
                        <div style="font-size:15px;font-weight:700;color:#fff;">Planificador de Ataques</div>
                        <div style="font-size:10px;color:rgba(255,255,255,.75);letter-spacing:1px;">TACTICAL COMMAND CENTER · ${scriptData.version}</div>
                    </div>
                </div>
                <!-- Body -->
                <div style="padding:28px 24px;text-align:center;background:var(--bg-card);">
                    <div style="font-size:40px;margin-bottom:14px;">🗺️</div>
                    <div style="font-size:15px;font-weight:700;color:var(--color-text);margin-bottom:8px;">
                        Pantalla incorrecta
                    </div>
                    <div style="font-size:13px;color:var(--color-muted);line-height:1.6;margin-bottom:22px;">
                        Este script debe ejecutarse desde la <strong>ficha de un pueblo</strong>.<br>
                        Navega a la vista de información de un pueblo enemigo y vuelve a ejecutarlo.
                    </div>
                    <div style="font-size:11px;color:var(--color-muted);background:var(--bg-base);border-radius:6px;padding:8px 12px;font-family:monospace;">
                        screen=<strong style="color:var(--accent-gold);">info_village</strong> &nbsp;·&nbsp; screen actual: <strong style="color:#dc2626;">${getParameterByName('screen') || '(ninguna)'}</strong>
                    </div>
                </div>
                <!-- Footer -->
                <div style="padding:12px 18px;background:var(--bg-base);border-top:1px solid var(--color-border);display:flex;justify-content:flex-end;">
                    <button id="ra-wrong-screen-close" style="
                        padding:8px 20px;border:none;border-radius:6px;cursor:pointer;
                        font-size:12px;font-weight:700;color:#fff;font-family:inherit;
                        background:var(--accent-gold);box-shadow:0 4px 12px rgba(22,163,74,.3);
                        transition:all .15s;">
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    `);

    document.getElementById('ra-wrong-screen-close').addEventListener('click', () => {
        document.getElementById(id)?.remove();
    });
    document.getElementById(id).addEventListener('click', (e) => {
        if (e.target.id === id) document.getElementById(id)?.remove();
    });
}

// Initialize Script
(async function () {
    const gameScreen = getParameterByName('screen');
    if (gameScreen === 'info_village') {
        initAttackPlanner(GROUP_ID);
    } else {
        showWrongScreenError();
    }
})();

})(); // end outer IIFE