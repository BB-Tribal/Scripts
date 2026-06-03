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

          // El Dialog de TW inserta en iframe — acceder al documento correcto
          const fgDoc = () => {
            const iframe = document.getElementById('popup_box_FarmGod') &&
              document.getElementById('popup_box_FarmGod').querySelector('iframe');
            return iframe ? (iframe.contentDocument || iframe.contentWindow.document) : document;
          };
          const fgEl = (sel) => $(fgDoc()).find(sel);

          setTimeout(() => {
            fgEl('.optionGroup')
              .off('change.fgGroup')
              .on('change.fgGroup', () => {
                let saved = JSON.parse(localStorage.getItem('farmGod_options')) || {};
                saved.optionGroup = String(fgEl('.optionGroup').val());
                localStorage.setItem('farmGod_options', JSON.stringify(saved));
              });

            fgEl('.optionButton')
              .off('click.fgButton')
              .on('click.fgButton', () => {
                let optionGroup = String(fgEl('.optionGroup').val());
                let optionDistance = parseFloat(fgEl('.optionDistance').val());
                let optionTime = parseFloat(fgEl('.optionTime').val());
                let optionLosses = fgEl('.optionLosses').prop('checked');
                let optionMaxloot = fgEl('.optionMaxloot').prop('checked');
                let optionNewbarbs = fgEl('.optionNewbarbs').prop('checked') || false;

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

                fgEl('.optionsContent').html(`
                  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;gap:14px;">
                    <div style="width:36px;height:36px;border:3px solid #2c2f3c;border-top:3px solid #f5a623;border-radius:50%;animation:fgSpin .8s linear infinite;"></div>
                    <span style="color:#8892a4;font-size:12px;">Recopilando datos...</span>
                  </div>
                  <style>@keyframes fgSpin{to{transform:rotate(360deg)}}</style>
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

            fgEl('.optionButton').focus();
          }, 100);
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
      .on('click', function () {
        if (
          game_data.market != 'nl' ||
          $(this).data('origin') == curVillage
        ) {
          sendFarm($(this));
        } else {
          UI.ErrorMessage(t.messages.villageError);
        }
      });

    $(document)
      .off('keydown')
      .on('keydown', (event) => {
        if ((event.keyCode || event.which) == 13) {
          $('.farmGod_icon').first().trigger('click');
        }
      });

    $('.switchVillage')
      .off('click')
      .on('click', function () {
        curVillage = $(this).data('id');
        UI.SuccessMessage(t.messages.villageChanged);
        $(this).closest('tr').remove();
      });
  };

  const injectFGCSS = function () {
    if (document.getElementById('fg-raba-style')) return;
    var s = document.createElement('style');
    s.id = 'fg-raba-style';
    s.textContent = `
/* === FarmGod Raba === */
#popup_box_FarmGod { width:520px !important; background:#1c1f27 !important; border:1px solid #2c2f3c !important; border-radius:14px !important; overflow:hidden !important; box-shadow:0 24px 64px rgba(0,0,0,.7) !important; }
#popup_box_FarmGod .popup_box_header { background:#13151c !important; border-bottom:1px solid #2c2f3c !important; padding:14px 18px !important; display:flex !important; align-items:center !important; gap:10px !important; }
#popup_box_FarmGod .popup_box_content { background:#1c1f27 !important; padding:0 !important; }

.fg-head { display:flex; align-items:center; gap:10px; }
.fg-head-icon { width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg,#f5a623,#e8700a); display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
.fg-head-title { font-size:16px; font-weight:700; color:#fff; }
.fg-head-sub { font-size:11px; color:#8892a4; margin-top:2px; }

.fg-body { padding:20px; display:flex; flex-direction:column; gap:14px; }

.fg-warn { background:#2a1f0e; border:1px solid #6b4c1a; border-radius:10px; padding:12px 14px; font-size:11px; color:#c8952a; line-height:1.6; }
.fg-warn b { color:#f5a623; }
.fg-warn img { width:100%; border-radius:6px; margin-top:8px; }

.fg-card { background:#252831; border:1px solid #2c2f3c; border-radius:10px; padding:14px 16px; display:flex; flex-direction:column; gap:10px; }
.fg-row { display:flex; align-items:center; justify-content:space-between; gap:12px; }
.fg-label { font-size:12px; color:#8892a4; font-weight:500; }
.fg-input { background:#1c1f27; border:1.5px solid #2c2f3c; border-radius:7px; color:#e2e8f0; font-size:13px; padding:7px 10px; outline:none; width:90px; transition:border-color .15s; }
.fg-input:focus { border-color:#f5a623; }
.fg-select { background:#1c1f27; border:1.5px solid #2c2f3c; border-radius:7px; color:#e2e8f0; font-size:13px; padding:7px 10px; outline:none; flex:1; transition:border-color .15s; }
.fg-select:focus { border-color:#f5a623; }

.fg-toggle { position:relative; width:40px; height:22px; flex-shrink:0; }
.fg-toggle input { opacity:0; width:0; height:0; }
.fg-toggle-slider { position:absolute; inset:0; background:#2c2f3c; border-radius:22px; cursor:pointer; transition:.2s; }
.fg-toggle-slider:before { content:""; position:absolute; width:16px; height:16px; left:3px; bottom:3px; background:#8892a4; border-radius:50%; transition:.2s; }
.fg-toggle input:checked + .fg-toggle-slider { background:linear-gradient(135deg,#f5a623,#e8700a); }
.fg-toggle input:checked + .fg-toggle-slider:before { transform:translateX(18px); background:#fff; }

.fg-divider { height:1px; background:#2c2f3c; }

.fg-btn { width:100%; padding:11px; border:none; border-radius:8px; font-size:14px; font-weight:700; cursor:pointer; background:linear-gradient(135deg,#f5a623,#e8700a); color:#1a0a00; transition:opacity .15s, transform .1s; }
.fg-btn:hover { opacity:.88; }
.fg-btn:active { transform:scale(.98); }

.fg-footer { padding:10px 20px; background:#13151c; border-top:1px solid #2c2f3c; font-size:11px; color:#8892a4; text-align:center; }

/* === Tabla de resultados === */
.fgRabaContent { background:#1c1f27; border:1px solid #2c2f3c; border-radius:14px; overflow:hidden; margin-bottom:14px; }
.fgRabaContent h4 { margin:0; padding:14px 18px; background:#13151c; border-bottom:1px solid #2c2f3c; font-size:15px; font-weight:700; color:#f5a623; display:flex; align-items:center; gap:8px; }
.fgRabaContent h4::before { content:""; display:inline-block; width:8px; height:8px; border-radius:50%; background:#f5a623; box-shadow:0 0 8px #f5a623; }
.fgRabaProgress { padding:10px 16px; background:#1c1f27; border-bottom:1px solid #2c2f3c; }
.fg-progress-wrap { height:8px; background:#2c2f3c; border-radius:8px; overflow:hidden; }
.fg-progress-bar { height:100%; background:linear-gradient(90deg,#f5a623,#e8700a); border-radius:8px; transition:width .3s; width:0%; }
.fg-progress-label { font-size:10px; color:#8892a4; margin-top:4px; text-align:right; }

.fgRabaContent table { width:100%; border-collapse:collapse; font-size:12px; }
.fgRabaContent table thead tr th, .fgRabaContent th { padding:9px 12px !important; background:#13151c !important; color:#f5a623 !important; font-size:10px !important; font-weight:700 !important; text-transform:uppercase !important; letter-spacing:.5px !important; border-bottom:1px solid #2c2f3c !important; border-right:none !important; border-left:none !important; text-align:center !important; }
.fgRabaContent td { padding:9px 12px; border-bottom:1px solid #1e2130; color:#e2e8f0; text-align:center; vertical-align:middle; }
.fgRabaContent tr.farmRow:hover td { background:rgba(245,166,35,.05); }
.fgRabaContent tr.fg-row-even td { background:#21242e; }
.fgRabaContent tr.fg-row-odd td { background:#191c24; }
.fgRabaContent a { color:#4f8ef7; text-decoration:none; }
.fgRabaContent a:hover { color:#f5a623; }
.fg-village-banner { background:#1e2130 !important; border-bottom:1px solid #2c2f3c !important; }
.fg-village-banner td { padding:8px 12px !important; }
.fg-switch-btn { padding:5px 12px; border:none; border-radius:6px; background:#252831; border:1px solid #2c2f3c; color:#e2e8f0; font-size:11px; font-weight:600; cursor:pointer; float:right; transition:border-color .15s; }
.fg-switch-btn:hover { border-color:#f5a623; color:#f5a623; }
.fg-empty { padding:30px !important; color:#8892a4; font-size:13px; }
.fg-dist { display:inline-block; padding:2px 8px; background:#252831; border:1px solid #2c2f3c; border-radius:20px; font-size:11px; color:#8892a4; }
.fgRabaContent .farmGod_icon { display:inline-block; cursor:pointer; vertical-align:middle; filter:drop-shadow(0 0 4px rgba(245,166,35,0.5)); transition:filter .15s, transform .15s; }
.fgRabaContent .farmGod_icon:hover { filter:drop-shadow(0 0 8px rgba(245,166,35,0.9)); transform:scale(1.15); }
.fgRabaContent td:last-child { text-align:center; padding:6px 12px !important; }
    `;
    document.head.appendChild(s);
  };

  const buildOptions = function () {
    injectFGCSS();
    let options = JSON.parse(localStorage.getItem('farmGod_options')) || {
      optionGroup: '0',
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
      return `
        <div class="fg-head" style="padding:14px 18px;background:#13151c;border-bottom:1px solid #2c2f3c;">
          <div class="fg-head-icon">&#x2694;</div>
          <div>
            <div class="fg-head-title">${t.options.title}</div>
            <div class="fg-head-sub">Tribal Wars &mdash; Script de farmeo automatizado &mdash; <span style="color:#f5a623;font-weight:700;">v1.2.5</span></div>
          </div>
        </div>
        <div class="fg-body optionsContent">
          ${checkboxError || templateError ? `
          <div class="fg-warn">
            ${t.options.warning}
            <img src="${t.options.filterImage}">
          </div>` : ''}

          <div class="fg-card">
            <div class="fg-row">
              <span class="fg-label">${t.options.group}</span>
              ${groupSelect.replace('class="optionGroup"', 'class="fg-select optionGroup"')}
            </div>
            <div class="fg-divider"></div>
            <div class="fg-row">
              <span class="fg-label">${t.options.distance}</span>
              <input type="text" class="fg-input optionDistance" value="${options.optionDistance}">
            </div>
            <div class="fg-divider"></div>
            <div class="fg-row">
              <span class="fg-label">${t.options.time}</span>
              <input type="text" class="fg-input optionTime" value="${options.optionTime}">
            </div>
            <div class="fg-divider"></div>
            <div class="fg-row">
              <span class="fg-label">${t.options.losses}</span>
              <label class="fg-toggle"><input type="checkbox" class="optionLosses" ${options.optionLosses ? 'checked' : ''}><span class="fg-toggle-slider"></span></label>
            </div>
            <div class="fg-divider"></div>
            <div class="fg-row">
              <span class="fg-label">${t.options.maxloot}</span>
              <label class="fg-toggle"><input type="checkbox" class="optionMaxloot" ${options.optionMaxloot ? 'checked' : ''}><span class="fg-toggle-slider"></span></label>
            </div>
            ${game_data.market == 'nl' ? `
            <div class="fg-divider"></div>
            <div class="fg-row">
              <span class="fg-label">${t.options.newbarbs}</span>
              <label class="fg-toggle"><input type="checkbox" class="optionNewbarbs" ${options.optionNewbarbs ? 'checked' : ''}><span class="fg-toggle-slider"></span></label>
            </div>` : ''}
          </div>

          <button class="fg-btn optionButton">${t.options.button}</button>
        </div>
        <div class="fg-footer">&#x2694;&#xFE0F; Creado por <strong>rabagalan73</strong> para la reina <strong>M0bscene</strong> &#x2694;&#xFE0F;</div>
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
          html += `<option value="${val.group_id}" ${String(val.group_id) === String(id) ? 'selected' : ''}>${val.name}</option>`;
        }
      });

      html += `</select>`;

      return html;
    });
  };

  const buildTable = function (plan) {
    let totalFarms = 0;
    for (let p in plan) totalFarms += plan[p].length;

    let rows = '';
    let rowIdx = 0;

    if (!$.isEmptyObject(plan)) {
      for (let prop in plan) {
        if (game_data.market == 'nl') {
          rows += `<tr class="fg-village-banner">
            <td colspan="4">
              <button class="fg-switch-btn switchVillage" data-id="${plan[prop][0].origin.id}">
                ${t.table.goTo}: ${plan[prop][0].origin.name} (${plan[prop][0].origin.coord})
              </button>
            </td>
          </tr>`;
        }
        plan[prop].forEach((val) => {
          let cls = rowIdx % 2 === 0 ? 'fg-row-even' : 'fg-row-odd';
          rowIdx++;
          rows += `<tr class="farmRow ${cls}">
            <td><a href="${game_data.link_base_pure}info_village&id=${val.origin.id}">${val.origin.name} <span style="color:#8892a4;">(${val.origin.coord})</span></a></td>
            <td><a href="${game_data.link_base_pure}info_village&id=${val.target.id}">${val.target.coord}</a></td>
            <td><span class="fg-dist">${val.fields.toFixed(1)}</span></td>
            <td><a href="#" data-origin="${val.origin.id}" data-target="${val.target.id}" data-template="${val.template.id}" class="farmGod_icon farm_icon farm_icon_${val.template.name}" style="margin:auto;display:inline-block;"></a></td>
          </tr>`;
        });
      }
    } else {
      rows = `<tr><td colspan="4" class="fg-empty">${t.table.noFarmsPlanned}</td></tr>`;
    }

    return `
    <div class="fgRabaContent">
      <h4>&#x2694; FarmGod</h4>
      <div class="fgRabaProgress">
        <div class="fg-progress-wrap">
          <div class="fg-progress-bar" id="FarmGodProgessbar" data-current="0" data-max="${totalFarms}"></div>
        </div>
        <div class="fg-progress-label" id="fg-progress-label">0 / ${totalFarms}</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>${t.table.origin}</th>
            <th>${t.table.target}</th>
            <th>${t.table.fields}</th>
            <th>${t.table.farm}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="fg-footer">&#x2694;&#xFE0F; Creado por <strong>rabagalan73</strong> para la reina <strong>M0bscene</strong> &#x2694;&#xFE0F;</div>
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
          $this.closest('.farmRow').remove();
          farmBusy = false;
        },
        function (r) {
          UI.ErrorMessage(r || t.messages.sendError);
          updateFGProgress();
          $this.closest('.farmRow').remove();
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