import colorMap from "@/lib/cht-color.json";

export type PaletteColor = {
  key: string;
  value: string;
  rgb: [number, number, number];
};

export function hexToRgbTuple(hex: string): [number, number, number] {
  const normalized = hex.trim().replace("#", "");
  const fullHex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(fullHex)) {
    return [0, 0, 0];
  }

  return [
    Number.parseInt(fullHex.slice(0, 2), 16),
    Number.parseInt(fullHex.slice(2, 4), 16),
    Number.parseInt(fullHex.slice(4, 6), 16),
  ];
}

export const chtPalette: PaletteColor[] = Object.entries(colorMap).map(
  ([key, value]) => ({
    key,
    value,
    rgb: hexToRgbTuple(value),
  }),
);
