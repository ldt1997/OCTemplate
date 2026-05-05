import { type PaletteColor, hexToRgbTuple } from "@/lib/chtColor";

export type ColorPair = {
  id: string;
  left: PaletteColor;
  right: PaletteColor;
};

function rgbDistance(
  a: [number, number, number],
  b: [number, number, number],
): number {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];

  return dr * dr + dg * dg + db * db;
}

async function extractThemeColors(
  imageUrl: string,
  count = 3,
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const sampleSize = 96;
      const canvas = document.createElement("canvas");
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("无法初始化颜色采样画布"));
        return;
      }

      context.drawImage(image, 0, 0, sampleSize, sampleSize);
      const { data } = context.getImageData(0, 0, sampleSize, sampleSize);
      const buckets = new Map<
        string,
        {
          count: number;
          sumR: number;
          sumG: number;
          sumB: number;
        }
      >();

      for (let index = 0; index < data.length; index += 4) {
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];

        if (a < 200) {
          continue;
        }

        const bucketKey = `${Math.floor(r / 32)}-${Math.floor(g / 32)}-${Math.floor(b / 32)}`;
        const bucket = buckets.get(bucketKey);

        if (bucket) {
          bucket.count += 1;
          bucket.sumR += r;
          bucket.sumG += g;
          bucket.sumB += b;
          continue;
        }

        buckets.set(bucketKey, {
          count: 1,
          sumR: r,
          sumG: g,
          sumB: b,
        });
      }

      const sorted = [...buckets.values()]
        .sort((left, right) => right.count - left.count)
        .map((bucket) => {
          const avgR = Math.round(bucket.sumR / bucket.count);
          const avgG = Math.round(bucket.sumG / bucket.count);
          const avgB = Math.round(bucket.sumB / bucket.count);

          return {
            rgb: [avgR, avgG, avgB] as [number, number, number],
            hex: `#${avgR.toString(16).padStart(2, "0")}${avgG
              .toString(16)
              .padStart(2, "0")}${avgB.toString(16).padStart(2, "0")}`.toUpperCase(),
          };
        });

      const picked: Array<{
        rgb: [number, number, number];
        hex: string;
      }> = [];

      for (const color of sorted) {
        const isSimilar = picked.some(
          (item) => rgbDistance(item.rgb, color.rgb) < 42 * 42,
        );

        if (!isSimilar) {
          picked.push(color);
        }

        if (picked.length >= count) {
          break;
        }
      }

      resolve(picked.map((item) => item.hex));
    };

    image.onerror = () => reject(new Error("图片颜色提取失败"));
    image.src = imageUrl;
  });
}

export async function buildColorPairsFromImage(
  imageUrl: string,
  palette: PaletteColor[],
  count = 3,
): Promise<ColorPair[]> {
  if (palette.length === 0) {
    return [];
  }

  const extracted = await extractThemeColors(imageUrl, count);
  if (extracted.length === 0) {
    return [];
  }

  const mapped = extracted.map((hex) => {
    const targetRgb = hexToRgbTuple(hex);

    return palette.reduce((best, current) => {
      const currentDistance = rgbDistance(current.rgb, targetRgb);
      const bestDistance = rgbDistance(best.rgb, targetRgb);

      return currentDistance < bestDistance ? current : best;
    });
  });

  const uniqueMapped = mapped.filter(
    (item, index, items) =>
      items.findIndex((current) => current.value === item.value) === index,
  );

  const pairs: ColorPair[] = [];

  for (let index = 0; index < uniqueMapped.length; index += 1) {
    for (
      let nextIndex = index + 1;
      nextIndex < uniqueMapped.length;
      nextIndex += 1
    ) {
      const left = uniqueMapped[index];
      const right = uniqueMapped[nextIndex];

      pairs.push({
        id: `${left.key}-${right.key}`,
        left,
        right,
      });
    }
  }

  return pairs;
}
