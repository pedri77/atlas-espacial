# Atlas espacial

Web cinemática con fotos de la NASA y de Webb: potencias de diez, de un astronauta al campo profundo.

Demo: https://pedri77.github.io/atlas-espacial/

## Qué tiene

- **Potencias de diez:** siete fotos que se suceden alejándose (Bruce McCandless en 1984, la Estación Espacial, la Tierra del Apolo 17, la Tierra y la Luna desde Galileo, el punto azul pálido de Voyager 1, una ilustración de la Vía Láctea y el primer campo profundo de Webb), con el ancho de lo que se ve y el tiempo que tarda la luz en cruzarlo.
- **Los Pilares de la Creación:** Hubble (2014) frente a Webb (2022), con un corte que barre con el scroll o a mano, y una regla de longitudes de onda.
- **Cinco naves saliendo del sistema solar:** Voyager 1 y 2, Pioneer 10 y 11 y New Horizons en una regla logarítmica, con su distancia al Sol calculada en vivo a partir de los vectores de JPL Horizons.

## Datos y derechos

- Imágenes de Wikimedia Commons. Las de la NASA son de dominio público. La comparación de los Pilares es de NASA, ESA, CSA y STScI (J. DePasquale, A. Koekemoer, A. Pagan), con licencia [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). La Vía Láctea es una ilustración (NASA/JPL-Caltech/ESO/R. Hurt) y la página lo avisa.
- Sondas: [JPL Horizons](https://ssd.jpl.nasa.gov/horizons/), distancia heliocéntrica y velocidad radial del 16-11-2026; la web extrapola en línea recta.
- Ninguna agencia patrocina ni revisa esta página. Textos y código hechos con IA (Claude) y revisados.

```bash
uv run --with pillow python -I scripts/imagenes.py    # Commons → WebP + créditos
python3 -I scripts/sondas.py 2026-11-16               # JPL Horizons → src/datos/sondas.json
```

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3015
npm run lint && npm run build
```

React 19, Vite, Tailwind 4 y Lenis; un solo bucle `requestAnimationFrame`. Respeta `prefers-reduced-motion`. Despliegue a GitHub Pages con `.github/workflows/pages.yml` en cada push a `main`.
