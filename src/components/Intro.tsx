import {intro} from '../content';
import {useAparecer} from '../hooks/useAparecer';

/** Qué es esto: de quién son las fotos y cuál es la única ilustración. */
export function Intro() {
  const ref = useAparecer<HTMLElement>();
  return (
    <section ref={ref} aria-labelledby="intro-titulo" className="bg-void py-[16svh]">
      <div className="mx-auto grid max-w-[80rem] gap-10 px-4 sm:px-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-[6vw] md:px-[4vw]">
        <div>
          <p data-aparece className="etiqueta text-oro">
            {intro.antetitulo}
          </p>
          <h2 id="intro-titulo" data-aparece style={{'--i': 1} as React.CSSProperties} className="mt-1 font-display text-display">
            {intro.titulo}
          </h2>
        </div>
        <div>
          {intro.cuerpo.map((t, k) => (
            <p key={k} data-aparece style={{'--i': k + 2} as React.CSSProperties} className="mt-4 text-lead text-texto-2 first:mt-0">
              {t}
            </p>
          ))}
          <dl className="mt-10 grid grid-cols-3 border-t border-linea">
            {intro.cifras.map((c, k) => (
              <div key={c.texto} data-aparece style={{'--i': k + 4} as React.CSSProperties} className="border-r border-linea pt-3 pr-3 last:border-r-0 [&:not(:first-child)]:pl-3">
                <dt className="sr-only">{c.texto}</dt>
                <dd className="font-display text-[clamp(2.5rem,5vw,4.25rem)] leading-none text-oro italic">{c.valor}</dd>
                <dd className="mt-1 text-[0.8125rem] text-texto-3">{c.texto}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
