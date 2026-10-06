/* =====================================================================
   MATRIKA NOW · site script (no libraries, no build step)
   Progressive enhancement: every page reads fine without JavaScript.
   ===================================================================== */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var ROOT = doc.getAttribute("data-root") || "";   /* "" on the home page, "../" in sub-folders */
  var NL = String.fromCharCode(10);

  /* ---------- SETTINGS (edit here) ----------
     Paste each detail between the quotes as soon as Malvika sends it. Anything left empty
     simply stays hidden, and "Book a session" buttons go to the Contact page instead.     */
  var BOOKING_URL    = "";  /* e.g. "https://calendly.com/malvika/first-conversation" */
  var EMAIL          = "";  /* e.g. "hello@matrikanow.com" */
  var WHATSAPP       = "";  /* digits only, with country code, e.g. "919812345678" */
  var PHONE          = "";  /* as it should be shown, e.g. "+91 98123 45678" */
  var INSTAGRAM      = "";  /* full profile link */
  var FACEBOOK       = "";  /* full page link */
  var YOUTUBE        = "";  /* full channel link */
  var FORM_URL       = "";  /* optional Google Form link: contact form sends people there */
  var NEWSLETTER_URL = "";  /* optional sign-up page link (Mailchimp, Substack, Google Form...) */
  var SITE = "https://matrikanow.com/";

  /* ---------- Contact details: show only what has been filled in ---------- */
  var LINKS = {
    booking: BOOKING_URL,
    email: EMAIL && "mailto:" + EMAIL,
    whatsapp: WHATSAPP && "https://wa.me/" + WHATSAPP,
    phone: PHONE && "tel:" + PHONE.replace(/[^+0-9]/g, ""),
    instagram: INSTAGRAM, facebook: FACEBOOK, youtube: YOUTUBE,
    newsletter: NEWSLETTER_URL
  };
  var TEXT = { email: EMAIL, phone: PHONE, whatsapp: PHONE || (WHATSAPP && "+" + WHATSAPP) };
  function external(a, url) { a.href = url; if (/^https?:/.test(url)) { a.target = "_blank"; a.rel = "noopener"; } }
  document.querySelectorAll("[data-show]").forEach(function (el) {
    var k = el.getAttribute("data-show");
    if (!LINKS[k]) { el.hidden = true; return; }
    if (el.tagName === "A") external(el, LINKS[k]);
    el.querySelectorAll("[data-fill]").forEach(function (f) { if (TEXT[k]) f.textContent = TEXT[k]; });
  });
  var anyDirect = EMAIL || WHATSAPP || PHONE;
  document.querySelectorAll("[data-when-none]").forEach(function (el) { el.hidden = !!anyDirect; });

  /* "Book a session": booking link when set, otherwise the Contact page (already in the HTML) */
  function bookTo(a) { if (BOOKING_URL) external(a, BOOKING_URL); }
  document.querySelectorAll("[data-book]").forEach(bookTo);

  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var ICON_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10"/></svg><span class="sr-only">Open menu</span>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg><span class="sr-only">Close menu</span>';
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.innerHTML = open ? ICON_CLOSE : ICON_OPEN;
    };
    toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setOpen(false); toggle.focus(); } });
  }

  /* ---------- Header shadow, reading progress, back-to-top, WhatsApp, phone bar ---------- */
  var header = document.querySelector(".site-header");
  var bar = document.querySelector(".progress");
  var toTop = document.querySelector(".to-top");
  var wa = document.querySelector(".wa");
  var mbar = document.querySelector(".mbar");
  var footer = document.querySelector(".site-footer");
  var footerShown = false;
  if (mbar) document.body.classList.add("has-mbar");
  if (footer && mbar && "IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { footerShown = en[0].isIntersecting; onScroll(); }).observe(footer);
  }
  function onScroll() {
    var y = window.scrollY || 0;
    if (header) header.classList.toggle("scrolled", y > 8);
    if (bar) { var h = document.documentElement.scrollHeight - window.innerHeight; bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%"; }
    if (toTop) toTop.classList.toggle("show", y > 900);
    if (wa && !wa.hidden) wa.classList.toggle("show", y > 500);
    if (mbar) mbar.classList.toggle("show", y > 560 && !footerShown);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ---------- Home lotus: each petal names its Matrika ---------- */
  var cap = document.querySelector(".petal-cap");
  if (cap) {
    var capDefault = cap.textContent;
    document.querySelectorAll(".lotus a").forEach(function (p) {
      var show = function () { cap.textContent = p.getAttribute("data-line"); };
      p.addEventListener("mouseenter", show);
      p.addEventListener("focus", show);
      p.addEventListener("mouseleave", function () { cap.textContent = capDefault; });
      p.addEventListener("blur", function () { cap.textContent = capDefault; });
    });
  }

  /* ---------- Last quiz results, shown back on the home page ---------- */
  function remember(key, value) { try { localStorage.setItem(key, value); } catch (err) { /* private mode */ } }
  function recall(key) { try { return localStorage.getItem(key); } catch (err) { return null; } }
  document.querySelectorAll("[data-last]").forEach(function (el) {
    var v = recall("mn-" + el.getAttribute("data-last"));
    if (v) { el.querySelector("b").textContent = v; el.hidden = false; }
  });

  /* ---------- Dosha tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  function showTab(id, focus) {
    tabs.forEach(function (t) {
      var on = t.getAttribute("aria-controls") === id;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    document.querySelectorAll(".panel").forEach(function (p) { p.classList.toggle("show", p.id === id); });
  }
  if (tabs.length) {
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { showTab(t.getAttribute("aria-controls")); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (d) { e.preventDefault(); showTab(tabs[(i + d + tabs.length) % tabs.length].getAttribute("aria-controls"), true); }
      });
    });
    var fromHash = (location.hash || "").slice(1);
    var target = document.getElementById(fromHash);
    showTab(target && target.classList.contains("panel") ? fromHash : tabs[0].getAttribute("aria-controls"));
    window.addEventListener("hashchange", function () {
      var p = document.getElementById(location.hash.slice(1));
      if (p && p.classList.contains("panel")) showTab(p.id);
    });
  }

  /* ---------- Workshops: past or upcoming is worked out from the date, and upcoming ones
     get an "Add to my calendar" file. Times in the HTML carry their own offset (+05:30 = India). */
  var TZ = "Asia/Kolkata";
  function fmtDate(d) { return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: TZ }); }
  function icsTime(d) { return d.toISOString().slice(0, 19).split("-").join("").split(":").join("") + "Z"; }
  function icsText(s) { return String(s || "").replace(/[,;]/g, " "); }
  document.querySelectorAll("[data-event]").forEach(function (ev) {
    var start = new Date(ev.getAttribute("data-start"));
    var end = new Date(ev.getAttribute("data-end"));
    if (isNaN(start) || isNaN(end)) return;
    var past = Date.now() > end.getTime();
    ev.classList.toggle("is-past", past);
    var st = ev.querySelector(".status");
    if (st) st.textContent = past ? "Held on " + fmtDate(start) : "Upcoming · " + fmtDate(start);
    var cal = ev.querySelector("[data-ics]");
    if (cal) cal.addEventListener("click", function () {
      var CRLF = String.fromCharCode(13, 10);
      var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Matrika Now//Workshop//EN", "BEGIN:VEVENT",
        "UID:" + icsTime(start) + "@matrikanow.com", "DTSTAMP:" + icsTime(new Date()),
        "DTSTART:" + icsTime(start), "DTEND:" + icsTime(end),
        "SUMMARY:" + icsText(ev.getAttribute("data-title")),
        "DESCRIPTION:" + icsText(ev.getAttribute("data-desc")),
        "LOCATION:" + icsText(ev.getAttribute("data-location")),
        "URL:" + SITE + "workshops/", "END:VEVENT", "END:VCALENDAR"].join(CRLF);
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
      a.download = "matrika-now-workshop.ics";
      document.body.appendChild(a); a.click(); a.remove();
    });
  });

  /* ---------- Forms (contact + newsletter) ----------
     Order of preference: FORM_URL / NEWSLETTER_URL → email app → WhatsApp → polite holding note. */
  var about = new URLSearchParams(location.search).get("about");
  if (about) {
    var msg = document.querySelector("#f-message");
    if (msg && !msg.value) msg.value = "I would like to talk about my " + about + ".";
    var sel = document.querySelector("#f-interest");
    if (sel) sel.value = "Not sure yet, let's talk";
  }
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    var note = form.querySelector(".form-note");
    var say = function (m, warn) { if (note) { note.textContent = m; note.classList.toggle("warn", !!warn); } };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var topic = form.getAttribute("data-form");
      var lines = [];
      form.querySelectorAll("[name]").forEach(function (f) {
        if (f.type === "checkbox" || !f.value) return;
        var l = form.querySelector('label[for="' + f.id + '"]');
        lines.push((l ? l.textContent : f.name).trim() + ": " + f.value);
      });
      var dest = topic === "Newsletter" ? (NEWSLETTER_URL || FORM_URL) : FORM_URL;
      if (dest) {
        window.open(dest, "_blank", "noopener");
        say("Thank you. The sign-up form has opened in a new tab.");
      } else if (EMAIL) {
        window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Matrika Now: " + topic) + "&body=" + encodeURIComponent(lines.join(NL) + NL + NL + "(Sent from matrikanow.com)");
        say("Thank you. Your email app should open with your message ready to send.");
      } else if (WHATSAPP) {
        window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent("Hello Malvika, " + NL + lines.join(NL)), "_blank", "noopener");
        say("Thank you. WhatsApp has opened with your message ready to send.");
      } else {
        say("Thank you for reaching out. Online messages are being set up and will open here very soon, so please check back in a few days.", true);
      }
    });
  });

  /* =====================================================================
     QUIZZES. Results are worked out in the browser; nothing is stored on a
     server or sent anywhere. The last result is kept on this device only.
     ===================================================================== */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function bookHref(label) { return BOOKING_URL || ROOT + "contact/?about=" + encodeURIComponent(label); }
  function shareRow(text, url) {
    var wa = "https://wa.me/?text=" + encodeURIComponent(text + " " + url);
    return '<a class="btn btn-soft" href="' + wa + '" target="_blank" rel="noopener">Share on WhatsApp</a>' +
      (navigator.share ? '<button class="btn btn-soft" type="button" data-share>Share…</button>' : "");
  }
  function wireShare(root, text, url) {
    var b = root.querySelector("[data-share]");
    if (b) b.addEventListener("click", function () { navigator.share({ title: "Matrika Now", text: text, url: url }).catch(function () {}); });
  }

  function Quiz(root, questions, keys, onDone) {
    var answers = [];
    var startHTML = root.innerHTML;
    function render(i) {
      var q = questions[i];
      var html = '<div class="qtop"><span>Question ' + (i + 1) + " of " + questions.length + '</span><span>' + Math.round((i / questions.length) * 100) + '%</span></div>' +
        '<div class="qbar" aria-hidden="true"><i style="width:' + (i / questions.length) * 100 + '%"></i></div>' +
        '<h3 class="qtitle" tabindex="-1">' + esc(q.q) + '</h3><div class="qopts">';
      q.a.forEach(function (opt, j) {
        html += '<button type="button" class="qopt" aria-pressed="' + (answers[i] === j ? "true" : "false") + '" data-j="' + j + '"><span class="dot" aria-hidden="true"></span><span>' + esc(opt[0]) + "</span></button>";
      });
      html += '</div><div class="qnav"><button type="button" class="qback"' + (i === 0 ? " disabled" : "") + '>← Back</button></div>';
      root.innerHTML = html;
      root.querySelector(".qtitle").focus({ preventScroll: true });
      root.querySelectorAll(".qopt").forEach(function (b) {
        b.addEventListener("click", function () {
          answers[i] = +b.getAttribute("data-j");
          root.querySelectorAll(".qopt").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
          setTimeout(function () { if (i + 1 < questions.length) render(i + 1); else finish(); }, 260);
        });
      });
      root.querySelector(".qback").addEventListener("click", function () { if (i > 0) render(i - 1); });
    }
    function finish() {
      var scores = {};
      keys.forEach(function (k) { scores[k] = 0; });
      answers.forEach(function (j, i) { questions[i].a[j][1].forEach(function (k) { scores[k] += 1; }); });
      root.innerHTML = onDone(scores);
      var again = document.createElement("button");
      again.type = "button"; again.className = "qback"; again.textContent = "↻ Take it again";
      again.addEventListener("click", function () { answers = []; render(0); });
      var p = document.createElement("p"); p.style.marginTop = "14px"; p.appendChild(again);
      root.querySelector(".result").appendChild(p);
      root.querySelectorAll("[data-book]").forEach(bookTo);
      setTimeout(function () { root.querySelectorAll("[data-w]").forEach(function (b) { b.style.width = b.getAttribute("data-w"); }); }, 60);
      var h = root.querySelector(".rname"); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
      root.scrollIntoView({ behavior: "smooth", block: "start" });
      if (root._after) root._after();
    }
    root.addEventListener("click", function (e) {
      if (e.target.closest("[data-qstart]")) { e.preventDefault(); render(0); root.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
    return { start: startHTML };
  }

  /* ---- Which Matrika are you? (each answer adds a point to one or two archetypes) ---- */
  var A = ["nurturer", "catalyst", "seeker", "builder", "visionary", "anchor", "alchemist"];
  var AQ = [
    { q: "When someone close to you is going through a hard time, you are most likely to…", a: [
      ["Check in, cook, and make sure they are looked after", ["nurturer"]],
      ["Help them make a plan and take the first step", ["catalyst", "builder"]],
      ["Sit quietly with them, so they feel less alone", ["anchor"]],
      ["Help them see what this moment might be teaching them", ["alchemist", "seeker"]]] },
    { q: "On a free Sunday, you are drawn to…", a: [
      ["Reading, journaling or a long walk with your own thoughts", ["seeker"]],
      ["Sorting, fixing or finishing something that has been waiting", ["builder"]],
      ["Dreaming up a new idea, trip or plan", ["visionary"]],
      ["Unhurried time with the people you love", ["nurturer", "anchor"]]] },
    { q: "In a group, people tend to rely on you for…", a: [
      ["Energy, and getting things moving", ["catalyst"]],
      ["Calm, when things get tense", ["anchor"]],
      ["Fresh ideas and the bigger picture", ["visionary"]],
      ["Making sense of what is really going on underneath", ["alchemist"]]] },
    { q: "Change, for you, usually feels like…", a: [
      ["Exciting. You are often the one who starts it", ["catalyst", "visionary"]],
      ["Something to prepare for carefully", ["builder"]],
      ["A doorway to something deeper", ["seeker", "alchemist"]],
      ["Unsettling, until you know everyone is all right", ["nurturer", "anchor"]]] },
    { q: "The question you ask yourself most often is…", a: [
      ["“What does all of this mean?”", ["seeker"]],
      ["“What could this become?”", ["visionary"]],
      ["“Is everyone okay?”", ["nurturer"]],
      ["“What needs to happen next?”", ["catalyst", "builder"]]] },
    { q: "When you are stressed, you tend to…", a: [
      ["Give more and forget your own needs", ["nurturer"]],
      ["Push harder and move faster", ["catalyst"]],
      ["Hold everything together, and quietly carry it", ["builder", "anchor"]],
      ["Go inward and turn it over and over", ["seeker", "alchemist"]]] },
    { q: "You feel most alive when you are…", a: [
      ["Building something that will last", ["builder"]],
      ["Imagining what does not exist yet", ["visionary"]],
      ["Walking with someone through a real transformation", ["alchemist"]],
      ["Being a steady place where others can land", ["anchor"]]] },
    { q: "People who know you well might describe you as…", a: [
      ["Warm and caring", ["nurturer"]],
      ["Bold and driven", ["catalyst"]],
      ["Imaginative and inspiring", ["visionary"]],
      ["Deep and intense", ["alchemist", "seeker"]]] }
  ];
  var aRoot = document.getElementById("archetype-quiz");
  if (aRoot) {
    Quiz(aRoot, AQ, A, function (s) {
      var order = A.slice().sort(function (x, y) { return s[y] - s[x] || A.indexOf(x) - A.indexOf(y); });
      var top = order[0], next = order[1];
      var card = document.getElementById("a-" + top);
      var get = function (sel) { var n = card.querySelector(sel); return n ? n.innerHTML : ""; };
      var name = card.querySelector("h3").textContent;
      var nextName = document.getElementById("a-" + next).querySelector("h3").textContent;
      remember("mn-archetype", name);
      var text = "I took the Matrika Now reflection and my Matrika is " + name + ". Which one are you?";
      aAfterText = text;
      return '<div class="result"><span class="note">Your Matrika</span>' +
        '<div class="ic">' + get(".ic") + '</div><h3 class="rname">' + esc(name) + '</h3>' +
        '<p class="essence">' + get(".essence") + '</p><p class="balance">' + get(".balance") + '</p>' +
        '<div class="box"><p class="shadow-line">' + get(".shadow-line") + '</p><p class="ask">' + get(".ask") + '</p></div>' +
        (s[next] > 0 ? '<p class="also">A strong second thread in you: <strong>' + esc(nextName) + '</strong>. <a href="#a-' + next + '">Read about it</a></p>' : "") +
        '<div class="cta-row"><a class="btn btn-coral" data-book href="' + bookHref("archetype reflection result: " + name) + '">Explore this with Malvika</a>' + shareRow(text, SITE + "archetypes/#quiz") + '</div>' +
        '<p class="small">Archetypes are mirrors, not boxes. Most of us carry several; this simply shows the one that is loudest right now.</p></div>';
    });
    var aAfterText = "";
    aRoot._after = function () { wireShare(aRoot, aAfterText, SITE + "archetypes/#quiz"); };
  }

  /* ---- Dosha reflection (each answer = one dosha) ---- */
  var D = ["vata", "pitta", "kapha"];
  var DQ = [
    { q: "Your natural build is…", a: [["Light and slender; you find it hard to put on weight", ["vata"]], ["Medium and athletic", ["pitta"]], ["Solid and strong; you gain weight easily", ["kapha"]]] },
    { q: "Your skin and body temperature tend to be…", a: [["Dry, with cold hands and feet", ["vata"]], ["Warm; you flush or overheat easily", ["pitta"]], ["Smooth, soft and cool", ["kapha"]]] },
    { q: "Your appetite is…", a: [["Irregular; you sometimes forget to eat", ["vata"]], ["Strong; you get irritable when a meal is late", ["pitta"]], ["Steady; you can skip a meal without much trouble", ["kapha"]]] },
    { q: "Your sleep is usually…", a: [["Light, and easily disturbed", ["vata"]], ["Moderate; you wake up alert", ["pitta"]], ["Deep and long; mornings are slow", ["kapha"]]] },
    { q: "Under stress, you tend to become…", a: [["Anxious, worried or scattered", ["vata"]], ["Irritable, critical or intense", ["pitta"]], ["Withdrawn, heavy or stubborn", ["kapha"]]] },
    { q: "When you learn something new, you are…", a: [["Quick to learn, and quick to forget", ["vata"]], ["Sharp, focused and precise", ["pitta"]], ["Slower to learn, and you never forget", ["kapha"]]] },
    { q: "Your natural pace through the day is…", a: [["Quick; always on the move", ["vata"]], ["Purposeful and driven", ["pitta"]], ["Calm and unhurried", ["kapha"]]] },
    { q: "The weather you like least is…", a: [["Cold and windy", ["vata"]], ["Hot and humid", ["pitta"]], ["Cold and damp", ["kapha"]]] }
  ];
  var dRoot = document.getElementById("dosha-quiz");
  if (dRoot) {
    var dText = "";
    Quiz(dRoot, DQ, D, function (s) {
      var total = DQ.length;
      var order = D.slice().sort(function (x, y) { return s[y] - s[x] || D.indexOf(x) - D.indexOf(y); });
      var top = order[0], sec = order[1];
      var panel = document.getElementById("d-" + top);
      var nm = function (k) { return document.getElementById("d-" + k).querySelector("h3").textContent; };
      var dual = s[top] - s[sec] <= 1 && s[sec] > 0;
      var label = dual ? nm(top) + "–" + nm(sec) : nm(top);
      remember("mn-dosha", label);
      dText = "I took the Matrika Now dosha reflection and my leading energy is " + label + ". What is yours?";
      var pcts = {};
      D.forEach(function (k) { pcts[k] = Math.round((s[k] / total) * 100); });
      pcts[top] += 100 - pcts.vata - pcts.pitta - pcts.kapha;   /* rounding: always add up to 100 */
      var bars = D.map(function (k) {
        var pct = pcts[k];
        return '<div class="' + k.charAt(0) + '"><span>' + esc(nm(k)) + '</span><span class="track"><i data-w="' + pct + '%"></i></span><span>' + pct + '%</span></div>';
      }).join("");
      var get = function (sel) { var n = panel.querySelector(sel); return n ? n.innerHTML : ""; };
      return '<div class="result"><span class="note">Your leading energy right now</span><h3 class="rname">' + esc(label) + '</h3>' +
        '<p class="energy" style="margin-bottom:.2em">' + get(".energy") + '</p>' +
        '<div class="bars" role="img" aria-label="' + D.map(function (k) { return nm(k) + " " + pcts[k] + "%"; }).join(", ") + '">' + bars + '</div>' +
        '<div class="box"><p><strong>You may recognise yourself if</strong> ' + get("[data-recognise]") + '</p><p><strong>A small ritual</strong> ' + get("[data-ritual]") + '</p></div>' +
        (dual ? '<p class="also">Two energies are close in you, so read about <a href="#d-' + top + '">' + esc(nm(top)) + '</a> and <a href="#d-' + sec + '">' + esc(nm(sec)) + '</a>.</p>' : "") +
        '<div class="cta-row"><a class="btn btn-coral" data-book href="' + bookHref("dosha reflection result: " + label) + '">Explore this with Malvika</a>' + shareRow(dText, SITE + "doshas/#quiz") + '</div>' +
        '<p class="small">Most of us carry all three, in our own proportion. This is a gentle reflection, not a medical assessment.</p></div>';
    });
    dRoot._after = function () {
      wireShare(dRoot, dText, SITE + "doshas/#quiz");
      dRoot.querySelectorAll('a[href^="#d-"]').forEach(function (a) { a.addEventListener("click", function () { showTab(a.getAttribute("href").slice(1)); }); });
    };
  }
})();
