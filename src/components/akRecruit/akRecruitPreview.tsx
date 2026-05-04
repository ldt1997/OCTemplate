import { useMemo, useRef } from "react";
import {
  akRecruitAssets,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  clamp,
  getImageLayout,
  organizationAssetMap,
  posterEnNameStyle,
  posterIntroStyle,
  posterNameStyle,
  professionAssetMap,
  type ImageSize,
  type RecruitFormState,
} from "@/components/akRecruit/akRecruitConfig";

type AkRecruitPreviewProps = {
  form: RecruitFormState;
  imageSize: ImageSize | null;
  previewScale: number;
  onImageTransformChange: (
    next: Partial<
      Pick<RecruitFormState, "imageScale" | "imageOffsetX" | "imageOffsetY">
    >,
  ) => void;
};

export function AkRecruitPreview({
  form,
  imageSize,
  previewScale,
  onImageTransformChange,
}: AkRecruitPreviewProps) {
  const professionAsset = form.profession
    ? professionAssetMap[form.profession]
    : null;
  const interactionRef = useRef<{
    mode: "idle" | "drag" | "pinch";
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    initialScale: number;
    initialDistance: number;
    pointers: Map<number, { x: number; y: number }>;
  }>({
    mode: "idle",
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    initialScale: 1,
    initialDistance: 0,
    pointers: new Map(),
  });

  const imageLayout = useMemo(() => {
    if (!form.imageUrl || !imageSize) {
      return null;
    }

    return getImageLayout(
      imageSize.width,
      imageSize.height,
      form.imageScale,
      form.imageOffsetX,
      form.imageOffsetY,
    );
  }, [
    form.imageOffsetX,
    form.imageOffsetY,
    form.imageScale,
    form.imageUrl,
    imageSize,
  ]);

  const handleWheel = (event: React.WheelEvent<HTMLImageElement>) => {
    event.preventDefault();
    onImageTransformChange({
      imageScale: clamp(form.imageScale + (event.deltaY < 0 ? 0.08 : -0.08), 0.5, 3),
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    const state = interactionRef.current;
    state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (state.pointers.size === 2) {
      const [first, second] = Array.from(state.pointers.values());
      state.mode = "pinch";
      state.initialScale = form.imageScale;
      state.initialDistance = Math.hypot(
        second.x - first.x,
        second.y - first.y,
      );
      return;
    }

    state.mode = "drag";
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.originX = form.imageOffsetX;
    state.originY = form.imageOffsetY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLImageElement>) => {
    const state = interactionRef.current;
    if (!state.pointers.has(event.pointerId)) {
      return;
    }

    state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (state.mode === "pinch" && state.pointers.size >= 2) {
      const [first, second] = Array.from(state.pointers.values());
      const distance = Math.hypot(second.x - first.x, second.y - first.y);
      if (state.initialDistance > 0) {
        onImageTransformChange({
          imageScale: clamp(
            state.initialScale * (distance / state.initialDistance),
            0.5,
            3,
          ),
        });
      }
      return;
    }

    if (state.mode === "drag") {
      onImageTransformChange({
        imageOffsetX:
          state.originX + (event.clientX - state.startX) / previewScale,
        imageOffsetY:
          state.originY + (event.clientY - state.startY) / previewScale,
      });
    }
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLImageElement>) => {
    const state = interactionRef.current;
    state.pointers.delete(event.pointerId);

    if (state.pointers.size >= 2) {
      const [first, second] = Array.from(state.pointers.values());
      state.mode = "pinch";
      state.initialScale = form.imageScale;
      state.initialDistance = Math.hypot(
        second.x - first.x,
        second.y - first.y,
      );
      return;
    }

    if (state.pointers.size === 1) {
      const [remaining] = Array.from(state.pointers.values());
      state.mode = "drag";
      state.startX = remaining.x;
      state.startY = remaining.y;
      state.originX = form.imageOffsetX;
      state.originY = form.imageOffsetY;
      return;
    }

    state.mode = "idle";
  };

  return (
    <div
      className="relative overflow-hidden bg-cover bg-center shadow-[0_30px_60px_rgba(15,23,42,0.18)]"
      style={{
        width: `${CANVAS_WIDTH}px`,
        height: `${CANVAS_HEIGHT}px`,
        backgroundImage: `url(${akRecruitAssets.bgImage})`,
      }}
    >
      <img
        src={organizationAssetMap[form.organization]}
        alt=""
        className="pointer-events-none absolute select-none"
        style={{ left: 342, top: 190, width: 500 }}
      />

      {form.imageUrl && imageLayout ? (
        <img
          src={form.imageUrl}
          alt="上传的角色图片"
          className={`absolute select-none touch-none ${
            interactionRef.current.mode === "drag"
              ? "cursor-grabbing"
              : "cursor-grab"
          }`}
          style={{
            left: imageLayout.imageX,
            top: imageLayout.imageY,
            width: imageLayout.imageWidth,
            height: imageLayout.imageHeight,
          }}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
        />
      ) : null}

      <div
        className="absolute left-1/2 flex -translate-x-1/2 flex-col items-start"
        style={{ top: 586 }}
      >
        <div className="ml-4 flex items-center">
          {Array.from({ length: form.rarity }).map((_, index) => (
            <img
              key={`star-${index}`}
              src={akRecruitAssets.starImage}
              alt=""
              className={`h-[152px] w-[152px] ${
                index === 0 ? "" : "-ml-[35px]"
              }`}
            />
          ))}
        </div>

        <div className="mt-[-24px] flex items-start gap-1">
          {professionAsset ? (
            <img
              src={professionAsset}
              alt=""
              className="mt-2 h-auto w-[260px] shrink-0"
            />
          ) : null}

          <div className="flex flex-col items-start">
            <div
              className="text-[120px] font-black leading-none text-white"
              style={posterNameStyle}
            >
              {form.name || " "}
            </div>
            <div
              className="mt-2 text-5xl uppercase leading-none text-white"
              style={posterEnNameStyle}
            >
              {form.enName || " "}
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[26%]"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.58) 18%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div
        className="absolute bottom-9 left-1/2 w-[1280px] max-w-[calc(100%-96px)] -translate-x-1/2 text-left text-[36px] leading-[1.35] text-white"
        style={posterIntroStyle}
      >
        {form.intro}
      </div>
    </div>
  );
}
