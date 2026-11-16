import {useEffect, useRef} from 'react';
import {IMG, escalaUrl, etapas, portada} from '../content';
import {easeInOutSine, easeOutCubic, lerp, progresoFijado, tramo} from '../lib/math';
import {enCadaFotograma} from '../lib/scroll';

/**
 * Potencias de diez: siete fotos que se suceden alejándose. La foto actual se encoge y se apaga
 * mientras la siguiente llega desde más cerca (escala 4 → 1). A la izquierda, un contador con el
 * ancho de lo que se ve (10^e metros) y lo que tarda la luz en cruzarlo, interpolados en logaritmo.
 *
 * Guion de scroll (p), sección de 7 × 120 + 100 svh:
 *   0.00 – 0.05  titular sobre el astronauta; se apaga y sube
 *   0.04 – 0.97  q = etapa continua 0…6; en cada tramo u = q − k:
 *                0.00 – 0.45  quieta (la foto se encoge un 4 %); su pie de foto visible
 *                0.45 – 1.00  viaje (s = easeInOutSine): actual escala 1 → 0.08 y se apaga en s 0.35–0.9;
 *                             siguiente escala 4 → 1 y se enciende en s 0.1–0.6
 *   contador     e = lerp(exp_k, exp_k+1, s)
 */

const N = etapas.length;
const ALTO_VH = N * 120 + 100;
const DIM = IMG.etapas as Record<string, {w: number; h: number}>;

/** Tiempo que tarda la luz en recorrer 10^e metros, en la unidad que se lea mejor. */
function tiempoLuz(e: number): string {
  const s = 10 ** e / 299_792_458;
  const f = (v: number, d = 0) => v.toLocaleString('es-ES', {maximumFractionDigits: d, minimumFractionDigits: d});
  if (s < 1e-6) return `${f(s * 1e9)} ns`;
  if (s < 1e-3) return `${f(s * 1e6, s < 1e-5 ? 2 : 0)} µs`;
  if (s < 1) return `${f(s * 1e3)} ms`;
  if (s < 60) return `${f(s, 1)} s`;
  if (s < 3600) return `${f(s / 60)} min`;
  if (s < 86400 * 2) return `${f(s / 3600, 1)} h`;
  const anios = s / 31_557_600;
  if (anios < 1) return `${f(s / 86400)} días`;
  if (anios < 1e6) return `${f(anios)} años`;
  if (anios < 1e9) return `${f(anios / 1e6)} millones de años`;
  return `${f(anios / 1e9, 1)} mil millones de años`;
}

const SUPER: Record<string, string> = {'0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻'};
const potencia = (e: number) => `10${String(Math.round(e)).replace(/./g, (c) => SUPER[c] ?? c)}`;

export function Portada() {
  const raizRef = useRef<HTMLElement>(null);
  const capaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pieRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tituloRef = useRef<HTMLDivElement>(null);
  const invitaRef = useRef<HTMLParagraphElement>(null);
  const expRef = useRef<HTMLSpanElement>(null);
  const luzRef = useRef<HTMLSpanElement>(null);
  const reglaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let pAnterior = -1;
    let eAnterior = '';
    return enCadaFotograma(() => {
      const raiz = raizRef.current;
      if (!raiz) return;
      const {p, visible} = progresoFijado(raiz);
      if (!visible || Math.abs(p - pAnterior) < 0.00003) return;
      pAnterior = p;
      const q = tramo(p, 0.04, 0.97) * (N - 1);
      const k = Math.min(N - 2, Math.floor(q));
      const u = q - k;
      const s = easeInOutSine(tramo(u, 0.45, 1));
      capaRefs.current.forEach((el, i) => {
        if (!el) return;
        let esc = 1;
        let op = 0;
        if (i === k) {
          esc = Math.exp(lerp(0, Math.log(0.08), s)) * (1 - 0.04 * tramo(u, 0, 0.45));
          op = 1 - tramo(s, 0.35, 0.9);
        } else if (i === k + 1) {
          esc = Math.exp(lerp(Math.log(4), 0, s));
          op = tramo(s, 0.1, 0.6);
        }
        el.style.opacity = String(op);
        el.style.visibility = op > 0.001 ? 'visible' : 'hidden';
        el.style.transform = `translate3d(-50%, -50%, 0) scale(${esc})`;
      });
      const actual = Math.round(q);
      pieRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = Math.abs(q - i);
        // El primer pie espera a que se vaya el titular.
        const op = i === actual ? (1 - tramo(d, 0.18, 0.4)) * (i === 0 ? tramo(p, 0.04, 0.07) : 1) : 0;
        el.style.opacity = String(op);
        el.style.visibility = op > 0.001 ? 'visible' : 'hidden';
      });
      const e = lerp(etapas[k].exp, etapas[k + 1].exp, s);
      const texto = `${potencia(e)}|${tiempoLuz(e)}`;
      if (texto !== eAnterior) {
        eAnterior = texto;
        expRef.current!.textContent = potencia(e);
        luzRef.current!.textContent = tiempoLuz(e);
      }
      reglaRef.current!.style.transform = `scaleX(${(e - etapas[0].exp) / (etapas[N - 1].exp - etapas[0].exp)})`;
      const t = easeOutCubic(tramo(p, 0, 0.05));
      tituloRef.current!.style.opacity = String(1 - t);
      tituloRef.current!.style.transform = `translate3d(0, ${-t * 6}vh, 0)`;
      invitaRef.current!.style.opacity = String(1 - tramo(p, 0, 0.02));
    });
  }, []);

  return (
    <section ref={raizRef} id="inicio" aria-labelledby="portada-titulo" className="relative" style={{height: `${ALTO_VH}svh`}}>
      <div className="sticky top-0 h-pantalla overflow-hidden bg-void" role="img" aria-label={portada.etiqueta}>
        {etapas.map((et, i) => {
          const {w, h} = DIM[et.id];
          const ar = w / h;
          return (
            <div
              key={et.id}
              ref={(el) => {
                capaRefs.current[i] = el;
              }}
              className="absolute top-1/2 left-1/2 will-change-transform"
              style={{
                width: `max(100vw, ${100 * ar}svh)`,
                aspectRatio: `${w} / ${h}`,
                transform: 'translate3d(-50%, -50%, 0)',
                opacity: i === 0 ? 1 : 0,
                visibility: i === 0 ? 'visible' : 'hidden',
              }}
            >
              <img src={escalaUrl(et.id)} alt="" width={w} height={h} decoding="async" fetchPriority={i < 2 ? 'high' : 'auto'} className="block size-full" />
              {et.marca && (
                <div className="absolute" style={{left: `${et.marca[0] * 100}%`, top: `${et.marca[1] * 100}%`}}>
                  <span className="absolute -top-5 -left-5 size-10 rounded-full border-2 border-oro" />
                  <span className="etiqueta sobre-foto absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-oro">{et.aqui}</span>
                </div>
              )}
            </div>
          );
        })}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(10%_0.015_265/0.75),transparent_45%),linear-gradient(to_top,oklch(10%_0.015_265/0.85),transparent_40%)]" />

        {/* Contador de escala */}
        <div className="absolute top-[4svh] left-4 sm:left-6 md:top-[6svh] md:left-[4vw]" aria-hidden="true">
          <p className="etiqueta text-texto-3">{portada.escala}</p>
          <p className="sobre-foto font-display text-[clamp(3rem,7vw,6.5rem)] leading-none italic">
            <span ref={expRef}>{potencia(etapas[0].exp)}</span>
            <span className="ml-2 text-[0.4em] not-italic">m</span>
          </p>
          <p className="etiqueta mt-3 text-texto-3">{portada.luz}</p>
          <p className="sobre-foto font-display text-[clamp(1.375rem,2.4vw,2rem)] text-oro italic">
            <span ref={luzRef}>{tiempoLuz(etapas[0].exp)}</span>
          </p>
          <div className="mt-4 h-px w-[min(40vw,14rem)] bg-linea">
            <div ref={reglaRef} className="h-full origin-left bg-oro" style={{transform: 'scaleX(0)'}} />
          </div>
        </div>

        {/* Pies de foto */}
        {etapas.map((et, i) => (
          <div
            key={et.id}
            ref={(el) => {
              pieRefs.current[i] = el;
            }}
            className="absolute right-4 bottom-[5svh] left-4 max-w-[30rem] sm:left-6 md:right-auto md:left-[4vw]"
            style={{opacity: 0, visibility: 'hidden'}}
          >
            <p className="etiqueta text-oro">
              {String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')} · {et.medida}
            </p>
            <h2 className="sobre-foto mt-1 font-display text-[clamp(2rem,4vw,3.5rem)] leading-none">{et.titulo}</h2>
            <p className="sobre-foto mt-3 text-body text-texto-2">{et.texto}</p>
          </div>
        ))}

        <div ref={tituloRef} className="absolute inset-x-4 bottom-[12svh] sm:inset-x-6 md:right-auto md:left-[4vw] md:max-w-[52rem]">
          <p className="etiqueta sobre-foto text-oro">{portada.antetitulo}</p>
          <h1 id="portada-titulo" className="sobre-foto mt-2 font-display text-hero">
            {portada.titulo}
          </h1>
          <p className="sobre-foto mt-4 max-w-[32rem] text-lead text-texto-2">{portada.bajada}</p>
        </div>
        <p ref={invitaRef} className="etiqueta sobre-foto absolute bottom-[3svh] left-1/2 -translate-x-1/2 whitespace-nowrap text-texto-2">
          {portada.invitacion} ↓
        </p>
      </div>
    </section>
  );
}
