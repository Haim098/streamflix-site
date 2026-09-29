/* StreamFlix landing page, v2. No dependencies, no tracking. */
(function () {
  "use strict";

  var REPO = "Haim098/streamflix-releases";
  var API = "https://api.github.com/repos/" + REPO + "/releases/latest";
  var CACHE_KEY = "sf-release-v1";
  var FRESH_MS = 30 * 60 * 1000;          // reuse a fetched release for 30 min (API limit: 60/h per IP)
  var STALE_MS = 3 * 24 * 60 * 60 * 1000; // if GitHub is unreachable, accept a cache up to 3 days old
  var platform = document.documentElement.getAttribute("data-platform") || "other";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, text) { var n = document.createElement(tag); if (text != null) n.textContent = text; return n; }
  function ltr(text) { var b = el("bdi", text); b.setAttribute("dir", "ltr"); return b; }

  /* ---------- Screenshots (assets/shots.js) ---------- */
  var S = window.SF_SHOTS || {};
  function setImg(img, s) {
    if (s.srcset) img.srcset = s.srcset; else img.removeAttribute("srcset");
    img.src = s.src;
    if (s.w) img.width = s.w;
    if (s.h) img.height = s.h;
    img.alt = s.alt || "";
  }
  $all("img[data-shot]").forEach(function (img) {
    var s = S[img.getAttribute("data-shot")];
    if (s) setImg(img, s);
  });
  var box = $("#shots");
  if (box && Array.isArray(S.gallery)) {
    S.gallery.forEach(function (s, i) {
      var fig = el("figure"); fig.className = "shot";
      var img = el("img");
      img.loading = "lazy"; img.decoding = "async";
      img.sizes = i === 0 ? "(min-width: 1280px) 1200px, calc(100vw - 40px)" : "(min-width: 900px) 50vw, calc(100vw - 40px)";
      setImg(img, s);
      fig.appendChild(img);
      if (s.title || s.text) {
        var cap = el("figcaption");
        if (s.title) cap.appendChild(el("b", s.title));
        if (s.text) cap.appendChild(document.createTextNode(s.text));
        fig.appendChild(cap);
      }
      box.appendChild(fig);
    });
  }

  /* ---------- Live release data ---------- */
  function fmtSize(bytes) {
    var mb = bytes / 1048576;
    return (mb < 100 ? mb.toFixed(1) : String(Math.round(mb))) + " MB";
  }
  function readCache() { try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "null"); } catch (e) { return null; } }
  function writeCache(rel) { try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), rel: rel })); } catch (e) { /* private mode */ } }

  function fetchJson(url, ms) {
    var ctrl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, ms);
    return fetch(url, { signal: ctrl ? ctrl.signal : undefined, headers: { Accept: "application/vnd.github+json" }, cache: "no-cache" })
      .then(function (r) { clearTimeout(timer); if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); },
            function (e) { clearTimeout(timer); throw e; });
  }
  function slim(j) {
    if (!j || typeof j.tag_name !== "string" || !Array.isArray(j.assets)) throw new Error("bad release");
    return {
      tag: j.tag_name,
      date: j.published_at || "",
      body: typeof j.body === "string" ? j.body.slice(0, 20000) : "",
      assets: j.assets.map(function (a) {
        return { name: String(a.name || ""), size: Number(a.size) || 0, digest: typeof a.digest === "string" ? a.digest : "" };
      }),
    };
  }
  function loadRelease() {
    var c = readCache();
    if (c && c.rel && Date.now() - c.t < FRESH_MS) return Promise.resolve(c.rel);
    return fetchJson(API, 5000).then(function (j) { var rel = slim(j); writeCache(rel); return rel; })
      .catch(function () {
        if (c && c.rel && Date.now() - c.t < STALE_MS) return c.rel;
        throw new Error("release unavailable");
      });
  }

  function applyRelease(rel) {
    var ver = rel.tag.replace(/^v/i, "");
    var by = {};
    rel.assets.forEach(function (a) { by[a.name] = a; });

    $all("[data-size]").forEach(function (n) {
      var a = by[n.getAttribute("data-size")];
      if (a && a.size) { n.textContent = ""; n.appendChild(ltr(fmtSize(a.size))); }
    });

    // Hero meta line: "גרסה 0.12.0".
    var v = $("[data-version]");
    if (v) {
      v.textContent = "גרסה ";
      v.appendChild(ltr(ver));
      // Sizes are already on the buttons; the meta line only carries the version.
      v.hidden = false;
    }

    var nv = $("[data-news-ver]");
    if (nv) { nv.textContent = ""; nv.appendChild(ltr(ver)); nv.hidden = false; }

    var hashes = $("[data-hashes]");
    if (hashes) {
      rel.assets.forEach(function (a) {
        var m = /^sha256:([0-9a-f]{64})$/i.exec(a.digest);
        if (!m || !/\.apk$/i.test(a.name)) return;
        hashes.appendChild(el("dt", a.name));
        hashes.appendChild(el("dd", m[1]));
        hashes.hidden = false;
      });
    }
    renderNotes(rel.body);
  }

  /* ---------- Release notes: safe mini-markdown ----------
   * #/##/### headings, "- "/"* " bullets, **bold**, `code`, paragraphs.
   * Only textContent is used: the release body can never inject HTML. */
  function inline(parent, text) {
    var re = /(\*\*[^*]+\*\*|`[^`]+`)/g, last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) parent.appendChild(document.createTextNode(text.slice(last, m.index)));
      var t = m[0];
      parent.appendChild(t.charAt(0) === "`" ? el("code", t.slice(1, -1)) : el("strong", t.slice(2, -2)));
      last = m.index + t.length;
    }
    if (last < text.length) parent.appendChild(document.createTextNode(text.slice(last)));
  }
  function renderNotes(md) {
    var box = $("#news-body");
    if (!box || !md) return;
    var frag = document.createDocumentFragment(), list = null, para = null, first = true;
    md.replace(/\r\n?/g, "\n").split("\n").forEach(function (raw) {
      var line = raw.replace(/\s+$/, "");
      var h = /^(#{1,6})\s+(.*)$/.exec(line), li = /^\s*[-*]\s+(.*)$/.exec(line);
      if (!line.trim()) { list = para = null; return; }
      if (h) {
        list = para = null;
        // The first "## מה חדש ב-x" heading repeats the <summary>; skip it.
        if (first && h[1].length <= 2) { first = false; return; }
        var n = el(h[1].length <= 3 ? "h3" : "h4"); inline(n, h[2]); frag.appendChild(n);
      } else if (li) {
        para = null;
        if (!list) { list = el("ul"); frag.appendChild(list); }
        var item = el("li"); inline(item, li[1]); list.appendChild(item);
      } else {
        list = null;
        if (!para) { para = el("p"); frag.appendChild(para); } else para.appendChild(document.createTextNode(" "));
        inline(para, line.trim());
      }
      first = false;
    });
    box.textContent = "";
    box.appendChild(frag);
  }

  if (typeof fetch === "function") {
    loadRelease().then(applyRelease).catch(function () {
      // Offline or rate-limited: links are stable /releases/latest/download/ URLs and keep working;
      // version, sizes and notes simply stay hidden.
      var news = $("#news-body");
      if (news) news.appendChild(el("p", "רשימת השינויים המלאה נמצאת בדף הגרסה."));
    });
  }
})();
