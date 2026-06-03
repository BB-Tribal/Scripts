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
/*    Versión 6.1      */

/************************/


var scriptData = {
	name: 'Fast Notes',
	version: 'v6.1',
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

var win = window;
win.FastNotes = {
	table: null,
	units: {
		spear: 0, sword: 0, axe: 0, archer: 0,
		spy: 0, light_cavalry: 0, archer_cavalry: 0, heavy_cavalry: 0,
		ram: 0, catapult: 0,
		snob: 0, knight: 0, militia: 0,
		snob_alive: false,
		knight_alive: false,
		militia_alive: false
	},
	spy_units: {
		spear: 0, sword: 0, axe: 0, archer: 0,
		spy: 0, light_cavalry: 0, archer_cavalry: 0, heavy_cavalry: 0,
		ram: 0, catapult: 0,
		snob: 0, knight: 0, militia: 0
	},
	wall: {
		build: false,
		level: 0,
	},
	iglesia: {
		build: false,
		level: 0,
	},
	torre: {
		build: false,
		level: 0,
	}
};


//////////////////////////////////
//          MAIN CODE           //
//////////////////////////////////

// Checks if scripts is running without bugs!
initDebug();

// Resets all FastNotes state so re-running the script never carries over values from a previous report.
function resetFastNotes() {
	win.FastNotes.table = null;
	win.FastNotes.units = {
		spear: 0, sword: 0, axe: 0, archer: 0,
		spy: 0, light_cavalry: 0, archer_cavalry: 0, heavy_cavalry: 0,
		ram: 0, catapult: 0,
		snob: 0, knight: 0, militia: 0,
		snob_alive: false, knight_alive: false, militia_alive: false
	};
	win.FastNotes.spy_units = {
		spear: 0, sword: 0, axe: 0, archer: 0,
		spy: 0, light_cavalry: 0, archer_cavalry: 0, heavy_cavalry: 0,
		ram: 0, catapult: 0,
		snob: 0, knight: 0, militia: 0
	};
	win.FastNotes.wall    = { build: false, level: 0 };
	win.FastNotes.iglesia = { build: false, level: 0 };
	win.FastNotes.torre   = { build: false, level: 0 };
}

// ── Helpers de clasificación ──────────────────────────────────────────────────

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

	// If you aren't attacker or defender... Send Alert!
	if (typeof village_options !== 'undefined') {
		var mode = village_options.mode.toLowerCase();
		if (mode === "mixto") {
			sendAlertMess();
		} else if (mode === "defensor") {
			spyValues();
			getInfo();
			inspectVillage(tableDef, tt('ModeDefensor'), 'def');
		} else if (mode === "atacante") {
			inspectVillage(tableAtt, tt('ModeAtacante'), 'att');
		} else {
			UI.ErrorMessage("Tienes que seleccionar un modo correcto: Defensor, Atacante, Mixto", 2000);
		}
		return;
	}
	sendAlertMess();
}


// Display an alert message to select where the note will be stored: 'Defender Player Village' or 'Attacker Player Village'!
// This alert will be displayed when you are neither the attacker nor the defender player.
function sendAlertMess() {
	$('#fn-select-modal').remove();
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

	$('body').append(`
	<div id="fn-select-modal">
		<div id="fn-select-box">
			<div class="fn-modal-head">
				<div>
					<div class="fn-modal-head-title">⚔️ Fast Notes</div>
					<div class="fn-modal-head-subtitle">Selección de pueblo objetivo</div>
				</div>
				<button class="fn-modal-head-close" onclick="$('#fn-select-modal').remove()">✕</button>
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

	if (dom_target_village === null) return;
	var content_value = dom_target_village.getElementById("content_value");
	var points = content_value.getElementsByTagName('table')[1].getElementsByTagName('td')[4].textContent.trim();

	// In the case of not seeing any units / troops
	if (table.rows[2].getElementsByTagName('table')[0] == undefined) {
		createNote(playerName, 'unknown', points, autodetected, villageId, { blindaje: null, offInDef: false, spyUsed: false, inVillFarm: 0, villageRole: villageRole, playerInfo: playerInfo });
		return;
	}
	var units = table.rows[2].getElementsByTagName('table')[0];
	getValues(units);

	calc(playerName, points, autodetected, villageId, villageRole, playerInfo);
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

// Get unit values from the report table
function getValues(units) {
	const row = units.rows[1];
	const lost = units.rows[2];
	const fn = win.FastNotes.units;

	fn.spear        = safeInt(row, "unit-item-spear");
	fn.sword        = safeInt(row, "unit-item-sword");
	fn.axe          = safeInt(row, "unit-item-axe");
	fn.spy          = safeInt(row, "unit-item-spy");
	fn.light_cavalry= safeInt(row, "unit-item-light");
	fn.heavy_cavalry= safeInt(row, "unit-item-heavy");
	fn.ram          = safeInt(row, "unit-item-ram");
	fn.catapult     = safeInt(row, "unit-item-catapult");
	fn.snob         = safeInt(row, "unit-item-snob");
	if (fn.snob - safeInt(lost, "unit-item-snob") > 0) fn.snob_alive = true;

	// Check if world have Archers!
	fn.archer         = safeInt(row, "unit-item-archer");
	fn.archer_cavalry = safeInt(row, "unit-item-marcher");
	if (DEBUG && fn.archer === 0 && fn.archer_cavalry === 0) console.debug("This world don't have archers!");

	// Check if world have Knight!
	fn.knight = safeInt(row, "unit-item-knight");
	if (fn.knight - safeInt(lost, "unit-item-knight") > 0) fn.knight_alive = true;
	if (DEBUG && fn.knight === 0) console.debug("This world don't have knight!");

	fn.militia = safeInt(row, "unit-item-militia");
	if (fn.militia - safeInt(lost, "unit-item-militia") > 0) fn.militia_alive = true;
}

function builds(table) {
	for (var i = 0, row; row = table.rows[i]; i++) {
		if (row.cells[0].textContent.includes("Muralla")) {
			win.FastNotes.wall.level = parseInt(row.cells[1].textContent);
			win.FastNotes.wall.build = true;
		}
		if (row.cells[0].textContent.includes("Iglesia")) {
			win.FastNotes.iglesia.level = parseInt(row.cells[1].textContent);
			win.FastNotes.iglesia.build = true;
		}
		if (row.cells[0].textContent.includes("Torre")) {
			win.FastNotes.torre.level = parseInt(row.cells[1].textContent);
			win.FastNotes.torre.build = true;
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
				if (row.cells[1].textContent.includes('Muralla')) {
					var split = row.cells[1].textContent.replace(".", "").split(" ");
					win.FastNotes.wall.build = true;
					win.FastNotes.wall.level = parseInt(split[split.length - 1], 10);
				}
				if (row.cells[0].textContent.includes("Iglesia")) {
					var split = row.cells[1].textContent.replace(".", "").split(" ");
					win.FastNotes.iglesia.level = parseInt(split[split.length - 1], 10);
					win.FastNotes.iglesia.build = true;
				}
				if (row.cells[0].textContent.includes("Torre")) {
					var split = row.cells[1].textContent.replace(".", "").split(" ");
					win.FastNotes.torre.level = parseInt(split[split.length - 1], 10);
					win.FastNotes.torre.build = true;
				}
			}
		}
	}
}

function calc(playerName, points, autodetected, villageId, villageRole, playerInfo) {
	var fn = win.FastNotes;
	var typeVillage, blindaje = null, offInDef = false, spyUsed = false, inVillFarm = 0;

	// Pueblo vacío
	var totalUnits = fn.units.spear + fn.units.sword + fn.units.axe + fn.units.archer +
		fn.units.spy + fn.units.light_cavalry + fn.units.archer_cavalry + fn.units.heavy_cavalry +
		fn.units.ram + fn.units.catapult + fn.units.snob + fn.units.knight;
	if (totalUnits === 0 && !hasSpyData()) {
		createNote(playerName, 'empty', points, autodetected, villageId, { blindaje: null, offInDef: false, spyUsed: false, inVillFarm: 0, villageRole: villageRole });
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

	createNote(playerName, typeVillage, points, autodetected, villageId, {
		blindaje: blindaje, offInDef: offInDef, spyUsed: spyUsed,
		inVillFarm: inVillFarm, villageRole: villageRole, playerInfo: playerInfo
	});
}

function spyValues() {
	if (DEBUG) console.debug("Spy Values");
	var units = $('table#attack_spy_away')[0];
	if (units !== undefined) {
		const row = units.rows[1].getElementsByTagName("table")[0].rows[1];
		const sp = win.FastNotes.spy_units;

		sp.spear        = safeInt(row, "unit-item-spear");
		sp.sword        = safeInt(row, "unit-item-sword");
		sp.axe          = safeInt(row, "unit-item-axe");
		sp.spy          = safeInt(row, "unit-item-spy");
		sp.light_cavalry= safeInt(row, "unit-item-light");
		sp.heavy_cavalry= safeInt(row, "unit-item-heavy");
		sp.ram          = safeInt(row, "unit-item-ram");
		sp.catapult     = safeInt(row, "unit-item-catapult");
		sp.snob         = safeInt(row, "unit-item-snob");
		if (sp.snob > 0) win.FastNotes.units.snob_alive = true;

		sp.archer         = safeInt(row, "unit-item-archer");
		sp.archer_cavalry = safeInt(row, "unit-item-marcher");

		sp.knight = safeInt(row, "unit-item-knight");
		if (sp.knight > 0) {
			win.FastNotes.units.knight_alive = true;
			win.FastNotes.units.knight = 1;
		}
	}
}


//////////////////////////////////
//            NOTES             //
//////////////////////////////////

// Create and edit text content for the Village Note
function createNote(playerName, typeVillage, points, autodetected, villageId, meta) {
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
	postNote(noteText, autodetected, villageId);
}

// Posts a note in the specific village!
function postNote(noteText, autodetected, villageId) {
	var mode = "";
	var delete_confirm = false;
	var cooldown_next = false;
	var delay_next = 200;

	if (typeof note_added !== 'undefined') mode = note_added.mode.toLowerCase();
	if (typeof next_options !== 'undefined') {
		cooldown_next = next_options.delay.enable;
		delay_next = next_options.delay.cooldown;
	}
	if (typeof delete_options !== 'undefined') delete_confirm = delete_options.confirm_msg;

	var msg = "";

	if (mode == "siguiente") {
		var next = $('#report-next')[0];
		if (next !== undefined) msg = "Pasando al siguiente informe.";
		if (next !== undefined) {
			if (cooldown_next) setTimeout(function() { next.click(); }, delay_next);
			else next.click();
		}
	} else if (mode == "eliminar") {
		if (delete_confirm) {
			msg = '¿Deseas eliminar el informe? <button class="btn" onclick="removeReport()">Sí</button> <button class="btn">No</button>';
		} else {
			removeReport();
		}
	}

	TribalWars.post('info_village', { ajaxaction: 'edit_notes', id: villageId }, { note: noteText }, function() {
		fnToast(autodetected, msg);
	});
}

function fnToast(subtitle, extra) {
	$('#fn-toast').remove();
	$('body').append(`
	<div id="fn-toast" style="
		position:fixed;top:22px;right:22px;z-index:99999;
		background:#1e1e1e;color:#fff;
		border-radius:10px;padding:13px 16px;
		box-shadow:0 8px 28px rgba(0,0,0,0.55);
		border-left:4px solid #4caf50;
		font-family:'Segoe UI',Tahoma,sans-serif;
		display:flex;align-items:center;gap:12px;
		min-width:240px;max-width:320px;
		opacity:1;transition:opacity 0.4s;
	">
		<span style="font-size:22px;line-height:1">✅</span>
		<div style="line-height:1.5">
			<div style="font-size:12px;font-weight:800;color:#4caf50;">Nota añadida</div>
			<div style="font-size:11px;color:#ccc;margin-top:2px;">${subtitle}</div>
			${extra ? '<div style="font-size:10px;color:#aaa;margin-top:3px;">'+extra+'</div>' : ''}
		</div>
		<span onclick="$('#fn-toast').remove()" style="margin-left:auto;cursor:pointer;color:#666;font-size:14px;font-weight:900;line-height:1;padding:2px 4px;">✕</span>
	</div>`);
	setTimeout(function() {
		$('#fn-toast').css('opacity', '0');
		setTimeout(function() { $('#fn-toast').remove(); }, 400);
	}, 3500);
}

function fnErrorToast() {
	$('#fn-toast').remove();
	$('body').append(`
	<div id="fn-toast" style="
		position:fixed;top:22px;right:22px;z-index:99999;
		background:#1e1e1e;color:#fff;
		border-radius:10px;padding:13px 16px;
		box-shadow:0 8px 28px rgba(0,0,0,0.55);
		border-left:4px solid #e53935;
		font-family:'Segoe UI',Tahoma,sans-serif;
		display:flex;align-items:center;gap:12px;
		min-width:240px;max-width:320px;
		opacity:1;transition:opacity 0.4s;
	">
		<span style="font-size:22px;line-height:1">⚠️</span>
		<div style="line-height:1.5">
			<div style="font-size:12px;font-weight:800;color:#e53935;">Pantalla incorrecta</div>
			<div style="font-size:11px;color:#ccc;margin-top:2px;">Ejecuta el script desde un informe de ataque o defensa.</div>
		</div>
		<span onclick="$('#fn-toast').remove()" style="margin-left:auto;cursor:pointer;color:#666;font-size:14px;font-weight:900;line-height:1;padding:2px 4px;">✕</span>
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

// Function to detect if you are in report view or info_command view!
function initGetVillageNote() {
	$.get($('.village_anchor').first().find('a').first().attr('href'), function(html) {
		const note = jQuery(html).find('#own_village_note .village-note');
		if (note.length > 0) {
			const noteContent = `
			<style>
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
			</style>
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
