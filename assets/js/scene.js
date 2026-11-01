(function () {
  var AG = window.AG = window.AG || {};

  function rng(seed) {
    var s = seed >>> 0 || 1;
    return function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
  }
  function noise(w, h, seed, oct) {
    var r = rng(seed), out = new Float32Array(w * h), amp = 1, tot = 0;
    for (var o = 0; o < oct; o++) {
      var gs = Math.max(2, Math.round(Math.min(w, h) / (4 * Math.pow(2, o)))) ;
      var gw = Math.ceil(w / gs) + 2, gh = Math.ceil(h / gs) + 2, g = new Float32Array(gw * gh);
      for (var i = 0; i < g.length; i++) g[i] = r();
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var fx = x / gs, fy = y / gs, x0 = fx | 0, y0 = fy | 0, tx = fx - x0, ty = fy - y0;
        tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
        var a = g[y0 * gw + x0], b = g[y0 * gw + x0 + 1], c = g[(y0 + 1) * gw + x0], d = g[(y0 + 1) * gw + x0 + 1];
        out[y * w + x] += amp * ((a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty);
      }
      tot += amp; amp *= 0.5;
    }
    for (var j = 0; j < out.length; j++) out[j] /= tot;
    return out;
  }

  var PAL = {
    deep: [38, 74, 140], sea: [52, 101, 176], shallow: [70, 135, 205], foam: [150, 200, 240],
    sand: [226, 205, 140], grass: [96, 172, 62], grass2: [84, 156, 52], forest: [58, 122, 44], hill: [120, 140, 90], rock: [128, 124, 120], snow: [235, 240, 245],
    dirt: [150, 112, 72], dark: [40, 30, 52], lava: [230, 90, 30], ash: [70, 62, 66]
  };
  function col(c, v) { return 'rgb(' + Math.max(0, Math.min(255, c[0] + v)) + ',' + Math.max(0, Math.min(255, c[1] + v)) + ',' + Math.max(0, Math.min(255, c[2] + v)) + ')'; }

  function Scene(canvas, cfg) {
    this.c = canvas; this.x = canvas.getContext('2d'); this.cfg = cfg || {};
    this.actors = []; this.imgs = {}; this.t = 0; this.run = true;
    var self = this;
    this.resize();
    this.load(function () { self.loop(0); });
    window.addEventListener('resize', function () { self.resize(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { self.vis = es[0].isIntersecting; }).observe(canvas);
  }
  Scene.prototype.resize = function () {
    var r = this.c.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1);
    this.d = d; this.W = Math.max(200, Math.round(r.width)); this.H = Math.max(120, Math.round(r.height));
    this.c.width = this.W * d; this.c.height = this.H * d;
    this.tile = 6; this.tw = Math.ceil(this.W / this.tile); this.th = Math.ceil(this.H / this.tile);
    this.build();
    if (this.actors && this.actors.length) this.fitWater();
  };
  Scene.prototype.land = function (tx, ty) {
    var cfg = this.cfg, n = this.hgt[ty * this.tw + tx], u = tx / this.tw, v = ty / this.th, lay = cfg.layout || 'coast';
    if (lay === 'coast') n += (u - 0.42) * 1.25;
    else if (lay === 'coastr') n += (0.58 - u) * 1.25;
    else if (lay === 'island') n += 0.5 - Math.hypot(u - 0.55, v - 0.55) * 1.35;
    else if (lay === 'sea') n -= 0.42 - v * 0.15;
    else if (lay === 'land') n += 0.35;
    else if (lay === 'bay') n += (v - 0.45) * 1.3;
    return n;
  };
  Scene.prototype.build = function () {
    var tw = this.tw, th = this.th, cfg = this.cfg;
    this.hgt = noise(tw, th, cfg.seed || 7, 4);
    var det = noise(tw, th, (cfg.seed || 7) * 3 + 1, 2);
    var bg = document.createElement('canvas'); bg.width = tw * this.tile; bg.height = th * this.tile;
    var g = bg.getContext('2d'), T = this.tile, r = rng((cfg.seed || 7) + 99);
    this.map = new Uint8Array(tw * th);
    var dark = cfg.biome === 'dark';
    for (var y = 0; y < th; y++) for (var x = 0; x < tw; x++) {
      var e = this.land(x, y), k, c;
      if (e < 0.30) { k = 0; c = PAL.deep; }
      else if (e < 0.40) { k = 0; c = PAL.sea; }
      else if (e < 0.46) { k = 1; c = PAL.shallow; }
      else if (e < 0.50) { k = 2; c = PAL.sand; }
      else if (e < 0.70) { k = 3; c = det[y * tw + x] > 0.55 ? PAL.grass2 : PAL.grass; }
      else if (e < 0.82) { k = 4; c = PAL.forest; }
      else if (e < 0.92) { k = 5; c = PAL.hill; }
      else { k = 6; c = PAL.rock; }
      if (dark && k >= 3) c = k >= 5 ? PAL.ash : PAL.dark;
      this.map[y * tw + x] = k;
      g.fillStyle = col(c, Math.round((det[y * tw + x] - 0.5) * 18) + ((x + y) % 2 ? 2 : -2));
      g.fillRect(x * T, y * T, T, T);
    }
    for (y = 0; y < th; y++) for (x = 0; x < tw; x++) {
      var m = this.map[y * tw + x];
      if (m >= 2 && y > 0 && this.map[(y - 1) * tw + x] < 2) { g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(x * T, y * T - 2, T, 2); }
      if (m === 4 && r() < 0.55) {
        var px = x * T + (r() * 3 | 0), py = y * T - 3;
        g.fillStyle = dark ? '#1b1424' : '#2c5e22'; g.fillRect(px + 1, py, 4, 6);
        g.fillStyle = dark ? '#2a2036' : '#3f8a2f'; g.fillRect(px, py + 1, 6, 3);
        g.fillStyle = '#5a3a22'; g.fillRect(px + 2, py + 6, 2, 2);
      }
      if (m === 3 && r() < 0.03) { g.fillStyle = 'rgba(255,240,150,.8)'; g.fillRect(x * T + 2, y * T + 2, 1, 1); }
      if (m === 6 && r() < 0.4) { g.fillStyle = 'rgba(255,255,255,.65)'; g.fillRect(x * T + 1, y * T, T - 2, 2); }
    }
    this.bg = bg;
    this.sparks = [];
    for (var i = 0; i < 70; i++) this.sparks.push({ x: r(), y: r(), p: r() * 6 });
  };
  Scene.prototype.isWater = function (u, v) {
    var tx = Math.min(this.tw - 1, Math.max(0, u * this.tw | 0)), ty = Math.min(this.th - 1, Math.max(0, v * this.th | 0));
    return this.map[ty * this.tw + tx] <= 1;
  };
  Scene.prototype.load = function (done) {
    var self = this, urls = [], acts = this.cfg.actors || [];
    acts.forEach(function (a) {
      [a.sheet, a.left, a.right].forEach(function (sh) { if (sh && urls.indexOf(sh.s) < 0) urls.push(sh.s); });
    });
    var n = urls.length;
    if (!n) { done(); return; }
    urls.forEach(function (u) {
      var i = new Image();
      i.onload = i.onerror = function () { if (--n === 0) { self.ready(); done(); } };
      i.src = u; self.imgs[u] = i;
    });
  };
  Scene.prototype.ready = function () {
    var self = this;
    this.actors = (this.cfg.actors || []).map(function (a, k) {
      var o = {}; for (var p in a) o[p] = a[p];
      o.u = a.x; o.v = a.y; o.dir = a.vx < 0 ? -1 : 1; o.fi = 0; o.ft = Math.random() * 200; o.bob = Math.random() * 6; o.id = k;
      if (o.water == null) o.water = /boat|ship|cruiser|freighter|carrier|submarine|swim|kots|galleon|frigate/i.test(a.sheet.s);
      return o;
    });
    this.fitWater();
  };
  Scene.prototype.waterAt = function (u, v, hv) {
    return this.isWater(u, v) && this.isWater(u, v - hv) && this.isWater(u, v - hv * 0.5);
  };
  Scene.prototype.fitWater = function () {
    var self = this, W = this.W, H = this.H, stp = 1 / this.tw;
    this.actors.forEach(function (a) {
      if (!a.water) return;
      var sc = a.scale || 1, mu = (a.sheet.w * sc) / 2 / W + stp, hv = Math.max(stp, (a.sheet.h * sc) * 0.35 / H);
      var best = null, vmin = (a.sheet.h * sc) / H + 0.12;
      for (var dv = 0; dv <= 1; dv += 0.02) {
        [a.y + dv, a.y - dv].forEach(function (v) {
          if (best || v < vmin || v > 0.97) return;
          var u0 = null;
          for (var du = 0; du <= 1 && u0 === null; du += stp) {
            if (a.x + du <= 1 && self.waterAt(a.x + du, v, hv)) u0 = a.x + du;
            else if (a.x - du >= 0 && self.waterAt(a.x - du, v, hv)) u0 = a.x - du;
          }
          if (u0 === null) return;
          var lo = u0, hi = u0;
          while (lo - stp >= 0 && self.waterAt(lo - stp, v, hv)) lo -= stp;
          while (hi + stp <= 1 && self.waterAt(hi + stp, v, hv)) hi += stp;
          if (hi - lo > mu * 2 + 0.04) best = { v: v, lo: lo + mu, hi: hi - mu };
        });
        if (best) break;
      }
      if (!best) { a.hide = true; return; }
      a.hide = false; a.v = best.v; a.range = [best.lo, best.hi];
      if (a.u < best.lo || a.u > best.hi) a.u = Math.min(best.hi, Math.max(best.lo, a.x));
    });
  };
  Scene.prototype.loop = function (ts) {
    var self = this;
    var dt = Math.min(60, ts - (this.last || ts)); this.last = ts;
    if (this.vis !== false) { this.t += dt; this.step(dt); this.draw(); }
    requestAnimationFrame(function (t) { self.loop(t); });
  };
  Scene.prototype.step = function (dt) {
    var self = this;
    this.actors.forEach(function (a) {
      var sh = a.dir < 0 ? (a.left || a.sheet) : (a.right || a.sheet);
      a.cur = sh;
      a.ft += dt;
      var step = 1000 / (sh.fps || 6);
      if (a.ft >= step) { a.ft = 0; a.fi = (a.fi + 1) % sh.n; }
      if (a.vx) {
        a.u += Math.abs(a.vx) * a.dir * dt / 1000;
        var lo = a.range ? a.range[0] : 0.05, hi = a.range ? a.range[1] : 0.95;
        if (a.u < lo) { a.u = lo; a.dir = 1; }
        if (a.u > hi) { a.u = hi; a.dir = -1; }
      }
    });
  };
  Scene.prototype.draw = function () {
    var g = this.x, d = this.d, W = this.W, H = this.H, t = this.t / 1000;
    g.setTransform(d, 0, 0, d, 0, 0);
    g.imageSmoothingEnabled = false;
    g.drawImage(this.bg, 0, 0);
    var T = this.tile;
    for (var i = 0; i < this.sparks.length; i++) {
      var s = this.sparks[i], u = (s.x + t * 0.01) % 1, v = s.y;
      if (!this.isWater(u, v)) continue;
      var a = (Math.sin(t * 2 + s.p) + 1) / 2;
      g.fillStyle = 'rgba(200,230,255,' + (a * 0.55).toFixed(2) + ')';
      g.fillRect((u * W | 0), (v * H | 0), 4, 1);
    }
    var list = this.actors.slice().sort(function (a, b) { return (a.layer || 0) - (b.layer || 0) || a.v - b.v; });
    for (var k = 0; k < list.length; k++) {
      var a = list[k], sh = a.cur || a.sheet, img = this.imgs[sh.s];
      if (!img || !img.width || a.hide) continue;
      var sc = (a.scale || 1), w = sh.w * sc, h = sh.h * sc, fx = (a.fi % sh.n) * sh.w;
      var x = a.u * W - w / 2, y = a.v * H - h + (a.bobs ? Math.sin(t * 2 + a.bob) * 1.5 : 0);
      g.imageSmoothingEnabled = sc < 1;
      g.save();
      if (a.shadow !== false) {
        g.fillStyle = 'rgba(0,0,0,.25)';
        g.beginPath(); g.ellipse(a.u * W, a.v * H, w * 0.32, Math.max(2, h * 0.05), 0, 0, 7); g.fill();
      }
      var flip = a.noflip ? false : (a.face === 'right' ? a.dir < 0 : a.dir > 0);
      if (flip) { g.translate(a.u * W * 2, 0); g.scale(-1, 1); }
      g.drawImage(img, fx, 0, sh.w, sh.h, Math.round(x), Math.round(y), Math.round(w), Math.round(h));
      g.restore();
    }
    var grd = g.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, 'rgba(5,10,20,.35)'); grd.addColorStop(0.25, 'rgba(5,10,20,0)'); grd.addColorStop(1, 'rgba(5,10,20,.45)');
    g.fillStyle = grd; g.fillRect(0, 0, W, H);
  };

  AG.scene = function (cfg, label, caption) {
    var h = AG.h;
    var cv = h('canvas', { 'aria-label': label || 'Animated scene', role: 'img' });
    var st = h('div', { class: 'stage hud' }, cv, h('div', { class: 'scan' }),
      label ? h('div', { class: 'lbl' }, h('span', { class: 'tag acc' }, h('span', { class: 'dot' }), label)) : null,
      caption ? h('div', { class: 'cap', text: caption }) : null);
    requestAnimationFrame(function () { new Scene(cv, cfg); });
    return st;
  };
})();
