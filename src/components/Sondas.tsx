import {useEffect, useRef} from 'react';
import {C, SONDAS, UA, sondaUrl, sondas} from '../content';
import {useAparecer} from '../hooks/useAparecer';
import {enCadaFotograma} from '../lib/scroll';

/**
 * Cinco naves saliendo del sistema solar. Regla logarítmica de 0,5 a 100.000 UA con planetas,
 * heliopausa y borde de la nube de Oort; cada sonda en su distancia de ahora mismo.
 * Distancia en vivo: d(t) = km + km/s · (t − época), con los vectores de JPL Horizons.
 * Las cifras se reescriben en el bucle de fotogramas solo cuando la sección está a la vista.
 */

const D = SONDAS.sondas as Record<string, {km: number; kms: number}>;
const EPOCA = Date.parse(SONDAS.epoca);
const L0 = Math.log10(0.5);
const L1 = Math.log10(100_000);
const pos = (ua: number) => ((Math.log10(ua) - L0) / (L1 - L0)) * 100;
const kmAhora = (id: string, t = Date.now()) => D[id].km + D[id].kms * ((t - EPOCA) / 1000);
const fmt = (v: number, d = 0) => v.toLocaleString('es-ES', {maximumFractionDigits: d, minimumFractionDigits: d});

function luz(km: number) {
  const min = km / C / 60;
  const h = Math.floor(min / 60);
  return `${h} h ${fmt(Math.floor(min - h * 60))} min`;
}

export function Sondas() {
  const ref = useAparecer<HTMLElement>();
  const kmRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const luzRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const puntoRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let ultimo = 0;
    return enCadaFotograma((t) => {
      const raiz = ref.current;
      if (!raiz || t - ultimo < 100) return;
      const r = raiz.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      ultimo = t;
      const ahora = Date.now();
      sondas.lista.forEach((s, k) => {
        const km = kmAhora(s.id, ahora);
        const k1 = kmRefs.current[k];
        if (k1) k1.textContent = fmt(km);
        const l = luzRefs.current[k];
        if (l) l.textContent = luz(km);
        const pt = puntoRefs.current[k];
        if (pt) pt.style.left = `${pos(km / UA)}%`;
      });
    });
  }, [ref]);

  return (
    <section ref={ref} id="sondas" aria-labelledby="sondas-titulo" className="border-t border-linea bg-void py-[14svh]">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 md:px-[4vw]">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:items-end">
          <div>
            <p data-aparece className="etiqueta text-oro">
              {sondas.antetitulo}
            </p>
            <h2 id="sondas-titulo" data-aparece style={{'--i': 1} as React.CSSProperties} className="mt-1 font-display text-display">
              {sondas.titulo}
            </h2>
            <p data-aparece style={{'--i': 2} as React.CSSProperties} className="mt-4 max-w-[38rem] text-body text-texto-2">
              {sondas.cuerpo}
            </p>
          </div>
          <p data-aparece style={{'--i': 3} as React.CSSProperties} className="border-l-2 border-oro pl-4 font-display text-[clamp(1.25rem,2vw,1.75rem)] leading-snug italic">
            {sondas.hito}
          </p>
        </div>

        {/* Regla logarítmica */}
        <div data-aparece style={{'--i': 2} as React.CSSProperties} className="relative mt-16 h-44 md:h-40" role="img" aria-label={`${sondas.titulo}. ${sondas.uaExplica}`}>
          <div className="absolute inset-x-0 top-1/2 h-px bg-linea" />
          <div className="absolute top-1/2 h-px bg-[linear-gradient(to_right,transparent,var(--color-azul))] opacity-50" style={{left: `${pos(2000)}%`, right: 0}} />
          <div className="absolute top-1/2 left-0 size-3 -translate-1/2 rounded-full bg-oro shadow-[0_0_18px_var(--color-oro)]" />
          {[1, 10, 100, 1000, 10000, 100000].map((u) => (
            <div key={u} className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-texto-3" style={{left: `${pos(u)}%`}}>
              <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[0.625rem] whitespace-nowrap text-texto-3 tabular-nums">
                {fmt(u)} {sondas.ua}
              </span>
            </div>
          ))}
          {sondas.marcas.map((m, k) => (
            <div key={m.nombre} className="absolute top-1/2" style={{left: `${pos(m.ua)}%`}}>
              <div className="absolute size-1.5 -translate-1/2 rounded-full bg-texto-2" />
              <span
                className={`absolute left-0 max-w-[7rem] -translate-x-1/2 text-center text-[0.6875rem] leading-tight text-texto-2 md:max-w-none md:whitespace-nowrap ${k % 2 ? 'top-8' : 'top-14'}`}
              >
                {m.nombre}
              </span>
            </div>
          ))}
          {sondas.lista.map((s, k) => (
            <div
              key={s.id}
              ref={(el) => {
                puntoRefs.current[k] = el;
              }}
              className="absolute top-1/2"
              style={{left: `${pos(kmAhora(s.id) / UA)}%`}}
            >
              <div className={`absolute size-2.5 -translate-1/2 rotate-45 ${s.vivo ? 'bg-oro' : 'border border-oro'}`} />
              <span className="absolute bottom-3 left-0 -translate-x-1/2 text-[0.6875rem] whitespace-nowrap text-oro" style={{bottom: `${12 + k * 15}px`}}>
                {s.nombre}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[0.75rem] text-texto-3">{sondas.uaExplica}</p>

        {/* Fichas con contador */}
        <ul className="mt-12 grid gap-px overflow-hidden rounded-sm bg-linea sm:grid-cols-2 lg:grid-cols-5">
          {sondas.lista.map((s, k) => (
            <li key={s.id} data-aparece style={{'--i': k} as React.CSSProperties} className="bg-void p-4">
              <p className="flex items-baseline justify-between gap-2">
                <span className="font-display text-[1.75rem] leading-none">{s.nombre}</span>
                {!s.vivo && <span className="etiqueta text-texto-3">{sondas.silencio}</span>}
              </p>
              <p className="mt-1 text-[0.75rem] text-texto-3">{s.lanzada}</p>
              <p className="mt-4 font-display text-[1.375rem] leading-none text-oro italic tabular-nums">
                <span
                  ref={(el) => {
                    kmRefs.current[k] = el;
                  }}
                >
                  {fmt(kmAhora(s.id))}
                </span>{' '}
                <span className="text-[0.8125rem] text-texto-2 not-italic">km</span>
              </p>
              <p className="mt-1 text-[0.8125rem] text-texto-2 tabular-nums">
                <span
                  ref={(el) => {
                    luzRefs.current[k] = el;
                  }}
                >
                  {luz(kmAhora(s.id))}
                </span>{' '}
                {sondas.luz} · {fmt(D[s.id].kms, 1)} {sondas.kms}
              </p>
              <p className="mt-3 text-[0.8125rem] leading-snug text-texto-2">{s.estado}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 grid items-center gap-6 md:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)]">
          <img src={sondaUrl('voyager')} alt="Dibujo técnico de una sonda Voyager" loading="lazy" decoding="async" className="w-full max-w-[26rem] opacity-90" />
          <p data-aparece className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-snug">
            {sondas.oort}
          </p>
        </div>
      </div>
    </section>
  );
}
