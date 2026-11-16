import {useEffect} from 'react';
import {Creditos} from './components/Creditos';
import {Intro} from './components/Intro';
import {Pilares} from './components/Pilares';
import {Portada} from './components/Portada';
import {Sondas} from './components/Sondas';
import {useMovimientoReducido} from './hooks/useMovimientoReducido';
import {iniciarScroll} from './lib/scroll';

/** Orden del guion: potencias de diez · qué es esto · Pilares (Hubble/Webb) · sondas en vivo · fuentes. */
export default function App() {
  const reducido = useMovimientoReducido();
  useEffect(() => iniciarScroll(reducido), [reducido]);
  return (
    <main>
      <Portada />
      <Intro />
      <Pilares />
      <Sondas />
      <Creditos />
    </main>
  );
}
