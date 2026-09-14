/* ══════════════════════════════════════════════════════
   Baby Shower · Gonzalo · tema safari
   Sobre · pasto · cuenta regresiva · reveals
   ══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Fecha del evento ──────────────────────────────
     Sábado 10 de octubre de 2026, 5:00 PM
     Uruapan, Mich. — México ya no aplica horario de
     verano, así que el huso es UTC-06:00 todo el año. */
  var EVENTO = new Date('2026-10-10T17:00:00-06:00');

  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ══════════════════════════════════════════════════
     0 · Pasto generado (ligero, sin imágenes)
     ══════════════════════════════════════════════════ */

  // azar determinista: el pasto se ve igual en cada carga
  function azar(n) {
    var x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  var VERDES = [
    ['#CDEAAD', '#8CBF6E'],
    ['#B7DC97', '#6BA453'],
    ['#A5D086', '#5C9748'],
    ['#DCF1BE', '#98CB7C'],
    ['#9CC97B', '#4F8542']
  ];

  function sembrarPasto(caja) {
    var total = parseInt(caja.getAttribute('data-blades'), 10) || 18;
    var alto = parseInt(caja.getAttribute('data-h'), 10) || 48;
    var capa = caja.getAttribute('data-layer') || '';
    var perfilAlas = caja.getAttribute('data-profile') === 'wings';
    var semilla = capa.length * 37 + total + alto;
    var trozo = document.createDocumentFragment();

    caja.style.setProperty('--gh', alto + 'px');

    for (var i = 0; i < total; i++) {
      var t = (i + 0.5) / total;                 // 0 → izquierda, 1 → derecha
      var r1 = azar(semilla + i * 3.1);
      var r2 = azar(semilla + i * 7.7 + 5);
      var r3 = azar(semilla + i * 13.3 + 11);

      var orilla = Math.abs(t - 0.5) * 2;        // 0 al centro, 1 en las orillas
      var x = t * 100 + (r1 - 0.5) * (80 / total);
      // "wings": las hojas altas quedan a los lados, no tapan la foto
      var perfil = perfilAlas
        ? 1 - Math.min(1, Math.abs(orilla - 0.52) * 1.9)
        : 1 - orilla;
      var h = alto * (0.58 + 0.42 * perfil) * (0.80 + 0.38 * r2);
      var w = Math.max(4.5, h * 0.135 * (0.82 + 0.36 * r3));
      var giro = (x - 50) * 0.13 + (r2 - 0.5) * 15;
      var vaiven = 3 + r3 * 5;
      var verde = VERDES[Math.floor(r1 * VERDES.length) % VERDES.length];
      // las hojas del centro se abren más
      var apertura = (t < 0.5 ? -1 : 1) * (10 + 26 * (1 - orilla));

      var hoja = document.createElement('i');
      hoja.className = 'bl';
      hoja.style.cssText =
        '--x:' + x.toFixed(2) + '%;' +
        '--w:' + w.toFixed(1) + 'px;' +
        '--h:' + h.toFixed(1) + 'px;' +
        '--r:' + giro.toFixed(1) + ';' +
        '--a:' + vaiven.toFixed(1) + ';' +
        '--p:' + apertura.toFixed(1) + ';' +
        '--d:' + (r2 * 3.4).toFixed(2) + 's;' +
        '--sd:' + (3.2 + r3 * 2.2).toFixed(2) + 's;' +
        '--c1:' + verde[0] + ';--c2:' + verde[1] + ';' +
        'z-index:' + Math.round(h);
      hoja.appendChild(document.createElement('b'));
      trozo.appendChild(hoja);
    }
    caja.appendChild(trozo);
  }

  var pastos = document.querySelectorAll('.grass');
  Array.prototype.forEach.call(pastos, sembrarPasto);

  // solo se mece el pasto que está a la vista
  if ('IntersectionObserver' in window) {
    var obsPasto = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        e.target.classList.toggle('on', e.isIntersecting);
      });
    }, { rootMargin: '120px 0px' });
    Array.prototype.forEach.call(pastos, function (g) { obsPasto.observe(g); });
  } else {
    Array.prototype.forEach.call(pastos, function (g) { g.classList.add('on'); });
  }

  /* ══════════════════════════════════════════════════
     1 · Apertura del sobre
     ══════════════════════════════════════════════════ */
  var pantalla = $('pantallaSobre');
  var boton = $('btnSobre');
  var invitacion = $('invitacion');
  var abierto = false;

  function desbloquear() {
    document.body.classList.remove('is-locked');
    invitacion.setAttribute('aria-hidden', 'false');
    invitacion.classList.add('is-live');
  }

  function abrirSobre() {
    if (abierto) return;
    abierto = true;
    boton.setAttribute('aria-expanded', 'true');
    boton.disabled = true;

    if (reduce) {
      pantalla.classList.add('is-gone');
      desbloquear();
      window.setTimeout(function () { pantalla.style.display = 'none'; }, 200);
      return;
    }

    pantalla.classList.add('is-opening');                                    // solapa + sello
    window.setTimeout(function () { pantalla.classList.add('is-out'); }, 720);  // sale la carta
    window.setTimeout(function () {                                          // la carta se vuelve la página
      pantalla.classList.add('is-zoom');
      desbloquear();
    }, 1760);
    window.setTimeout(function () { pantalla.classList.add('is-gone'); }, 2180);
    window.setTimeout(function () {
      pantalla.style.display = 'none';
      window.scrollTo(0, 0);
    }, 3050);
  }

  if (boton) {
    boton.addEventListener('click', abrirSobre);
    pantalla.addEventListener('click', function (e) {
      if (e.target !== boton && !boton.contains(e.target)) abrirSobre();
    });
  }

  /* ══════════════════════════════════════════════════
     2 · Cuenta regresiva
     ══════════════════════════════════════════════════ */
  var elDias = $('cdDias');
  var elHoras = $('cdHoras');
  var elMin = $('cdMinutos');
  var elMsg = $('cdMsg');
  var previo = { d: null, h: null, m: null };

  function pintar(el, valor, clave) {
    if (previo[clave] === valor) return;
    previo[clave] = valor;
    el.textContent = valor;
    if (!reduce) {
      el.classList.remove('tick');
      void el.offsetWidth;
      el.classList.add('tick');
    }
  }

  function dosDigitos(n) { return n < 10 ? '0' + n : String(n); }

  function actualizar() {
    var restante = EVENTO.getTime() - Date.now();

    if (restante <= 0) {
      pintar(elDias, '00', 'd');
      pintar(elHoras, '00', 'h');
      pintar(elMin, '00', 'm');
      elMsg.textContent = '¡Hoy es el gran día!';
      elMsg.classList.add('party');
      return false;
    }

    var totalMin = Math.floor(restante / 60000);
    pintar(elDias, dosDigitos(Math.floor(totalMin / 1440)), 'd');
    pintar(elHoras, dosDigitos(Math.floor((totalMin % 1440) / 60)), 'h');
    pintar(elMin, dosDigitos(totalMin % 60), 'm');
    return true;
  }

  if (elDias) {
    actualizar();
    var reloj = window.setInterval(function () {
      if (!actualizar()) window.clearInterval(reloj);
    }, 1000);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) actualizar();
    });
  }

  /* ══════════════════════════════════════════════════
     3 · El claro: el pasto se abre y sale la foto
     ══════════════════════════════════════════════════ */
  var claro = $('clearing');

  function abrirPasto() {
    claro.classList.add('go');
    var capas = claro.querySelectorAll('.grass');
    Array.prototype.forEach.call(capas, function (g) {
      g.classList.add('parting');
    });
    window.setTimeout(function () {
      Array.prototype.forEach.call(capas, function (g) {
        g.classList.remove('parting');
      });
    }, 1800);
  }

  if (claro && !reduce) {
    claro.classList.add('js-ready');
    if ('IntersectionObserver' in window) {
      var obsClaro = new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) { abrirPasto(); obsClaro.disconnect(); }
      }, { threshold: 0.35 });
      obsClaro.observe(claro);
    } else {
      abrirPasto();
    }
  }

  /* ══════════════════════════════════════════════════
     4 · Aparición de secciones al hacer scroll
     ══════════════════════════════════════════════════ */
  var bloques = document.querySelectorAll('.reveal');

  if (reduce || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(bloques, function (b) { b.classList.add('in'); });
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    Array.prototype.forEach.call(bloques, function (b) { obs.observe(b); });
  }
})();
