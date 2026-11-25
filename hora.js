/* Hora 学堂 · 交给老师（GitHub 版）
 * 用法：<script src="…/hora.js" data-subject="地理" data-lesson="geo-l1" data-course="地理·第1课 …"></script>
 * - 页面里有 textarea[data-save] / input[data-save]：自动加「交给老师」按钮，收集所有写过的答案。
 * - 页面自己调用 window.HORA(payload, statusEl)：直接交（历史课用）。
 * 作业存进老师的 Google 表格；页面不保存任何密码。
 */
(function () {
  var URL0 = "https://script.google.com/macros/s/AKfycbypx8xahOQdJRToKhBOf-Sqwj7BihMAqTJC3loAuKi7tf8mG47c6WoMhqymsYqKexkKzA/exec";
  var me = document.currentScript || {};
  var CFG = { subject: (me.dataset && me.dataset.subject) || "", lesson: (me.dataset && me.dataset.lesson) || "", course: (me.dataset && me.dataset.course) || document.title, label: (me.dataset && me.dataset.label) || "交给老师" };
  var LS = { get: function (k) { try { return localStorage.getItem(k) } catch (e) { return null } }, set: function (k, v) { try { localStorage.setItem(k, v) } catch (e) { } } };

  function sid() { var v = LS.get("hora-sid"); if (!v) { v = Math.random().toString(36).slice(2, 10) + Date.now().toString(36); LS.set("hora-sid", v) } return v }
  function post(rec) {
    var body = JSON.stringify(rec);
    return fetch(URL0, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: body })
      .then(function (r) { return r.json() }).then(function (j) { return j && j.ok ? "ok" : "bad" })
      .catch(function () { return fetch(URL0, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: body }).then(function () { return "sent" }, function () { return "fail" }) });
  }
  /* 公共入口：payload 至少要有 name、lesson */
  window.HORA = function (p, statusEl) {
    var rec = { v: 1, subject: p.subject || CFG.subject, lesson: p.lesson || CFG.lesson, course: p.course || CFG.course, name: p.name || "", cls: p.cls || "",
      done: !!p.done, pct: p.pct == null ? "" : p.pct, fp: p.fp == null ? "" : p.fp, min: p.min || 0, summary: p.summary || "", writing: p.writing || [], code: p.code || "", sid: sid() };
    if (statusEl) statusEl.textContent = "正在交给老师……";
    return post(rec).then(function (r) {
      var ok = r === "ok" || r === "sent";
      if (statusEl) statusEl.textContent = ok ? "✓ 已经交给老师了。可以交好几次，老师看最新的一次。" : "没有交上去，可能是网络不好。请检查网络后再试一次。";
      return ok;
    });
  };

  /* ---------- 通用：收集本页写过的答案 ---------- */
  function zh(node) { var c = node.cloneNode(true); [].forEach.call(c.querySelectorAll(".en,.saved,button,script,style"), function (x) { x.remove() }); return (c.textContent || "").replace(/\s+/g, " ").trim() }
  function question(el) {
    var parts = [], n = el.previousElementSibling, k = 0;
    while (n && k < 2) {
      if (/TEXTAREA|INPUT/.test(n.tagName) || n.querySelector && n.querySelector("textarea,input[data-save]")) break;
      if (!/(^|\s)(saved|hint|head|time|rule|plan)(\s|$)/.test(n.className || "") && !/BUTTON|H2/.test(n.tagName)) { var t = zh(n); if (t) { parts.unshift(t); k++ } }
      n = n.previousElementSibling;
    }
    var q = parts.join(" ").slice(0, 300);
    var sec = el.closest && el.closest("[data-title]");
    var title = sec ? sec.getAttribute("data-title") : "";
    if (!q && el.placeholder) q = el.placeholder;
    return (title ? "【" + title + "】" : "") + q;
  }
  function collect() {
    var out = [], tot = 0;
    [].forEach.call(document.querySelectorAll("textarea[data-save],input[type=text][data-save]"), function (el) {
      tot++; var v = (el.value || "").trim(); if (!v) return;
      out.push({ id: el.getAttribute("data-save"), q: question(el), text: v });
    });
    return { list: out, total: tot };
  }

  function css() {
    if (document.getElementById("hora-css")) return;
    var s = document.createElement("style"); s.id = "hora-css";
    s.textContent = ".hora-fab{position:fixed;left:14px;bottom:14px;z-index:9998;border:0;border-radius:99px;padding:10px 16px;font:600 14px/1.2 system-ui,'Noto Sans SC',sans-serif;background:#a8321f;color:#fff;box-shadow:0 6px 18px rgba(0,0,0,.25);cursor:pointer}" +
      ".hora-fab:hover{filter:brightness(1.08)}" +
      ".hora-m{position:fixed;inset:0;z-index:9999;background:rgba(20,12,4,.55);display:grid;place-items:center;padding:16px;font-family:system-ui,'Noto Sans SC',sans-serif}" +
      ".hora-c{background:#fbf6ec;color:#2a2118;border-radius:14px;padding:22px 24px;width:min(460px,100%);box-shadow:0 18px 50px rgba(0,0,0,.35);max-height:90vh;overflow:auto}" +
      ".hora-c h2{margin:0 0 6px;font-size:20px}.hora-c p{margin:6px 0;line-height:1.6;font-size:14px;color:#5b4d3c}" +
      ".hora-c input{width:100%;box-sizing:border-box;margin:6px 0;padding:10px 12px;border:1px solid #d9c9a6;border-radius:8px;font:inherit;font-size:16px;background:#fff;color:#2a2118}" +
      ".hora-row{display:flex;gap:10px;justify-content:flex-end;margin-top:12px;flex-wrap:wrap}" +
      ".hora-b{border:1px solid #d9c9a6;background:#fff;color:#2a2118;border-radius:99px;padding:8px 16px;font:inherit;font-size:14px;cursor:pointer}.hora-b.p{background:#a8321f;border-color:#a8321f;color:#fff}" +
      ".hora-st{font-weight:600;color:#2a2118!important}" +
      "@media print{.hora-fab{display:none}}";
    document.head.appendChild(s);
  }
  function h(t, a, txt) { var e = document.createElement(t); for (var k in a || {}) e.setAttribute(k, a[k]); if (txt != null) e.textContent = txt; return e }

  function openModal() {
    var st = {}; try { st = JSON.parse(LS.get("hora-student") || "{}") } catch (e) { }
    var c = collect();
    var m = h("div", { "class": "hora-m" }), card = h("div", { "class": "hora-c" });
    m.appendChild(card); m.addEventListener("click", function (e) { if (e.target === m) m.remove() });
    card.appendChild(h("h2", null, "交给老师"));
    card.appendChild(h("p", null, CFG.course));
    var nm = h("input", { placeholder: "你的名字" }); nm.value = st.name || "";
    var cl = h("input", { placeholder: "班级（例如：初一1班）" }); cl.value = st.cls || "";
    card.appendChild(nm); card.appendChild(cl);
    card.appendChild(h("p", null, c.list.length ? "这一课你写了 " + c.list.length + " / " + c.total + " 处答案，会全部交给老师。" : "这一课你还没有写答案。先学完、写完再交。"));
    var msg = h("p", { "class": "hora-st" }, "");
    card.appendChild(msg);
    var row = h("div", { "class": "hora-row" });
    var cancel = h("button", { "class": "hora-b", type: "button" }, "关闭"); cancel.onclick = function () { m.remove() };
    var go = h("button", { "class": "hora-b p", type: "button" }, "交给老师");
    go.onclick = function () {
      var name = nm.value.trim(), cls = cl.value.trim();
      if (!name) { msg.textContent = "请先写上你的名字。"; nm.focus(); return }
      if (!c.list.length) { msg.textContent = "还没有写任何答案。"; return }
      LS.set("hora-student", JSON.stringify({ name: name, cls: cls }));
      go.disabled = true;
      var sum = "写了 " + c.list.length + " / " + c.total + " 处答案";
      window.HORA({ name: name, cls: cls, done: c.list.length >= c.total, summary: sum, writing: c.list }, msg).then(function (ok) { go.disabled = false; if (ok) go.textContent = "再交一次" });
    };
    row.appendChild(cancel); row.appendChild(go); card.appendChild(row);
    document.body.appendChild(m); if (!nm.value) nm.focus();
  }

  function init() {
    css();
    var rec = document.getElementById("mRec");
    var b = h("button", { "class": "hora-fab", type: "button" }, CFG.label);
    if (rec) { b.onclick = function () { rec.click() } }        // 历史课：打开「学习记录」
    else if (document.querySelector("textarea[data-save],input[type=text][data-save]")) { b.onclick = openModal }
    else return;
    document.body.appendChild(b);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
