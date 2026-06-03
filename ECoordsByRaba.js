// ECoordsByRaba - Selector de coordenadas con grupos de colores
// Modificado y mejorado por rabagalan73 💖

win = window;

ScriptAPI.lib = {
    launchOnScreen: function (screen, noConflict) {
        if (game_data.screen != screen) {
            window.location.href = game_data.link_base_pure + screen;
            return false;
        }
        if (ScriptAPI.preventLaunch === true) {
            // Ya está corriendo — cierra el panel existente y relanza limpio
            if (win.DSSelectVillages && win.DSSelectVillages.enabled) {
                win.DSSelectVillages.disableScript();
            }
        }
        win.DSSelectVillages.enableScript();
        ScriptAPI.preventLaunch = (noConflict !== false) ? true : false;
        return true;
    }
};

win.DSSelectVillages = {
    showWithCoords:   true,
    showWithCounter:  true,
    showWithNewLine:  true,
    showWithFakes:    false,
    enabled:          false,
    activeGroup:      0,
    fakeMain:         'ram',      // 'ram' | 'catapult' | 'ram_cat' | 'cat_ram'
    fakeSpy:          false,
    fakeMode:         'shuffle',
    groups: [
        { id: 0, label: 'A', emoji: '🔴', color: '#e53935', bg: 'rgba(229,57,53,0.18)',   villages: [], villagesId: [] },
        { id: 1, label: 'B', emoji: '🟠', color: '#fb8c00', bg: 'rgba(251,140,0,0.18)',   villages: [], villagesId: [] },
        { id: 2, label: 'C', emoji: '🔵', color: '#1e88e5', bg: 'rgba(30,136,229,0.18)',  villages: [], villagesId: [] },
        { id: 3, label: 'D', emoji: '🟢', color: '#43a047', bg: 'rgba(67,160,71,0.18)',   villages: [], villagesId: [] },
    ],

    enableScript: function () {
        this.enabled = true;
        // Guardar originales solo la primera vez para evitar recursión en re-lanzamientos
        if (!win._ecOrigSpawnSector) win._ecOrigSpawnSector = win.TWMap.mapHandler.spawnSector;
        if (!win._ecOrigOnClick)     win._ecOrigOnClick     = win.TWMap.mapHandler.onClick;
        win.TWMap.mapHandler.integratedSpawnSector = win._ecOrigSpawnSector;
        win.TWMap.mapHandler.spawnSector = this.spawnSector;
        win.TWMap.mapHandler.onClick = this.clickFunction;
        win.TWMap.reload();
        this.showUi();
    },

    spawnSector: function (data, sector) {
        win.TWMap.mapHandler.integratedSpawnSector(data, sector);
        var groups = win.DSSelectVillages.groups;
        for (var g = 0; g < groups.length; g++) {
            var grp = groups[g];
            for (var i = 0; i < grp.villagesId.length; i++) {
                var villageId = grp.villagesId[i];
                if (villageId === null) continue;
                var v = $('#map_village_' + villageId);
                if (!v.length) continue;
                // Evitar duplicados si el sector se re-renderiza
                $('#DSSelectVillages_overlay_' + villageId).remove();
                $('<div class="DSSelectVillagesOverlay" id="DSSelectVillages_overlay_' + villageId + '" ' +
                  'style="width:52px;height:37px;position:absolute;z-index:50;' +
                  'left:' + $(v).css('left') + ';top:' + $(v).css('top') + ';border-radius:3px;">' +
                  '</div>').appendTo(v.parent());
                $('#DSSelectVillages_overlay_' + villageId)
                    .css('outline', grp.color + ' solid 2px')
                    .css('background-color', grp.bg);
            }
        }
    },

    disableScript: function () {
        this.enabled = false;
        this.groups.forEach(function (g) { g.villages = []; g.villagesId = []; });
        if (win._ecOrigSpawnSector) win.TWMap.mapHandler.spawnSector = win._ecOrigSpawnSector;
        if (win._ecOrigOnClick)     win.TWMap.mapHandler.onClick     = win._ecOrigOnClick;
        win._ecOrigSpawnSector = null;
        win._ecOrigOnClick     = null;
        win.TWMap.reload();
        $('#ecoordsPanel').remove();
        $('#ecoordsCSS').remove();
        $(document).off('click.ecHelp');
        ScriptAPI.preventLaunch = false;
    },

    showUi: function () {
        $('#ecoordsPanel').remove();
        $('#ecoordsCSS').remove();

        var self = this;

        $('head').append(`<style id="ecoordsCSS">
#ecoordsPanel {
    position: fixed; top: 70px; right: 15px;
    z-index: 9999; width: fit-content; min-width: 330px;
    background: #f8f6f1;
    border-radius: 8px;
    box-shadow: 4px 6px 28px rgba(0,0,0,0.38), 0 1px 4px rgba(0,0,0,0.12);
    font-family: 'Segoe UI', Tahoma, sans-serif;
    user-select: none; cursor: default;
}
/* Header */
#ecoordsPanel .ec-head {
    background: linear-gradient(135deg, #455a64 0%, #263238 100%);
    padding: 9px 10px 10px 14px;
    display: flex; align-items: center; justify-content: space-between;
    cursor: move; border-radius: 8px 8px 0 0; min-height: 52px;
}
#ecoordsPanel .ec-head-center { flex: 1; text-align: center; }
#ecoordsPanel .ec-head-title {
    font-size: 14px; font-weight: 800; color: #fff; letter-spacing: 0.3px; line-height: 1.2;
    white-space: nowrap;
}
#ecoordsPanel .ec-head-subtitle {
    font-size: 9px; color: rgba(255,255,255,0.55); letter-spacing: 0.8px;
    text-transform: uppercase; font-weight: 500; margin-top: 2px;
}
#ecoordsPanel .ec-head-close {
    background: rgba(255,255,255,0.13); border: none; cursor: pointer;
    width: 24px; height: 24px; border-radius: 5px; font-size: 12px; font-weight: 900;
    color: #fff; line-height: 1; display: flex; align-items: center; justify-content: center;
    transition: background 0.15s; flex-shrink: 0; align-self: flex-start;
}
#ecoordsPanel .ec-head-close:hover { background: rgba(220,50,50,0.55); }
#ecoordsPanel .ec-head-help {
    background: rgba(255,255,255,0.18); border: none; border-radius: 50%;
    cursor: pointer; width: 24px; height: 24px;
    font-size: 11px; font-weight: 900; color: #fff;
    line-height: 1; display: flex; align-items: center; justify-content: center;
    transition: background 0.15s; flex-shrink: 0; align-self: flex-start;
}
#ecoordsPanel .ec-head-help:hover { background: rgba(255,255,255,0.35); }
/* Tooltip de ayuda */
#ecHelpBox {
    display: none; position: absolute; top: 44px; right: 10px;
    width: 265px; background: #fff;
    border: 1.5px solid #cfd8dc; border-radius: 8px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.22);
    z-index: 10000; padding: 12px 14px;
    font-size: 11px; color: #444; line-height: 1.6; cursor: default;
}
#ecHelpBox h4 {
    font-size: 10px; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.8px; color: #455a64; margin: 10px 0 3px;
    border-bottom: 1px solid #eceff1; padding-bottom: 3px;
}
#ecHelpBox h4:first-child { margin-top: 0; }
#ecHelpBox p { margin: 0 0 4px; }
#ecHelpBox .ec-help-close {
    position: absolute; top: 7px; right: 9px;
    background: none; border: none; cursor: pointer;
    font-size: 12px; color: #bbb;
}
#ecHelpBox .ec-help-close:hover { color: #455a64; }
/* Body */
#ecoordsPanel .ec-body {
    padding: 10px 12px; display: flex; flex-direction: column; gap: 10px;
    max-height: 80vh; overflow-y: auto;
}
#ecoordsPanel .ec-body::-webkit-scrollbar { width: 4px; }
#ecoordsPanel .ec-body::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
/* Section separator */
#ecoordsPanel .ec-sep {
    font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;
    color: #546e7a; border-bottom: 1px solid #dde3e7; padding-bottom: 4px; margin-bottom: 4px;
}
/* Group chips */
.ec-group-chips { display: flex; gap: 5px; }
.ec-group-chip {
    flex: 1; padding: 7px 4px; border-radius: 7px;
    border: 2px solid transparent;
    text-align: center; cursor: pointer; color: #fff;
    transition: all 0.15s; opacity: 0.45;
    white-space: nowrap; overflow: hidden;
}
.ec-group-chip:hover { opacity: 0.75; }
.ec-group-chip.ec-chip-active {
    opacity: 1; transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.28);
    border-color: rgba(255,255,255,0.4);
}
.ec-group-chip-label { font-size: 10px; font-weight: 800; line-height: 1.2; white-space: nowrap; }
.ec-group-chip-count { font-size: 9px; font-weight: 500; margin-top: 1px; opacity: 0.85; }
/* Options */
.ec-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 10px; }
.ec-opt {
    display: flex; align-items: center; gap: 5px;
    font-size: 10px; color: #37474f; cursor: pointer;
}
.ec-opt input { accent-color: #455a64; width: 13px; height: 13px; cursor: pointer; }
/* Output blocks */
.ec-out-block {
    background: #fff; border-radius: 7px;
    border: 1.5px solid #e0e0e0; overflow: hidden;
    transition: border-color 0.15s, box-shadow 0.15s;
}
.ec-out-block.ec-out-active {
    border-color: var(--grp-color);
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
}
.ec-out-header {
    display: flex; align-items: center; padding: 5px 8px; gap: 6px;
    background: #f5f5f5; border-bottom: 1px solid #ebebeb;
}
.ec-out-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.ec-out-label { font-size: 10px; font-weight: 800; color: #37474f; flex: 1; }
.ec-out-count { font-size: 9px; color: #999; margin-right: 4px; }
.ec-out-copy {
    font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 4px;
    border: none; background: #455a64; color: #fff; cursor: pointer;
    transition: background 0.15s;
}
.ec-out-copy:hover { background: #546e7a; }
.ec-out-copy.ec-copied { background: #43a047; }
.ec-out-body { display: none; }
.ec-out-body.ec-expanded { display: block; }
.ec-out-textarea {
    width: 100%; box-sizing: border-box; padding: 6px 8px;
    font-size: 9px; color: #444; border: none; outline: none;
    resize: none; background: #fff; font-family: monospace; display: block;
}
/* Fake config */
#ecFakeConfig { display:none; flex-direction:column; gap:7px; }
#ecFakeConfig.ec-fake-visible { display:flex; }
.ec-fake-units { display:flex; gap:10px; flex-wrap:wrap; }
.ec-fake-unit { display:flex; align-items:center; gap:4px; font-size:10px; color:#37474f; cursor:pointer; }
.ec-fake-unit input { accent-color:#455a64; width:13px; height:13px; cursor:pointer; }
.ec-mode-chips { display:flex; gap:5px; }
.ec-mode-chip {
    flex:1; padding:5px 4px; border-radius:6px; text-align:center;
    font-size:9px; font-weight:800; cursor:pointer; border:1.5px solid #cfd8dc;
    color:#546e7a; background:#fff; transition:all 0.15s; white-space:nowrap;
}
.ec-mode-chip:hover { border-color:#455a64; color:#263238; }
.ec-mode-chip.ec-mode-active {
    background:#455a64; border-color:#455a64; color:#fff;
    box-shadow:0 2px 6px rgba(0,0,0,0.20);
}
/* Fake unit selector */
.ec-fake-main-chips { display:flex; gap:4px; flex-wrap:wrap; }
.ec-fake-main-chip {
    padding:5px 9px; border-radius:6px; border:1.5px solid #cfd8dc;
    font-size:10px; font-weight:700; color:#546e7a; background:#fff;
    cursor:pointer; transition:all 0.15s; white-space:nowrap;
}
.ec-fake-main-chip:hover { border-color:#455a64; color:#263238; }
.ec-fake-main-chip.ec-fake-main-active {
    background:#455a64; border-color:#455a64; color:#fff;
    box-shadow:0 2px 6px rgba(0,0,0,0.18);
}
.ec-fake-spy-row { display:flex; align-items:center; gap:5px; font-size:10px; color:#546e7a; }
.ec-fake-spy-row input { accent-color:#455a64; width:13px; height:13px; cursor:pointer; }
.ec-quickbar-btn {
    display:block; text-align:center; padding:5px; border-radius:6px;
    border:1.5px solid #b0bec5; background:#eceff1;
    font-size:10px; font-weight:700; color:#37474f; text-decoration:none;
    transition:all 0.15s; cursor:pointer;
}
.ec-quickbar-btn:hover { background:#cfd8dc; border-color:#455a64; color:#263238; }
/* Clear button */
.ec-clear-btn {
    width: 100%; padding: 6px; border: 1.5px solid #e0e0e0; border-radius: 6px;
    background: #fff; font-size: 10px; font-weight: 700; color: #b71c1c;
    cursor: pointer; transition: all 0.15s;
}
.ec-clear-btn:hover { background: #ffebee; border-color: #ef9a9a; }
/* Footer */
#ecoordsPanel .ec-footer {
    background: #edf0f2; border-top: 1.5px solid #dde3e7;
    padding: 6px 12px; text-align: center; font-size: 10px;
    color: #78909c; font-style: italic; border-radius: 0 0 8px 8px;
}
#ecoordsPanel .ec-footer strong { font-style: normal; color: #455a64; }
</style>`);

        var chipsHtml = self.groups.map(function (g) {
            return '<div class="ec-group-chip' + (g.id === 0 ? ' ec-chip-active' : '') + '" ' +
                   'data-gid="' + g.id + '" style="background:' + g.color + ';">' +
                   '<div class="ec-group-chip-label">Grupo ' + g.label + '</div>' +
                   '<div class="ec-group-chip-count" id="ecChipCount_' + g.id + '">0</div>' +
                   '</div>';
        }).join('');

        var outputHtml = self.groups.map(function (g) {
            return '<div class="ec-out-block" id="ecOutBlock_' + g.id + '" style="--grp-color:' + g.color + '">' +
                   '<div class="ec-out-header" data-gid="' + g.id + '" style="cursor:pointer;">' +
                   '<div class="ec-out-dot" style="background:' + g.color + ';"></div>' +
                   '<span class="ec-out-label">' + g.emoji + ' Grupo ' + g.label + '</span>' +
                   '<span class="ec-out-count" id="ecCount_' + g.id + '">0 aldeas</span>' +
                   '<button class="ec-out-copy" id="ecCopy_' + g.id + '">Copiar</button>' +
                   '</div>' +
                   '<div class="ec-out-body" id="ecOutBody_' + g.id + '">' +
                   '<textarea class="ec-out-textarea" id="ecOutput_' + g.id + '" rows="3" readonly placeholder="Sin aldeas..."></textarea>' +
                   '</div>' +
                   '</div>';
        }).join('');

        $('body').append(
            '<div id="ecoordsPanel">' +
            '<div class="ec-head" style="position:relative;">' +
            '<div style="width:53px;align-self:flex-start;"></div>' +
            '<div class="ec-head-center">' +
            '<div class="ec-head-title">🗺️ Selector de Coordenadas</div>' +
            '<div class="ec-head-subtitle">Click en el mapa para marcar aldeas</div>' +
            '</div>' +
            '<div style="display:flex;align-items:flex-start;gap:5px;align-self:flex-start;margin-top:2px;">' +
            '<button class="ec-head-help" id="ecHelpBtn" title="Ayuda">?</button>' +
            '<button class="ec-head-close" id="ecCloseBtn">✕</button>' +
            '</div>' +
            '<div id="ecHelpBox">' +
            '<button class="ec-help-close" id="ecHelpClose">✕</button>' +
            '<h4>🎨 Grupo activo</h4>' +
            '<p>Selecciona un grupo de color antes de marcar aldeas. Cada grupo tiene su propio color en el mapa y su propio output. Puedes cambiar de grupo en cualquier momento — si marcas una aldea que ya estaba en otro grupo, se mueve automáticamente.</p>' +
            '<h4>⚙️ Opciones de salida</h4>' +
            '<p><strong>Códigos BB:</strong> envuelve cada coordenada en [coord][/coord] para pegarlas en el juego.</p>' +
            '<p><strong>Numerado:</strong> añade un número de orden delante de cada coordenada.</p>' +
            '<p><strong>Nueva línea:</strong> separa cada coordenada en su propia línea.</p>' +
            '<p><strong>Script Fakes:</strong> genera un script de fakes en lugar de coordenadas.</p>' +
            '<h4>📋 Output por grupo</h4>' +
            '<p>Haz click en un grupo para expandir su output. El botón <strong>Copiar</strong> copia el contenido al portapapeles.</p>' +
            '<h4>🗑️ Limpiar todo</h4>' +
            '<p>Elimina todas las aldeas seleccionadas de todos los grupos y recarga el mapa.</p>' +
            '</div>' +
            '</div>' +
            '<div class="ec-body">' +
            '<div><div class="ec-sep">🎨 Grupo activo · click para cambiar</div>' +
            '<div class="ec-group-chips">' + chipsHtml + '</div></div>' +
            '<div><div class="ec-sep">⚙️ Opciones de salida</div>' +
            '<div class="ec-opts">' +
            '<label class="ec-opt"><input type="checkbox" id="ecChkCoords" ' + (self.showWithCoords ? 'checked' : '') + '> Códigos BB</label>' +
            '<label class="ec-opt"><input type="checkbox" id="ecChkCounter" ' + (self.showWithCounter ? 'checked' : '') + '> Numerado</label>' +
            '<label class="ec-opt"><input type="checkbox" id="ecChkNewline" ' + (self.showWithNewLine ? 'checked' : '') + '> Nueva línea</label>' +
            '<label class="ec-opt"><input type="checkbox" id="ecChkFakes" ' + (self.showWithFakes ? 'checked' : '') + '> Script Fakes</label>' +
            '</div></div>' +
            '<div id="ecFakeConfig">' +
            '<div class="ec-sep">🎯 Configuración de Fakes</div>' +
            '<div class="ec-fake-main-chips">' +
            '<div class="ec-fake-main-chip ec-fake-main-active" data-main="ram">⚙️ Ariete</div>' +
            '<div class="ec-fake-main-chip" data-main="catapult">💣 Catapulta</div>' +
            '<div class="ec-fake-main-chip" data-main="ram_cat">⚙️→💣 Ariete sino Cat.</div>' +
            '<div class="ec-fake-main-chip" data-main="cat_ram">💣→⚙️ Cat. sino Ariete</div>' +
            '</div>' +
            '<label class="ec-fake-spy-row"><input type="checkbox" id="ecFakeSpy"> + Añadir 1 Espía siempre</label>' +
            '<div class="ec-mode-chips">' +
            '<div class="ec-mode-chip" data-mode="seq">Secuencial</div>' +
            '<div class="ec-mode-chip ec-mode-active" data-mode="shuffle">Mezclado</div>' +
            '<div class="ec-mode-chip" data-mode="rand">Aleatorio</div>' +
            '</div>' +
            '<a class="ec-quickbar-btn" href="' + game_data.link_base_pure + 'settings&mode=quickbar" target="_blank">⚡ Ir a barra de acceso rápido</a>' +
            '</div>' +
            '<div><div class="ec-sep">📋 Output por grupo · click para expandir</div>' +
            outputHtml + '</div>' +
            '<button class="ec-clear-btn" id="ecClearAll">🗑️ Limpiar todo</button>' +
            '</div>' +
            '<div class="ec-footer">⚔️ Creado por <strong>rabagalan73</strong> para la reina <strong>M0bscene</strong> ⚔️</div>' +
            '</div>'
        );

        // Draggable
        $('#ecoordsPanel').draggable({ handle: '.ec-head', scroll: false, cancel: 'button,input,textarea' });

        // Close
        $('#ecCloseBtn').on('click', function () { win.DSSelectVillages.disableScript(); });

        // Help
        $('#ecHelpBtn').on('click', function (e) {
            e.stopPropagation();
            $('#ecHelpBox').toggle();
        });
        $('#ecHelpClose').on('click', function (e) {
            e.stopPropagation();
            $('#ecHelpBox').hide();
        });
        $(document).on('click.ecHelp', function (e) {
            if (!$(e.target).closest('#ecHelpBox, #ecHelpBtn').length) {
                $('#ecHelpBox').hide();
            }
        });

        // Group chips
        $('.ec-group-chip').on('click', function () {
            win.DSSelectVillages.activeGroup = parseInt($(this).data('gid'));
            $('.ec-group-chip').removeClass('ec-chip-active');
            $(this).addClass('ec-chip-active');
        });

        // Output block toggle (expand/collapse)
        self.groups.forEach(function (g) {
            $('#ecOutBlock_' + g.id + ' .ec-out-header').on('click', function (e) {
                if ($(e.target).hasClass('ec-out-copy')) return;
                $('#ecOutBody_' + g.id).toggleClass('ec-expanded');
            });
        });

        // Options
        $('#ecChkCoords').on('change', function () { self.showWithCoords = this.checked; self.outputCoords(); });
        $('#ecChkCounter').on('change', function () { self.showWithCounter = this.checked; self.outputCoords(); });
        $('#ecChkNewline').on('change', function () { self.showWithNewLine = this.checked; self.outputCoords(); });
        $('#ecChkFakes').on('change', function () {
            self.showWithFakes = this.checked;
            $('#ecFakeConfig').toggleClass('ec-fake-visible', this.checked);
            self.outputCoords();
        });

        // Fake main unit chips
        $('.ec-fake-main-chip').on('click', function () {
            self.fakeMain = $(this).data('main');
            $('.ec-fake-main-chip').removeClass('ec-fake-main-active');
            $(this).addClass('ec-fake-main-active');
            self.outputCoords();
        });

        // Spy checkbox
        $('#ecFakeSpy').on('change', function () { self.fakeSpy = this.checked; self.outputCoords(); });

        // Fake mode chips
        $('.ec-mode-chip').on('click', function () {
            self.fakeMode = $(this).data('mode');
            $('.ec-mode-chip').removeClass('ec-mode-active');
            $(this).addClass('ec-mode-active');
            self.outputCoords();
        });

        // Copy buttons
        self.groups.forEach(function (g) {
            $('#ecCopy_' + g.id).on('click', function (e) {
                e.stopPropagation();
                var ta = document.getElementById('ecOutput_' + g.id);
                if (!ta || !ta.value) return;
                var btn = $(this);
                function onCopied() {
                    btn.text('✓').addClass('ec-copied');
                    setTimeout(function () { btn.text('Copiar').removeClass('ec-copied'); }, 1500);
                }
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(ta.value).then(onCopied);
                } else {
                    // Fallback para navegadores sin Clipboard API
                    ta.removeAttribute('readonly');
                    ta.style.position = 'fixed'; ta.style.opacity = '0';
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    document.getElementById('ecOutBody_' + g.id).appendChild(ta);
                    ta.style.position = ''; ta.style.opacity = '';
                    ta.setAttribute('readonly', '');
                    onCopied();
                }
            });
        });

        // Clear all
        $('#ecClearAll').on('click', function () {
            self.groups.forEach(function (g) { g.villages = []; g.villagesId = []; });
            self.outputCoords();
            win.TWMap.reload();
        });
    },

    outputCoords: function () {
        var self = this;
        self.groups.forEach(function (g) {
            var realVillages = g.villages.filter(function (v) { return v !== null; });
            var out = '';
            var realCount = 0;

            if (self.showWithFakes && realVillages.length > 0) {
                out = generateFakeScript(realVillages, g.label, self.fakeMain, self.fakeSpy, self.fakeMode);
                realCount = realVillages.length;
            } else {
                for (var i = 0; i < g.villages.length; i++) {
                    if (g.villages[i] === null) continue;
                    realCount++;
                    out += (self.showWithCounter ? realCount + '. ' : '') +
                           (self.showWithCoords ? '[coord]' : '') +
                           g.villages[i] +
                           (self.showWithCoords ? '[/coord]' : '') +
                           (self.showWithNewLine ? '\n' : ' ');
                }
            }

            var ta       = document.getElementById('ecOutput_' + g.id);
            var countEl  = document.getElementById('ecCount_' + g.id);
            var chipCount = document.getElementById('ecChipCount_' + g.id);
            var block    = document.getElementById('ecOutBlock_' + g.id);
            var body     = document.getElementById('ecOutBody_' + g.id);

            if (ta) ta.value = out;
            var label = realCount + (realCount === 1 ? ' aldea' : ' aldeas');
            if (countEl) countEl.textContent = label;
            if (chipCount) chipCount.textContent = realCount;
            if (block) block.classList.toggle('ec-out-active', realCount > 0);
            // Auto-expand block when it gets villages
            if (body && realCount > 0) body.classList.add('ec-expanded');
        });
    },

    handleVillage: function (x, y) {
        var self = this;
        var coord = x + '|' + y;
        var village = win.TWMap.villages[x * 1000 + y];
        if (!village) return;

        var g = self.groups[self.activeGroup];
        var index = g.villages.indexOf(coord);

        if (index === -1) {
            // Si la aldea ya está en otro grupo, quitarla de allí
            self.groups.forEach(function (og) {
                var oi = og.villages.indexOf(coord);
                if (oi !== -1) {
                    og.villages[oi] = null;
                    var idIdx = og.villagesId.indexOf(village.id);
                    if (idIdx !== -1) og.villagesId[idIdx] = null;
                }
            });
            g.villages.push(coord);
            g.villagesId.push(village.id);
        } else {
            g.villages[index] = null;
            var idIdx = g.villagesId.indexOf(village.id);
            if (idIdx !== -1) g.villagesId[idIdx] = null;
        }

        win.TWMap.reload();
        self.outputCoords();
    },

    clickFunction: function (x, y, event) {
        win.DSSelectVillages.handleVillage(x, y);
        return false;
    }
};

function generateFakeScript(coords, groupLabel, fakeMain, fakeSpy, mode) {
    // Fisher-Yates shuffle para modo mezclado
    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
        return a;
    }

    var coordList  = mode === 'shuffle' ? shuffle(coords) : coords.slice();
    var storageKey = 'ecFake_' + groupLabel;
    var coordsStr  = coordList.join(' ');
    var modeStr    = mode === 'rand' ? 'rand' : (mode === 'shuffle' ? 'shuffle' : 'seq');

    var base =
        'var b=document;' +
        'function el(n){return b.getElementsByName(n)[0];}' +
        'function ins(f,v){if(!f)return;f.value=v;' +
            'try{var ev=b.createEvent("HTMLEvents");ev.initEvent("change",true,true);f.dispatchEvent(ev);}catch(x){}}' +
        'function avail(n){var f=el(n);if(!f)return 0;' +
            'var s=f.nextSibling;while(s&&s.nodeType!==1)s=s.nextSibling;' +
            'if(!s)return 0;var m=s.innerHTML.match(/\\d+/);return m?Number(m[0]):0;}' +
        'function toast(icon,title,msg,color){' +
            'var d=document.createElement("div");' +
            'd.innerHTML="<span style=\\"font-size:20px;line-height:1;\\">"+icon+"</span>' +
                '<div style=\\"line-height:1.4;\\"><div style=\\"font-size:12px;font-weight:800;color:"+color+";\\">"+title+"</div>' +
                '<div style=\\"font-size:10px;margin-top:2px;color:#ccc;\\">"+msg+"</div></div>";' +
            'd.style.cssText="position:fixed;top:24px;right:24px;z-index:99999;display:flex;align-items:center;gap:12px;' +
                'background:#111;color:#fff;padding:13px 18px;border-radius:9px;' +
                'font-family:Segoe UI,Tahoma,sans-serif;' +
                'box-shadow:0 8px 28px rgba(0,0,0,0.55);border-left:4px solid "+color+";' +
                'opacity:1;transition:opacity 0.4s;min-width:240px;";' +
            'document.body.appendChild(d);' +
            'setTimeout(function(){d.style.opacity="0";setTimeout(function(){if(d.parentNode)d.parentNode.removeChild(d);},400);},3200);' +
        '}';

    // Lógica de unidad principal con flag sent
    var unitLogic = 'var sent=false;';
    if (fakeMain === 'ram') {
        unitLogic += 'if(avail("ram")>0){ins(el("ram"),1);sent=true;}';
    } else if (fakeMain === 'catapult') {
        unitLogic += 'if(avail("catapult")>0){ins(el("catapult"),1);sent=true;}';
    } else if (fakeMain === 'ram_cat') {
        unitLogic += 'if(avail("ram")>0){ins(el("ram"),1);sent=true;}else if(avail("catapult")>0){ins(el("catapult"),1);sent=true;}';
    } else if (fakeMain === 'cat_ram') {
        unitLogic += 'if(avail("catapult")>0){ins(el("catapult"),1);sent=true;}else if(avail("ram")>0){ins(el("ram"),1);sent=true;}';
    }
    // Espía independiente (no afecta al flag sent — es bonus)
    unitLogic += 'if(spy&&avail("spy")>0)ins(el("spy"),1);';
    // Aviso si no hay tropas — no avanzar índice
    unitLogic +=
        'if(!sent){' +
            'toast("⚠️","Sin tropas disponibles","No quedan arietes ni catapultas en este pueblo.","#ff5252");' +
            'return;' +
        '}' +
        // Aviso de nuevo ciclo iniciado (no en la primera ejecución)
        'if(idx===0&&cycles>0){' +
            'toast("🔄","¡Nuevo ciclo!","La lista ha completado una vuelta. Empezando de nuevo desde el principio.","#43a047");' +
        '}' +
        // Guardar avance SOLO cuando el jugador confirma el ataque con el botón
        'if(nextIdx!==null){' +
            'var newCycles=nextIdx===0?cycles+1:cycles;' +
            'var attackBtn=b.getElementById("target_attack");' +
            'if(attackBtn){' +
                'attackBtn.addEventListener("click",function(){' +
                    'localStorage.setItem(key,JSON.stringify({i:nextIdx,s:sig,c:newCycles}));' +
                '},{once:true});' +
            '}' +
        '}';

    return 'javascript:var coords="' + coordsStr + '";var spy=' + (fakeSpy ? 'true' : 'false') + ';(function(){' +
        'if(typeof game_data==="undefined"||game_data.screen!=="place"){' +
            'if(typeof game_data!=="undefined")' +
                'window.location.href=game_data.link_base_pure+"place";' +
            'return;}' +
        'var coordList=coords.trim().split(/\\s+/);' +
        'var mode="' + modeStr + '";' +
        'var key="' + storageKey + '";' +
        base +
        'var sig=coordList.length+"_"+coordList[0];' +
        'var _saved=JSON.parse(localStorage.getItem(key)||"null");' +
        'var validSig=_saved&&_saved.s===sig;' +
        'var idx=validSig?_saved.i:0;' +
        'var cycles=validSig?(_saved.c||0):0;' +
        'var t;' +
        'var nextIdx=null;' +
        'if(mode==="rand"){' +
            't=coordList[Math.floor(Math.random()*coordList.length)];' +
        '}else{' +
            't=coordList[idx%coordList.length];' +
            'nextIdx=(idx+1)%coordList.length;' +
        '}' +
        unitLogic +
        'var tPts=t.split("|");' +
        'if(el("x")&&el("y")){ins(el("x"),tPts[0]);ins(el("y"),tPts[1]);}' +
        'else if(el("input")){ins(el("input"),t);}' +
        'if(typeof xProcess==="function")xProcess("inputx","inputy");' +
        // Inyectar panel de info en la página
        '(function(){' +
            'var old=b.getElementById("ecFakeInfoBar");if(old)old.parentNode.removeChild(old);' +
            'var isNewCycle=nextIdx===0&&nextIdx!==null;' +
            'var newCycles=isNewCycle?cycles+1:cycles;' +
            'var total=coordList.length;' +
            'var current=mode==="rand"?null:(idx+1);' +
            // Barra de progreso CSS
            'var barPct=mode==="rand"?0:Math.round((current/total)*100);' +
            'var progressBar="<div style=\\"background:#333;border-radius:3px;width:70px;height:5px;overflow:hidden;margin-bottom:2px;\\">"' +
                '+"<div style=\\"background:#f5a623;height:100%;width:"+barPct+"%;transition:width 0.3s;\\"></div></div>";' +
            'var progressStr=mode==="rand"?"<span style=\\"color:#f5a623;font-weight:900;\\">✦ Aleatorio</span>":progressBar+"<span style=\\"font-size:11px;font-weight:700;color:#e0e0e0;\\">"+current+"/"+total+"</span>";' +
            // Modo label
            'var modeLabel=mode==="rand"?"🎲 Aleatorio":mode==="shuffle"?"🔀 Mezclado":"▶ Secuencial";' +
            // Ciclo
            'var cycleStr=isNewCycle?"<span style=\\"color:#43a047;font-weight:900;\\">"+(newCycles)+" ✅</span>":"<span>"+newCycles+"</span>";' +
            // Coordenada link
            'var tParts=t.split("|");' +
            'var tLink=game_data.link_base_pure+"map&x="+tParts[0]+"&y="+tParts[1];' +
            'var tHtml="<a href=\\""+tLink+"\\" style=\\"color:#f5a623;font-weight:900;font-size:13px;text-decoration:none;letter-spacing:0.5px;\\">📍 "+t+"</a>";' +
            // Contenedor — compacto en móvil
            'var isMobile=window.innerWidth<600;' +
            'var p=isMobile?"5px 8px":"8px 16px";' +
            'var bar=b.createElement("div");' +
            'bar.id="ecFakeInfoBar";' +
            'bar.style.cssText=' +
                '"display:flex;width:fit-content;max-width:100%;align-items:stretch;margin:8px 0 12px;border-radius:8px;overflow:hidden;' +
                'box-shadow:0 4px 16px rgba(0,0,0,0.35);font-family:Segoe UI,Tahoma,sans-serif;' +
                'clear:both;opacity:0;transition:opacity 0.3s;";' +
            'bar.innerHTML=' +
                // Badge izquierdo
                '"<div style=\\"background:linear-gradient(135deg,#b71c1c,#7f0000);padding:"+p+";display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;"+(isMobile?"min-width:44px":"min-width:70px")+";\\">"' +
                '+"<span style=\\"font-size:"+(isMobile?"14px":"18px")+";line-height:1;\\">⚔️</span>"' +
                '+"<span style=\\"font-size:8px;font-weight:900;color:#ffcdd2;letter-spacing:1px;text-transform:uppercase;white-space:nowrap;\\">FAKES</span>"' +
                '+"</div>"' +
                // Celda objetivo
                '+"<div style=\\"background:#1a1a2e;padding:"+p+";display:flex;flex-direction:column;justify-content:center;gap:2px;border-right:1px solid #2d2d44;\\">"' +
                '+"<span style=\\"font-size:9px;font-weight:700;color:#8888aa;letter-spacing:1px;text-transform:uppercase;\\">OBJETIVO</span>"' +
                '+"<span>"+tHtml+"</span>"' +
                '+"</div>"' +
                // Celda progreso
                '+"<div style=\\"background:#1a1a2e;padding:"+p+";display:flex;flex-direction:column;justify-content:center;gap:2px;border-right:1px solid #2d2d44;\\">"' +
                '+"<span style=\\"font-size:9px;font-weight:700;color:#8888aa;letter-spacing:1px;text-transform:uppercase;\\">PROGRESO</span>"' +
                '+"<span style=\\"font-family:monospace;font-size:11px;font-weight:700;color:#e0e0e0;letter-spacing:1px;\\">"+progressStr+"</span>"' +
                '+"</div>"' +
                // Celda modo — oculta en móvil
                '+(isMobile?"":' +
                '"<div style=\\"background:#1a1a2e;padding:"+p+";display:flex;flex-direction:column;justify-content:center;gap:2px;border-right:1px solid #2d2d44;\\">"' +
                '+"<span style=\\"font-size:9px;font-weight:700;color:#8888aa;letter-spacing:1px;text-transform:uppercase;\\">MODO</span>"' +
                '+"<span style=\\"font-size:11px;font-weight:700;color:#e0e0e0;\\">"+modeLabel+"</span>"' +
                '+"</div>")' +
                // Celda ciclo
                '+"<div style=\\"background:#1a1a2e;padding:"+p+";display:flex;flex-direction:column;justify-content:center;gap:2px;\\">"' +
                '+"<span style=\\"font-size:9px;font-weight:700;color:#8888aa;letter-spacing:1px;text-transform:uppercase;\\">CICLO</span>"' +
                '+"<span style=\\"font-size:12px;font-weight:700;color:#e0e0e0;\\">"+cycleStr+"</span>"' +
                '+"</div>"' +
                // Author — oculto en móvil
                '+(isMobile?"":' +
                '"<div style=\\"background:#1a1a2e;padding:8px 10px;display:flex;flex-direction:column;justify-content:flex-end;gap:2px;border-left:1px solid #2d2d44;\\">"' +
                '+"<span style=\\"font-size:8px;color:#8888aa;letter-spacing:0.5px;white-space:nowrap;\\">by rabagalan73</span>"' +
                '+"</div>");' +
            'var anchor=b.getElementById("command-form-warning");' +
            'if(anchor){anchor.parentNode.insertBefore(bar,anchor);' +
            'setTimeout(function(){bar.style.opacity="1";},30);}' +
        '})();' +
        'var btn=b.getElementById("target_attack");if(btn)btn.focus();' +
        '})();';
}

ScriptAPI.lib.launchOnScreen('map');
