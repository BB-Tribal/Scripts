/*
 * Script Name: Timing Assist
 * Version: v1.9
 * Modified by: Black_Lottus
 */

var _taLang = {
    mustRunFromRally:   "Este script debe ejecutarse desde el punto de reunión."
                      + "\nEjecutarlo durante un envío de comando añadirá asistencia de milisegundos."
                      + "\nEjecutarlo después del envío mostrará cuántos milisegundos fallaste y te permitirá recalibrar.",
    alreadyRunning:     "El script ya está en ejecución. ¿Deseas borrar las variables almacenadas? (Puede solucionar errores recurrentes)",
    titleAssist:        "Asistente de Tiempos",
    btnTest:            "Test",
    btnStart:           "Iniciar",
    labelHit:           "Hit: ",
    labelOffset:        "Offset: ",
    labelTime:          "Hora: ",
    tooltipMissed:      "Fallaste por",
    tutorialTitle:      "Asistente de Tiempos — Ayuda",
    tutorialBody:       "El asistente de tiempos te ayuda a cronometrar tus ataques con precisión mostrando gráficamente los milisegundos en un círculo. El círculo se completa cuando el milisegundo actual alcanza el milisegundo objetivo. "
                      + "El botón \"Test\" sirve para practicar el timing antes de enviar un comando.",
    calibTitle:         "Calibración",
    calibBody:          "El asistente necesita calibrarse regularmente con el reloj de Tribal Wars para una sincronización precisa. Sigue estos pasos:",
    step1Title:         "Paso 1 — Haz clic en el indicador de color.",
    step1Body:          "Esto sincroniza el reloj de forma aproximada, sin modificar el \"offset\" de ajuste fino. Hazlo cada hora aproximadamente.",
    step2Title:         "Paso 2 — Envía un comando de calibración.",
    step2Body:          "Envía un ataque o apoyo para obtener el tiempo de llegada real frente al estimado. Es el paso más importante y debe repetirse cada 5-7 minutos. Se completa en el paso 3.",
    step3Title:         "Paso 3 — Ejecuta el script tras enviar el comando e introduce el tiempo de llegada real.",
    step3Body:          "Ejecutar el script en el punto de reunión después de un envío pedirá al usuario el tiempo de llegada real y mostrará el estimado. Introduce el tiempo (s:ms) para actualizar el offset.",
    calibNote:          "El script debería quedar calibrado. Repite los pasos 2 y 3 para verificar si estima correctamente (±5-20 ms según velocidad de internet). Para errores recurrentes, ejecuta el script dos veces en esta página y acepta para reiniciar las variables.",
    colorTitle:         "Indicadores de color",
    colorBody:          "Los indicadores muestran cuánto tiempo lleva sin sincronizarse el reloj.",
    colorRed:           " — Sin sincronización aproximada ni fina",
    colorYellow:        " — Sincronización aproximada o fina (solo una)",
    colorGreen:         " — Ambas sincronizaciones activas",
    colorNote:          "<b>Nota:</b> Los colores no reflejan necesariamente la calidad de la sincronización. Para asegurarte, verifica si el script estima correctamente el tiempo de llegada tras un comando de prueba (±5-20 ms).",
    promptEstimated:    "El ms estimado de llegada es ",
    promptInput:        "Introduce el tiempo de llegada real (s:ms)",
    errorOffset:        "No se pudo calcular el offset... Por favor, inténtalo de nuevo.",
    errorManual:        "Algo salió mal... Introduce el offset manualmente. 'Tiempo real - Tiempo estimado' = offset.",
    errConsoleInput:    "Algo salió mal al pedir datos al usuario. Verifica la entrada.",
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
    if (ctx) { ctx.strokeStyle = th.stroke; ctx.clearRect(0,0,160,160); }
    // update active dot in panel if open
    document.querySelectorAll('.ta-theme-item').forEach(function(el){
        el.classList.toggle('ta-theme-active', el.dataset.theme === key);
    });
}

function getCurrentTATheme() {
    return localStorage.getItem('ta_theme') || 'classic';
}

function injectStyles(){
    if(document.getElementById('ta-styles')) return;
    var s=document.createElement('style');
    s.id='ta-styles';
    s.innerHTML=
        // CSS vars defaults (Classic theme)
        ':root{--ta-bg:#1a1208;--ta-bg2:#2a1f0e;--ta-bg3:#0f0a04;--ta-border:#8a6a2a;--ta-accent:#c8982a;--ta-text:#e8c87a;--ta-text2:#d4b87a;--ta-stroke:#c8982a}'
        // Toasts
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
       // Modal overlay (uses CSS vars)
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
       // Theme panel
       +'.ta-theme-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:100000;background:var(--ta-bg);border:1px solid var(--ta-border);border-radius:12px;box-shadow:0 8px 40px rgba(0,0,0,.9);width:320px;max-width:92vw;font-family:Arial,sans-serif;overflow:hidden;animation:ta-fi .2s ease}'
       +'.ta-theme-list{display:flex;flex-direction:column;gap:4px;padding:10px}'
       +'.ta-theme-item{display:flex;align-items:center;gap:12px;padding:9px 12px;border-radius:8px;border:1.5px solid transparent;cursor:pointer;transition:border-color .15s,background .15s}'
       +'.ta-theme-item:hover{background:var(--ta-bg2)}'
       +'.ta-theme-item.ta-theme-active{border-color:var(--ta-accent) !important;background:var(--ta-bg2)}'
       +'.ta-theme-dot{width:24px;height:24px;border-radius:7px;flex-shrink:0}'
       +'.ta-theme-name{font-size:13px;font-weight:600;color:var(--ta-text)}'
       // Settings button
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
    // Toggle: if already open, close it
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
    // Close on outside click
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
    // Use our own overlay instead of TW's popup_box_container to avoid fader conflicts
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
        +"<h5>"+_taLang.calibTitle+"</h5><p>"+_taLang.calibBody+"</p>"
        +"<p><b>"+_taLang.step1Title+"</b><br>"+_taLang.step1Body+"</p>"
        +"<p><b>"+_taLang.step2Title+"</b><br>"+_taLang.step2Body+"</p>"
        +"<p><b>"+_taLang.step3Title+"</b><br>"+_taLang.step3Body+"</p>"
        +"<p>"+_taLang.calibNote+"</p>"
        +"<h5>"+_taLang.colorTitle+"</h5><p>"+_taLang.colorBody+"</p>"
        +"<p><img src='"+imgSrc.red+"' style='vertical-align:middle'>"+_taLang.colorRed+"</p>"
        +"<p><img src='"+imgSrc.yellow+"' style='vertical-align:middle'>"+_taLang.colorYellow+"</p>"
        +"<p><img src='"+imgSrc.green+"' style='vertical-align:middle'>"+_taLang.colorGreen+"</p>"
        +"<p>"+_taLang.colorNote+"</p>"
        +"</div>"
        +"<div class='ta-mft'><button type='button' class='ta-btn ta-ok' onclick=\"document.getElementById('ta-tutorial-ov').remove()\">Cerrar</button></div>"
        +"</div>";
    // Click on backdrop closes modal
    ov.addEventListener('click', function(ev){ if(ev.target === ov) ov.remove(); });
    document.body.appendChild(ov);
}

var c, ctx, circleReference,
    lastMillis, lastTimingMillis,
    timerInterval, constOffset, runTimes,
    armed=false, hasFired=false, autoSendTimeout, countdownInterval,
    hitMs=getStorage("hit_ms"),
    milliPiFraction=.00628319, calibrationTime=getStorage("offset_ms"),
    imgSrc = {
        green:      "https://dsen.innogamescdn.com/asset/04d88c84/graphic/dots/green.png",
        yellow:     "https://dsen.innogamescdn.com/asset/04d88c84/graphic/dots/yellow.png",
        red:        "https://dsen.innogamescdn.com/asset/04d88c84/graphic/dots/red.png",
        questionmark:"https://dsen.innogamescdn.com/asset/6be9bf502a/graphic/questionmark.png",
        watchtower: "https://dsen.innogamescdn.com/asset/04d88c84/graphic/big_buildings/watchtower1.png"
    };

    // Apply saved theme on load
    injectStyles();
    applyTATheme(getCurrentTATheme());

    if("place" != game_data.screen) {
        showToast(_taLang.mustRunFromRally,'warn');
    }else if(2 == window.location.href.split("try=").length){
        if(null == runTimes ? runTimes = 1:runTimes++, 1 == runTimes) setTimeout(function(){addDisplay()},50);
        else {
            showModal(_taLang.alreadyRunning, function(){ clearStorage(); });
        }
    }else null==runTimes&&(runTimes=0), promptCalibration();

    function getArrivalSeconds() {
        var $cell = $('#date_arrival').closest('td');
        var $rel = $cell.find('.relative_time');
        var text = ($rel.length ? $rel.text() : $cell[0].childNodes[0] ? $cell[0].childNodes[0].nodeValue : '').trim();
        var parts = text.split(':');
        var sec = Number((parts[parts.length - 1] || '0').replace(/\D.*/, ''));
        return isNaN(sec) ? 0 : sec * 1000;
    }

    function addDisplay() {
        try {
            var e = $("#date_arrival").closest('tbody')[0] || $("#date_arrival").parent().parent()[0];

            var n = e.children[e.children.length-1];
            var i = getArrivalSeconds();
            constOffset = i + getStorage("const_offset");

            // Append header TH without destroying TW's existing DOM nodes
            var newTh = document.createElement('th');
            newTh.setAttribute('colspan','4');
            newTh.innerHTML = "<span style='white-space:nowrap'>" + _taLang.titleAssist + "</span>"
                + " <img src='" + imgSrc.questionmark + "' onclick='toggleTutorial()'"
                + " style='display:inline;height:15px;width:15px;cursor:pointer;vertical-align:middle'>";
            e.children[0].appendChild(newTh);

            // Canvas TD
            var s = document.createElement("TD");
            s.setAttribute('rowspan', e.children.length-2);
            s.setAttribute('colspan', 2);
            s.setAttribute('style', 'line-height:1px;text-align:center');
            s.innerHTML = "<div><h2 style='position:absolute;display:block;margin-top:54px;margin-left:63px' id='second_display'></h2>"
                + "<canvas id='millis_canvas' width='150px' height='130px' style='margin-top:-20px'></canvas></div>";

            // Watchtower TD
            var l = document.createElement("TD");
            l.setAttribute('rowspan', e.children.length-2);
            l.setAttribute('colspan', 2);
            l.setAttribute('style', 'height:1px;text-align:center');
            l.innerHTML = "<img src='" + imgSrc.watchtower + "'>";

            // Test button
            var p = document.createElement("TD");
            p.innerHTML = "<button id='practice_button' type='button' class='btn btn-recruit' onclick='practiceFunction()' style='width:80px'>" + _taLang.btnTest + "</button>";

            // Hit input
            var u = document.createElement("TD");
            u.setAttribute('style','white-space:nowrap');
            u.innerHTML = "<span>" + _taLang.labelHit + "</span><input style='width:30px' id='hit_input' title='Millisecond to hit' type='text' onchange='storeData(\"hit_ms\")' value='" + hitMs + "'>";

            // Offset input + sync indicator
            var g = document.createElement("TD");
            g.setAttribute('style','white-space:nowrap');
            var b,y,T,v=new Date;
            y=v.getTime()-getStorage("last_set_offset")<42e4;
            T=v.getTime()-getStorage("last_set_const")<36e5;
            b=y&&T?imgSrc.green:y||T?imgSrc.yellow:imgSrc.red;
            g.innerHTML = "<span>" + _taLang.labelOffset + "</span>"
                + "<input id='offset_input' type='text' onchange='storeData(\"offset_ms\")' style='width:30px' value='" + calibrationTime + "'>"
                + "<img id='offset_status' src='" + b + "' onclick='getInitialOffset()' style='cursor:pointer;vertical-align:middle;margin-left:4px'>";

            // Arm auto-send button + target time input + countdown
            var armTd = document.createElement("TD");
            armTd.setAttribute('style','white-space:nowrap;padding-left:4px');
            armTd.innerHTML = "<input id='ta-target-time' type='text' placeholder='20:00:00.500'"
                + " style='width:88px;font-family:monospace;font-size:11px' title='Hora exacta de llegada (HH:MM:SS.ms)'>"
                + "<button id='ta-arm-btn' type='button' class='btn btn-recruit' onclick='armAutoSend()'"
                + " style='width:76px;margin-left:3px'>⚡ Armar</button>"
                + "<span id='ta-countdown' style='font-family:monospace;font-size:11px;"
                + "color:var(--ta-accent,#c8982a);margin-left:4px;min-width:55px;display:inline-block'></span>";

            // Theme button
            var thTd = document.createElement("TD");
            thTd.setAttribute('style','white-space:nowrap;padding-left:4px');
            thTd.innerHTML = "<button id='ta-settings-btn' type='button' onclick='showThemePanel()' title='Tema visual'>🎨</button>";

            $(".village_anchor").parent().parent()[0].appendChild(s);
            $(".village_anchor").parent().parent()[0].appendChild(l);
            n.appendChild(p);
            n.appendChild(u);
            n.appendChild(g);
            n.appendChild(armTd);
            n.appendChild(thTd);

            $("#ds_body")[0].setAttribute("onsubmit","sendFunction()");
            timerInterval = setInterval(drawCircle, 5);

        }catch(e){
            console.log(_taLang.errConsoleTable+e);
        }
    }

    function drawCircle(){
        if(null==c){
            c = document.getElementById("millis_canvas");
            ctx = c.getContext("2d");
            circleReference = -Math.PI/2;
            lastMillis = 0;
            lastTimingMillis = 0;
            hitMs = $("#hit_input")[0].value;
            // Apply theme stroke color
            var th = TA_THEMES[getCurrentTATheme()] || TA_THEMES.classic;
            ctx.strokeStyle = th.stroke;
            ctx.lineWidth = 3;
            // Init second display
            var p = $('#date_arrival').closest('td').find('.relative_time').text().trim().split(':');
            $("#second_display")[0].innerHTML = (p[p.length-1]||'00').replace(/\D.*/,'');
        }

        var e = new Date,
            t = (e = new Date(e.getTime()+calibrationTime+constOffset)).getMilliseconds(),
            i = new Date(e.getTime()-hitMs).getMilliseconds();

        if(t < lastMillis){
            lastMillis = t;
            var sec = e.getSeconds();
            $("#second_display")[0].innerHTML = (sec<10?'0':'')+sec;
        }

        if(i < lastTimingMillis){
            ctx.clearRect(0,0,160,160);
            lastTimingMillis=0;
        }
        ctx.beginPath();
        ctx.arc(75,75,50,circleReference+lastTimingMillis*milliPiFraction,circleReference+i*milliPiFraction);
        ctx.stroke();
        lastMillis = t;
        lastTimingMillis = i;
    }

    function practiceFunction(){
        var e=new Date,
            t=(e=new Date(e.getTime()+calibrationTime+constOffset)).getMilliseconds();
        var buttonText=[_taLang.btnTest,_taLang.btnStart];
        var buttonDOM=$("#practice_button")[0];
        hitMs=$("#hit_input")[0].value;
        if(buttonDOM.innerHTML==buttonText[0]){
            clearInterval(timerInterval);
            buttonDOM.innerHTML=buttonText[1];
            $("#miss_display")[0].innerHTML = Math.abs(t-hitMs)<=500 ? String(t-hitMs) : String(-(1e3-(t-hitMs)));
        }else{
            buttonDOM.innerHTML=buttonText[0];
            timerInterval=setInterval(drawCircle,5);
        }
        lastTimingMillis=1200;
    }

    function sendFunction(){
        var e=new Date;
        clearInterval(timerInterval);
        var t=(e=new Date(e.getTime()+calibrationTime+constOffset)).getSeconds(),
            i=e.getMilliseconds();
        storeData("last_hit",String(t)+":"+String(i));
    }

    function updateColor(){
        var t,i,n=new Date;
        t=n.getTime()-getStorage("last_set_offset")<42e4;
        i=n.getTime()-getStorage("last_set_const")<36e5;
        $("#offset_status")[0].src = t&&i?imgSrc.green:t||i?imgSrc.yellow:imgSrc.red;
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
            setTimeout(function(){updateColor();},250);
        }else if("offset"==e){
            t=isNaN(Number(t))?getStorage("offset_ms"):Number(t);
            i[1]=t;
            i[i.length-2]=n.getTime();
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

    function promptCalibration(){
        if(null==localStorage.timeAssistant) return;
        try{
            var estRaw=getStorage("last_hit"), tParts=estRaw.split(":");
            var estimatedMs=1e3*Number(tParts[0])+Number(tParts[1]);
            1==tParts[0].length&&(tParts[0]="0"+tParts[0]);
            1==tParts[1].length?tParts[1]="00"+tParts[1]:2==tParts[1].length&&(tParts[1]="0"+tParts[1]);
            var estimatedStr=tParts[0]+":"+tParts[1];

            injectStyles();

            // Persistent banner at top of page
            var banner=document.createElement('div');
            banner.id='ta-calib-banner';
            banner.style.cssText='position:fixed;top:0;left:0;right:0;z-index:99999;'
                +'background:linear-gradient(90deg,var(--ta-bg2,#2a1f0e),var(--ta-bg,#1a1208));'
                +'border-bottom:2px solid var(--ta-accent,#c8982a);padding:10px 16px;'
                +'display:flex;align-items:center;gap:10px;font-family:Arial,sans-serif;'
                +'font-size:13px;color:var(--ta-text,#e8c87a);box-shadow:0 2px 12px rgba(0,0,0,.6)';
            banner.innerHTML='<span style="font-size:16px">🎯</span>'
                +'<span>Hit estimado: <b>'+estimatedStr+'</b> &mdash; haz clic en el ataque que acabas de enviar</span>'
                +'<button id="ta-calib-cancel" type="button" style="margin-left:auto;background:transparent;'
                +'border:1px solid var(--ta-border,#8a6a2a);color:var(--ta-text2,#d4b87a);'
                +'border-radius:4px;padding:3px 10px;cursor:pointer;font-size:12px">Cancelar</button>';
            document.body.appendChild(banner);

            // Highlight clickable rows
            var $rows=$('tr.command-row');
            $rows.css({'outline':'2px solid var(--ta-accent,#c8982a)','cursor':'pointer'});
            $rows.on('mouseenter.tacalib',function(){$(this).css('background','rgba(200,152,42,.12)');});
            $rows.on('mouseleave.tacalib',function(){$(this).css('background','');});

            function cleanup(){
                var b=document.getElementById('ta-calib-banner');
                if(b) b.remove();
                $rows.css({'outline':'','cursor':'','background':''}).off('.tacalib');
            }

            document.getElementById('ta-calib-cancel').onclick=cleanup;

            $rows.on('click.tacalib',function(){
                // Parse arrival time from second TD: "hoy a las 22:57:54:" + <span class="grey small">162</span>
                var $td=$(this).find('td').eq(1);
                var realMs=parseInt($td.find('.grey.small').text().trim());
                var rawText=$td[0].childNodes[0]?$td[0].childNodes[0].nodeValue:'';
                var match=rawText.match(/(\d{1,2}):(\d{2}):(\d{2})/);
                var realSec=match?parseInt(match[3]):NaN;

                cleanup();

                if(isNaN(realSec)||isNaN(realMs)){
                    showToast('No se pudo leer el tiempo de llegada','error');
                    return;
                }

                var n=realSec*1000+realMs;
                estimatedMs-15e3>n?n+=6e4:n-15e3>estimatedMs&&(estimatedMs+=6e4);
                var s=n-estimatedMs;
                s=0==runTimes?Number(s+calibrationTime):Number(s);
                if(isNaN(s)){
                    storeData("offset",0);
                    showToast(_taLang.errorOffset,'error');
                }else{
                    runTimes++;
                    storeData("offset",s);
                    showToast('Calibrado: offset '+(s>=0?'+':'')+s+' ms','info');
                }
            });

        }catch(err){
            console.log(_taLang.errConsoleInput);
            showToast(_taLang.errorManual,'error');
        }
    }

    function parseTargetTime(str){
        // Accepts HH:MM:SS.ms or HH:MM:SS:ms
        var m = str.trim().match(/^(\d{1,2}):(\d{2}):(\d{2})[.:](\d{1,3})$/);
        if(!m) return null;
        var hh=parseInt(m[1]), mm=parseInt(m[2]), ss=parseInt(m[3]);
        var msStr=m[4];
        // Pad right to 3 digits: "5" → 500, "50" → 500, "500" → 500
        while(msStr.length < 3) msStr += '0';
        var ms = parseInt(msStr);
        var target = new Date();
        target.setHours(hh, mm, ss, ms);
        // If the time has already passed (> 5s ago), schedule for next day
        if(target.getTime() < Date.now() - 5000) target.setDate(target.getDate() + 1);
        return target.getTime();
    }

    function fmtCountdown(rem){
        if(rem > 60000) return Math.floor(rem/60000)+'m '+((rem%60000)/1000).toFixed(1)+'s';
        if(rem > 1000)  return (rem/1000).toFixed(2)+'s';
        return rem+'ms';
    }

    function armAutoSend(){
        var btn = document.getElementById('ta-arm-btn');
        var cd  = document.getElementById('ta-countdown');
        if(hasFired) return;
        if(armed){
            clearTimeout(autoSendTimeout);
            clearInterval(countdownInterval);
            armed = false;
            if(btn) btn.textContent = '⚡ Armar';
            if(cd)  cd.textContent  = '';
            return;
        }

        var delay;
        var targetStr = (document.getElementById('ta-target-time')||{}).value || '';

        if(targetStr.trim()){
            // ── Absolute time mode ─────────────────────────────────────────
            var targetTs = parseTargetTime(targetStr.trim());
            if(!targetTs){ showToast('Formato inválido. Usa HH:MM:SS.ms (ej: 20:00:00.500)', 'error'); return; }
            var constOff = getStorage("const_offset");
            // Fire calibrationTime ms early so the server processes it at targetTs
            delay = targetTs - Date.now() - calibrationTime - constOff;
            if(delay < 0){ showToast('La hora objetivo ya ha pasado', 'error'); return; }
            if(delay > 7200000){ showToast('Hora objetivo demasiado lejana (máx 2h)', 'warn'); return; }
        } else {
            // ── Next hitMs boundary mode (fallback) ────────────────────────
            hitMs = Number(document.getElementById('hit_input').value) || hitMs;
            var now = Date.now();
            var adjMs = (now + calibrationTime + constOffset) % 1000;
            delay = ((hitMs - adjMs) % 1000 + 1000) % 1000;
            if(delay < 30) delay += 1000;
        }

        armed = true;
        if(btn) btn.textContent = '⬛ Cancelar';
        var fireAt = Date.now() + delay;
        if(cd) cd.textContent = fmtCountdown(delay);
        var tickMs = delay > 2000 ? 100 : 25;

        countdownInterval = setInterval(function(){
            var rem = fireAt - Date.now();
            if(cd) cd.textContent = rem > 0 ? fmtCountdown(rem) : '⚡';
        }, tickMs);

        autoSendTimeout = setTimeout(function(){
            clearInterval(countdownInterval);
            hasFired = true;
            armed = false;
            clearInterval(timerInterval);
            sendFunction();
            var submitBtn = document.querySelector('#ds_body input[type="submit"], #ds_body button[type="submit"]');
            if(submitBtn) submitBtn.click();
            else HTMLFormElement.prototype.submit.call(document.getElementById('ds_body'));
        }, delay);
    }

    function getInitialOffset(){
        var t=new Date;
        var sTime=Timing.getCurrentServerTime();
        storeData("const_offset",Math.round(sTime-t.getTime()));
        updateColor();
        var e = getArrivalSeconds();
        constOffset = e + (sTime-t.getTime());
    }
