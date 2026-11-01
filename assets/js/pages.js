(function () {
  var AG = window.AG, h = AG.h, t = AG.t, L = AG.L, P = AG.pages;

  var lazyObs = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.style.setProperty('--img', 'url("' + e.target.getAttribute('data-img') + '")');
      lazyObs.unobserve(e.target);
    });
  }, { rootMargin: '300px' }) : null;
  function spr(sh, mw, mh, alt, up) {
    var el = AG.sprite(sh, mw, mh, alt, up);
    if (sh && lazyObs) {
      el.setAttribute('data-img', sh.s);
      el.style.removeProperty('--img');
      lazyObs.observe(el);
    }
    return el;
  }

  function qs(k) { var m = new RegExp('[?&]' + k + '=([^&#]*)').exec(location.search); return m ? decodeURIComponent(m[1]) : null; }
  function setQs(o) {
    var p = []; for (var k in o) if (o[k]) p.push(k + '=' + encodeURIComponent(o[k]));
    history.replaceState(null, '', location.pathname + (p.length ? '?' + p.join('&') : '') + location.hash);
  }
  function title(s) { document.title = s ? s + ' · Agriche Nexus' : 'Agriche Nexus · WorldBox & RimWorld mods'; }
  function ext(href, kids, cls) { return h('a', { class: cls || 'btn', href: href, target: '_blank', rel: 'noopener' }, kids); }
  function mods() { return AG.mods || []; }
  function gameName(g) { return (AG.GAMES[g] || {}).name || g; }
  function genTag(m) { return m.gen ? h('span', { class: 'tag gen', text: L(AG.GENS[m.gen]) }) : null; }
  function gameTag(m) { return h('span', { class: 'tag acc' }, h('span', { class: 'dot' }), gameName(m.game)); }
  function loaderTag(m) { return m.loader ? h('span', { class: 'tag', text: m.loader }) : null; }
  function verTag(m) { return h('span', { class: 'tag', text: (m.game === 'rimworld' ? 'RimWorld ' : 'WorldBox ') + L(m.gamever) }); }
  function codeName(s) { return /^[A-Z][a-z]?\d+$/.test(s); }

  function inline(s) {
    s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return s.replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }
  function md(src) {
    var out = [], list = null, para = [];
    function flush() {
      if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; }
      if (list) { out.push('</' + list + '>'); list = null; }
    }
    src.split(/\r?\n/).forEach(function (ln) {
      var m;
      if (!ln.trim()) { flush(); return; }
      if ((m = /^(#{1,4})\s+(.*)/.exec(ln))) { flush(); var lv = Math.min(4, m[1].length + 1); out.push('<h' + lv + '>' + inline(m[2]) + '</h' + lv + '>'); return; }
      if (/^---+$/.test(ln.trim())) { flush(); return; }
      if ((m = /^\s*[-*]\s+(.*)/.exec(ln)) || (m = /^\s*\d+\.\s+(.*)/.exec(ln))) {
        var tp = /^\s*\d/.test(ln) ? 'ol' : 'ul';
        if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; }
        if (list !== tp) { if (list) out.push('</' + list + '>'); out.push('<' + tp + '>'); list = tp; }
        out.push('<li>' + inline(m[1]) + '</li>'); return;
      }
      if (list) { out.push('</' + list + '>'); list = null; }
      para.push(ln.trim());
    });
    flush();
    return out.join('');
  }

  function card(m) {
    var art = h('img', { class: 'icon', src: m.icon, alt: m.name, onload: function (e) { if (e.target.naturalWidth > 160) e.target.classList.add('hd'); } });
    return h('a', { class: 'card reveal', href: AG.modUrl(m), 'data-game': m.game, 'data-gen': m.gen || null },
      h('span', { class: 'bar' }),
      h('div', { class: 'art' }, art),
      h('div', { class: 'bd' },
        h('h3', null, h('img', { class: 'mini', src: m.icon, alt: '' }), m.name),
        h('p', { text: L(m.tag) }),
        h('div', { class: 'meta' }, gameTag(m), genTag(m), loaderTag(m))));
  }

  function discordBtn(label) { return ext(AG.DISCORD, [AG.icon('discord'), h('span', { text: label || 'Discord' })]); }

  P.home = function (main) {
    title();
    var gz = AG.mod('godzilla');
    var all = mods();
    main.appendChild(h('section', { class: 'hero' }, h('div', { class: 'wrap' },
      h('div', null,
        h('span', { class: 'tag acc' }, h('span', { class: 'dot' }), t('Mod hub', 'Central de mods')),
        h('h1', { class: 'split', style: 'margin-top:18px' }, (t('Mods for|WorldBox and|RimWorld', 'Mods para|WorldBox e|RimWorld')).split('|').map(function (ln, i) { return h('span', { class: 'ln', style: '--i:' + i }, h('span', { text: ln })); })),
        h('p', { class: 'lead', text: t('Kaijus, devil fruits, isekai races, endless backrooms and whole civilizations. Every mod in one place, with direct downloads, guides and help.', 'Kaijus, akuma no mi, raças de isekai, backrooms sem fim e civilizações inteiras. Todos os mods num lugar só, com download direto, guias e ajuda.') }),
        h('div', { class: 'ctas' },
          h('a', { class: 'btn pri', href: '/Nexus/mods/' }, AG.icon('cube'), h('span', { text: t('Browse mods', 'Ver os mods') })),
          h('a', { class: 'btn', href: '/Nexus/guides/' }, AG.icon('book'), h('span', { text: t('How to install', 'Como instalar') })),
          discordBtn()),
        h('div', { class: 'stats' },
          h('div', { class: 'stat' }, h('b', { class: 'count', 'data-n': all.length, text: '0' }), h('span', { text: 'Mods' })),
          h('div', { class: 'stat' }, h('b', { class: 'count', 'data-n': 2, text: '0' }), h('span', { text: t('Games', 'Jogos') })),
          h('div', { class: 'stat' }, h('b', { class: 'count', 'data-n': 100, 'data-s': '%', text: '0%' }), h('span', { text: t('Free', 'Grátis') })),
          h('div', { class: 'stat' }, h('b', { text: 'EN · PT' }), h('span', { text: t('Languages', 'Idiomas') })))),
      gz && gz.scene ? AG.scene(gz.scene, 'Godzilla', t('Live preview', 'Prévia ao vivo')) : null)));
    var row = function () { return h('div', { class: 'mq-row' }, all.map(function (m) { return h('a', { href: AG.modUrl(m) }, h('img', { src: m.icon, alt: '' }), h('span', { text: m.name }), h('i', { text: gameName(m.game) })); })); };
    main.appendChild(h('div', { class: 'marquee', 'aria-hidden': 'true' }, h('div', { class: 'mq' }, row(), row())));
    main.querySelectorAll('.count').forEach(function (el) {
      var n = +el.getAttribute('data-n'), suf = el.getAttribute('data-s') || '', t0 = null;
      function step(ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / 1400); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))) + suf; if (k < 1) requestAnimationFrame(step); }
      setTimeout(function () { requestAnimationFrame(step); }, 500);
    });

    var games = h('div', { class: 'games' });
    Object.keys(AG.GAMES).forEach(function (g) {
      var G = AG.GAMES[g], list = all.filter(function (m) { return m.game === g; });
      games.appendChild(h('div', { class: 'panel hud game reveal', 'data-game': g },
        h('div', { class: 'gh' }, h('span', { class: 'gico' }, AG.icon(g === 'rimworld' ? 'planet' : 'globe')), h('b', { text: G.name }), h('span', { class: 'tag acc n', text: list.length + ' mods' })),
        h('div', { class: 'gb' },
          h('p', { class: 'mute', text: L(G.d) }),
          h('div', { class: 'gicons' }, list.slice(0, 8).map(function (m) { return h('a', { href: AG.modUrl(m), title: m.name }, h('img', { src: m.icon, alt: m.name })); })),
          h('a', { class: 'btn', href: '/Nexus/mods/?game=' + g }, h('span', { text: t('See ', 'Ver mods de ') + G.name }), AG.icon('arrow')))));
    });
    main.appendChild(h('section', null, h('div', { class: 'wrap' }, AG.secHead(t('Games', 'Jogos'), t('Pick your game', 'Escolha seu jogo')), games)));

    var feat = all.filter(function (m) { return m.gen !== 'legacy'; });
    main.appendChild(h('section', null, h('div', { class: 'wrap' },
      AG.secHead(t('Latest', 'Novidades'), t('Featured mods', 'Mods em destaque'), t('The newest mods for the current versions of the games.', 'Os mods mais novos para as versões atuais dos jogos.'),
        h('a', { class: 'btn', href: '/Nexus/mods/' }, h('span', { text: t('All mods', 'Todos os mods') }), AG.icon('arrow'))),
      h('div', { class: 'grid' }, feat.map(card)))));

    main.appendChild(h('section', null, h('div', { class: 'wrap' }, h('div', { class: 'panel hud cta reveal' },
      h('div', null,
        h('span', { class: 'k', text: t('Make your own', 'Faça o seu') }),
        h('h2', { text: 'Neo Mod Maker' }),
        h('p', { class: 'mute', text: t('Create WorldBox mods right in your browser: creatures, traits, items, buildings and more, with a sprite library and a pixel editor. No code needed.', 'Crie mods de WorldBox direto no navegador: criaturas, traços, itens, construções e mais, com biblioteca de sprites e editor de pixel. Sem precisar programar.') })),
      h('div', { class: 'ctas' },
        h('a', { class: 'btn pri', href: '/Nexus/neo-mod-maker/' }, AG.icon('spark'), h('span', { text: t('Learn more', 'Saiba mais') })),
        ext('https://agrichex.github.io/Neo-Mod-Maker/', [AG.icon('external'), h('span', { text: t('Open it', 'Abrir') })]))))));
  };

  P.mods = function (main) {
    title('Mods');
    var game = qs('game'), gen = qs('gen');
    var grid = h('div', { class: 'grid' }), bar = h('div', { class: 'filters' }), bar2 = h('div', { class: 'filters' });
    function chip(label, on, fn) { return h('button', { class: 'chip' + (on ? ' on' : ''), text: label, onclick: fn }); }
    function draw() {
      bar.innerHTML = ''; bar2.innerHTML = ''; grid.innerHTML = '';
      bar.appendChild(chip(t('All games', 'Todos os jogos'), !game, function () { game = null; gen = null; draw(); }));
      Object.keys(AG.GAMES).forEach(function (g) { bar.appendChild(chip(AG.GAMES[g].name, game === g, function () { game = g; if (g !== 'worldbox') gen = null; draw(); })); });
      if (game !== 'rimworld') {
        bar2.appendChild(chip(t('All versions', 'Todas as versões'), !gen, function () { gen = null; draw(); }));
        ['newgen', 'legacy'].forEach(function (g) { bar2.appendChild(chip(L(AG.GENS[g]), gen === g, function () { gen = g; draw(); })); });
      }
      var list = mods().filter(function (m) { return (!game || m.game === game) && (!gen || m.gen === gen); });
      list.forEach(function (m) { var c = card(m); c.classList.add('in'); grid.appendChild(c); });
      setQs({ game: game, gen: gen });
      document.body.setAttribute('data-game', game || 'worldbox');
    }
    main.appendChild(h('section', { class: 'mhead' }, h('div', { class: 'wrap' },
      AG.secHead(t('Library', 'Biblioteca'), t('All mods', 'Todos os mods'), t('New Gen mods run on the current WorldBox with NML. Legacy mods are for older versions of the game.', 'Os mods New Gen rodam no WorldBox atual com o NML. Os mods Legacy são para versões antigas do jogo.')),
      bar, bar2, grid)));
    draw();
  };

  var ANIM = { walk: ['Walk', 'Andar'], idle: ['Idle', 'Parado'], fly: ['Fly', 'Voar'], swim: ['Swim', 'Nadar'], attack: ['Attack', 'Ataque'], power: ['Power', 'Poder'], hurt: ['Hurt', 'Dano'], sleep: ['Sleep', 'Dormir'], death: ['Death', 'Morte'] };
  var TEMPER = { calm: ['Calm', 'Calmo'], territorial: ['Territorial', 'Territorial'], hunter: ['Hunter', 'Caçador'] };

  function kaijuCard(k) {
    var fi = k.forms.length > 1 ? Math.min(1, k.forms.length - 1) : 0, an = 'walk';
    k.forms.forEach(function (f, i) { if (f.id === 'main' || f.id === 'blue') fi = i; });
    var view = h('div', { class: 'view' }), forms = h('div', { class: 'forms' }), anims = h('div', { class: 'anims' }), holder = h('div', { class: 'hold' });
    view.appendChild(holder); view.appendChild(forms); view.appendChild(anims);
    var mv = h('div', { class: 'moves' });
    function draw() {
      var f = k.forms[fi];
      if (!f.a[an]) an = 'walk';
      holder.innerHTML = '';
      holder.appendChild(spr(f.a[an], 290, 128, L(k.n)));
      mv.innerHTML = '';
      k.moves.forEach(function (x) {
        var main = k.forms.filter(function (q) { return q.a[x.a]; })[0];
        mv.appendChild(main ? h('button', { class: an === x.a ? 'on' : null, title: t('Play this move', 'Ver este golpe'), onclick: function () { fi = k.forms.indexOf(main); an = x.a; draw(); } }, L(x)) : h('span', { text: L(x) }));
      });
      forms.innerHTML = ''; anims.innerHTML = '';
      if (k.forms.length > 1) k.forms.forEach(function (x, i) { forms.appendChild(h('button', { class: i === fi ? 'on' : null, text: L(x.n), onclick: function () { fi = i; draw(); } })); });
      Object.keys(ANIM).forEach(function (a) { if (f.a[a] && (a !== 'idle' || !f.a.sleep || true)) anims.appendChild(h('button', { class: a === an ? 'on' : null, text: L(ANIM[a]), onclick: function () { an = a; draw(); } })); });
    }
    draw();
    return h('div', { class: 'panel kj' + (k.star ? ' star hud' : ''), 'data-temper': k.temper },
      h('div', { class: 'top2' }, k.icon ? h('img', { src: k.icon, alt: '' }) : null,
        h('div', null, h('h3', { text: L(k.n) }), h('span', { class: 'id', text: k.forms.length + ' ' + t(k.forms.length > 1 ? 'forms' : 'form', k.forms.length > 1 ? 'formas' : 'forma') })),
        h('span', { class: 'tag t-' + k.temper, text: L(TEMPER[k.temper]) })),
      view,
      h('div', { class: 'bd' }, k.wild && L(k.wild) ? h('p', { text: L(k.wild) }) : null,
        mv,
        k.btn && k.btn.length ? h('div', { class: 'kbtn' }, h('span', { class: 'fl', text: t('Buttons', 'Botões') }), k.btn.map(function (b, i) { return h('span', { class: 'kb' }, h('img', { src: b, alt: '' }), i ? t('Wild', 'Selvagem') : t('Controlled', 'Controlado')); })) : null));
  }

  function kaijuSection(sec) {
    var G = AG.godzilla; if (!G) return;
    var f = 'all', q = '', grid = h('div', { class: 'kaijus' }), bar = h('div', { class: 'filters' });
    function draw() {
      bar.innerHTML = '';
      [['all', ['All', 'Todos']]].concat(Object.keys(TEMPER).map(function (k) { return [k, TEMPER[k]]; })).forEach(function (x) {
        bar.appendChild(h('button', { class: 'chip' + (f === x[0] ? ' on' : ''), text: L(x[1]), onclick: function () { f = x[0]; draw(); } }));
      });
      bar.appendChild(h('input', { class: 'search', type: 'search', placeholder: t('Search kaiju', 'Buscar kaiju'), value: q, oninput: function (e) { q = e.target.value.toLowerCase(); fill(); } }));
      fill();
    }
    function fill() {
      grid.innerHTML = '';
      G.kaiju.filter(function (k) { return (f === 'all' || k.temper === f) && (!q || L(k.n).toLowerCase().indexOf(q) >= 0); }).forEach(function (k) { grid.appendChild(kaijuCard(k)); });
    }
    draw();
    sec.appendChild(h('div', { class: 'group', id: 'kaijus' },
      h('h3', null, t('Godzilla and the kaijus', 'Godzilla e os kaijus'), h('span', { class: 'n', text: G.kaiju.length })),
      h('p', { text: t('Every monster with its forms and animations. Pick a form or an animation on each card. Calm kaijus hibernate, territorial ones defend their area and hunters go after prey.', 'Todos os monstros com suas formas e animações. Escolha uma forma ou uma animação em cada card. Os kaijus calmos hibernam, os territoriais defendem a área e os caçadores vão atrás de presas.') }),
      bar, grid));
    sec.appendChild(h('div', { class: 'group', id: 'controls' },
      h('h3', { text: t('Controls', 'Controles') }),
      h('div', { class: 'panel', style: 'padding:6px 4px' }, h('table', { class: 't' },
        h('thead', null, h('tr', null, h('th', { text: t('Key', 'Tecla') }), h('th', { text: t('Action', 'Ação') }))),
        h('tbody', null, G.controls.map(function (c) {
          return h('tr', null, h('td', null, L(c.k).split(/\s*\/\s*|\s*,\s*/).map(function (x, i) { return [i ? ' ' : null, h('kbd', { text: x })]; })), h('td', { text: L(c.d) }));
        })))),
      G.mobile ? h('div', { class: 'tip' }, h('b', { text: t('On a touch screen: ', 'Na tela de toque: ') }), L(G.mobile)) : null));
  }


  function aicon(at, i, size) {
    var k = size / at.cw, el = h('span', { class: 'aic', role: 'img' });
    el.style.cssText = 'width:' + size + 'px;height:' + (at.ch * k) + 'px;background-image:url("' + at.s + '");background-size:' + (at.cols * at.cw * k) + 'px auto;background-position:-' + ((i % at.cols) * at.cw * k) + 'px -' + (Math.floor(i / at.cols) * at.ch * k) + 'px';
    return el;
  }
  var ROMAN = ['', 'I', 'II', 'III', 'IV', 'V'];
  function galBlock(g) {
    return h('div', { class: 'group', id: g.id }, h('h3', null, L(g.t), h('span', { class: 'n', text: g.items.length })), g.d ? h('p', { text: L(g.d) }) : null,
      h('div', { class: 'gal' }, g.items.map(function (it) { return h('a', { href: it.img, target: '_blank', rel: 'noopener', class: 'gi', style: 'aspect-ratio:' + it.w + '/' + it.h }, h('img', { src: it.img, alt: '', loading: 'lazy' })); })));
  }
  function catBlock(g, at) {
    var view = g.view || 'card', st = { q: '' }, shown = g.page || 1e9;
    (g.filters || []).forEach(function (f) { st[f.k] = f.def || null; });
    var bar = h('div', { class: 'cfil' }), grid = h('div', { class: 'cgrid v-' + view }), more = h('div', { class: 'cmore' }), cnt = h('span', { class: 'ccount' });
    function art(it, big) {
      if (it.s) return spr(it.s, big ? 150 : 96, big ? 110 : 72, L(it.n));
      if (it.ic != null && at) return aicon(at, it.ic, view === 'mini' ? 42 : 56);
      return null;
    }
    function itemEl(it) {
      if (view === 'mini') return h('div', { class: 'ci vw-mini', title: L(it.n) + (it.d ? ' · ' + L(it.d) : '') }, h('div', { class: 'cbox' }, art(it)), h('span', { class: 'cn', text: L(it.n) }), it.lv > 1 ? h('i', { class: 'lv', text: ROMAN[1] + '–' + ROMAN[it.lv] }) : null, it.rare ? h('i', { class: 'rare', text: t('Rare', 'Rara') }) : null);
      var box = h('div', { class: 'cbox' }, art(it, view === 'unit'));
      var vb = null;
      if (it.v) vb = h('div', { class: 'cvar' }, it.v.map(function (v, k) {
        return h('button', { class: k ? null : 'on', text: L(v.n), onclick: function (e) { box.innerHTML = ''; box.appendChild(spr(v.s, 96, 72, L(it.n))); vb.querySelectorAll('button').forEach(function (b) { b.classList.remove('on'); }); e.target.classList.add('on'); } });
      }));
      return h('div', { class: 'panel ci vw-' + view }, box, h('div', { class: 'cb' }, h('h4', { text: L(it.n) }), it.d ? h('p', { text: L(it.d) }) : null,
        it.st ? h('div', { class: 'cst' }, it.st.map(function (x) { return h('span', null, h('i', { text: L(x[0]) }), String(x[1])); })) : null, vb));
    }
    function list() {
      return g.items.filter(function (it) {
        for (var k in st) { if (k === 'q' || !st[k]) continue; if (!it.tg || it.tg[k] !== st[k]) return false; }
        return !st.q || L(it.n).toLowerCase().indexOf(st.q) >= 0;
      });
    }
    function fill() {
      var l = list(); grid.innerHTML = ''; more.innerHTML = '';
      l.slice(0, shown).forEach(function (it) { grid.appendChild(itemEl(it)); });
      cnt.textContent = l.length + ' / ' + g.items.length;
      if (l.length > shown) more.appendChild(h('button', { class: 'btn', onclick: function () { shown += g.page; fill(); } }, h('span', { text: t('Show more', 'Mostrar mais') + ' (' + (l.length - shown) + ')' })));
    }
    function drawBar() {
      bar.innerHTML = '';
      (g.filters || []).forEach(function (f) {
        var row = h('div', { class: 'frow' }, h('span', { class: 'fl', text: L(f.t) }));
        var all = h('button', { class: 'chip' + (!st[f.k] ? ' on' : ''), text: t('All', 'Todos'), onclick: function () { st[f.k] = null; shown = g.page || 1e9; drawBar(); fill(); } });
        if (!f.def) row.appendChild(all);
        f.o.forEach(function (o) {
          row.appendChild(h('button', { class: 'chip' + (st[f.k] === o[0] ? ' on' : ''), onclick: function () { st[f.k] = st[f.k] === o[0] && !f.def ? null : o[0]; shown = g.page || 1e9; drawBar(); fill(); } },
            o[2] != null && at ? aicon(at, o[2], 18) : null, L(o[1])));
        });
        bar.appendChild(row);
      });
      if (g.search || g.items.length > 30) bar.appendChild(h('div', { class: 'frow' }, h('input', { class: 'search', type: 'search', value: st.q, placeholder: t('Search', 'Buscar') + ' ' + L(g.t).toLowerCase(), oninput: function (e) { st.q = e.target.value.toLowerCase(); shown = g.page || 1e9; fill(); } }), cnt));
    }
    drawBar(); fill();
    return h('div', { class: 'group', id: g.id }, h('h3', null, L(g.t), h('span', { class: 'n', text: g.items.length })), g.d ? h('p', { text: L(g.d) }) : null, bar, grid, more);
  }

  function groupBlock(g) {
    var head = h('h3', null, L(g.t), h('span', { class: 'n', text: g.items.length }));
    var wrap = h('div', { class: 'group reveal', id: g.id }, head, g.d ? h('p', { text: L(g.d) }) : null);
    var fit = g.fit || 96;
    if (g.kind === 'text') {
      wrap.appendChild(h('div', { class: 'panel' }, g.items.map(function (it) { return h('div', { class: 'qa' }, h('h4', { text: L(it.n) }), it.d ? h('p', { text: L(it.d) }) : null); })));
    } else if (g.kind === 'cards') {
      wrap.appendChild(h('div', { class: 'igrid' }, g.items.map(function (it) {
        return h('div', { class: 'panel icard' }, h('div', { class: 'box' }, spr(it.s, Math.max(fit, 72), Math.max(fit, 72), L(it.n))),
          h('div', null, h('h4', { text: L(it.n) }), it.d ? h('p', { text: L(it.d) }) : null));
      })));
    } else if (g.kind === 'ladder') {
      wrap.appendChild(h('ol', { class: 'ladder' }, g.items.map(function (it, i) {
        return h('li', { class: 'panel' }, h('span', { class: 'lv', text: String(i + 1).padStart(2, '0') }), h('div', { class: 'box' }, spr(it.s, 56, 56, L(it.n))),
          h('div', null, h('h4', { text: L(it.n) }), it.d ? h('p', { text: L(it.d) }) : null));
      })));
    } else if (g.kind === 'races') {
      wrap.appendChild(h('div', { class: 'races' }, g.items.map(function (it) {
        return h('div', { class: 'panel race' },
          h('div', { class: 'rh' }, it.icon ? spr(it.icon, 28, 28, '') : null, h('h4', { text: L(it.n) })),
          h('div', { class: 'rb' }, it.s ? h('figure', null, spr(it.s, 120, 110, ''), h('figcaption', { text: t('Hall', 'Salão') })) : null,
            it.s2 ? h('figure', null, spr(it.s2, 80, 80, ''), h('figcaption', { text: t('House', 'Casa') })) : null));
      })));
    } else {
      wrap.appendChild(h('div', { class: 'strip' }, g.items.map(function (it) {
        var nm = L(it.n);
        return h('div', { class: 'spr', title: nm }, h('div', { class: 'box' }, spr(it.s, 130, Math.min(110, fit + 14), nm)), codeName(nm) ? null : h('span', { text: nm }));
      })));
    }
    return wrap;
  }

  function installSteps(m) {
    var steps = [];
    if (m.game === 'rimworld') {
      steps.push([t('Install the required mods: ', 'Instale os mods obrigatórios: '), (m.req || []).map(function (r, i) { return [i ? ', ' : null, h('a', { href: r.u, target: '_blank', rel: 'noopener', text: r.n })]; })]);
      steps.push([t('Download ', 'Baixe o '), h('b', { text: m.zip + '.zip' }), t(' with the button above', ' pelo botão acima'), m.steam ? [t(', or subscribe on the ', ', ou inscreva-se na '), h('a', { href: AG.steamUrl(m), target: '_blank', rel: 'noopener', text: t('Steam Workshop', 'Oficina da Steam') })] : null, '.']);
      steps.push([t('Extract it into the Mods folder of your RimWorld installation, so you get ', 'Extraia na pasta Mods da sua instalação do RimWorld, para ficar '), h('code', { text: m.path }), '.']);
      steps.push(t('Turn it on in the mod list and load it after its required mods.', 'Ative na lista de mods e carregue depois dos mods obrigatórios.'));
    } else {
      steps.push(m.loader === 'NML'
        ? [t('Install ', 'Instale o '), h('a', { href: AG.NML_URL, target: '_blank', rel: 'noopener', text: 'NML (Neo Mod Loader)' }), t(' for WorldBox ', ' para o WorldBox ') + L(m.gamever).toLowerCase() + '.']
        : [t('Install NCMS for WorldBox ', 'Instale o NCMS para o WorldBox ') + L(m.gamever) + '.']);
      steps.push([t('Download ', 'Baixe o '), h('b', { text: m.zip + '.zip' }), t(' with the button above.', ' pelo botão acima.')]);
      steps.push([t('Extract it into the Mods folder of your WorldBox installation, so you get ', 'Extraia na pasta Mods da sua instalação do WorldBox, para ficar '), h('code', { text: m.path }), '.']);
      steps.push(t('Start the game.', 'Abra o jogo.'));
    }
    return h('ol', { class: 'steps' }, steps.map(function (s) { return h('li', null, s); }));
  }

  function readmeBlock(m) {
    var src = m.readme, parts = src.split(/\n## Português \(Brasil\)\s*\n/);
    var body = AG.lang === 'pt' && parts[1] ? parts[1] : parts[0].split(/\n## English\s*\n/).pop();
    body = body.replace(/\*\*\[BOT INVITE LINK\]\*\*|\[BOT INVITE LINK\]/g, t('coming soon', 'em breve'));
    return h('div', { class: 'panel md', html: md(body) });
  }

  P.mod = function (main, ds) {
    var m = AG.mod(ds.mod);
    if (!m) return P.notfound(main);
    title(m.name);
    document.body.setAttribute('data-game', m.game);
    if (m.gen) document.body.setAttribute('data-gen', m.gen);
    var right;
    if (m.scene) right = AG.scene(m.scene, m.name, t('Live preview', 'Prévia ao vivo'));
    else if (m.hero) right = h('div', { class: 'stage hud' }, h('img', { class: 'shot', src: m.hero, alt: m.name }), h('div', { class: 'scan' }));
    else right = h('div', { class: 'stage hud solo' }, h('div', { class: 'scan' }), m.cover ? AG.sprite(m.cover, 260, 220, m.name) : h('img', { class: 'big', src: m.icon, alt: m.name }));
    var notices = [];
    if (m.notice) notices.push(h('div', { class: 'notice' }, AG.icon('shield'), h('div', null, /^(Read|Leia)/.test(L(m.notice)) ? null : h('b', { text: t('Read first. ', 'Leia antes. ') }), L(m.notice))));
    if (m.gen === 'legacy') notices.push(h('div', { class: 'notice info' }, AG.icon('bolt'), h('div', null, h('b', { text: 'Legacy. ' }), t('Made for WorldBox ' + L(m.gamever) + '. It does not run on the current version of the game.', 'Feito para o WorldBox ' + L(m.gamever) + '. Ele não roda na versão atual do jogo.'))));
    main.appendChild(h('section', { class: 'mhero' }, h('div', { class: 'wrap' },
      h('div', null,
        h('div', { class: 'crumb' }, h('a', { href: '/Nexus/mods/', text: 'Mods' }), ' / ', h('a', { href: '/Nexus/mods/?game=' + m.game, text: gameName(m.game) }), ' / ', m.name),
        h('div', { class: 'ttl' }, h('img', { src: m.icon, alt: '' }), h('h1', { text: m.name })),
        h('div', { class: 'tags' }, gameTag(m), genTag(m), loaderTag(m), verTag(m), h('span', { class: 'tag', text: 'v' + m.ver })),
        h('p', { class: 'lead', text: L(m.tag) }),
        h('p', { class: 'mute', text: L(m.about) }),
        h('div', { class: 'ctas' }, AG.dlButton(m, false),
          ext(AG.repoUrl(m), [AG.icon('github'), h('span', { text: 'GitHub' })]),
          m.steam ? ext(AG.steamUrl(m), [AG.icon('steam'), h('span', { text: 'Steam' })]) : null),
        notices),
      right)));

    var toc = [['features', t('Features', 'Recursos')]];
    if (m.detail === 'godzilla') toc.push(['kaijus', 'Kaijus'], ['controls', t('Controls', 'Controles')]);
    (m.groups || []).forEach(function (g) { toc.push([g.id, L(g.t)]); });
    if (m.eras) toc.push(['eras', t('Eras', 'Eras')]);
    if (m.readme) toc.push(['setup', t('Setup', 'Configuração')]);
    if (m.names) toc.push(['names', t('Names', 'Nomes')]);
    if (m.config && m.config.length) toc.push(['settings', t('Settings', 'Configurações')]);
    toc.push(['install', t('Install', 'Instalar')], ['help', t('Help', 'Ajuda')]);
    var sec = h('section', { class: 'mbody' }, h('div', { class: 'wrap' }));
    var w = sec.firstChild;
    w.appendChild(h('nav', { class: 'toc' }, toc.map(function (x) { return h('a', { href: '#' + x[0], text: x[1] }); })));

    w.appendChild(h('div', { class: 'group', id: 'features' }, h('h3', { text: t('What it adds', 'O que o mod adiciona') }),
      h('div', { class: 'feats' }, (m.feats || []).map(function (f) { return h('div', { class: 'panel feat reveal' }, h('div', { class: 'ic' }, AG.icon(f.i)), h('p', { text: L(f.d) })); }))));
    if (m.detail === 'godzilla') {
      kaijuSection(w);
      if (m.hero) w.appendChild(h('div', { class: 'group reveal' }, h('h3', { text: t('In game', 'No jogo') }), h('div', { class: 'stage hud wide' }, h('img', { class: 'shot', src: m.hero, alt: 'Godzilla' }))));
    }
    (m.groups || []).forEach(function (g) { w.appendChild(g.kind === 'cat' ? catBlock(g, m.atlas) : g.kind === 'gallery' ? galBlock(g) : groupBlock(g)); });
    if (m.eras) w.appendChild(h('div', { class: 'group reveal', id: 'eras' }, h('h3', null, t('Eras', 'Eras'), h('span', { class: 'n', text: m.eras.length })),
      h('p', { text: t('Kingdoms research their way through every era, from stone tools to the space age.', 'Os reinos pesquisam passando por todas as eras, das ferramentas de pedra à era espacial.') }),
      h('div', { class: 'eras' }, m.eras.map(function (e, i) { return h('span', { class: 'era' }, h('i', { text: String(i + 1).padStart(2, '0') }), L(e)); }))));
    if (m.readme) w.appendChild(h('div', { class: 'group', id: 'setup' }, h('h3', { text: t('Setup guide', 'Guia de configuração') }), readmeBlock(m)));
    if (m.names) w.appendChild(h('div', { class: 'group reveal', id: 'names' }, h('h3', { text: t('Name lists', 'Listas de nomes') }),
      h('p', { text: t('Categories that get Brazilian names.', 'Categorias que ganham nomes brasileiros.') }),
      h('div', { class: 'eras' }, m.names.map(function (n) { return h('span', { class: 'era', text: n }); }))));
    if (m.config && m.config.length) w.appendChild(h('div', { class: 'group', id: 'settings' }, h('h3', { text: t('Settings', 'Configurações') }),
      h('p', { text: t('Everything you can change in the mod settings, with the default value.', 'Tudo que dá para mudar nas configurações do mod, com o valor padrão.') }),
      m.config.map(function (g) {
        var hasD = g.rows.some(function (r) { return L(r.d) && L(r.d) !== L(r.n); });
        return h('div', { class: 'panel cfg' }, h('h4', { text: L(g.g) }), h('table', { class: 't' },
          h('thead', null, h('tr', null, h('th', { text: t('Setting', 'Opção') }), h('th', { text: t('Default', 'Padrão') }), hasD ? h('th', { text: t('What it does', 'O que faz') }) : null)),
          h('tbody', null, g.rows.map(function (r) { return h('tr', null, h('td', null, h('span', { class: 'cfgn' }, r.ic != null && m.atlas ? aicon(m.atlas, r.ic, 28) : null, h('b', { text: L(r.n) }))), h('td', null, h('span', { class: 'val', text: L(r.v) })), hasD ? h('td', { class: 'mute', text: L(r.d) !== L(r.n) ? L(r.d) : '' }) : null); }))));
      })));
    w.appendChild(h('div', { class: 'group', id: 'install' }, h('h3', { text: t('How to install', 'Como instalar') }),
      h('div', { class: 'dl panel hud' }, installSteps(m), h('div', { class: 'dlc' }, AG.dlButton(m, true), h('span', { class: 'mute mono', text: m.zip + '.zip · v' + m.ver })))));
    w.appendChild(h('div', { class: 'group', id: 'help' }, h('h3', { text: t('Help', 'Ajuda') }),
      h('div', { class: 'helpg' },
        h('a', { class: 'panel feat hl', href: '/Nexus/forum/?mod=' + m.id }, h('div', { class: 'ic' }, AG.icon('book')), h('div', null, h('h3', { text: t('Help forum', 'Fórum de ajuda') }), h('p', { text: t('Answers about installing, settings and common problems for ' + m.name + '.', 'Respostas sobre instalação, configurações e problemas comuns do ' + m.name + '.') }))),
        h('a', { class: 'panel feat hl', href: AG.DISCORD, target: '_blank', rel: 'noopener' }, h('div', { class: 'ic' }, AG.icon('discord')), h('div', null, h('h3', { text: 'Discord' }), h('p', { text: t('Questions and bug reports go to the Agriche Community.', 'Dúvidas e bugs vão para a Agriche Community.') }))))));
    var rel = (m.related || []).map(AG.mod).filter(Boolean);
    if (!rel.length) rel = mods().filter(function (x) { return x.id !== m.id && x.game === m.game && x.gen === m.gen; }).slice(0, 3);
    if (rel.length) w.appendChild(h('div', { class: 'group' }, h('h3', { text: t('See also', 'Veja também') }), h('div', { class: 'grid' }, rel.map(card))));
    main.appendChild(sec);
  };

  function modTopics(m) {
    var sec = [m.name, m.name], out = [];
    out.push({ id: 'overview', icon: 'cube', sec: sec, t: ['What it adds', 'O que adiciona'], intro: [m.tag.en + ' ' + m.about.en, m.tag.pt + ' ' + m.about.pt],
      f: (m.feats || []).map(function (f) { return [null, [f.d.en, f.d.pt]]; }), link: [AG.modUrl(m), ['Open the mod page', 'Abrir a página do mod']] });
    if (m.notice) out.push({ id: 'first', icon: 'shield', sec: sec, t: ['Read first', 'Leia antes'], intro: [m.notice.en, m.notice.pt], f: [] });
    out.push({ id: 'install', icon: 'download', sec: sec, t: ['How to install', 'Como instalar'],
      intro: m.game === 'rimworld' ? ['Needs ' + (m.req || []).map(function (r) { return r.n; }).join(' and ') + '.', 'Precisa de ' + (m.req || []).map(function (r) { return r.n; }).join(' e ') + '.'] : ['Runs on WorldBox ' + m.gamever.en.toLowerCase() + ' with ' + m.loader + '.', 'Roda no WorldBox ' + m.gamever.pt.toLowerCase() + ' com ' + m.loader + '.'],
      f: [[['Folder', 'Pasta'], ['After extracting, you should have ' + m.path + '.', 'Depois de extrair, deve ficar ' + m.path + '.']],
          [['File', 'Arquivo'], ['The download is ' + m.zip + '.zip, version ' + m.ver + '.', 'O download é ' + m.zip + '.zip, versão ' + m.ver + '.']]],
      steps: m, link: [AG.modUrl(m) + '#install', ['Install steps on the mod page', 'Passos na página do mod']] });
    if (m.detail === 'godzilla' && AG.godzilla) out.push({ id: 'controls', icon: 'gamepad', sec: sec, t: ['Controls', 'Controles'],
      intro: ['How to control a kaiju with the keyboard and mouse.', 'Como controlar um kaiju com teclado e mouse.'],
      f: AG.godzilla.controls.map(function (c) { return [[c.k.en, c.k.pt], [c.d.en, c.d.pt]]; }), tips: AG.godzilla.mobile ? [[AG.godzilla.mobile.en, AG.godzilla.mobile.pt]] : null });
    if (m.readme) out.push({ id: 'setup', icon: 'chat', sec: sec, t: ['Linking Discord and Twitch', 'Ligando Discord e Twitch'],
      intro: ['The full setup guide is on the mod page: adding the bot, pairing your world with /pair generate, and the first commands for players.', 'O guia completo está na página do mod: adicionar o bot, parear seu mundo com /pair generate e os primeiros comandos dos jogadores.'],
      f: [], link: [AG.modUrl(m) + '#setup', ['Open the setup guide', 'Abrir o guia de configuração']] });
    if (m.config && m.config.length) m.config.forEach(function (g, i) {
      out.push({ id: 'settings' + (i ? '-' + i : ''), icon: 'sliders', sec: sec, t: [g.g.en === m.name ? 'Settings' : 'Settings: ' + g.g.en, g.g.pt === m.name ? 'Configurações' : 'Configurações: ' + g.g.pt],
        intro: ['These are in the mod settings, with their default values.', 'Estas ficam nas configurações do mod, com os valores padrão.'],
        f: g.rows.map(function (r) { var v = typeof r.v === 'string' ? [r.v, r.v] : [r.v.en, r.v.pt]; return [[r.n.en, r.n.pt], [(r.d.en && r.d.en !== r.n.en ? r.d.en + '. ' : '') + 'Default: ' + v[0], (r.d.pt && r.d.pt !== r.n.pt ? r.d.pt + '. ' : '') + 'Padrão: ' + v[1]]]; }) });
    });
    return out;
  }

  P.forum = function (main) {
    title(t('Help forum', 'Fórum de ajuda'));
    var mod = qs('mod'), tid = qs('t');
    var side = h('aside', { class: 'panel side' }), body = h('div', { class: 'panel main hud' });
    function topics() { var m = AG.mod(mod); return (m ? modTopics(m) : []).concat(AG.general.map(function (x) { var o = {}; for (var k in x) o[k] = x[k]; o.sec = ['General · ' + x.sec[0], 'Geral · ' + x.sec[1]]; return o; })); }
    function draw() {
      var m = AG.mod(mod), list = topics();
      document.body.setAttribute('data-game', m ? m.game : 'worldbox');
      var cur = list.filter(function (x) { return x.id === tid; })[0] || list[0];
      tid = cur.id;
      setQs({ mod: mod, t: tid });
      side.innerHTML = '';
      var sel = h('select', { 'aria-label': t('Mod', 'Mod'), onchange: function (e) { mod = e.target.value || null; tid = null; draw(); } },
        h('option', { value: '', text: t('General questions', 'Dúvidas gerais') }),
        Object.keys(AG.GAMES).map(function (g) {
          return h('optgroup', { label: AG.GAMES[g].name }, mods().filter(function (x) { return x.game === g; }).map(function (x) { var o = h('option', { value: x.id, text: x.name }); if (x.id === mod) o.selected = true; return o; }));
        }));
      side.appendChild(sel);
      var last = null;
      list.forEach(function (x) {
        var s = L(x.sec);
        if (s !== last) { side.appendChild(h('div', { class: 'sec', text: s })); last = s; }
        side.appendChild(h('a', { href: '?' + (mod ? 'mod=' + mod + '&' : '') + 't=' + x.id, class: x === cur ? 'on' : null, onclick: function (e) { e.preventDefault(); tid = x.id; draw(); if (window.innerWidth < 920) body.scrollIntoView({ behavior: 'smooth' }); } }, h('span', { class: 'fi' }, AG.icon(x.icon || 'chat')), L(x.t)));
      });
      body.innerHTML = '';
      body.appendChild(h('span', { class: 'k', text: L(cur.sec) }));
      body.appendChild(h('h2', { text: L(cur.t) }));
      if (cur.intro) body.appendChild(h('p', { class: 'lead', text: L(cur.intro) }));
      if (cur.steps) body.appendChild(installSteps(cur.steps));
      (cur.f || []).forEach(function (f) { body.appendChild(h('div', { class: 'qa' }, f[0] ? h('h4', { text: L(f[0]) }) : null, h('p', { text: L(f[1]) }))); });
      (cur.tips || []).forEach(function (x) { body.appendChild(h('div', { class: 'tip' }, h('b', { text: t('Tip: ', 'Dica: ') }), L(x))); });
      if (cur.link) body.appendChild(h('p', { style: 'margin-top:18px' }, h('a', { class: 'btn', href: cur.link[0] }, h('span', { text: L(cur.link[1]) }), AG.icon('arrow'))));
      body.appendChild(h('div', { class: 'ask' }, h('div', null, h('b', { text: t('Did not find your answer?', 'Não achou sua resposta?') }), h('p', { class: 'mute', text: t('Ask on Discord. Say which game version and mod version you use.', 'Pergunte no Discord. Diga qual versão do jogo e do mod você usa.') })), discordBtn(t('Ask on Discord', 'Perguntar no Discord'))));
    }
    main.appendChild(h('section', { class: 'mhead' }, h('div', { class: 'wrap' },
      AG.secHead(t('Support', 'Suporte'), t('Help forum', 'Fórum de ajuda'), t('Pick a mod at the top of the list to see its own topics.', 'Escolha um mod no topo da lista para ver os tópicos dele.')),
      h('div', { class: 'forum' }, side, body))));
    draw();
  };

  P.guides = function (main) {
    title(t('Guides', 'Guias'));
    var modGuides = [
      ['godzilla', 'controls', 'gamepad', ['Godzilla: controls', 'Godzilla: controles'], ['Every key and how to control a kaiju.', 'Todas as teclas e como controlar um kaiju.']],
      ['chat-realms', 'setup', 'chat', ['ChatRealms: linking Discord', 'ChatRealms: ligando o Discord'], ['Pair your world with your server and the first player commands.', 'Pareie seu mundo com o servidor e os primeiros comandos dos jogadores.']],
      ['endless-rooms', 'install', 'door', ['Endless Rooms: first steps', 'Endless Rooms: primeiros passos'], ['Requirements, the Map Marker and keeping your maps.', 'Requisitos, o Map Marker e como manter seus mapas.']],
      ['civilizations', 'settings', 'sliders', ['Civilizations: settings', 'Civilizations: configurações'], ['Research pace and every option of the mod.', 'Ritmo da pesquisa e todas as opções do mod.']],
      ['ocean-of-souls', 'souls', 'spark', ['Ocean of Souls: soul levels', 'Ocean of Souls: níveis de alma'], ['From Mortal Soul to the top of the ladder.', 'Da Alma Mortal ao topo da escada.']]
    ].filter(function (x) { return AG.mod(x[0]); });
    main.appendChild(h('section', { class: 'mhead' }, h('div', { class: 'wrap' },
      AG.secHead(t('Guides', 'Guias'), t('Guides and tutorials', 'Guias e tutoriais'), t('Start here if it is your first mod. Each mod page also has its own install steps.', 'Comece aqui se for seu primeiro mod. Cada página de mod também tem os próprios passos de instalação.')),
      h('div', { class: 'feats' }, AG.general.map(function (g) {
        return h('a', { class: 'panel feat hl reveal', href: '#' + g.id }, h('div', { class: 'ic' }, AG.icon(g.icon)), h('div', null, h('h3', { text: L(g.t) }), h('p', { text: L(g.intro) })));
      })),
      h('div', { class: 'group' }, h('h3', { text: t('Mod guides', 'Guias dos mods') }),
        h('div', { class: 'feats' }, modGuides.map(function (x) {
          var m = AG.mod(x[0]);
          return h('a', { class: 'panel feat hl reveal', href: AG.modUrl(m) + '#' + x[1], 'data-game': m.game }, h('div', { class: 'ic' }, h('img', { src: m.icon, alt: '' })), h('div', null, h('h3', { text: L(x[3]) }), h('p', { text: L(x[4]) })));
        }))),
      AG.general.map(function (g) {
        return h('article', { class: 'panel guide reveal', id: g.id },
          h('span', { class: 'k', text: L(g.sec) }), h('h2', { text: L(g.t) }), h('p', { class: 'lead', text: L(g.intro) }),
          g.id === 'install-worldbox' ? h('p', null, t('NML: ', 'NML: '), h('a', { href: AG.NML_URL, target: '_blank', rel: 'noopener', text: AG.NML_URL.replace('https://', '') })) : null,
          h('ol', { class: 'steps' }, g.f.map(function (f) { return h('li', null, h('b', { text: L(f[0]) + '. ' }), L(f[1])); })),
          (g.tips || []).map(function (x) { return h('div', { class: 'tip' }, h('b', { text: t('Tip: ', 'Dica: ') }), L(x)); }));
      }))));
  };

  P.nmm = function (main) {
    title('Neo Mod Maker');
    var url = 'https://agrichex.github.io/Neo-Mod-Maker/';
    var F = [
      ['cube', ['No install, no code', 'Sem instalar, sem programar'], ['Runs in the browser. Fill in pages and it writes the C# files, the translations and the images for you.', 'Roda no navegador. Você preenche páginas e ele escreve os arquivos C#, as traduções e as imagens por você.']],
      ['users', ['Everything a mod needs', 'Tudo que um mod precisa'], ['Creatures, races, traits, items, buildings, projectiles, effects, powers and more.', 'Criaturas, raças, traços, itens, construções, projéteis, efeitos, poderes e mais.']],
      ['star', ['Sprite library', 'Biblioteca de sprites'], ['Sprites from WorldBox and from the original mods, free to use in your own mods.', 'Sprites do WorldBox e dos mods originais, livres para usar nos seus mods.']],
      ['spark', ['Pixel editor and animations', 'Editor de pixel e animações'], ['Draw your own sprites and frames, or generate animations automatically.', 'Desenhe seus sprites e quadros, ou gere animações automaticamente.']],
      ['globe', ['Every language', 'Todos os idiomas'], ['Write your mod text in every language WorldBox supports. English is required.', 'Escreva os textos do mod em todos os idiomas do WorldBox. Inglês é obrigatório.']],
      ['download', ['Ready-to-play .zip', '.zip pronto para jogar'], ['Export one .zip for NML, extract it in the Mods folder and play.', 'Exporte um .zip para o NML, extraia na pasta Mods e jogue.']]
    ];
    main.appendChild(h('section', { class: 'mhero' }, h('div', { class: 'wrap' },
      h('div', null,
        h('span', { class: 'tag acc' }, h('span', { class: 'dot' }), t('Free tool', 'Ferramenta gratuita')),
        h('h1', { style: 'margin-top:16px', text: 'Neo Mod Maker' }),
        h('p', { class: 'lead', text: t('The WorldBox mod creator that runs right in your browser. Build a full NML mod by filling in pages, with nothing to install.', 'O criador de mods de WorldBox que roda direto no navegador. Monte um mod completo para o NML preenchendo páginas, sem instalar nada.') }),
        h('div', { class: 'ctas' }, ext(url, [AG.icon('external'), h('span', { text: t('Open Neo Mod Maker', 'Abrir o Neo Mod Maker') })], 'btn pri'), discordBtn())),
      h('a', { class: 'stage hud shotlink', href: url, target: '_blank', rel: 'noopener' }, h('img', { class: 'shot', src: '/Nexus/assets/img/nmm.png', alt: 'Neo Mod Maker' })))));
    main.appendChild(h('section', null, h('div', { class: 'wrap' }, AG.secHead(t('Features', 'Recursos'), t('What you can make', 'O que dá para fazer')),
      h('div', { class: 'feats' }, F.map(function (f) { return h('div', { class: 'panel feat reveal' }, h('div', { class: 'ic' }, AG.icon(f[0])), h('div', null, h('h3', { text: L(f[1]) }), h('p', { text: L(f[2]) }))); })),
      h('div', { class: 'tip', style: 'margin-top:22px' }, h('b', { text: t('Your mods from Neo Mod Maker: ', 'Seus mods do Neo Mod Maker: ') }), t('share them in the your-mods forum channel on Discord.', 'compartilhe no canal de fórum your-mods do Discord.')))));
  };

  P.credits = function (main) {
    title(t('Credits', 'Créditos'));
    function person(n, r, d) { return h('div', { class: 'panel credit reveal' }, h('span', { text: r }), h('b', { text: n }), d ? h('p', { text: d }) : null); }
    main.appendChild(h('section', { class: 'mhead' }, h('div', { class: 'wrap' },
      AG.secHead(t('Credits', 'Créditos'), t('Who makes this', 'Quem faz isso')),
      h('div', { class: 'credits' },
        person('Agriche (AgricheX)', t('Owner and founder', 'Dona e fundadora'), t('Creator of every mod on this site and of Neo Mod Maker, and direction of every decision of the project.', 'Criadora de todos os mods deste site e do Neo Mod Maker, e direção de todas as decisões do projeto.')),
        person('Claude (Anthropic)', t('Co-creator', 'Co-criador'), t('Built this site and helped update the code of the mods, in partnership with the founder.', 'Construiu este site e ajudou a atualizar o código dos mods, em parceria com a fundadora.')),
        person('Loctusz Ofc', t('Sprite artist', 'Artista dos sprites'), t('Made most of the art of the original mods. Thank you for all the work on the sprites.', 'Fez a maior parte da arte dos mods originais. Obrigado por todo o trabalho com os sprites.'))),
      h('p', { class: 'mute', style: 'margin-top:16px', text: t('Thanks also to everyone else who made art for the mods.', 'Obrigado também a todas as outras pessoas que fizeram arte para os mods.') }),
      h('div', { class: 'group' }, h('h3', { text: t('Official supporters', 'Apoiadores oficiais') }),
        h('p', { text: t('Thank you for believing in the project.', 'Obrigado por acreditarem no projeto.') }),
        h('div', { class: 'eras' }, ['Lenne Batunks'].map(function (n) { return h('span', { class: 'era' }, AG.icon('star'), n); }))),
      h('div', { class: 'group' }, h('h3', { text: t('100% free', '100% gratuito') }),
        h('div', { class: 'notice' }, AG.icon('shield'), h('div', null, t('Every mod is completely free, made by fans for fans. If anyone or any website asks you for money to use them, it is a scam: do not pay and do not share your details.', 'Todos os mods são totalmente gratuitos, feitos de fã para fã. Se alguém ou algum site pedir dinheiro para usar, é golpe: não pague e não passe seus dados.')))),
      h('div', { class: 'group' }, h('h3', { text: t('Copyright', 'Direitos autorais') }),
        h('div', { class: 'panel md' },
          h('p', null, h('b', { text: 'WorldBox © Maxim Karpenko / MakoMako' }), ' · ', h('a', { href: 'https://www.superworldbox.com/', target: '_blank', rel: 'noopener', text: 'superworldbox.com' })),
          h('p', null, h('b', { text: 'RimWorld © Ludeon Studios' }), ' · ', h('a', { href: 'https://rimworldgame.com/', target: '_blank', rel: 'noopener', text: 'rimworldgame.com' })),
          h('p', { text: t('These are independent fan-made mods, not affiliated with or endorsed by the game developers. Characters and franchises shown in the mods belong to their owners.', 'Estes são mods independentes feitos por fãs, sem ligação oficial com os desenvolvedores dos jogos. Personagens e franquias dos mods pertencem aos seus donos.') }),
          h('p', { text: t('The site counts visits and downloads anonymously, without cookies. Fonts: Space Grotesk, Inter and JetBrains Mono, via Google Fonts.', 'O site conta visitas e downloads de forma anônima, sem cookies. Fontes: Space Grotesk, Inter e JetBrains Mono, via Google Fonts.') }))),
      h('div', { class: 'group' }, h('h3', { text: t('Bugs and questions', 'Bugs e dúvidas') }), discordBtn('discord.gg/s3EbgNSsJW')))));
  };

  P.notfound = function (main) {
    title(t('Not found', 'Não encontrado'));
    main.appendChild(h('section', { class: 'hero' }, h('div', { class: 'wrap one' }, h('div', null,
      h('span', { class: 'tag warn', text: '404' }),
      h('h1', { style: 'margin-top:16px', text: t('Page not found', 'Página não encontrada') }),
      h('p', { class: 'lead', text: t('This page does not exist or has moved.', 'Esta página não existe ou mudou de lugar.') }),
      h('div', { class: 'ctas' }, h('a', { class: 'btn pri', href: '/Nexus/' }, h('span', { text: t('Home', 'Início') })), h('a', { class: 'btn', href: '/Nexus/mods/' }, h('span', { text: 'Mods' })))))));
  };
})();
