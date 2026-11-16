"""Descarga de Commons (miniatura estándar al ancho pedido) y conversión a WebP.

- Etapas del zoom: public/escala/<id>.webp (lado mayor 2000 px).
- Pilares de la Creación: la imagen de ESA/Webb con Hubble y Webb lado a lado se parte en dos mitades
  alineadas: public/pilares/hubble.webp y public/pilares/webb.webp.
- Voyager: public/sondas/voyager.webp.
Escribe src/datos/imagenes.json con tamaño, licencia y crédito de cada fichero.
Uso: uv run --with pillow python -I scripts/imagenes.py
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import time
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from comun import RAIZ, UA, get_json, info  # noqa: E402

Image.MAX_IMAGE_PIXELS = None
CRUDO = RAIZ / "datos-crudos" / "img"
ETAPAS = {
    "astronauta": "Bruce McCandless II during EVA in 1984.jpg",
    "iss": "International Space Station after undocking of STS-132.jpg",
    "tierra": "The Blue Marble (remastered).jpg",
    "tierraluna": "Earth & Moon by Galileo.jpg",
    "puntoazul": "Pale Blue Dot from Voyager 1 - PIA23645.png",
    "vialactea": "Artist’s impression of the Milky Way.jpg",
    "campoprofundo": "Webb's First Deep Field.jpg",
}
PILARES = "Hubble and Webb Showcase the Pillars of Creation (Side by Side) (weic2216d).jpeg"
VOYAGER = "Voyager spacecraft (cropped).jpg"


def bajar(fichero: str, ancho: int) -> Path:
    destino = CRUDO / (re.sub(r"[^\w.-]+", "_", fichero) + f".{ancho}.jpg")
    if destino.exists():
        return destino
    CRUDO.mkdir(parents=True, exist_ok=True)
    d = get_json({"action": "query", "format": "json", "titles": "File:" + fichero, "prop": "imageinfo", "iiprop": "url|size", "iiurlwidth": ancho})
    ii = next(iter(d["query"]["pages"].values()))["imageinfo"][0]
    url = ii["thumburl"] if ii["width"] > ancho else ii["url"]
    for intento in range(5):
        r = subprocess.run(["curl", "-s", "-L", "-A", UA, "-w", "%{http_code}", "-o", str(destino), url], capture_output=True, text=True)
        if r.stdout == "200":
            time.sleep(1.5)
            return destino
        destino.unlink(missing_ok=True)
        time.sleep(20 * (intento + 1))
    raise RuntimeError(url)


def webp(im: Image.Image, destino: Path, lado: int, calidad: int = 76) -> tuple[int, int]:
    destino.parent.mkdir(parents=True, exist_ok=True)
    im = im.convert("RGB")
    im.thumbnail((lado, lado), Image.LANCZOS)
    im.save(destino, "WEBP", quality=calidad, method=6)
    return im.size


def main() -> None:
    meta = info(list(ETAPAS.values()) + [PILARES, VOYAGER])
    salida: dict = {"etapas": {}, "pilares": {}, "creditos": []}
    for id_, f in ETAPAS.items():
        w, h = webp(Image.open(bajar(f, 2560)), RAIZ / f"public/escala/{id_}.webp", 2000)
        salida["etapas"][id_] = {"w": w, "h": h}
    lado = Image.open(bajar(PILARES, 3840))
    W, H = lado.size
    for k, nombre in enumerate(("hubble", "webb")):
        w, h = webp(lado.crop((k * W // 2, 0, (k + 1) * W // 2, H)), RAIZ / f"public/pilares/{nombre}.webp", 1900, 78)
        salida["pilares"] = {"w": w, "h": h}
    webp(Image.open(bajar(VOYAGER, 1200)), RAIZ / "public/sondas/voyager.webp", 1000)
    for f in list(ETAPAS.values()) + [PILARES, VOYAGER]:
        m = meta[f]
        salida["creditos"].append({"fichero": f, "pagina": m["pagina"], "licencia": m["LicenseShortName"],
                                   "autor": re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", m["Artist"])).strip()})
    (RAIZ / "src/datos/imagenes.json").write_text(json.dumps(salida, ensure_ascii=False, indent=1))
    for c in salida["creditos"]:
        print(c["licencia"], "|", c["autor"][:70], "|", c["fichero"][:50])


if __name__ == "__main__":
    main()
