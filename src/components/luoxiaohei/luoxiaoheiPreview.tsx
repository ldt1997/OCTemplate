import { useMemo } from "react";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  logoAssetMap,
  luoxiaoheiAssets,
  luoxiaoheiTemplateSpec,
  sourceHanNameStyle,
  sourceHanTitleStyle,
  type ImageSize,
  type LuoxiaoheiFormState,
} from "@/components/luoxiaohei/luoxiaoheiConfig";
import {
  formatHueLabel,
  formatRgbLabel,
  getBaseImageLayout,
  getDisplayNameText,
  getNameFrameLayout,
  getPosterLayout,
} from "@/components/luoxiaohei/luoxiaoheiLayout";
import { useLuoxiaoheiImageTransform } from "@/components/luoxiaohei/useLuoxiaoheiImageTransform";

type LuoxiaoheiPreviewProps = {
  form: LuoxiaoheiFormState;
  imageSize: ImageSize | null;
  previewScale: number;
  onImageTransformCommit: (
    next: Pick<
      LuoxiaoheiFormState,
      "imageScale" | "imageOffsetX" | "imageOffsetY"
    >,
  ) => void;
};

export function LuoxiaoheiPreview({
  form,
  imageSize,
  previewScale,
  onImageTransformCommit,
}: LuoxiaoheiPreviewProps) {
  const layout = useMemo(
    () => ({
      ...getPosterLayout(),
      nameFrame: getNameFrameLayout(form.name),
    }),
    [form.name],
  );
  const baseLayout = useMemo(() => {
    if (!imageSize) {
      return null;
    }

    return getBaseImageLayout(imageSize.width, imageSize.height);
  }, [imageSize]);
  const { imageRef, isDragging, overlayHandlers } = useLuoxiaoheiImageTransform({
    enabled: Boolean(form.imageUrl),
    previewScale,
    value: {
      imageScale: form.imageScale,
      imageOffsetX: form.imageOffsetX,
      imageOffsetY: form.imageOffsetY,
    },
    onCommit: onImageTransformCommit,
  });

  const displayName = useMemo(() => getDisplayNameText(form.name), [form.name]);
  const nameTextHeight =
    displayName.length * luoxiaoheiTemplateSpec.nameFrameTextLineHeight;

  return (
    <div
      className="relative overflow-hidden bg-white"
      style={{
        width: `${CANVAS_WIDTH}px`,
        height: `${CANVAS_HEIGHT}px`,
        boxShadow: luoxiaoheiTemplateSpec.previewShadow,
      }}
    >
      <div
        className="absolute inset-y-0 left-0"
        style={{
          width: layout.leftBlock.width,
          background: `linear-gradient(to bottom, ${form.bgColor1} 0%, ${form.bgColor1} ${luoxiaoheiTemplateSpec.gradientStop * 100}%, #ffffff 100%)`,
        }}
      />
      <div
        className="absolute inset-y-0 right-0"
        style={{
          width: layout.rightBlock.width,
          background: `linear-gradient(to bottom, ${form.bgColor2} 0%, ${form.bgColor2} ${luoxiaoheiTemplateSpec.gradientStop * 100}%, #ffffff 100%)`,
        }}
      />

      <img
        src={luoxiaoheiAssets.bambooImage}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
        style={{ opacity: luoxiaoheiTemplateSpec.bambooOpacity }}
      />

      {form.imageUrl && baseLayout ? (
        <img
          ref={imageRef}
          src={form.imageUrl}
          alt="上传的人物图片"
          draggable={false}
          className="pointer-events-none absolute select-none"
          style={{
            left: baseLayout.baseX,
            top: baseLayout.baseY,
            width: baseLayout.baseWidth,
            height: baseLayout.baseHeight,
            transformOrigin: "center center",
            willChange: "transform",
          }}
          onDragStart={(event) => event.preventDefault()}
        />
      ) : null}

      <div
        className={`absolute inset-0 z-10 touch-none ${
          form.imageUrl
            ? isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
            : "cursor-default"
        }`}
        {...overlayHandlers}
      />

      <div
        className="absolute z-20 flex flex-col items-start"
        style={{
          left: luoxiaoheiTemplateSpec.titlePaddingSide,
          top: luoxiaoheiTemplateSpec.leftTextTop,
        }}
      >
        <div
          style={{
            ...sourceHanTitleStyle,
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            fontSize: luoxiaoheiTemplateSpec.titleFontSize,
            lineHeight: `${luoxiaoheiTemplateSpec.titleLineHeight}px`,
            letterSpacing: `${luoxiaoheiTemplateSpec.titleLetterSpacing}px`,
            color: form.bgColor2,
          }}
        >
          {form.titleLeft || " "}
        </div>

        <div
          className="mt-5 flex flex-col items-start"
          style={{
            color: form.bgColor2,
            fontSize: luoxiaoheiTemplateSpec.colorMetaFontSize,
            lineHeight: `${luoxiaoheiTemplateSpec.colorMetaLineHeight}px`,
            fontFamily: 'Roboto, Arial, sans-serif',
          }}
        >
          <span>{formatRgbLabel(form.bgColor1)}</span>
          <span style={{ marginTop: luoxiaoheiTemplateSpec.colorMetaGap }}>
            {formatHueLabel(form.bgColor1)}
          </span>
        </div>
      </div>

      <div
        className="absolute z-20 flex flex-col items-end"
        style={{
          right: luoxiaoheiTemplateSpec.titlePaddingSide,
          top: luoxiaoheiTemplateSpec.rightTextTop,
        }}
      >
        <div
          style={{
            ...sourceHanTitleStyle,
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            fontSize: luoxiaoheiTemplateSpec.titleFontSize,
            lineHeight: `${luoxiaoheiTemplateSpec.titleLineHeight}px`,
            letterSpacing: `${luoxiaoheiTemplateSpec.titleLetterSpacing}px`,
            color: form.bgColor1,
          }}
        >
          {form.titleRight || " "}
        </div>

        <div
          className="mt-5 flex flex-col items-end text-right"
          style={{
            color: form.bgColor1,
            fontSize: luoxiaoheiTemplateSpec.colorMetaFontSize,
            lineHeight: `${luoxiaoheiTemplateSpec.colorMetaLineHeight}px`,
            fontFamily: 'Roboto, Arial, sans-serif',
          }}
        >
          <span>{formatRgbLabel(form.bgColor2)}</span>
          <span style={{ marginTop: luoxiaoheiTemplateSpec.colorMetaGap }}>
            {formatHueLabel(form.bgColor2)}
          </span>
        </div>
      </div>

      <div
        className="absolute z-20"
        style={{
          left: layout.nameFrame.x,
          top: layout.nameFrame.y,
          width: layout.nameFrame.width,
          height: layout.nameFrame.height,
        }}
      >
        <img
          src={luoxiaoheiAssets.nameframeImage}
          alt=""
          className="pointer-events-none absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 select-none object-fill"
        />
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            ...sourceHanNameStyle,
            transform: "translate(-50%, -50%)",
            color: "#111111",
            fontSize: luoxiaoheiTemplateSpec.nameFontSize,
            fontWeight: luoxiaoheiTemplateSpec.nameFontWeight,
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            lineHeight: `${luoxiaoheiTemplateSpec.nameFrameTextLineHeight}px`,
            height: `${nameTextHeight}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {displayName}
        </div>
      </div>

      <img
        src={logoAssetMap[form.logoColor]}
        alt=""
        className="pointer-events-none absolute z-20 select-none"
        style={{
          left: layout.logo.x,
          top: layout.logo.y,
          width: layout.logo.width,
          height: layout.logo.height,
        }}
      />
    </div>
  );
}
