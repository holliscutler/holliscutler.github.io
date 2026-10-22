/* Animated view of the myco-morph consolidated graph building itself.
 *
 * Data is a gzipped JSON of real model snapshots (see assets/data/). Each frame
 * carries node positions in the Takens delay-embedding space, quantised to
 * int16, plus edges bucketed into four conductivity tiers. Rendering is plain
 * canvas 2D with a hand-rolled projection — no libraries.
 *
 * Degrades rather than breaks: if the browser can't gunzip the payload or the
 * fetch fails, the <noscript>-style fallback figure inside the container is
 * revealed instead.
 */
(function () {
  "use strict";

  var SRC = "/assets/data/graph-window.json.gz";

  // edge styling by conductivity tier: dormant grey -> active teal
  var TIERS = [
    { stroke: "rgba(125,130,128,0.13)", width: 1.0 },
    { stroke: "rgba(95,135,140,0.34)", width: 1.2 },
    { stroke: "rgba(0,148,158,0.62)", width: 2.0 },
    { stroke: "rgba(0,196,206,0.95)", width: 3.0 }
  ];

  function reducedMotion() {
    return window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  async function load(url) {
    var res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);

    // GitHub Pages serves .gz as application/gzip with no Content-Encoding, so
    // the body normally arrives still compressed. A proxy (or a future server
    // config) may decompress it transparently instead, so sniff the gzip magic
    // bytes rather than assuming either case.
    var buf = await res.arrayBuffer();
    var head = new Uint8Array(buf, 0, Math.min(2, buf.byteLength));
    var gzipped = head.length === 2 && head[0] === 0x1f && head[1] === 0x8b;

    if (!gzipped) return JSON.parse(new TextDecoder().decode(buf));

    if (typeof DecompressionStream !== "function") {
      throw new Error("this browser cannot decompress the dataset");
    }
    var stream = new Blob([buf]).stream().pipeThrough(new DecompressionStream("gzip"));
    return JSON.parse(await new Response(stream).text());
  }

  function prepare(data) {
    var scale = data.meta.bbox.scale;
    return data.frames.map(function (f) {
      var n = f.p.length / 3;
      // centre on the origin and normalise to roughly [-1, 1]
      var pos = new Float32Array(f.p.length);
      for (var i = 0; i < f.p.length; i++) pos[i] = (f.p[i] / scale) * 2 - 1;
      // group edge endpoints by tier so each tier draws as one path
      var byTier = [[], [], [], []];
      for (var e = 0; e < f.e.length; e++) {
        var edge = f.e[e];
        byTier[edge[2]].push(edge[0], edge[1]);
      }
      return {
        date: f.t,
        loops: f.l,
        n: n,
        pos: pos,
        tiers: byTier.map(function (a) { return Int32Array.from(a); })
      };
    });
  }

  function init(root) {
    var canvas = root.querySelector("canvas");
    var fallback = root.querySelector("[data-viz-fallback]");
    var status = root.querySelector("[data-viz-status]");
    var playBtn = root.querySelector("[data-viz-play]");
    var scrub = root.querySelector("[data-viz-scrub]");
    var readout = root.querySelector("[data-viz-readout]");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    var frames = null;
    var idx = 0;
    var playing = false;
    var angle = 0.6;
    var spin = !reducedMotion();
    var last = 0;
    var acc = 0;
    var MS_PER_FRAME = 70;

    function fail(msg) {
      if (status) status.textContent = msg;
      root.setAttribute("data-viz-state", "failed");
      if (fallback) fallback.hidden = false;
      canvas.hidden = true;
      var c = root.querySelector("[data-viz-controls]");
      if (c) c.hidden = true;
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = canvas.clientWidth || 640;
      var h = canvas.clientHeight || 420;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      if (!frames) return;
      var f = frames[idx];
      var w = canvas.clientWidth || 640;
      var h = canvas.clientHeight || 420;
      ctx.clearRect(0, 0, w, h);

      var cx = w / 2;
      var cy = h / 2;
      var R = Math.min(w, h) * 0.38;
      var ca = Math.cos(angle), sa = Math.sin(angle);
      var tilt = 0.42;
      var ct = Math.cos(tilt), st = Math.sin(tilt);

      // project once per frame, reused by every tier and the node pass
      var n = f.n;
      var sx = new Float32Array(n), sy = new Float32Array(n), sd = new Float32Array(n);
      for (var i = 0; i < n; i++) {
        var x = f.pos[i * 3], y = f.pos[i * 3 + 1], z = f.pos[i * 3 + 2];
        var rx = x * ca + z * sa;
        var rz = -x * sa + z * ca;
        var ry = y * ct - rz * st;
        var depth = y * st + rz * ct;
        var persp = 2.4 / (2.4 + depth);
        sx[i] = cx + rx * R * persp;
        sy[i] = cy + ry * R * persp;
        sd[i] = persp;
      }

      for (var t = 0; t < TIERS.length; t++) {
        var pairs = f.tiers[t];
        if (!pairs.length) continue;
        ctx.beginPath();
        for (var k = 0; k < pairs.length; k += 2) {
          var a = pairs[k], b = pairs[k + 1];
          if (a >= n || b >= n) continue;
          ctx.moveTo(sx[a], sy[a]);
          ctx.lineTo(sx[b], sy[b]);
        }
        ctx.strokeStyle = TIERS[t].stroke;
        ctx.lineWidth = TIERS[t].width;
        ctx.stroke();
      }

      // One path for every node, so this is a single fill rather than N of
      // them — at ~900 nodes a fill per node is the whole frame budget.
      // Kept below the bright edges in weight so the reinforced loop reads.
      ctx.fillStyle = "rgba(196,72,48,0.55)";
      ctx.beginPath();
      for (var j = 0; j < n; j++) {
        var r = 1.25 * sd[j];
        ctx.moveTo(sx[j] + r, sy[j]);
        ctx.arc(sx[j], sy[j], r, 0, 6.283185);
      }
      ctx.fill();

      if (readout) {
        readout.textContent = f.date.replace("T", " ") + ":00  ·  " +
          f.n + " nodes  ·  " + f.loops + " cycles";
      }
      if (scrub && String(scrub.value) !== String(idx)) scrub.value = String(idx);
    }

    function tick(now) {
      if (!frames) return;
      var dt = last ? now - last : 0;
      last = now;
      if (spin) angle += dt * 0.00012;
      if (playing) {
        acc += dt;
        while (acc >= MS_PER_FRAME) {
          acc -= MS_PER_FRAME;
          idx = (idx + 1) % frames.length;
        }
      }
      if (playing || spin) draw();
      requestAnimationFrame(tick);
    }

    function setPlaying(on) {
      playing = on;
      if (playBtn) {
        playBtn.textContent = on ? "Pause" : "Play";
        playBtn.setAttribute("aria-pressed", on ? "true" : "false");
      }
    }

    if (playBtn) {
      playBtn.addEventListener("click", function () { setPlaying(!playing); });
    }
    if (scrub) {
      scrub.addEventListener("input", function () {
        idx = Math.min(frames ? frames.length - 1 : 0, Math.max(0, +scrub.value));
        setPlaying(false);
        draw();
      });
    }
    // drag horizontally to rotate
    var dragging = false, lastX = 0;
    canvas.addEventListener("pointerdown", function (ev) {
      dragging = true; lastX = ev.clientX; spin = false;
      canvas.setPointerCapture(ev.pointerId);
    });
    canvas.addEventListener("pointermove", function (ev) {
      if (!dragging) return;
      angle += (ev.clientX - lastX) * 0.008;
      lastX = ev.clientX;
      draw();
    });
    canvas.addEventListener("pointerup", function () { dragging = false; });

    window.addEventListener("resize", function () { resize(); draw(); });

    load(SRC).then(function (data) {
      frames = prepare(data);
      if (!frames.length) return fail("No frames in the dataset.");
      if (scrub) { scrub.max = String(frames.length - 1); scrub.disabled = false; }
      if (playBtn) playBtn.disabled = false;
      if (status) status.hidden = true;
      root.setAttribute("data-viz-state", "ready");
      resize();
      idx = 0;
      setPlaying(!reducedMotion());
      draw();
      requestAnimationFrame(tick);
    }).catch(function (err) {
      fail("Could not load the animation (" + err.message + "). Showing the static figure instead.");
    });
  }

  function boot() {
    var nodes = document.querySelectorAll("[data-network-viz]");
    for (var i = 0; i < nodes.length; i++) init(nodes[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
