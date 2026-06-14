javascript:

/* Script By Raba */
/* Versión: 3.6 */


var collection;
var content;
var screen_village = false;

if(getParameterByName('screen') == "info_village"){
    collection = document.querySelectorAll(".command-row .quickedit .quickedit-content .quickedit-label, .command-row .quickedit-out .quickedit-content .quickedit-label");
    content = document.querySelectorAll(".command-row .quickedit .quickedit-content , .command-row .quickedit-out .quickedit-content");
    screen_village = true;
}else if(getParameterByName('screen') == "place" || getParameterByName('screen') == "overview"){
    collection = Array.from(document.getElementsByClassName("quickedit-out"));
    content = document.querySelectorAll(".quickedit-out .quickedit-content");
}

//var content = document.getElementsByClassName("quickedit-content");
var _rnLang = {
    spear: " 𝐋𝐚𝐧𝐳𝐚𝐬 🔱▸",
    sword: " 𝐄𝐬𝐩𝐚𝐝𝐚𝐬 🗡️▸",
    axe: " 𝐇𝐚𝐜𝐡𝐚𝐬 🪓▸",
    archer: " 𝐀𝐫𝐪𝐮𝐞𝐫𝐨𝐬 🏹▸",
    spy: " 𝐄𝐬𝐩í𝐚𝐬 🕵️▸",
    light: " 𝐋𝐢𝐠𝐞𝐫𝐚 🐴▸",
    marcher: " 𝐉𝐢𝐧𝐞𝐭𝐞𝐬 🏇▸",
    heavy: "",
    ram: " 𝐀𝐫𝐢𝐞𝐭𝐞𝐬 💣▸",
    catapult: " 𝐂𝐚𝐭𝐚𝐩𝐮𝐥𝐭𝐚𝐬 💥▸",
    knight: " 𝐩𝐚𝐥𝐚𝐝𝐢𝐧 🤵▸",
    snob: "『👑』𝐓𝐄 𝐕𝐎𝐘 𝐀 𝐄𝐍𝐍𝐎𝐁𝐋𝐄𝐂𝐄𝐑『👑』",

    miniOff: "⚡𝐌𝐈𝐍𝐈 𝐎𝐅𝐅⚡",
    off: "『☠️』𝐕𝐀𝐌𝐎𝐒 𝐀 𝐋𝐀 𝐆𝐔𝐄𝐑𝐑𝐀『☠️』",
    fake: "💨 𝐅𝐚𝐤𝐞... 𝐬𝐢𝐠𝐮𝐞 𝐝𝐮𝐫𝐦𝐢𝐞𝐧𝐝𝐨 💨",
    fakeSpy: "🕵️ 𝐒𝐨𝐥𝐨 𝐦𝐞 𝐚𝐬𝐨𝐦𝐨 🕵️"

}

const conditions = ["🤵", "💥", "💣", "🏹", "🐴", "🕵️", "🏇", "🪓", "🗡️", "🔱", "⚡", "💨", "☠️", "👑", "『"];

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

const CHUNK_SIZE = 5;       // peticiones simultáneas por lote
const DELAY_FETCH = 100;    // ms entre peticiones dentro de un lote
const DELAY_OPEN = 150;     // ms tras click rename (espera que abra el form)
const WAIT_CLOSE_MAX = 500; // ms máximo esperando que el form se cierre

async function waitFormClose(contentEl){
    for(var t = 0; t < WAIT_CLOSE_MAX / 50; t++){
        await sleep(50);
        if($(contentEl).find('.quickedit-edit input[type=text]').length === 0) return;
    }
}

async function getSourceAsDOMAsync(url){
    var response = await fetch(url);
    if(!response.ok) throw new Error('HTTP ' + response.status);
    var text = await response.text();
    var parser = new DOMParser();
    return parser.parseFromString(text, "text/html");
}

async function calculateAsync(link){
    var source = await getSourceAsDOMAsync(link);
    var spear = parseInt(source.getElementsByClassName('unit-item unit-item-spear')[0].textContent);
    var sword = parseInt(source.getElementsByClassName('unit-item unit-item-sword')[0].textContent);
    var axe = parseInt(source.getElementsByClassName('unit-item unit-item-axe')[0].textContent);
    var archer = 0;
    var spy = parseInt(source.getElementsByClassName('unit-item unit-item-spy')[0].textContent);
    var light = parseInt(source.getElementsByClassName('unit-item unit-item-light')[0].textContent);
    var marcher = 0;
    var ram = parseInt(source.getElementsByClassName('unit-item unit-item-ram')[0].textContent);
    var catapult = parseInt(source.getElementsByClassName('unit-item unit-item-catapult')[0].textContent);
    var knight = 0;
    var snob = parseInt(source.getElementsByClassName('unit-item unit-item-snob')[0].textContent);

    if(source.getElementsByClassName('unit-item unit-item-archer')[0] != undefined){
        archer = parseInt(source.getElementsByClassName('unit-item unit-item-archer')[0].textContent);
        marcher = parseInt(source.getElementsByClassName('unit-item unit-item-marcher')[0].textContent);
    }
    if(source.getElementsByClassName('unit-item unit-item-knight')[0] != undefined){
        knight = parseInt(source.getElementsByClassName('unit-item unit-item-knight')[0].textContent);
    }

    var troopsValue = 0;
    var valor = spear + sword + axe + archer + spy + light + marcher + ram + catapult + knight + snob;
    troopsValue = spear + sword + axe + archer + (spy*2) + (light*4) + (marcher*5) + (ram*5) + (catapult*8) + (knight*10) + (snob*100);
    var atackName = "";
    if(snob >= 1){
        atackName = _rnLang.snob;
    }else if(spy >= valor/2){
        atackName = _rnLang.fakeSpy;
    }else if(troopsValue >= 0 && troopsValue <= 300){
        atackName = _rnLang.fake;
    }else if(troopsValue >= 1000 && troopsValue <= 2000){
        atackName = _rnLang.miniOff;
    }else if(troopsValue > 2000){
        atackName = _rnLang.off;
    }else{
        if(spear != 0) atackName = atackName + spear + _rnLang.spear;
        if(sword != 0) atackName = atackName + sword + _rnLang.sword;
        if(axe != 0) atackName = atackName + axe + _rnLang.axe;
        if(archer != 0) atackName = atackName + archer + _rnLang.archer;
        if(spy != 0) atackName = atackName + spy + _rnLang.spy;
        if(light != 0) atackName = atackName + light + _rnLang.light;
        if(marcher != 0) atackName = atackName + marcher + _rnLang.marcher;
        if(ram != 0) atackName = atackName + ram + _rnLang.ram;
        if(catapult != 0) atackName = atackName + catapult + _rnLang.catapult;
        if(knight != 0) atackName = atackName + knight + _rnLang.knight;
        if(snob != 0) atackName = atackName + snob + _rnLang.snob;
    }
    return atackName;
}

async function processAll(){
    // Fase 1: recopilar todos los ataques que hay que renombrar
    var toProcess = [];
    for(var i = 0; i < collection.length; i++){
        var label = content[i].getElementsByClassName('quickedit-label')[0].innerHTML;
        var iconos = content[i].getElementsByClassName('icon-container')[0];
        var allHints = Array.from(iconos.getElementsByClassName('command_hover_details')).map(el => el.dataset.iconHint).join(' ');
        var isSaqueo = allHints.match(/saqueo/i);
        var isApoyo  = allHints.match(/apoyo/i);

        if(screen_village){
            var returning = $(content[i]).find('.command_hover_details')[0].dataset.commandType;
            var otherPlayer = $(content[i]).find('.rename-icon')[0];
            var isRenamed = conditions.some(el => label.includes(el));
            if(returning != "return" && otherPlayer != undefined && !isRenamed && !isSaqueo && !isApoyo){
                toProcess.push({ idx: i, link: content[i].querySelector('a').href });
            }
        }else{
            if(label.match(/Ataque a/i) && !isSaqueo){
                toProcess.push({ idx: i, link: content[i].querySelector('a').href });
            }
        }
    }

    // Fase 2 + 3: lotes de CHUNK_SIZE — fetch en paralelo escalonado, luego rename
    for(var start = 0; start < toProcess.length; start += CHUNK_SIZE){
        var chunk = toProcess.slice(start, start + CHUNK_SIZE);

        // Lanzar fetches con un pequeño escalonado para no bombardear el servidor
        var fetchPromises = chunk.map((item, k) =>
            sleep(k * DELAY_FETCH).then(() => calculateAsync(item.link).catch(() => null))
        );
        var names = await Promise.all(fetchPromises);

        // Renombrar los del lote secuencialmente
        for(var j = 0; j < chunk.length; j++){
            var i = chunk[j].idx;
            var atackName = names[j];
            if(atackName === null) continue;

            if(screen_village){
                $(content[i]).find('.rename-icon').click();
                await sleep(DELAY_OPEN);
                var edit = $(content[i]).closest('.command-row').find('.quickedit-edit, .quickedit-out .quickedit-edit').find('input[type=text]');
                if(edit.length === 0) edit = $(content[i]).find('input[type=text]');
                edit.val(atackName);
                edit.closest('form, div').find('input[type=button]').click();
                await waitFormClose(content[i]);
            }else{
                $(content[i]).find('.rename-icon').click();
                await sleep(DELAY_OPEN);
                $(collection[i].getElementsByClassName("quickedit-edit")[0]).find('input[type=text]').val(atackName);
                $(collection[i].getElementsByClassName("quickedit-edit")[0]).find('input[type=button]').click();
                await waitFormClose(content[i]);
            }
        }
    }
}

processAll();

function getParameterByName(name, url = window.location.href) {
	return new URL(url).searchParams.get(name);
}


void(0);