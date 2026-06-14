// Hungarian translation provided by =Krumpli=

ScriptAPI.register('FarmGod', true, 'Warre', 'nl.tribalwars@coma.innogames.de');

window.FarmGod = {};
window.FarmGod.Library = (function () {
  /**** TribalWarsLibrary.js ****/
  if (typeof window.twLib === 'undefined') {
    window.twLib = {
      queues: null,
      init: function () {
        if (this.queues === null) {
          this.queues = this.queueLib.createQueues(5);
        }
      },
      queueLib: {
        maxAttempts: 3,
        Item: function (action, arg, promise = null) {
          this.action = action;
          this.arguments = arg;
          this.promise = promise;
          this.attempts = 0;
        },
        Queue: function () {
          this.list = [];
          this.working = false;
          this.length = 0;

          this.doNext = function () {
            let item = this.dequeue();
            let self = this;

            if (item.action == 'openWindow') {
              window
                .open(...item.arguments)
                .addEventListener(
                  'DOMContentLoaded',
                  function () {
                    self.start();
                  }
                );
            } else {
              $[item.action](...item.arguments)
                .done(function () {
                  item.promise.resolve.apply(null, arguments);
                  self.start();
                })
                .fail(function () {
                  item.attempts += 1;
                  if (
                    item.attempts <
                    twLib.queueLib.maxAttempts
                  ) {
                    self.enqueue(item, true);
                  } else {
                    item.promise.reject.apply(
                      null,
                      arguments
                    );
                  }

                  self.start();
                });
            }
          };

          this.start = function () {
            if (this.length) {
              this.working = true;
              this.doNext();
            } else {
              this.working = false;
            }
          };

          this.dequeue = function () {
            this.length -= 1;
            return this.list.shift();
          };

          this.enqueue = function (item, front = false) {
            front ? this.list.unshift(item) : this.list.push(item);
            this.length += 1;

            if (!this.working) {
              this.start();
            }
          };
        },
        createQueues: function (amount) {
          let arr = [];

          for (let i = 0; i < amount; i++) {
            arr[i] = new twLib.queueLib.Queue();
          }

          return arr;
        },
        addItem: function (item) {
          let leastBusyQueue = twLib.queues
            .map((q) => q.length)
            .reduce((next, curr) => (curr < next ? curr : next), 0);
          twLib.queues[leastBusyQueue].enqueue(item);
        },
        orchestrator: function (type, arg) {
          let promise = $.Deferred();
          let item = new twLib.queueLib.Item(type, arg, promise);

          twLib.queueLib.addItem(item);

          return promise;
        },
      },
      ajax: function () {
        return twLib.queueLib.orchestrator('ajax', arguments);
      },
      get: function () {
        return twLib.queueLib.orchestrator('get', arguments);
      },
      post: function () {
        return twLib.queueLib.orchestrator('post', arguments);
      },
      openWindow: function () {
        let item = new twLib.queueLib.Item('openWindow', arguments);

        twLib.queueLib.addItem(item);
      },
    };

    twLib.init();
  }

  /**** Script Library ****/
  const setUnitSpeeds = function () {
    let unitSpeeds = {};

    $.when($.get('/interface.php?func=get_unit_info')).then((xml) => {
      $(xml)
        .find('config')
        .children()
        .map((i, el) => {
          unitSpeeds[$(el).prop('nodeName')] = $(el)
            .find('speed')
            .text()
            .toNumber();
        });

      localStorage.setItem(
        'FarmGod_unitSpeeds',
        JSON.stringify(unitSpeeds)
      );
    });
  };

  const getUnitSpeeds = function () {
    return JSON.parse(localStorage.getItem('FarmGod_unitSpeeds')) || false;
  };

  if (!getUnitSpeeds()) setUnitSpeeds();

  const determineNextPage = function (page, $html) {
    let villageLength =
      $html.find('#scavenge_mass_screen').length > 0
        ? $html.find('tr[id*="scavenge_village"]').length
        : $html.find('tr.row_a, tr.row_ax, tr.row_b, tr.row_bx').length;
    let navSelect = $html
      .find('.paged-nav-item')
      .first()
      .closest('td')
      .find('select')
      .first();
    // Commented out the old version of the code, updated in April 2024
    // The old version did not count the number of pages in the loot assistant properly when there were more than 15 or so due to the way the UI changes to not show all pages
    // let navLength = ($html.find('#am_widget_Farm').length > 0) ? $html.find('#plunder_list_nav').first().find('a.paged-nav-item').length : ((navSelect.length > 0) ? navSelect.find('option').length - 1 : $html.find('.paged-nav-item').not('[href*="page=-1"]').length);
    let navLength =
      $html.find('#am_widget_Farm').length > 0
        ? parseInt(
          $('#plunder_list_nav')
            .first()
            .find('a.paged-nav-item, strong.paged-nav-item')
          [
            $('#plunder_list_nav')
              .first()
              .find(
                'a.paged-nav-item, strong.paged-nav-item'
              ).length - 1
          ].textContent.replace(/\D/g, '')
        ) - 1
        : navSelect.length > 0
          ? navSelect.find('option').length - 1
          : $html.find('.paged-nav-item').not('[href*="page=-1"]').length;
    let pageSize =
      $('#mobileHeader').length > 0
        ? 10
        : parseInt($html.find('input[name="page_size"]').val());

    if (page == -1 && villageLength == 1000) {
      return Math.floor(1000 / pageSize);
    } else if (page < navLength) {
      return page + 1;
    }

    return false;
  };

  const processPage = function (url, page, wrapFn) {
    let pageText = url.match('am_farm')
      ? `&Farm_page=${page}`
      : `&page=${page}`;

    return twLib
      .ajax({
        url: url + pageText,
      })
      .then((html) => {
        return wrapFn(page, $(html));
      });
  };

  const processAllPages = function (url, processorFn) {
    let page = url.match('am_farm') || url.match('scavenge_mass') ? 0 : -1;
    let wrapFn = function (page, $html) {
      let dnp = determineNextPage(page, $html);

      if (dnp) {
        processorFn($html);
        return processPage(url, dnp, wrapFn);
      } else {
        return processorFn($html);
      }
    };

    return processPage(url, page, wrapFn);
  };

  const getDistance = function (origin, target) {
    let a = origin.toCoord(true).x - target.toCoord(true).x;
    let b = origin.toCoord(true).y - target.toCoord(true).y;

    return Math.hypot(a, b);
  };

  const subtractArrays = function (array1, array2) {
    let result = array1.map((val, i) => {
      return val - array2[i];
    });

    return result.some((v) => v < 0) ? false : result;
  };

  const getCurrentServerTime = function () {
    let [hour, min, sec, day, month, year] = $('#serverTime')
      .closest('p')
      .text()
      .match(/\d+/g);
    return new Date(year, month - 1, day, hour, min, sec).getTime();
  };

  const timestampFromString = function (timestr) {
    let d = $('#serverDate')
      .text()
      .split('/')
      .map((x) => +x);
    let todayPattern = new RegExp(
      window.lang['aea2b0aa9ae1534226518faaefffdaad'].replace(
        '%s',
        '([\\d+|:]+)'
      )
    ).exec(timestr);
    let tomorrowPattern = new RegExp(
      window.lang['57d28d1b211fddbb7a499ead5bf23079'].replace(
        '%s',
        '([\\d+|:]+)'
      )
    ).exec(timestr);
    let laterDatePattern = new RegExp(
      window.lang['0cb274c906d622fa8ce524bcfbb7552d']
        .replace('%1', '([\\d+|\\.]+)')
        .replace('%2', '([\\d+|:]+)')
    ).exec(timestr);
    let t, date;

    if (todayPattern !== null) {
      t = todayPattern[1].split(':');
      date = new Date(d[2], d[1] - 1, d[0], t[0], t[1], t[2], t[3] || 0);
    } else if (tomorrowPattern !== null) {
      t = tomorrowPattern[1].split(':');
      date = new Date(
        d[2],
        d[1] - 1,
        d[0] + 1,
        t[0],
        t[1],
        t[2],
        t[3] || 0
      );
    } else {
      d = (laterDatePattern[1] + d[2]).split('.').map((x) => +x);
      t = laterDatePattern[2].split(':');
      date = new Date(d[2], d[1] - 1, d[0], t[0], t[1], t[2], t[3] || 0);
    }

    return date.getTime();
  };

  String.prototype.toCoord = function (objectified) {
    let c = (this.match(/\d{1,3}\|\d{1,3}/g) || [false]).pop();
    return c && objectified
      ? { x: c.split('|')[0], y: c.split('|')[1] }
      : c;
  };

  String.prototype.toNumber = function () {
    return parseFloat(this);
  };

  Number.prototype.toNumber = function () {
    return parseFloat(this);
  };

  return {
    getUnitSpeeds,
    processPage,
    processAllPages,
    getDistance,
    subtractArrays,
    getCurrentServerTime,
    timestampFromString,
  };
})();

window.FarmGod.Translation = (function () {
  const msg = {
    es: {
      missingFeatures: "El script requiere cuenta premium y asistente de saqueo.",
      options: {
        title: "FarmGod: Planificador de granjas",
        warning: "<b>Advertencia:</b><br>- Asegurate de que <b>A</b> es tu microfarm por defecto y <b>B</b> una microfarm mayor.<br>- Comprueba que los filtros del asistente de saqueo estan configurados correctamente.",
        filterImage: "https://higamy.github.io/TW/Scripts/Assets/farmGodFilters.png",
        group: "Grupo desde el que farmear",
        distance: "Distancia maxima en campos",
        time: "Tiempo minimo entre granjas (minutos)",
        losses: "Enviar granja a pueblos con perdidas parciales",
        maxloot: "Usar plantilla B si el botin anterior fue maximo",
        newbarbs: "Incluir nuevos barbaros en la lista",
        button: "Planificar granjas",
      },
      table: {
        noFarmsPlanned: "No se pueden planificar granjas con la configuracion actual.",
        origin: "Origen",
        target: "Destino",
        fields: "Campos",
        farm: "Plantilla",
        goTo: "Ir a",
      },
      messages: {
        villageChanged: "Pueblo cambiado correctamente!",
        villageError: "Todas las granjas de este pueblo ya han sido enviadas!",
        sendError: "Error: la granja no fue enviada!",
      },
    },
    int: {
      missingFeatures: "Script requires a premium account and loot assistant!",
      options: {
        title: "FarmGod Options",
        warning: "<b>Warning:</b><br>- Make sure A is set as your default microfarm and B as a larger microfarm<br>- Make sure the farm filters are set correctly before using the script",
        filterImage: "https://higamy.github.io/TW/Scripts/Assets/farmGodFilters.png",
        group: "Send farms from group",
        distance: "Maximum fields for farms",
        time: "Minimum time in minutes between farms",
        losses: "Send farm to villages with partial losses",
        maxloot: "Send a B farm if the last loot was full",
        newbarbs: "Add new barbs to farm",
        button: "Plan farms",
      },
      table: {
        noFarmsPlanned: "No farms can be sent with the specified settings.",
        origin: "Origin",
        target: "Target",
        fields: "Fields",
        farm: "Farm",
        goTo: "Go to",
      },
      messages: {
        villageChanged: "Successfully changed village!",
        villageError: "All farms for the current village have been sent!",
        sendError: "Error: farm not sent!",
      },
    },
  };

  const get = function () {
    let locale = game_data.locale;
    if (locale.startsWith("es")) return msg.es;
    if (msg.hasOwnProperty(locale)) return msg[locale];
    return msg.int;
  };

  return { get };
})();

window.FarmGod.Main = (function (Library, Translation) {
  const lib = Library;
  const t = Translation.get();
  let curVillage = null;
  let farmBusy = false;

  const init = function () {
    if (
      game_data.features.Premium.active &&
      game_data.features.FarmAssistent.active
    ) {
      if (game_data.screen == 'am_farm') {
        $.when(buildOptions()).then((html) => {
          Dialog.show('FarmGod', html);

          $('.optionButton')
            .off('click')
            .on('click', () => {
              let optionGroup = parseInt($('.optionGroup').val());
              let optionDistance = parseFloat(
                $('.optionDistance').val()
              );
              let optionTime = parseFloat($('.optionTime').val());
              let optionLosses =
                $('.optionLosses').prop('checked');
              let optionMaxloot =
                $('.optionMaxloot').prop('checked');
              let optionNewbarbs =
                $('.optionNewbarbs').prop('checked') || false;

              localStorage.setItem(
                'farmGod_options',
                JSON.stringify({
                  optionGroup: optionGroup,
                  optionDistance: optionDistance,
                  optionTime: optionTime,
                  optionLosses: optionLosses,
                  optionMaxloot: optionMaxloot,
                  optionNewbarbs: optionNewbarbs,
                })
              );

              $('.optionsContent').html(`
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:44px 20px;gap:14px;">
                  <div style="width:34px;height:34px;border:3px solid var(--fg-border);border-top:3px solid var(--fg-accent);border-radius:50%;animation:fgSpin .8s linear infinite;"></div>
                  <span style="color:var(--fg-text2);font-size:12px;">Recopilando datos...</span>
                </div>
              `);
              getData(
                optionGroup,
                optionNewbarbs,
                optionLosses
              ).then((data) => {
                Dialog.close();

                let plan = createPlanning(
                  optionDistance,
                  optionTime,
                  optionMaxloot,
                  data
                );
                $('.fgRabaContent').remove();
                $('#am_widget_Farm')
                  .first()
                  .before(buildTable(plan.farms));

                bindEventHandlers();
              });
            });

          $(document)
            .off('click.fgTheme')
            .on('click.fgTheme', '#fg-settings-btn', function () {
              $('#fg-theme-panel, #fg-theme-overlay').addClass('open');
            })
            .on('click.fgTheme', '#fg-theme-close, #fg-theme-overlay', function () {
              $('#fg-theme-panel, #fg-theme-overlay').removeClass('open');
            })
            .on('click.fgTheme', '.fg-theme-item', function () {
              let themeName = $(this).data('theme');
              applyTheme(themeName);
              $('.fg-theme-item').removeClass('active');
              $(this).addClass('active');
            });

          document.querySelector('.optionButton').focus();
        });
      } else {
        location.href = game_data.link_base_pure + 'am_farm';
      }
    } else {
      UI.ErrorMessage(t.missingFeatures);
    }

    /*
    if (game_data.market != 'nl') {
      $.post('https://swtools.be/ScriptStats/insert.php', { script: 'FarmGod', market: game_data.market, world: game_data.world, player: game_data.player.id });
    }*/
  };

  const bindEventHandlers = function () {
    $('.farmGod_icon')
      .off('click')
      .on('click', function (e) {
        e.stopPropagation();
        if (
          game_data.market != 'nl' ||
          $(this).data('origin') == curVillage
        ) {
          sendFarm($(this));
        } else {
          UI.ErrorMessage(t.messages.villageError);
        }
      });

    $('.fg-card-foot')
      .off('click.fgFoot')
      .on('click.fgFoot', function (e) {
        if (!$(e.target).hasClass('farmGod_icon')) {
          $(this).find('.farmGod_icon').trigger('click');
        }
      });

    $(document)
      .off('keydown')
      .on('keydown', (event) => {
        if ((event.keyCode || event.which) == 13) {
          $('.farmGod_icon').first().trigger('click');
        }
      });

    // === Mobile Hold-to-Farm FAB ===
    // Only on mobile (no physical keyboard). Tap: fires once. Hold: fires continuously
    // while finger is pressed — same behavior as holding Enter on desktop. Not automation:
    // requires continuous manual contact.
    if ($('#mobileHeader').length > 0 || window.innerWidth <= 900) {
      if (window._fgFabTimer) { clearInterval(window._fgFabTimer); window._fgFabTimer = null; }
      $('#fg-hold-fab').remove();
      $('<div id="fg-hold-fab">' +
          '<button class="fg-fab-btn" id="fg-hold-btn" aria-label="Mantener pulsado para granjear">' +
            '<span class="fg-fab-icon">&#x2694;&#xFE0F;</span>' +
            '<div class="fg-fab-text">' +
              '<span class="fg-fab-label">MANTENER PULSADO</span>' +
              '<span class="fg-fab-sub">para enviar granja</span>' +
            '</div>' +
            '<span class="fg-fab-counter" id="fg-fab-counter">0</span>' +
          '</button>' +
        '</div>').insertAfter('.fgRabaProgress');
      var _fabBtn = document.getElementById('fg-hold-btn');
      _fabBtn.addEventListener('touchstart', function (e) {
        e.preventDefault();
        var _count = 0;
        _fabBtn.classList.add('fg-fab-active');
        function _fire() {
          var icon = document.querySelector('.farmGod_icon');
          if (icon) {
            $(icon).trigger('click');
            _count++;
            var c = document.getElementById('fg-fab-counter');
            if (c) c.textContent = _count;
            if (navigator.vibrate) navigator.vibrate(18);
          }
        }
        _fire();
        window._fgFabTimer = setInterval(_fire, 220);
      }, { passive: false });
      function _fabStop() {
        _fabBtn.classList.remove('fg-fab-active');
        clearInterval(window._fgFabTimer);
        window._fgFabTimer = null;
      }
      _fabBtn.addEventListener('touchend', _fabStop);
      _fabBtn.addEventListener('touchcancel', _fabStop);
    }

    $('.switchVillage')
      .off('click')
      .on('click', function () {
        curVillage = $(this).data('id');
        UI.SuccessMessage(t.messages.villageChanged);
        $(this).closest('.fg-village-group').remove();
      });
  };

  const THEMES = {
    inferno:  { name:'Inferno',  emoji:'&#x1F525;', '--fg-bg':'#1c1f27','--fg-bg2':'#13151c','--fg-bg3':'#252831','--fg-border':'#2c2f3c','--fg-accent':'#f5a623','--fg-accent2':'#e8700a','--fg-text':'#e2e8f0','--fg-text2':'#8892a4','--fg-row-even':'#21242e','--fg-row-odd':'#191c24','--fg-hover':'rgba(245,166,35,.05)','--fg-warn-bg':'#2a1f0e','--fg-warn-border':'#6b4c1a','--fg-warn-text':'#c8952a','--fg-link':'#4f8ef7','--fg-shadow':'rgba(0,0,0,.7)' },
    sakura:   { name:'Sakura',   emoji:'&#x1F338;', '--fg-bg':'#fdf2f8','--fg-bg2':'#fce7f3','--fg-bg3':'#ffffff','--fg-border':'#f9a8d4','--fg-accent':'#ec4899','--fg-accent2':'#db2777','--fg-text':'#1f2937','--fg-text2':'#6b7280','--fg-row-even':'#fdf2f8','--fg-row-odd':'#ffffff','--fg-hover':'rgba(236,72,153,.07)','--fg-warn-bg':'#fdf2f8','--fg-warn-border':'#f9a8d4','--fg-warn-text':'#be185d','--fg-link':'#db2777','--fg-shadow':'rgba(236,72,153,.2)' },
    amethyst: { name:'Amethyst', emoji:'&#x1F49C;', '--fg-bg':'#faf5ff','--fg-bg2':'#f3e8ff','--fg-bg3':'#ffffff','--fg-border':'#d8b4fe','--fg-accent':'#7c3aed','--fg-accent2':'#6d28d9','--fg-text':'#1f2937','--fg-text2':'#6b7280','--fg-row-even':'#faf5ff','--fg-row-odd':'#ffffff','--fg-hover':'rgba(124,58,237,.07)','--fg-warn-bg':'#faf5ff','--fg-warn-border':'#d8b4fe','--fg-warn-text':'#5b21b6','--fg-link':'#7c3aed','--fg-shadow':'rgba(124,58,237,.2)' },
    matrix:   { name:'Matrix',   emoji:'&#x1F7E2;', '--fg-bg':'#0a0f0a','--fg-bg2':'#050805','--fg-bg3':'#0f1a0f','--fg-border':'#1a3d1a','--fg-accent':'#00ff41','--fg-accent2':'#00cc34','--fg-text':'#ccffcc','--fg-text2':'#4dff77','--fg-row-even':'#0a1a0a','--fg-row-odd':'#060d06','--fg-hover':'rgba(0,255,65,.05)','--fg-warn-bg':'#051005','--fg-warn-border':'#1a4d1a','--fg-warn-text':'#00ff41','--fg-link':'#00ff41','--fg-shadow':'rgba(0,255,65,.3)' },
    midnight: { name:'Midnight', emoji:'&#x1F319;', '--fg-bg':'#0f172a','--fg-bg2':'#080d1a','--fg-bg3':'#1e293b','--fg-border':'#334155','--fg-accent':'#3b82f6','--fg-accent2':'#2563eb','--fg-text':'#e2e8f0','--fg-text2':'#94a3b8','--fg-row-even':'#1a2540','--fg-row-odd':'#111827','--fg-hover':'rgba(59,130,246,.07)','--fg-warn-bg':'#0f172a','--fg-warn-border':'#1d4ed8','--fg-warn-text':'#93c5fd','--fg-link':'#60a5fa','--fg-shadow':'rgba(0,0,0,.8)' },
    crimson:  { name:'Crimson',  emoji:'&#x1F534;', '--fg-bg':'#1a0505','--fg-bg2':'#0d0202','--fg-bg3':'#2d0a0a','--fg-border':'#7f1d1d','--fg-accent':'#ef4444','--fg-accent2':'#dc2626','--fg-text':'#fecaca','--fg-text2':'#f87171','--fg-row-even':'#220808','--fg-row-odd':'#150404','--fg-hover':'rgba(239,68,68,.07)','--fg-warn-bg':'#2d0a0a','--fg-warn-border':'#991b1b','--fg-warn-text':'#fca5a5','--fg-link':'#f87171','--fg-shadow':'rgba(0,0,0,.8)' },
    arctic:   { name:'Arctic',   emoji:'&#x1F30A;', '--fg-bg':'#f0f9ff','--fg-bg2':'#e0f2fe','--fg-bg3':'#ffffff','--fg-border':'#bae6fd','--fg-accent':'#0ea5e9','--fg-accent2':'#0284c7','--fg-text':'#0c4a6e','--fg-text2':'#0369a1','--fg-row-even':'#f0f9ff','--fg-row-odd':'#ffffff','--fg-hover':'rgba(14,165,233,.07)','--fg-warn-bg':'#f0f9ff','--fg-warn-border':'#7dd3fc','--fg-warn-text':'#0369a1','--fg-link':'#0ea5e9','--fg-shadow':'rgba(14,165,233,.2)' },
    obsidian: { name:'Obsidian', emoji:'&#x1F5A4;', '--fg-bg':'#000000','--fg-bg2':'#0a0a0a','--fg-bg3':'#111111','--fg-border':'#1f1f1f','--fg-accent':'#06b6d4','--fg-accent2':'#0891b2','--fg-text':'#e2e8f0','--fg-text2':'#64748b','--fg-row-even':'#0d0d0d','--fg-row-odd':'#060606','--fg-hover':'rgba(6,182,212,.05)','--fg-warn-bg':'#001a1f','--fg-warn-border':'#0e4a55','--fg-warn-text':'#67e8f9','--fg-link':'#38bdf8','--fg-shadow':'rgba(0,0,0,.9)' },
    tribal:   { name:'Tribal',   emoji:'&#x1F3F0;', '--fg-bg':'#f4e8c4','--fg-bg2':'#e8d4a0','--fg-bg3':'#fdf5e0','--fg-border':'#9b7b3a','--fg-accent':'#7a9b2a','--fg-accent2':'#5a7a1a','--fg-text':'#3d2b0e','--fg-text2':'#7a5c2e','--fg-row-even':'#f4e8c4','--fg-row-odd':'#ecdca8','--fg-hover':'rgba(122,155,42,.09)','--fg-warn-bg':'#fdf0d0','--fg-warn-border':'#c8a050','--fg-warn-text':'#8b5e00','--fg-link':'#5a7a1a','--fg-shadow':'rgba(61,43,14,.3)' },
  };

  const applyTheme = function (themeName) {
    let th = THEMES[themeName] || THEMES.inferno;
    let vars = Object.entries(th).filter(([k]) => k.startsWith('--')).map(([k,v]) => `${k}:${v}`).join(';');
    let el = document.getElementById('fg-theme-vars');
    if (!el) { el = document.createElement('style'); el.id = 'fg-theme-vars'; document.head.appendChild(el); }
    el.textContent = `#popup_box_FarmGod, #popup_box_FarmGod .popup_box_content, .fgRabaContent, #fg-hold-fab { ${vars} }`;
    localStorage.setItem('farmGod_theme', themeName);
  };

  const getCurrentTheme = function () {
    return localStorage.getItem('farmGod_theme') || 'inferno';
  };

  const injectFGCSS = function () {
    if (document.getElementById('fg-raba-style')) return;
    applyTheme(getCurrentTheme());
    var s = document.createElement('style');
    s.id = 'fg-raba-style';
    s.textContent = `
/* === FarmGod Raba === */
#popup_box_FarmGod { width:540px !important; background:var(--fg-bg) !important; border:1px solid var(--fg-border) !important; border-radius:16px !important; overflow:hidden !important; box-shadow:0 32px 80px var(--fg-shadow) !important; }
#popup_box_FarmGod .popup_box_header { display:none !important; }
#popup_box_FarmGod .popup_box_content { background:var(--fg-bg) !important; padding:0 !important; position:relative !important; overflow:hidden !important; }

/* === Header === */
.fg-header { position:relative; padding:18px 20px 16px; background:var(--fg-bg2); border-bottom:1px solid var(--fg-border); display:flex; align-items:center; gap:14px; overflow:hidden; }
.fg-header::before { content:""; position:absolute; top:-50px; left:-50px; width:200px; height:200px; background:radial-gradient(circle, var(--fg-accent) 0%, transparent 70%); opacity:.07; pointer-events:none; }
.fg-header-icon { width:42px; height:42px; border-radius:11px; background:linear-gradient(135deg,var(--fg-accent),var(--fg-accent2)); display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; box-shadow:0 4px 16px var(--fg-shadow); }
.fg-header-text { flex:1; min-width:0; }
.fg-header-title { font-size:16px; font-weight:800; color:var(--fg-text); letter-spacing:-.3px; }
.fg-header-sub { font-size:11px; color:var(--fg-text2); margin-top:2px; }
.fg-settings-btn { width:32px; height:32px; border:1.5px solid var(--fg-border); border-radius:8px; background:var(--fg-bg3); color:var(--fg-text2); font-size:15px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:border-color .15s, color .15s, transform .3s; line-height:1; }
.fg-settings-btn:hover { border-color:var(--fg-accent); color:var(--fg-accent); transform:rotate(60deg); }

/* === Body === */
.fg-body { padding:16px 18px; display:flex; flex-direction:column; gap:10px; }

/* === Warning === */
.fg-warn { background:var(--fg-warn-bg); border:1px solid var(--fg-warn-border); border-radius:10px; padding:11px 14px; font-size:11px; color:var(--fg-warn-text); line-height:1.6; }
.fg-warn b { color:var(--fg-accent); }
.fg-warn img { width:100%; border-radius:6px; margin-top:8px; }

/* === Sections === */
.fg-section { display:flex; flex-direction:column; border-radius:10px; overflow:hidden; border:1px solid var(--fg-border); }
.fg-option-row { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 14px; background:var(--fg-bg3); transition:background .12s; }
.fg-option-row:hover { background:var(--fg-bg2); }
.fg-option-row + .fg-option-row { border-top:1px solid var(--fg-border); }
.fg-label { font-size:12px; color:var(--fg-text2); font-weight:500; display:flex; align-items:center; gap:7px; }
.fg-label-icon { font-size:13px; opacity:.65; }

.fg-input { background:var(--fg-bg); border:1.5px solid var(--fg-border); border-radius:7px; color:var(--fg-text); font-size:13px; padding:5px 10px; outline:none; width:78px; transition:border-color .15s; text-align:right; }
.fg-input:focus { border-color:var(--fg-accent); }
.fg-select { background:var(--fg-bg); border:1.5px solid var(--fg-border); border-radius:7px; color:var(--fg-text); font-size:13px; padding:5px 10px; outline:none; flex:1; max-width:220px; transition:border-color .15s; }
.fg-select:focus { border-color:var(--fg-accent); }

/* === Toggle === */
.fg-toggle { position:relative; width:38px; height:20px; flex-shrink:0; }
.fg-toggle input { opacity:0; width:0; height:0; }
.fg-toggle-slider { position:absolute; inset:0; background:var(--fg-border); border-radius:20px; cursor:pointer; transition:.2s; }
.fg-toggle-slider:before { content:""; position:absolute; width:14px; height:14px; left:3px; bottom:3px; background:var(--fg-text2); border-radius:50%; transition:.2s; }
.fg-toggle input:checked + .fg-toggle-slider { background:linear-gradient(135deg,var(--fg-accent),var(--fg-accent2)); }
.fg-toggle input:checked + .fg-toggle-slider:before { transform:translateX(18px); background:#fff; }

/* === CTA Button === */
.fg-btn { width:100%; padding:12px; border:none; border-radius:10px; font-size:14px; font-weight:800; cursor:pointer; background:linear-gradient(135deg,var(--fg-accent),var(--fg-accent2)); color:var(--fg-bg2); letter-spacing:.3px; position:relative; overflow:hidden; transition:opacity .15s, transform .1s, box-shadow .15s; box-shadow:0 4px 20px var(--fg-shadow); }
.fg-btn::after { content:""; position:absolute; inset:0; background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.18) 50%,transparent 100%); transform:translateX(-100%); transition:transform .45s; }
.fg-btn:hover::after { transform:translateX(100%); }
.fg-btn:hover { opacity:.92; }
.fg-btn:active { transform:scale(.98); }

/* === Footer === */
.fg-footer { padding:8px 18px; background:var(--fg-bg2); border-top:1px solid var(--fg-border); font-size:10px; color:var(--fg-text2); text-align:center; }

/* === Theme Panel === */
.fg-theme-overlay { position:absolute; inset:0; background:rgba(0,0,0,.45); backdrop-filter:blur(3px); z-index:9; opacity:0; pointer-events:none; transition:opacity .22s; }
.fg-theme-overlay.open { opacity:1; pointer-events:all; }
.fg-theme-panel { position:absolute; top:0; right:0; bottom:0; width:220px; background:var(--fg-bg2); border-left:1px solid var(--fg-border); z-index:10; display:flex; flex-direction:column; transform:translateX(100%); transition:transform .25s cubic-bezier(.4,0,.2,1); }
.fg-theme-panel.open { transform:translateX(0); }
.fg-theme-panel-head { padding:14px 16px; border-bottom:1px solid var(--fg-border); display:flex; align-items:center; justify-content:space-between; }
.fg-theme-panel-head span { font-size:13px; font-weight:700; color:var(--fg-text); }
.fg-theme-close { width:24px; height:24px; border:1px solid var(--fg-border); border-radius:6px; background:transparent; color:var(--fg-text2); cursor:pointer; font-size:11px; display:flex; align-items:center; justify-content:center; transition:border-color .1s, color .1s; }
.fg-theme-close:hover { border-color:var(--fg-accent); color:var(--fg-accent); }
.fg-theme-list { padding:10px; display:flex; flex-direction:column; gap:5px; overflow-y:auto; flex:1; }
.fg-theme-item { display:flex; align-items:center; gap:10px; padding:9px 11px; border-radius:8px; border:1.5px solid transparent; cursor:pointer; transition:border-color .15s, background .15s; background:var(--fg-bg3); }
.fg-theme-item:hover { border-color:var(--fg-border); }
.fg-theme-item.active { border-color:var(--fg-accent) !important; }
.fg-theme-dot { width:26px; height:26px; border-radius:7px; flex-shrink:0; }
.fg-theme-item-name { font-size:12px; font-weight:600; color:var(--fg-text); }
.fg-theme-item-sub { font-size:10px; margin-top:1px; }

/* === Cards de resultados === */
.fgRabaContent { background:var(--fg-bg); border:1px solid var(--fg-border); border-radius:14px; overflow:hidden; margin-bottom:14px; }
.fg-results-header { padding:13px 18px; background:var(--fg-bg2); border-bottom:1px solid var(--fg-border); display:flex; align-items:center; justify-content:space-between; }
.fg-results-title { font-size:14px; font-weight:800; color:var(--fg-text); display:flex; align-items:center; gap:8px; }
.fg-results-badge { display:inline-flex; align-items:center; justify-content:center; min-width:22px; height:18px; padding:0 7px; background:var(--fg-accent); color:var(--fg-bg2); border-radius:9px; font-size:10px; font-weight:800; }
.fgRabaProgress { padding:9px 18px; background:var(--fg-bg); border-bottom:1px solid var(--fg-border); }
.fg-progress-wrap { height:5px; background:var(--fg-border); border-radius:5px; overflow:hidden; position:relative; }
.fg-progress-bar { height:100%; background:linear-gradient(90deg,var(--fg-accent),var(--fg-accent2)); border-radius:5px; transition:width .3s; width:0%; position:relative; overflow:hidden; }
.fg-progress-bar::after { content:""; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent); animation:fgShimmer 1.6s infinite; }
@keyframes fgShimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
@keyframes fgSpin { to{transform:rotate(360deg)} }
.fg-progress-label { font-size:10px; color:var(--fg-text2); margin-top:4px; text-align:right; }
.fg-cards-wrap { padding:12px 14px; display:flex; flex-direction:column; gap:12px; }
.fg-village-group { display:flex; flex-direction:column; gap:7px; }
.fg-village-group-head { display:flex; align-items:center; gap:8px; padding:6px 10px 6px 12px; background:var(--fg-bg2); border-radius:8px; border:1px solid var(--fg-border); border-left:3px solid var(--fg-accent); }
.fg-village-group-name { font-size:11px; font-weight:700; color:var(--fg-text); flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.fg-village-count { font-size:10px; font-weight:700; color:var(--fg-bg2); background:var(--fg-accent); padding:1px 7px; border-radius:9px; flex-shrink:0; }
.fg-switch-btn { padding:3px 9px; border-radius:5px; background:transparent; border:1px solid var(--fg-border); color:var(--fg-text2); font-size:10px; font-weight:600; cursor:pointer; flex-shrink:0; transition:border-color .15s, color .15s; }
.fg-switch-btn:hover { border-color:var(--fg-accent); color:var(--fg-accent); }
.fg-card-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(108px,1fr)); gap:7px; }
.fg-farm-card { background:var(--fg-bg3); border:1.5px solid var(--fg-border); border-radius:9px; overflow:hidden; display:flex; flex-direction:column; transition:border-color .18s, transform .15s, box-shadow .18s; }
.fg-farm-card:hover { border-color:var(--fg-accent); transform:translateY(-2px); box-shadow:0 6px 18px var(--fg-shadow); }
.fg-card-top { padding:8px 9px 7px; position:relative; }
.fg-farm-card.fg-tmpl-b .fg-card-top { background:linear-gradient(135deg,var(--fg-accent),var(--fg-accent2)); }
.fg-farm-card.fg-tmpl-a .fg-card-top { background:linear-gradient(135deg,var(--fg-accent2),var(--fg-bg2)); }
.fg-card-target { font-size:12px; font-weight:800; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,.4); }
.fg-card-target a { color:inherit; text-decoration:none; }
.fg-card-target a:hover { opacity:.82; }
.fg-card-tmpl { position:absolute; top:6px; right:6px; width:15px; height:15px; border-radius:3px; background:rgba(0,0,0,.25); display:flex; align-items:center; justify-content:center; font-size:8px; font-weight:800; color:#fff; }
.fg-card-body { padding:6px 9px 5px; display:flex; flex-direction:column; gap:3px; flex:1; }
.fg-card-origin { font-size:10px; color:var(--fg-text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.fg-card-origin a { color:var(--fg-link); text-decoration:none; }
.fg-card-origin a:hover { color:var(--fg-accent); }
.fg-card-dist-row { display:flex; align-items:center; gap:4px; }
.fg-card-dist-dot { width:4px; height:4px; border-radius:50%; background:var(--fg-accent); flex-shrink:0; opacity:.55; }
.fg-card-dist-val { font-size:10px; color:var(--fg-text2); }
.fg-card-foot { padding:6px 8px; border-top:1px solid var(--fg-border); display:flex; align-items:center; justify-content:center; gap:5px; background:var(--fg-bg2); transition:background .15s; }
.fg-farm-card:hover .fg-card-foot { background:var(--fg-accent); }
.fg-card-foot .farmGod_icon { display:inline-block; cursor:pointer; vertical-align:middle; filter:drop-shadow(0 0 2px rgba(0,0,0,.3)); transition:transform .15s; }
.fg-farm-card:hover .fg-card-foot .farmGod_icon { transform:scale(1.1); }
.fg-card-send-label { font-size:10px; font-weight:600; color:var(--fg-text2); pointer-events:none; transition:color .15s; }
.fg-farm-card:hover .fg-card-send-label { color:var(--fg-bg2); }
.fg-empty-cards { padding:44px 20px; text-align:center; color:var(--fg-text2); font-size:13px; }

/* === Mobile Hold-to-Farm FAB (inline) === */
#fg-hold-fab { padding:10px 14px; background:var(--fg-bg2); border-bottom:1px solid var(--fg-border); display:flex; justify-content:center; align-items:center; }
.fg-fab-btn { display:flex; align-items:center; gap:13px; padding:13px 28px; width:100%; max-width:400px; justify-content:center; background:linear-gradient(135deg,var(--fg-accent) 0%,var(--fg-accent2) 100%); border:none; border-radius:10px; box-shadow:0 4px 16px var(--fg-shadow); cursor:pointer; -webkit-tap-highlight-color:transparent; user-select:none; position:relative; overflow:hidden; transition:transform .12s,box-shadow .12s; }
.fg-fab-btn::after { content:''; position:absolute; inset:0; background:rgba(255,255,255,0); transition:background .15s; pointer-events:none; }
.fg-fab-btn.fg-fab-active { transform:scale(.98); box-shadow:0 2px 8px var(--fg-shadow); }
.fg-fab-btn.fg-fab-active::after { background:rgba(255,255,255,.1); }
.fg-fab-icon { font-size:22px; line-height:1; flex-shrink:0; filter:drop-shadow(0 2px 4px rgba(0,0,0,.25)); }
.fg-fab-text { display:flex; flex-direction:column; align-items:flex-start; }
.fg-fab-label { font-size:13px; font-weight:800; color:#fff; letter-spacing:.5px; white-space:nowrap; text-shadow:0 1px 3px rgba(0,0,0,.22); line-height:1.3; }
.fg-fab-sub { font-size:10px; color:rgba(255,255,255,.68); font-weight:500; letter-spacing:.2px; white-space:nowrap; margin-top:2px; }
.fg-fab-counter { min-width:24px; height:24px; border-radius:12px; background:rgba(255,255,255,.22); color:#fff; font-size:11px; font-weight:800; display:none; align-items:center; justify-content:center; padding:0 7px; margin-left:4px; flex-shrink:0; box-shadow:inset 0 1px 3px rgba(0,0,0,.2); }
.fg-fab-btn.fg-fab-active .fg-fab-counter { display:flex; }

/* === Mobile compact layout === */
@media (max-width:900px) {
    .fg-card-grid { grid-template-columns:repeat(auto-fill,minmax(78px,1fr)) !important; gap:5px !important; }
    .fg-card-top { padding:6px 7px 5px !important; }
    .fg-card-target { font-size:10px !important; }
    .fg-card-tmpl { width:12px !important; height:12px !important; font-size:7px !important; top:4px !important; right:4px !important; }
    .fg-card-body { padding:4px 7px 3px !important; gap:2px !important; }
    .fg-card-origin { font-size:9px !important; }
    .fg-card-dist-val { font-size:9px !important; }
    .fg-card-dist-dot { width:3px !important; height:3px !important; }
    .fg-card-foot { padding:4px 6px !important; gap:3px !important; overflow:visible !important; }
    .fg-card-foot .farmGod_icon,
    .fg-card-foot .farm_icon { zoom:0.65 !important; }
    .fg-card-send-label { font-size:9px !important; }
    .fg-cards-wrap { padding:8px 10px !important; gap:8px !important; }
    .fg-village-group { gap:5px !important; }
    .fg-village-group-head { padding:5px 8px 5px 10px !important; }
    .fg-village-group-name { font-size:10px !important; }
    .fg-results-header { padding:10px 14px !important; }
    .fg-results-title { font-size:12px !important; }
    .fg-results-badge { font-size:9px !important; min-width:18px !important; height:15px !important; }
}
    `;
    document.head.appendChild(s);
  };

  const buildOptions = function () {
    injectFGCSS();
    let options = JSON.parse(localStorage.getItem('farmGod_options')) || {
      optionGroup: 0,
      optionDistance: 25,
      optionTime: 10,
      optionLosses: false,
      optionMaxloot: true,
      optionNewbarbs: true,
    };
    let checkboxSettings = [false, true, true, true, false];
    let checkboxError = $('#plunder_list_filters')
      .find('input[type="checkbox"]')
      .map((i, el) => { return $(el).prop('checked') != checkboxSettings[i]; })
      .get().includes(true);
    let $templateRows = $('form[action*="action=edit_all"]')
      .find('input[type="hidden"][name*="template"]').closest('tr');
    let templateError =
      $templateRows.first().find('td').last().text().toNumber() >=
      $templateRows.last().find('td').last().text().toNumber();

    return $.when(buildGroupSelect(options.optionGroup)).then((groupSelect) => {
      let curTheme = getCurrentTheme();
      let themeItems = Object.entries(THEMES).map(([key, th]) => `
        <div class="fg-theme-item ${curTheme === key ? 'active' : ''}" data-theme="${key}">
          <div class="fg-theme-dot" style="background:linear-gradient(135deg,${th['--fg-accent']},${th['--fg-accent2']});box-shadow:0 2px 8px ${th['--fg-shadow']};"></div>
          <div>
            <div class="fg-theme-item-name">${th.emoji} ${th.name}</div>
            <div class="fg-theme-item-sub" style="color:${th['--fg-accent']}">${th['--fg-bg']}</div>
          </div>
        </div>
      `).join('');

      return `
        <div class="fg-header">
          <div class="fg-header-icon"><span class="icon header lc"> </span></div>
          <div class="fg-header-text">
            <div class="fg-header-title">${t.options.title}</div>
            <div class="fg-header-sub">Tribal Wars &mdash; Automatizaci&oacute;n de farmeo &mdash; v1.5.0</div>
          </div>
          <button class="fg-settings-btn" id="fg-settings-btn" type="button" title="Tema visual">&#9881;</button>
        </div>

        <div class="fg-body optionsContent">
          ${checkboxError || templateError ? `<div class="fg-warn">${t.options.warning}<img src="${t.options.filterImage}"></div>` : ''}

          <div class="fg-section">
            <div class="fg-option-row">
              <span class="fg-label"><span class="fg-label-icon">&#128101;</span>${t.options.group}</span>
              ${groupSelect.replace('class="optionGroup"', 'class="fg-select optionGroup"')}
            </div>
          </div>

          <div class="fg-section">
            <div class="fg-option-row">
              <span class="fg-label"><span class="fg-label-icon">&#128205;</span>${t.options.distance}</span>
              <input type="text" class="fg-input optionDistance" value="${options.optionDistance}">
            </div>
            <div class="fg-option-row">
              <span class="fg-label"><span class="fg-label-icon">&#8987;</span>${t.options.time}</span>
              <input type="text" class="fg-input optionTime" value="${options.optionTime}">
            </div>
          </div>

          <div class="fg-section">
            <div class="fg-option-row">
              <span class="fg-label"><span class="fg-label-icon">&#9876;</span>${t.options.losses}</span>
              <label class="fg-toggle"><input type="checkbox" class="optionLosses" ${options.optionLosses ? 'checked' : ''}><span class="fg-toggle-slider"></span></label>
            </div>
            <div class="fg-option-row">
              <span class="fg-label"><span class="fg-label-icon">&#128179;</span>${t.options.maxloot}</span>
              <label class="fg-toggle"><input type="checkbox" class="optionMaxloot" ${options.optionMaxloot ? 'checked' : ''}><span class="fg-toggle-slider"></span></label>
            </div>
            ${game_data.market == 'nl' ? `
            <div class="fg-option-row">
              <span class="fg-label"><span class="fg-label-icon">&#127807;</span>${t.options.newbarbs}</span>
              <label class="fg-toggle"><input type="checkbox" class="optionNewbarbs" ${options.optionNewbarbs ? 'checked' : ''}><span class="fg-toggle-slider"></span></label>
            </div>` : ''}
          </div>

          <button class="fg-btn optionButton" type="button"><span class="icon header lc"> </span> ${t.options.button}</button>
        </div>

        <div class="fg-footer">&#9876;&#65039; Creado por <strong>rabagalan73</strong> para la reina <strong>M0bscene</strong> &#9876;&#65039;</div>

        <div class="fg-theme-overlay" id="fg-theme-overlay"></div>
        <div class="fg-theme-panel" id="fg-theme-panel">
          <div class="fg-theme-panel-head">
            <span>&#127912; Tema visual</span>
            <button class="fg-theme-close" id="fg-theme-close" type="button">&#x2715;</button>
          </div>
          <div class="fg-theme-list">${themeItems}</div>
        </div>
      `;
    });
  };

  const buildGroupSelect = function (id) {
    return $.get(
      TribalWars.buildURL('GET', 'groups', { ajax: 'load_group_menu' })
    ).then((groups) => {
      let html = `<select class="optionGroup">`;

      groups.result.forEach((val) => {
        if (val.type == 'separator') {
          html += `<option disabled=""/>`;
        } else {
          html += `<option value="${val.group_id}" ${val.group_id == id ? 'selected' : ''
            }>${val.name}</option>`;
        }
      });

      html += `</select>`;

      return html;
    });
  };

  const buildTable = function (plan) {
    let totalFarms = 0;
    for (let p in plan) totalFarms += plan[p].length;

    let content = '';

    if (!$.isEmptyObject(plan)) {
      for (let prop in plan) {
        let groupFarms = plan[prop];

        let cards = groupFarms.map((val) => {
          let isB = val.template.name === 'b';
          return `<div class="fg-farm-card ${isB ? 'fg-tmpl-b' : 'fg-tmpl-a'}">
            <div class="fg-card-top">
              <div class="fg-card-target"><a href="${game_data.link_base_pure}info_village&id=${val.target.id}">${val.target.coord}</a></div>
              <span class="fg-card-tmpl">${val.template.name.toUpperCase()}</span>
            </div>
            <div class="fg-card-body">
              <div class="fg-card-origin"><a href="${game_data.link_base_pure}info_village&id=${val.origin.id}">${val.origin.name}</a></div>
              <div class="fg-card-dist-row">
                <span class="fg-card-dist-dot"></span>
                <span class="fg-card-dist-val">${val.fields.toFixed(1)} ${t.table.fields.toLowerCase()}</span>
              </div>
            </div>
            <div class="fg-card-foot">
              <a href="#" data-origin="${val.origin.id}" data-target="${val.target.id}" data-template="${val.template.id}" class="farmGod_icon farm_icon farm_icon_${val.template.name}"></a>
              <span class="fg-card-send-label">${t.table.farm}</span>
            </div>
          </div>`;
        }).join('');

        let switchBtn = game_data.market == 'nl'
          ? `<button class="fg-switch-btn switchVillage" data-id="${groupFarms[0].origin.id}">&#8644;</button>`
          : '';

        content += `<div class="fg-village-group">
          <div class="fg-village-group-head">
            <span class="fg-village-group-name">&#9876; ${groupFarms[0].origin.name} <span style="opacity:.45">(${groupFarms[0].origin.coord})</span></span>
            <span class="fg-village-count">${groupFarms.length}</span>
            ${switchBtn}
          </div>
          <div class="fg-card-grid">${cards}</div>
        </div>`;
      }
    } else {
      content = `<div class="fg-empty-cards">${t.table.noFarmsPlanned}</div>`;
    }

    return `
    <div class="fgRabaContent">
      <div class="fg-results-header">
        <span class="fg-results-title"><span class="icon header lc"> </span> FarmGod <span class="fg-results-badge">${totalFarms}</span></span>
      </div>
      <div class="fgRabaProgress">
        <div class="fg-progress-wrap">
          <div class="fg-progress-bar" id="FarmGodProgessbar" data-current="0" data-max="${totalFarms}"></div>
        </div>
        <div class="fg-progress-label" id="fg-progress-label">0 / ${totalFarms}</div>
      </div>
      <div class="fg-cards-wrap">${content}</div>
      <div class="fg-footer">&#9876;&#65039; Creado por <strong>rabagalan73</strong> para la reina <strong>M0bscene</strong> &#9876;&#65039;</div>
    </div>`;
  };

  const getData = function (group, newbarbs, losses) {
    let data = {
      villages: {},
      commands: {},
      farms: { templates: {}, farms: {} },
    };

    let villagesProcessor = ($html) => {
      let skipUnits = ['ram', 'catapult', 'knight', 'snob', 'militia'];
      const mobileCheck = $('#mobileHeader').length > 0;

      if (mobileCheck) {
        let table = jQuery($html).find('.overview-container > div');
        table.each((i, el) => {
          try {
            const villageId = jQuery(el)
              .find('.quickedit-vn')
              .data('id');
            const name = jQuery(el)
              .find('.quickedit-label')
              .attr('data-text');
            const coord = jQuery(el)
              .find('.quickedit-label')
              .text()
              .toCoord();

            const units = new Array(game_data.units.length).fill(0);
            const unitsElements = jQuery(el).find(
              '.overview-units-row > div.unit-row-item'
            );

            unitsElements.each((_, unitElement) => {
              const img = jQuery(unitElement).find('img');
              const span =
                jQuery(unitElement).find('span.unit-row-name');
              if (img.length && span.length) {
                let unitType = img
                  .attr('src')
                  .split('unit_')[1]
                  .replace('@2x.webp', '')
                  .replace('.webp', '')
                  .replace('.png', '');
                const value = parseInt(span.text()) || 0;
                const unitIndex =
                  game_data.units.indexOf(unitType);
                if (unitIndex !== -1) {
                  units[unitIndex] = value;
                }
              }
            });

            const filteredUnits = units.filter(
              (_, index) =>
                skipUnits.indexOf(game_data.units[index]) === -1
            );

            data.villages[coord] = {
              name: name,
              id: villageId,
              units: filteredUnits,
            };
          } catch (e) {
            console.error('Error processing village data:', e);
          }
        });
      } else {
        $html
          .find('#combined_table')
          .find('.row_a, .row_b')
          .filter((i, el) => {
            return $(el).find('.bonus_icon_33').length == 0;
          })
          .map((i, el) => {
            let $el = $(el);
            let $qel = $el.find('.quickedit-label').first();
            let units = [];

            units = $el
              .find('.unit-item')
              .filter((index, element) => {
                return (
                  skipUnits.indexOf(game_data.units[index]) ==
                  -1
                );
              })
              .map((index, element) => {
                return $(element).text().toNumber();
              })
              .get();

            return (data.villages[$qel.text().toCoord()] = {
              name: $qel.data('text'),
              id: parseInt(
                $el.find('.quickedit-vn').first().data('id')
              ),
              units: units,
            });
          });
      }

      console.log('villages', data.villages);
      return data;
    };

    let commandsProcessor = ($html) => {
      $html
        .find('#commands_table')
        .find('.row_a, .row_ax, .row_b, .row_bx')
        .map((i, el) => {
          let $el = $(el);
          let coord = $el
            .find('.quickedit-label')
            .first()
            .text()
            .toCoord();

          if (coord) {
            if (!data.commands.hasOwnProperty(coord))
              data.commands[coord] = [];
            return data.commands[coord].push(
              Math.round(
                lib.timestampFromString(
                  $el.find('td').eq(2).text().trim()
                ) / 1000
              )
            );
          }
        });

      return data;
    };

    let farmProcessor = ($html) => {
      if ($.isEmptyObject(data.farms.templates)) {
        let unitSpeeds = lib.getUnitSpeeds();

        $html
          .find('form[action*="action=edit_all"]')
          .find('input[type="hidden"][name*="template"]')
          .closest('tr')
          .map((i, el) => {
            let $el = $(el);

            return (data.farms.templates[
              $el
                .prev('tr')
                .find('a.farm_icon')
                .first()
                .attr('class')
                .match(/farm_icon_(.*)\s/)[1]
            ] = {
              id: $el
                .find(
                  'input[type="hidden"][name*="template"][name*="[id]"]'
                )
                .first()
                .val()
                .toNumber(),
              units: $el
                .find(
                  'input[type="text"], input[type="number"]'
                )
                .map((index, element) => {
                  return $(element).val().toNumber();
                })
                .get(),
              speed: Math.max(
                ...$el
                  .find(
                    'input[type="text"], input[type="number"]'
                  )
                  .map((index, element) => {
                    return $(element).val().toNumber() > 0
                      ? unitSpeeds[
                      $(element)
                        .attr('name')
                        .trim()
                        .split('[')[0]
                      ]
                      : 0;
                  })
                  .get()
              ),
            });
          });
      }

      $html
        .find('#plunder_list')
        .find('tr[id^="village_"]')
        .map((i, el) => {
          let $el = $(el);

          return (data.farms.farms[
            $el
              .find('a[href*="screen=report&mode=all&view="]')
              .first()
              .text()
              .toCoord()
          ] = {
            id: $el.attr('id').split('_')[1].toNumber(),
            color: $el
              .find('img[src*="graphic/dots/"]')
              .attr('src')
              .match(/dots\/(green|yellow|red|blue|red_blue)/)[1],
            max_loot: $el.find('img[src*="max_loot/1"]').length > 0,
          });
        });

      return data;
    };

    let findNewbarbs = () => {
      if (newbarbs) {
        return twLib.get('/map/village.txt').then((allVillages) => {
          allVillages.match(/[^\r\n]+/g).forEach((villageData) => {
            let [id, name, x, y, player_id] =
              villageData.split(',');
            let coord = `${x}|${y}`;

            if (
              player_id == 0 &&
              !data.farms.farms.hasOwnProperty(coord)
            ) {
              data.farms.farms[coord] = {
                id: id.toNumber(),
              };
            }
          });

          return data;
        });
      } else {
        return data;
      }
    };

    let filterFarms = () => {
      data.farms.farms = Object.fromEntries(
        Object.entries(data.farms.farms).filter(([key, val]) => {
          return (
            !val.hasOwnProperty('color') ||
            (val.color != 'red' &&
              val.color != 'red_blue' &&
              (val.color != 'yellow' || losses))
          );
        })
      );

      return data;
    };

    return Promise.all([
      lib.processAllPages(
        TribalWars.buildURL('GET', 'overview_villages', {
          mode: 'combined',
          group: group,
        }),
        villagesProcessor
      ),
      lib.processAllPages(
        TribalWars.buildURL('GET', 'overview_villages', {
          mode: 'commands',
          type: 'attack',
        }),
        commandsProcessor
      ),
      lib.processAllPages(
        TribalWars.buildURL('GET', 'am_farm'),
        farmProcessor
      ),
      findNewbarbs(),
    ])
      .then(filterFarms)
      .then(() => {
        return data;
      });
  };

  const createPlanning = function (
    optionDistance,
    optionTime,
    optionMaxloot,
    data
  ) {
    let plan = { counter: 0, farms: {} };
    let serverTime = Math.round(lib.getCurrentServerTime() / 1000);

    for (let prop in data.villages) {
      let orderedFarms = Object.keys(data.farms.farms)
        .map((key) => {
          return { coord: key, dis: lib.getDistance(prop, key) };
        })
        .sort((a, b) => (a.dis > b.dis ? 1 : -1));

      orderedFarms.forEach((el) => {
        let farmIndex = data.farms.farms[el.coord];
        let template_name =
          optionMaxloot &&
            farmIndex.hasOwnProperty('max_loot') &&
            farmIndex.max_loot
            ? 'b'
            : 'a';
        let template = data.farms.templates[template_name];
        let unitsLeft = lib.subtractArrays(
          data.villages[prop].units,
          template.units
        );

        let distance = lib.getDistance(prop, el.coord);
        let arrival = Math.round(
          serverTime +
          distance * template.speed * 60 +
          Math.round(plan.counter / 5)
        );
        let maxTimeDiff = Math.round(optionTime * 60);
        let timeDiff = true;
        if (data.commands.hasOwnProperty(el.coord)) {
          if (
            !farmIndex.hasOwnProperty('color') &&
            data.commands[el.coord].length > 0
          )
            timeDiff = false;
          data.commands[el.coord].forEach((timestamp) => {
            if (Math.abs(timestamp - arrival) < maxTimeDiff)
              timeDiff = false;
          });
        } else {
          data.commands[el.coord] = [];
        }

        if (unitsLeft && timeDiff && distance < optionDistance) {
          plan.counter++;
          if (!plan.farms.hasOwnProperty(prop)) plan.farms[prop] = [];

          plan.farms[prop].push({
            origin: {
              coord: prop,
              name: data.villages[prop].name,
              id: data.villages[prop].id,
            },
            target: { coord: el.coord, id: farmIndex.id },
            fields: distance,
            template: { name: template_name, id: template.id },
          });

          data.villages[prop].units = unitsLeft;
          data.commands[el.coord].push(arrival);
        }
      });
    }

    return plan;
  };

  const sendFarm = function ($this) {
    let n = Timing.getElapsedTimeSinceLoad();
    if (
      !farmBusy &&
      !(
        Accountmanager.farm.last_click &&
        n - Accountmanager.farm.last_click < 200
      )
    ) {
      farmBusy = true;
      Accountmanager.farm.last_click = n;
      const updateFGProgress = function () {
        let $bar = $('#FarmGodProgessbar');
        let cur = parseInt($bar.data('current') || 0) + 1;
        let max = parseInt($bar.data('max') || 1);
        $bar.data('current', cur);
        $bar.css('width', Math.min(100, Math.round(cur / max * 100)) + '%');
        $('#fg-progress-label').text(cur + ' / ' + max);
      };

      TribalWars.post(
        Accountmanager.send_units_link.replace(
          /village=(\d+)/,
          'village=' + $this.data('origin')
        ),
        null,
        {
          target: $this.data('target'),
          template_id: $this.data('template'),
          source: $this.data('origin'),
        },
        function (r) {
          UI.SuccessMessage(r.success);
          updateFGProgress();
          $this.closest('.fg-farm-card').remove();
          farmBusy = false;
        },
        function (r) {
          UI.ErrorMessage(r || t.messages.sendError);
          updateFGProgress();
          $this.closest('.fg-farm-card').remove();
          farmBusy = false;
        }
      );
    }
  };

  return {
    init,
  };
})(window.FarmGod.Library, window.FarmGod.Translation);

(() => {
  window.FarmGod.Main.init();
})();