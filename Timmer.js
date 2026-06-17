/*
 * Script Name: Timing Assist
 * Version: v2.3
 * Modified by: Black_Lottus
 */

var _taLang = {
    mustRunFromRally:   "Este script debe ejecutarse desde el punto de reunión durante el envío de un comando.",
    alreadyRunning:     "El script ya está en ejecución. ¿Deseas borrar las variables almacenadas? (Puede solucionar errores recurrentes)",
    titleAssist:        "Asistente de Tiempos",
    btnTest:            "Test",
    btnStart:           "Iniciar",
    labelHit:           "Hit: ",
    tutorialTitle:      "Asistente de Tiempos — Ayuda",
    tutorialBody:       "El asistente de tiempos te ayuda a cronometrar tus ataques con precisión mostrando gráficamente los milisegundos en un círculo. "
                      + "El círculo se completa exactamente en el milisegundo objetivo. El reloj se sincroniza directamente con el servidor de Tribal Wars.",
    hitTitle:           "Hit (ms)",
    hitBody:            "El milisegundo del segundo de llegada en que quieres enviar el ataque. El círculo se completa en ese instante exacto. "
                      + "Puedes cambiarlo en cualquier momento — se aplica al instante sin necesidad de reiniciar.",
    testTitle:          "Botón Test",
    testBody:           "Pulsa 'Test' para practicar el timing sin enviar el ataque. El círculo se congela. "
                      + "Pulsa 'Iniciar' para reanudar inmediatamente.",
    errConsoleArrival:  "No se pudo identificar el segundo de llegada:\n",
    errConsoleTable:    "No se pudo encontrar la tabla...\n",
    btnConfirm:         "Confirmar",
    btnCancel:          "Cancelar",
    btnAccept:          "Aceptar",
    themeTitle:         "Tema visual"
};

// ── Theme System ───────────────────────────────────────────────────────────────
var TA_THEMES = {
    classic:  { name:'Clásico',   emoji:'🏛️', bg:'#1a1208', bg2:'#2a1f0e', bg3:'#0f0a04', border:'#8a6a2a', accent:'#c8982a', text:'#e8c87a',  text2:'#d4b87a', stroke:'#c8982a' },
    midnight: { name:'Midnight',  emoji:'🌙',  bg:'#0f172a', bg2:'#1a2540', bg3:'#0a0f1e', border:'#334155', accent:'#3b82f6', text:'#e2e8f0',  text2:'#94a3b8', stroke:'#3b82f6' },
    crimson:  { name:'Crimson',   emoji:'🔴', bg:'#1a0505', bg2:'#220808', bg3:'#0f0303', border:'#7f1d1d', accent:'#ef4444', text:'#fecaca',  text2:'#f87171', stroke:'#ef4444' },
    emerald:  { name:'Esmeralda', emoji:'💚', bg:'#0a1a12', bg2:'#0d2119', bg3:'#061009', border:'#1a4a2e', accent:'#22c55e', text:'#d1fae5',  text2:'#6ee7b7', stroke:'#22c55e' },
    sakura:   { name:'Sakura',    emoji:'🌸', bg:'#2a0a18', bg2:'#380e22', bg3:'#1a0510', border:'#7f1d4f', accent:'#ec4899', text:'#fce7f3',  text2:'#f9a8d4', stroke:'#ec4899' },
    inferno:  { name:'Inferno',   emoji:'🔥', bg:'#1c1f27', bg2:'#21242e', bg3:'#131318', border:'#2c2f3c', accent:'#f5a623', text:'#e2e8f0',  text2:'#8892a4', stroke:'#f5a623' },
    obsidian: { name:'Obsidian',  emoji:'🖤', bg:'#000000', bg2:'#0d0d0d', bg3:'#050505', border:'#1f1f1f', accent:'#06b6d4', text:'#e2e8f0',  text2:'#64748b', stroke:'#06b6d4' },
    matrix:   { name:'Matrix',    emoji:'🟢', bg:'#0a0f0a', bg2:'#0a1a0a', bg3:'#050a05', border:'#1a3d1a', accent:'#00ff41', text:'#ccffcc',  text2:'#4dff77', stroke:'#00ff41' },
};

function applyTATheme(key) {
    var th = TA_THEMES[key] || TA_THEMES.classic;
    var r = document.documentElement;
    r.style.setProperty('--ta-bg',     th.bg);
    r.style.setProperty('--ta-bg2',    th.bg2);
    r.style.setProperty('--ta-bg3',    th.bg3);
    r.style.setProperty('--ta-border', th.border);
    r.style.setProperty('--ta-accent', th.accent);
    r.style.setProperty('--ta-text',   th.text);
    r.style.setProperty('--ta-text2',  th.text2);
    r.style.setProperty('--ta-stroke', th.stroke);
    localStorage.setItem('ta_theme', key);
    if (taCtx) { taCtx.strokeStyle = th.stroke; taCtx.clearRect(0,0,160,160); }
    document.querySelectorAll('.ta-theme-item').forEach(function(el){
        el.classList.toggle('ta-theme-active', el.dataset.theme === key);
    });
}

function getCurrentTATheme() {
    return localStorage.getItem('ta_theme') || 'sakura';
}

function injectStyles(){
    if(document.getElementById('ta-styles')) return;
    var s=document.createElement('style');
    s.id='ta-styles';
    s.innerHTML=
        ':root{--ta-bg:#1a1208;--ta-bg2:#2a1f0e;--ta-bg3:#0f0a04;--ta-border:#8a6a2a;--ta-accent:#c8982a;--ta-text:#e8c87a;--ta-text2:#d4b87a;--ta-stroke:#c8982a}'
       +'#ta-toast-wrap{position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:10px}'
       +'.ta-toast{display:flex;align-items:flex-start;gap:10px;padding:14px 18px;border-radius:8px;min-width:280px;max-width:360px;box-shadow:0 4px 20px rgba(0,0,0,.6);font-family:Arial,sans-serif;font-size:13px;line-height:1.5;color:#fff;animation:ta-in .3s ease;position:relative;overflow:hidden}'
       +'.ta-toast.info{background:linear-gradient(135deg,#1a3a5c,#2a5a8c);border-left:4px solid #4a9eff}'
       +'.ta-toast.warn{background:linear-gradient(135deg,#4a2a00,#8a5200);border-left:4px solid #ffaa00}'
       +'.ta-toast.error{background:linear-gradient(135deg,#4a0a0a,#8a1a1a);border-left:4px solid #ff4444}'
       +'.ta-ti{font-size:18px;flex-shrink:0;margin-top:1px}'
       +'.ta-tm{flex:1;white-space:pre-line}'
       +'.ta-tx{cursor:pointer;opacity:.6;font-size:16px;line-height:1;flex-shrink:0}'
       +'.ta-tx:hover{opacity:1}'
       +'.ta-bar{position:absolute;bottom:0;left:0;height:3px;animation:ta-prog 4.5s linear forwards}'
       +'.ta-toast.info .ta-bar{background:#4a9eff}'
       +'.ta-toast.warn .ta-bar{background:#ffaa00}'
       +'.ta-toast.error .ta-bar{background:#ff4444}'
       +'@keyframes ta-in{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}'
       +'@keyframes ta-prog{from{width:100%}to{width:0}}'
       +'.ta-ov{position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:99998;display:flex;align-items:center;justify-content:center;animation:ta-fi .2s ease}'
       +'@keyframes ta-fi{from{opacity:0}to{opacity:1}}'
       +'.ta-modal{background:linear-gradient(180deg,var(--ta-bg2),var(--ta-bg));border:1px solid var(--ta-border);border-radius:10px;box-shadow:0 8px 40px rgba(0,0,0,.85);width:460px;max-width:92vw;font-family:Arial,sans-serif;overflow:hidden}'
       +'.ta-modal-lg{width:580px}'
       +'.ta-mhd{background:linear-gradient(90deg,var(--ta-bg2),var(--ta-bg));padding:14px 20px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--ta-border)}'
       +'.ta-mic{font-size:20px}'
       +'.ta-mtt{color:var(--ta-text);font-size:15px;font-weight:bold;flex:1}'
       +'.ta-mbd{padding:20px;color:var(--ta-text2);font-size:13px;line-height:1.7;white-space:pre-line;max-height:60vh;overflow-y:auto}'
       +'.ta-mbd h5{color:var(--ta-text);margin:14px 0 4px;font-size:13px}'
       +'.ta-mbd p{margin:0 0 8px}'
       +'.ta-mbd b{color:var(--ta-text)}'
       +'.ta-inp{width:100%;box-sizing:border-box;margin-top:12px;padding:9px 12px;background:var(--ta-bg3);border:1px solid var(--ta-border);border-radius:5px;color:var(--ta-text);font-size:14px;outline:none}'
       +'.ta-inp:focus{border-color:var(--ta-accent);box-shadow:0 0 0 2px rgba(0,0,0,.2)}'
       +'.ta-mft{padding:12px 20px;display:flex;justify-content:flex-end;gap:10px;border-top:1px solid var(--ta-bg2);background:var(--ta-bg3)}'
       +'.ta-btn{padding:8px 22px;border-radius:5px;border:none;cursor:pointer;font-size:13px;font-weight:bold;transition:filter .15s}'
       +'.ta-btn:hover{filter:brightness(1.2)}'
       +'.ta-ok{background:var(--ta-accent);color:var(--ta-bg);border:1px solid var(--ta-accent)}'
       +'.ta-cn{background:var(--ta-bg2);color:var(--ta-text2);border:1px solid var(--ta-border)}'
       +'.ta-close-btn{background:none;border:1px solid var(--ta-border);border-radius:5px;color:var(--ta-text2);cursor:pointer;font-size:14px;padding:2px 8px;line-height:1.4;transition:border-color .15s,color .15s}'
       +'.ta-close-btn:hover{border-color:var(--ta-accent);color:var(--ta-accent)}'
       +'.ta-theme-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:100000;background:var(--ta-bg);border:1px solid var(--ta-border);border-radius:12px;box-shadow:0 8px 40px rgba(0,0,0,.9);width:320px;max-width:92vw;font-family:Arial,sans-serif;overflow:hidden;animation:ta-fi .2s ease}'
       +'.ta-theme-list{display:flex;flex-direction:column;gap:4px;padding:10px}'
       +'.ta-theme-item{display:flex;align-items:center;gap:12px;padding:9px 12px;border-radius:8px;border:1.5px solid transparent;cursor:pointer;transition:border-color .15s,background .15s}'
       +'.ta-theme-item:hover{background:var(--ta-bg2)}'
       +'.ta-theme-item.ta-theme-active{border-color:var(--ta-accent) !important;background:var(--ta-bg2)}'
       +'.ta-theme-dot{width:24px;height:24px;border-radius:7px;flex-shrink:0}'
       +'.ta-theme-name{font-size:13px;font-weight:600;color:var(--ta-text)}'
       +'#ta-settings-btn{cursor:pointer;padding:2px 6px;border:1px solid var(--ta-border);border-radius:4px;background:var(--ta-bg2);color:var(--ta-text);font-size:13px;transition:border-color .15s,color .15s;vertical-align:middle}'
       +'#ta-settings-btn:hover{border-color:var(--ta-accent);color:var(--ta-accent)}';
    document.head.appendChild(s);
}

function showToast(msg, type){
    injectStyles();
    var wrap=document.getElementById('ta-toast-wrap');
    if(!wrap){wrap=document.createElement('div');wrap.id='ta-toast-wrap';document.body.appendChild(wrap);}
    var icons={info:'ℹ️',warn:'⚠️',error:'❌'};
    var el=document.createElement('div');
    el.className='ta-toast '+(type||'info');
    el.innerHTML="<span class='ta-ti'>"+icons[type||'info']+"</span>"
               +"<span class='ta-tm'>"+msg+"</span>"
               +"<span class='ta-tx' onclick='this.parentNode.remove()'>✕</span>"
               +"<span class='ta-bar'></span>";
    wrap.appendChild(el);
    setTimeout(function(){if(el.parentNode)el.remove();},4800);
}

function showModal(msg, onConfirm){
    injectStyles();
    var ov=document.createElement('div');
    ov.className='ta-ov';
    ov.innerHTML="<div class='ta-modal'>"
        +"<div class='ta-mhd'><span class='ta-mic'>⚠️</span><span class='ta-mtt'>"+_taLang.titleAssist+"</span></div>"
        +"<div class='ta-mbd'>"+msg+"</div>"
        +"<div class='ta-mft'>"
        +"<button type='button' class='ta-btn ta-cn'>"+_taLang.btnCancel+"</button>"
        +"<button type='button' class='ta-btn ta-ok'>"+_taLang.btnConfirm+"</button>"
        +"</div></div>";
    document.body.appendChild(ov);
    ov.querySelectorAll('.ta-btn')[1].onclick=function(){ov.remove();onConfirm();};
    ov.querySelectorAll('.ta-btn')[0].onclick=function(){ov.remove();};
}

function showPrompt(msg, defaultVal, callback){
    injectStyles();
    var ov=document.createElement('div');
    ov.className='ta-ov';
    ov.innerHTML="<div class='ta-modal'>"
        +"<div class='ta-mhd'><span class='ta-mic'>🎯</span><span class='ta-mtt'>"+_taLang.titleAssist+"</span></div>"
        +"<div class='ta-mbd'>"+msg+"<br><input class='ta-inp' id='ta-pi' type='text' value='"+defaultVal+"'></div>"
        +"<div class='ta-mft'>"
        +"<button type='button' class='ta-btn ta-cn'>"+_taLang.btnCancel+"</button>"
        +"<button type='button' class='ta-btn ta-ok'>"+_taLang.btnAccept+"</button>"
        +"</div></div>";
    document.body.appendChild(ov);
    var inp=ov.querySelector('#ta-pi');
    setTimeout(function(){inp.focus();inp.select();},50);
    function accept(){var v=inp.value;ov.remove();callback(v);}
    ov.querySelectorAll('.ta-btn')[1].onclick=accept;
    ov.querySelectorAll('.ta-btn')[0].onclick=function(){ov.remove();callback(null);};
    inp.onkeydown=function(ev){if(ev.key==='Enter')accept();};
}

function showThemePanel(){
    var existing = document.getElementById('ta-theme-panel');
    if(existing){existing.remove();return;}
    injectStyles();
    var curKey = getCurrentTATheme();
    var items = Object.keys(TA_THEMES).map(function(k){
        var th = TA_THEMES[k];
        return "<div class='ta-theme-item"+(k===curKey?' ta-theme-active':'')+"' data-theme='"+k+"' onclick='applyTATheme(\""+k+"\")'>"
            +"<div class='ta-theme-dot' style='background:linear-gradient(135deg,"+th.accent+","+th.bg2+")'></div>"
            +"<span class='ta-theme-name'>"+th.emoji+" "+th.name+"</span>"
            +"</div>";
    }).join('');
    var panel = document.createElement('div');
    panel.id = 'ta-theme-panel';
    panel.className = 'ta-theme-panel';
    panel.innerHTML = "<div class='ta-mhd'><span class='ta-mic'>🎨</span><span class='ta-mtt'>"+_taLang.themeTitle+"</span>"
        +"<button type='button' class='ta-close-btn' onclick=\"document.getElementById('ta-theme-panel').remove()\">✕</button></div>"
        +"<div class='ta-theme-list'>"+items+"</div>";
    document.body.appendChild(panel);
    setTimeout(function(){
        function outsideClick(ev){
            if(!panel.contains(ev.target) && ev.target.id !== 'ta-settings-btn'){
                panel.remove();
                document.removeEventListener('click', outsideClick);
            }
        }
        document.addEventListener('click', outsideClick);
    }, 10);
}

function toggleTutorial(){
    var existing = document.getElementById('ta-tutorial-ov');
    if(existing){existing.remove();return;}
    injectStyles();
    var ov = document.createElement('div');
    ov.id = 'ta-tutorial-ov';
    ov.className = 'ta-ov';
    ov.innerHTML = "<div class='ta-modal ta-modal-lg'>"
        +"<div class='ta-mhd'><span class='ta-mic'>❓</span><span class='ta-mtt'>"+_taLang.tutorialTitle+"</span>"
        +"<button type='button' class='ta-close-btn' onclick=\"document.getElementById('ta-tutorial-ov').remove()\">✕</button></div>"
        +"<div class='ta-mbd'>"
        +"<p>"+_taLang.tutorialBody+"</p>"
        +"<h5>"+_taLang.hitTitle+"</h5><p>"+_taLang.hitBody+"</p>"
        +"<h5>"+_taLang.testTitle+"</h5><p>"+_taLang.testBody+"</p>"
        +"</div>"
        +"<div class='ta-mft'><button type='button' class='ta-btn ta-ok' onclick=\"document.getElementById('ta-tutorial-ov').remove()\">Cerrar</button></div>"
        +"</div>";
    ov.addEventListener('click', function(ev){ if(ev.target === ov) ov.remove(); });
    document.body.appendChild(ov);
}

// ── Core variables ─────────────────────────────────────────────────────────────
var millisReference, changeMillis, lastChange,
    timerInterval, startupInterval,
    lastArrival, first = true, changed = false, taCtx = null,
    runTimes,
    hitMs = getStorage("hit_ms"),
    calibrationTime = getStorage("offset_ms"),
    imgSrc = {
        green:        "https://dsen.innogamescdn.com/asset/04d88c84/graphic/dots/green.png",
        yellow:       "https://dsen.innogamescdn.com/asset/04d88c84/graphic/dots/yellow.png",
        red:          "https://dsen.innogamescdn.com/asset/04d88c84/graphic/dots/red.png",
        questionmark: "https://dsen.innogamescdn.com/asset/6be9bf502a/graphic/questionmark.png",
        watchtower:   "https://dsen.innogamescdn.com/asset/04d88c84/graphic/big_buildings/watchtower1.png"
    };

    injectStyles();
    applyTATheme(getCurrentTATheme());

    if("place" != game_data.screen) {
        showToast(_taLang.mustRunFromRally,'warn');
    } else if(2 == window.location.href.split("try=").length){
        if(null == runTimes ? runTimes = 1:runTimes++, 1 == runTimes) setTimeout(function(){addDisplay();},50);
        else {
            showModal(_taLang.alreadyRunning, function(){ clearStorage(); });
        }
    } else {
        null == runTimes && (runTimes = 0);
    }

    // ── Timer core (server-time based, mirrors original) ──────────────────────

    function timer(){
        var arrival = $(".relative_time")[0].innerHTML,
            d = new Date(),
            now = d.getTime();
        if(lastArrival != arrival && changed == false){
            $("#second_display")[0].innerHTML = arrival.split(":")[2];
            changeMillis = now;
            changed = true;
        }
        if((now - changeMillis >= Number($("#hit_input")[0].value) + calibrationTime) && (changed == true)){
            changed = false;
            resetTimer(arrival, false);
            return;
        }
        if(now - 5 > lastChange){
            startCanvas(lastChange - millisReference, now - millisReference);
            lastChange = now;
        }
    }

    function resetTimer(arrival, start){
        clearInterval(timerInterval);
        clearInterval(startupInterval);
        lastArrival = arrival;
        var d = new Date();
        millisReference = d.getTime();
        lastChange = d.getTime();
        first = true;
        if(start){
            startupInterval = setInterval(startupTimer, 2);
        } else {
            var canvas = document.getElementById("millis_canvas");
            taCtx = canvas.getContext("2d");
            var th = TA_THEMES[getCurrentTATheme()] || TA_THEMES.classic;
            taCtx.strokeStyle = th.stroke;
            taCtx.lineWidth = 3;
            taCtx.clearRect(0, 0, 160, 160);
            timerInterval = setInterval(timer, 2);
        }
    }

    function startupTimer(){
        var arrival = $(".relative_time")[0].innerHTML,
            d = new Date(),
            now = d.getTime();
        if(lastArrival != arrival && changed == false){
            changed = true;
            $("#second_display")[0].innerHTML = arrival.split(":")[2];
            changeMillis = now;
        }
        if((now - changeMillis >= Number($("#hit_input")[0].value) + calibrationTime) && (changed == true)){
            clearInterval(startupInterval);
            resetTimer(arrival, false);
            return;
        }
    }

    function startCanvas(lastMs, currentMs){
        if(!taCtx) return;
        var circleRef = -1.6;
        if(first){ first = false; lastMs = 0; }
        taCtx.beginPath();
        taCtx.arc(75, 75, 50, circleRef + lastMs/100000 * 628, circleRef + currentMs/100000 * 628);
        taCtx.stroke();
    }

    // ── UI functions ──────────────────────────────────────────────────────────

    function getArrivalSeconds() {
        var tbody = $("#date_arrival").parent().parent()[0];
        for(var t=2; t<tbody.children.length; t++){
            try{
                var cell = tbody.children[t].children[1];
                if(cell && cell.innerHTML.match(":")){
                    return 1e3 * Number(cell.innerHTML.split(":")[2]);
                }
            }catch(ex){ console.log(_taLang.errConsoleArrival+ex); }
        }
        return 0;
    }

    function addDisplay() {
        try {
            var e = $("#date_arrival").closest('tbody')[0] || $("#date_arrival").parent().parent()[0];
            var n = e.children[e.children.length-1];

            var newTh = document.createElement('th');
            newTh.setAttribute('colspan','4');
            newTh.innerHTML = "<span style='white-space:nowrap'>" + _taLang.titleAssist + "</span>"
                + " <button type='button' onclick='toggleTutorial()' style='background:none;border:1px solid #8a6a2a;border-radius:50%;color:#c8982a;cursor:pointer;font-size:11px;font-weight:bold;width:16px;height:16px;line-height:14px;padding:0;vertical-align:middle'>?</button>";
            e.children[0].appendChild(newTh);

            var s = document.createElement("TD");
            s.setAttribute('rowspan', e.children.length-2);
            s.setAttribute('colspan', 2);
            s.setAttribute('style', 'line-height:1px;text-align:center');
            s.innerHTML = "<div><h2 style='position:absolute;display:block;margin-top:54px;margin-left:63px' id='second_display'></h2>"
                + "<canvas id='millis_canvas' width='150px' height='130px' style='margin-top:-20px'></canvas></div>";

            var l = document.createElement("TD");
            l.setAttribute('rowspan', e.children.length-2);
            l.setAttribute('colspan', 2);
            l.setAttribute('style', 'padding:0;vertical-align:middle;text-align:center;overflow:hidden;min-width:200px');
            l.innerHTML = "<img src='https://i.imgur.com/FMiLDaZ.png' style='height:260px;width:auto;display:block;margin:0 auto;opacity:0.9'>";

            var controls = document.createElement("TD");
            controls.setAttribute('colspan', 4);
            controls.setAttribute('style', 'vertical-align:middle;padding:4px 0');
            controls.innerHTML = "<div style='display:flex;align-items:center;justify-content:space-between'>"
                + "<span style='white-space:nowrap'>"
                + "<button id='practice_button' type='button' class='btn btn-recruit' onclick='practiceFunction()' style='width:80px'>" + _taLang.btnTest + "</button>"
                + "<span style='margin-left:6px;white-space:nowrap'>" + _taLang.labelHit + "<input style='width:30px' id='hit_input' title='Millisecond to hit' type='text' onchange='storeData(\"hit_ms\")' value='" + hitMs + "'></span>"
                + "</span>"
                + "<button id='ta-settings-btn' type='button' onclick='showThemePanel()' title='Tema visual'>🎨</button>"
                + "</div>";

            $(".village_anchor").parent().parent()[0].appendChild(s);
            $(".village_anchor").parent().parent()[0].appendChild(l);
            n.appendChild(controls);

            $("#ds_body")[0].setAttribute("onsubmit","practiceFunction()");
            resetTimer($(".relative_time")[0].innerHTML, true);

        }catch(err){
            console.log(_taLang.errConsoleTable+err);
        }
    }

    function practiceFunction(){
        var d = new Date(),
            now = d.getTime(),
            missMillis,
            buttonText = [_taLang.btnTest, _taLang.btnStart],
            buttonDOM = $('#practice_button')[0];

        if(buttonDOM.innerHTML == buttonText[0]){
            clearInterval(timerInterval);
            buttonDOM.innerHTML = buttonText[1];
            if(now - millisReference > 500){
                missMillis = '-' + String(1000 - (now - millisReference));
            } else {
                missMillis = '+' + String(now - millisReference);
            }
            localStorage.missMillis = missMillis;
        } else {
            buttonDOM.innerHTML = buttonText[0];
            resetTimer($(".relative_time")[0].innerHTML, false);
        }
    }

function storeData(e,t){
        var i=localStorage.timeAssistant.split(","),
            n=new Date,s="";
        if("hit_ms"==e){
            hitMs=$("#hit_input")[0].value;
            isNaN(hitMs)&&($("#hit_input")[0].value=getStorage("hit_ms"));
            hitMs=isNaN(Number(hitMs))?getStorage("hit_ms"):Number(hitMs);
            i[0]=hitMs;
        }else if("offset_ms"==e){
            var offsetMs=$("#offset_input")[0].value;
            isNaN(offsetMs)&&($("#offset_input")[0].value=getStorage("offset_ms"));
            isNaN(Number(offsetMs))?offsetMs=getStorage("offset_ms"):(offsetMs=Number(offsetMs));
            i[1]=offsetMs;
            calibrationTime=Number(offsetMs);
            i[i.length-2]=n.getTime();
        }else if("offset"==e){
            t=isNaN(Number(t))?getStorage("offset_ms"):Number(t);
            i[1]=t;
            calibrationTime=Number(t);
            i[i.length-2]=n.getTime();
            var inp=document.getElementById('offset_input');
            if(inp) inp.value=t;
        }else if("last_hit"==e){
            i[2]=t;
        }else if("const_offset"==e){
            t=isNaN(Number(t))?getStorage("const_offset"):Number(t);
            i[3]=t;
            i[i.length-1]=n.getTime();
        }
        for(var a=0;a<i.length-1;a++) s+=i[a]+",";
        s+=i[i.length-1];
        localStorage.setItem("timeAssistant",s);
    }

    function getStorage(e){
        var t,i=localStorage.timeAssistant,
            n=["hit_ms","offset_ms","last_hit","const_offset","last_set_offset","last_set_const"];
        if(null==i) return i="0,0,00:000,0,0,0",localStorage.setItem("timeAssistant",i),0;
        i=i.split(",");
        for(var s=0;s<n.length;s++) e==n[s]&&(t=2==s?i[s]:Number(i[s]));
        return t;
    }

    function clearStorage(){
        localStorage.removeItem("timeAssistant");
        location.reload();
    }

