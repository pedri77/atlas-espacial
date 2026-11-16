import {IMG, creditos} from '../content';
import {useAjustarTexto} from '../hooks/useAjustarTexto';
import {useAparecer} from '../hooks/useAparecer';
import {irA} from '../lib/scroll';

/** Fuentes, crédito y licencia de cada imagen, y el nombre de la página de borde a borde. */
export function Creditos() {
  const ref = useAparecer<HTMLElement>();
  const marca = useAjustarTexto<HTMLSpanElement>();
  return (
    <footer ref={ref} aria-labelledby="creditos-titulo" className="border-t border-linea bg-void pt-[12svh]">
      <div className="mx-auto grid max-w-[80rem] gap-10 px-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:px-[4vw]">
        <div>
          <p data-aparece className="etiqueta text-oro">
            {creditos.antetitulo}
          </p>
          <h2 id="creditos-titulo" data-aparece style={{'--i': 1} as React.CSSProperties} className="mt-1 font-display text-display">
            {creditos.titulo}
          </h2>
          <p data-aparece style={{'--i': 2} as React.CSSProperties} className="mt-5 text-body text-texto-2">
            {creditos.cuerpo}
          </p>
          <ul className="mt-6 grid gap-2 text-[0.9375rem]">
            {creditos.fuentes.map((f) => (
              <li key={f.url}>
                <a href={f.url} target="_blank" rel="noreferrer" className="text-oro underline underline-offset-4">
                  {f.texto} ↗
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => irA('#inicio')}
            className="mt-8 border border-texto px-5 py-2.5 text-[0.9375rem] transition-colors hover:bg-texto hover:text-void"
          >
            ↑ {creditos.volver}
          </button>
          <p className="mt-8 text-[0.8125rem] text-texto-3">{creditos.firma}</p>
        </div>
        <ul data-aparece style={{'--i': 2} as React.CSSProperties} className="grid content-start gap-2 text-[0.8125rem] leading-relaxed text-texto-2">
          {IMG.creditos.map((c) => (
            <li key={c.fichero} className="border-b border-linea pb-2">
              <a href={c.pagina} target="_blank" rel="noreferrer" className="underline decoration-linea underline-offset-4 hover:text-oro">
                {c.fichero.replace(/\.(jpe?g|png)$/i, '')}
              </a>
              . {c.autor}. {creditos.licencia(c.licencia)}.
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-[10svh] overflow-hidden px-4 pb-[4svh] sm:px-6 md:px-[4vw]" aria-hidden="true">
        <span ref={marca} className="inline-block font-display leading-[1.3] whitespace-nowrap italic">
          {creditos.wordmark}
        </span>
      </div>
    </footer>
  );
}
