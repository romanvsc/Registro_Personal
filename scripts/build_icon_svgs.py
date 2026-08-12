"""Build self-contained SVG icon assets from the supplied illustration sheet."""

from __future__ import annotations

import base64
import io
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "ChatGPT Image 9 ago 2026, 19_47_45.png"
OUTPUT = ROOT / "public" / "icons"

ICONS = {
    "hoy": ("Gato sosteniendo un calendario", (30, 35, 400, 390)),
    "comidas": ("Gato feliz frente a un plato de comida", (415, 35, 805, 390)),
    "entrenamientos": ("Gato entrenando con una mancuerna", (805, 35, 1195, 390)),
    "estado-animo": ("Gato pensando cómo se siente", (1215, 35, 1625, 390)),
    "historial": ("Gato leyendo un libro de registros", (215, 485, 595, 815)),
    "nuevo-registro": ("Gato escribiendo un nuevo registro", (625, 485, 995, 815)),
    "saludo": ("Gato saludando con una pata", (1010, 485, 1400, 815)),
}


def remove_white_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            red, green, blue, _ = pixels[x, y]
            minimum = min(red, green, blue)
            spread = max(red, green, blue) - minimum
            if minimum >= 248 and spread <= 7:
                alpha = 0
            elif minimum >= 235 and spread <= 12:
                alpha = round(255 * (248 - minimum) / 13)
            else:
                alpha = 255
            pixels[x, y] = red, green, blue, max(0, min(255, alpha))
    return rgba


def build() -> None:
    source = Image.open(SOURCE)
    OUTPUT.mkdir(parents=True, exist_ok=True)

    for name, (title, bounds) in ICONS.items():
        icon = remove_white_background(source.crop(bounds))
        icon.thumbnail((512, 512), Image.Resampling.LANCZOS)

        buffer = io.BytesIO()
        icon.save(buffer, format="PNG", optimize=True)
        encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
        width, height = icon.size
        svg = (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
            f'role="img" aria-labelledby="title">\n'
            f'  <title id="title">{title}</title>\n'
            f'  <image width="{width}" height="{height}" '
            f'href="data:image/png;base64,{encoded}"/>\n'
            f'</svg>\n'
        )
        (OUTPUT / f"{name}.svg").write_text(svg, encoding="utf-8")


if __name__ == "__main__":
    build()
