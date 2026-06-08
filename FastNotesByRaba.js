/*
// Especifica que acción hacer después de colocar la nota: "eliminar", "siguiente"
note_added = {
	mode: "eliminar"
}

// Especifica las algunas características dispones en el modo de "Eliminar Nota" y "Siguiente Nota".
// Estas opciones solo se activan cuando el modo "note_added" está seleccionado.
delete_options = {
	confirm_msg: true // Envía un mensaje de confirmación para eliminar.
}

next_options = {
	delay: {
		enable: true,
		cooldown: 1000, // Añade un tiempo de espera de 1 segundo antes de pasar a la siguiente.
	}
}

// Especifica el modo de empleo del script a la hora de guardar las notas: defensor, atacante, mixto.
// Las mayúsculas no son detectadas. Escribir correctamente.
village_options = {
	mode: 'mixto'
}

*/


/************************/

/*     Script Raba      */
/*    Versión 6.12     */

/************************/


var scriptData = {
	name: 'Fast Notes',
	version: 'v6.12',
	editor: 'Rabagalan73',
	author: 'Rabagalan73',
	authorUrl: '',
	helpLink: '',
};

// Revisar error si es un informe pero no es un informe de ataque.

if (typeof DEBUG !== 'boolean') DEBUG = false;

var allowedScreens = ['report', 'info_command'];

var translations = {
    es_ES: {
		Title: 'Establece notas rápidas',
		Help: 'Ayuda',
		Added: 'Has añadido la nota correctamente.',
		CantAdded: 'No puedes agregar este informe a una nota rápida.',
		CantInspect: 'No se puede analizar las tropas porque no has detectado ninguna.',
		ComingSoon: 'Imposible agregar... Próximamente ^^',
		OwnVillage: 'No puedes agregar este informe a la nota del pueblo porque el pueblo te pertenece.',
		Link: 'Enlace al Informe',
		BadUsage: 'Este script se ejecuta desde un informe de ataque o defensa.',
		AlertMessage: 'Especificar y analizar al %attacker% o %defender%',
		NoNotes: 'No se ha encontrado ninguna nota para este pueblo.',
	    NeedPremium: 'Para ejecutar este Script necesitas una cuenta Premium.',
        NotDefensor: 'No se puede analizar las tropas del defensor porque no existen o no se ven.',
        NotAtacante: 'No se puede analizar las tropas del atacante porque no existen o no se ven.',
		FetchError: 'Error al obtener datos del pueblo. Inténtalo de nuevo.',
		AutoAttacker: 'Pueblo defensor detectado ya que eres el atacante.',
		AutoDefender: 'Pueblo atacante detectado ya que eres el defensor.',
		ModeDefensor: 'Modo único de pueblo defensor.',
		ModeAtacante: 'Modo único de pueblo atacante.',
		SelectedAtt: 'Pueblo atacante seleccionado.',
		SelectedDef: 'Pueblo defensor seleccionado.',
        deff: "[color=#0d7377][b]Posible Defensivo[/b][/color]",
		deff_blindado: '[color=#0a5559][b]Posible Defensivo Blindado[/b][/color]',
        off: '[color=#8b1a1a][b]Posible Ofensivo[/b][/color]',
		off_blindado: '[color=#6b0f0f][b]Posible Ofensivo Blindado[/b][/color]',
		spy: '[color=#2a2a5a][b]Pueblo con Espías[/b][/color]',
		deff_chance: '[color=#1a4f4f][b]Alta Probabilidad de Defensivo[/b][/color]',
        mixto: '[color=#3d6b35][b]Posible Mixto o Apoyos[/b][/color]',
        unknown: '[color=#5a3d6b][b]No Determinado[/b][/color]',
		barbarian: '[color=#4a4a4a][b]Pueblo Abandonado[/b][/color]',
        empty: '[color=#4a4a4a][b]Pueblo Vacío[/b][/color]',
		note: {
            player: "•[b] Jugador ➢[/b] [player]%player%[/player]",
            village: "•[b] Pueblo ➢[/b] %type%",
			points: "•[b] Puntos ➢[/b] %points%",
            features: "[b][color=#2e2eb9] ★ [u]Características[/u] ★[/color][/b]",
			time: "•[b] Hora de batalla ➢[/b] [color=#0000ff][b]%time%[/b][/color]",
            militia: "[color=#00a500][b]✔[/b][/color] %amount% Milicia [unit]militia[/unit]",
            wall: {
                yes: "[color=#00a500][b]✔[/b][/color] Nivel %level% de Muralla [building]wall[/building]",
                no: "[color=#ff0000][b]✘[/b][/color] Sin Muralla [building]wall[/building]"
            },
			iglesia: {
				yes: "[color=#00a500][b]✔[/b][/color] Iglesia lvl.%level%  [building]church_f[/building]",
				no: "[color=#ff0000][b]✘[/b][/color] Sin Iglesia [building]church_f[/building]"
			},
			torre: {
				yes: "[color=#00a500][b]✔[/b][/color] Torre lvl.%level% [building]watchtower[/building]",
				no: "[color=#ff0000][b]✘[/b][/color] Sin Torre [building]watchtower[/building]"
			},
            knight: "[color=#00a500][b]✔[/b][/color] Paladín [unit]knight[/unit]",
			snob: "[color=#00a500][b]✔[/b][/color] Noble [unit]snob[/unit]",
			knightsnob: "[color=#00a500][b]✔[/b][/color] Noble + Paladín [unit]knight[/unit][unit]snob[/unit]"
        },
	},
};

// ── Pesos de ataque y defensa (valores medios entre los tres tipos de defensa) ──
var UNIT_ATK = {
	spear: 0,   sword: 0,   axe: 45,  archer: 0,
	light_cavalry: 130, archer_cavalry: 120, heavy_cavalry: 0,   knight: 150,
	ram: 0, catapult: 0
};
var UNIT_DEF = {
	spear: 27,  sword: 38,  axe: 0,   archer: 35,
	light_cavalry: 0,   archer_cavalry: 0,   heavy_cavalry: 155, knight: 280,
	ram: 0, catapult: 0
};
// Coste de población por unidad
var UNIT_FARM = {
	spear: 1, sword: 1, axe: 1, archer: 1, spy: 2,
	light_cavalry: 4, archer_cavalry: 5, heavy_cavalry: 6,
	ram: 5, catapult: 8, snob: 100, knight: 10, militia: 0
};

var FARM_VILLAGE          = 24000; // Granja máxima de un pueblo estándar
var OFF_WITH_SUPPORTS_THRESHOLD = 1500; // Granja mínima en tropas off para clasificar como off cuando hay apoyos (~350 ligeras)

var UNIT_TEMPLATE = {
	spear: 0, sword: 0, axe: 0, archer: 0,
	spy: 0, light_cavalry: 0, archer_cavalry: 0, heavy_cavalry: 0,
	ram: 0, catapult: 0,
	snob: 0, knight: 0, militia: 0
};

var BUILDING_TEMPLATE = {
	build: false,
	level: 0
};

var DEFAULT_CONFIG = {
	postAction: { type: 'eliminar', confirmDelete: false, delayNext: 200 },
	villageMode: 'mixto'
};

var win = window;
win.FastNotes = {
	table: null,
	villageDOM: null,
	units: Object.assign({}, UNIT_TEMPLATE, { snob_alive: false, knight_alive: false, militia_alive: false }),
	spy_units: Object.assign({}, UNIT_TEMPLATE),
	wall: Object.assign({}, BUILDING_TEMPLATE),
	iglesia: Object.assign({}, BUILDING_TEMPLATE),
	torre: Object.assign({}, BUILDING_TEMPLATE)
};


//////////////////////////////////
//          MAIN CODE           //
//////////////////////////////////

// Checks if scripts is running without bugs!
initDebug();

// Resets all FastNotes state so re-running the script never carries over values from a previous report.
function resetFastNotes() {
	win.FastNotes.table = null;
	win.FastNotes.units = Object.assign({}, UNIT_TEMPLATE, { snob_alive: false, knight_alive: false, militia_alive: false });
	win.FastNotes.spy_units = Object.assign({}, UNIT_TEMPLATE);
	win.FastNotes.wall = Object.assign({}, BUILDING_TEMPLATE);
	win.FastNotes.iglesia = Object.assign({}, BUILDING_TEMPLATE);
	win.FastNotes.torre = Object.assign({}, BUILDING_TEMPLATE);
}

// ── Helpers de clasificación ──────────────────────────────────────────────────

function tableExists(selector) {
	return $(selector)[0] !== undefined;
}

// ── Configuration System ──────────────────────────────────────────────────

function getStorageKey(key) {
	return 'fnConfig_' + key;
}

function loadConfig(key, defaultValue) {
	try {
		const stored = localStorage.getItem(getStorageKey(key));
		return stored ? JSON.parse(stored) : defaultValue;
	} catch (e) {
		return defaultValue;
	}
}

function saveConfig(key, value) {
	try {
		localStorage.setItem(getStorageKey(key), JSON.stringify(value));
		return true;
	} catch (e) {
		console.error('Error saving config:', e);
		return false;
	}
}

function getConfig(key, defaultValue) {
	return loadConfig(key, defaultValue);
}

// ──────────────────────────────────────────────────────────────────────────

function calcPower(units) {
	var atk = 0, def = 0;
	for (var u in UNIT_ATK) {
		atk += (units[u] || 0) * UNIT_ATK[u];
		def += (units[u] || 0) * UNIT_DEF[u];
	}
	return { atk: atk, def: def, ratio: (atk + def) > 0 ? atk / (atk + def) : -1 };
}

function calcFarm(units) {
	var total = 0;
	for (var u in UNIT_FARM) total += (units[u] || 0) * UNIT_FARM[u];
	return total;
}

function hasSpyData() {
	var sp = win.FastNotes.spy_units;
	return (sp.spear + sp.sword + sp.axe + sp.archer +
		sp.light_cavalry + sp.archer_cavalry + sp.heavy_cavalry + sp.knight) > 0;
}

function classifyByRatio(ratio) {
	if (ratio < 0)    return 'unknown';
	if (ratio > 0.70) return 'off';
	if (ratio < 0.30) return 'deff';
	return 'unknown';
}

function getBlindajeLevel(farm) {
	if (farm <= 0)                    return null;
	if (farm < FARM_VILLAGE * 0.25)   return 'minimo';
	if (farm < FARM_VILLAGE)          return 'escaso';
	if (farm < FARM_VILLAGE * 2)      return 'ligero';
	if (farm < FARM_VILLAGE * 3)      return 'medio';
	if (farm < FARM_VILLAGE * 5)      return 'blindado';
	return 'muy_blindado';
}

function buildBlindajeBar(level) {
	var levels = {
		minimo:       { bar: '█░░░░░░░░', color: '#7799bb', label: 'MÍNIMO'       },
		escaso:       { bar: '██░░░░░░░', color: '#5599cc', label: 'ESCASO'       },
		ligero:       { bar: '███░░░░░░', color: '#4488ff', label: 'LIGERO'       },
		medio:        { bar: '█████░░░░', color: '#ffaa00', label: 'MEDIO'        },
		blindado:     { bar: '███████░░', color: '#ff5500', label: 'BLINDADO'     },
		muy_blindado: { bar: '█████████', color: '#cc0000', label: 'MUY BLINDADO' }
	};
	var b = levels[level];
	if (!b) return '';
	return '[color=' + b.color + '][b]' + b.bar + '  ' + b.label + '[/b][/color]';
}

// ─────────────────────────────────────────────────────────────────────────────

// Start script and run operations.
function initSetVillageNote() {

	resetFastNotes();

	const tableAtt = $('table#attack_info_att')[0];
	const tableDef = $('table#attack_info_def')[0];

	if (tableAtt === undefined && tableDef === undefined) {
		fnErrorToast();
		return;
	}

	const atackkerPlName = tableAtt.rows[0].cells[1].textContent;
	const defenderPlName = tableDef.rows[0].cells[1].textContent;
	const myName = game_data.player.name;

	if (myName === atackkerPlName && myName === defenderPlName) {
		UI.ErrorMessage(tt('OwnVillage'), 2000);
		return;
	}

	if (myName === atackkerPlName) {
		spyValues();
		getInfo();
		inspectVillage(tableDef, tt('AutoAttacker'), 'def');
		return;
	}
	if (myName === defenderPlName) {
		inspectVillage(tableAtt, tt('AutoDefender'), 'att');
		return;
	}

	// If you aren't attacker or defender... Check configuration mode
	var villageMode = getConfig('villageMode', DEFAULT_CONFIG.villageMode).toLowerCase();
	if (villageMode === "mixto") {
		sendAlertMess();
	} else if (villageMode === "defensor") {
		spyValues();
		getInfo();
		inspectVillage(tableDef, tt('ModeDefensor'), 'def');
	} else if (villageMode === "atacante") {
		inspectVillage(tableAtt, tt('ModeAtacante'), 'att');
	} else {
		sendAlertMess();
	}
}


// Create and inject modal styles (only once)
function injectConfigModalStyles() {
	if ($('#fn-config-modal-css').length) return;
	$('head').append(`<style id="fn-config-modal-css">
		#fn-config-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.55); z-index: 99999; display: flex; align-items: center; justify-content: center; }
		#fn-config-box { background: #fdf8f0; border-radius: 12px; box-shadow: 0 12px 40px rgba(0,0,0,0.45); border: 1.5px solid #c8b89a; overflow: hidden; width: 480px; font-family: 'Segoe UI', Tahoma, sans-serif; animation: fnFadeIn 0.18s ease; }
		@keyframes fnFadeIn { from { opacity:0; transform:scale(0.93); } to { opacity:1; transform:scale(1); } }
		#fn-config-box .fn-config-head { background: linear-gradient(135deg, #5a3a28 0%, #3b2010 50%, #1e0f06 100%); padding: 16px 18px; display: flex; align-items: center; justify-content: space-between; box-shadow: inset 0 -1px 0 rgba(255,255,255,0.07); position: relative; }
		#fn-config-box .fn-config-head::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #c8a96e 30%, #e8c97e 50%, #c8a96e 70%, transparent); }
		#fn-config-box .fn-config-title { font-size: 15px; font-weight: 900; color: #f5e6c8; letter-spacing: 0.5px; }
		#fn-config-box .fn-config-close { background: rgba(255,255,255,0.12); border: none; cursor: pointer; width: 26px; height: 26px; border-radius: 6px; font-size: 13px; font-weight: 900; color: #f5e6c8; display: flex; align-items: center; justify-content: center; transition: background 0.15s; z-index: 1; }
		#fn-config-box .fn-config-close:hover { background: rgba(200,50,50,0.5); }
		#fn-config-box .fn-config-body { padding: 22px 18px; }
		.fn-config-group { margin-bottom: 20px; }
		.fn-config-group:last-child { margin-bottom: 0; }
		.fn-config-group label { display: block; font-size: 12px; font-weight: 800; color: #2e1f14; margin-bottom: 8px; }
		.fn-config-group select { width: 100%; padding: 10px; border: 1px solid #c8b89a; border-radius: 6px; font-size: 12px; font-family: inherit; background: #fff; color: #333; }
		.fn-config-group select:focus { outline: none; border-color: #8b5a3c; box-shadow: 0 0 0 2px rgba(139,90,60,0.1); }
		.fn-config-checkbox-group { display: flex; align-items: center; gap: 8px; }
		.fn-config-checkbox-group input[type="checkbox"] { width: 16px; height: 16px; cursor: pointer; }
		.fn-config-checkbox-group label { margin: 0; font-size: 12px; cursor: pointer; }
		.fn-delay-buttons { display: flex; gap: 8px; }
		.fn-delay-btn { flex: 1; padding: 10px; border: 2px solid #c8b89a; background: #fff; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 800; color: #2e1f14; transition: all 0.15s; }
		.fn-delay-btn:hover { border-color: #8b5a3c; background: #f5e6c8; }
		.fn-delay-btn.active { background: #4caf50; color: #fff; border-color: #4caf50; }
		#fn-config-box .fn-config-footer { background: #f0e8d8; border-top: 1px solid #d8c9a8; padding: 12px 18px; display: flex; gap: 8px; justify-content: flex-end; }
		.fn-config-btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 800; transition: all 0.15s; }
		.fn-config-save { background: #4caf50; color: #fff; }
		.fn-config-save:hover { background: #45a049; transform: translateY(-1px); }
		.fn-config-cancel { background: #ccc; color: #333; }
		.fn-config-cancel:hover { background: #bbb; }
	</style>`);
}

function injectModalStyles() {
	if ($('#fn-modal-css').length) return;
	$('head').append(`<style id="fn-modal-css">
		#fn-select-modal {
			position: fixed; top: 0; left: 0; width: 100%; height: 100%;
			background: rgba(0,0,0,0.55); z-index: 99998;
			display: flex; align-items: center; justify-content: center;
		}
		#fn-select-box {
			background: #fdf8f0;
			border-radius: 12px;
			box-shadow: 0 12px 40px rgba(0,0,0,0.45);
			border: 1.5px solid #c8b89a;
			overflow: hidden;
			width: 400px;
			font-family: 'Segoe UI', Tahoma, sans-serif;
			animation: fnFadeIn 0.18s ease;
		}
		@keyframes fnFadeIn { from { opacity:0; transform:scale(0.93); } to { opacity:1; transform:scale(1); } }
		#fn-select-box .fn-modal-head {
			background: linear-gradient(135deg, #5a3a28 0%, #3b2010 50%, #1e0f06 100%);
			padding: 16px 18px 14px;
			display: flex; align-items: flex-start; justify-content: space-between;
			position: relative;
			box-shadow: inset 0 -1px 0 rgba(255,255,255,0.07);
		}
		#fn-select-box .fn-modal-head::after {
			content: '';
			position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
			background: linear-gradient(90deg, transparent, #c8a96e 30%, #e8c97e 50%, #c8a96e 70%, transparent);
		}
		#fn-select-box .fn-modal-head-title {
			font-size: 15px; font-weight: 900; color: #f5e6c8; letter-spacing: 0.5px;
			line-height: 1.2;
		}
		#fn-select-box .fn-modal-head-subtitle {
			font-size: 9px; color: rgba(200,169,110,0.75); letter-spacing: 1.2px;
			text-transform: uppercase; font-weight: 600; margin-top: 3px;
		}
		#fn-select-box .fn-modal-head-close {
			background: rgba(255,255,255,0.12); border: none; cursor: pointer;
			width: 26px; height: 26px; border-radius: 6px;
			font-size: 13px; font-weight: 900; color: #f5e6c8;
			display: flex; align-items: center; justify-content: center;
			transition: background 0.15s;
		}
		#fn-select-box .fn-modal-head-close:hover { background: rgba(200,50,50,0.5); }
		#fn-select-box .fn-modal-body {
			padding: 20px 18px;
		}
		#fn-select-box .fn-modal-desc {
			font-size: 12px; color: #5a3e2b; text-align: center;
			margin-bottom: 18px; line-height: 1.6;
		}
		#fn-select-box .fn-modal-desc strong { color: #2e1f14; }
		#fn-select-box .fn-modal-btns {
			display: flex; gap: 10px; justify-content: center;
		}
		#fn-select-box .fn-btn {
			flex: 0 0 auto; padding: 9px 20px; border: none; border-radius: 7px;
			cursor: pointer; font-family: 'Segoe UI', Tahoma, sans-serif;
			font-size: 12px; font-weight: 800; letter-spacing: 0.3px;
			transition: all 0.15s; display: flex; flex-direction: row; white-space: nowrap;
			align-items: center; justify-content: center; gap: 7px;
		}
		#fn-select-box .fn-btn-att {
			background: linear-gradient(135deg, #c62828 0%, #8b0000 100%);
			color: #fff;
			box-shadow: 0 3px 12px rgba(139,0,0,0.4);
		}
		#fn-select-box .fn-btn-att:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(139,0,0,0.5); }
		#fn-select-box .fn-btn-def {
			background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
			color: #fff;
			box-shadow: 0 3px 12px rgba(13,71,161,0.4);
		}
		#fn-select-box .fn-btn-def:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(13,71,161,0.5); }
		#fn-select-box .fn-btn-icon { font-size: 14px; line-height: 1; }
		#fn-select-box .fn-modal-footer {
			background: #f0e8d8; border-top: 1px solid #d8c9a8;
			padding: 7px 18px; font-size: 10px; color: #8b7355; text-align: center;
		}
	</style>`);
}

// Show comparison modal for note merge decision
function showComparisonModal(compData) {
	$('#fn-comparison-modal').remove();
	injectComparisonModalStyles();

	$('body').append(`
	<div id="fn-comparison-modal">
		<div id="fn-comparison-box">
			<div class="fn-comp-head">
				<div class="fn-comp-head-info">
					<div class="fn-comp-head-title">⚔️ Conflicto de Notas</div>
					<div class="fn-comp-head-subtitle">${compData.playerName} · Ya existe una nota para este pueblo</div>
				</div>
				<button class="fn-comp-close" onclick="$('#fn-comparison-modal').remove()">✕</button>
			</div>
			<div class="fn-comp-content">
				<div class="fn-comp-panel">
					<div class="fn-comp-panel-header fn-comp-panel-header-new">✨ NOTA NUEVA</div>
					<div class="fn-comp-panel-content" id="fn-comp-new"></div>
				</div>
				<div class="fn-comp-panel">
					<div class="fn-comp-panel-header fn-comp-panel-header-old">📋 NOTA ANTERIOR</div>
					<div class="fn-comp-panel-content" id="fn-comp-old"></div>
				</div>
			</div>
			<div class="fn-comp-footer">
				<button class="fn-comp-btn fn-comp-btn-close" onclick="$('#fn-comparison-modal').remove()">
					<span class="fn-comp-btn-icon">✕</span>
					<span>Cancelar</span>
				</button>
				<button class="fn-comp-btn fn-comp-btn-keep" onclick="handleComparisonAction('keep', '${compData.villageId}')">
					<span class="fn-comp-btn-icon">🔒</span>
					<span>Conservar Anterior</span>
				</button>
				<button class="fn-comp-btn fn-comp-btn-merge" onclick="handleComparisonAction('merge', '${compData.villageId}', true)">
					<span class="fn-comp-btn-icon">🔀</span>
					<span>Fusionar</span>
				</button>
				<button class="fn-comp-btn fn-comp-btn-overwrite" onclick="handleComparisonAction('overwrite', '${compData.villageId}')">
					<span class="fn-comp-btn-icon">⚡</span>
					<span>Sobreescribir</span>
				</button>
			</div>
		</div>
	</div>`);

	// Renderizar la nota nueva de forma independiente (sin usar HTML de la nota antigua)
	const newRendered = renderBBCode(compData.newNote.fullText, null);
	const oldContent = compData.oldNote.fullText;

	$('#fn-comp-new').html(newRendered);

	// Inyectar el informe actual via DOM (evita problemas de parseo de HTML complejo como string)
	var injectTarget = document.querySelector('#fn-comp-new .fn-new-report-inject');
	if (injectTarget) {
		var details = document.createElement('details');
		details.className = 'fn-comp-report-spoiler';
		var summary = document.createElement('summary');
		summary.textContent = '📋 Ver Informe';
		var body = document.createElement('div');
		body.className = 'fn-comp-report-body';

		// Todo el informe está en td.report_ReportAttack
		var reportCell = document.querySelector('td.report_ReportAttack');
		if (reportCell) {
			var clone = reportCell.cloneNode(true);
			// Eliminar height forzado que genera espacio en blanco
			clone.removeAttribute('height');
			clone.style.height = 'auto';
			// Quitar los enlaces del simulador
			var noPreview = clone.querySelector('.no-preview');
			if (noPreview) noPreview.remove();

			// Insertar hora de envío al principio del recuadro
			var allVisRows = document.querySelectorAll('table.vis > tbody > tr, table.vis > tr');
			var sentTime = '';
			allVisRows.forEach(function(row) {
				if (row.cells[0] && row.cells[0].textContent.trim() === 'Hora de envío') {
					sentTime = row.cells[1] ? row.cells[1].textContent.trim() : '';
				}
			});
			if (sentTime) {
				var timeEl = document.createElement('div');
				timeEl.style.cssText = 'font-size:11px;color:#666;margin-bottom:4px;';
				timeEl.textContent = 'Enviado: ' + sentTime;
				clone.insertBefore(timeEl, clone.firstChild);
			}

			body.appendChild(clone);
		}

		details.appendChild(summary);
		details.appendChild(body);
		injectTarget.replaceWith(details);
	}

	// Mostrar la nota anterior tal como está almacenada
	if (oldContent.includes('<')) {
		$('#fn-comp-old').html(oldContent);
	} else {
		$('#fn-comp-old').text(oldContent);
	}

	// Normalizar spoilers del panel derecho para que usen el mismo diseño que el izquierdo
	$('#fn-comp-old .spoiler').each(function() {
		var inputBtn = $(this).find('input[type=button]').first();
		var label = inputBtn.val() || 'Ver Informe';
		var contentDiv = $(this).children('div').first();
		var details = document.createElement('details');
		details.className = 'fn-comp-report-spoiler';
		var sum = document.createElement('summary');
		sum.textContent = '📋 ' + label;
		var bdy = document.createElement('div');
		bdy.className = 'fn-comp-report-body';
		bdy.innerHTML = contentDiv.html() || '';
		details.appendChild(sum);
		details.appendChild(bdy);
		$(this).replaceWith(details);
	});
	// También normalizar <details> nativos de TW si los hubiera
	$('#fn-comp-old details:not(.fn-comp-report-spoiler)').each(function() {
		$(this).addClass('fn-comp-report-spoiler');
		$(this).find('summary').addClass('fn-comp-report-summary');
	});

	// Store comparison data globally for button handlers
	window.fnCurrentComparison = compData;
}

function handleComparisonAction(action, villageId, isMerge = false) {
	var comp = window.fnCurrentComparison;
	if (!comp) return;

	$('#fn-comparison-modal').remove();

	if (action === 'overwrite') {
		postNote(comp.newNote.fullText, comp.autodetected, comp.villageId);
	} else if (action === 'keep') {
		fnToast('Nota anterior conservada', '');
	} else if (action === 'merge') {
		var mergedNote = mergeNotes(comp.newNote.fullText, comp.oldNote.fullText);
		postNote(mergedNote, comp.autodetected, comp.villageId);
	}

	window.fnCurrentComparison = null;
}

// Show configuration modal
function showConfigModal() {
	$('#fn-config-modal').remove();
	injectConfigModalStyles();

	var postConfig = getConfig('postAction', DEFAULT_CONFIG.postAction);
	var villageMode = getConfig('villageMode', DEFAULT_CONFIG.villageMode);

	$('body').append(`
	<div id="fn-config-modal">
		<div id="fn-config-box">
			<div class="fn-config-head">
				<div class="fn-config-title">⚙️ Configuración de Fast Notes</div>
				<button class="fn-config-close" onclick="$('#fn-config-modal').remove()">✕</button>
			</div>
			<div class="fn-config-body">
				<div class="fn-config-group">
					<label>Acción después de agregar nota</label>
					<select id="fn-cfg-post-action">
						<option value="nada" ${postConfig.type === 'nada' ? 'selected' : ''}>No hacer nada</option>
						<option value="eliminar" ${postConfig.type === 'eliminar' ? 'selected' : ''}>Eliminar informe</option>
						<option value="siguiente" ${postConfig.type === 'siguiente' ? 'selected' : ''}>Ir al siguiente informe</option>
						<option value="archivar" ${postConfig.type === 'archivar' ? 'selected' : ''}>Archivar informe</option>
					</select>
				</div>

				<div class="fn-config-group">
					<div class="fn-config-checkbox-group">
						<input type="checkbox" id="fn-cfg-confirm-delete" ${postConfig.confirmDelete ? 'checked' : ''}>
						<label for="fn-cfg-confirm-delete">Pedir confirmación al eliminar</label>
					</div>
				</div>

				<div class="fn-config-group">
					<label>Tiempo de espera antes de ir al siguiente</label>
					<div class="fn-delay-buttons">
						<button type="button" class="fn-delay-btn ${postConfig.delayNext === 0 ? 'active' : ''}" onclick="selectDelay(0, event)">Sin espera</button>
						<button type="button" class="fn-delay-btn ${postConfig.delayNext === 200 ? 'active' : ''}" onclick="selectDelay(200, event)">200 ms</button>
						<button type="button" class="fn-delay-btn ${postConfig.delayNext === 600 ? 'active' : ''}" onclick="selectDelay(600, event)">600 ms</button>
					</div>
					<input type="hidden" id="fn-cfg-delay" value="${postConfig.delayNext || 200}">
				</div>

				<div class="fn-config-group">
					<label>Modo de pueblo (cuando no eres atacante ni defensor)</label>
					<select id="fn-cfg-village-mode">
						<option value="mixto" ${villageMode === 'mixto' ? 'selected' : ''}>Mixto (preguntar cada vez)</option>
						<option value="defensor" ${villageMode === 'defensor' ? 'selected' : ''}>Siempre defensor</option>
						<option value="atacante" ${villageMode === 'atacante' ? 'selected' : ''}>Siempre atacante</option>
					</select>
				</div>
			</div>
			<div class="fn-config-footer">
				<button class="fn-config-btn fn-config-cancel" onclick="$('#fn-config-modal').remove()">Cancelar</button>
				<button class="fn-config-btn fn-config-save" onclick="saveAndCloseConfig()">Guardar</button>
			</div>
		</div>
	</div>`);
}

function selectDelay(ms, event) {
	event.preventDefault();
	$('#fn-cfg-delay').val(ms);
	$('.fn-delay-btn').removeClass('active');
	$(event.target).addClass('active');
}

function saveAndCloseConfig() {
	var postAction = document.getElementById('fn-cfg-post-action').value;
	var confirmDelete = document.getElementById('fn-cfg-confirm-delete').checked;
	var delayNext = parseInt(document.getElementById('fn-cfg-delay').value) || 200;
	var villageMode = document.getElementById('fn-cfg-village-mode').value;

	saveConfig('postAction', {
		type: postAction,
		confirmDelete: confirmDelete,
		delayNext: delayNext
	});
	saveConfig('villageMode', villageMode);

	$('#fn-config-modal').remove();
	fnToast('Configuración guardada', '');
}

// Display an alert message to select where the note will be stored: 'Defender Player Village' or 'Attacker Player Village'!
// This alert will be displayed when you are neither the attacker nor the defender player.
function sendAlertMess() {
	$('#fn-select-modal').remove();
	injectModalStyles();

	$('body').append(`
	<div id="fn-select-modal">
		<div id="fn-select-box">
			<div class="fn-modal-head">
				<div>
					<div class="fn-modal-head-title">⚔️ Fast Notes</div>
					<div class="fn-modal-head-subtitle">Selección de pueblo objetivo</div>
				</div>
				<div style="display:flex;gap:8px;align-items:center;">
					<button class="fn-modal-head-close" onclick="showConfigModal()" style="background: rgba(100,150,200,0.3);" title="Configuración">⚙️</button>
					<button class="fn-modal-head-close" onclick="$('#fn-select-modal').remove()">✕</button>
				</div>
			</div>
			<div class="fn-modal-body">
				<div class="fn-modal-desc">
					Eres un observador externo en este informe y no figuras ni como atacante ni como defensor.<br><br>
					El análisis se guardará en las notas del pueblo que elijas.<br>
					<strong>¿A qué pueblo deseas añadir el análisis?</strong>
				</div>
				<div class="fn-modal-btns">
					<button class="fn-btn fn-btn-att" onclick="$('#fn-select-modal').remove();inspectVillage('att')">
						<span class="fn-btn-icon">⚔️</span>
						Pueblo Atacante
					</button>
					<button class="fn-btn fn-btn-def" onclick="$('#fn-select-modal').remove();inspectVillage('def')">
						<span class="fn-btn-icon">🛡️</span>
						Pueblo Defensor
					</button>
				</div>
			</div>
			<div class="fn-modal-footer">💖 Fast Notes ${scriptData.version} · by ${scriptData.author}</div>
		</div>
	</div>`);
}

// Player Village Inspector
async function inspectVillage(table, autodetected, villageRole) {

	if (table === undefined) { UI.ErrorMessage(tt('CantInspect'), 2000); return; }

	if (table === 'att') { table = $('table#attack_info_att')[0]; autodetected = tt('SelectedAtt'); villageRole = 'att'; }
	if (table === 'def') {
		table = $('table#attack_info_def')[0]; autodetected = tt('SelectedDef');
		getInfo();
		spyValues();
		villageRole = 'def';
	}

	win.FastNotes.table = table;
	var villageId = table.rows[1].cells[1].getElementsByTagName('span')[0].getAttribute('data-id');

	var isBarbarian = table.rows[0].cells[1].textContent.trim() === '---';
	var playerName, playerUrl;
	if (isBarbarian) {
		playerName = tt('barbarian').replace(/\[.*?\]/g, '');
		playerUrl = null;
	} else {
		var playerAnchor = table.rows[0].cells[1].getElementsByTagName('a')[0];
		playerName = playerAnchor.textContent.trim();
		playerUrl = playerAnchor.href;
	}

	var target_village = table.querySelectorAll('.village_anchor');
	var villagePageUrl = target_village[0].getElementsByTagName('a')[0].href;

	// Fetch village page and player profile in parallel
	var fetches = await Promise.all([
		getSourceAsDOM(villagePageUrl),
		playerUrl ? getPlayerInfo(playerUrl) : Promise.resolve({ tribe: '', totalPoints: '', villages: '' })
	]);
	var dom_target_village = fetches[0];
	var playerInfo = fetches[1];

	// Guardar el DOM para acceso posterior en createNote()
	win.FastNotes.villageDOM = dom_target_village;

	if (dom_target_village === null) return;
	var content_value = dom_target_village.getElementById("content_value");
	var points = content_value.getElementsByTagName('table')[1].getElementsByTagName('td')[4].textContent.trim();

	// In the case of not seeing any units / troops
	if (table.rows[2].getElementsByTagName('table')[0] == undefined) {
		await createNote(playerName, 'unknown', points, autodetected, villageId, { blindaje: null, offInDef: false, spyUsed: false, inVillFarm: 0, villageRole: villageRole, playerInfo: playerInfo }, dom_target_village);
		return;
	}
	var units = table.rows[2].getElementsByTagName('table')[0];
	getValues(units);

	await calc(playerName, points, autodetected, villageId, villageRole, playerInfo);
}

//////////////////////////////////
//          CALCULATORS         //
//////////////////////////////////

// Safe parseInt: returns 0 instead of NaN when the element is missing or its text is not a number.
function safeInt(el, className) {
	try {
		const val = parseInt(el.getElementsByClassName(className)[0].textContent, 10);
		return isNaN(val) ? 0 : val;
	} catch(ex) { return 0; }
}

// Extract units from a row, optionally checking losses
function extractUnits(row, lostRow = null) {
	return {
		spear: safeInt(row, "unit-item-spear"),
		sword: safeInt(row, "unit-item-sword"),
		axe: safeInt(row, "unit-item-axe"),
		archer: safeInt(row, "unit-item-archer"),
		spy: safeInt(row, "unit-item-spy"),
		light_cavalry: safeInt(row, "unit-item-light"),
		archer_cavalry: safeInt(row, "unit-item-marcher"),
		heavy_cavalry: safeInt(row, "unit-item-heavy"),
		ram: safeInt(row, "unit-item-ram"),
		catapult: safeInt(row, "unit-item-catapult"),
		snob: safeInt(row, "unit-item-snob"),
		knight: safeInt(row, "unit-item-knight"),
		militia: safeInt(row, "unit-item-militia")
	};
}

// Get unit values from the report table
function getValues(units) {
	const row = units.rows[1];
	const lost = units.rows[2];
	const extracted = extractUnits(row, lost);

	Object.assign(win.FastNotes.units, extracted);

	if (extracted.snob - safeInt(lost, "unit-item-snob") > 0) win.FastNotes.units.snob_alive = true;
	if (extracted.knight - safeInt(lost, "unit-item-knight") > 0) win.FastNotes.units.knight_alive = true;
	if (extracted.militia - safeInt(lost, "unit-item-militia") > 0) win.FastNotes.units.militia_alive = true;

	if (DEBUG && extracted.archer === 0 && extracted.archer_cavalry === 0) console.debug("This world don't have archers!");
	if (DEBUG && extracted.knight === 0) console.debug("This world don't have knight!");
}

function builds(table) {
	const buildingMap = {
		'Muralla': 'wall',
		'Iglesia': 'iglesia',
		'Torre': 'torre'
	};

	for (var i = 0, row; row = table.rows[i]; i++) {
		for (const [buildingName, buildingKey] of Object.entries(buildingMap)) {
			if (row.cells[0].textContent.includes(buildingName)) {
				win.FastNotes[buildingKey].level = parseInt(row.cells[1].textContent);
				win.FastNotes[buildingKey].build = true;
			}
		}
	}
}

function parseAndSetBuilding(text, cellIndex) {
	const buildingMap = {
		'Muralla': 'wall',
		'Iglesia': 'iglesia',
		'Torre': 'torre'
	};

	for (const [buildingName, buildingKey] of Object.entries(buildingMap)) {
		if (text.includes(buildingName)) {
			const split = text.replace(".", "").split(" ");
			win.FastNotes[buildingKey].level = parseInt(split[split.length - 1], 10);
			win.FastNotes[buildingKey].build = true;
			return;
		}
	}
}

function getInfo() {
	var atack_results_table = $('table#attack_results')[0];
	var buildings = $('table#attack_spy_buildings_left')[0];

	// Tabla donde aparece el daño por arietes / lealtad / etc.
	if (atack_results_table !== undefined) {
		for (var i = 0, row; row = atack_results_table.rows[i]; i++) {
			if (row.cells[0].textContent.includes("Daños por arietes")) win.FastNotes.wall.build = true;
		}
	}

	// Tabla donde aparecen los edificios. (Espionaje)
	if (buildings !== undefined) {
		var build_right = $('table#attack_spy_buildings_right')[0];
		builds(buildings);
		builds(build_right);
	} else if (atack_results_table !== undefined) {
		for (var i = 0, row; row = atack_results_table.rows[i]; i++) {
			if (row.cells[1] != null) {
				parseAndSetBuilding(row.cells[1].textContent, 1);
				parseAndSetBuilding(row.cells[0].textContent, 0);
			}
		}
	}
}

async function calc(playerName, points, autodetected, villageId, villageRole, playerInfo) {
	var fn = win.FastNotes;
	var typeVillage, blindaje = null, offInDef = false, spyUsed = false, inVillFarm = 0;

	// Pueblo vacío
	var totalUnits = fn.units.spear + fn.units.sword + fn.units.axe + fn.units.archer +
		fn.units.spy + fn.units.light_cavalry + fn.units.archer_cavalry + fn.units.heavy_cavalry +
		fn.units.ram + fn.units.catapult + fn.units.snob + fn.units.knight;
	if (totalUnits === 0 && !hasSpyData()) {
		// dom_target_village no está disponible en calc(), será null
		await createNote(playerName, 'empty', points, autodetected, villageId, { blindaje: null, offInDef: false, spyUsed: false, inVillFarm: 0, villageRole: villageRole }, null);
		return;
	}

	if (villageRole === 'att') {
		// Pueblo atacante: todas las tropas son suyas → clasificar por ratio de poder
		var power = calcPower(fn.units);
		typeVillage = classifyByRatio(power.ratio);

	} else {
		// Pueblo defensor
		inVillFarm = calcFarm(fn.units);
		blindaje = getBlindajeLevel(inVillFarm);

		var offFarm = (fn.units.axe || 0) * 1 + (fn.units.light_cavalry || 0) * 4 + (fn.units.archer_cavalry || 0) * 5;

		if (hasSpyData()) {
			// Espionaje disponible → máxima fiabilidad
			var spyPower = calcPower(fn.spy_units);
			typeVillage = classifyByRatio(spyPower.ratio);
			spyUsed = true;

		} else {
			// Sin espionaje: si hay off visible es del pueblo
			if (offFarm >= OFF_WITH_SUPPORTS_THRESHOLD) {
				typeVillage = 'off';
			} else {
				var power = calcPower(fn.units);
				typeVillage = classifyByRatio(power.ratio);
			}
		}
	}

	// Para pueblos ofensivos, recalcular inVillFarm sin las tropas off (que son del dueño, no defensa real)
	if (typeVillage === 'off' && villageRole === 'def') {
		var offOnlyFarm = (fn.units.axe          || 0) * UNIT_FARM.axe
		                + (fn.units.light_cavalry  || 0) * UNIT_FARM.light_cavalry
		                + (fn.units.archer_cavalry || 0) * UNIT_FARM.archer_cavalry
		                + (fn.units.ram            || 0) * UNIT_FARM.ram
		                + (fn.units.catapult       || 0) * UNIT_FARM.catapult;
		inVillFarm = Math.max(0, inVillFarm - offOnlyFarm);
		blindaje = getBlindajeLevel(inVillFarm);
	}

	if (DEBUG) {
		console.debug("VillageRole:", villageRole, "| Type:", typeVillage);
		console.debug("Blindaje:", blindaje, "| InVillFarm:", inVillFarm);
		console.debug("SpyUsed:", spyUsed, "| OffInDef:", offInDef);
	}

	await createNote(playerName, typeVillage, points, autodetected, villageId, {
		blindaje: blindaje, offInDef: offInDef, spyUsed: spyUsed,
		inVillFarm: inVillFarm, villageRole: villageRole, playerInfo: playerInfo
	}, null);
}

function spyValues() {
	if (DEBUG) console.debug("Spy Values");
	var units = $('table#attack_spy_away')[0];
	if (units !== undefined) {
		const row = units.rows[1].getElementsByTagName("table")[0].rows[1];
		const extracted = extractUnits(row);

		Object.assign(win.FastNotes.spy_units, extracted);

		if (extracted.snob > 0) win.FastNotes.units.snob_alive = true;
		if (extracted.knight > 0) {
			win.FastNotes.units.knight_alive = true;
			win.FastNotes.units.knight = 1;
		}
	}
}


//////////////////////////////////
//            NOTES             //
//////////////////////////////////

// Extract [spoiler]...[/spoiler] content from note
function extractSpoilerContent(noteText) {
	const regex = /\[spoiler=([^\]]*)\]([\s\S]*?)\[\/spoiler\]/g;
	const spoilers = [];
	let match;
	while ((match = regex.exec(noteText)) !== null) {
		spoilers.push({
			label: match[1],
			content: match[2]
		});
	}
	return spoilers;
}

// Parse analysis fields from note text
function parseAnalysisFields(noteText) {
	const fields = {
		player: '',
		type: '',
		points: '',
		blindaje: ''
	};

	// Extract player: [player]NAME[/player]
	const playerMatch = noteText.match(/\[player\](.*?)\[\/player\]/);
	if (playerMatch) fields.player = playerMatch[1].split('[')[0].trim();

	// Extract type: TIPO     ▸  [color...]TEXT[/color]
	const typeMatch = noteText.match(/TIPO\s+▸\s+([\s\S]*?)(?:\n|$)/);
	if (typeMatch) fields.type = typeMatch[1].replace(/\[.*?\]/g, '').trim();

	// Extract points: PUEBLO   ▸  ... [b]POINTS[/b] pts
	const pointsMatch = noteText.match(/PUEBLO\s+▸\s+.*?\[b\]([\d,\.]+)\[\/b\]\s*pts/);
	if (pointsMatch) fields.points = pointsMatch[1];

	// Extract blindaje level: BLINDAJE  ▸  [color...]█[/color]  LEVEL
	const blindajeMatch = noteText.match(/BLINDAJE\s+▸\s+(.*?)(?:\n|$)/);
	if (blindajeMatch) {
		const blindajeText = blindajeMatch[1].replace(/\[.*?\]/g, '').trim();
		fields.blindaje = blindajeText;
	}

	return fields;
}

// Render BBCode to HTML (simple renderer for display)
function renderBBCode(bbcode, existingNoteHtml = null) {
	let html = bbcode;

	console.log('[renderBBCode] Iniciando...');
	console.log('[renderBBCode] BBCode contiene [report_export]:', html.includes('[report_export]'));
	// Log de la sección alrededor del report_export
	const rIdx = html.indexOf('[report_export]');
	if (rIdx !== -1) console.log('[renderBBCode] BBCode alrededor de report_export:', JSON.stringify(html.substring(Math.max(0, rIdx - 30), rIdx + 30)));
	console.log('[renderBBCode] existingNoteHtml:', existingNoteHtml ? 'SÍ (' + existingNoteHtml.length + ' chars)' : 'NO');

	// PRIMERO: Reemplazar el bloque completo [spoiler=label][report_export]...[/report_export][/spoiler]
	html = html.replace(/\[spoiler=[^\]]*\]\s*\[report_export\][\s\S]*?\[\/report_export\]\s*\[\/spoiler\]/g, '___REPORT_PLACEHOLDER___');

	// También reemplazar [report_export] suelto
	html = html.replace(/\[report_export\][\s\S]*?\[\/report_export\]/g, '___REPORT_PLACEHOLDER___');

	// Quitar el [spoiler] sin label que queda envolviendo el placeholder
	html = html.replace(/\[spoiler\]([\s\S]*?)\[\/spoiler\]/gi, '$1');

	console.log('[renderBBCode] Después de reemplazar report_export, html contiene placeholder:', html.includes('___REPORT_PLACEHOLDER___'));

	// Procesar spoilers con parámetro [spoiler=label]
	html = html.replace(/\[spoiler=([^\]]*)\]([\s\S]*?)\[\/spoiler\]/gi, function(match, label, content) {
		// Escapar HTML en el contenido
		content = content
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/\n/g, '<br>');
		return '<details><summary>📋 ' + label + '</summary><div style="margin-top:8px; padding:8px; background:#f9f9f9; font-size:10px; word-break:break-all;">' + content + '</div></details>';
	});

	// DESPUÉS: Reemplazar el placeholder con el informe renderizado
	if (html.includes('___REPORT_PLACEHOLDER___') && existingNoteHtml) {
		console.log('[renderBBCode] Extrayendo informe de nota anterior...');

		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = existingNoteHtml;

		// Buscar <details>
		let detailsElements = tempDiv.querySelectorAll('details');
		console.log('[renderBBCode] <details> encontrados:', detailsElements.length);

		// Si no hay <details>, buscar div.spoiler
		if (detailsElements.length === 0) {
			console.log('[renderBBCode] No hay <details>, buscando div.spoiler...');
			detailsElements = tempDiv.querySelectorAll('div.spoiler');
			console.log('[renderBBCode] div.spoiler encontrados:', detailsElements.length);

			// Para div.spoiler, extraer contenido limpio
			if (detailsElements.length > 0) {
				console.log('[renderBBCode] Usando contenido de div.spoiler');
				const spoilerDiv = detailsElements[0];

				const children = Array.from(spoilerDiv.children);

				// Child 1 es el contenido (Child 0 es el INPUT toggle)
				let contentHtml = '';
				if (children.length >= 2) {
					const contentDiv = children[1].cloneNode(true);
					// El contenido está en un <span style="display:none"> - quitar ese estilo
					contentDiv.querySelectorAll('[style*="display"]').forEach(el => {
						el.style.display = '';
					});
					contentHtml = contentDiv.innerHTML;
				} else if (children.length === 1) {
					contentHtml = children[0].innerHTML;
				} else {
					contentHtml = spoilerDiv.innerHTML;
				}

				// Mostrar el informe directamente sin spoiler (estamos en el modal de comparación)
				// Clonar el spoiler y quitar display:none del contenido para que se vea igual que la nota anterior
				const spoilerClone = spoilerDiv.cloneNode(true);
				spoilerClone.querySelectorAll('[style*="display"]').forEach(el => { el.style.display = ''; });
				const reportHtml = spoilerClone.outerHTML;
				html = html.replace('___REPORT_PLACEHOLDER___', reportHtml);
				console.log('[renderBBCode] Reemplazo de spoiler completado');
			}
		} else {
			// Manejo de <details>
			for (let details of detailsElements) {
				const summary = details.querySelector('summary');
				if (summary && summary.textContent.includes('Ver Informe')) {
					console.log('[renderBBCode] ENCONTRADO spoiler Ver Informe, extrayendo...');
					const clone = details.cloneNode(true);
					const summaryToRemove = clone.querySelector('summary');
					if (summaryToRemove) summaryToRemove.remove();
					const reportHtml = '<details><summary>📋 Ver Informe</summary>' + clone.innerHTML + '</details>';
					html = html.replace('___REPORT_PLACEHOLDER___', reportHtml);
					console.log('[renderBBCode] Reemplazo completado');
					break;
				}
			}
		}
	}

	// Si el placeholder sigue ahí, insertar marcador para inyectar el informe via DOM después
	if (html.includes('___REPORT_PLACEHOLDER___')) {
		html = html.replace('___REPORT_PLACEHOLDER___', '<div class="fn-new-report-inject"></div>');
	}

	// Procesar tags de color
	html = html.replace(/\[color=#([a-f0-9]{6})\](.*?)\[\/color\]/gi, '<span style="color:#$1">$2</span>');

	// Procesar tags básicos
	html = html.replace(/\[b\](.*?)\[\/b\]/gi, '<b>$1</b>');
	html = html.replace(/\[u\](.*?)\[\/u\]/gi, '<u>$1</u>');
	html = html.replace(/\[i\](.*?)\[\/i\]/gi, '<i>$1</i>');

	// Procesar player links
	html = html.replace(/\[player\](.*?)\[\/player\]/gi, '<span style="color:#1e50a2"><b>$1</b></span>');

	// Procesar ally tags
	html = html.replace(/\[\[ally\](.*?)\[\/ally\]\]/gi, '<span style="color:#1e50a2">[$1]</span>');

	// Procesar saltos de línea
	html = html.replace(/\n/g, '<br>');

	return html;
}

// Extract note from village DOM (already loaded)
function extractNoteFromDOM(villageDOM) {
	if (!villageDOM) {
		console.log('[FastNotes] villageDOM es null');
		return null;
	}

	try {
		// Obtener el contenido HTML renderizado del .village-note-body
		const noteBodyEl = villageDOM.querySelector('#own_village_note .village-note-body');

		if (noteBodyEl) {
			const renderedHTML = noteBodyEl.innerHTML;
			if (renderedHTML && renderedHTML.trim().length > 0) {
				console.log('[FastNotes] Nota renderizada encontrada en DOM');
				return renderedHTML.trim();
			}
		}

		console.log('[FastNotes] No hay nota renderizada en el DOM');
		return null;
	} catch (e) {
		console.error('[FastNotes] Error en extractNoteFromDOM:', e);
		return null;
	}
}

// Fetch existing note from village page
async function fetchExistingNote(villageId) {
	try {
		const villageUrl = `/game.php?village=${villageId}&screen=info_village`;
		console.log('[FastNotes] Fetching note from:', villageUrl);

		const response = await fetch(villageUrl, { credentials: 'include' });
		console.log('[FastNotes] Fetch response status:', response.status);

		if (!response.ok) {
			console.warn('[FastNotes] Response not ok:', response.status);
			return null;
		}

		const html = await response.text();
		console.log('[FastNotes] HTML obtenido, tamaño:', html.length);

		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');

		// Buscar en el DOM: #own_village_note .village-note-body contiene el contenido renderizado
		const noteBodyEl = doc.querySelector('#own_village_note .village-note-body');
		console.log('[FastNotes] Buscando #own_village_note .village-note-body:', noteBodyEl ? 'ENCONTRADO' : 'NO ENCONTRADO');

		if (noteBodyEl) {
			// El contenido está en HTML (renderizado), necesitamos el BBCode original del textarea
			// Buscamos el textarea que contiene el código BBCode
			const noteTextarea = doc.querySelector('textarea[name="note"]');

			if (noteTextarea) {
				const noteText = noteTextarea.value || noteTextarea.textContent;
				const trimmed = noteText ? noteText.trim() : '';
				if (trimmed.length > 0) {
					console.log('[FastNotes] Nota encontrada en textarea, length:', trimmed.length);
					return trimmed;
				}
			}

			// Si no está en textarea, extraer del HTML renderizado con regex
			console.log('[FastNotes] Extrayendo del HTML renderizado...');
			const textareaMatch = html.match(/<textarea[^>]*name=["\']note["\'][^>]*>([\s\S]*?)<\/textarea>/);

			if (textareaMatch && textareaMatch[1]) {
				const noteText = textareaMatch[1].trim();
				if (noteText.length > 0) {
					console.log('[FastNotes] Nota encontrada en HTML, length:', noteText.length);
					return noteText;
				}
			}
		}

		console.warn('[FastNotes] No se encontró nota en la página');
		return null;
	} catch (e) {
		console.error('[FastNotes] Error en fetchExistingNote:', e);
		return null;
	}
}

// Create and edit text content for the Village Note
async function createNote(playerName, typeVillage, points, autodetected, villageId, meta, villageDOM) {
	var fn = win.FastNotes;

	var time = $('#content_value')[0].getElementsByTagName('table')[4].rows[1].cells[1].textContent;
	var nextime = time.replace(/[\t\n]/g, "").replace(" ", " - ");

	var sep  = '[color=#8b7355]━━━━━━━━━━━━━━━━━━━━━━━━━━━[/color]';
	var sep2 = '[color=#8b7355]─────────────────────────[/color]';

	// Etiqueta de tipo de pueblo
	var typeLabels = {
		off: tt('off'), deff: tt('deff'), mixto: tt('mixto'),
		unknown: tt('unknown'), empty: tt('empty'), barbarian: tt('barbarian')
	};
	var typeLabel = typeLabels[typeVillage] || tt('unknown');

	var now = new Date();
	var cleanTime = now.toLocaleDateString('es-ES', { day:'2-digit', month:'2-digit', year:'2-digit' }).replace(/\//g, '.')
		+ ' - ' + now.toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit', second:'2-digit' });

	var noteText = '';
	noteText += '[color=#1a0d00][b]『 ANALISIS DE PUEBLO 』[/b][/color]\n';
	noteText += sep + '\n';

	// Jugador con tribu, puntos totales y pueblos
	var pi = meta.playerInfo || {};
	var playerTag   = pi.tribe       ? ' [[ally]' + pi.tribe + '[/ally]]' : '';
	var playerExtra = (pi.totalPoints || pi.villages)
		? ' (' + (pi.totalPoints ? pi.totalPoints + ' pts' : '') + (pi.totalPoints && pi.villages ? ' | ' : '') + (pi.villages ? pi.villages + ' pueblos' : '') + ')'
		: '';
	noteText += '» [b]JUGADOR[/b]  ▸  [player]' + playerName + '[/player]' + playerTag + '[color=#888888]' + playerExtra + '[/color]\n';

	// Tipo
	noteText += '» [b]TIPO[/b]     ▸  ' + typeLabel + '\n';

	// Pueblo: puntos del pueblo + hora de batalla
	noteText += '» [b]PUEBLO[/b]   ▸  [color=#c45e00][b]' + points + '[/b][/color] pts  ·  [color=#2255aa][b]' + cleanTime + '[/b][/color]\n';

	noteText += sep + '\n';

	// Blindaje — siempre visible para mantener longitud uniforme en la nota
	if (meta.blindaje) {
		noteText += '» [b]BLINDAJE[/b]  ▸  ' + buildBlindajeBar(meta.blindaje) + '  [color=#888888]· [b]' + meta.inVillFarm.toLocaleString() + '[/b] pop[/color]\n';
	} else {
		var popText = meta.inVillFarm ? '[b]' + meta.inVillFarm.toLocaleString() + '[/b] pop' : 'sin datos';
		noteText += '» [b]BLINDAJE[/b]  ▸  [color=#555555][b]░░░░░░░░░  INEXISTENTE[/b][/color]  [color=#888888]· ' + popText + '[/color]\n';
	}

	var exportEl = $('#report_export_code')[0];
	var exportCode = exportEl ? (exportEl.value !== undefined && exportEl.value !== '' ? exportEl.value : exportEl.textContent) : '';
	noteText += exportCode.replace("[spoiler]", "[spoiler=📋 Ver Informe]");

	// Check for existing note
	console.log('[FastNotes] Buscando nota previa para villageId:', villageId);

	// Intentar usar villageDOM guardado en win.FastNotes
	const savedDOM = win.FastNotes.villageDOM;
	console.log('[FastNotes] ¿villageDOM guardado?:', savedDOM ? 'SÍ' : 'NO');

	let existingNote = null;

	if (savedDOM) {
		console.log('[FastNotes] Usando DOM guardado...');
		existingNote = extractNoteFromDOM(savedDOM);
		console.log('[FastNotes] Nota extraída del DOM:', existingNote ? 'SÍ (' + existingNote.length + ' chars)' : 'NO');
	} else {
		console.log('[FastNotes] DOM no disponible, haciendo fetch...');
		existingNote = await fetchExistingNote(villageId);
		console.log('[FastNotes] Nota obtenida por fetch:', existingNote ? 'SÍ (' + existingNote.length + ' chars)' : 'NO');
	}

	if (existingNote) {
		console.log('[FastNotes] Mostrando modal de comparación');

		// Renderizar la nota nueva pasando la nota anterior para extraer el informe
		const renderedNewNote = renderBBCode(noteText, existingNote);

		const compData = {
			villageId: villageId,
			playerName: playerName,
			newNote: {
				fullText: noteText,
				rendered: renderedNewNote,
				analysis: parseAnalysisFields(noteText),
				spoilers: extractSpoilerContent(noteText)
			},
			oldNote: {
				fullText: existingNote,
				analysis: parseAnalysisFields(existingNote),
				spoilers: extractSpoilerContent(existingNote)
			},
			autodetected: autodetected
		};

		showComparisonModal(compData);
	} else {
		console.log('[FastNotes] No hay nota previa, guardando directamente');
		postNote(noteText, autodetected, villageId);
	}
}

// Execute configured post-note action
function executePostAction(noteText, autodetected, villageId) {
	var config = getConfig('postAction', DEFAULT_CONFIG.postAction);
	var msg = "";

	if (config.type === "nada") {
		// Do nothing
		msg = "";
	} else if (config.type === "siguiente") {
		var next = $('#report-next')[0];
		if (next !== undefined) {
			msg = "Pasando al siguiente informe.";
			setTimeout(function() { next.click(); }, config.delayNext || 200);
		}
	} else if (config.type === "eliminar") {
		if (config.confirmDelete) {
			msg = '¿Deseas eliminar el informe? <button class="btn" onclick="removeReport()">Sí</button> <button class="btn">No</button>';
		} else {
			removeReport();
		}
	} else if (config.type === "archivar") {
		archiveReport(villageId);
	}

	return msg;
}

function archiveReport(villageId) {
	var moveForm = $('form[action*="action=move"]')[0];
	if (!moveForm) return;

	var groupSelect = $(moveForm).find('select[name="group_id"]')[0];
	if (!groupSelect) return;

	var archiveGroup = null;
	for (var i = 0; i < groupSelect.options.length; i++) {
		if (groupSelect.options[i].text.includes('Archivo')) {
			archiveGroup = groupSelect.options[i].value;
			break;
		}
	}

	if (archiveGroup) {
		$(groupSelect).val(archiveGroup);
		$(moveForm).submit();
	}
}

// Merge old note with new note: keeps analysis updated + combines reports
function mergeNotes(newNoteText, oldNoteText) {
	var newAnalysis = parseAnalysisFields(newNoteText);
	var newSpoilers = extractSpoilerContent(newNoteText);
	var oldSpoilers = extractSpoilerContent(oldNoteText);

	var sep  = '[color=#8b7355]━━━━━━━━━━━━━━━━━━━━━━━━━━━[/color]';
	var mergedText = '';

	mergedText += '[color=#1a0d00][b]『 ANALISIS DE PUEBLO 』[/b][/color]\n';
	mergedText += sep + '\n';

	// Extract analysis info from new note to keep it updated
	var playerMatch = newNoteText.match(/» \[b\]JUGADOR\[\/b\].*?\n/);
	var typeMatch = newNoteText.match(/» \[b\]TIPO\[\/b\].*?\n/);
	var puebloMatch = newNoteText.match(/» \[b\]PUEBLO\[\/b\].*?\n/);
	var blindajeMatch = newNoteText.match(/» \[b\]BLINDAJE\[\/b\].*?\n/);

	if (playerMatch) mergedText += playerMatch[0];
	if (typeMatch) mergedText += typeMatch[0];
	if (puebloMatch) mergedText += puebloMatch[0];
	if (blindajeMatch) mergedText += blindajeMatch[0];

	mergedText += sep + '\n';

	// Add all spoilers from new note first
	if (newSpoilers && newSpoilers.length > 0) {
		for (var i = 0; i < newSpoilers.length; i++) {
			mergedText += '[spoiler=' + newSpoilers[i].label + ']' + newSpoilers[i].content + '[/spoiler]\n';
		}
	}

	// Add all spoilers from old note
	if (oldSpoilers && oldSpoilers.length > 0) {
		for (var i = 0; i < oldSpoilers.length; i++) {
			mergedText += '[spoiler=' + oldSpoilers[i].label.replace('📋 Ver Informe', '📋 Informe Anterior') + ']' + oldSpoilers[i].content + '[/spoiler]\n';
		}
	}

	return mergedText;
}

// Posts a note in the specific village!
function postNote(noteText, autodetected, villageId) {
	TribalWars.post('info_village', { ajaxaction: 'edit_notes', id: villageId }, { note: noteText }, function() {
		var msg = executePostAction(noteText, autodetected, villageId);
		fnToast(autodetected, msg);
	});
}

function createToastStyles() {
	if ($('#fn-toast-css').length) return;
	$('head').append(`<style id="fn-toast-css">
		#fn-toast {
			position:fixed;top:22px;right:22px;z-index:99999;
			background:#1e1e1e;color:#fff;
			border-radius:10px;padding:13px 16px;
			box-shadow:0 8px 28px rgba(0,0,0,0.55);
			font-family:'Segoe UI',Tahoma,sans-serif;
			display:flex;align-items:center;gap:12px;
			min-width:240px;max-width:320px;
			opacity:1;transition:opacity 0.4s;
		}
		#fn-toast-icon { font-size:22px;line-height:1; }
		#fn-toast-title { font-size:12px;font-weight:800; }
		#fn-toast-subtitle { font-size:11px;color:#ccc;margin-top:2px; }
		#fn-toast-extra { font-size:10px;color:#aaa;margin-top:3px; }
		#fn-toast-close { margin-left:auto;cursor:pointer;color:#666;font-size:14px;font-weight:900;line-height:1;padding:2px 4px; }
		.fn-toast-success { border-left:4px solid #4caf50; }
		.fn-toast-success #fn-toast-title { color:#4caf50; }
		.fn-toast-error { border-left:4px solid #e53935; }
		.fn-toast-error #fn-toast-title { color:#e53935; }
	</style>`);
}

function fnToast(subtitle, extra) {
	createToastStyles();
	$('#fn-toast').remove();
	$('body').append(`
	<div id="fn-toast" class="fn-toast-success">
		<span id="fn-toast-icon">✅</span>
		<div style="line-height:1.5">
			<div id="fn-toast-title">Nota añadida</div>
			<div id="fn-toast-subtitle">${subtitle}</div>
			${extra ? '<div id="fn-toast-extra">'+extra+'</div>' : ''}
		</div>
		<span id="fn-toast-close" onclick="$('#fn-toast').remove()">✕</span>
	</div>`);
	setTimeout(function() {
		$('#fn-toast').css('opacity', '0');
		setTimeout(function() { $('#fn-toast').remove(); }, 400);
	}, 3500);
}

function fnErrorToast() {
	createToastStyles();
	$('#fn-toast').remove();
	$('body').append(`
	<div id="fn-toast" class="fn-toast-error">
		<span id="fn-toast-icon">⚠️</span>
		<div style="line-height:1.5">
			<div id="fn-toast-title">Pantalla incorrecta</div>
			<div id="fn-toast-subtitle">Ejecuta el script desde un informe de ataque o defensa.</div>
		</div>
		<span id="fn-toast-close" onclick="$('#fn-toast').remove()">✕</span>
	</div>`);
	setTimeout(function() {
		$('#fn-toast').css('opacity', '0');
		setTimeout(function() { $('#fn-toast').remove(); }, 400);
	}, 3500);
}

// Function to click remove button!
function removeReport() {
	var table = $('td#content_value');
	var result = table[0].getElementsByTagName('table')[table[0].getElementsByTagName('table').length - 1];
	var del = result.rows[0].cells[2];
	if (del.textContent.includes("Borrar")) {
		del.getElementsByTagName("a")[0].click();
	}
}

// Function to click next-report button!
function nextReport() {
	var next = $('#report-next')[0];
	if (next !== undefined) next.click();
}



//////////////////////////////////
//         ADDITIONAL           //
//////////////////////////////////


// Translations messages and codes!
function tt(string) {
	var gameLocale = game_data.locale;
	if (translations[gameLocale] !== undefined) return translations[gameLocale][string];
	else return translations['es_ES'][string];
}

// Additional function to get parameters quickly!
function getParameterByName(name, url = window.location.href) {
	return new URL(url).searchParams.get(name);
}

// Additional func to get info from Script!
function scriptInfo() {
	return `[${scriptData.name} ${scriptData.version}]`;
}

// Debugging function to check script!
function initDebug() {
	console.debug(`${scriptInfo()} It works ^^!`);
	if (DEBUG) {
		console.debug(`${scriptInfo()} World:`, game_data.world);
		console.debug(`${scriptInfo()} Screen:`, game_data.screen);
		console.debug(`${scriptInfo()} Game Version:`, game_data.majorVersion);
		console.debug(`${scriptInfo()} Game Build:`, game_data.version);
		console.debug(`${scriptInfo()} Locale:`, game_data.locale);
		console.debug(`${scriptInfo()} Premium:`, game_data.features.Premium.active);
	}
}

function injectComparisonModalStyles() {
	if ($('#fn-comparison-modal-css').length) return;
	$('head').append(`<style id="fn-comparison-modal-css">
		#fn-comparison-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.72); z-index: 100000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px); }
		#fn-comparison-box { background: #fdf8f0; border-radius: 14px; box-shadow: 0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(200,169,110,0.3); border: 1.5px solid #c8b89a; overflow: hidden; width: 90%; max-width: 1100px; height: 85vh; font-family: 'Segoe UI', Tahoma, sans-serif; display: flex; flex-direction: column; animation: fnFadeIn 0.22s ease; }
		#fn-comparison-box .fn-comp-head { background: linear-gradient(135deg, #5a3a28 0%, #3b2010 50%, #1e0f06 100%); padding: 15px 20px; display: flex; align-items: center; justify-content: space-between; position: relative; }
		#fn-comparison-box .fn-comp-head::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #c8a96e 30%, #e8c97e 50%, #c8a96e 70%, transparent); }
		.fn-comp-head-info { display: flex; flex-direction: column; gap: 3px; }
		.fn-comp-head-title { font-size: 16px; font-weight: 900; color: #f5e6c8; letter-spacing: 0.4px; line-height: 1.2; }
		.fn-comp-head-subtitle { font-size: 10px; color: rgba(200,169,110,0.8); letter-spacing: 1px; text-transform: uppercase; font-weight: 600; }
		.fn-comp-close { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.08); cursor: pointer; width: 28px; height: 28px; border-radius: 7px; font-size: 13px; font-weight: 900; color: #f5e6c8; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
		.fn-comp-close:hover { background: rgba(200,50,50,0.55); border-color: rgba(200,50,50,0.3); }
		#fn-comparison-box .fn-comp-content { display: flex; flex: 1; overflow: hidden; gap: 1px; background: #c8b89a; }
		.fn-comp-panel { flex: 1; display: flex; flex-direction: column; background: #fdf8f0; overflow: hidden; }
		.fn-comp-panel-header { padding: 10px 16px; border-bottom: 1px solid #d8c9a8; font-weight: 900; font-size: 10px; letter-spacing: 1.5px; }
		.fn-comp-panel-header-new { background: linear-gradient(90deg, #e8f5e9 0%, #f1f8f1 100%); color: #2e7d32; border-left: 3px solid #4caf50; }
		.fn-comp-panel-header-old { background: linear-gradient(90deg, #fff8e1 0%, #fdf8f0 100%); color: #8b6914; border-left: 3px solid #f39c12; }
		.fn-comp-panel-content { flex: 1; overflow-y: auto; padding: 16px; font-size: 11px; line-height: 1.6; color: #222; word-wrap: break-word; background: #ffffff; }
		.fn-comp-panel-content pre { font-family: inherit; white-space: pre-wrap; margin: 0; }
		.fn-comp-panel-content::-webkit-scrollbar { width: 6px; }
		.fn-comp-panel-content::-webkit-scrollbar-track { background: #f0e8d8; }
		.fn-comp-panel-content::-webkit-scrollbar-thumb { background: #c8b89a; border-radius: 3px; }
		.fn-comp-panel-content::-webkit-scrollbar-thumb:hover { background: #a89a7e; }
		.fn-comp-panel-content a { color: #1e50a2; text-decoration: none; }
		.fn-comp-panel-content a:hover { text-decoration: underline; }
		.fn-comp-report-spoiler { margin-top: 6px; }
		.fn-comp-report-spoiler summary,
		#fn-comp-old details summary, #fn-comp-old .spoiler-title { cursor: pointer; padding: 5px 10px; font-weight: 800; font-size: 11px; background: #f0e8d8; border: 1px solid #d8c9a8; border-radius: 5px; list-style: none; display: flex; align-items: center; gap: 6px; }
		.fn-comp-report-spoiler summary:hover,
		#fn-comp-old details summary:hover { background: #e8dcc8; }
		.fn-comp-report-spoiler[open] summary,
		#fn-comp-old details[open] summary { border-radius: 5px 5px 0 0; }
		#fn-comp-old details { margin-top: 6px; }
		.fn-comp-report-spoiler .fn-comp-report-body { border: 1px solid #d8c9a8; border-top: none; border-radius: 0 0 5px 5px; padding: 10px; overflow-x: auto; background: #f4e5c2; }
		#fn-comparison-box .fn-comp-footer { background: linear-gradient(180deg, #f5ead8 0%, #ede0c8 100%); border-top: 1px solid #d0bfa0; padding: 12px 18px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; }
		.fn-comp-btn { padding: 9px 16px; border: none; border-radius: 8px; cursor: pointer; font-size: 11px; font-weight: 800; letter-spacing: 0.3px; transition: all 0.18s; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
		.fn-comp-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 14px rgba(0,0,0,0.2); }
		.fn-comp-btn:active { transform: translateY(0); box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
		.fn-comp-btn-icon { font-size: 13px; line-height: 1; }
		.fn-comp-btn-close { background: linear-gradient(135deg, #78909c, #546e7a); color: #fff; }
		.fn-comp-btn-close:hover { background: linear-gradient(135deg, #90a4ae, #607d8b); }
		.fn-comp-btn-keep { background: linear-gradient(135deg, #f9a825, #f57f17); color: #fff; }
		.fn-comp-btn-keep:hover { background: linear-gradient(135deg, #fbc02d, #f9a825); }
		.fn-comp-btn-merge { background: linear-gradient(135deg, #43a047, #2e7d32); color: #fff; }
		.fn-comp-btn-merge:hover { background: linear-gradient(135deg, #66bb6a, #43a047); }
		.fn-comp-btn-overwrite { background: linear-gradient(135deg, #e53935, #b71c1c); color: #fff; }
		.fn-comp-btn-overwrite:hover { background: linear-gradient(135deg, #ef5350, #e53935); }
	</style>`);
}

function createNoteCardStyles() {
	if ($('#fn-note-card-css').length) return;
	$('head').append(`<style id="fn-note-card-css">
		#fn-note-card {
			font-family: 'Segoe UI', Tahoma, sans-serif;
			margin: 14px 0;
			border-radius: 10px;
			overflow: hidden;
			box-shadow: 0 4px 18px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.12);
			border: 1.5px solid #c8b89a;
		}
		#fn-note-card .fn-header {
			background: linear-gradient(135deg, #4a3728 0%, #2e1f14 100%);
			padding: 11px 16px;
			display: flex; align-items: center; justify-content: space-between;
		}
		#fn-note-card .fn-header-title {
			font-size: 13px; font-weight: 800; color: #f5e6c8;
			letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px;
		}
		#fn-note-card .fn-header-badge {
			font-size: 9px; font-weight: 700; color: #c8a96e;
			text-transform: uppercase; letter-spacing: 1px;
			background: rgba(255,255,255,0.08); padding: 3px 8px; border-radius: 20px;
		}
		#fn-note-card .fn-body {
			background: #fdf8f0;
			padding: 14px 16px;
			font-size: 12px;
			line-height: 1.7;
			color: #3d2b1f;
		}
		#fn-note-card .fn-body table { width: 100% !important; border: none !important; background: transparent !important; }
		#fn-note-card .fn-body table td { border: none !important; background: transparent !important; padding: 1px 0 !important; }
		#fn-note-card .fn-footer {
			background: #f0e8d8;
			border-top: 1px solid #d8c9a8;
			padding: 7px 16px;
			font-size: 10px; color: #8b7355;
			display: flex; align-items: center; justify-content: space-between;
		}
		#fn-note-card .fn-footer strong { color: #5a3e2b; }
	</style>`);
}

// Function to detect if you are in report view or info_command view!
function initGetVillageNote() {
	$.get($('.village_anchor').first().find('a').first().attr('href'), function(html) {
		const note = jQuery(html).find('#own_village_note .village-note');
		if (note.length > 0) {
			createNoteCardStyles();
			const noteContent = `
			<div id="fn-note-card">
				<div class="fn-header">
					<div class="fn-header-title">⚔️ Nota de Pueblo</div>
					<div class="fn-header-badge">${scriptData.name} ${scriptData.version}</div>
				</div>
				<div class="fn-body">
					${note[0].children[1].innerHTML}
				</div>
				<div class="fn-footer">
					<span>💖 por <strong>${scriptData.author}</strong></span>
					<span style="color:#aaa;">Fast Notes · Raba</span>
				</div>
			</div>`;
			jQuery('#content_value table:eq(0)').after(noteContent);
		}
	});
}

// ******************************************** //
//              Source AS Document              //
// ******************************************** //

// Fetches player profile and returns { tribe, totalPoints, villages }
async function getPlayerInfo(playerUrl) {
	var dom = await getSourceAsDOM(playerUrl);
	if (!dom) return { tribe: '', totalPoints: '', villages: '' };

	var result = { tribe: '', totalPoints: '', villages: '' };

	// Puntos: fila "Puntos:" en #player_info
	var playerInfoRows = dom.querySelectorAll('#player_info tr');
	for (var i = 0; i < playerInfoRows.length; i++) {
		var cells = playerInfoRows[i].cells;
		if (!cells || cells.length < 2) continue;
		if (cells[0].textContent.trim() === 'Puntos:') {
			result.totalPoints = cells[1].textContent.trim().replace(/\./g, '').replace(/,/g, '.');
		}
	}

	// Tribu: link a info_ally dentro de #player_info → texto del link → añadir corchetes
	var tribeLink = dom.querySelector('#player_info a[href*="screen=info_ally"]');
	if (tribeLink) result.tribe = tribeLink.textContent.trim();

	// Pueblos: cabecera de #villages_list → "Pueblos (12)" → extraer número
	var villagesHeader = dom.querySelector('#villages_list thead th');
	if (villagesHeader) {
		var match = villagesHeader.textContent.match(/\((\d+)\)/);
		if (match) result.villages = match[1];
	}

	return result;
}

// Returns the page at the specified URL as a parsed Document, or null on failure.
async function getSourceAsDOM(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		const text = await response.text();
		return new DOMParser().parseFromString(text, "text/html");
	} catch (ex) {
		console.error("getSourceAsDOM failed:", ex);
		UI.ErrorMessage(tt('FetchError'), 3000);
		return null;
	}
}


(function () {
	const gameScreen = getParameterByName('screen');
	const gameView = getParameterByName('view');
	const commandId = getParameterByName('id');

	if (game_data.features.Premium.active) {
		if (allowedScreens.includes(gameScreen)) {
			if (gameScreen === 'report' && gameView !== null) {
				initSetVillageNote();
			} else if (gameScreen === 'info_command' && commandId !== null) {
				initGetVillageNote();
			} else fnErrorToast();
		} else fnErrorToast();
	} else UI.ErrorMessage(tt('NeedPremium'));
})();
