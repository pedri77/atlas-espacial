import {useEffect, useRef} from 'react';
import {IMG, pilarUrl, pilares} from '../content';
import {lerp, progresoFijado, tramo} from '../lib/math';
import {enCadaFotograma} from '../lib/scroll';

/**
 * El mismo sitio, dos telescopios: Hubble (2014) debajo y Webb (2022) encima, recortado con clip-path.
 * El corte barre de derecha a izquierda con el scroll; el deslizador permite moverlo a mano (hasta que
 * el scroll vuelva a cambiar). Al lado, una regla logarítmica de longitudes de onda.
 *
 * Guion de scroll (p), sección de 320 svh:
 *   0.08 – 0.80  corte c de 94 % a 6 % (lineal: el lector controla el ritmo)
 *   0.00 – 0.12  rótulos de Hubble y Webb aparecen
 */

const {w: W, h: H} = IMG.pilares as {w: number; h: number};
const L0 = Math.log10(0.3);
const L1 = Math.log10(6);
const pos = (um: number) => ((Math.log10(um) - L0) / (L1 - L0)) * 100;

export function Pilares() {
  const raizRef = useRef<HTMLElement>(null);
  const webbRef = useRef<HTMLDivElement>(null);
  const lineaRef = useRef<HTMLDivElement>(null);
  const rangoRef = useRef<HTMLInputElement>(null);
  const manual = useRef<{c: number; p: number} | null>(null);

  const pintar = (c: number) => {
    webbRef.current!.style.clipPath = `inset(0 0 0 ${c}%)`;
    lineaRef.current!.style.left = `${c}%`;
    rangoRef.current!.value = String(Math.round(c));
  };

  useEffect(() => {
    let pAnterior = -1;
    return enCadaFotograma(() => {
      const raiz = raizRef.current;
      if (!raiz) return;
      const {p, visible} = progresoFijado(raiz);
      if (!visible || Math.abs(p - pAnterior) < 0.00005) return;
      pAnterior = p;
      if (manual.current && Math.abs(manual.current.p - p) < 0.002) return;
      manual.current = null;
      pintar(lerp(94, 6, tramo(p, 0.08, 0.8)));
    });
  }, []);

  return (
    <section ref={raizRef} id="pilares" aria-labelledby="pilares-titulo" className="relative" style={{height: '320svh'}}>
      <div className="sticky top-0 flex h-pantalla flex-col gap-4 overflow-hidden bg-void px-4 pt-[4svh] pb-[3svh] sm:px-6 md:flex-row md:items-center md:gap-[4vw] md:px-[4vw] md:py-0">
        <div className="md:w-[30vw] md:shrink-0">
          <p className="etiqueta text-oro">{pilares.antetitulo}</p>
          <h2 id="pilares-titulo" className="mt-1 font-display text-display">
            {pilares.titulo}
          </h2>
          <p className="mt-3 hidden text-body text-texto-2 md:block">{pilares.cuerpo}</p>
          <dl className="mt-6 hidden gap-4 md:grid">
            {[pilares.hubble, pilares.webb].map((t, k) => (
              <div key={k} className={`border-l-2 pl-3 ${k === 0 ? 'border-azul' : 'border-oro'}`}>
                <dt className="font-semibold">{t.nombre}</dt>
                <dd className="text-[0.9375rem] text-texto-2">{t.texto}</dd>
              </div>
            ))}
          </dl>
          {/* Regla de longitudes de onda */}
          <div className="mt-8 hidden md:block" aria-label={pilares.regla.titulo} role="img">
            <p className="etiqueta text-texto-3">{pilares.regla.titulo}</p>
            <div className="relative mt-3 h-14 text-[0.6875rem]">
              <div className="absolute top-0 h-2.5 rounded-sm bg-[linear-gradient(to_right,#7b3fe4,#2f6bff,#22c55e,#facc15,#f97316,#dc2626)]" style={{left: `${pos(0.38)}%`, width: `${pos(0.75) - pos(0.38)}%`}} />
              <p className="absolute top-3.5 text-texto-3" style={{left: `${pos(0.38)}%`}}>
                {pilares.regla.visible}
              </p>
              <div className="absolute top-8 h-1.5 rounded-sm bg-azul" style={{left: `${pos(0.5)}%`, width: `${pos(0.67) - pos(0.5)}%`}} />
              <div className="absolute top-11 h-1.5 rounded-sm bg-oro" style={{left: `${pos(0.6)}%`, width: `${pos(5) - pos(0.6)}%`}} />
            </div>
            <div className="flex justify-between text-[0.6875rem] text-texto-3">
              <span>0,3 {pilares.regla.unidad}</span>
              <span className="text-azul">{pilares.regla.hubble}</span>
              <span className="text-oro">{pilares.regla.webb}</span>
              <span>6</span>
            </div>
          </div>
        </div>

        <figure className="flex min-h-0 flex-1 flex-col items-center justify-center">
          <div className="relative w-[min(100%,calc(46svh*var(--ar)))] md:w-[min(100%,calc(74svh*var(--ar)))]" style={{aspectRatio: `${W} / ${H}`, '--ar': W / H} as React.CSSProperties}>
            <img src={pilarUrl('hubble')} alt="Los Pilares de la Creación fotografiados por Hubble en luz visible (2014)" width={W} height={H} loading="lazy" decoding="async" className="absolute inset-0 size-full" />
            <div ref={webbRef} className="absolute inset-0" style={{clipPath: 'inset(0 0 0 94%)'}}>
              <img src={pilarUrl('webb')} alt="Los mismos pilares fotografiados por Webb en infrarrojo cercano (2022)" width={W} height={H} loading="lazy" decoding="async" className="size-full" />
            </div>
            <div ref={lineaRef} className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-texto" style={{left: '94%'}} aria-hidden="true">
              <span className="absolute top-1/2 left-1/2 flex size-9 -translate-1/2 items-center justify-center rounded-full bg-texto text-[0.8125rem] font-semibold text-void">⇆</span>
            </div>
            <span className="etiqueta sobre-foto absolute top-3 left-3 text-azul">Hubble</span>
            <span className="etiqueta sobre-foto absolute top-3 right-3 text-oro">Webb</span>

          </div>
          <input
            ref={rangoRef}
            type="range"
            min={0}
            max={100}
            defaultValue={94}
            aria-label={pilares.rango}
            onInput={(e) => {
              const c = Number((e.target as HTMLInputElement).value);
              manual.current = {c, p: progresoFijado(raizRef.current!).p};
              pintar(c);
            }}
            className="mt-3 w-[min(100%,28rem)] cursor-ew-resize accent-[var(--color-oro)]"
          />
          <figcaption className="mt-2 text-center text-[0.75rem] text-texto-3">{pilares.pie}</figcaption>
        </figure>
        <p className="text-[0.875rem] text-texto-2 md:hidden">{pilares.cuerpo}</p>
      </div>
    </section>
  );
}
