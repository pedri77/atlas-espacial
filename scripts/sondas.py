"""Distancia al Sol (km) y velocidad radial (km/s) de cinco sondas, según JPL Horizons.

La web extrapola la distancia en vivo: d(t) = distancia + velocidad · (t − época).
Escribe src/datos/sondas.json. Uso: python3 -I scripts/sondas.py 2026-11-16
"""
import json
import re
import subprocess
import sys
import time
from datetime import date, timedelta
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
UA = "atlas-espacial/1.0 (static portfolio site)"
SONDAS = {"voyager1": -31, "voyager2": -32, "pioneer10": -23, "pioneer11": -24, "newhorizons": -98}


def main() -> None:
    fecha = sys.argv[1]
    siguiente = (date.fromisoformat(fecha) + timedelta(days=1)).isoformat()
    salida = {"epoca": f"{fecha}T00:00:00Z", "fuente": "JPL Horizons (vectores heliocéntricos)", "sondas": {}}
    for nombre, id_ in SONDAS.items():
        url = ("https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND='" + str(id_) + "'&EPHEM_TYPE=VECTORS&CENTER='@sun'"
               f"&START_TIME='{fecha}'&STOP_TIME='{siguiente}'&STEP_SIZE='1d'&VEC_TABLE='3'&OUT_UNITS='KM-S'&MAKE_EPHEM=YES&OBJ_DATA=NO")
        r = subprocess.run(["curl", "-s", "-g", "-A", UA, url], capture_output=True, text=True, check=True)
        texto = json.loads(r.stdout)["result"]
        bloque = re.search(r"\$\$SOE(.*?)\$\$EOE", texto, re.S).group(1)
        rg = float(re.search(r"RG=\s*([-\d.E+]+)", bloque).group(1))
        rr = float(re.search(r"RR=\s*([-\d.E+]+)", bloque).group(1))
        salida["sondas"][nombre] = {"km": rg, "kms": rr}
        print(nombre, round(rg / 1.495978707e8, 2), "UA", round(rr, 2), "km/s")
        time.sleep(1)
    (RAIZ / "src/datos/sondas.json").write_text(json.dumps(salida, indent=1))


if __name__ == "__main__":
    main()
