/* StreamFlix landing page behaviour. No dependencies, no tracking. */
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
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---------- Screenshots (from assets/shots.js) ---------- */
  function applyShots() {
    var S = window.SF_SHOTS;
    if (!S) return;
    $all("img[data-shot]").forEach(function (img) {
      var s = S[img.getAttribute("data-shot")];
      if (!s) return;
      if (img.getAttribute("src") !== s.src) img.src = s.src;
      if (s.w) img.width = s.w;
      if (s.h) img.height = s.h;
      if (s.alt) img.alt = s.alt;
    });
    var g = $("#gallery");
    if (!g || !S.gallery) return;
    S.gallery.forEach(function (s) {
      var fig = el("figure", "shot " + (s.kind === "phone" ? "phone" : "desktop"));
      fig.setAttribute("role", "listitem");
      var b = el("button");
      b.type = "button";
      b.setAttribute("aria-label", "הגדלה: " + (s.caption || s.alt || ""));
      var img = el("img");
      img.src = s.src; img.alt = s.alt || ""; img.loading = "lazy"; img.decoding = "async";
      if (s.w) img.width = s.w;
      if (s.h) img.height = s.h;
      b.appendChild(img);
      b.addEventListener("click", function () { openLightbox(s); });
      fig.appendChild(b);
      if (s.caption) fig.appendChild(el("figcaption", null, s.caption));
      g.appendChild(fig);
    });
  }

  /* ---------- Lightbox ---------- */
  var lb = $("#lightbox");
  function openLightbox(s) {
    if (!lb || typeof lb.showModal !== "function") { window.open(s.src, "_blank", "noopener"); return; }
    var img = $("img", lb);
    img.src = s.src; img.alt = s.alt || "";
    lb.showModal();
  }
  if (lb) {
    lb.addEventListener("click", function () { lb.close(); });
  }

  /* ---------- Platform tweaks ---------- */
  function applyPlatform() {
    var sticky = $("#sticky-dl");
    if (sticky && platform === "windows") {
      // Narrow Windows window: pin the MSI instead of the APK.
      var a = $("a", sticky);
      a.href = "https://github.com/" + REPO + "/releases/latest/download/streamflix-windows-x64.msi";
      a.setAttribute("data-dl", "msi");
      $(".btn-main", a).textContent = "הורדה ל-Windows";
    }
    // Open the install guide for this device; on other devices open both.
    var win = $("#install-win"), and = $("#install-android");
    if (platform === "windows") { if (win) win.open = true; }
    else if (platform === "android") { if (and) and.open = true; }
    else { if (win) win.open = true; if (and) and.open = true; }
  }

  /* ---------- Live release data ---------- */
  function fmtSize(bytes) {
    if (!bytes || !isFinite(bytes)) return "";
    var mb = bytes / 1048576;
    return (mb < 100 ? mb.toFixed(1) : Math.round(mb)) + " MB";
  }
  function fmtDate(iso) {
    try {
      return new Date(iso).toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" });
    } catch (e) { return ""; }
  }

  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function writeCache(rel) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), rel: rel })); } catch (e) { /* private mode */ }
  }

  function fetchJson(url, ms) {
    var ctrl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, ms);
    return fetch(url, { signal: ctrl ? ctrl.signal : undefined, headers: { Accept: "application/vnd.github+json" }, cache: "no-cache" })
      .then(function (r) {
        clearTimeout(timer);
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      }, function (e) { clearTimeout(timer); throw e; });
  }

  // Keep only the fields the page uses (also what goes into the cache).
  function slim(j) {
    if (!j || typeof j.tag_name !== "string" || !Array.isArray(j.assets)) throw new Error("bad release");
    return {
      tag: j.tag_name,
      url: typeof j.html_url === "string" && j.html_url.indexOf("https://github.com/") === 0 ? j.html_url : null,
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
    return fetchJson(API, 5000).then(function (j) {
      var rel = slim(j);
      writeCache(rel);
      return rel;
    }).catch(function () {
      if (c && c.rel && Date.now() - c.t < STALE_MS) return c.rel;
      throw new Error("release unavailable");
    });
  }

  function applyRelease(rel) {
    var ver = rel.tag.replace(/^v/i, "");
    var byName = {};
    rel.assets.forEach(function (a) { byName[a.name] = a; });

    $all("[data-size]").forEach(function (n) {
      var a = byName[n.getAttribute("data-size")];
      if (!a || !a.size) return;
      // " · " stays in the RTL flow; the number+unit is isolated so it never renders as "MB 27.2".
      n.textContent = " · ";
      var bdi = el("bdi", null, fmtSize(a.size));
      bdi.setAttribute("dir", "ltr");
      n.appendChild(bdi);
    });

    var vl = $("[data-version-line]");
    if (vl) {
      vl.textContent = "";
      vl.appendChild(el("span", "dot"));
      var t = "גרסה " + ver;
      var d = fmtDate(rel.date);
      if (d) t += " · עודכנה ב-" + d;
      vl.appendChild(document.createTextNode(t));
      vl.hidden = false;
    }
    var nv = $("[data-news-ver]");
    if (nv) { nv.textContent = ver; nv.hidden = false; }
    var fv = $("[data-footer-ver]");
    if (fv) { fv.textContent = "גרסה נוכחית: " + ver + "."; fv.hidden = false; }

    // SHA-256 list (the API gives "sha256:<hex>").
    var hashes = $("[data-hashes]");
    if (hashes) {
      var dl = $("dl", hashes);
      var any = false;
      rel.assets.forEach(function (a) {
        var m = /^sha256:([0-9a-f]{64})$/i.exec(a.digest);
        if (!m || !/\.(apk|msi)$/i.test(a.name)) return;
        dl.appendChild(el("dt", null, a.name));
        dl.appendChild(el("dd", null, m[1]));
        any = true;
      });
      hashes.hidden = !any;
    }

    renderNotes(rel);
  }

  /* ---------- Safe mini-markdown for the release notes ----------
   * Supports: #/##/### headings, "- " / "* " bullets, **bold**, `code`, paragraphs.
   * Everything is inserted with textContent: the release body can never inject HTML. */
  function inline(parent, text) {
    var re = /(\*\*[^*]+\*\*|`[^`]+`)/g, last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) parent.appendChild(document.createTextNode(text.slice(last, m.index)));
      var tok = m[0];
      if (tok.charAt(0) === "`") parent.appendChild(el("code", null, tok.slice(1, -1)));
      else parent.appendChild(el("strong", null, tok.slice(2, -2)));
      last = m.index + tok.length;
    }
    if (last < text.length) parent.appendChild(document.createTextNode(text.slice(last)));
  }
  function renderMarkdown(md, root) {
    var lines = md.replace(/\r\n?/g, "\n").split("\n");
    var list = null, para = null;
    function flush() { list = null; para = null; }
    lines.forEach(function (raw) {
      var line = raw.replace(/\s+$/, "");
      var h = /^(#{1,6})\s+(.*)$/.exec(line);
      var li = /^\s*[-*]\s+(.*)$/.exec(line);
      if (!line.trim()) { flush(); return; }
      if (h) {
        flush();
        var n = el(h[1].length <= 2 ? "h3" : "h4");
        inline(n, h[2]);
        root.appendChild(n);
      } else if (li) {
        para = null;
        if (!list) { list = el("ul"); root.appendChild(list); }
        var item = el("li");
        inline(item, li[1]);
        list.appendChild(item);
      } else {
        list = null;
        if (!para) { para = el("p"); root.appendChild(para); }
        else para.appendChild(document.createTextNode(" "));
        inline(para, line.trim());
      }
    });
  }
  function renderNotes(rel) {
    var box = $("#news-body");
    if (!box || !rel.body) return;
    var frag = document.createDocumentFragment();
    var d = fmtDate(rel.date);
    if (d) frag.appendChild(el("p", "news-date", "פורסמה ב-" + d));
    renderMarkdown(rel.body, frag);
    box.textContent = "";
    box.appendChild(frag);
  }

  /* ---------- Motion: scroll reveal + sticky bar ---------- */
  function initReveal() {
    var items = $all(".reveal");
    if (!("IntersectionObserver" in window)) { items.forEach(function (n) { n.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (n) { io.observe(n); });
  }
  function initSticky() {
    var bar = $("#sticky-dl"), hero = $("#hero-cta"), dl = $("#download");
    if (!bar || !hero || !("IntersectionObserver" in window)) return;
    var heroVisible = true, dlVisible = false;
    function update() {
      var show = !heroVisible && !dlVisible;
      bar.classList.toggle("show", show);
      bar.setAttribute("aria-hidden", show ? "false" : "true");
      var a = $("a", bar);
      if (show) a.removeAttribute("tabindex"); else a.setAttribute("tabindex", "-1");
    }
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; update(); }).observe(hero);
    if (dl) new IntersectionObserver(function (e) { dlVisible = e[0].isIntersecting; update(); }, { threshold: 0.05 }).observe(dl);
  }

  /* ---------- Boot ---------- */
  applyShots();
  applyPlatform();
  initReveal();
  initSticky();
  requestAnimationFrame(function () { document.documentElement.classList.add("is-ready"); });

  if (typeof fetch === "function") {
    loadRelease().then(applyRelease).catch(function () {
      // Offline or rate-limited: the download links are stable "latest" URLs and keep working;
      // version, sizes and notes simply stay hidden.
      document.documentElement.classList.add("no-release");
    });
  }
})();
