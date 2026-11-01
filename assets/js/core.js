(function () {
  var AG = window.AG = window.AG || {};
  var KEY = 'ag_lang';
  var DISCORD = 'https://discord.gg/s3EbgNSsJW';
  var GH = 'https://github.com/AgricheX';
  AG.DISCORD = DISCORD;
  AG.GH = GH;

  function pickLang() {
    try { var s = localStorage.getItem(KEY); if (s === 'en' || s === 'pt') return s; } catch (e) {}
    return /^pt/i.test(navigator.language || '') ? 'pt' : 'en';
  }
  AG.lang = pickLang();
  AG.setLang = function (l) {
    AG.lang = l;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    document.documentElement.lang = l === 'pt' ? 'pt-BR' : 'en';
    AG.boot();
  };
  AG.t = function (en, pt) { return AG.lang === 'pt' && pt != null ? pt : en; };
  AG.L = function (o) {
    if (o == null) return '';
    if (typeof o === 'string') return o;
    if (Array.isArray(o)) return AG.t(o[0], o[1]);
    return AG.lang === 'pt' && o.pt != null ? o.pt : o.en;
  };

  AG.h = function (tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  };
  function add(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(el, x); }); return; }
    el.appendChild(typeof c === 'object' ? c : document.createTextNode(String(c)));
  }
  var h = AG.h;

  var ICONS = {
    download: '<path d="M12 3v12m0 0 5-5m-5 5-5-5M4 19h16"/>',
    discord: '<path d="M8 8.5c2.5-1 5.5-1 8 0M7.5 16c3 1.2 6 1.2 9 0M9 3.5 8 5.5c-2 .5-3.5 1.3-4.5 2.2C2.5 11 2.2 14 2.8 17c1.4 1.3 3 2.1 4.7 2.5l1-2M15 3.5l1 2c2 .5 3.5 1.3 4.5 2.2 1 3.3 1.3 6.3.7 9.3-1.4 1.3-3 2.1-4.7 2.5l-1-2"/><circle cx="9" cy="12.5" r="1.3"/><circle cx="15" cy="12.5" r="1.3"/>',
    github: '<path d="M9 19c-4.5 1.4-4.5-2.3-6-2.8m12 5.6v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
    steam: '<circle cx="15.5" cy="8.5" r="3.5"/><circle cx="8" cy="16" r="2.5"/><path d="M2 12.5 8 16m4-4 1.5-1"/>',
    book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5zM4 21.5A2.5 2.5 0 0 1 6.5 19H20v3H6.5"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
    cube: '<path d="m12 2 9 5v10l-9 5-9-5V7z"/><path d="m3 7 9 5 9-5M12 12v10"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    shield: '<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z"/>',
    sliders: '<path d="M4 6h10m4 0h2M4 12h4m4 0h8M4 18h12m4 0h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    gamepad: '<path d="M6 8h12a4 4 0 0 1 4 4v1a4 4 0 0 1-7 2.6L14 15h-4l-1 .6A4 4 0 0 1 2 13v-1a4 4 0 0 1 4-4z"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="16" cy="11.5" r=".8"/><circle cx="18" cy="13.5" r=".8"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    spark: '<path d="M12 2v6m0 8v6M2 12h6m8 0h6M5 5l4 4m6 6 4 4M19 5l-4 4M9 15l-4 4"/>',
    wave: '<path d="M2 8c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0M2 14c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0"/>',
    flag: '<path d="M5 21V4m0 0h11l-2 4 2 4H5"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6"/>',
    sword: '<path d="M14.5 3H21v6.5L9 21.5 2.5 15z"/><path d="m5 13 6 6M3 21l3-3"/>',
    ship: '<path d="M3 15h18l-3 5H6zM6 15V9h12v6M12 9V3l5 3-5 2"/>',
    planet: '<circle cx="12" cy="12" r="6"/><path d="M3 15.5c-1.5 2 0 3 4 2s9-4.5 12-7 2.5-4-1-3"/>',
    door: '<path d="M5 21V3h11v18M5 21h14M12.5 12h.01"/>',
    fire: '<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-9-1.5 2-2 3.5-2 5-1-1-2-3-2-5-3 2.5-6 6-6 9a7 7 0 0 0 7 7z"/>',
    crown: '<path d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>',
    tv: '<rect x="2.5" y="6" width="19" height="13" rx="2"/><path d="m8 2 4 4 4-4"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    external: '<path d="M14 4h6v6m0-6L10 14M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'
  };
  AG.icon = function (name) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '1.7');
    s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('stroke-linejoin', 'round');
    s.innerHTML = ICONS[name] || ICONS.cube;
    return s;
  };

  AG.GAMES = {
    worldbox: { name: 'WorldBox', d: ['A god simulator: shape the land, raise kingdoms and watch them grow, fight and fall.', 'Um simulador de deus: molde o mundo, crie reinos e veja eles crescerem, lutarem e caírem.'], url: 'https://www.superworldbox.com/' },
    rimworld: { name: 'RimWorld', d: ['A colony sim driven by an AI storyteller, about survival on a far-off planet.', 'Um simulador de colônia guiado por um narrador de IA, sobre sobreviver num planeta distante.'], url: 'https://rimworldgame.com/' }
  };
  AG.GENS = {
    newgen: { en: 'New Gen', pt: 'New Gen' },
    legacy: { en: 'Legacy', pt: 'Legacy' }
  };

  AG.mod = function (id) { return (AG.mods || []).filter(function (m) { return m.id === id; })[0]; };
  AG.dlUrl = function (m) { return GH + '/' + m.repo + '/releases/latest/download/' + m.zip + '.zip'; };
  AG.repoUrl = function (m) { return GH + '/' + m.repo; };
  AG.steamUrl = function (m) { return m.steam ? 'https://steamcommunity.com/sharedfiles/filedetails/?id=' + m.steam : null; };
  AG.modUrl = function (m) { return '/Nexus/mods/' + m.id + '/'; };

  var LIVE = /(^|\.)agrichex\.github\.io$/.test(location.hostname);
  AG.count = function (path, title) {
    if (!LIVE) return;
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: path, title: title || path, event: true }); } catch (e) {}
  };
  function loadStats() {
    if (!LIVE || document.getElementById('gc-count')) return;
    window.goatcounter = { no_onload: false };
    var s = document.createElement('script');
    s.id = 'gc-count';
    s.async = true;
    s.setAttribute('data-goatcounter', 'https://agriche.goatcounter.com/count');
    s.src = 'https://gc.zgo.at/count.js';
    document.head.appendChild(s);
  }

  AG.dlButton = function (m, big) {
    var a = h('a', { class: 'btn pri', href: AG.dlUrl(m), onclick: function () { AG.count('download-' + m.id, 'Download ' + m.name); } },
      AG.icon('download'), h('span', null, AG.t('Download', 'Baixar') + (big ? ' ' + m.name : '')), h('small', null, 'v' + m.ver));
    return a;
  };

  var NAV = [
    { id: 'home', href: '/Nexus/', t: ['Home', 'Início'] },
    { id: 'mods', href: '/Nexus/mods/', t: ['Mods', 'Mods'] },
    { id: 'guides', href: '/Nexus/guides/', t: ['Guides', 'Guias'] },
    { id: 'forum', href: '/Nexus/forum/', t: ['Help forum', 'Fórum de ajuda'] },
    { id: 'nmm', href: '/Nexus/neo-mod-maker/', t: ['Neo Mod Maker', 'Neo Mod Maker'] },
    { id: 'credits', href: '/Nexus/credits/', t: ['Credits', 'Créditos'] }
  ];

  function header(active) {
    var nav = h('nav', { class: 'nav' }, NAV.map(function (n) {
      return h('a', { href: n.href, class: n.id === active ? 'on' : null, text: AG.L(n.t) });
    }));
    var lang = h('div', { class: 'lang', role: 'group', 'aria-label': 'Language' },
      h('button', { class: AG.lang === 'en' ? 'on' : null, text: 'EN', onclick: function () { AG.setLang('en'); } }),
      h('button', { class: AG.lang === 'pt' ? 'on' : null, text: 'PT', onclick: function () { AG.setLang('pt'); } }));
    var burger = h('button', { class: 'burger', 'aria-label': 'Menu', onclick: function () { nav.classList.toggle('open'); } }, AG.icon('menu'));
    burger.firstChild.style.width = '20px';
    return h('header', { class: 'top' }, h('div', { class: 'wrap' },
      h('a', { class: 'brand', href: '/Nexus/' }, h('span', { class: 'logo', text: 'A' }), h('span', null, 'Agriche Mods', h('small', null, 'WorldBox · RimWorld'))),
      nav, burger, lang));
  }

  function footer() {
    var mods = (AG.mods || []);
    function col(title, list) { return h('div', null, h('h4', { text: title }), list); }
    return h('footer', { class: 'foot' }, h('div', { class: 'wrap' },
      h('div', null,
        h('a', { class: 'brand', href: '/Nexus/' }, h('span', { class: 'logo', text: 'A' }), h('span', null, 'Agriche Mods')),
        h('p', { style: 'margin-top:12px;max-width:380px', text: AG.t('Free mods made by fans, for fans. If anyone asks you for money to use them, it is a scam.', 'Mods gratuitos feitos de fã para fã. Se alguém pedir dinheiro para usar, é golpe.') })),
      col(AG.t('Mods', 'Mods'), mods.slice(0, 7).map(function (m) { return h('a', { href: AG.modUrl(m), text: m.name }); })),
      col(AG.t('Links', 'Links'), [
        h('a', { href: '/Nexus/guides/', text: AG.t('Guides', 'Guias') }),
        h('a', { href: '/Nexus/forum/', text: AG.t('Help forum', 'Fórum de ajuda') }),
        h('a', { href: DISCORD, target: '_blank', rel: 'noopener', text: 'Discord: Agriche Community' }),
        h('a', { href: GH, target: '_blank', rel: 'noopener', text: 'GitHub: AgricheX' }),
        h('a', { href: '/Nexus/neo-mod-maker/', text: 'Neo Mod Maker' }),
        h('a', { href: '/Nexus/credits/', text: AG.t('Credits', 'Créditos') })
      ]),
      h('div', { class: 'legal' },
        h('p', { text: 'WorldBox © Maxim Karpenko / MakoMako. RimWorld © Ludeon Studios. ' + AG.t('These are independent fan-made mods, not affiliated with or endorsed by the game developers. Characters and franchises belong to their owners.', 'Estes são mods independentes feitos por fãs, sem ligação oficial com os desenvolvedores dos jogos. Personagens e franquias pertencem aos seus donos.') }))));
  }

  AG.sprite = function (sh, maxW, maxH, alt, up) {
    if (!sh) return h('span');
    var k = Math.min((maxW || sh.w) / sh.w, (maxH || sh.h) / sh.h);
    if (k >= 1) k = up === false ? 1 : Math.max(1, Math.floor(k));
    var el = h('div', { class: 'sh px' + (sh.n > 1 ? ' play' : ''), role: 'img', 'aria-label': alt || '' });
    el.style.cssText = '--img:url("' + sh.s + '");--w:' + sh.w + 'px;--h:' + sh.h + 'px;--n:' + sh.n + ';--k:' + k + ';--dur:' + (sh.n / (sh.fps || 6)).toFixed(2) + 's';
    return el;
  };

  AG.reveal = function (root) {
    var els = root.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var o = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (e) { o.observe(e); });
  };

  AG.secHead = function (k, title, sub, right) {
    return h('div', { class: 'sec-h' }, h('div', null, k ? h('span', { class: 'k', text: k }) : null, h('h2', { text: title }), sub ? h('p', { text: sub }) : null), right || null);
  };

  AG.pages = AG.pages || {};
  AG.boot = function () {
    var body = document.body;
    var page = body.getAttribute('data-page') || 'home';
    var active = body.getAttribute('data-nav') || page;
    document.documentElement.lang = AG.lang === 'pt' ? 'pt-BR' : 'en';
    body.innerHTML = '';
    body.appendChild(header(active));
    var main = h('main', { id: 'main' });
    body.appendChild(main);
    var fn = AG.pages[page] || AG.pages.notfound;
    fn(main, body.dataset);
    body.appendChild(footer());
    AG.reveal(body);
    if (location.hash) {
      var t = document.getElementById(location.hash.slice(1));
      if (t) setTimeout(function () { t.scrollIntoView(); }, 50);
    }
  };

  document.addEventListener('DOMContentLoaded', function () { AG.boot(); loadStats(); });
})();
