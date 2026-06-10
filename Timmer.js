/*
 * Script Name: Timing Assist
 * Version: v1.3
 * Modified by: Black_Lottus
 */

var lang = {
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
    tutorialTitle:      "Asistente de Tiempos",
    tutorialBody:       "El asistente de tiempos te ayuda a cronometrar tus ataques con precisión mostrando gráficamente los milisegundos en un círculo. El círculo se completa cuando el milisegundo actual alcanza el milisegundo objetivo. "
                      + "El botón \"Test\" sirve para practicar el timing antes de enviar un comando.",
    calibTitle:         "Calibración",
    calibBody:          "El asistente necesita calibrarse regularmente con el reloj de Tribal Wars para una sincronización precisa. Sigue estos pasos:",
    step1Title:         "Paso 1 - Haz clic en el indicador de color.",
    step1Body:          "Esto sincroniza el reloj de forma aproximada, sin modificar el \"offset\" de ajuste fino. Hazlo cada hora aproximadamente.",
    step2Title:         "Paso 2 - Envía un comando de calibración.",
    step2Body:          "Envía un ataque o apoyo para obtener el tiempo de llegada real frente al estimado. Es el paso más importante y debe repetirse cada 5-7 minutos. Se completa en el paso 3.",
    step3Title:         "Paso 3 - Ejecuta el script en el punto de reunión tras enviar el comando e introduce el tiempo de llegada real.",
    step3Body:          "Ejecutar el script en el punto de reunión después de un envío pedirá al usuario el tiempo de llegada real y mostrará el estimado. Introduce el tiempo (s:ms) para actualizar el offset.",
    calibNote:          "El script debería quedar calibrado. Repite los pasos 2 y 3 para verificar si estima correctamente (±5-20 ms según velocidad de internet). Para errores recurrentes, ejecuta el script dos veces en esta página y acepta para reiniciar las variables.",
    colorTitle:         "Indicadores de color",
    colorBody:          "Los indicadores muestran cuánto tiempo lleva sin sincronizarse el reloj.",
    colorRed:           " - Sin sincronización aproximada ni fina",
    colorYellow:        " - Sincronización aproximada o fina (solo una)",
    colorGreen:         " - Ambas sincronizaciones activas",
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
    btnAccept:          "Aceptar"
};

function injectStyles(){
    if(document.getElementById('ta-styles')) return;
    var s=document.createElement('style');
    s.id='ta-styles';
    s.innerHTML=
        '#ta-toast-wrap{position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:10px}'
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
       +'.ta-ov{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:99998;display:flex;align-items:center;justify-content:center;animation:ta-fi .2s ease}'
       +'@keyframes ta-fi{from{opacity:0}to{opacity:1}}'
       +'.ta-modal{background:linear-gradient(180deg,#2a1f0e,#1a1208);border:1px solid #8a6a2a;border-radius:10px;box-shadow:0 8px 40px rgba(0,0,0,.85);width:420px;max-width:92vw;font-family:Arial,sans-serif;overflow:hidden}'
       +'.ta-mhd{background:linear-gradient(90deg,#4a3010,#3a2808);padding:14px 20px;display:flex;align-items:center;gap:10px;border-bottom:1px solid #6a4a1a}'
       +'.ta-mic{font-size:20px}'
       +'.ta-mtt{color:#e8c87a;font-size:15px;font-weight:bold}'
       +'.ta-mbd{padding:20px;color:#d4b87a;font-size:13px;line-height:1.7;white-space:pre-line}'
       +'.ta-inp{width:100%;box-sizing:border-box;margin-top:12px;padding:9px 12px;background:#0f0a04;border:1px solid #6a4a1a;border-radius:5px;color:#e8c87a;font-size:14px;outline:none}'
       +'.ta-inp:focus{border-color:#c8982a;box-shadow:0 0 0 2px rgba(200,152,42,.2)}'
       +'.ta-mft{padding:12px 20px;display:flex;justify-content:flex-end;gap:10px;border-top:1px solid #3a2808;background:#130e05}'
       +'.ta-btn{padding:8px 22px;border-radius:5px;border:none;cursor:pointer;font-size:13px;font-weight:bold;transition:filter .15s}'
       +'.ta-btn:hover{filter:brightness(1.2)}'
       +'.ta-ok{background:linear-gradient(180deg,#9a6210,#7a4208);color:#f0d080;border:1px solid #c8982a}'
       +'.ta-cn{background:linear-gradient(180deg,#3a2a1a,#2a1a0a);color:#a08040;border:1px solid #4a3a1a}';
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
        +"<div class='ta-mhd'><span class='ta-mic'>⚠️</span><span class='ta-mtt'>"+lang.titleAssist+"</span></div>"
        +"<div class='ta-mbd'>"+msg+"</div>"
        +"<div class='ta-mft'>"
        +"<button type='button' class='ta-btn ta-cn'>"+lang.btnCancel+"</button>"
        +"<button type='button' class='ta-btn ta-ok'>"+lang.btnConfirm+"</button>"
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
        +"<div class='ta-mhd'><span class='ta-mic'>🎯</span><span class='ta-mtt'>"+lang.titleAssist+"</span></div>"
        +"<div class='ta-mbd'>"+msg+"<br><input class='ta-inp' id='ta-pi' type='text' value='"+defaultVal+"'></div>"
        +"<div class='ta-mft'>"
        +"<button type='button' class='ta-btn ta-cn'>"+lang.btnCancel+"</button>"
        +"<button type='button' class='ta-btn ta-ok'>"+lang.btnAccept+"</button>"
        +"</div></div>";
    document.body.appendChild(ov);
    var inp=ov.querySelector('#ta-pi');
    setTimeout(function(){inp.focus();inp.select();},50);
    function accept(){var v=inp.value;ov.remove();callback(v);}
    ov.querySelectorAll('.ta-btn')[1].onclick=accept;
    ov.querySelectorAll('.ta-btn')[0].onclick=function(){ov.remove();callback(null);};
    inp.onkeydown=function(ev){if(ev.key==='Enter')accept();};
}

var c, ctx, circleReference,
    lastMillis, lastTimingMillis,
    timerInterval, constOffset, runTimes,
    hitMs=getStorage("hit_ms"),
    milliPiFraction=.00628319,calibrationTime=getStorage("offset_ms"),
    imgSrc = {
        green:"https://dsen.innogamescdn.com/asset/04d88c84/graphic/dots/green.png",
        yellow:"https://dsen.innogamescdn.com/asset/04d88c84/graphic/dots/yellow.png",
        red:"https://dsen.innogamescdn.com/asset/04d88c84/graphic/dots/red.png",
        questionmark:"https://dsen.innogamescdn.com/asset/6be9bf502a/graphic/questionmark.png",
        watchtower:"https://dsen.innogamescdn.com/asset/04d88c84/graphic/big_buildings/watchtower1.png"
    };

    if("place" != game_data.screen) {
        showToast(lang.mustRunFromRally,'warn');
    }else if(2 == window.location.href.split("try=").length){
        if(null == runTimes ? runTimes = 1:runTimes++, 1 == runTimes) setTimeout(function(){addDisplay()},50);
        else {
            showModal(lang.alreadyRunning, function(){ clearStorage(); });
        }
    }else null==runTimes&&(runTimes=0), promptCalibration();
    
    function addDisplay() {
        try {
            for(var e=$("#date_arrival").parent().parent()[0],t=2;t<e.children.length;t++)
                try {
                    if(null!=e.children[t].children[1].innerHTML.match(":")) {
                        var i=1e3*Number(e.children[t].children[1].innerHTML.split(":")[2]);
                        break
                    }
                }catch(e) {
                    console.log(lang.errConsoleArrival+e)
                }
                
                var n=e.children[e.children.length-1];
                constOffset=i+getStorage("const_offset"), e.children[0].innerHTML+="<th colspan='4'>    "
                + "    <span style='white-space:nowrap'>"+lang.titleAssist+"</span><span>    "
                + "    <img src='"+imgSrc.questionmark+"' onclick='toggleTutorial()' style='float:right;display:inline;height:15px;width:15px;cursor:pointer'></span></th>";
                
                var s=document.createElement("TD"), 
                    a=document.createAttribute("rowspan"),
                    r=document.createAttribute("colspan"),
                    o=document.createAttribute("style");
                    
                    a.value=e.children.length-2,
                    s.setAttributeNode(a),
                    r.value=2,
                    s.setAttributeNode(r),
                    o.value="line-height:1px;text-align:center",
                    s.setAttributeNode(o),
                    s.innerHTML="<div><h2 style='position:absolute;display:block;margin-top:54px;margin-left:63px' id='second_display'></h2>         "
                    +"                   <canvas id='millis_canvas' width='150px' height='130px' style='margin-top:-20px'></canvas></div>";
                    var l=document.createElement("TD"),                    
                        c=document.createAttribute("rowspan"),
                        d=document.createAttribute("colspan"),
                        m=document.createAttribute("style");
                        c.value=e.children.length-2,
                        l.setAttributeNode(c),
                        d.value=2,l.setAttributeNode(d),
                        m.value="height:1px;text-align:center",
                        l.setAttributeNode(m),
                        l.innerHTML="<img src='"+imgSrc.watchtower+"'>";
                        
                    var td=document.createElement("TD"),                    
                        rowspan=document.createAttribute("rowspan"),
                        colspan=document.createAttribute("colspan"),
                        style=document.createAttribute("style");
                        rowspan.value=e.children.length-2,
                        td.setAttributeNode(rowspan),
                        colspan.value=2,td.setAttributeNode(colspan),
                        style.value="height:1px;text-align:center",
                        td.setAttributeNode(style),
                        td.innerHTML="<img src='"+imgSrc.watchtower+"'>";
                    
                    var p=document.createElement("TD");
                    p.innerHTML="<button id='practice_button' type='button' class='btn btn-recruit' onclick='practiceFunction()' style='width:80px'>"+lang.btnTest+"</button>";
                    
                    var u=document.createElement("TD"),
                        h=document.createAttribute("style");
                        h.value="white-space:nowrap",
                        u.setAttributeNode(h),
                        u.innerHTML="<span>"+lang.labelHit+"</span><input style='width:30px' id='hit_input' title='Millisecond to hit' type='text' onchange='storeData(\"hit_ms\")' value='"+hitMs+"'></input>";
                    
                    var g=document.createElement("TD"),
                        f=document.createAttribute("style");
                        f.value="white-space:nowrap",
                        g.setAttributeNode(f);
                    
                    var b,y,T,v=new Date;
                    y=v.getTime()-getStorage("last_set_offset")<42e4,T=v.getTime()-getStorage("last_set_const")<36e5,b=y&&T?imgSrc.green:y||T?imgSrc.yellow:imgSrc.red,g.innerHTML="<span>"+lang.labelOffset+"</span><input id='offset_input' type='text' onchange='storeData(\"offset_ms\")' style='width:30px' value='"+calibrationTime+"'></input>                            <img id='offset_status' src='"+b+"' onclick = getInitialOffset() style='cursor:pointer'>";
                    
                    var ts=document.createElement("TD"),
                        st=document.createAttribute("style");
                        st.value="white-space:nowrap",
                        ts.setAttributeNode(st),
                        ts.innerHTML="<span>"+lang.labelTime+"</span><input style='width:120px' id='date_input' title='Time' type='text'></input>";
                    
                    
                    var _=document.createElement("TD");
                    _.innerHTML="<span id='miss_display' style='width:34px;display:block' title='"+lang.tooltipMissed+"'>0</span>",
                        $(".village_anchor").parent().parent()[0].appendChild(s),
                        $(".village_anchor").parent().parent()[0].appendChild(l),
                        n.appendChild(p), n.appendChild(u), n.appendChild(g) ,n.appendChild(ts),
                        $("#ds_body")[0].setAttribute("onsubmit","sendFunction()"),
                        timerInterval=setInterval(drawCircle,5)
        }catch(e){
            console.log(lang.errConsoleTable+e)
        }
    }
    
    function drawCircle(){
        null==c&&(c=document.getElementById("millis_canvas"),
            ctx=c.getContext("2d"),circleReference=-Math.PI/2,lastMillis=0,lastTimingMillis=0,
            hitMs=$("#hit_input")[0].value,$("#second_display")[0].innerHTML=$(".relative_time")[0].innerHTML.split(":")[2]);
            
        var e=new Date,
            t=(e=new Date(e.getTime()+calibrationTime+constOffset)).getMilliseconds(),
            i=new Date(e.getTime()-hitMs).getMilliseconds();t<lastMillis&&(lastMillis=t,1==String(e.getSeconds()).length?$("#second_display")[0].innerHTML="0"+e.getSeconds():$("#second_display")[0].innerHTML=e.getSeconds()),
            i<lastTimingMillis&&(ctx.clearRect(0,0,160,160),lastTimingMillis=0),ctx.beginPath(),ctx.arc(75,75,50,circleReference+lastTimingMillis*milliPiFraction,circleReference+i*milliPiFraction),ctx.stroke(),lastMillis=t,lastTimingMillis=i
    }
    
    function practiceFunction(){
        var e=new Date,
            t=(e=new Date(e.getTime()+calibrationTime+constOffset)).getMilliseconds();buttonText=[lang.btnTest,lang.btnStart],
            buttonDOM=$("#practice_button")[0],hitMs=$("#hit_input")[0].value,buttonDOM.innerHTML==buttonText[0]?(clearInterval(timerInterval),
            buttonDOM.innerHTML=buttonText[1],Math.abs(t-hitMs)<=500?$("#miss_display")[0].innerHTML=String(t-hitMs):$("#miss_display")[0].innerHTML=-(1e3-(t-hitMs))):(buttonDOM.innerHTML=buttonText[0],timerInterval=setInterval(drawCircle,5)),lastTimingMillis=1200
    }
    
    function sendFunction(){
        var e=new Date;
        
        clearInterval(timerInterval);
        var t=(e=new Date(e.getTime()+calibrationTime+constOffset)).getSeconds(),
            i=e.getMilliseconds();storeData("last_hit",String(t)+":"+String(i))
    }
    
    function updateColor(){
        var e,t,i,n=new Date;t=n.getTime()-getStorage("last_set_offset")<42e4,i=n.getTime()-getStorage("last_set_const")<36e5,e=t&&i?imgSrc.green:t||i?imgSrc.yellow:imgSrc.red,$("#offset_status")[0].src=e
    }
    
    function toggleTutorial(){
        if(null==$("#timing_tutorial")[0]){
            var e,t=document.createElement("DIV"),
                i=document.createElement("DIV"),
                n=document.createAttribute("class"),
                s=document.createAttribute("class"),
                a=.8*$("#contentContainer")[0].offsetWidth;n.value="popup_box_container",
                t.setAttributeNode(n),s.value="fader",i.setAttributeNode(s),
                e="<div class='popup_box mobile show' id='timing_tutorial' style='width:"+a+"px;top:12%'>"
                    + "<div class='popup_box_content' style='max-height:70%;overflow:auto'><a class='popup_box_close tooltip-delayed' onclick='toggleTutorial()' style='cursor:pointer'>&nbsp;</a>"
                    + "<h2 class='popup_box_header'>"+lang.tutorialTitle+"</h2>"
                    + "<p>"+lang.tutorialBody+"</p>"
                    + "<h5>"+lang.calibTitle+"</h5><p>"+lang.calibBody+"</p>"
                    + "<p style='display:inline'><b>"+lang.step1Title+"</b></p><br><p style='display:inline'>"+lang.step1Body+"</p><br><br>"
                    + "<p style='display:inline'><b>"+lang.step2Title+"</b></p><br><p style='display:inline'>"+lang.step2Body+"</p><br><br>"
                    + "<p style='display:inline'><b>"+lang.step3Title+"</b></p><br><p style='display:inline'>"+lang.step3Body+"</p>"
                    + "<p>"+lang.calibNote+"</p>"
                    + "<h5>"+lang.colorTitle+"</h5><p>"+lang.colorBody+"</p>"
                    + "<img src='"+imgSrc.red+"'><p style='display:inline'>"+lang.colorRed+"</p><br>"
                    + "<img src='"+imgSrc.yellow+"'><p style='display:inline'>"+lang.colorYellow+"</p><br>"
                    + "<img src='"+imgSrc.green+"'><p style='display:inline'>"+lang.colorGreen+"</p>"
                    + "<p>"+lang.colorNote+"</p>"
                    + "</div></div>",
                
                t.innerHTML=e,document.body.appendChild(t),
                document.body.appendChild(i)
        }else $("#timing_tutorial")[0].remove(),$(".fader")[0].remove()
    }
    
    function storeData(e,t){
        var i=localStorage.timeAssistant.split(","),
            n=new Date,s="";"hit_ms"==e?(hitMs=$("#hit_input")[0].value,isNaN(hitMs)&&($("#hit_input")[0].value=getStorage("hit_ms")),
            hitMs=isNaN(Number(hitMs))?getStorage("hit_ms"):Number(hitMs),i[0]=hitMs):"offset_ms"==e?(offsetMs=$("#offset_input")[0].value,isNaN(offsetMs)&&($("#offset_input")[0].value=getStorage("offset_ms")),isNaN(Number(offsetMs))?offsetMs=getStorage("offset_ms"):offsetMS=Number(offsetMs),i[1]=offsetMs,calibrationTime=Number(offsetMs),i[i.length-2]=n.getTime(),
            
            setTimeout(function(){updateColor()},250)):"offset"==e?(t=isNaN(Number(t))?getStorage("offset_ms"):Number(t),i[1]=t,i[i.length-2]=n.getTime()):"last_hit"==e?i[2]=t:"const_offset"==e&&(t=isNaN(Number(t))?getStorage("const_offset"):Number(t),i[3]=t,i[i.length-1]=n.getTime());
            
            for(var a=0;a<i.length-1;a++) s+=i[a]+",";s+=i[i.length-1],localStorage.setItem("timeAssistant",s)
    }
    
    function getStorage(e){
        var t,i=localStorage.timeAssistant,
            n=["hit_ms","offset_ms","last_hit","const_offset","last_set_offset","last_set_const"];
        
        if(null==i) return i="0,0,00:000,0,0,0",localStorage.setItem("timeAssistant",i),0;
        
        i=i.split(",");
        
        for(var s=0;s<n.length;s++) e==n[s]&&(t=2==s?i[s]:Number(i[s]));
        return t
    }
    
    function clearStorage(){
        localStorage.removeItem("timeAssistant"),location.reload()
    }
    
    function promptCalibration(){
        if(null==localStorage.timeAssistant) return;
        try{
            var e=getStorage("last_hit"),t=e.split(":");
            e=1e3*Number(t[0])+Number(t[1]);
            1==t[0].length&&(t[0]="0"+t[0]);
            1==t[1].length?t[1]="00"+t[1]:2==t[1].length&&(t[1]="0"+t[1]);
            t=t[0]+":"+t[1];
            showPrompt(lang.promptEstimated+"<b>"+t+"</b><br>"+lang.promptInput, t, function(i){
                if(null!=i){
                    var n=i.split(":");
                    e-15e3>(n=1e3*Number(n[0])+Number(n[1]))?n+=6e4:n-15e3>e&&(e+=6e4);
                    var s=n-e;
                    s=0==runTimes?Number(s+calibrationTime):Number(s);
                    isNaN(s)?(storeData("offset",0),showToast(lang.errorOffset,'error')):(runTimes++,storeData("offset",s));
                }
            });
        }catch(e){
            console.log(lang.errConsoleInput);
            showToast(lang.errorManual,'error');
        }
    }
    
    function getInitialOffset(){
        var e,t=new Date;sTime=Timing.getCurrentServerTime(),storeData("const_offset",Math.round(sTime-t.getTime())),updateColor();
        for(var i=$("#date_arrival").parent().parent()[0],n=2;n<i.children.length;n++)
        try{
            if(null!=i.children[n].children[1].innerHTML.match(":")){
                e=1e3*Number(i.children[n].children[1].innerHTML.split(":")[2]);
                break
            }
        }catch(e){
            console.log(lang.errConsoleArrival+e)
        }
        constOffset=e+(sTime-t.getTime())           
    }