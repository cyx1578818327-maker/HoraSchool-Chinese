/* Hora 学堂 · 进度自动保存（云端存档）
 * 用法：<script src="…/sync.js" data-prefix="geo71l1:"></script>（放在页面其他脚本之前，越早越好）
 *   data-prefix  本页在本机存档用的键前缀，可写多个，用逗号隔开
 *   data-ask="0" 页面自己会问名字（语文互动课），这里不另外弹出名字栏
 * 做法：本页每次往本机存档写东西，几秒后把改动存到老师的 Google 表格；关页面时立刻再存一次。
 * 打开页面时，按学生名字把云端存档取回来；云端比本机新，就用云端的并刷新一次页面。
 * 同一个名字在任何设备上打开，进度都会回来。
 */
(function () {
  if (window.HORA_SYNC) return;
  var me = document.currentScript || {}, ds = me.dataset || {};
  var URL0 = ds.url || "https://script.google.com/macros/s/__SYNC_DEPLOYMENT__/exec";
  var PRE = String(ds.prefix || "").split(",").map(function (s) { return s.trim() }).filter(Boolean);
  var ASK = ds.ask !== "0";
  var NAMEKEYS = ds.ask === "0" ? ["afg-student", "hora-student"] : ["hora-student", "afg-student"];
  if (!PRE.length || URL0.indexOf("__SYNC_") >= 0) return;
  var ls; try { ls = window.localStorage; ls.getItem("x") } catch (e) { return }
  var EXC = /teacher|-proj|^afg-class$|^afg-sid$|^hora-sid$|^hora-sync|^afg-student$|^hora-student$|^hist\.bgm$|:lang$/;
  var SP = Storage.prototype, _set = SP.setItem, _rem = SP.removeItem, _get = SP.getItem;
  function g(k) { try { return _get.call(ls, k) } catch (e) { return null } }
  function s(k, v) { try { _set.call(ls, k, v) } catch (e) { } }
  function r(k) { try { _rem.call(ls, k) } catch (e) { } }
  function mine(k) { if (EXC.test(k)) return false; for (var i = 0; i < PRE.length; i++)if (k.indexOf(PRE[i]) === 0) return true; return false }
  function norm(x) { return String(x || "").replace(/\s+/g, "").toLowerCase() }
  var META = "hora-sync-meta", M = {};
  try { M = JSON.parse(g(META) || "{}") || {} } catch (e) { M = {} }
  M.mt = M.mt || {}; M.who = M.who || {};
  function saveMeta() { s(META, JSON.stringify(M)) }
  function who() {
    for (var i = 0; i < NAMEKEYS.length; i++) { try { var o = JSON.parse(g(NAMEKEYS[i]) || "{}"); if (o && o.name && String(o.name).trim()) return { n: String(o.name).trim(), c: o.cls || "" } } catch (e) { } }
    return { n: "", c: "" };
  }

  var dirty = {}, timer = null, first = 0, pulled = false, pulling = false, frozen = false, curWho = "";
  function scan() { for (var i = 0; i < ls.length; i++) { var k = ls.key(i); if (k && mine(k)) dirty[k] = 1 } }

  /* 盯住本页对本机存档的每一次改动 */
  SP.setItem = function (k, v) {
    if (this === ls && frozen && mine(k)) return;
    _set.call(this, k, v);
    if (this !== ls) return;
    if (mine(k)) { dirty[k] = 1; sched() }
    else if (k === "hora-student" || k === "afg-student") setTimeout(onName, 0);
  };
  SP.removeItem = function (k) {
    if (this === ls && frozen && mine(k)) return;
    _rem.call(this, k);
    if (this === ls && mine(k)) { dirty[k] = 1; sched() }
  };

  /* ---------- 状态小标签 ---------- */
  var badge = null, lastOk = 0, shownOk = false, fadeT = null;
  function status(st, txt2) {
    if (st === "noname" && !ASK) return;
    if (st === "loading" || st === "saving") { if (!badge || badge.style.opacity === "0") return }   // 平常存档不打扰，只在出问题时一直显示
    if (!badge && document.body) {
      badge = document.createElement("div");
      badge.setAttribute("role", "status");
      badge.style.cssText = "position:fixed;left:8px;bottom:" + (document.querySelector(".hora-fab") || ASK ? "62px" : "6px") + ";z-index:2147483000;font:12px/1.4 system-ui,-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;background:rgba(255,253,246,.92);color:#4a3f30;border:1px solid rgba(120,100,70,.25);border-radius:99px;padding:2px 10px;pointer-events:none;box-shadow:0 1px 4px rgba(0,0,0,.12);transition:opacity .4s";
      document.body.appendChild(badge);
    }
    if (!badge) { document.addEventListener("DOMContentLoaded", function () { status(st) }, { once: true }); return }
    var t = new Date(), hm = ("0" + t.getHours()).slice(-2) + ":" + ("0" + t.getMinutes()).slice(-2);
    var txt = { loading: "☁ 正在取回云端进度…", saving: "☁ 正在保存…", ok: "☁ 已存到云端 " + hm, off: "☁ 暂时连不上网，进度先存在本机，稍后自动补存", noname: "☁ 写上名字，进度才能存到云端" }[st] || "";
    if (txt2) txt = txt2;
    clearTimeout(fadeT);
    if (st === "ok") { lastOk = Date.now(); if (shownOk && !txt2) { badge.style.opacity = "0"; return } shownOk = true; fadeT = setTimeout(function () { badge.style.opacity = "0" }, txt2 ? 6000 : 3500) }
    badge.textContent = txt; badge.style.opacity = "1";
    badge.style.color = st === "off" || st === "noname" ? "#8c2414" : "#4a3f30";
    badge.style.pointerEvents = st === "noname" ? "auto" : "none"; badge.style.cursor = st === "noname" ? "pointer" : "";
    badge.onclick = st === "noname" ? function () { bar = null; askName() } : null;
  }

  /* ---------- 存到云端 ---------- */
  function sched() {
    if (!pulled || frozen) return;
    if (!first) first = Date.now();
    clearTimeout(timer);
    timer = setTimeout(push, Math.max(300, Math.min(4000, first + 15000 - Date.now())));
  }
  function push(beacon) {
    clearTimeout(timer); timer = null; first = 0;
    var w = who(); if (!w.n || !pulled || frozen) return;
    var keys = Object.keys(dirty); if (!keys.length) return;
    var now = Date.now(), items = [];
    keys.forEach(function (k) { items.push({ k: k, t: now, base: M.mt[k] || 0, v: g(k) }) });
    dirty = {};
    var done = function (conf) {
      var bad = {}; (conf || []).forEach(function (c) { bad[c.k] = 1 });
      keys.forEach(function (k) { if (!bad[k]) M.mt[k] = now }); saveMeta();
      var take = [];
      (conf || []).forEach(function (c) {
        if (decide(c.k, c, true) === "cloud") take.push(c);
        else { M.mt[c.k] = c.t; dirty[c.k] = 1 }   // 本机的更完整：以云端这一版为底，再存一次
      });
      saveMeta();
      if (take.length) adopt(take); else { status("ok"); if (conf && conf.length) setTimeout(push, 50); else if (Object.keys(dirty).length) sched() }
    };
    var body = JSON.stringify({ act: "save", name: w.n, cls: w.c, items: items });
    var back = function () { keys.forEach(function (k) { dirty[k] = 1 }); status("off"); setTimeout(sched, 20000) };
    if (beacon && navigator.sendBeacon) { try { if (navigator.sendBeacon(URL0, new Blob([body], { type: "text/plain;charset=utf-8" }))) return } catch (e) { } }
    status("saving");
    fetch(URL0, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: body, keepalive: body.length < 60000 })
      .then(function (x) { return x.json() })
      .then(function (j) { if (j && j.ok) done(j.conflicts); else back() })
      .catch(function () {
        fetch(URL0, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: body })
          .then(function () { status("ok") }, back);   // 看不到回复：不改版本号，下次取回时再核对
      });
  }
  function flush() { if (pulled && !frozen && Object.keys(dirty).length) push(true) }
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flush() });

  /* 本机和云端不一样时用哪一份：页面可以提供 window.HORA_SYNC_PICK(键, 本机值, 云端值) → "local" / "cloud"
   * （语文互动课按“谁做得更多”来选）；没有提供，就按时间：云端更新就用云端。 */
  function decide(k, cloudItem, cloudNewer) {
    var f = window.HORA_SYNC_PICK;
    if (typeof f === "function") { try { var d = f(k, g(k), cloudItem.v); if (d === "local" || d === "cloud") return d } catch (e) { } }
    return cloudNewer ? "cloud" : "local";
  }

  /* 云端有更新的进度（别的设备存的）：用云端的，刷新页面让页面读到它 */
  function adopt(list) {
    list = list.filter(function (it) { if (g(it.k) === it.v) { M.mt[it.k] = it.t; delete dirty[it.k]; return false } return true });
    if (!list.length) { saveMeta(); status("ok"); return }
    frozen = true;   // 先挡住页面，免得页面里旧的进度又把刚取回的覆盖掉
    list.forEach(function (it) { if (it.v == null) r(it.k); else s(it.k, it.v); M.mt[it.k] = it.t; delete dirty[it.k] });
    saveMeta();
    var hist = []; try { hist = JSON.parse(sessionStorage.getItem("hora-sync-reloads") || "[]").filter(function (x) { return Date.now() - x < 60000 }) } catch (e) { }
    if (hist.length < 3) {
      hist.push(Date.now());
      try { sessionStorage.setItem("hora-sync-reloads", JSON.stringify(hist)); sessionStorage.setItem("hora-sync-restored", "1") } catch (e) { }
      location.reload(); return;
    }
    status("off", "☁ 另一台设备上有更新的进度，请刷新这个页面");
  }

  /* ---------- 从云端取回 ---------- */
  function pull() {
    var w = who();
    if (!w.n) { pulled = false; if (ASK) askName(); else status("noname"); return }
    var id = norm(w.n); curWho = id; pulling = true; status("loading");
    Promise.all(PRE.map(function (p) {
      return fetch(URL0 + "?act=all&prefix=" + encodeURIComponent(p) + "&name=" + encodeURIComponent(w.n)).then(function (x) { return x.json() });
    })).then(function (rs) {
      if (curWho !== id) return;
      var changed = [], cloud = {};
      rs.forEach(function (j, pi) {
        if (!j || !j.ok) throw new Error("bad");
        var fresh = M.who[PRE[pi]] !== id;   // 这个名字第一次在这台设备上取回
        (j.items || []).forEach(function (it) {
          if (!mine(it.k)) return;
          cloud[it.k] = 1;
          var cur = g(it.k), lt = fresh ? 0 : (M.mt[it.k] || 0);
          if (cur === it.v) { M.mt[it.k] = Math.max(lt, it.t); delete dirty[it.k]; return }
          if (decide(it.k, it, it.t > lt) === "cloud") { changed.push(it); delete dirty[it.k] }
          else { M.mt[it.k] = Math.max(lt, it.t); dirty[it.k] = 1 }
        });
      });
      for (var i = 0; i < ls.length; i++) { var k = ls.key(i); if (k && mine(k) && !cloud[k]) dirty[k] = 1 }
      PRE.forEach(function (p) { M.who[p] = id });
      pulling = false;
      if (changed.length) { pulled = true; adopt(changed); return }
      saveMeta(); pulled = true;
      var restored = false; try { restored = sessionStorage.getItem("hora-sync-restored") === "1"; sessionStorage.removeItem("hora-sync-restored") } catch (e) { }
      if (restored) status("ok", "☁ 已从云端取回你的进度"); else status("ok");
      if (Object.keys(dirty).length) sched();
    }).catch(function () {
      pulling = false;
      if (curWho !== id) return;
      status("off"); setTimeout(pull, 20000);
    });
  }
  function onName() { var w = who(); if (norm(w.n) !== curWho) { pulled = false; dirty = {}; scan(); pull() } }

  /* ---------- 没写名字的页面：顶部一条名字栏 ---------- */
  var bar = null;
  function askName() {
    if ((bar && bar !== "closed" && bar.isConnected) || !ASK) return;
    if (!document.body) { document.addEventListener("DOMContentLoaded", askName, { once: true }); return }
    status("noname");
    bar = document.createElement("form");
    bar.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:2147483001;display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center;padding:8px 12px;background:#2f4a3e;color:#fff;font:14px/1.4 system-ui,-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.25)";
    var tip = document.createElement("span"); tip.textContent = "写上你的名字，作业就会自动存到云端，换设备也不会丢：";
    var nm = document.createElement("input"); nm.placeholder = "你的名字"; nm.required = true;
    var cl = document.createElement("input"); cl.placeholder = "班级（可不填）";
    [nm, cl].forEach(function (x) { x.style.cssText = "font:inherit;padding:5px 8px;border-radius:6px;border:none;width:9em;color:#222" });
    var ok = document.createElement("button"); ok.type = "submit"; ok.textContent = "开始保存";
    ok.style.cssText = "font:inherit;padding:5px 14px;border-radius:6px;border:none;background:#e8c27a;color:#2a2118;cursor:pointer";
    var x = document.createElement("button"); x.type = "button"; x.textContent = "×"; x.title = "先不写";
    x.style.cssText = "font:inherit;background:none;border:none;color:#fff;font-size:18px;cursor:pointer";
    x.onclick = function () { bar.remove(); bar = "closed" };
    bar.append(tip, nm, cl, ok, x);
    bar.onsubmit = function (e) {
      e.preventDefault(); var n = nm.value.trim(); if (!n) return;
      _set.call(ls, "hora-student", JSON.stringify({ name: n, cls: cl.value.trim() }));
      bar.remove(); bar = "closed"; onName();
    };
    document.body.appendChild(bar);
  }

  window.HORA_SYNC = { push: function () { push() }, pull: pull, status: function () { return { pulled: pulled, dirty: Object.keys(dirty).length, who: curWho } } };
  scan();
  pull();
})();
