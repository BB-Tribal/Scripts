/*
 * 💖 BalanceadorRaba 💖 - Script para Tribal Wars
 * Reparte y equilibra los recursos entre todas tus aldeas.
 * Interfaz rediseñada: modals, cards, paleta rosa & malva.
 *
 * Motor de balanceo original: Costache Madalin
 * Rediseño de interfaz: rabagalan73 💕
 */





if(typeof(TWMap) !="undefined" )
    var  originalSpawnSector = TWMap.mapHandler.spawnSector;


    // ============================================================
    //  🎨 PALETA ROSA & MALVA  (rediseño Raba)
    // ============================================================
    var RABA = {
        pinkLight:   "#ff8fc7",   // rosa claro
        pink:        "#ff6fae",   // rosa principal
        pinkDeep:    "#e84393",   // rosa fuerte / acento
        mauve:       "#c850c0",   // malva
        purple:      "#9b59b6",   // morado
        lavender:    "#f3e0f7",   // lavanda muy clara
        bgApp:       "#fffafd",   // fondo casi blanco rosado
        bgCard:      "#fff0f7",   // fondo de card
        cardBorder:  "#f8c8dc",   // borde de card
        textMain:    "#6a1b54",   // texto principal (ciruela)
        textSoft:    "#9a5a82",   // texto secundario
        white:       "#ffffff",
        good:        "#2e9e6b",   // verde (superávit)
        bad:         "#e0508a"    // rosa-rojo (déficit)
    };

    // Tipografías disponibles en el menú de ajustes (la 1ª es la de por defecto)
    var RABA_FONTS = [
        { id: "Nunito",           label: "Nunito 🌷",          stack: "'Nunito', sans-serif" },
        { id: "Poppins",          label: "Poppins ✨",         stack: "'Poppins', sans-serif" },
        { id: "Quicksand",        label: "Quicksand 🫧",       stack: "'Quicksand', sans-serif" },
        { id: "Comfortaa",        label: "Comfortaa 🍡",       stack: "'Comfortaa', cursive" },
        { id: "Playfair Display", label: "Playfair Display 👑", stack: "'Playfair Display', serif" },
        { id: "Dancing Script",   label: "Dancing Script ✒️",  stack: "'Dancing Script', cursive" }
    ];
    var RABA_FONT_KEY = "balanceadorRabaFont";
    var currentFont = RABA_FONTS[0];

    // Compatibilidad con el motor original (estas variables se siguen leyendo
    // en createTable / createTableResults / createMapInfo).
    var textColor = RABA.textMain;
    var backgroundContainer = RABA.bgApp;
    
    async function main(){
        initializationTheme()
        injectRabaCSS()
        createMainInterface()
        changeTheme()
    }
    main()
    
    
function getColorDarker(hexInput, percent) {
    let hex = hexInput;

    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, "");

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (hex.length === 3) {
        hex = hex.replace(/(.)/g, "$1$1");
    }

    let r = parseInt(hex.substr(0, 2), 16);
    let g = parseInt(hex.substr(2, 2), 16);
    let b = parseInt(hex.substr(4, 2), 16);

    const calculatedPercent = (100 + percent) / 100;

    r = Math.round(Math.min(255, Math.max(0, r * calculatedPercent)));
    g = Math.round(Math.min(255, Math.max(0, g * calculatedPercent)));
    b = Math.round(Math.min(255, Math.max(0, b * calculatedPercent)));

    return `#${("00"+r.toString(16)).slice(-2).toUpperCase()}${("00"+g.toString(16)).slice(-2).toUpperCase()}${("00"+b.toString(16)).slice(-2).toUpperCase()}`
}
    


function createMainInterface(){
    console.log("⚖️ Balanceo de Recursos — init");

    let html_info = `
    <div class="raba-overlay raba-root" id="div_container">
        <div class="raba-modal">

            <div class="raba-header">
                <div class="raba-head-brand">
                    <div class="raba-head-logo">⚖️</div>
                    <div class="raba-head-text">
                        <div class="raba-head-title">Balanceo de Recursos</div>
                        <div class="raba-head-sub">Distribuye y equilibra tus aldeas automáticamente</div>
                    </div>
                </div>
                <div class="raba-head-btns">
                    <button class="raba-icon-btn" id="raba_settings_btn" title="Ajustes">⚙️</button>
                    <button class="raba-icon-btn" id="raba_help_btn" title="Ayuda">❔</button>
                    <button class="raba-icon-btn" id="raba_close_btn" title="Cerrar">✕</button>
                </div>
            </div>

            <div class="raba-body" id="div_body">
                <div class="raba-cfg-list">

                    <div class="raba-cfg-row">
                        <div class="raba-cfg-info">
                            <span class="raba-cfg-icon">🛒</span>
                            <div>
                                <div class="raba-cfg-title">Mercaderes en reserva</div>
                                <div class="raba-cfg-desc">Mercaderes que se reservan y no participan en el balanceo</div>
                            </div>
                        </div>
                        <div class="raba-stepper">
                            <button class="raba-step-btn" data-target="nr_merchants_reserve" data-delta="-1">−</button>
                            <input type="number" id="nr_merchants_reserve" class="raba-step-val" value="0" min="0">
                            <button class="raba-step-btn" data-target="nr_merchants_reserve" data-delta="1">+</button>
                        </div>
                    </div>

                    <div class="raba-cfg-row">
                        <div class="raba-cfg-info">
                            <span class="raba-cfg-icon">🏗️</span>
                            <div>
                                <div class="raba-cfg-title">Tiempo de construcción</div>
                                <div class="raba-cfg-desc">Horas de construcción a reservar para el Account Manager con plantilla activa</div>
                            </div>
                        </div>
                        <div class="raba-stepper">
                            <button class="raba-step-btn" data-target="time_construction" data-delta="-1">−</button>
                            <input type="number" id="time_construction" class="raba-step-val" value="0" min="0" max="50">
                            <button class="raba-step-btn" data-target="time_construction" data-delta="1">+</button>
                        </div>
                    </div>

                    <div class="raba-cfg-row">
                        <div class="raba-cfg-info">
                            <span class="raba-cfg-icon">🗺️</span>
                            <div>
                                <div class="raba-cfg-title">Zonas de balanceo</div>
                                <div class="raba-cfg-desc">1 = una zona global · 2 o más = divide tus aldeas en grupos cercanos (k-means)</div>
                            </div>
                        </div>
                        <div class="raba-stepper">
                            <button class="raba-step-btn" data-target="nr_clusters" data-delta="-1">−</button>
                            <input type="number" id="nr_clusters" class="raba-step-val" value="1" min="1">
                            <button class="raba-step-btn" data-target="nr_clusters" data-delta="1">+</button>
                        </div>
                    </div>

                    <div class="raba-cfg-row" hidden id="tr_merchant_capacity">
                        <div class="raba-cfg-info">
                            <span class="raba-cfg-icon">📦</span>
                            <div>
                                <div class="raba-cfg-title">Capacidad del mercader</div>
                                <div class="raba-cfg-desc">Recursos por mercader. Actívalo si estás en servidor .PT o .DE</div>
                            </div>
                        </div>
                        <div class="raba-cap-toggle" id="raba_cap_toggle">
                            <button class="raba-cap-btn raba-cap-active" data-val="1000">1000</button>
                            <button class="raba-cap-btn" data-val="1500">1500</button>
                            <input type="hidden" id="merchant_capacity" value="1000">
                        </div>
                    </div>

                    <div class="raba-cfg-row">
                        <div class="raba-cfg-info">
                            <span class="raba-cfg-icon">🔝</span>
                            <div>
                                <div class="raba-cfg-title">Construcción máxima</div>
                                <div class="raba-cfg-desc">Calcula automáticamente las horas de construcción cuando el factor de igualado es menor de 0.5</div>
                            </div>
                        </div>
                        <label class="raba-switch">
                            <input type="checkbox" id="max_construction">
                            <span class="raba-slider-toggle"></span>
                        </label>
                    </div>

                    <div class="raba-cfg-slider-card">
                        <div class="raba-cfg-slider-head">
                            <div class="raba-cfg-info">
                                <span class="raba-cfg-icon">⚖️</span>
                                <div>
                                    <div class="raba-cfg-title">Factor de igualado <span class="raba-tag">0 – 1</span></div>
                                    <div class="raba-cfg-desc">0 = prioriza construcción · 1 = iguala recursos de todas las aldeas al máximo</div>
                                </div>
                            </div>
                            <span class="raba-slider-num" id="raba_factor_display">1.0</span>
                        </div>
                        <input type="range" id="nr_average_factor" class="raba-range" min="0" max="1" step="0.05" value="1">
                    </div>

                </div>

                <button class="raba-btn-primary" id="raba_start_btn">✨ Calcular balanceo ✨</button>
            </div>

            <div class="raba-footer">💖 Creado por <strong>rabagalan73</strong> para la reina <strong>M0bscene</strong> 💖</div>
        </div>
    </div>`;

    $("#div_container").remove();
    $("body").append(html_info);
    applyRabaFont();

    let twServers = ["pt_PT","de_DE"];
    if(twServers.includes(game_data.locale)) $("#tr_merchant_capacity").show();

    $("#raba_close_btn").on("click", ()=> $("#div_container").remove());
    $("#raba_settings_btn").on("click", (e)=>{ e.stopPropagation(); openRabaSettings(); });
    $("#raba_help_btn").on("click", (e)=>{ e.stopPropagation(); showRabaHelp(); });
    $("#raba_start_btn").on("click", ()=> balancingResources());
    $("#div_container").on("mousedown",(e)=>{ if(e.target.id==="div_container") $("#div_container").remove(); });

    // Steppers
    $("#div_body").on("click",".raba-step-btn", function(){
        let id = $(this).data("target");
        let delta = parseFloat($(this).data("delta")) || 1;
        let inp = document.getElementById(id);
        let v = parseFloat(inp.value) || 0;
        let mn = parseFloat(inp.min); mn = isNaN(mn) ? -Infinity : mn;
        let mx = parseFloat(inp.max); mx = isNaN(mx) ?  Infinity : mx;
        inp.value = Math.max(mn, Math.min(mx, v + delta));
        $(inp).trigger("change");
    });

    // Toggle capacidad mercader
    $("#raba_cap_toggle").on("click", ".raba-cap-btn", function(){
        $("#raba_cap_toggle .raba-cap-btn").removeClass("raba-cap-active");
        $(this).addClass("raba-cap-active");
        $("#merchant_capacity").val($(this).data("val")).trigger("change");
    });

    // Slider factor
    function updateRangeStyle(el){
        let v = parseFloat(el.value);
        let pct = v / (parseFloat(el.max) || 1) * 100;
        el.style.background = "linear-gradient(90deg,#ff6fae " + pct + "%,#f8c8dc " + pct + "%)";
        let disp = document.getElementById("raba_factor_display");
        if(disp) disp.textContent = v.toFixed(2);
    }
    let rangeEl = document.getElementById("nr_average_factor");
    if(rangeEl){ updateRangeStyle(rangeEl); $(rangeEl).on("input", function(){ updateRangeStyle(this); }); }

    // Restaurar ajustes
    let savedCfg = localStorage.getItem(game_data.world + "settings_resources_balancer2");
    if(savedCfg != null){
        let d = JSON.parse(savedCfg);
        let nums = [...document.querySelectorAll("#div_container input[type=number], #div_container input[type=range]")];
        let cbs  = [...document.querySelectorAll("#div_container input[type=checkbox]")];
        nums.forEach((el,i)=>{ if(d[i]!==undefined) el.value = d[i]; });
        cbs.forEach((el,i)=>{ if(d[nums.length+i]!==undefined) el.checked = d[nums.length+i]; });
        if(rangeEl) updateRangeStyle(rangeEl);
    }

    // Guardar ajustes
    $("#div_container input").on("click input change", ()=>{
        let nums = [...document.querySelectorAll("#div_container input[type=number], #div_container input[type=range]")];
        let cbs  = [...document.querySelectorAll("#div_container input[type=checkbox]")];
        let d = JSON.stringify([...nums.map(e=>e.value), ...cbs.map(e=>e.checked)]);
        if(d !== localStorage.getItem(game_data.world + "settings_resources_balancer2"))
            localStorage.setItem(game_data.world + "settings_resources_balancer2", d);
    });
}

function changeTheme(){
    // Devuelve HTML del selector de tipografías para openRabaSettings()
    let fontCards = RABA_FONTS.map(f => `
        <div class="raba-font-card ${f.id===currentFont.id?"raba-font-active":""}" data-font="${f.id}">
            <span class="raba-font-name" style="font-family:${f.stack}">${f.label}</span>
            <span class="raba-font-sample" style="font-family:${f.stack}">Recursos 123 💖</span>
        </div>`).join("");
    return `<div class="raba-sett-section">
        <div class="raba-sett-label">🔤 Tipografía</div>
        <div class="raba-sett-sub">Elige el estilo de letra del panel. Se guarda automáticamente.</div>
        <div class="raba-font-grid">${fontCards}</div>
    </div>`;
}

// Aplica la tipografía actual a todo el panel Raba.
function applyRabaFont(){
    $(".raba-root, #div_container, .raba-dialog").css("font-family", currentFont.stack);
}

// ─── Ajustes — overlay independiente ──────────────────────────────────
function openRabaSettings(){
    $("#raba-sett-overlay").remove();
    let settHTML = changeTheme();
    $("body").append(`
    <div class="raba-overlay raba-root" id="raba-sett-overlay" style="z-index:100001;">
        <div class="raba-modal raba-modal-narrow">
            <div class="raba-header">
                <div class="raba-head-brand">
                    <div class="raba-head-logo">⚙️</div>
                    <div class="raba-head-text">
                        <div class="raba-head-title">Ajustes</div>
                        <div class="raba-head-sub">Personaliza la tipografía del panel</div>
                    </div>
                </div>
                <div class="raba-head-btns">
                    <button class="raba-icon-btn" id="raba-sett-close" title="Cerrar">✕</button>
                </div>
            </div>
            <div class="raba-body" id="raba-sett-body"></div>
            <div class="raba-footer">💖 Creado por <strong>rabagalan73</strong> para la reina <strong>M0bscene</strong> 💖</div>
        </div>
    </div>`);
    $("#raba-sett-body").html(settHTML);
    applyRabaFont();
    $("#raba-sett-close").on("click", ()=> $("#raba-sett-overlay").remove());
    $("#raba-sett-overlay").on("mousedown",(e)=>{ if(e.target.id==="raba-sett-overlay") $("#raba-sett-overlay").remove(); });
    $("#raba-sett-overlay").on("click",".raba-font-card", function(){
        let id = $(this).data("font");
        let found = RABA_FONTS.find(f => f.id === id);
        if(!found) return;
        currentFont = found;
        try{ localStorage.setItem(RABA_FONT_KEY, id); } catch(e){}
        applyRabaFont();
        $(".raba-font-card").removeClass("raba-font-active");
        $(this).addClass("raba-font-active");
        if(typeof UI !== "undefined" && UI.SuccessMessage)
            UI.SuccessMessage("Tipografía: " + found.id + " 💕", 1500);
    });
}

// ─── Loader (Fase 2) ──────────────────────────────────────────────────
function showRabaLoader(msg, sub){
    $("#raba-loader").remove();
    let msgg = msg || "Calculando balanceo...";
    let subb = sub || "Leyendo producción, transportes y plantillas de construcción";
    $("body").append(`
    <div id="raba-loader" class="raba-root" style="position:fixed;inset:0;z-index:100002;display:flex;align-items:center;justify-content:center;background:rgba(106,27,84,0.42);backdrop-filter:blur(4px);">
        <div class="raba-loader-box">
            <div class="raba-loader-spinner"></div>
            <div class="raba-loader-title">${msgg}</div>
            <div class="raba-loader-sub">${subb}</div>
            <div class="raba-loader-bar-wrap"><div class="raba-loader-bar" id="raba-loader-bar" style="width:5%"></div></div>
            <div class="raba-loader-count" id="raba-loader-count">Por favor espera...</div>
        </div>
    </div>`);
    applyRabaFont();
    let w = 5, dir = 1;
    window._rabaLoaderTimer = setInterval(function(){
        w += dir * 1.5;
        if(w >= 88 || w <= 5) dir *= -1;
        let bar = document.getElementById("raba-loader-bar");
        if(bar) bar.style.width = w + "%";
    }, 80);
}

function hideRabaLoader(){
    clearInterval(window._rabaLoaderTimer);
    let bar = document.getElementById("raba-loader-bar");
    if(bar){ bar.style.transition = "width .3s"; bar.style.width = "100%"; }
    setTimeout(()=> $("#raba-loader").remove(), 320);
}

function showRabaLoaderError(title, desc){
    clearInterval(window._rabaLoaderTimer);
    let box = document.querySelector("#raba-loader .raba-loader-box");
    if(!box) return;
    box.innerHTML = `
        <div style="font-size:38px;line-height:1;margin-bottom:12px;">⚠️</div>
        <div class="raba-loader-title" style="color:#e84393;">${title}</div>
        <div class="raba-loader-sub" style="margin-bottom:18px;">${desc}</div>
        <button id="raba-loader-back" style="padding:9px 24px;border:none;border-radius:20px;cursor:pointer;font-size:13px;font-weight:700;color:#fff;font-family:inherit;background:linear-gradient(135deg,#ff6fae,#c850c0);box-shadow:0 4px 14px rgba(232,67,147,.35);">← Volver</button>
    `;
    document.getElementById("raba-loader-back").onclick = function(){
        $("#raba-loader").remove();
        createMainInterface();
    };
}

// ─── Resultados (Fase 3) ─────────────────────────────────────────────
function showRabaResults(list_launches, obj_stats, list_production, list_clusters_stats){
    let n = list_launches ? list_launches.length : 0;
    $("#raba-results-overlay").remove();
    $("body").append(`
    <div class="raba-overlay raba-root" id="raba-results-overlay" style="z-index:100000;">
        <div class="raba-modal raba-modal-wide">
            <div class="raba-header">
                <div class="raba-head-brand">
                    <button class="raba-icon-btn" id="raba-results-back" title="Volver a configuración">←</button>
                    <div class="raba-head-text">
                        <div class="raba-head-title">Resultados del balanceo</div>
                        <div class="raba-head-sub">${n} envío${n===1?"":"s"} calculado${n===1?"":"s"}</div>
                    </div>
                </div>
                <div class="raba-head-btns">
                    <button class="raba-icon-btn" id="raba-results-toggle" title="Ocultar/Mostrar panel" style="display:none;">👁</button>
                    <button class="raba-icon-btn" id="raba-results-close" title="Cerrar">✕</button>
                </div>
            </div>
            <div class="raba-results-body">
                <div id="table_stats" class="raba-stats-wrap"></div>
                <div id="table_view" class="raba-table-wrap"></div>
            </div>
            <div class="raba-footer">💖 Creado por <strong>rabagalan73</strong> para la reina <strong>M0bscene</strong> 💖</div>
        </div>
    </div>`);
    applyRabaFont();
    if(game_data.screen === "map"){
        $("#raba-results-toggle").show();
    }
    $("#raba-results-toggle").on("click", ()=>{
        $("#raba-results-overlay").hide();
        $("#rml-show-panel-btn").show();
    });
    $("#raba-results-close").on("click", ()=> $("#raba-results-overlay").remove());
    $("#raba-results-overlay").on("mousedown",(e)=>{ if(e.target.id==="raba-results-overlay") $("#raba-results-overlay").remove(); });
    $("#raba-results-back").on("click", ()=>{
        $("#raba-results-overlay").remove();
        createMainInterface();
    });
    createTable(list_launches, obj_stats, list_production, list_clusters_stats);
}

// ============================================================
//  ❔ MODAL DE AYUDA — explica TODO lo que hace el script
// ============================================================
function showRabaHelp(){
    $("#raba_help_overlay").remove();
    $("body").append(`
    <div class="raba-overlay raba-root" id="raba_help_overlay" style="z-index:100001;">
        <div class="raba-modal raba-modal-narrow">
            <div class="raba-header">
                <div class="raba-head-brand">
                    <div class="raba-head-logo">❔</div>
                    <div class="raba-head-text">
                        <div class="raba-head-title">Guía de uso</div>
                        <div class="raba-head-sub">Cómo funciona el balanceo de recursos</div>
                    </div>
                </div>
                <div class="raba-head-btns">
                    <button class="raba-icon-btn" id="raba_help_close" title="Cerrar">✕</button>
                </div>
            </div>
            <div class="raba-body raba-help-body">

                <div class="raba-help-section">
                    <div class="raba-help-stitle">💡 ¿Qué hace?</div>
                    <p class="raba-help-p">Reparte madera, barro y hierro entre <b>todas tus aldeas</b> para equilibrarlas. Lee la producción y el transporte entrante de cada aldea, calcula qué aldeas tienen de más y cuáles necesitan, y prepara los envíos óptimos por mercader minimizando la distancia de viaje.</p>
                </div>

                <div class="raba-help-section">
                    <div class="raba-help-stitle">⚙️ Opciones</div>
                    <ul class="raba-help-list">
                        <li><span class="raba-help-tag">🛒 Mercaderes en reserva</span> Cuántos mercaderes se guardan por aldea sin usarlos en el balanceo.</li>
                        <li><span class="raba-help-tag">🏗️ Tiempo de construcción</span> Horas de recursos reservadas para el Administrador de Cuenta. Requiere AM activo con plantilla; si no hay, se ignora.</li>
                        <li><span class="raba-help-tag">⚖️ Factor de igualado</span> <b>1</b> = aldeas completamente equilibradas · <b>0</b> = solo envíos para construcción · <b>0.5</b> = punto intermedio.</li>
                        <li><span class="raba-help-tag">🗺️ Zonas de balanceo</span> <b>1</b> = balanceo global · <b>2+</b> = zonas locales (k-means), viajes más cortos pero menos óptimo globalmente. Las zonas se calculan aleatoriamente cada ejecución.</li>
                        <li><span class="raba-help-tag">📦 Capacidad del mercader</span> 1000 por defecto, 1500 en mundos .PT/.DE. Solo aparece en esos mundos.</li>
                        <li><span class="raba-help-tag">🔝 Construcción máxima</span> Con factor &lt; 0.5, ajusta automáticamente las horas al máximo que el superávit puede cubrir.</li>
                    </ul>
                </div>

                <div class="raba-help-section">
                    <div class="raba-help-stitle">📊 Resultados</div>
                    <ul class="raba-help-list">
                        <li><span class="raba-help-tag">Estadísticas</span> Total, media, superávit y déficit de cada recurso en toda la cuenta.</li>
                        <li><span class="raba-help-tag">Tabla de envíos</span> Cada fila muestra un destino, cuánto recibe y un botón Enviar. Ordena por distancia, total o recurso haciendo clic en la cabecera.</li>
                        <li><span class="raba-help-tag">Resultados por aldea</span> Estado final: puntos, mercaderes libres, horas de AM y superávit/déficit coloreado por recurso.</li>
                        <li><span class="raba-help-tag">Clusters / Zonas</span> Detalle por zona: número de aldeas, centro geográfico, recursos totales y distancia máxima de viaje.</li>
                    </ul>
                </div>

                <div class="raba-help-section">
                    <div class="raba-help-stitle">🗺️ En el mapa</div>
                    <p class="raba-help-p">Si ejecutas el script en la vista de mapa, cada aldea muestra su número de zona y los recursos que envía/recibe, con un color diferente por zona de balanceo.</p>
                </div>

                <div class="raba-help-section raba-help-tips">
                    <div class="raba-help-stitle">✨ Consejos</div>
                    <ul class="raba-help-list">
                        <li>Pulsa <b>Enter</b> para enviar rápidamente el primer envío de la lista.</li>
                        <li>Las zonas se recalculan aleatoriamente en cada ejecución: vigila la distancia máxima.</li>
                        <li>Usa el botón ← en los resultados para volver, ajustar y recalcular sin recargar.</li>
                    </ul>
                </div>

            </div>
            <div class="raba-footer">💖 Creado por <strong>rabagalan73</strong> para la reina <strong>M0bscene</strong> 💖</div>
        </div>
    </div>`);
    applyRabaFont();
    $("#raba_help_close").on("click", ()=> $("#raba_help_overlay").remove());
    $("#raba_help_overlay").on("mousedown",(e)=>{ if(e.target.id==="raba_help_overlay") $("#raba_help_overlay").remove(); });
}

// ============================================================
//  🎨 CSS DEL REDISEÑO (paleta rosa & malva + tablas heredadas)
// ============================================================
function injectRabaCSS(){
    if(document.getElementById("raba-css")) return;

    // Fuentes (Google Fonts: redondeadas + elegantes). Solo tipografías.
    if(!document.getElementById("raba-fonts")){
        let link = document.createElement("link");
        link.id = "raba-fonts";
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Quicksand:wght@400;600;700&family=Comfortaa:wght@400;700&family=Nunito:wght@400;700&family=Playfair+Display:wght@500;700&family=Dancing+Script:wght@600;700&display=swap";
        document.head.appendChild(link);
    }

    let p = RABA;
    let css = `

/* ===== Overlay base ===== */
.raba-overlay{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;
    background:rgba(106,27,84,0.30);backdrop-filter:blur(3px);animation:rabaFade .2s ease;}
@keyframes rabaFade{from{opacity:0}to{opacity:1}}
@keyframes rabaPop{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}

/* ===== Modal ===== */
.raba-modal{width:min(720px,96vw);max-height:92vh;display:flex;flex-direction:column;overflow:hidden;
    background:#fffafd;border-radius:20px;
    box-shadow:0 18px 60px rgba(200,80,192,0.42),0 3px 12px rgba(0,0,0,.14);
    border:1.5px solid #f8c8dc;animation:rabaPop .22s ease;}
.raba-modal-narrow{width:min(440px,94vw);}
.raba-modal-wide{width:min(860px,96vw);max-height:94vh;}
.raba-root *{box-sizing:border-box;}

/* ===== Header ===== */
.raba-header{padding:12px 16px 11px;display:flex;align-items:center;justify-content:space-between;gap:10px;
    background:linear-gradient(135deg,#ff6fae 0%,#c850c0 55%,#9b59b6 100%);
    border-bottom:1px solid rgba(255,255,255,.06);}
.raba-head-brand{display:flex;align-items:center;gap:10px;flex:1;min-width:0;}
.raba-head-logo{width:36px;height:36px;flex-shrink:0;background:rgba(255,255,255,.15);
    border:1px solid rgba(255,255,255,.2);border-radius:10px;
    display:flex;align-items:center;justify-content:center;font-size:18px;}
.raba-head-text{min-width:0;}
.raba-head-title{font-size:18px;font-weight:800;color:#fff;letter-spacing:.2px;
    text-shadow:0 1px 3px rgba(0,0,0,.2);line-height:1.2;}
.raba-head-sub{font-size:12px;color:rgba(255,255,255,.85);margin-top:3px;}
.raba-head-btns{display:flex;gap:5px;flex-shrink:0;}
.raba-icon-btn{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);cursor:pointer;
    width:28px;height:28px;border-radius:8px;font-size:13px;color:rgba(255,255,255,.9);
    display:flex;align-items:center;justify-content:center;transition:all .15s;}
.raba-icon-btn:hover{background:rgba(255,255,255,.2);color:#fff;}

/* ===== Body ===== */
.raba-body{padding:14px 18px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;}
.raba-body::-webkit-scrollbar{width:6px;}
.raba-body::-webkit-scrollbar-thumb{background:#ffb3d1;border-radius:10px;}
.raba-body::-webkit-scrollbar-track{background:#f3e0f7;}

/* ===== Lista de opciones (iOS-style) ===== */
.raba-cfg-list{display:grid;grid-template-columns:1fr 1fr;gap:8px;}

/* ── Fila estándar (icono + texto | control) ── */
.raba-cfg-row{
    background:#fff0f7;border:1.5px solid #f8c8dc;border-radius:12px;
    padding:11px 13px;display:flex;align-items:center;justify-content:space-between;gap:10px;
    align-self:stretch;
    transition:border-color .15s;}
.raba-cfg-row:hover{border-color:#ff6fae;}
.raba-cfg-info{display:flex;align-items:center;gap:9px;flex:1;min-width:0;}
.raba-cfg-icon{font-size:18px;line-height:1;flex-shrink:0;}
.raba-cfg-title{font-size:13px;font-weight:700;color:#6a1b54;
    display:flex;align-items:center;gap:5px;flex-wrap:wrap;line-height:1.3;}
.raba-cfg-desc{font-size:11px;color:#9a5a82;margin-top:3px;line-height:1.5;}
.raba-tag{font-size:9px;font-weight:700;color:#c850c0;background:#f3e0f7;
    padding:1px 7px;border-radius:20px;border:1px solid #f8c8dc;flex-shrink:0;}

/* ── Fila del slider (factor) ── */
.raba-cfg-slider-card{
    background:#fff0f7;border:1.5px solid #f8c8dc;border-radius:12px;
    padding:11px 13px;display:flex;flex-direction:column;justify-content:center;gap:7px;
    align-self:stretch;
    transition:border-color .15s;}
.raba-cfg-slider-card:hover{border-color:#ff6fae;}
.raba-cfg-slider-head{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.raba-slider-num{font-size:20px;font-weight:800;color:#e84393;flex-shrink:0;}
.raba-range{-webkit-appearance:none;width:100%;height:6px;border-radius:20px;
    background:linear-gradient(90deg,#ff6fae 100%,#f8c8dc 100%);
    outline:none;cursor:pointer;}
.raba-range::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;
    background:#e84393;border:3px solid #fff;
    box-shadow:0 2px 8px rgba(232,67,147,.45);cursor:pointer;transition:transform .12s;}
.raba-range::-webkit-slider-thumb:hover{transform:scale(1.12);}
.raba-range::-moz-range-thumb{width:20px;height:20px;border-radius:50%;
    border:3px solid #fff;background:#e84393;cursor:pointer;}

/* ===== Toggle capacidad (1000 / 1500) ===== */
.raba-cap-toggle{display:flex;gap:0;flex-shrink:0;border:2px solid #ff6fae;border-radius:20px;overflow:hidden;}
.raba-cap-btn{padding:5px 14px;font-size:13px;font-weight:700;color:#e84393;background:#fff;
    border:none;cursor:pointer;transition:all .15s;font-family:inherit;}
.raba-cap-btn.raba-cap-active{background:linear-gradient(135deg,#ff6fae,#c850c0);color:#fff;}
.raba-cap-btn:hover:not(.raba-cap-active){background:#fff0f7;}

/* ===== Stepper ===== */
.raba-stepper{display:flex;align-items:center;gap:6px;flex-shrink:0;}
.raba-step-btn{width:28px;height:28px;border-radius:50%;border:2px solid #ff6fae;background:#fff;
    color:#e84393;font-size:16px;font-weight:700;cursor:pointer;
    display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0;}
.raba-step-btn:hover{background:#ff6fae;color:#fff;transform:scale(1.08);}
input.raba-step-val{width:48px;text-align:center;font-size:14px;font-weight:700;color:#6a1b54;
    background:#fff;border:1.5px solid #f8c8dc;border-radius:9px;
    padding:4px 2px;outline:none;font-family:inherit;
    -moz-appearance:textfield;}
input.raba-step-val::-webkit-inner-spin-button,
input.raba-step-val::-webkit-outer-spin-button{-webkit-appearance:none;}
input.raba-step-val:focus{border-color:#e84393;box-shadow:0 0 0 2px rgba(232,67,147,.14);}

/* ===== Toggle switch ===== */
.raba-switch{display:flex;align-items:center;cursor:pointer;flex-shrink:0;}
.raba-switch input{display:none;}
.raba-slider-toggle{width:40px;height:22px;border-radius:20px;background:#f8c8dc;
    position:relative;transition:background .2s;}
.raba-slider-toggle::after{content:"";position:absolute;top:3px;left:3px;width:16px;height:16px;
    border-radius:50%;background:#fff;transition:transform .2s;
    box-shadow:0 1px 4px rgba(0,0,0,.22);}
.raba-switch input:checked + .raba-slider-toggle{background:linear-gradient(135deg,#ff6fae,#c850c0);}
.raba-switch input:checked + .raba-slider-toggle::after{transform:translateX(18px);}

/* ===== Botón principal ===== */
.raba-btn-primary{width:100%;padding:11px;border:none;border-radius:12px;cursor:pointer;
    font-size:14px;font-weight:800;color:#fff;font-family:inherit;letter-spacing:.3px;
    background:linear-gradient(135deg,#ff6fae 0%,#e84393 50%,#c850c0 100%);
    box-shadow:0 5px 18px rgba(232,67,147,.40);transition:transform .12s,box-shadow .15s,filter .15s;}
.raba-btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(232,67,147,.54);filter:brightness(1.05);}
.raba-btn-primary:active{transform:translateY(0);}

/* ===== Settings overlay ===== */
.raba-sett-section{display:flex;flex-direction:column;gap:8px;}
.raba-sett-label{font-size:12px;font-weight:800;color:#6a1b54;}
.raba-sett-sub{font-size:10.5px;color:#9a5a82;}
.raba-font-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
@media(max-width:480px){.raba-font-grid{grid-template-columns:1fr;}}
.raba-font-card{background:#fff;border:1.5px solid #f8c8dc;border-radius:11px;
    padding:9px 12px;cursor:pointer;display:flex;flex-direction:column;gap:2px;
    transition:border-color .15s,box-shadow .15s;}
.raba-font-card:hover{border-color:#ff6fae;}
.raba-font-active{border-color:#e84393;background:linear-gradient(135deg,#fff,#fff0f7);
    box-shadow:0 0 0 2px rgba(232,67,147,.18);}
.raba-font-name{font-size:12px;font-weight:700;color:#6a1b54;}
.raba-font-sample{font-size:13px;color:#9a5a82;}

/* ===== Footer ===== */
.raba-footer{padding:7px 14px;text-align:center;font-size:10.5px;color:#9a5a82;
    background:#fff0f7;border-top:1.5px solid #f8c8dc;font-style:italic;}
.raba-footer strong{color:#e84393;font-style:normal;}

/* ===== Ayuda ===== */
.raba-help-body{display:flex;flex-direction:column;gap:8px;}
.raba-help-section{background:#fff0f7;border:1.5px solid #f8c8dc;
    border-radius:12px;padding:11px 13px;display:flex;flex-direction:column;gap:5px;}
.raba-help-section.raba-help-tips{background:#f3e0f7;}
.raba-help-stitle{font-size:12.5px;font-weight:800;color:#e84393;margin-bottom:2px;}
.raba-help-p{font-size:12px;color:#6a1b54;line-height:1.55;margin:0;}
.raba-help-list{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px;}
.raba-help-list li{font-size:11.5px;color:#6a1b54;line-height:1.5;
    display:flex;align-items:baseline;gap:6px;flex-wrap:wrap;}
.raba-help-tag{display:inline-block;font-size:10px;font-weight:700;
    color:#6a1b54;background:#fff;border:1px solid #f8c8dc;
    border-radius:7px;padding:2px 8px;white-space:nowrap;flex-shrink:0;}

/* ===== Loader (Fase 2) ===== */
.raba-loader-box{background:#fff;border-radius:18px;padding:26px 32px;min-width:260px;
    box-shadow:0 18px 48px rgba(200,80,192,.35);text-align:center;}
.raba-loader-spinner{width:36px;height:36px;border:3px solid #f3e0f7;
    border-top-color:#e84393;border-radius:50%;
    animation:rabaSpin .75s linear infinite;margin:0 auto 14px;}
@keyframes rabaSpin{to{transform:rotate(360deg);}}
.raba-loader-title{font-size:14px;font-weight:800;color:#6a1b54;margin-bottom:4px;}
.raba-loader-sub{font-size:10.5px;color:#9a5a82;margin-bottom:14px;line-height:1.4;}
.raba-loader-bar-wrap{background:#f3e0f7;border-radius:20px;height:6px;overflow:hidden;}
.raba-loader-bar{height:100%;background:linear-gradient(90deg,#ff6fae,#e84393);
    border-radius:20px;transition:width .08s;}
.raba-loader-count{font-size:10.5px;color:#9a5a82;margin-top:7px;}

/* ===== Resultados (Fase 3) ===== */
.raba-results-body{overflow-y:auto;max-height:calc(90vh - 130px);padding:14px 16px;
    display:flex;flex-direction:column;gap:12px;}
.raba-stats-wrap,.raba-table-wrap{overflow:auto;}
.raba-table-wrap{max-height:42vh;border-radius:14px;}

/* ===== Tablas heredadas del motor ===== */
#raba-results-overlay table.scriptTable,
#raba-results-overlay table.scriptTableAlternate,
#raba-results-overlay table.scriptTableInner,
#raba-results-overlay table.scriptTableBalancerResult,
.raba-dialog table{
    width:100%;border-collapse:separate;border-spacing:0;font-size:12.5px;
    color:#6a1b54;background:#fff;border-radius:14px;overflow:hidden;
    box-shadow:0 3px 12px rgba(232,67,147,.10);}
#raba-results-overlay table td,.raba-dialog table td{
    padding:8px 10px;text-align:center;border-bottom:1px solid #f3e0f7;}
#raba-results-overlay table tr:first-child td,.raba-dialog table tr:first-child td{
    background:linear-gradient(135deg,#ff6fae,#c850c0);color:#fff;font-weight:700;border:none;}
#raba-results-overlay table tr:first-child td a,
#raba-results-overlay table tr:first-child td font{color:#fff !important;}
#raba-results-overlay table.scriptTableAlternate tr:nth-child(even):not(:first-child){background:#fff0f7;}
#raba-results-overlay table tr:hover:not(:first-child){background:#f3e0f7;}
#raba-results-overlay table a{color:#e84393;text-decoration:none;}
#raba-results-overlay table a:hover{text-decoration:underline;}
#raba-results-overlay table img{width:16px;height:16px;vertical-align:middle;}
#raba-results-overlay .btn_send,
#raba-results-overlay input.btn,
.raba-dialog input.btn{
    border:none;border-radius:9px;cursor:pointer;padding:6px 14px;font-size:12px;font-weight:700;
    color:#fff;font-family:inherit;
    background:linear-gradient(135deg,#ff6fae,#e84393);
    box-shadow:0 2px 7px rgba(232,67,147,.3);transition:transform .12s,filter .15s;}
#raba-results-overlay .btn_send:hover,
#raba-results-overlay input.btn:hover{transform:translateY(-1px);filter:brightness(1.06);}
#raba-results-overlay .btn_send:disabled{opacity:.5;cursor:not-allowed;}

/* ===== Celdas surplus / deficit ===== */
.raba-cell-surplus{background:#d1fae5 !important;color:#047857 !important;font-weight:700;}
.raba-cell-deficit{background:#fce7f3 !important;color:#9d174d !important;font-weight:700;}

/* ===== raba-dlg-body (showRabaDlg) ===== */
.raba-dlg-body{padding:16px 18px;overflow-y:auto;max-height:calc(88vh - 130px);}
.raba-dlg-body::-webkit-scrollbar{width:7px;}
.raba-dlg-body::-webkit-scrollbar-thumb{background:#ff8fc7;border-radius:10px;}
.raba-dlg-body::-webkit-scrollbar-track{background:#f3e0f7;}
.raba-dlg-body table.scriptTable,
.raba-dlg-body table.scriptTableBalancerResult,
.raba-dlg-body table.scriptTableInner{
    width:100%;border-collapse:separate;border-spacing:0;font-size:12.5px;
    color:#6a1b54;background:#fff;border-radius:14px;overflow:hidden;
    box-shadow:0 3px 12px rgba(232,67,147,.10);}
.raba-dlg-body table td{
    padding:8px 10px;text-align:center;border-bottom:1px solid #f3e0f7;white-space:nowrap;}
.raba-dlg-body table tr:first-child td{
    background:linear-gradient(135deg,#ff6fae,#c850c0);color:#fff;font-weight:700;border:none;}
.raba-dlg-body table tr:first-child td a{color:#fff !important;}
.raba-dlg-body table tr:nth-child(even):not(:first-child){background:#fff0f7;}
.raba-dlg-body table tr:hover:not(:first-child){background:#f3e0f7;}
.raba-dlg-body table a{color:#e84393;text-decoration:none;}
.raba-dlg-body table a:hover{text-decoration:underline;}

/* ===== Results body ===== */
.raba-results-body{padding:16px 20px;overflow-y:auto;display:flex;flex-direction:column;gap:14px;max-height:calc(92vh - 110px);}
.raba-results-body::-webkit-scrollbar{width:6px;}
.raba-results-body::-webkit-scrollbar-thumb{background:#ffb3d1;border-radius:10px;}
.raba-results-body::-webkit-scrollbar-track{background:#f3e0f7;}

/* ===== Header row (tabs + info) ===== */
.raba-res-header-row{display:flex;align-items:center;gap:10px;margin-bottom:8px;}

/* ===== Tabs ===== */
.raba-res-tabs{display:flex;gap:6px;}
.raba-res-tab{padding:7px 16px;border-radius:20px;border:2px solid #f8c8dc;background:#fff;
    color:#9a5a82;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;}
.raba-res-tab:hover{border-color:#ff6fae;color:#e84393;}
.raba-res-tab-active{background:linear-gradient(135deg,#ff6fae,#c850c0)!important;color:#fff!important;border-color:transparent!important;}

/* ===== Stat cards ===== */
.raba-stat-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.raba-stat-card{background:#fff;border:1.5px solid #f8c8dc;border-radius:16px;padding:14px 16px;
    display:flex;flex-direction:column;gap:6px;
    box-shadow:0 2px 10px rgba(232,67,147,.07);}
.raba-stat-head{display:flex;align-items:center;gap:8px;margin-bottom:2px;}
.raba-stat-img{width:20px;height:20px;}
.raba-stat-name{font-size:13px;font-weight:800;color:#6a1b54;}
.raba-stat-nums{text-align:right;}
.raba-stat-big{font-size:22px;font-weight:800;color:#e84393;line-height:1;}
.raba-stat-sub{font-size:10px;color:#9a5a82;margin-top:1px;}
.raba-stat-divider{height:1px;background:#f8c8dc;margin:4px 0;}
.raba-stat-row{display:flex;justify-content:space-between;align-items:center;}
.raba-stat-key{font-size:11px;color:#9a5a82;}
.raba-stat-val{font-size:12px;font-weight:700;color:#6a1b54;}
.surplus-text{color:#047857!important;}
.deficit-text{color:#be185d!important;}

/* ===== Empty state ===== */
.raba-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:8px;padding:36px 20px;text-align:center;
    background:#fff;border:1.5px solid #f8c8dc;border-radius:16px;
    box-shadow:0 2px 12px rgba(232,67,147,.07);}
.raba-empty-icon{font-size:40px;line-height:1;}
.raba-empty-title{font-size:16px;font-weight:800;color:#6a1b54;}
.raba-empty-desc{font-size:12px;color:#9a5a82;max-width:320px;line-height:1.5;}

/* ===== Toast ===== */
.raba-toast{position:fixed;bottom:28px;right:28px;z-index:999999;
    padding:13px 22px;border-radius:14px;color:#fff;font-size:13px;font-weight:700;
    box-shadow:0 8px 28px rgba(0,0,0,.18);
    display:flex;align-items:center;gap:10px;
    opacity:0;transform:translateY(14px);transition:opacity .3s,transform .3s;
    pointer-events:none;max-width:340px;}
.raba-toast.raba-toast-show{opacity:1;transform:translateY(0);}

/* ===== Leyenda stats ===== */
.raba-stat-legend{padding:12px 16px;margin-top:4px;
    background:#fff;border:1.5px solid #f8c8dc;border-radius:14px;
    box-shadow:0 2px 8px rgba(232,67,147,.06);}
.raba-leg-title{font-size:11px;font-weight:800;color:#9a5a82;letter-spacing:.4px;text-transform:uppercase;margin-bottom:8px;}
.raba-leg-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 20px;}
.raba-leg-item{display:flex;align-items:flex-start;gap:8px;font-size:11.5px;color:#6a1b54;line-height:1.4;}
.raba-leg-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;margin-top:3px;}

/* ===== Send table ===== */
.raba-table-wrap{overflow:auto;border-radius:16px;box-shadow:0 2px 12px rgba(232,67,147,.09);max-height:310px;}
.raba-table-wrap::-webkit-scrollbar{width:6px;height:6px;}
.raba-table-wrap::-webkit-scrollbar-thumb{background:#ffb3d1;border-radius:10px;}
.raba-table-wrap::-webkit-scrollbar-track{background:#f3e0f7;}
.raba-table-wrap table{width:100%;border-collapse:collapse;font-size:12.5px;color:#6a1b54;background:#fff;border-radius:16px;overflow:hidden;}
.raba-table-wrap table thead td{
    background:linear-gradient(135deg,#ff6fae 0%,#c850c0 100%);color:#fff;font-weight:700;
    padding:10px 12px;white-space:nowrap;text-align:center;
    position:sticky;top:0;z-index:2;}
.raba-table-wrap table tbody tr td{
    padding:9px 12px;border-bottom:1px solid #f3e0f7;text-align:center;
    background:#fff!important;color:#6a1b54!important;font-weight:normal!important;transition:background .1s;}
.raba-table-wrap table tbody tr:nth-child(even) td{background:#fdf4f9!important;}
.raba-table-wrap table tbody tr:hover td{background:#f3e0f7!important;}

/* ===== Nr badge ===== */
.raba-nr-badge{display:inline-block;background:linear-gradient(135deg,#ff6fae,#c850c0);color:#fff;font-weight:800;font-size:11px;
    padding:3px 9px;border-radius:20px;white-space:nowrap;}

/* ===== Village link ===== */
.raba-table-wrap a.raba-village-link,
.raba-table-wrap tbody a.raba-village-link,
.raba-table-wrap tbody tr td a.raba-village-link{color:#e84393!important;font-weight:700!important;text-decoration:none!important;}
.raba-table-wrap a.raba-village-link:hover{text-decoration:underline!important;}

/* ===== Sort links ===== */
.raba-sort-link{color:#fff!important;text-decoration:none;font-weight:700;opacity:.95;}
.raba-sort-link:hover{opacity:.7;}

/* ===== Send button ===== */
.raba-send-btn{padding:6px 16px;border:none;border-radius:20px;cursor:pointer;font-size:12px;font-weight:700;
    background:linear-gradient(135deg,#ff6fae,#c850c0);color:#fff;font-family:inherit;
    transition:opacity .15s,transform .12s;white-space:nowrap;letter-spacing:.2px;}
.raba-send-btn:hover:not(:disabled){opacity:.85;transform:scale(1.05);}
.raba-send-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;}

/* ===== Leyenda flotante mapa ===== */
#raba-map-legend{
    position:fixed;bottom:24px;left:24px;z-index:100002;
    background:#fff;border:1.5px solid #f8c8dc;border-radius:16px;
    box-shadow:0 8px 32px rgba(200,80,192,.22);
    min-width:260px;max-width:320px;overflow:hidden;
    font-family:inherit;}
.rml-header{display:flex;align-items:center;justify-content:space-between;
    padding:10px 14px;
    background:linear-gradient(135deg,#ff6fae,#c850c0);color:#fff;}
.rml-title{font-size:13px;font-weight:800;}
.rml-close{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.2);
    color:#fff;border-radius:8px;width:24px;height:24px;cursor:pointer;font-size:12px;
    display:flex;align-items:center;justify-content:center;}
.rml-legend-key{display:flex;gap:14px;padding:6px 14px;
    background:#fff0f7;border-bottom:1px solid #f8c8dc;font-size:11px;}
.rml-rows{display:flex;flex-direction:column;gap:0;max-height:260px;overflow-y:auto;padding:6px 0;}
.rml-rows::-webkit-scrollbar{width:4px;}
.rml-rows::-webkit-scrollbar-thumb{background:#ffb3d1;border-radius:10px;}
.rml-row{display:flex;align-items:center;gap:8px;padding:5px 14px;font-size:11.5px;color:#6a1b54;
    border-bottom:1px solid #f3e0f7;}
.rml-row:last-child{border-bottom:none;}
.rml-dot{width:13px;height:13px;border-radius:50%;flex-shrink:0;}
.rml-zone{font-weight:700;flex:1;}
.rml-aldeas{color:#9a5a82;font-size:10.5px;white-space:nowrap;}
.rml-send{color:#ff7eb3;font-weight:700;white-space:nowrap;min-width:52px;text-align:right;}
.rml-get{color:#5fffb0;font-weight:700;white-space:nowrap;min-width:52px;text-align:right;
    filter:drop-shadow(0 0 1px #00000055);}
.rml-header{cursor:grab;}
.rml-header:active{cursor:grabbing;}
.rml-footer{font-size:10px;color:#9a5a82;text-align:center;padding:7px 14px;
    background:#fff0f7;border-top:1px solid #f8c8dc;display:flex;flex-direction:column;align-items:center;gap:4px;}
.rml-footer-tip{opacity:.7;}
.rml-show-btn{padding:5px 14px;border:none;border-radius:20px;cursor:pointer;font-size:11px;font-weight:700;
    background:linear-gradient(135deg,#ff6fae,#c850c0);color:#fff;font-family:inherit;transition:opacity .15s;}
.rml-show-btn:hover{opacity:.85;}
`;
    let style = document.createElement("style");
    style.id = "raba-css";
    style.textContent = css;
    document.head.appendChild(style);
}

function initializationTheme(){
    // Carga la tipografía guardada (rediseño Raba). Los temas de color antiguos
    // se sustituyen por una única paleta rosa & malva.
    try {
        let saved = localStorage.getItem(RABA_FONT_KEY);
        let found = RABA_FONTS.find(f => f.id === saved);
        currentFont = found || RABA_FONTS[0];
    } catch (e) {
        currentFont = RABA_FONTS[0];
    }
}





async function balancingResources(){

    let time_construction_total=parseFloat(document.getElementById("time_construction").value)
    let averageFactor=parseFloat(document.getElementById("nr_average_factor").value)
    let reserveMerchants=parseInt(document.getElementById("nr_merchants_reserve").value)
    let merchantCapacity=parseInt(document.getElementById("merchant_capacity").value)
    let nrClusters=parseInt(document.getElementById("nr_clusters").value)
    let maxConstruction=document.getElementById("max_construction").checked

    reserveMerchants=(Number.isNaN(reserveMerchants)==true || reserveMerchants<0 )?0:reserveMerchants //by default are 0 merchants as reserver
    nrClusters=(Number.isNaN(nrClusters)==true || nrClusters<1 )?1:nrClusters //by default is one cluster
    time_construction_total=(Number.isNaN(time_construction_total)==true || time_construction_total<0 )?20:time_construction_total//if something is not right by default is 20hours
    time_construction_total=(time_construction_total > 50)?50:time_construction_total//limit construction time to 50 hours

    averageFactor=(Number.isNaN(averageFactor)==true)?1:(averageFactor<0)?0:(averageFactor>1)?1:averageFactor //if>1 is 1 if <0 is 0 if is NaN is 1
    merchantCapacity=(Number.isNaN(merchantCapacity)==true)?1000:(merchantCapacity<1000)?1000:(merchantCapacity>1500)?1500:merchantCapacity //capacitiy is 1000 but for .PT might be 1500
    
    

    // console.log("reserveMerchants",reserveMerchants)
    // console.log("time_construction_total",time_construction_total)
    // console.log("averageFactor",averageFactor)
    // console.log("merchantCapacity",merchantCapacity)



    showRabaLoader("Recopilando datos de tus aldeas...", "Leyendo producción, transportes y plantillas de construcción");
    $("#div_container").remove();
    let {list_production, map_farm_usage} = await getDataProduction().catch(err=>alert(err))
    let map_incoming = await getDataIncoming().catch(err=>alert(err))
    let map_resources_get_AM_data = await getResourcesForAM(map_farm_usage).catch(err=>alert(err))
    let list_production_home=JSON.parse(JSON.stringify(list_production))

    let map_resources_get_AM;
    if(time_construction_total > 0)
        map_resources_get_AM = map_resources_get_AM_data[time_construction_total - 1];
    else
        map_resources_get_AM = new Map();


    console.log("list_production",list_production)
    console.log("map_farm_usage",map_farm_usage)
    console.log("map_incoming",map_incoming)
    console.log("map_resources_get_AM",map_resources_get_AM)

    


    let start=new Date().getTime()




    ///////////////////////////////////////////////get clusters///////////////////////////////////////
    let kmeans_coords=[]
    for(let i=0;i<list_production.length;i++){
        kmeans_coords.push([
                parseInt(list_production[i].coord.split("|")[0]),
                parseInt(list_production[i].coord.split("|")[1])
            ])
    }
    console.log("kmeans_coords")
    console.log(kmeans_coords)
    let options={
        numberOfClusters:nrClusters,
        maxIterations:100
    }
    if(kmeans_coords.length === 0){
        showRabaLoaderError(
            "Grupo sin aldeas",
            "El grupo activo no contiene ninguna aldea.<br>Cambia de grupo y vuelve a ejecutar el script."
        );
        return;
    }
    let clusters= getClusters(kmeans_coords,options)
    console.log("clusters",clusters)

    let list_production_cluster=[]
    let list_production_home_cluster=[]
    let map_draw_on_map=new Map()

    for(let i=0;i<clusters.length;i++){// for each cluster
        let list_coords=clusters[i].data
        let list_prod=[],list_prod_home=[]
        // console.log(list_coords)
        for(let j=0;j<list_coords.length;j++){//for each village of a cluster
            let coord=list_coords[j].join("|")
            for(let k=0;k<list_production.length;k++){//search in the main list 
                if(list_production[k].coord == coord){
                    list_prod.push(list_production[k])
                    list_prod_home.push(list_production_home[k])
                    console.log(`label_cluster: ${i}`)

                    //add incoming and then show on the map
                    let total_resources_get=0
                    if(map_incoming.has(coord)){
                        total_resources_get=map_incoming.get(coord).wood+map_incoming.get(coord).stone+map_incoming.get(coord).iron
                    }
                    map_draw_on_map.set(list_production[k].id,{
                        label_cluster:i,
                        villageId:list_production[k].id,
                        total_resources_get:total_resources_get,
                        total_resources_send:0
                    })

                    break;
                }
            }
        }

        list_production_cluster.push(list_prod)
        list_production_home_cluster.push(list_prod_home)
    }
    console.log("list_production_cluster",list_production_cluster)



    /////////////////////////////////////////////calculate total nr of resources and global average////////////////////////////////////////

    let total_wood_home=0,total_stone_home=0,total_iron_home=0
    let avg_wood_total=0,avg_stone_total=0,avg_iron_total=0

    for(let i=0;i<list_production.length;i++){
        let coord=list_production[i].coord
        if(map_incoming.has(coord)){
            list_production[i].wood  += map_incoming.get(coord).wood
            list_production[i].stone += map_incoming.get(coord).stone
            list_production[i].iron  += map_incoming.get(coord).iron

            //in case minting a village might have huge cantity of resources underway
            list_production[i].wood = Math.min(list_production[i].wood , list_production[i].capacity)
            list_production[i].stone= Math.min(list_production[i].stone, list_production[i].capacity)
            list_production[i].iron = Math.min(list_production[i].iron , list_production[i].capacity)

        }
        avg_wood_total +=list_production[i].wood/list_production.length
        avg_stone_total+=list_production[i].stone/list_production.length
        avg_iron_total +=list_production[i].iron/list_production.length

        total_wood_home +=list_production[i].wood
        total_stone_home+=list_production[i].stone
        total_iron_home +=list_production[i].iron
    }

    // //////////////////////////////////update list_production with all incoming resources ,get average for each resource/////////////////////////


    let list_launches, list_clusters_stats
    let total_wood_send_stats, total_stone_send_stats, total_iron_send_stats
    let total_wood_get_stats, total_stone_get_stats, total_iron_get_stats
    let constructionTimeCalculated = 0

    if(maxConstruction == false || averageFactor > 0.5){
        let launchesData = calculateLaunches(
            list_production_cluster, 
            list_production_home_cluster,
            map_resources_get_AM,
            clusters,
            averageFactor,
            reserveMerchants, 
            merchantCapacity 
        )
        list_launches = launchesData.list_launches
        list_clusters_stats = launchesData.list_clusters_stats
        total_wood_send_stats = launchesData.total_wood_send_stats
        total_stone_send_stats = launchesData.total_stone_send_stats
        total_iron_send_stats = launchesData.total_iron_send_stats
        total_wood_get_stats = launchesData.total_wood_get_stats
        total_stone_get_stats = launchesData.total_stone_get_stats
        total_iron_get_stats = launchesData.total_iron_get_stats
    }
    else{
        let map_resources_get_AM = map_resources_get_AM_data[0];

        let launchesData = calculateLaunches(
            list_production_cluster, 
            list_production_home_cluster,
            map_resources_get_AM,
            clusters,
            averageFactor,
            reserveMerchants, 
            merchantCapacity 
        )
        list_launches = launchesData.list_launches
        list_clusters_stats = launchesData.list_clusters_stats
        total_wood_send_stats = launchesData.total_wood_send_stats
        total_stone_send_stats = launchesData.total_stone_send_stats
        total_iron_send_stats = launchesData.total_iron_send_stats
        total_wood_get_stats = launchesData.total_wood_get_stats
        total_stone_get_stats = launchesData.total_stone_get_stats
        total_iron_get_stats = launchesData.total_iron_get_stats

        let count = 1;
        let maxConstruction = 100;
        while(count < maxConstruction){
            map_resources_get_AM = map_resources_get_AM_data[count];
            // console.log("iteration: " + count)
            launchesData = calculateLaunches(
                list_production_cluster, 
                list_production_home_cluster,
                map_resources_get_AM,
                clusters,
                averageFactor,
                reserveMerchants, 
                merchantCapacity 
            )
            let stats = launchesData.list_clusters_stats;
            let notEnoughRes = false;
            for(let i=0;i<stats.length;i++){
                if( stats[i].total_iron_get > stats[i].total_iron_send || 
                    stats[i].total_stone_get > stats[i].total_stone_send || 
                    stats[i].total_wood_get > stats[i].total_wood_send 
                ){
                    notEnoughRes = true;
                    break;
                }
            }
            if(notEnoughRes){
                constructionTimeCalculated = count
                break;
            }

            if(count == maxConstruction - 1){
                constructionTimeCalculated = count
            }


            list_launches = launchesData.list_launches
            list_clusters_stats = launchesData.list_clusters_stats
            total_wood_send_stats = launchesData.total_wood_send_stats
            total_stone_send_stats = launchesData.total_stone_send_stats
            total_iron_send_stats = launchesData.total_iron_send_stats
            total_wood_get_stats = launchesData.total_wood_get_stats
            total_stone_get_stats = launchesData.total_stone_get_stats
            total_iron_get_stats = launchesData.total_iron_get_stats
            count++;
        }


    }

    console.log("list_clusters_stats",list_clusters_stats)


    // list_launches.sort((o1,o2)=>{
    //     return (o1.total_send > o2.total_send)?-1:(o1.total_send < o2.total_send)?1:0
    // })
    list_clusters_stats.sort((o1,o2)=>{
        return (o1.max_distance > o2.max_distance)?-1:(o1.max_distance < o2.max_distance)?1:0
    })

    // how many merchants are sent on each village
    let map_nr_merchants=new Map()
    for(let i=0;i<list_launches.length;i++){
        let nr_merchants=list_launches[i].wood+list_launches[i].stone+list_launches[i].iron
        nr_merchants=Math.ceil(nr_merchants/merchantCapacity)

        if(map_nr_merchants.has(list_launches[i].coord_origin)){
            let nr_update=map_nr_merchants.get(list_launches[i].coord_origin)
            map_nr_merchants.set(list_launches[i].coord_origin,nr_merchants+nr_update)
        }
        else{
            map_nr_merchants.set(list_launches[i].coord_origin,nr_merchants)

        }
    }
    console.log("map nr merchants",map_nr_merchants)
    for(let i=0;i<list_production.length;i++){
        let nr_merchants=0
        if(map_nr_merchants.get(list_production[i].coord))
            nr_merchants=map_nr_merchants.get(list_production[i].coord)

        // console.log(`coord: ${list_production[i].coord},merchants calculated: ${nr_merchants} vs theory: ${list_production[i].merchants}`)
        list_production[i].merchantAvailable = list_production[i].merchants - nr_merchants
    }


    /////////////////////////////////////////////////////////////some statistics///////////////////////////////////
    let obj_stats={}
    obj_stats.avg_wood=Math.round(avg_wood_total)
    obj_stats.avg_stone=Math.round(avg_stone_total)
    obj_stats.avg_iron=Math.round(avg_iron_total)

    obj_stats.total_wood_send=Math.round(total_wood_send_stats)
    obj_stats.total_stone_send=Math.round(total_stone_send_stats)
    obj_stats.total_iron_send=Math.round(total_iron_send_stats)

    obj_stats.total_wood_get=Math.round(total_wood_get_stats)
    obj_stats.total_stone_get=Math.round(total_stone_get_stats)
    obj_stats.total_iron_get=Math.round(total_iron_get_stats)

    obj_stats.total_wood_home=Math.round(total_wood_home)
    obj_stats.total_stone_home=Math.round(total_stone_home)
    obj_stats.total_iron_home=Math.round(total_iron_home)

    ///////////////////////////////////////////////////////////end result of balancing//////////////////////////////
    for(let i=0;i<list_production.length;i++){
        for(let j=0;j<list_launches.length;j++){
            if(list_production[i].coord == list_launches[j].coord_destination){
                list_production[i].wood +=list_launches[j].wood
                list_production[i].stone+=list_launches[j].stone
                list_production[i].iron +=list_launches[j].iron
            }
            else if(list_production[i].coord == list_launches[j].coord_origin){
                list_production[i].wood -=list_launches[j].wood
                list_production[i].stone-=list_launches[j].stone
                list_production[i].iron -=list_launches[j].iron
            }
            list_production[i].result_wood =list_production[i].wood -Math.round(avg_wood_total)
            list_production[i].result_stone=list_production[i].stone-Math.round(avg_stone_total)
            list_production[i].result_iron =list_production[i].iron -Math.round(avg_iron_total)
            list_production[i].result_total=list_production[i].result_wood+list_production[i].result_stone+list_production[i].result_iron
        }

    }
    list_production.sort((o1,o2)=>{
        return (o1.result_total>o2.result_total)?1:(o1.result_total<o2.result_total)?-1:0
    })


    let map_launches_mass=new Map()







    for(let i=0;i<list_launches.length;i++){
        let target_id=list_launches[i].id_destination
        let origin_id=list_launches[i].id_origin
        let woodKey=`resource[${origin_id}][wood]`
        let stoneKey=`resource[${origin_id}][stone]`
        let ironKey=`resource[${origin_id}][iron]`
        let send_resources={}

        //create a map with every launch
        if(map_launches_mass.has(target_id)){
            let obj_update=map_launches_mass.get(target_id)
            obj_update.send_resources[woodKey]=list_launches[i].wood
            obj_update.send_resources[stoneKey]=list_launches[i].stone
            obj_update.send_resources[ironKey]=list_launches[i].iron

            obj_update.total_send+=list_launches[i].total_send
            obj_update.total_wood+=list_launches[i].wood
            obj_update.total_stone+=list_launches[i].stone
            obj_update.total_iron+=list_launches[i].iron

            obj_update.distance=Math.max(obj_update.distance,list_launches[i].distance)
            map_launches_mass.set(target_id,obj_update)

        }else{
            send_resources[woodKey]=list_launches[i].wood
            send_resources[stoneKey]=list_launches[i].stone
            send_resources[ironKey]=list_launches[i].iron

            map_launches_mass.set(target_id,{
                target_id:target_id,
                coord_destination:list_launches[i].coord_destination,
                name_destination:list_launches[i].name_destination,
                send_resources:send_resources,
                total_send:list_launches[i].total_send,
                total_wood:list_launches[i].wood,
                total_stone:list_launches[i].stone,
                total_iron:list_launches[i].iron,
                distance:list_launches[i].distance
            })
        }




        if(map_draw_on_map.has(target_id)){
            let obj_update=map_draw_on_map.get(target_id)
            obj_update.total_resources_get+=list_launches[i].wood+list_launches[i].stone+list_launches[i].iron
            map_draw_on_map.set(target_id,obj_update)
        }

        if(map_draw_on_map.has(origin_id)){
            let obj_update=map_draw_on_map.get(origin_id)
            obj_update.total_resources_send+=list_launches[i].wood+list_launches[i].stone+list_launches[i].iron


            map_draw_on_map.set(origin_id,obj_update)
        }





    }

    let list_launches_mass=Array.from(map_launches_mass.entries()).map(e=>e[1])
    list_launches_mass.sort((o1,o2)=>{
        return (o1.total_send > o2.total_send)?-1:(o1.total_send < o2.total_send)?1:0
    })

    console.log("list_production",list_production)
    console.log("list_launches",list_launches)
    console.log("list_launches_mass",list_launches_mass)
    console.log("map_draw_on_map",map_draw_on_map)

    let stop= new Date().getTime()
    console.log("time process: "+(stop-start))
    

    hideRabaLoader();
    showRabaResults(list_launches_mass, obj_stats, list_production, list_clusters_stats);
    if(constructionTimeCalculated){
        let elTC = document.getElementById("time_construction");
        if(elTC) elTC.value = constructionTimeCalculated;
    }

    if (typeof (TWMap) != 'undefined') {
        console.log("map page")
        let _mc = document.getElementById("map_container");
        if(_mc) _mc.remove();
        TWMap.mapHandler.spawnSector=originalSpawnSector

        let random_color=[]
        for(let i=0;i<clusters.length;i++){
            let opacity=0.2
            let randomColor=getRandomColor(opacity)
            random_color.push(randomColor)
        }
        console.log(random_color)

        addInfoOnMap(map_draw_on_map,random_color)
        TWMap.init();
        showRabaMapLegend(random_color, list_clusters_stats);

    }


}

function calculateLaunches(
    list_production_cluster, 
    list_production_home_cluster,
    map_resources_get_AM, 
    clusters, 
    averageFactor, 
    reserveMerchants, 
    merchantCapacity)
    {
    let list_launches=[]
    let list_clusters_stats=[]

    let total_wood_send_stats=0,total_stone_send_stats=0,total_iron_send_stats=0
    let total_wood_get_stats=0,total_stone_get_stats=0,total_iron_get_stats=0

    for(let i=0;i<list_production_cluster.length;i++){
        console.log(`--------------cluster:${i}----------------`)

        let list_prod=list_production_cluster[i]
        let list_prod_home=list_production_home_cluster[i]

        let avg_wood=0,avg_stone=0,avg_iron=0
        let avg_wood_factor=0,avg_stone_factor=0,avg_iron_factor=0
        let total_wood_send=0,total_stone_send=0,total_iron_send=0
        let total_wood_get=0,total_stone_get=0,total_iron_get=0
        let list_res_send=[],list_res_get=[]
        let total_wood_cluster=0,total_stone_cluster=0,total_iron_cluster=0


        for(let j=0;j<list_prod.length;j++){

            avg_wood+=list_prod[j].wood/list_prod.length
            avg_stone+=list_prod[j].stone/list_prod.length
            avg_iron+=list_prod[j].iron/list_prod.length

            total_wood_cluster+=list_prod[j].wood
            total_stone_cluster+=list_prod[j].stone
            total_iron_cluster+=list_prod[j].iron

        }


        avg_wood_factor   = avg_wood  * averageFactor//reduce avg with a factor [0-1]
        avg_stone_factor  = avg_stone * averageFactor
        avg_iron_factor   = avg_iron  * averageFactor


        // console.log("list_prod_home",list_prod_home)
        // console.log("list_prod",list_prod)


        /////////////////////////////////////calculates resources send and get for each village//////////////////////////////////////////////////
        for(let j=0;j<list_prod.length;j++){
            let coord=list_prod[j].coord
            let name=list_prod[j].name
            let id=list_prod[j].id
            let merchants=list_prod[j].merchants
            merchants-=reserveMerchants

            let capacity=list_prod[j].capacity*0.95
            let capacity_travel=merchants*merchantCapacity

            let avg_wood_res = avg_wood_factor
            let avg_stone_res = avg_stone_factor
            let avg_iron_res = avg_iron_factor

            //here are added resources needed for AM construction
            if(map_resources_get_AM.has(list_prod[j].coord)){
                let obj_res_AM = map_resources_get_AM.get(list_prod[j].coord)

                avg_wood_res  += obj_res_AM.total_wood
                avg_stone_res += obj_res_AM.total_stone
                avg_iron_res  += obj_res_AM.total_iron
                list_prod[j].time_finished=obj_res_AM.time_finished
            }
            else{
                list_prod[j].time_finished=0//added later to see for how many hours do j have resources at home
            }

            let diff_wood =list_prod[j].wood - Math.round(avg_wood_res)
            let diff_stone =list_prod[j].stone - Math.round(avg_stone_res)
            let diff_iron =list_prod[j].iron - Math.round(avg_iron_res)

            // console.log(`aici ba prod:${list_prod[j].iron}, avg: ${Math.round(avg_iron_res)}`)

            //in case diff>0 check if there are available res at home
            diff_wood=(diff_wood < 0)?diff_wood:(list_prod_home[j].wood - diff_wood > 0)?diff_wood: (list_prod_home[j].wood)
            diff_stone=(diff_stone < 0)?diff_stone:(list_prod_home[j].stone - diff_stone > 0)?diff_stone: (list_prod_home[j].stone)
            diff_iron=(diff_iron < 0)?diff_iron:(list_prod_home[j].iron - diff_iron > 0)?diff_iron: (list_prod_home[j].iron)

            // console.log(`coord ${coord} merch:${merchants} cap:${capacity}, wood:${diff_wood}, stone:${diff_stone}, iron:${diff_iron}`)

            let total_res_available=0
            total_res_available=(diff_wood>0)?  total_res_available+diff_wood :  total_res_available
            total_res_available=(diff_stone>0)? total_res_available+diff_stone : total_res_available
            total_res_available=(diff_iron>0)?  total_res_available+diff_iron :  total_res_available

            // console.log("total_res_available",total_res_available)
            let norm_factor=(capacity_travel <= total_res_available) ? capacity_travel/total_res_available:1//normalize to the number of merchant available
            let send_wood=0,send_stone=0,send_iron=0
            let get_wood=0,get_stone=0,get_iron=0
            // console.log("norm_factor",norm_factor)

            send_wood =(diff_wood>0) ?  parseInt(diff_wood * norm_factor):send_wood
            send_stone=(diff_stone>0) ?  parseInt(diff_stone* norm_factor):send_stone
            send_iron =(diff_iron>0) ?  parseInt(diff_iron * norm_factor):send_iron
            // console.log(`send---->wood:${send_wood}, stone:${send_stone}, iron:${send_iron}`)
            
            //firstly check if needs res(diff_res<0) then check if after balance wh will overflow and if it overflows send only res to fill 95% of wh
            get_wood =(diff_wood>0) ?get_wood :(list_prod[j].wood +Math.abs(diff_wood) < capacity)? Math.abs(diff_wood) : capacity-list_prod[j].wood
            get_stone=(diff_stone>0)?get_stone:(list_prod[j].stone+Math.abs(diff_stone)< capacity)? Math.abs(diff_stone): capacity-list_prod[j].stone
            get_iron =(diff_iron>0) ?get_iron :(list_prod[j].iron +Math.abs(diff_iron) < capacity)? Math.abs(diff_iron) : capacity-list_prod[j].iron
            // console.log(`get---->wood:${get_wood}, stone:${get_stone}, iron:${get_iron}`)
            // console.log("------------------------------------------------------")
            




            total_wood_send+=send_wood
            total_stone_send+=send_stone
            total_iron_send+=send_iron

            total_wood_get+=get_wood
            total_stone_get+=get_stone
            total_iron_get+=get_iron

            let obj_send={
                coord:coord,
                id:id,
                name:name
            }
            let obj_get={
                coord:coord,
                id:id,
                name:name
            }

            obj_send.wood =(send_wood  > 0)?send_wood :0
            obj_send.stone=(send_stone > 0)?send_stone:0
            obj_send.iron =(send_iron  > 0)?send_iron :0
            if(obj_send.wood > 0 || obj_send.stone > 0 || obj_send.iron > 0)
                list_res_send.push(obj_send)
            
            obj_get.wood =(get_wood  > 0)?parseInt(get_wood) :0
            obj_get.stone=(get_stone > 0)?parseInt(get_stone):0
            obj_get.iron =(get_iron  > 0)?parseInt(get_iron) :0
            if(obj_get.wood > 0 || obj_get.stone > 0 || obj_get.iron > 0)
                list_res_get.push(obj_get)




        }

        // console.log("end results")
        // console.log("avg wood: " + avg_wood)
        // console.log("avg stone: "+ avg_stone)
        // console.log("avg iron: " + avg_iron)
        // console.log(`send---> wood:${total_wood_send}, stone:${total_stone_send}, iron:${total_iron_send}`)
        // console.log(`get----> wood:${total_wood_get}, stone:${total_stone_get}, iron:${total_iron_get}`)

        /////////////////////////////////////////normalization resources,if send resources< get resources =>normalize///////////////////////////
        let norm_wood=(total_wood_get>total_wood_send)?(total_wood_send/total_wood_get):1
        let norm_stone=(total_stone_get>total_stone_send)?(total_stone_send/total_stone_get):1
        let norm_iron=(total_iron_get>total_iron_send)?(total_iron_send/total_iron_get):1

        //////////////////////////////////////////normalize each res///////////////////////////////////////////////////////////////////
        for(let j=0;j<list_res_get.length;j++){
            list_res_get[j].wood =parseInt(list_res_get[j].wood *norm_wood)
            list_res_get[j].stone=parseInt(list_res_get[j].stone*norm_stone)
            list_res_get[j].iron =parseInt(list_res_get[j].iron *norm_iron)
        }

        // console.log("list_res_send",list_res_send)
        // console.log("list_res_get",list_res_get)




        let list_maxDistance=[]
        // ////////////////////////////////////////////////////calculates launches///////////////////////////////////////
        for(let j=0;j<list_res_get.length;j++){
            let coord_destination=list_res_get[j].coord
            let id_destination=list_res_get[j].id
            let name_destination=list_res_get[j].name
            
            //////////////////////////////////////////////////////calculate distance/////////////////////////////////////
            let max_distance=0;
            for(let k=0;k<list_res_send.length;k++){
                let distance=calcDistance(list_res_get[j].coord,list_res_send[k].coord)
                list_res_send[k].distance=distance
                max_distance=(max_distance > distance) ? max_distance :distance
            }
            list_res_send.sort((o1,o2)=>{
                return (o1.distance>o2.distance)?1:(o1.distance<o2.distance)?-1:0
            })

            let obj_launch={
                wood:0,
                stone:0,
                iron:0
            }

            for(let k=0;k<list_res_send.length;k++){
                let coord_origin=list_res_send[k].coord
                let id_origin=list_res_send[k].id
                let name_origin=list_res_send[k].name

                // if resources send >0 then return minimum between send and ged othervise return current value
                let send_wood=(list_res_send[k].wood   > 0) ? Math.min(list_res_get[j].wood  , list_res_send[k].wood)  : 0
                let send_stone=(list_res_send[k].stone > 0) ? Math.min(list_res_get[j].stone , list_res_send[k].stone)  : 0
                let send_iron=(list_res_send[k].iron   > 0) ? Math.min(list_res_get[j].iron  , list_res_send[k].iron)  : 0



                obj_launch.wood +=send_wood
                obj_launch.stone +=send_stone
                obj_launch.iron +=send_iron

                list_res_get[j].wood -= send_wood 
                list_res_get[j].stone -= send_stone 
                list_res_get[j].iron -= send_iron

                list_res_send[k].wood -= send_wood 
                list_res_send[k].stone -= send_stone 
                list_res_send[k].iron -= send_iron


                let total_send=send_wood+send_stone+send_iron

                //stupid bug, if a resource has xxx699 must get rid of 699 
                let restDivision=total_send%merchantCapacity
                let minim_resources= (merchantCapacity==1000)?700:1200// special case for PT 
                if(restDivision < minim_resources){
                    if(send_wood>restDivision){
                        send_wood-=restDivision
                        total_send-=restDivision
                    }
                    else if(send_stone>restDivision){
                        send_stone-=restDivision
                        total_send-=restDivision
                    }
                    else if(send_iron>restDivision){
                        send_iron-=restDivision
                        total_send-=restDivision
                    }                   
                }


                list_maxDistance.push(list_res_send[k].distance)

                if(total_send>=minim_resources)
                list_launches.push({
                    total_send:total_send,
                    wood:send_wood,
                    stone:send_stone,
                    iron:send_iron,
                    coord_origin:coord_origin,
                    name_origin:name_origin,
                    id_destination:id_destination,
                    id_origin:id_origin,
                    coord_destination:coord_destination,
                    name_destination:name_destination,
                    distance:list_res_send[k].distance
                })

                let total_get=list_res_get[j].wood+list_res_get[j].stone+list_res_get[j].iron
                if(total_get < minim_resources){
                    // console.log("done sending here")
                    break;
                }
            }
        }
        total_wood_send_stats +=total_wood_send
        total_stone_send_stats+=total_stone_send
        total_iron_send_stats +=total_iron_send

        total_wood_get_stats +=total_wood_get
        total_stone_get_stats+=total_stone_get
        total_iron_get_stats +=total_iron_get


        //calc distance max
        let max_distance=0
        for(let j=0;j<list_maxDistance.length;j++){
            if(max_distance < list_maxDistance[j])
                max_distance = list_maxDistance[j]
        }

        //add stats for cluster
        list_clusters_stats.push({
            nr_coords:clusters[i].data.length,
            center: parseInt(clusters[i].mean[0])+"|"+parseInt(clusters[i].mean[1]),
            max_distance:max_distance,

            avg_wood:Math.round(avg_wood),
            avg_stone:Math.round(avg_stone),
            avg_iron:Math.round(avg_iron),

            total_wood_send:total_wood_send,
            total_stone_send:total_stone_send,
            total_iron_send:total_iron_send,

            total_wood_get:total_wood_get,
            total_stone_get:total_stone_get,
            total_iron_get:total_iron_get,

            total_wood_cluster:total_wood_cluster,
            total_stone_cluster:total_stone_cluster,
            total_iron_cluster:total_iron_cluster
        })

    }

    return{
        list_clusters_stats: list_clusters_stats,
        list_launches: list_launches,

        total_wood_send_stats: total_wood_send_stats,
        total_stone_send_stats: total_stone_send_stats,
        total_iron_send_stats: total_iron_send_stats,

        total_wood_get_stats: total_wood_get_stats,
        total_stone_get_stats: total_stone_get_stats,
        total_iron_get_stats: total_iron_get_stats
    }
}


function hitCountApi(){
    // Telemetría eliminada en el rediseño Raba. (No envía datos a ningún servidor.)
}



///////////////////////////////////////////////////////////////////get all resources from page combined production//////////////////////////////////////////////////


function getDataProduction(){

    return new Promise((resolve,reject)=>{
        let link_combined_production=game_data.link_base_pure+"overview_villages&mode=prod"
        let dataPage = httpGet(link_combined_production)
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(dataPage, 'text/html');
        //get pages for all incoming
        let list_pages=[]
    
        if($(htmlDoc).find(".paged-nav-item").parent().find("select").length>0){
            Array.from($(htmlDoc).find(".paged-nav-item").parent().find("select").find("option")).forEach(function(item){
                list_pages.push(item.value)
            })
            list_pages.pop();
        }
        else if(htmlDoc.getElementsByClassName("paged-nav-item").length>0){//all pages from the current folder
            let nr=0;
            Array.from(htmlDoc.getElementsByClassName("paged-nav-item")).forEach(function(item){
                let current=item.href;
                current=current.split("page=")[0]+"page="+nr
                nr++;
                list_pages.push(current);
            })
        }
        else{
            list_pages.push(link_combined_production);
        }
        list_pages=list_pages.reverse();
    
    
        // go to every page and get incoming
        let list_production=[]
        let map_farm_usage=new Map() 
        function ajaxRequest (urls) {
            let current_url
            if(urls.length>0){
                current_url=urls.pop()
            }
            else{
                current_url="stop"
            }
            console.log(current_url)
            let start_ajax=new Date().getTime()
            if (urls.length >= 0 && current_url!="stop") {
                $.ajax({
                    url: current_url,
                    method: 'get',
                    success: (data) => {
                        const parser = new DOMParser();
                        const htmlDoc = parser.parseFromString(data, 'text/html');

                        if(game_data.device == "desktop"){
                            let table_production=Array.from($(htmlDoc).find(".row_a, .row_b"))
                            for(let i=0;i<table_production.length;i++){
                                let name=table_production[i].getElementsByClassName("quickedit-vn")[0].innerText
                                let coord=table_production[i].getElementsByClassName("quickedit-vn")[0].innerText.match(/[0-9]{3}\|[0-9]{3}/)[0]
                                let id=table_production[i].getElementsByClassName("quickedit-vn")[0].getAttribute("data-id")
                                
                                let wood=parseInt(table_production[i].getElementsByClassName("wood")[0].innerText.replace(".",""))
                                let stone=parseInt(table_production[i].getElementsByClassName("stone")[0].innerText.replace(".",""))
                                let iron=parseInt(table_production[i].getElementsByClassName("iron")[0].innerText.replace(".",""))
                                let merchants=parseInt(table_production[i].querySelector("a[href*='market']").innerText.split("/")[0])
                                let merchants_total=parseInt(table_production[i].querySelector("a[href*='market']").innerText.split("/")[1])
                                let capacity=parseInt(table_production[i].children[4].innerText)
                                let points=parseInt(table_production[i].children[2].innerText.replace(".",""))
                                let farm_current_pop=parseInt(table_production[i].children[6].innerText.split("/")[0])
                                let farm_total_pop=parseInt(table_production[i].children[6].innerText.split("/")[1])
                                let farm_usage=farm_current_pop/farm_total_pop
                                
                                let obj={
                                    coord:coord,
                                    id:id,
                                    wood:wood,
                                    stone:stone,
                                    iron:iron,
                                    name:name.trim(),
                                    merchants:merchants,
                                    merchants_total:merchants_total,
                                    capacity:capacity,
                                    points:points,
    
                                }
                                list_production.push(obj)
    
                                map_farm_usage.set(coord,farm_usage)
                            }
                        }
                        else{

                            let table_production = Array.from($(htmlDoc).find(".overview-container").find(".overview-container-item"))
                            for(let i=0;i<table_production.length;i++){
                                let name = $(table_production[i]).find(".quickedit-label").text().trim()
                                let coord = name.match(/\d+\|\d+/)[0]
                                let id = $(table_production[i]).find(".quickedit-vn").attr("data-id")

                                let wood = parseInt(table_production[i].getElementsByClassName("mwood")[0].innerText.replace(".",""))
                                let stone = parseInt(table_production[i].getElementsByClassName("mstone")[0].innerText.replace(".",""))
                                let iron = parseInt(table_production[i].getElementsByClassName("miron")[0].innerText.replace(".",""))
                                let merchants=parseInt($(table_production[i]).find(".vertical_center").text().trim())
                                let merchants_total=500
                                let capacity = parseInt(table_production[i].getElementsByClassName("ressources")[0].parentElement.innerText)
                                let points = parseInt($(table_production[i]).find(".grey").parent().text().replace(".",""))
                                let farm_current_pop=parseInt(table_production[i].getElementsByClassName("population")[0].parentElement.innerText.split("/")[0])
                                let farm_total_pop=parseInt(table_production[i].getElementsByClassName("population")[0].parentElement.innerText.split("/")[1])
                                let farm_usage=farm_current_pop/farm_total_pop
                           
                           
                                let obj={
                                    coord:coord,
                                    id:id,
                                    wood:wood,
                                    stone:stone,
                                    iron:iron,
                                    name:name,
                                    merchants:merchants,
                                    merchants_total:merchants_total,
                                    capacity:capacity,
                                    points:points,
    
                                }
                                list_production.push(obj)
    
                                map_farm_usage.set(coord,farm_usage)
                            }

                        }
                        


                        let stop_ajax=new Date().getTime();
                        let diff=stop_ajax-start_ajax
                        console.log("wait: "+diff)
                        window.setTimeout(function(){
                            ajaxRequest (list_pages)
                        },200-diff)
                    },
                    error: (err)=>{
                        reject(err)
                    }
                })

            }
            else
            {
                // console.log("list_production: herererre",list_production)
                resolve({
                    list_production:list_production,
                    map_farm_usage:map_farm_usage
                })
    
                
            }
        }
        ajaxRequest(list_pages);
    
    })
}

///////////////////////////////////////////////////////////////////get all resources from page incoming transport//////////////////////////////////////////////////

function getDataIncoming(){
    return new Promise((resolve,reject)=>{
        let link_combined_production=game_data.link_base_pure+"overview_villages&mode=trader&type=inc"
        let dataPage = httpGet(link_combined_production)
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(dataPage, 'text/html');

        //get pages for all incoming
        let list_pages=[]

        if($(htmlDoc).find(".paged-nav-item").parent().find("select").length>0){
            Array.from($(htmlDoc).find(".paged-nav-item").parent().find("select").find("option")).forEach(function(item){
                list_pages.push(item.value)
            })
            list_pages.pop();
        }
        else if(htmlDoc.getElementsByClassName("paged-nav-item").length>0){//all pages from the current folder
            let nr=0;
            Array.from(htmlDoc.getElementsByClassName("paged-nav-item")).forEach(function(item){
                let current=item.href;
                current=current.split("page=")[0]+"page="+nr
                nr++;
                list_pages.push(current);
            })
        }
        else{
            list_pages.push(link_combined_production);
        }
        list_pages=list_pages.reverse();


        // go to every page and get incoming
        let  map_incoming=new Map()
        function ajaxRequest (urls) {
            let current_url
            if(urls.length>0){
                current_url=urls.pop()
            }
            else{
                current_url="stop"
            }
            console.log(current_url)
            let start_ajax=new Date().getTime()
            if (urls.length >= 0 && current_url!="stop") {
                $.ajax({
                    url: current_url,
                    method: 'get',
                    success: (data) => {
                        const parser = new DOMParser();
                        const htmlDoc = parser.parseFromString(data, 'text/html');
                        let table_incoming=Array.from($(htmlDoc).find(".row_a, .row_b"))

                        for(let i=0;i<table_incoming.length;i++){
                            let coord = ""
                            if(game_data.device == "desktop"){
                                coord=table_incoming[i].children[4].innerText.match(/[0-9]{3}\|[0-9]{3}/)[0]
                            }
                            else{
                                coord=table_incoming[i].children[3].innerText.match(/[0-9]{3}\|[0-9]{3}/g)[1]
                            }

                            let wood=parseInt($(table_incoming[i]).find(".wood").parent().text().replace(".",""))
                            let stone=parseInt($(table_incoming[i]).find(".stone").parent().text().replace(".",""))
                            let iron=parseInt($(table_incoming[i]).find(".iron").parent().text().replace(".",""))
                            wood=(Number.isNaN(wood) ==true)?0:wood
                            stone=(Number.isNaN(stone) ==true)?0:stone
                            iron=(Number.isNaN(iron) ==true)?0:iron


                            let obj={
                                wood:wood,
                                stone:stone,
                                iron:iron,
                            }
                            if(map_incoming.has(coord)){
                                let obj_update=map_incoming.get(coord)
                                obj_update.wood+=wood
                                obj_update.stone+=stone
                                obj_update.iron+=iron
                                map_incoming.set(coord,obj_update)
                            }
                            else{
                                map_incoming.set(coord,obj)
                            }
                        }
                        let stop_ajax=new Date().getTime();
                        let diff=stop_ajax-start_ajax
                        console.log("wait: "+diff)
                        window.setTimeout(function(){
                            ajaxRequest (list_pages)
                        },200-diff)
                    },
                    error:(err)=>{
                        reject(err)
                    }
                })

            }
            else
            {
                // console.log(map_incoming)
                resolve(map_incoming)

                
            }
        }
        ajaxRequest(list_pages);
    })

}



function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}


function calcDistance(coord1,coord2){
    let x1=parseInt(coord1.split("|")[0])
    let y1=parseInt(coord1.split("|")[1])
    let x2=parseInt(coord2.split("|")[0])
    let y2=parseInt(coord2.split("|")[1])

    return Math.sqrt( (x1-x2)*(x1-x2) +  (y1-y2)*(y1-y2) );
}

///////////////////////////////////////////////////////////////////create interface +tables//////////////////////////////////////////////////

async function createTable(list_launches,obj_stats,list_production,list_clusters_stats){

    ////////////////////////////////////////////////////////////////////table send resources/////////////////////////////////////////////////////////////////////
    function buildSendTable(){
        if(list_launches.length === 0){
            return `<div class="raba-empty-state">
                <div class="raba-empty-icon">⚖️</div>
                <div class="raba-empty-title">¡Todo en equilibrio!</div>
                <div class="raba-empty-desc">No hay envíos necesarios. Tus aldeas ya están perfectamente equilibradas.</div>
            </div>`;
        }
        let rows = "";
        for(let i=0;i<list_launches.length;i++){
            let l = list_launches[i];
            let data = JSON.stringify(l.send_resources);
            rows += `<tr id="delete_row">
                <td><span class="raba-nr-badge">${i+1}</span></td>
                <td><a href="${game_data.link_base_pure}info_village&id=${l.target_id}" class="raba-village-link" style="color:#e84393!important;font-weight:700;text-decoration:none;">${l.name_destination}</a></td>
                <td>${l.distance.toFixed(1)}</td>
                <td><strong>${formatNumber(l.total_send)}</strong></td>
                <td class="hide_mobile">${formatNumber(l.total_wood)}</td>
                <td class="hide_mobile">${formatNumber(l.total_stone)}</td>
                <td class="hide_mobile">${formatNumber(l.total_iron)}</td>
                <td><button class="raba-send-btn btn_send" target_id="${l.target_id}" data='${data}'>📤 Enviar</button></td>
            </tr>`;
        }
        return `<table class="scriptTableAlternate">
            <thead><tr>
                <td style="width:3%">#</td>
                <td style="width:35%">Destino</td>
                <td><a href="#" id="sort_distance" class="raba-sort-link">📏 Distancia</a></td>
                <td><a href="#" id="sort_total" class="raba-sort-link">📦 Total</a></td>
                <td class="hide_mobile"><a href="#" id="sort_wood" class="raba-sort-link"><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/wood.png" style="width:14px;height:14px;vertical-align:-2px;"></a></td>
                <td class="hide_mobile"><a href="#" id="sort_stone" class="raba-sort-link"><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/stone.png" style="width:14px;height:14px;vertical-align:-2px;"></a></td>
                <td class="hide_mobile"><a href="#" id="sort_iron" class="raba-sort-link"><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/iron.png" style="width:14px;height:14px;vertical-align:-2px;"></a></td>
                <td>Acción</td>
            </tr></thead>
            <tbody>${rows}</tbody>
        </table>`;
    }

    document.getElementById("table_view").innerHTML = buildSendTable();

    if(game_data.device != "desktop") $(".hide_mobile").hide();

    ////////////////////////////////////////////////////////////////////table statistics/////////////////////////////////////////////////////////////////////
    function buildStatsSection(){
        const res = [
            { img:"https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/wood.png",  name:"Madera",  accent:"#a3e6b0", total: obj_stats.total_wood_home,  avg: obj_stats.avg_wood,  surplus: obj_stats.total_wood_send,  deficit: obj_stats.total_wood_get  },
            { img:"https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/stone.png", name:"Barro",   accent:"#fbd08a", total: obj_stats.total_stone_home, avg: obj_stats.avg_stone, surplus: obj_stats.total_stone_send, deficit: obj_stats.total_stone_get },
            { img:"https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/iron.png",  name:"Hierro",  accent:"#c4b5fd", total: obj_stats.total_iron_home,  avg: obj_stats.avg_iron,  surplus: obj_stats.total_iron_send,  deficit: obj_stats.total_iron_get  },
        ];

        let tabs = `<div class="raba-res-header-row">
            <div class="raba-res-tabs">
                <button class="raba-res-tab" id="btn_result">🏘️ Por aldea</button>
                <button class="raba-res-tab" id="btn_cluster">🗺️ Por zona</button>
            </div>
        </div>`;

        let cards = res.map(r => `
            <div class="raba-stat-card" style="border-top:3px solid ${r.accent};">
                <div class="raba-stat-head">
                    <img src="${r.img}" class="raba-stat-img">
                    <span class="raba-stat-name">${r.name}</span>
                </div>
                <div class="raba-stat-nums">
                    <div class="raba-stat-big">${formatNumber(r.total)}</div>
                    <div class="raba-stat-sub">total</div>
                </div>
                <div class="raba-stat-divider"></div>
                <div class="raba-stat-row"><span class="raba-stat-key">Media / aldea</span><span class="raba-stat-val">${formatNumber(r.avg)}</span></div>
                <div class="raba-stat-row"><span class="raba-stat-key surplus-text">↑ Superávit</span><span class="raba-stat-val surplus-text">+${formatNumber(r.surplus)}</span></div>
                <div class="raba-stat-row"><span class="raba-stat-key deficit-text">↓ Déficit</span><span class="raba-stat-val deficit-text">−${formatNumber(r.deficit)}</span></div>
            </div>`).join("");

        const legend = `<div class="raba-stat-legend">
            <div class="raba-leg-title">📖 Leyenda</div>
            <div class="raba-leg-grid">
                <div class="raba-leg-item"><span class="raba-leg-dot" style="background:#e84393"></span><span><b>Total</b> — recursos almacenados en todas tus aldeas ahora mismo</span></div>
                <div class="raba-leg-item"><span class="raba-leg-dot" style="background:#9a5a82"></span><span><b>Media</b> — cantidad media por aldea</span></div>
                <div class="raba-leg-item"><span class="raba-leg-dot" style="background:#047857"></span><span><b>Superávit</b> — lo que sobra y puede enviarse a otras aldeas</span></div>
                <div class="raba-leg-item"><span class="raba-leg-dot" style="background:#be185d"></span><span><b>Déficit</b> — lo que falta y necesita llegar de otras aldeas</span></div>
            </div>
        </div>`;
        return tabs + `<div class="raba-stat-cards">${cards}</div>` + legend;
    }

    document.getElementById("table_stats").innerHTML = buildStatsSection();

    ///////////////////////////////////////////events tabs/////////////////////////////////////////
    $("#btn_result").on("click", ()=>{ createTableResults(list_production); });
    $("#btn_cluster").on("click", ()=>{ createTableClusters(list_clusters_stats); });

    ///////////////////////////////////////////events sort/////////////////////////////////////////
    function reRender(){ document.getElementById("table_view").innerHTML = buildSendTable(); bindSortAndSend(); }

    function bindSortAndSend(){
        if(game_data.device != "desktop") $(".hide_mobile").hide();
        if(!document.getElementById("sort_distance")) return;
        document.getElementById("sort_distance").addEventListener("click",(e)=>{ e.preventDefault();
            list_launches.sort((a,b)=> parseFloat(a.distance)-parseFloat(b.distance)); reRender(); });
        document.getElementById("sort_total").addEventListener("click",(e)=>{ e.preventDefault();
            list_launches.sort((a,b)=> b.total_send-a.total_send); reRender(); });
        document.getElementById("sort_wood").addEventListener("click",(e)=>{ e.preventDefault();
            list_launches.sort((a,b)=> b.total_wood-a.total_wood); reRender(); });
        document.getElementById("sort_stone").addEventListener("click",(e)=>{ e.preventDefault();
            list_launches.sort((a,b)=> b.total_stone-a.total_stone); reRender(); });
        document.getElementById("sort_iron").addEventListener("click",(e)=>{ e.preventDefault();
            list_launches.sort((a,b)=> b.total_iron-a.total_iron); reRender(); });

        $(".btn_send").on("click", async(event)=>{
            if($(event.target).is(":disabled")) return;
            let target_id = $(event.target).attr("target_id");
            let data = JSON.parse($(event.target).attr("data"));
            $(".btn_send").attr("disabled", true);
            let start = new Date().getTime();
            sendResources(target_id, data);
            let diff = new Date().getTime() - start;
            window.setTimeout(()=>{
                $(event.target).closest("#delete_row").remove();
                $(".btn_send").attr("disabled", false);
                if($("#table_view tbody tr").length === 0){
                    $("#table_view").html(`<div class="raba-empty-state">
                        <div class="raba-empty-icon">⚖️</div>
                        <div class="raba-empty-title">¡Todo en equilibrio!</div>
                        <div class="raba-empty-desc">Todos los envíos completados. Tus aldeas ya están perfectamente equilibradas.</div>
                    </div>`);
                }
            }, 200 - diff);
        });

        if(document.getElementsByClassName("btn_send").length > 0)
            document.getElementsByClassName("btn_send")[0].focus();

        window.onkeydown = function(e){
            if(e.which == 13 && document.getElementsByClassName("btn_send").length > 0)
                document.getElementsByClassName("btn_send")[0].click();
        };
    }
    bindSortAndSend();

}


function rabaToast(msg, type){
    let id = "raba-toast-" + Date.now();
    let bg = type === "error"
        ? "linear-gradient(135deg,#f43f5e,#e11d48)"
        : "linear-gradient(135deg,#34d399,#059669)";
    $("body").append(`
        <div id="${id}" class="raba-toast" style="background:${bg};">
            <span>${msg}</span>
        </div>`);
    setTimeout(()=> $("#"+id).addClass("raba-toast-show"), 10);
    setTimeout(()=>{ $("#"+id).removeClass("raba-toast-show"); setTimeout(()=> $("#"+id).remove(), 350); }, 3000);
}

function formatNumber(number){
    return new Intl.NumberFormat().format(number)
}



// ─── Dialog helper — overlay propio por encima de todo ────────────────
function showRabaDlg(id, htmlContent, title, logo){
    $("#"+id).remove();
    $("body").append(`
    <div class="raba-overlay raba-root" id="${id}" style="z-index:100003;">
        <div class="raba-modal raba-modal-wide" style="max-height:92vh;">
            <div class="raba-header">
                <div class="raba-head-brand">
                    <div class="raba-head-logo" style="font-size:18px;">${logo||"📋"}</div>
                    <div class="raba-head-text">
                        <div class="raba-head-title">${title}</div>
                    </div>
                </div>
                <div class="raba-head-btns">
                    <button class="raba-icon-btn" id="${id}_close" title="Cerrar">✕</button>
                </div>
            </div>
            <div class="raba-dlg-body">${htmlContent}</div>
            <div class="raba-footer">💖 Creado por <strong>rabagalan73</strong> para la reina <strong>M0bscene</strong> 💖</div>
        </div>
    </div>`);
    applyRabaFont();
    $("#"+id+"_close").on("click", ()=> $("#"+id).remove());
    $("#"+id).on("mousedown", (e)=>{ if(e.target.id===id) $("#"+id).remove(); });
}

///////////////////////////////////////////////////////////////////create table for results////////////////////////////

function createTableResults(list_production){
    let thead = `<tr>
        <td>Coordenadas</td>
        <td><a href="#" id="order_points" style="color:inherit;text-decoration:none;">Puntos</a></td>
        <td><a href="#" id="order_merchants" style="color:inherit;text-decoration:none;">Mercaderes</a></td>
        <td><a href="#" id="order_hours" style="color:inherit;text-decoration:none;">
            <img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/main.png" style="width:13px;height:13px;vertical-align:-2px;"> Horas</a></td>
        <td colspan="2"><a href="#" class="order_deficit" style="color:inherit;text-decoration:none;">
            <img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/wood.png" style="width:13px;height:13px;"> Madera</a></td>
        <td colspan="2"><a href="#" class="order_deficit" style="color:inherit;text-decoration:none;">
            <img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/stone.png" style="width:13px;height:13px;"> Barro</a></td>
        <td colspan="2"><a href="#" class="order_deficit" style="color:inherit;text-decoration:none;">
            <img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/iron.png" style="width:13px;height:13px;"> Hierro</a></td>
        <td><a href="#" class="order_wh" style="color:inherit;text-decoration:none;">
            <img src="https://dsen.innogamescdn.com/asset/04d88c84/graphic/buildings/storage.png" style="width:13px;height:13px;"> Almacén</a></td>
    </tr>`;

    let rows = "";
    for(let i = 0; i < list_production.length; i++){
        let p = list_production[i];
        let cls_w = (parseInt(p.result_wood)  >= 0) ? "raba-cell-surplus" : "raba-cell-deficit";
        let cls_s = (parseInt(p.result_stone) >= 0) ? "raba-cell-surplus" : "raba-cell-deficit";
        let cls_i = (parseInt(p.result_iron)  >= 0) ? "raba-cell-surplus" : "raba-cell-deficit";
        let mrchStyle = (p.merchantAvailable > 0) ? "color:#047857;font-weight:700" : "color:#9d174d;font-weight:700";
        rows += `<tr>
            <td><a href="${game_data.link_base_pure}info_village&id=${p.id}" style="color:#e84393;font-weight:700;text-decoration:none;">${p.coord}</a></td>
            <td>${formatNumber(p.points)}</td>
            <td><span style="${mrchStyle}">${p.merchantAvailable}</span>&nbsp;/&nbsp;${p.merchants_total}</td>
            <td>${formatNumber(parseInt(p.time_finished*10)/10)}</td>
            <td>${formatNumber(p.wood)}</td>
            <td class="${cls_w}">${p.result_wood >= 0 ? "+" : ""}${formatNumber(p.result_wood)}</td>
            <td>${formatNumber(p.stone)}</td>
            <td class="${cls_s}">${p.result_stone >= 0 ? "+" : ""}${formatNumber(p.result_stone)}</td>
            <td>${formatNumber(p.iron)}</td>
            <td class="${cls_i}">${p.result_iron >= 0 ? "+" : ""}${formatNumber(p.result_iron)}</td>
            <td>${formatNumber(p.capacity)}</td>
        </tr>`;
    }

    let tableHTML = `<div style="overflow:auto;">
        <table class="scriptTableBalancerResult" style="min-width:700px;">${thead}${rows}</table>
    </div>`;

    showRabaDlg("raba-dlg-results", tableHTML, "Estado por aldea", "🏘️");

    $("#order_points").on("click", (e)=>{ e.preventDefault();
        list_production.sort((a,b)=> a.points-b.points);
        $("#raba-dlg-results").remove(); createTableResults(list_production); });
    $("#order_merchants").on("click", (e)=>{ e.preventDefault();
        list_production.sort((a,b)=> a.merchantAvailable-b.merchantAvailable);
        $("#raba-dlg-results").remove(); createTableResults(list_production); });
    $("#order_hours").on("click", (e)=>{ e.preventDefault();
        list_production.sort((a,b)=> b.time_finished-a.time_finished);
        $("#raba-dlg-results").remove(); createTableResults(list_production); });
    $(".order_deficit").on("click", (e)=>{ e.preventDefault();
        list_production.sort((a,b)=> a.result_total-b.result_total);
        $("#raba-dlg-results").remove(); createTableResults(list_production); });
    $(".order_wh").on("click", (e)=>{ e.preventDefault();
        list_production.sort((a,b)=> a.capacity-b.capacity);
        $("#raba-dlg-results").remove(); createTableResults(list_production); });
}
///////////////////////////////////////////////////////////////////create table for clusters////////////////////////////

function createTableClusters(list_clusters_stats){
    let thead = `<tr>
        <td>#</td>
        <td>Aldeas</td>
        <td>Centro</td>
        <td><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/wood.png" style="width:13px;height:13px;"> Madera</td>
        <td><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/stone.png" style="width:13px;height:13px;"> Barro</td>
        <td><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/iron.png" style="width:13px;height:13px;"> Hierro</td>
        <td>Dist. máx.</td>
    </tr>`;

    let rows = "";
    for(let i = 0; i < list_clusters_stats.length; i++){
        let c = list_clusters_stats[i];
        let resCell = (res, send, get) => `<div style="font-size:11px;text-align:left;display:flex;flex-direction:column;gap:2px;padding:3px 0;">
            <span style="color:#6a1b54;"><b>Total:</b> ${formatNumber(res)}</span>
            <span class="raba-cell-surplus">+${formatNumber(send)}</span>
            <span class="raba-cell-deficit">−${formatNumber(get)}</span>
        </div>`;
        rows += `<tr>
            <td><span style="background:#ff6fae;color:#fff;font-weight:800;padding:3px 10px;border-radius:20px;white-space:nowrap;">${i+1}</span></td>
            <td style="font-weight:700;">${formatNumber(c.nr_coords)}</td>
            <td style="font-weight:700;color:#e84393;">${c.center}</td>
            <td>${resCell(c.total_wood_cluster, c.total_wood_send, c.total_wood_get)}</td>
            <td>${resCell(c.total_stone_cluster, c.total_stone_send, c.total_stone_get)}</td>
            <td>${resCell(c.total_iron_cluster, c.total_iron_send, c.total_iron_get)}</td>
            <td style="font-weight:700;">${c.max_distance.toFixed(1)}</td>
        </tr>`;
    }

    let tableHTML = `<div style="overflow:auto;">
        <table class="scriptTable" style="min-width:560px;">${thead}${rows}</table>
    </div>`;

    showRabaDlg("raba-dlg-clusters", tableHTML, "Zonas de balanceo", "🗺️");
}



/////////////////////////////////////////////////////////////////function for sending resources//////////////////////////////////////////////////



function sendResources(target_id,data) {
    let options={
        "village":target_id,
        "ajaxaction" : "call",
        "h" : window.csrf_token,     
    }

    TribalWars.post("market",options, data, function(response) {
        console.log(response)
        rabaToast("📤 Recursos enviados correctamente", "success");
    }, function(error){
        console.log(error)
        rabaToast("❌ Error al enviar los recursos", "error");
    });
}


/////////////////////////////////////////////////////////////////function for getting resources for AM buildings//////////////////////////////////////////////////


async function getResourcesForAM(map_farm_usage){
    let {map_construction_templates, map_coord_templates, map_priortize_farm} = await getTemplates().catch(e=>alert(e))
    let map_buildings_data = await getDataBuildings().catch(e=>alert(e))

    let map_constants_buildings = getConstantsTwBuildings()
    console.log("map_construction_templates",map_construction_templates)
    console.log("map_coord_templates",map_coord_templates)
    console.log("map_buildings_data",map_buildings_data)
    console.log("map_constants_buildings",map_constants_buildings)

    let time_construction_total = 100
    let list_map_resources_get_AM = []

    return new Promise((resolve,reject)=>{
    
        for(let current_time_construction=1;current_time_construction <= time_construction_total;current_time_construction++){
            let map_resources_get_AM=new Map()
            let map_buildings = new Map(JSON.parse(JSON.stringify(Array.from(map_buildings_data.entries()))))

            //add construction time for each building
            Array.from(map_buildings.keys()).forEach(key=>{
                if(key.includes("_time_queued")){
                    map_resources_get_AM.set(key.replace("_time_queued",""),{
                        total_wood:0,
                        total_stone:0,
                        total_iron:0,
                        time_finished:Math.round(map_buildings.get(key)/3600)
                    })
                }
            })
    
            Array.from(map_coord_templates.keys()).forEach(key=>{//for every coord which have a AM construction template
                let coord=key
                let count_time_construction=map_buildings.get(coord+"_time_queued")//if a village has already queued building then get time when last building is finished
                let template_name=map_coord_templates.get(coord)//get name template for the current village and then get the whole template tree from AM
                let list_template=map_construction_templates.get(template_name)
                let farmCapacity = map_priortize_farm.get(template_name) / 100


                // console.log("template_name",template_name)
                // console.log(list_template)
        
                //special case if a village doesn't have farm to max lv then check if farm is >99% used and then request to build farm 1 lv
                if(map_buildings.get(coord+"_farm")<30 && map_farm_usage.get(coord) >= farmCapacity){
                    let lv_building_HQ=map_buildings.get(coord+"_main")
                    let lv_building_current=map_buildings.get(coord+"_farm")//curent building from building page
                    let obj_constants_buildings=map_constants_buildings.get("farm")
    
                    lv_building_current++;//increase farm level
                    let list_info_construction=calculateTimeAndResConstruction(lv_building_HQ, lv_building_current, obj_constants_buildings)
                    let time_construction=list_info_construction[0]
                    let total_wood=list_info_construction[1]
                    let total_stone=list_info_construction[2]
                    let total_iron=list_info_construction[3]
                    count_time_construction+=time_construction
    
                    map_resources_get_AM.set(coord,{
                        total_wood:total_wood,
                        total_stone:total_stone,
                        total_iron:total_iron,
                        time_finished:count_time_construction/3600
                    })
                }
    
    
    
                for(let i=0;i<list_template.length;i++){//for every building from AM template
                    let name_building=list_template[i].name
                    let key_building=coord+"_"+name_building//the key for getting current building from building page is 'coord_name(building)'
        
                    let lv_building_AM=list_template[i].level_absolute//level building from AM template
                    let lv_building_current=map_buildings.get(key_building)//curent building from building page
        
                    
                    if(lv_building_AM>lv_building_current){//means current building must be constructed
                        let nr_levels=lv_building_AM-lv_building_current //lv building from AM can have 2-3 level above the current lv from building page
                      
                        for(let j=0;j<nr_levels;j++){
                          
                            //calculate time and resources needed for this lv
                            lv_building_current++//need to construct this building with 1 lv
                            let lv_building_HQ=map_buildings.get(coord+"_main")
                            let obj_constants_buildings=map_constants_buildings.get(name_building)
                            // console.log(`coord:${coord}, name_building: ${name_building} lv_building_current: ${lv_building_current}`)
                            let list_info_construction=calculateTimeAndResConstruction(lv_building_HQ, lv_building_current, obj_constants_buildings)
                            let time_construction=list_info_construction[0]
                            let total_wood=list_info_construction[1]
                            let total_stone=list_info_construction[2]
                            let total_iron=list_info_construction[3]                        
        
    
    
                            count_time_construction+=time_construction
                            //update map with res needed for this lv building
                            if(map_resources_get_AM.has(coord)){
                                let obj_update = map_resources_get_AM.get(coord)
                                obj_update.total_wood += total_wood
                                obj_update.total_stone += total_stone
                                obj_update.total_iron += total_iron
                                obj_update.time_finished = count_time_construction/3600
                                map_resources_get_AM.set(coord,obj_update)
                                
                            }
                            else{
                                map_resources_get_AM.set(coord,{
                                    total_wood:total_wood,
                                    total_stone:total_stone,
                                    total_iron:total_iron,
                                    time_finished:count_time_construction/3600
                                })
                            }
                       
    
    
                            map_buildings.set(key_building,lv_building_current)
                            
                            if(count_time_construction > current_time_construction * 3600){//this village has reached the number of res needed( construction time )
                                break;
                            }
        
        
                        }
                    }
        
                    if(count_time_construction > current_time_construction * 3600){//this village has reached the number of res needed( construction time )
                        break;
                    }
                }
            })
        
            list_map_resources_get_AM.push(map_resources_get_AM)

        }
    
        // console.log("list_map_resources_get_AM",list_map_resources_get_AM)
        resolve(list_map_resources_get_AM)
    
    })


}


/////////////////////////////////////////////////////////////////get templates//////////////////////////////////////////////////


function getTemplates(){
    return new Promise((resolve,reject)=>{

        if(game_data.features.AccountManager.active == false){//AM is not active
            resolve({
                map_coord_templates:new Map(),
                map_construction_templates:new Map(),
                map_priortize_farm: new Map()
            })
        }




        let link_combined_production=game_data.link_base_pure+"am_village"
        let dataPage = httpGet(link_combined_production)
        const parserMain = new DOMParser();
        const htmlDocMain = parserMain.parseFromString(dataPage, 'text/html');
        //get pages for all incoming
        let list_pages=[]

        if($(htmlDocMain).find("#village_table").prev().find("select").length>0){
            Array.from($(htmlDocMain).find("#village_table").prev().find("select").get(0)).forEach(function(item){
                list_pages.push(item.value)
            })
        }
        else if($(htmlDocMain).find("#village_table").prev().find(".paged-nav-item").length>0){//all pages from the current folder
            let nr_pages=$(htmlDocMain).find("#village_table").prev().find(".paged-nav-item").length
            for(let i=nr_pages-2;i>=0;i--){
                let link=game_data.link_base_pure+`am_village&page=${i}`
                list_pages.push(link);
            }
        
        }
        else{
            list_pages.push(link_combined_production);
        }
        list_pages=list_pages.reverse();
        console.log(list_pages)

        // go to every page and get template
        let map_coord_templates=new Map()
        let map_construction_templates=new Map() 
        let map_priortize_farm=new Map() 

        async function ajaxRequest (urls) {
            let current_url
            if(urls.length>0){
                current_url=urls.pop()
            }
            else{
                current_url="stop"
            }
            console.log(current_url)
            let start_ajax=new Date().getTime()
            if (urls.length >= 0 && current_url!="stop") {
                $.ajax({
                    url: current_url,
                    method: 'get',
                    success: (data) => {
                        const parser = new DOMParser();
                        const htmlDoc = parser.parseFromString(data, 'text/html');

                        let table_construction=Array.from($(htmlDoc).find(".row_a, .row_b"))
                        for(let i=0;i<table_construction.length;i++){
                            let coord=table_construction[i].children[0].innerText.match(/[0-9]{3}\|[0-9]{3}/)[0]
                            let template_name=table_construction[i].children[1].innerText.trim()
                            // console.log(template_name)
                            if(template_name!=""){
                                map_coord_templates.set(coord,template_name)
                                map_construction_templates.set(template_name,0)
                                map_priortize_farm.set(template_name,0)
                            }

                        }

               
                        let stop_ajax=new Date().getTime();
                        let diff=stop_ajax-start_ajax
                        console.log("wait: "+diff)
                        window.setTimeout(function(){
                            ajaxRequest (list_pages)
                        },200-diff)
                    },
                    error:(err)=>{
                        reject(err)
                    }
                })
            
            }
            else
            {
                //get templates name
                let table_name_tamplate=Array.from($(htmlDocMain).find("select[name=template]").eq(0).find("option"))
                for(let i=0;i<table_name_tamplate.length;i++){

                    let link=game_data.link_base_pure+`am_village&mode=queue&template=${table_name_tamplate[i].value}`
                    let name
                    if(i<3)//only for the first 3 default template remove parantesis
                        name=table_name_tamplate[i].innerText.replaceAll("\n","").replaceAll("\t","").replace(/\(\w+\)/,"")
                    else
                        name=table_name_tamplate[i].innerText.replaceAll("\n","").replaceAll("\t","")

                    if(map_construction_templates.has(name)){
                        // console.log(name)
                        let data=await ajaxPromise(link)
                        const parser = new DOMParser();
                        const htmlDoc = parser.parseFromString(data, 'text/html');

                        let template_construction=[]
                        Array.from($(htmlDoc).find(".sortable_row")).forEach(item=>{
                            template_construction.push({
                                name:item.getAttribute("data-building"),
                                level_relative:parseInt($(item).find(".level_relative").text()),
                                level_absolute:parseInt($(item).find(".level_absolute").text().match(/\d+/)[0])
                            })
                        })
                        map_construction_templates.set(name,template_construction)

                        let farmMaxCapacity = 99;
                        let hasCustomCapacity = $(htmlDoc).find("input[name=farm_upgrade_toggle]").eq(0).is(":checked")

                        console.log("name: " + name)
                        console.log("hasCustomCapacity: " + hasCustomCapacity)

                        if(hasCustomCapacity){
                            farmMaxCapacity = 100 - parseInt($(htmlDoc).find("select[name=population_upgrades]").val())
                        }
                        map_priortize_farm.set(name, farmMaxCapacity)
                    }
                    
                }
                
                


                // console.log("map_construction_templates",map_construction_templates)
                // console.log("map_coord_templates",map_coord_templates)
                resolve({
                    map_coord_templates:map_coord_templates,
                    map_construction_templates:map_construction_templates,
                    map_priortize_farm: map_priortize_farm
                })
                // console.log(map_incoming)

                
            }
        }
        ajaxRequest(list_pages);
    })

}


function ajaxPromise(link){
    return new Promise((resolve,reject)=>{

        let startAjax=new Date().getTime()
        $.ajax({
            url: link,
            method: 'get',
            success: (data) => {
   
                let stopAjax=new Date().getTime()
                let difAjax=stopAjax-startAjax
                // console.log("wait ",difAjax)
                window.setTimeout(()=>{
                    resolve(data)
                },200-difAjax)

            },error:(data)=>{
                reject(data)
            }

        })
    })
}


function getDataBuildings(){

    return new Promise((resolve,reject)=>{
        let link_combined_production=game_data.link_base_pure+"overview_villages&mode=buildings"
        let dataPage = httpGet(link_combined_production)
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(dataPage, 'text/html');
        //get pages for all incoming
        let list_pages=[]
    
        if($(htmlDoc).find(".paged-nav-item").parent().find("select").length>0){
            Array.from($(htmlDoc).find(".paged-nav-item").parent().find("select").find("option")).forEach(function(item){
                list_pages.push(item.value)
            })
            list_pages.pop();
        }
        else if(htmlDoc.getElementsByClassName("paged-nav-item").length>0){//all pages from the current folder
            let nr=0;
            Array.from(htmlDoc.getElementsByClassName("paged-nav-item")).forEach(function(item){
                let current=item.href;
                current=current.split("page=")[0]+"page="+nr
                nr++;
                list_pages.push(current);
            })
            
        }
        else{
            list_pages.push(link_combined_production);
        }
        list_pages=list_pages
        console.log(list_pages)
    
        
        // go to every page and get incoming
        let  map_buildings=new Map()
        function ajaxRequest (urls) {
            let current_url
            if(urls.length>0){
                current_url=urls.pop()
            }
            else{
                current_url="stop"
            }
            console.log(current_url)
            let start_ajax=new Date().getTime()
            if (urls.length >= 0 && current_url!="stop") {
                $.ajax({
                    url: current_url,
                    method: 'get',
                    success: (data) => {
                        const parser = new DOMParser();
                        const htmlDoc = parser.parseFromString(data, 'text/html');

                        if(game_data.device == "desktop"){
                            let table_buildings=Array.from($(htmlDoc).find(".row_a, .row_b"))
                            for(let i=0;i<table_buildings.length;i++){
                                let coord=$(table_buildings[i]).find(".nowrap").text().match(/[0-9]{3}\|[0-9]{3}/)[0]
                                // console.log(table_buildings[i])
                                let time_last_construction=$(table_buildings[i]).find(".queue_icon img").last().attr("title")
                                if(time_last_construction==undefined){//has building queued
                                    time_last_construction=0
                                }
                                else{
                                    time_last_construction=time_last_construction.split("-")[1]
                                    time_last_construction=getFinishTime(time_last_construction)
                               
                                }
                                // console.log(time_last_construction)
                                map_buildings.set(coord+"_time_queued",time_last_construction)
                                
    
                                let buildings=$(table_buildings[i]).find(".upgrade_building")
                                for(let j=0;j<buildings.length;j++){
                                    let name=buildings[j].classList[1].replace("b_","")
                                    let level=parseInt(buildings[j].innerText)
                                    // console.log(`name: ${name}, level:${level}`)
                                    let key=coord+"_"+name
                                    map_buildings.set(key,level)
                                }
    
    
    
                                //add queued buildings
                                let list_queued=Array.from($(table_buildings[i]).find(".queue_icon img")).map(e => e.src.match(/\w+\.(webp|png)/)[0].replace(/\.(webp|png)/, ""));
                                // console.log(list_queued)
                                for(let j=0;j<list_queued.length;j++){
                                    let key=coord+"_"+list_queued[j]
    
                                    if(map_buildings.has(key)){
                                        let value=map_buildings.get(key)
                                        map_buildings.set(key,value+1)
                                    }else{
                                        map_buildings.set(key,1)
                                    }
                                }
    
                            }    
                        }
                        else{
                            let table_buildings=Array.from($(htmlDoc).find(".row_a, .row_b"))
                            for(let i=0;i<table_buildings.length;i++){

                                let coord = $(table_buildings[i]).find(".nowrap").text().match(/[0-9]{3}\|[0-9]{3}/)[0]
                                let time_last_construction = $(table_buildings[i].nextElementSibling.nextElementSibling).find("img").last().attr("title")
                                if(time_last_construction==undefined){//has building queued
                                    time_last_construction=0
                                }
                                else{
                                    time_last_construction=time_last_construction.split("-")[1]
                                    time_last_construction=getFinishTime(time_last_construction)
                               
                                }
                                map_buildings.set(coord+"_time_queued",time_last_construction)


                                let buildingsLevel = $(table_buildings[i].nextElementSibling).find('table').find('td')
                                let buildingsName = $(table_buildings[i].nextElementSibling).find('table').find('th')
                                for(let j=0;j<buildingsLevel.length;j++){
                                    let name=buildingsName[j].getElementsByTagName("img")[0].src.split("buildings/")[1].replace(".png","")
                                    let level=parseInt(buildingsLevel[j].innerText)
                                    // console.log(`name: ${name}, level:${level}`)
                                    let key=coord+"_"+name
                                    map_buildings.set(key,level)
                                }

                                //add queued buildings
                                let list_queued=Array.from($(table_buildings[i].nextElementSibling.nextElementSibling).find("img")).map(e => e.src.match(/\w+\.(webp|png)/)[0].replace(/\.(webp|png)/, ""));
                                // console.log(list_queued)
                                for(let j=0;j<list_queued.length;j++){
                                    let key=coord+"_"+list_queued[j]
    
                                    if(map_buildings.has(key)){
                                        let value=map_buildings.get(key)
                                        map_buildings.set(key,value+1)
                                    }else{
                                        map_buildings.set(key,1)
                                    }
                                }
                                
                            }

                        }
                        

                        let stop_ajax=new Date().getTime();
                        let diff=stop_ajax-start_ajax
                        console.log("wait: "+diff)
                        window.setTimeout(function(){
                            ajaxRequest (list_pages)
                        },200-diff)
                    },
                    error: (err)=>{
                        reject(err)
                    }
                })

            }
            else
            {
                console.log("map_buildings herere",map_buildings)
                resolve(map_buildings)
     
            }
        }
        ajaxRequest(list_pages);
    
    })
}





function getFinishTime(time_finished){
    var date_finished=""
    let server_date=document.getElementById("serverDate").innerText.split("/")
    if(time_finished.includes(lang["aea2b0aa9ae1534226518faaefffdaad"].replace(" %s",""))){    //today
        date_finished=server_date[1]+"/"+server_date[0]+"/"+server_date[2]+" "+time_finished.match(/\d+:\d+/)[0]
    }
    else if(time_finished.includes(lang["57d28d1b211fddbb7a499ead5bf23079"].replace(" %s",""))){    //tomorrow
        var tomorrow_date=new Date(server_date[1]+"/"+server_date[0]+"/"+server_date[2]);
        tomorrow_date.setDate(tomorrow_date.getDate()+1);
        date_finished= ("0"+(tomorrow_date.getMonth()+1)).slice(-2)+"/"+("0"+tomorrow_date.getDate()).slice(-2)+"/"+tomorrow_date.getFullYear()+" "+time_finished.match(/\d+:\d+/)[0];
    }else if(time_finished.includes(lang["0cb274c906d622fa8ce524bcfbb7552d"].split(" ")[0])){  //on
        var on=time_finished.match(/\d+.\d+/)[0].split(".");
        date_finished=on[1]+"/"+on[0]+"/"+server_date[2]+" "+time_finished.match(/\d+:\d+/)[0];
    }
    // console.log("date_finished: "+date_finished)
    date_finished=new Date(date_finished)

    let serverTime=document.getElementById("serverTime").innerText
    let serverDate=document.getElementById("serverDate").innerText.split("/")
    serverDate=serverDate[1]+"/"+serverDate[0]+"/"+serverDate[2]
    let date_current=new Date(serverDate+" "+serverTime)

    let result_seconds=parseInt((date_finished.getTime()-date_current.getTime())/1000)
    // console.log("before here---------: "+result_seconds)

    if(result_seconds < 0){
        date_finished.setDate(date_finished.getDate()+1)
        result_seconds=parseInt((date_finished.getTime()-date_current.getTime())/1000)
    }

    // console.log("after here---------: "+result_seconds)

    return result_seconds;
}

function getConstantsTwBuildings(){
    if (localStorage.getItem(game_data.world+"constantBuildings") !== null) {
        let map_constants_buildings = new Map(JSON.parse(localStorage.getItem(game_data.world+"constantBuildings")))
        console.log("constant building world already exist")
        return map_constants_buildings
    }
    else{ //Get data from xml and save it in localStorage to avoid excessive XML requests to server
            let data=httpGet("/interface.php?func=get_building_info") //Load world data
            
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, 'text/html');
            let map_constants_buildings=new Map()
            let list_buildings=htmlDoc.getElementsByTagName("config")[0].children
            for(let i=0;i<list_buildings.length;i++){
                let name_building=list_buildings[i].tagName.toLowerCase()
                let wood=Number(list_buildings[i].getElementsByTagName("wood")[0].innerText)
                let stone=Number(list_buildings[i].getElementsByTagName("stone")[0].innerText)
                let iron=Number(list_buildings[i].getElementsByTagName("iron")[0].innerText)



                let wood_factor=Number(list_buildings[i].getElementsByTagName("wood_factor")[0].innerText)
                let stone_factor=Number(list_buildings[i].getElementsByTagName("stone_factor")[0].innerText)
                let iron_factor=Number(list_buildings[i].getElementsByTagName("iron_factor")[0].innerText)

                let build_time=Number(list_buildings[i].getElementsByTagName("build_time")[0].innerText)
                let build_time_factor=Number(list_buildings[i].getElementsByTagName("build_time_factor")[0].innerText)

                map_constants_buildings.set(name_building,{
                    wood:wood,
                    stone:stone,
                    iron:iron,
                    wood_factor:wood_factor,
                    stone_factor:stone_factor,
                    iron_factor:iron_factor,
                    build_time:build_time,
                    build_time_factor:build_time_factor
                })
            }
            let data_save=JSON.stringify(Array.from(map_constants_buildings.entries()))
            localStorage.setItem(game_data.world+"constantBuildings",data_save);
            console.log("save speed world")
        return map_constants_buildings
    }

}


function calculateTimeAndResConstruction(hq, level, obj_data) {

    let constantLvl={
        1:1,
        2:1,
        3:0.112292,
        4:0.289555,
        5:0.46113,
        6:0.606372,
        7:0.723059,
        8:0.815935,
        9:0.889947,
        10:0.948408,
        11:0.994718,
        12:1.031,
        13:1.059231,
        14:1.080939,
        15:1.09729,
        16:1.109156,
        17:1.117308,
        18:1.122392,
        19:1.124817,
        20:1.124917,
        21:1.123181,
        22:1.119778,
        23:1.114984,
        24:1.109038,
        25:1.102077,
        26:1.0942,
        27:1.085601,
        28:1.076369,
        29:1.066566,
        30:1.056291,
    }


    var buildTime = obj_data.build_time * Math.pow(1.2, (level -1)) * Math.pow(1.05, -hq) * constantLvl[level]
    
    let total_wood = Math.round(obj_data.wood * Math.pow(obj_data.wood_factor, level - 1))
    let total_stone = Math.round(obj_data.stone * Math.pow(obj_data.stone_factor, level - 1))
    let total_iron = Math.round(obj_data.iron * Math.pow(obj_data.iron_factor, level - 1))
    
    return [Math.round(buildTime), total_wood , total_stone, total_iron];
}





/////////////////////////////////////////////////////////k-means////////////////////////////////////////////////////////
// https://github.com/shudima/dimas-kmeans/blob/master/dimas-kmeans.js




function getClusters(data, options) {
    let result_cluster=[]
    let maxDistanceGlobal=999999;
    let repeat=50;

    for(let rep=0;rep<repeat;rep++){
        let result=insideGetCluster(data,options)
        if(maxDistanceGlobal > result.maxDistance){
            maxDistanceGlobal=result.maxDistance
            result_cluster=result
        }
    }
    console.log("maxDistanceGlobal",maxDistanceGlobal)

    // throw new Error("stop")
	return result_cluster
}


function insideGetCluster(data,options){
    var numberOfClusters, distanceFunction, vectorFunction, minMaxValues, maxIterations;

    if (!options || !options.numberOfClusters) { numberOfClusters = 1 }
    else { numberOfClusters = options.numberOfClusters; }

    if (!options || !options.distanceFunction) { distanceFunction = getDistance; }
    else { distanceFunction = options.distanceFunction; }
    
    if (!options || !options.vectorFunction) { vectorFunction = defaultVectorFunction; }
    else { vectorFunction = options.vectorFunction; }
    
    if (!options || !options.maxIterations) { maxIterations = 1000; }
    else { maxIterations = options.maxIterations; }

    let result_cluster=getClustersWithParams(data, numberOfClusters, distanceFunction, vectorFunction, maxIterations).clusters;

    ////calculate max distance

    let maxDistance=0;
    for(let i=0;i<result_cluster.length;i++){//for each cluster
        let list_coord=result_cluster[i].data
        for(let j=0;j<list_coord.length;j++){
            for(let k=j+1;k<list_coord.length;k++){
                let dist=getDistance(list_coord[j],list_coord[k])
                maxDistance=(maxDistance > dist)?maxDistance:dist
            }
        }
    }
    // console.log("maxDistance",maxDistance)
    result_cluster.maxDistance=maxDistance
    return result_cluster

    
}


function getClustersWithParams(data ,numberOfClusters, distanceFunction, vectorFunction, maxIterations) {

    let means=[]
    for(let i=0;i<numberOfClusters;i++){
        let random_index=parseInt(Math.random()*Object.keys(data).length)
        means.push(data[random_index])
    }


    // console.log("means",means)
	var clusters = createClusters(means);

	var prevMeansDistance = 999999;

    var numOfInterations = 0;
    var iterations = [];


	while(numOfInterations < maxIterations) {

		initClustersData(clusters);

	    assignDataToClusters(data, clusters, distanceFunction, vectorFunction);

		updateMeans(clusters, vectorFunction);

		var meansDistance = getMeansDistance(clusters, vectorFunction, distanceFunction);

	    //iterations.push(meansDistance);
        // console.log(numOfInterations + ': ' + meansDistance);
        numOfInterations++;
	}
	
	// console.log(getMeansDistance(clusters, vectorFunction, distanceFunction));

    return { clusters: clusters, iterations: iterations };
}

function defaultVectorFunction(vector) {
	return vector;
}


function getMeansDistance(clusters, vectorFunction, distanceFunction) {

	var meansDistance = 0;

	clusters.forEach(function (cluster) {

		cluster.data.forEach(function (vector) {

		    meansDistance = meansDistance + Math.pow(distanceFunction(cluster.mean, vectorFunction(vector)), 2);
		});
	});


	return meansDistance;
}

function updateMeans(clusters, vectorFunction) {

	clusters.forEach(function (cluster) {
		updateMean(cluster, vectorFunction);

	});
}


function updateMean(cluster, vectorFunction) {

	if (!cluster.mean || cluster.data.length === 0) return;

	var newMean = [];

	for (var i = 0; i < cluster.mean.length; i++) {
		newMean.push(getMean(cluster.data, i, vectorFunction));
	};


	cluster.mean = newMean;

}

function getMean(data, index, vectorFunction) {
	var sum =  0;
	var total = data.length;

	if(total == 0) return 0;

	data.forEach(function (vector) {

			sum = sum + vectorFunction(vector)[index];
	});


	return sum / total;
}

function assignDataToClusters(data, clusters, distanceFunction, vectorFunction) {


	data.forEach(function (vector) {
	    var cluster = findClosestCluster(vectorFunction(vector), clusters, distanceFunction);

	    if(!cluster.data) cluster.data = [];
		
		cluster.data.push(vector);
	});
}

function findClosestCluster(vector, clusters, distanceFunction) {

	var closest = {};
	var minDistance = 9999999;

	clusters.forEach(function (cluster) {
		
		var distance = distanceFunction(cluster.mean, vector);
		if (distance < minDistance) {
			minDistance = distance;
			closest = cluster;
		};
	});

	return closest;
}

function initClustersData(clusters) {
	clusters.forEach(function (cluster) {
		cluster.data = [];
	});
}

function createClusters(means) {
	var clusters = [];

	means.forEach(function (mean) {
		var cluster = { mean : mean, data : []};

		clusters.push(cluster);
	});

	return clusters;
}


function getDistance(vector1, vector2) {
	var sum = 0;

	for (var i = 0; i < vector1.length; i++) {
		sum = sum + Math.pow(vector1[i] - vector2[i],2)
	};

	return Math.sqrt(sum);

}



///////////////////////////////////////////////////////show data on the map///////////////////////////////////////

function showRabaMapLegend(random_color, list_clusters_stats){
    $("#raba-map-legend").remove();
    let rows = random_color.map((rc, i) => {
        let c = list_clusters_stats[i] || {};
        return `<div class="rml-row">
            <span class="rml-dot" style="background:${rc.color};border:2px solid ${rc.color};"></span>
            <span class="rml-zone">Zona ${i+1}</span>
            <span class="rml-aldeas">${c.nr_coords||"?"} aldeas</span>
            <span class="rml-send">↑${formatNumber(parseInt((c.total_wood_send||0)+(c.total_stone_send||0)+(c.total_iron_send||0)))}</span>
            <span class="rml-get">↓${formatNumber(parseInt((c.total_wood_get||0)+(c.total_stone_get||0)+(c.total_iron_get||0)))}</span>
        </div>`;
    }).join("");

    $("body").append(`
    <div id="raba-map-legend" class="raba-root">
        <div class="rml-header">
            <span class="rml-title">🗺️ Zonas de balanceo</span>
            <button class="rml-close" id="rml-close-btn">✕</button>
        </div>
        <div class="rml-legend-key">
            <span style="color:#5fffb0;font-weight:700;">↓ Recibe</span>
            <span style="color:#ff7eb3;font-weight:700;">↑ Envía</span>
        </div>
        <div class="rml-rows">${rows}</div>
        <div class="rml-footer">
            <button class="rml-show-btn" id="rml-show-panel-btn" style="display:none;">📊 Mostrar panel</button>
            <span class="rml-footer-tip">Pulsa 👁 en el panel para ocultarlo</span>
        </div>
    </div>`);
    applyRabaFont();
    $("#rml-close-btn").on("click", ()=> $("#raba-map-legend").remove());
    $("#rml-show-panel-btn").on("click", ()=>{
        $("#raba-results-overlay").show();
        $("#rml-show-panel-btn").hide();
    });

    // Draggable
    let $leg = $("#raba-map-legend");
    let dragging = false, ox = 0, oy = 0;
    $leg.on("mousedown", ".rml-header", function(e){
        dragging = true;
        ox = e.clientX - $leg.offset().left;
        oy = e.clientY - $leg.offset().top;
        e.preventDefault();
    });
    $(document).on("mousemove.rml", function(e){
        if(!dragging) return;
        $leg.css({ left: e.clientX - ox, top: e.clientY - oy, bottom: "auto", right: "auto", position: "fixed" });
    }).on("mouseup.rml", function(){ dragging = false; });
}


function addInfoOnMap(mapInfoResources,random_color){
    let drawInfo=true
    // console.log("sa mor eu de nu merge",mapInfoResources)
    TWMap.mapHandler.spawnSector = function (data, sector) {
        originalSpawnSector.call(TWMap.mapHandler, data, sector);
        console.log(`spawn area map`)

        if(drawInfo==true){
            drawInfo=false
            window.setTimeout(() => {

                let visibleSectors=TWMap.map._visibleSectors
                Object.keys(visibleSectors).forEach(key=>{
                    let elements=visibleSectors[key]._elements
                    Object.keys(elements).forEach(key=>{
                        let villageId=elements[key].id.match(/\d+/)
                        // console.log(villageId)
                        if(villageId!=null){
                            if(mapInfoResources.has(villageId[0])){
                                let obj=mapInfoResources.get(villageId[0])
                                // console.log(obj)
                                // console.log(`label cluster: ${obj.label_cluster}, color random: `)
                                // console.log(random_color[obj.label_cluster])
                                createMapInfo(obj,random_color[obj.label_cluster])
                            }
                        }  
                    })
                })
                drawInfo=true
            }, 50);
        }
    };
}


function createMapInfo(obj,random_color){

    try {
        console.log(random_color)
        if(document.getElementById(`info_extra${obj.villageId}`) == null ){
            let greenColor="#026440"
            let redColor="#E80000"
            let villageImg=document.getElementById(`map_village_${obj.villageId}`)

            let parent=document.getElementById(`map_village_${obj.villageId}`).parentElement
            let leftImg=villageImg.style.left
            let topImg=villageImg.style.top

            while(document.getElementById(`map_icons_${obj.villageId}`)!=null){
                document.getElementById(`map_icons_${obj.villageId}`).remove()
            }
            if(document.getElementById(`map_cmdicons_${obj.villageId}_0`)!=null)
                document.getElementById(`map_cmdicons_${obj.villageId}_0`).remove()
            if(document.getElementById(`map_cmdicons_${obj.villageId}_1`)!=null)
                document.getElementById(`map_cmdicons_${obj.villageId}_1`).remove()


            let html_info=`
                <div id="info_extra${obj.villageId}" style="
                    position:absolute;left:${leftImg};top:${topImg};
                    width:64px;height:38px;z-index:3;
                    background:${random_color.colorOpacity};
                    outline:${random_color.color} solid 3px;
                    border-radius:6px;pointer-events:none;">
                </div>
                <div style="position:absolute;left:${leftImg};top:${topImg};z-index:5;
                    display:flex;flex-direction:column;gap:1px;padding:2px 3px;pointer-events:none;">
                    <span style="font-size:10px;font-weight:800;color:#fff;
                        text-shadow:0 0 3px #000,0 0 3px #000;line-height:1.2;white-space:nowrap;">
                        Zona ${obj.label_cluster+1}
                    </span>
                    <span style="font-size:10px;font-weight:700;color:#5fffb0;
                        text-shadow:0 0 3px #000,0 0 3px #000;line-height:1.2;white-space:nowrap;">
                        ↓${parseInt(obj.total_resources_get/1000)}k
                    </span>
                    <span style="font-size:10px;font-weight:700;color:#ff7eb3;
                        text-shadow:0 0 3px #000,0 0 3px #000;line-height:1.2;white-space:nowrap;">
                        ↑${parseInt(obj.total_resources_send/1000)}k
                    </span>
                </div>`
            $(html_info).appendTo(parent);


        }

    } catch (error) {
        
    }
}


function getRandomColor(opacity) {
    let  color = 'rgb(';
    let colorOpacity = 'rgba(';

    for (let i = 0; i < 3; i++) {
        let randomNr=Math.floor(Math.random() * 255)
        color += randomNr + ',';
        colorOpacity += randomNr + ',';

    }
    color=color.substr(0,color.length-1)  + ')'; // add the transparency
    colorOpacity=colorOpacity + opacity + ')'; // add the transparency

    return {
        color:color,
        colorOpacity:colorOpacity
    }

}
