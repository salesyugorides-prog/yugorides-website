/* YuGO Rides – site behaviour (no tracking, no third-party scripts) */
(function () {
  'use strict';

  /* ---- Franchise enquiry destination ----------------------------------
     Paste the Google Apps Script web-app URL here once it is deployed
     (see _backend/franchise-enquiries.gs). While this is empty the form
     stays hidden and visitors see the call / WhatsApp / email options,
     so no enquiry is ever accepted without a real place to send it. */
  var ENQUIRY_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwbznWp-YxA2ApKv7KUV-PwnY_KgDlV85xtHZDsFZDi7Grs1-S70ugq9l4Urz3rsncQ/exec';

  // Current year in footer
  var yr = document.querySelectorAll('[data-year]');
  for (var i = 0; i < yr.length; i++) yr[i].textContent = String(new Date().getFullYear());

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); toggle.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 960) setOpen(false); });
  }

  // Franchise enquiry form
  var form = document.getElementById('fr-form');
  var fallback = document.getElementById('fr-fallback');
  if (!form) return;
  if (!ENQUIRY_ENDPOINT) { form.hidden = true; if (fallback) fallback.hidden = false; return; }
  form.hidden = false; if (fallback) fallback.hidden = true;

  var status = document.getElementById('fr-status');
  var btn = document.getElementById('fr-submit');
  var say = function (msg, cls) { status.textContent = msg; status.className = 'form-status ' + (cls || ''); };
  var errFor = function (el) { return document.getElementById(el.id + '-err'); };

  var check = function (el) {
    var msg = '';
    var v = el.value.trim();
    if (el.required && !v) msg = 'This field is required.';
    else if (el.id === 'fr-phone' && v && !/^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(v)) msg = 'Enter a 10-digit Indian mobile number.';
    else if (el.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = 'Enter a valid email address.';
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    var e = errFor(el); if (e) e.textContent = msg;
    return !msg;
  };
  var fields = form.querySelectorAll('input:not(.hp input), select, textarea');
  for (var j = 0; j < fields.length; j++) fields[j].addEventListener('blur', function (e) { if (e.target.value) check(e.target); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var first = null;
    for (var k = 0; k < fields.length; k++) { if (!check(fields[k]) && !first) first = fields[k]; }
    if (first) { say('Please correct the highlighted fields.', 'err'); first.focus(); return; }
    if (form.elements.website && form.elements.website.value) return; // bot trap

    var data = {};
    new FormData(form).forEach(function (v, key) { if (key !== 'website') data[key] = String(v).trim(); });
    data.page = location.href;

    btn.disabled = true;
    say('Sending your enquiry…', 'busy');
    fetch(ENQUIRY_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j || !j.ok) throw new Error('rejected');
        form.reset();
        say('Thank you. Your franchise enquiry has been sent to the YuGO Rides team.', 'ok');
      })
      .catch(function () {
        say('Your enquiry could not be sent. Please call +91 80805 13935 or +91 91753 24002.', 'err');
      })
      .then(function () { btn.disabled = false; });
  });
})();
