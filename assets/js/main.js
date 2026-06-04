/* =========================================================
   TROIB — interaction layer
   ========================================================= */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- nav: stuck + mobile ---------- */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  function onScrollNav() {
    if (window.scrollY > 24) nav.classList.add("is-stuck");
    else nav.classList.remove("is-stuck");
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  if (burger) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- depth gauge ---------- */
  var fill = document.getElementById("depthFill");
  var label = document.getElementById("depthLabel");
  function onScrollDepth() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? h.scrollTop / max : 0;
    if (fill) fill.style.height = (p * 100).toFixed(2) + "%";
    if (label) label.textContent = Math.round(p * 3000) + " m";
  }
  window.addEventListener("scroll", onScrollDepth, { passive: true });
  onScrollDepth();

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- animated counters ---------- */
  function formatNum(v, dec) {
    var n = Number(v).toFixed(dec);
    var parts = n.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  function runCounter(el) {
    var to = parseFloat(el.getAttribute("data-to"));
    var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    var pre = el.getAttribute("data-pre") || "";
    var suf = el.getAttribute("data-suf") || "";
    if (reduceMotion) { el.textContent = pre + formatNum(to, dec) + suf; return; }
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + formatNum(to * eased, dec) + suf;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = pre + formatNum(to, dec) + suf;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll(".counter");
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- region tabs ---------- */
  var tabs = document.querySelectorAll(".region-tab");
  var panels = document.querySelectorAll(".region-panel");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var region = tab.getAttribute("data-region");
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      panels.forEach(function (p) {
        p.classList.toggle("is-active", p.getAttribute("data-region") === region);
      });
    });
  });

  /* ---------- financial stacked chart ---------- */
  // values in $M; chart max scaled to ~1400
  var FIN = {
    max: 1400,
    years: [
      { label: "Year 3", total: 135.7, segs: { dc: 42.0, grid: 43.0, water: 20.2, mineral: 18.5, fuel: 12.0 } },
      { label: "Year 7", total: 596.8, segs: { dc: 210.0, grid: 172.0, water: 80.8, mineral: 74.0, fuel: 60.0 } },
      { label: "Year 10", total: 1354.6, segs: { dc: 588.0, grid: 306.0, water: 161.6, mineral: 155.0, fuel: 144.0 } }
    ]
  };
  var order = ["dc", "grid", "water", "mineral", "fuel"];
  var colsHost = document.querySelector(".fin-chart__cols");
  if (colsHost) {
    FIN.years.forEach(function (yr) {
      var col = document.createElement("div");
      col.className = "fin-col";
      var stack = document.createElement("div");
      stack.className = "fin-col__stack";
      order.forEach(function (k) {
        var seg = document.createElement("div");
        seg.className = "fin-seg fin-seg--" + k;
        seg.setAttribute("data-h", ((yr.segs[k] / FIN.max) * 100).toFixed(2));
        stack.appendChild(seg);
      });
      var val = document.createElement("div");
      val.className = "fin-col__val";
      val.textContent = "$" + yr.total.toLocaleString() + "M";
      var lab = document.createElement("div");
      lab.className = "fin-col__label";
      lab.textContent = yr.label;
      col.appendChild(stack); col.appendChild(val); col.appendChild(lab);
      colsHost.appendChild(col);
    });

    function growBars() {
      colsHost.querySelectorAll(".fin-seg").forEach(function (seg, i) {
        var h = seg.getAttribute("data-h") + "%";
        if (reduceMotion) { seg.style.height = h; return; }
        setTimeout(function () { seg.style.height = h; }, (i % order.length) * 90 + Math.floor(i / order.length) * 120);
      });
    }
    var chart = document.getElementById("finChart");
    if ("IntersectionObserver" in window && chart) {
      var fo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { growBars(); fo.disconnect(); } });
      }, { threshold: 0.3 });
      fo.observe(chart);
    } else { growBars(); }
  }

  /* ---------- ocean depth canvas ---------- */
  var canvas = document.getElementById("oceanCanvas");
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var w, h, dpr, particles = [], marine = [];
    var PALETTE = ["#00e0c7", "#2ad4ff", "#6c7dff", "#ffd166"];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = Math.floor(innerWidth * dpr);
      h = canvas.height = Math.floor(innerHeight * dpr);
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
      build();
    }
    function build() {
      var count = Math.round((innerWidth * innerHeight) / 26000);
      count = Math.max(34, Math.min(count, 120));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: (Math.random() * 1.6 + 0.4) * dpr,
          vy: (Math.random() * 0.25 + 0.05) * dpr,
          vx: (Math.random() - 0.5) * 0.12 * dpr,
          a: Math.random() * 0.5 + 0.1,
          tw: Math.random() * Math.PI * 2
        });
      }
      // a few glowing "bioluminescent" motes
      marine = [];
      var mc = Math.max(5, Math.round(count / 12));
      for (var j = 0; j < mc; j++) {
        marine.push({
          x: Math.random() * w, y: Math.random() * h,
          r: (Math.random() * 2.5 + 2) * dpr,
          vy: -(Math.random() * 0.18 + 0.05) * dpr,
          vx: (Math.random() - 0.5) * 0.2 * dpr,
          c: PALETTE[(Math.random() * PALETTE.length) | 0],
          tw: Math.random() * Math.PI * 2
        });
      }
    }
    function tick(t) {
      ctx.clearRect(0, 0, w, h);
      // descending marine snow
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.y += p.vy; p.x += p.vx; p.tw += 0.02;
        if (p.y > h + 4) { p.y = -4; p.x = Math.random() * w; }
        if (p.x < -4) p.x = w + 4; if (p.x > w + 4) p.x = -4;
        var flick = 0.6 + 0.4 * Math.sin(p.tw);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(180,210,220," + (p.a * flick).toFixed(3) + ")";
        ctx.fill();
      }
      // glowing motes rising
      for (var k = 0; k < marine.length; k++) {
        var m = marine[k];
        m.y += m.vy; m.x += m.vx; m.tw += 0.03;
        if (m.y < -8) { m.y = h + 8; m.x = Math.random() * w; }
        var glow = 0.5 + 0.5 * Math.sin(m.tw);
        var g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 6);
        g.addColorStop(0, m.c);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalAlpha = 0.18 + glow * 0.22;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      requestAnimationFrame(tick);
    }
    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt); rt = setTimeout(resize, 180);
    });
    resize();
    requestAnimationFrame(tick);
  }
})();
