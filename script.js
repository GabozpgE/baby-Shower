/* ══════════════════════════════════════════════════════
   Baby Shower · Gonzalo
   Apertura del sobre · cuenta regresiva · reveals
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

    // 1) se abre la solapa y cae el sello
    pantalla.classList.add('is-opening');

    // 2) sale la carta
    window.setTimeout(function () {
      pantalla.classList.add('is-out');
    }, 720);

    // 3) la carta crece y se convierte en la invitación
    window.setTimeout(function () {
      pantalla.classList.add('is-zoom');
      desbloquear();
    }, 1760);

    // 4) se retira la pantalla del sobre
    window.setTimeout(function () {
      pantalla.classList.add('is-gone');
    }, 2180);

    window.setTimeout(function () {
      pantalla.style.display = 'none';
      window.scrollTo(0, 0);
    }, 3050);
  }

  if (boton) {
    boton.addEventListener('click', abrirSobre);
    // toda la pantalla es tocable
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
      void el.offsetWidth; // reinicia la animación
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
    var dias = Math.floor(totalMin / 1440);
    var horas = Math.floor((totalMin % 1440) / 60);
    var minutos = totalMin % 60;

    pintar(elDias, dosDigitos(dias), 'd');
    pintar(elHoras, dosDigitos(horas), 'h');
    pintar(elMin, dosDigitos(minutos), 'm');
    return true;
  }

  if (elDias) {
    actualizar();
    var reloj = window.setInterval(function () {
      if (!actualizar()) window.clearInterval(reloj);
    }, 1000);

    // al volver a la pestaña, refresca de inmediato
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) actualizar();
    });
  }

  /* ══════════════════════════════════════════════════
     3 · Aparición de secciones al hacer scroll
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
