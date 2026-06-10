/*
 * Script Name: Timing Assist
 * Version: v1.3
 * Modified by: Black_Lottus
 */

var lang = {
    mustRunFromRallyTitle:  "Pantalla incorrecta",
    mustRunFromRally:       "Este script debe ejecutarse desde el <b>punto de reunión</b>."
                          + "<br>Ejecútalo durante un envío para obtener asistencia de milisegundos."
                          + "<br>Ejecútalo <i>después</i> del envío para ver cuántos ms fallaste y recalibrar.",
    alreadyRunning:         "El script ya está en ejecución.<br>¿Deseas borrar las variables almacenadas?<br><small style='color:#a08040'>(Puede solucionar errores recurrentes)</small>",
    titleAssist:            "Asistente de Tiempos",
    btnTest:                "Test",
    btnStart:               "Iniciar",
    labelHit:               "Hit: ",
    labelOffset:            "Offset: ",
    labelTime:              "Hora: ",
    tooltipMissed:          "Fallaste por",
    errorOffsetTitle:       "Error de calibración",
    errorOffset:            "No se pudo calcular el offset.<br>Por favor, inténtalo de nuevo.",
    errorManualTitle:       "Error inesperado",
    errorManual:            "Algo salió mal. Introduce el offset manualmente.<br><small><i>Tiempo real − Tiempo estimado = offset</i></small>",
    promptTitle:            "Calibración de offset",
    promptEstimated:        "Tiempo estimado de llegada: <b>",
    promptInput:            "Introduce el tiempo de llegada real (s:ms):",
    errConsoleInput:        "Algo salió mal al pedir datos al usuario. Verifica la entrada.",
    errConsoleArrival:      "No se pudo identificar el segundo de llegada:\n",
    errConsoleTable:        "No se pudo encontrar la tabla...\n",
    helpTitle:              "Asistente de Tiempos — Guía de uso",
    helpIntro:              "El asistente te ayuda a cronometrar ataques con precisión visualizando los milisegundos en un círculo. Cuando el arco completa la vuelta, el milisegundo actual coincide con el objetivo.",
    helpFlowTitle:          "Flujo de calibración",
    helpStep1Title:         "Clic en el indicador de color",
    helpStep1Body:          "Sincroniza el reloj de forma <b>aproximada</b> con el servidor. Hazlo cada hora para mantener el reloj al día. No modifica el offset fino.",
    helpStep2Title:         "Envía un comando de calibración",
    helpStep2Body:          "Envía un ataque o apoyo a cualquier aldea. Esto te dará el tiempo de llegada real que necesitas para el paso 3. Repite cada 5–7 minutos.",
    helpStep3Title:         "Ejecuta el script tras el envío e introduce el tiempo real",
    helpStep3Body:          "Vuelve al punto de reunión y ejecuta el script. Aparecerá un diálogo con el tiempo <i>estimado</i>; introduce el tiempo <i>real</i> (s:ms) para ajustar el offset automáticamente.",
    helpStep4Title:         "Comprueba y repite",
    helpStep4Body:          "Repite los pasos 2 y 3 para verificar que el script estima correctamente (±5–20 ms según la velocidad de internet). Si hay errores recurrentes, ejecuta el script dos veces en la misma página para resetear.",
    helpColorTitle:         "Indicadores de color",
    helpColorBody:          "Muestran hace cuánto tiempo se sincronizó el reloj:",
    helpColorRed:           "Sin sincronización aproximada ni fina",
    helpColorYellow:        "Solo una de las dos sincronizaciones activa",
    helpColorGreen:         "Ambas sincronizaciones activas y recientes",
    helpColorNote:          "El color no garantiza precisión absoluta. Verifica siempre con un comando de prueba."
};

var c, ctx, circleReference,
    lastMillis, lastTimingMillis,
    timerInterval, constOffset, runTimes,
    hitMs=getStorage("hit_ms"),
    milliPiFraction=.00628319, calibrationTime=getStorage("offset_ms"),
    imgSrc = {
        green:        "https://dsen.innogamescdn.com/asset/04d88c84/graphic/dots/green.png",
        yellow:       "https://dsen.innogamescdn.com/asset/04d88c84/graphic/dots/yellow.png",
        red:          "https://dsen.innogamescdn.com/asset/04d88c84/graphic/dots/red.png",
        watchtower:   "https://dsen.innogamescdn.com/asset/04d88c84/graphic/big_buildings/watchtower1.png"
    };

injectStyles();

if("place" != game_data.screen) {
    showToast(lang.mustRunFromRallyTitle, lang.mustRunFromRally, "warning");
} else if(2 == window.location.href.split("try=").length) {
    if(null == runTimes ? runTimes = 1 : runTimes++, 1 == runTimes) {
        setTimeout(function(){ addDisplay(); }, 50);
    } else {
        showConfirm(lang.alreadyRunning, function(){ clearStorage(); });
    }
} else {
    null == runTimes && (runTimes = 0);
    promptCalibration();
}

/* ─── UI helpers ─────────────────────────────────────────── */

function injectStyles() {
    if(document.getElementById("ta-styles")) return;
    var s = document.createElement("style");
    s.id = "ta-styles";
    s.textContent = [
        /* toast */
        "#ta-toast-container{position:fixed;top:20px;right:20px;z-index:100000;display:flex;flex-direction:column;gap:8px;pointer-events:none}",
        ".ta-toast{background:#1c1408;border:1px solid #7a5c14;border-left:4px solid #c9a227;color:#e8d5a3;padding:12px 40px 12px 14px;border-radius:4px;min-width:260px;max-width:360px;font-family:Georgia,serif;font-size:13px;box-shadow:0 6px 20px rgba(0,0,0,.75);position:relative;pointer-events:all;animation:taIn .28s ease both}",
        ".ta-toast.error{border-left-color:#c0392b}",
        ".ta-toast.warning{border-left-color:#e67e22}",
        ".ta-toast.success{border-left-color:#27ae60}",
        ".ta-toast-title{font-weight:bold;margin-bottom:5px;font-size:13px;color:#c9a227}",
        ".ta-toast.error .ta-toast-title{color:#e74c3c}",
        ".ta-toast.warning .ta-toast-title{color:#e67e22}",
        ".ta-toast-x{position:absolute;top:8px;right:10px;cursor:pointer;color:#6a5030;font-size:17px;line-height:1;transition:color .15s}",
        ".ta-toast-x:hover{color:#c9a227}",
        "@keyframes taIn{from{transform:translateX(30px);opacity:0}to{transform:translateX(0);opacity:1}}",
        "@keyframes taOut{to{transform:translateX(30px);opacity:0}}",
        /* overlay */
        "#ta-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.68);z-index:99998;display:flex;align-items:center;justify-content:center;animation:taFade .2s ease both}",
        "@keyframes taFade{from{opacity:0}to{opacity:1}}",
        /* modal */
        ".ta-modal{background:linear-gradient(180deg,#291d0b 0%,#180e04 100%);border:2px solid #8b6914;border-radius:6px;min-width:300px;max-width:520px;width:90%;box-shadow:0 10px 40px rgba(0,0,0,.9);font-family:Georgia,serif;color:#e8d5a3;overflow:hidden}",
        ".ta-modal-head{background:linear-gradient(90deg,#3d2b0e,#5c4012);padding:11px 16px;border-bottom:1px solid #7a5c14;display:flex;align-items:center;justify-content:space-between}",
        ".ta-modal-head h3{margin:0;color:#c9a227;font-size:14px;letter-spacing:.5px}",
        ".ta-modal-head .ta-close-x{cursor:pointer;color:#7a5c14;font-size:18px;line-height:1;transition:color .15s}",
        ".ta-modal-head .ta-close-x:hover{color:#c9a227}",
        ".ta-modal-body{padding:16px;font-size:13px;line-height:1.65;max-height:65vh;overflow-y:auto}",
        ".ta-modal-body p{margin:0 0 10px}",
        ".ta-modal-foot{padding:10px 16px;border-top:1px solid #2d1e08;display:flex;justify-content:flex-end;gap:8px}",
        ".ta-btn{padding:6px 18px;border-radius:3px;cursor:pointer;font-family:Georgia,serif;font-size:12px;border:1px solid #8b6914;transition:filter .15s}",
        ".ta-btn:hover{filter:brightness(1.2)}",
        ".ta-btn-ok{background:linear-gradient(180deg,#7a5c1a,#5c4012);color:#e8d5a3}",
        ".ta-btn-cancel{background:linear-gradient(180deg,#2c2018,#1a1208);color:#907040}",
        ".ta-input{width:100%;padding:7px 9px;background:#0d0a05;border:1px solid #7a5c14;color:#e8d5a3;font-family:Georgia,serif;font-size:13px;border-radius:3px;box-sizing:border-box;margin-top:6px;outline:none}",
        ".ta-input:focus{border-color:#c9a227}",
        /* help modal specifics */
        ".ta-help-intro{background:rgba(201,162,39,.07);border-left:3px solid #c9a227;padding:9px 12px;border-radius:0 4px 4px 0;margin-bottom:14px;font-size:13px}",
        ".ta-help-section{margin-top:14px}",
        ".ta-help-section h4{margin:0 0 8px;color:#c9a227;font-size:13px;border-bottom:1px solid #2d1e08;padding-bottom:5px}",
        ".ta-step{display:flex;gap:10px;margin-bottom:9px;padding:9px 10px;background:rgba(255,255,255,.03);border-radius:4px;border-left:3px solid #5c4012}",
        ".ta-step-num{background:#c9a227;color:#1a1208;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:11px;flex-shrink:0;margin-top:1px}",
        ".ta-step-body b{color:#e8d5a3;display:block;margin-bottom:3px;font-size:12px}",
        ".ta-step-body span{font-size:12px;color:#b09060}",
        ".ta-color-row{display:flex;align-items:center;gap:9px;margin:5px 0;font-size:12px;color:#b09060}",
        ".ta-color-row img{width:12px;height:12px}",
        ".ta-help-note{font-size:11px;color:#7a6040;margin-top:10px;font-style:italic}",
        /* help button */
        ".ta-help-btn{background:linear-gradient(180deg,#5c4012,#3d2b0e);border:1px solid #8b6914;color:#c9a227;width:22px;height:22px;border-radius:50%;cursor:pointer;font-family:Georgia,serif;font-weight:bold;font-size:13px;line-height:1;padding:0;display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;transition:filter .15s}",
        ".ta-help-btn:hover{filter:brightness(1.3)}"
    ].join("");
    document.head.appendChild(s);
}

function showToast(title, html, type) {
    var wrap = document.getElementById("ta-toast-container");
    if(!wrap) {
        wrap = document.createElement("div");
        wrap.id = "ta-toast-container";
        document.body.appendChild(wrap);
    }
    var t = document.createElement("div");
    t.className = "ta-toast" + (type ? " " + type : "");
    t.innerHTML = "<div class='ta-toast-title'>" + title + "</div>"
                + "<div>" + html + "</div>"
                + "<span class='ta-toast-x' onclick='this.parentNode.remove()'>&#x2715;</span>";
    wrap.appendChild(t);
    setTimeout(function(){
        t.style.animation = "taOut .3s ease forwards";
        setTimeout(function(){ t.remove(); }, 310);
    }, 5000);
}

function showConfirm(html, onYes) {
    var overlay = _taOverlay();
    var modal = document.createElement("div");
    modal.className = "ta-modal";
    modal.innerHTML = "<div class='ta-modal-head'><h3>" + lang.titleAssist + "</h3></div>"
                    + "<div class='ta-modal-body'><p>" + html + "</p></div>"
                    + "<div class='ta-modal-foot'>"
                    +   "<button class='ta-btn ta-btn-cancel' id='ta-no'>No</button>"
                    +   "<button class='ta-btn ta-btn-ok' id='ta-yes'>Sí</button>"
                    + "</div>";
    overlay.appendChild(modal);
    modal.querySelector("#ta-yes").onclick = function(){ overlay.remove(); onYes(); };
    modal.querySelector("#ta-no").onclick  = function(){ overlay.remove(); };
}

function showPrompt(title, labelHtml, defaultVal, onOk) {
    var overlay = _taOverlay();
    var inputId = "ta-prompt-input";
    var modal = document.createElement("div");
    modal.className = "ta-modal";
    modal.innerHTML = "<div class='ta-modal-head'><h3>" + title + "</h3></div>"
                    + "<div class='ta-modal-body'>"
                    +   "<p>" + labelHtml + "</p>"
                    +   "<input id='" + inputId + "' class='ta-input' type='text' value='" + (defaultVal||"") + "'>"
                    + "</div>"
                    + "<div class='ta-modal-foot'>"
                    +   "<button class='ta-btn ta-btn-cancel' id='ta-cancel'>Cancelar</button>"
                    +   "<button class='ta-btn ta-btn-ok' id='ta-accept'>Aceptar</button>"
                    + "</div>";
    overlay.appendChild(modal);
    var inp = modal.querySelector("#" + inputId);
    inp.focus(); inp.select();
    function accept() {
        var val = inp.value;
        overlay.remove();
        onOk(val);
    }
    modal.querySelector("#ta-accept").onclick = accept;
    modal.querySelector("#ta-cancel").onclick = function(){ overlay.remove(); onOk(null); };
    inp.onkeydown = function(ev){ if(ev.key === "Enter") accept(); };
}

function _taOverlay() {
    var old = document.getElementById("ta-overlay");
    if(old) old.remove();
    var o = document.createElement("div");
    o.id = "ta-overlay";
    document.body.appendChild(o);
    return o;
}

/* ─── Display ─────────────────────────────────────────────── */

function addDisplay() {
    try {
        for(var e=$("#date_arrival").parent().parent()[0],t=2;t<e.children.length;t++)
            try {
                if(null!=e.children[t].children[1].innerHTML.match(":")) {
                    var i=1e3*Number(e.children[t].children[1].innerHTML.split(":")[2]);
                    break;
                }
            } catch(err) {
                console.log(lang.errConsoleArrival+err);
            }

        var n = e.children[e.children.length-1];
        constOffset = i + getStorage("const_offset");
        e.children[0].innerHTML += "<th colspan='4'>&nbsp;&nbsp;"
            + "<span style='white-space:nowrap'>" + lang.titleAssist + "</span>"
            + "&nbsp;&nbsp;<button class='ta-help-btn' onclick='toggleTutorial()' title='Ayuda'>?</button></th>";

        var s=document.createElement("TD"),
            a=document.createAttribute("rowspan"),
            r=document.createAttribute("colspan"),
            o=document.createAttribute("style");
        a.value=e.children.length-2; s.setAttributeNode(a);
        r.value=2; s.setAttributeNode(r);
        o.value="line-height:1px;text-align:center"; s.setAttributeNode(o);
        s.innerHTML="<div><h2 style='position:absolute;display:block;margin-top:54px;margin-left:63px' id='second_display'></h2>"
                   +"<canvas id='millis_canvas' width='150px' height='130px' style='margin-top:-20px'></canvas></div>";

        var l=document.createElement("TD"),
            cc=document.createAttribute("rowspan"),
            d=document.createAttribute("colspan"),
            m=document.createAttribute("style");
        cc.value=e.children.length-2; l.setAttributeNode(cc);
        d.value=2; l.setAttributeNode(d);
        m.value="height:1px;text-align:center"; l.setAttributeNode(m);
        l.innerHTML="<img src='"+imgSrc.watchtower+"'>";

        var p=document.createElement("TD");
        p.innerHTML="<button id='practice_button' type='button' class='btn btn-recruit' onclick='practiceFunction()' style='width:80px'>"+lang.btnTest+"</button>";

        var u=document.createElement("TD"),
            h=document.createAttribute("style");
        h.value="white-space:nowrap"; u.setAttributeNode(h);
        u.innerHTML="<span>"+lang.labelHit+"</span><input style='width:30px' id='hit_input' title='Millisecond to hit' type='text' onchange='storeData(\"hit_ms\")' value='"+hitMs+"'></input>";

        var g=document.createElement("TD"),
            f=document.createAttribute("style");
        f.value="white-space:nowrap"; g.setAttributeNode(f);

        var b,y,T,v=new Date;
        y=v.getTime()-getStorage("last_set_offset")<42e4;
        T=v.getTime()-getStorage("last_set_const")<36e5;
        b=y&&T?imgSrc.green:y||T?imgSrc.yellow:imgSrc.red;
        g.innerHTML="<span>"+lang.labelOffset+"</span><input id='offset_input' type='text' onchange='storeData(\"offset_ms\")' style='width:30px' value='"+calibrationTime+"'></input>"
                   +"&nbsp;<img id='offset_status' src='"+b+"' onclick='getInitialOffset()' style='cursor:pointer;vertical-align:middle'>";

        var ts=document.createElement("TD"),
            st=document.createAttribute("style");
        st.value="white-space:nowrap"; ts.setAttributeNode(st);
        ts.innerHTML="<span>"+lang.labelTime+"</span><input style='width:120px' id='date_input' title='Time' type='text'></input>";

        var _=document.createElement("TD");
        _.innerHTML="<span id='miss_display' style='width:34px;display:block' title='"+lang.tooltipMissed+"'>0</span>";

        $(".village_anchor").parent().parent()[0].appendChild(s);
        $(".village_anchor").parent().parent()[0].appendChild(l);
        n.appendChild(p); n.appendChild(u); n.appendChild(g); n.appendChild(ts);
        $("#ds_body")[0].setAttribute("onsubmit","sendFunction()");
        timerInterval = setInterval(drawCircle, 5);

    } catch(err) {
        console.log(lang.errConsoleTable+err);
    }
}

/* ─── Core logic ──────────────────────────────────────────── */

function drawCircle(){
    null==c&&(c=document.getElementById("millis_canvas"),
        ctx=c.getContext("2d"),circleReference=-Math.PI/2,lastMillis=0,lastTimingMillis=0,
        hitMs=$("#hit_input")[0].value,$("#second_display")[0].innerHTML=$(".relative_time")[0].innerHTML.split(":")[2]);

    var e=new Date,
        t=(e=new Date(e.getTime()+calibrationTime+constOffset)).getMilliseconds(),
        i=new Date(e.getTime()-hitMs).getMilliseconds();
    t<lastMillis&&(lastMillis=t,1==String(e.getSeconds()).length?$("#second_display")[0].innerHTML="0"+e.getSeconds():$("#second_display")[0].innerHTML=e.getSeconds());
    i<lastTimingMillis&&(ctx.clearRect(0,0,160,160),lastTimingMillis=0);
    ctx.beginPath(),ctx.arc(75,75,50,circleReference+lastTimingMillis*milliPiFraction,circleReference+i*milliPiFraction),ctx.stroke();
    lastMillis=t; lastTimingMillis=i;
}

function practiceFunction(){
    var e=new Date,
        t=(e=new Date(e.getTime()+calibrationTime+constOffset)).getMilliseconds();
    var buttonText=[lang.btnTest,lang.btnStart],
        buttonDOM=$("#practice_button")[0];
    hitMs=$("#hit_input")[0].value;
    if(buttonDOM.innerHTML==buttonText[0]){
        clearInterval(timerInterval);
        buttonDOM.innerHTML=buttonText[1];
        Math.abs(t-hitMs)<=500?$("#miss_display")[0].innerHTML=String(t-hitMs):$("#miss_display")[0].innerHTML=-(1e3-(t-hitMs));
    } else {
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
    var e,t,i,n=new Date;
    t=n.getTime()-getStorage("last_set_offset")<42e4;
    i=n.getTime()-getStorage("last_set_const")<36e5;
    e=t&&i?imgSrc.green:t||i?imgSrc.yellow:imgSrc.red;
    $("#offset_status")[0].src=e;
}

/* ─── Help modal ──────────────────────────────────────────── */

function toggleTutorial(){
    var existing = document.getElementById("ta-help-modal");
    if(existing){ existing.parentNode.remove(); return; }

    var overlay = _taOverlay();
    overlay.id = "ta-help-modal";

    var w = Math.min(560, 0.88 * window.innerWidth);
    var modal = document.createElement("div");
    modal.className = "ta-modal";
    modal.style.maxWidth = w + "px";
    modal.style.width = "100%";

    modal.innerHTML =
        "<div class='ta-modal-head'>"
      +   "<h3>&#10070; " + lang.helpTitle + "</h3>"
      +   "<span class='ta-close-x' onclick='toggleTutorial()'>&#x2715;</span>"
      + "</div>"
      + "<div class='ta-modal-body'>"
      +   "<div class='ta-help-intro'>" + lang.helpIntro + "</div>"

      +   "<div class='ta-help-section'>"
      +     "<h4>&#9654; " + lang.helpFlowTitle + "</h4>"
      +     _helpStep(1, lang.helpStep1Title, lang.helpStep1Body)
      +     _helpStep(2, lang.helpStep2Title, lang.helpStep2Body)
      +     _helpStep(3, lang.helpStep3Title, lang.helpStep3Body)
      +     _helpStep(4, lang.helpStep4Title, lang.helpStep4Body)
      +   "</div>"

      +   "<div class='ta-help-section'>"
      +     "<h4>&#9670; " + lang.helpColorTitle + "</h4>"
      +     "<p style='font-size:12px;color:#b09060;margin-bottom:8px'>" + lang.helpColorBody + "</p>"
      +     "<div class='ta-color-row'><img src='" + imgSrc.green  + "'><span>" + lang.helpColorGreen  + "</span></div>"
      +     "<div class='ta-color-row'><img src='" + imgSrc.yellow + "'><span>" + lang.helpColorYellow + "</span></div>"
      +     "<div class='ta-color-row'><img src='" + imgSrc.red    + "'><span>" + lang.helpColorRed    + "</span></div>"
      +     "<p class='ta-help-note'>" + lang.helpColorNote + "</p>"
      +   "</div>"
      + "</div>"
      + "<div class='ta-modal-foot'>"
      +   "<button class='ta-btn ta-btn-ok' onclick='toggleTutorial()'>Cerrar</button>"
      + "</div>";

    overlay.appendChild(modal);
    overlay.onclick = function(ev){ if(ev.target === overlay) toggleTutorial(); };
}

function _helpStep(num, title, body){
    return "<div class='ta-step'>"
         +   "<div class='ta-step-num'>" + num + "</div>"
         +   "<div class='ta-step-body'><b>" + title + "</b><span>" + body + "</span></div>"
         + "</div>";
}

/* ─── Storage / calibration ───────────────────────────────── */

function storeData(e,t){
    var i=localStorage.timeAssistant.split(","),
        n=new Date,s="";
    "hit_ms"==e?(hitMs=$("#hit_input")[0].value,isNaN(hitMs)&&($("#hit_input")[0].value=getStorage("hit_ms")),
        hitMs=isNaN(Number(hitMs))?getStorage("hit_ms"):Number(hitMs),i[0]=hitMs)
    :"offset_ms"==e?(offsetMs=$("#offset_input")[0].value,isNaN(offsetMs)&&($("#offset_input")[0].value=getStorage("offset_ms")),
        isNaN(Number(offsetMs))?offsetMs=getStorage("offset_ms"):offsetMS=Number(offsetMs),
        i[1]=offsetMs,calibrationTime=Number(offsetMs),i[i.length-2]=n.getTime(),
        setTimeout(function(){updateColor();},250))
    :"offset"==e?(t=isNaN(Number(t))?getStorage("offset_ms"):Number(t),i[1]=t,i[i.length-2]=n.getTime())
    :"last_hit"==e?i[2]=t
    :"const_offset"==e&&(t=isNaN(Number(t))?getStorage("const_offset"):Number(t),i[3]=t,i[i.length-1]=n.getTime());
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
    try {
        var e=getStorage("last_hit"), t=e.split(":");
        e=1e3*Number(t[0])+Number(t[1]);
        1==t[0].length&&(t[0]="0"+t[0]);
        1==t[1].length?t[1]="00"+t[1]:2==t[1].length&&(t[1]="0"+t[1]);
        t=t[0]+":"+t[1];
        var label = lang.promptEstimated + t + "</b><br>" + lang.promptInput;
        showPrompt(lang.promptTitle, label, t, function(i){
            if(null==i) return;
            var n=i.split(":");
            e-15e3>(n=1e3*Number(n[0])+Number(n[1]))?n+=6e4:n-15e3>e&&(e+=6e4);
            var s=n-e;
            s=0==runTimes?Number(s+calibrationTime):Number(s);
            isNaN(s)
                ? (storeData("offset",0), showToast(lang.errorOffsetTitle, lang.errorOffset, "error"))
                : (runTimes++, storeData("offset",s));
        });
    } catch(err) {
        console.log(lang.errConsoleInput);
        showToast(lang.errorManualTitle, lang.errorManual, "error");
    }
}

function getInitialOffset(){
    var e,t=new Date;
    sTime=Timing.getCurrentServerTime();
    storeData("const_offset",Math.round(sTime-t.getTime()));
    updateColor();
    for(var i=$("#date_arrival").parent().parent()[0],n=2;n<i.children.length;n++)
        try {
            if(null!=i.children[n].children[1].innerHTML.match(":")){
                e=1e3*Number(i.children[n].children[1].innerHTML.split(":")[2]);
                break;
            }
        } catch(err) {
            console.log(lang.errConsoleArrival+err);
        }
    constOffset=e+(sTime-t.getTime());
}
