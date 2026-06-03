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
/*    Versión 5.6      */

/************************/


var scriptData = {
	name: 'Fast Notes',
	version: 'v5.6',
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
        deff: "[color=#00a5a5][b]Posible Defensivo[/b][/color]",
		deff_blindado: '[color=#00a5a5][b]Posible Defensivo Blindado[/b][/color]',
        off: '[color=#ff6363][b]Posible Ofensivo[/b][/color]',
		off_blindado: '[color=#ff6363][b]Posible Ofensivo Blindado[/b][/color]',
		spy: '[color=#333363][b]Pueblo con Espías[/b][/color]',
		deff_chance: '[color=#1f6363][b]Alta Probabilidad de Defensivo[/b][/color]',
        mixto: '[color=#558d55][b]Posible Mixto o Apoyos[/b][/color]',
        unknown: '[color=#ff55ff][b]Imposible Identificar[/b][/color]',
		barbarian: '[color=#ff55ff][b]Pueblo Abandonado[/b][/color]',
        empty: '[color=#ff55ff][b]Pueblo Vacío[/b][/color]',
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

// Start script and run operations.
function initSetVillageNote() {

	resetFastNotes();

	const tableAtt = $('table#attack_info_att')[0];
	const tableDef = $('table#attack_info_def')[0];

	if (tableAtt === undefined && tableDef === undefined) {
		UI.ErrorMessage(tt('BadUsage'), 2000);
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
		inspectVillage(tableDef, tt('AutoAttacker'));
		return;
	}
	if (myName === defenderPlName) {
		inspectVillage(tableAtt, tt('AutoDefender'));
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
			inspectVillage(tableDef, tt('ModeDefensor'));
		} else if (mode === "atacante") {
			inspectVillage(tableAtt, tt('ModeAtacante'));
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
	var msg = tt('AlertMessage')
		.replace("%attacker%", '<button class="btn" onclick="inspectVillage(\'att\')">Pueblo Atacante</button>')
		.replace("%defender%", '<button class="btn" onclick="inspectVillage(\'def\')">Pueblo Defensor</button>');
	UI.ErrorMessage(msg, 10000);
}

// Player Village Inspector
async function inspectVillage(table, autodetected) {

	if (table === undefined) { UI.ErrorMessage(tt('CantInspect'), 2000); return; }

	if (table === 'att') { table = $('table#attack_info_att')[0]; autodetected = tt('SelectedAtt'); }
	if (table === 'def') {
		table = $('table#attack_info_def')[0]; autodetected = tt('SelectedDef');
		getInfo();
		spyValues();
	}

	win.FastNotes.table = table;
	var villageId = table.rows[1].cells[1].getElementsByTagName('span')[0].getAttribute('data-id');

	var target_village = table.querySelectorAll('.village_anchor');
	var dom_target_village = await getSourceAsDOM(target_village[0].getElementsByTagName('a')[0].href);
	if (dom_target_village === null) return;
	var content_value = dom_target_village.getElementById("content_value");
	var points = content_value.getElementsByTagName('table')[1].getElementsByTagName('td')[4].textContent.trim();

	var playerName = table.rows[0].cells[1].textContent.trim();
	if (playerName === '---') playerName = tt('barbarian').replace(/\[.*?\]/g, '');
	else playerName = table.rows[0].cells[1].getElementsByTagName('a')[0].textContent.trim();

	// In the case of not seeing any units / troops
	if (table.rows[2].getElementsByTagName('table')[0] == undefined) {
		createNote(playerName, tt('unknown'), points, autodetected, villageId);
		return;
	}
	var units = table.rows[2].getElementsByTagName('table')[0];
	getValues(units);

	calc(playerName, points, autodetected, villageId);
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

function calc(playerName, points, autodetected, villageId) {
	var minValue = 500;
	var maxValue = 20000;

	// OFF -->> Axe - Light_Cavalry - Archer_Cavalry - Ram
	// DEFF -->> Spear - Sword - Archer - Heavy_Cavalry
	var off = win.FastNotes.units.axe + win.FastNotes.units.light_cavalry + win.FastNotes.units.archer_cavalry + win.FastNotes.units.ram
		+ win.FastNotes.spy_units.axe + win.FastNotes.spy_units.light_cavalry + win.FastNotes.spy_units.archer_cavalry + win.FastNotes.spy_units.ram;
	var deff = win.FastNotes.units.spear + win.FastNotes.units.sword + win.FastNotes.units.archer + win.FastNotes.units.heavy_cavalry
		+ win.FastNotes.spy_units.spear + win.FastNotes.spy_units.sword + win.FastNotes.spy_units.archer + win.FastNotes.spy_units.heavy_cavalry;

	var off_fuera = win.FastNotes.spy_units.axe + win.FastNotes.spy_units.light_cavalry + win.FastNotes.spy_units.archer_cavalry + win.FastNotes.spy_units.ram;
	var deff_fuera = win.FastNotes.spy_units.spear + win.FastNotes.spy_units.sword + win.FastNotes.spy_units.archer + win.FastNotes.spy_units.heavy_cavalry;

	var todo = win.FastNotes.units.spear + win.FastNotes.units.sword + win.FastNotes.units.axe + win.FastNotes.units.archer
		+ win.FastNotes.units.spy + win.FastNotes.units.light_cavalry + win.FastNotes.units.archer_cavalry + win.FastNotes.units.heavy_cavalry
		+ win.FastNotes.units.ram + win.FastNotes.units.catapult;

	var typeVillage;

	// > 500 cases
	if (off_fuera >= minValue) typeVillage = tt('off');
	else if (deff_fuera >= minValue) typeVillage = tt('deff');
	else if ((win.FastNotes.units.ram + win.FastNotes.units.spy) === todo || (win.FastNotes.units.catapult + win.FastNotes.units.spy) === todo) typeVillage = tt('deff_chance');
	else if (off >= minValue && deff >= maxValue) typeVillage = tt('off_blindado');
	else if (off >= minValue && deff >= minValue) typeVillage = tt('mixto');
	else if (off >= minValue) typeVillage = tt('off');
	else if (off < minValue && deff >= maxValue) typeVillage = tt('deff_blindado');
	else if (deff >= minValue) typeVillage = tt('deff');

	// < 500 cases
	else if (deff > off) typeVillage = tt('deff');
	else if (off > deff) typeVillage = tt('off');
	else if (off < minValue && deff < minValue && win.FastNotes.units.spy >= 100) typeVillage = tt('spy');
	else if (off === 0 && deff === 0) typeVillage = tt('empty');
	else typeVillage = tt('unknown');

	if (DEBUG) {
		console.debug("OFF: " + off + " DEFF: " + deff);
		console.debug("OFF FUERA: " + off_fuera + " DEFF FUERA: " + deff_fuera);
	}

	createNote(playerName, typeVillage, points, autodetected, villageId);
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
function createNote(playerName, typeVillage, points, autodetected, villageId) {

	var time = $('#content_value')[0].getElementsByTagName('table')[4].rows[1].cells[1].textContent;
	var nextime = time.replace(/[\t\n]/g, "").replace(" ", " - ");

	var noteText = tt('note').player.replace("%player%", playerName) + '\n';
	noteText += tt('note').points.replace("%points%", points) + '\n\n';
	noteText += tt('note').village.replace("%type%", typeVillage) + '\n';
	noteText += tt('note').time.replace("%time%", nextime);

	if (win.FastNotes.units.knight_alive || win.FastNotes.units.snob_alive || win.FastNotes.torre.build || win.FastNotes.iglesia.build || win.FastNotes.wall.build || win.FastNotes.units.militia_alive) {
		noteText += '\n\n' + tt('note').features;
		if (win.FastNotes.units.militia_alive) noteText += '\n' + tt('note').militia.replace("%amount%", win.FastNotes.units.militia);
		if (win.FastNotes.wall.build) {
			if (win.FastNotes.wall.level > 0) noteText += '\n' + tt('note').wall.yes.replace("%level%", win.FastNotes.wall.level);
			else noteText += '\n' + tt('note').wall.no;
		}
		if (win.FastNotes.iglesia.build) {
			if (win.FastNotes.iglesia.level > 0) noteText += '\n' + tt('note').iglesia.yes.replace("%level%", win.FastNotes.iglesia.level);
			else noteText += '\n' + tt('note').iglesia.no;
		}
		if (win.FastNotes.torre.build) {
			if (win.FastNotes.torre.level > 0) noteText += '\n' + tt('note').torre.yes.replace("%level%", win.FastNotes.torre.level);
			else noteText += '\n' + tt('note').torre.no;
		}
		if (win.FastNotes.units.knight_alive && win.FastNotes.units.snob_alive) noteText += '\n' + tt('note').knightsnob;
		else if (win.FastNotes.units.knight_alive) noteText += '\n' + tt('note').knight;
		else if (win.FastNotes.units.snob_alive) noteText += '\n' + tt('note').snob;
	}

	noteText += '\n\n' + $('#report_export_code')[0].innerHTML.replace("[spoiler]", "[spoiler=Informe]");
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

	var displayDuration = (mode == "siguiente") ? 2000 : 20000;
	TribalWars.post('info_village', { ajaxaction: 'edit_notes', id: villageId }, { note: noteText }, function() {
		UI.SuccessMessage(autodetected + tt('Added') + " " + msg, displayDuration);
	});
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
                <div id="ra-village-notes" class="vis">
                    <div class="ra-village-notes-header">
                        <h3>${tt(scriptData.name)}</h3>
                    </div>
                    <div class="ra-village-notes-body">
                        ${note[0].children[1].innerHTML}
                    </div>
                    <div class="ra-village-notes-footer">
                        <small>
                            <strong>
                                ${tt(scriptData.name)} ${scriptData.version}
                            </strong> -
                            <a href="${scriptData.authorUrl}" target="_blank" rel="noreferrer noopener">
                                ${scriptData.author}
                            </a> -
                            <a href="${scriptData.helpLink}" target="_blank" rel="noreferrer noopener">
                                ${tt('Help')}
                            </a>
                        </small>
                    </div>
                </div>
                <style>
                    #ra-village-notes { position: relative; display: block; width: 100%; height: auto; clear: both; margin: 15px auto; padding: 10px; box-sizing: border-box; }
                    .ra-village-notes-footer { margin-top: 15px; }
                </style>
            `;
			jQuery('#content_value table:eq(0)').after(noteContent);
		}
	});
}

// ******************************************** //
//              Source AS Document              //
// ******************************************** //

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
			} else UI.ErrorMessage(tt('BadUsage'), 2000);
		} else UI.ErrorMessage(tt('BadUsage'), 2000);
	} else UI.ErrorMessage(tt('NeedPremium'));
})();
