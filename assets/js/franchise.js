/* YuGO Rides franchise page – indicative economics calculator.
   All inputs come from the YuGO Franchise Programme 2026 brochure.
   Battery lease, Fleet Support and local/utility costs are treated as fixed for the
   fleet size; only rider revenue scales with deployment. This reproduces the brochure's
   break-even (~54% FOFO, ~48% FOCO) and payback figures at 100% deployment. */
(function () {
  'use strict';
  var REV_PER_SCOOTER = 6600;      // ₹ per scooter per month (planning assumption)
  var BATTERY_LEASE = 1500;        // ₹ per battery per month
  var DEPOSIT_PER_BATTERY = 4500;  // ₹ refundable

  var PKGS = {
    fofo50: {
      label: 'FOFO · 50 scooters', scooters: 50, batteries: 65, invest: 2600000, share: 1,
      fixed: [['Battery lease (65 × ₹1,500)', 65 * BATTERY_LEASE],
              ['YuGO Fleet Support (50 × ₹500)', 50 * 500],
              ['Illustrative local operating cost', 55000]],
      investLabel: 'Fleet investment + franchise fee',
      note: 'FOFO: you run the hub and staff. Local operating cost is an illustration and will vary by location.'
    },
    foco100: {
      label: 'FOCO · 100 scooters', scooters: 100, batteries: 130, invest: 5200000, share: 0.65,
      fixed: [['Battery lease (130 × ₹1,500)', 130 * BATTERY_LEASE],
              ['Utilities (illustrative)', 10000]],
      investLabel: 'Scooter investment',
      note: 'FOCO: YuGO runs the fleet and keeps 35% of rider revenue. Excludes tax, financing and other owner-level costs.'
    },
    foco160: {
      label: 'FOCO · 160 scooters', scooters: 160, batteries: 208, invest: 7700000, share: 0.65,
      fixed: [['Battery lease (208 × ₹1,500)', 208 * BATTERY_LEASE],
              ['Utilities (illustrative)', 15000]],
      investLabel: 'Scooter investment',
      note: 'FOCO: YuGO runs the fleet and keeps 35% of rider revenue. Excludes tax, financing and other owner-level costs.'
    }
  };

  var root = document.getElementById('calc');
  if (!root) return;
  var dep = document.getElementById('dep');
  var depOut = document.getElementById('dep-out');
  var body = document.getElementById('ledger-body');
  var facts = document.getElementById('calc-facts');

  function lakh(n) {
    var neg = n < 0; n = Math.abs(n) / 100000;
    var s = n.toFixed(n >= 2 ? 2 : 3).replace(/0+$/, '').replace(/\.$/, '');
    return (neg ? '– ' : '') + '₹' + s + 'L';
  }
  function rupees(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }
  function row(label, value, cls) {
    return '<tr' + (cls ? ' class="' + cls + '"' : '') + '><th scope="row">' + label + '</th><td>' + value + '</td></tr>';
  }

  function render() {
    var key = (root.querySelector('input[name=pkg]:checked') || {}).value || 'fofo50';
    var p = PKGS[key];
    var d = Number(dep.value) / 100;
    depOut.textContent = dep.value + '%';
    dep.setAttribute('aria-valuetext', dep.value + '% of scooters deployed');

    var gross = p.scooters * REV_PER_SCOOTER * d;
    var mine = gross * p.share;
    var fixedTotal = p.fixed.reduce(function (s, f) { return s + f[1]; }, 0);
    var cash = mine - fixedTotal;
    var be = fixedTotal / (p.scooters * REV_PER_SCOOTER * p.share);

    var html = row('Rider revenue (' + Math.round(p.scooters * d) + ' of ' + p.scooters + ' × ₹6,600)', lakh(gross));
    if (p.share < 1) html += row('Your share (65%)', lakh(mine), 'sub');
    p.fixed.forEach(function (f) { html += row(f[0], lakh(-f[1]), 'minus'); });
    html += row('Monthly cash to you', lakh(cash), cash < 0 ? 'total neg' : 'total');
    body.innerHTML = html;

    document.getElementById('r-cash').textContent = lakh(cash);
    document.getElementById('r-payback').textContent = cash <= 0 ? 'Not reached' : (p.invest / cash > 120 ? 'Over 10 years' : '~' + (p.invest / cash).toFixed(1) + ' months');
    document.getElementById('r-be').textContent = '~' + Math.round(be * 100) + '%';
    document.getElementById('calc-note').textContent = p.note;

    facts.innerHTML =
      '<div><dt>' + p.investLabel + '</dt><dd>' + lakh(p.invest) + '</dd></div>' +
      '<div><dt>Batteries (1.3× fleet)</dt><dd>' + p.batteries + '</dd></div>' +
      '<div><dt>Refundable battery deposit</dt><dd>' + lakh(p.batteries * DEPOSIT_PER_BATTERY) + '</dd></div>';
  }

  root.addEventListener('change', render);
  dep.addEventListener('input', render);
  render();

  // Expose for QA
  window.__yugoCalc = { PKGS: PKGS, REV_PER_SCOOTER: REV_PER_SCOOTER };
})();
