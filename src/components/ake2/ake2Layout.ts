import { ake2TemplateSpec, type Ake2FormState } from "./ake2Config";
import { ake2Professions } from "./ake2Professions";

export type Ake2Point = { x: number; y: number };
export type Ake2Rect = Ake2Point & { width: number; height: number };

export function getAke2ImageLayout(form: Ake2FormState): Ake2Rect | null {
  if (!form.image) return null;
  const baseHeight = ake2TemplateSpec.canvasHeight;
  const baseWidth = form.image.width / form.image.height * baseHeight;
  const width = baseWidth * form.scale / 100;
  const height = baseHeight * form.scale / 100;
  return {
    x: form.imagePosition.x - (width - baseWidth) / 2,
    y: form.imagePosition.y - (height - baseHeight) / 2,
    width,
    height,
  };
}

export function getAke2Profession(form: Ake2FormState) {
  const profession = ake2Professions.find((item) => item.value === form.profession);
  const branch = profession?.branches.find((item) => item.value === form.branch);
  if (!profession || !branch) throw new Error("职业与分支不匹配，请重新选择。");
  return { profession, branch };
}

export function getAke2SelectionKey(form: Ake2FormState) {
  return JSON.stringify([form.profession, form.branch, form.image?.url ?? null]);
}

export function formatAke2English(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase();
}

export function getAke2TextBaseline(metrics: TextMetrics, fontSize: number, lineHeight: number) {
  const ascent = metrics.fontBoundingBoxAscent ?? fontSize * 0.8;
  const descent = metrics.fontBoundingBoxDescent ?? fontSize * 0.2;
  return (lineHeight - ascent - descent) / 2 + ascent;
}

export function containsAke2Point(rect: Ake2Rect, point: Ake2Point) {
  return point.x >= rect.x && point.x <= rect.x + rect.width &&
    point.y >= rect.y && point.y <= rect.y + rect.height;
}
