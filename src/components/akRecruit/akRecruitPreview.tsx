import { useMemo } from "react";
import {
  akRecruitAssets,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  organizationAssetMap,
  posterEnNameStyle,
  posterIntroStyle,
  posterNameStyle,
  professionAssetMap,
  akRecruitTemplateSpec,
  type ImageSize,
  type RecruitFormState,
} from "@/components/akRecruit/akRecruitConfig";
import {
  getBaseImageLayout,
  getRecruitInfoLayout,
  wrapRecruitIntroLines,
} from "@/components/akRecruit/akRecruitLayout";
import { useAkRecruitImageTransform } from "@/components/akRecruit/useAkRecruitImageTransform";

type AkRecruitPreviewProps = {
  form: RecruitFormState;
  imageSize: ImageSize | null;
  fontsReady: boolean;
  previewScale: number;
  onImageTransformCommit: (
    next: Partial<
      Pick<RecruitFormState, "imageScale" | "imageOffsetX" | "imageOffsetY">
    >,
  ) => void;
};

export function AkRecruitPreview({
  form,
  fontsReady,
  imageSize,
  previewScale,
  onImageTransformCommit,
}: AkRecruitPreviewProps) {
  const professionAsset = form.profession
    ? professionAssetMap[form.profession]
    : null;

  const baseLayout = useMemo(() => {
    if (!imageSize) {
      return null;
    }

    return getBaseImageLayout(imageSize.width, imageSize.height);
  }, [imageSize]);

  const infoLayout = useMemo(
    () => getRecruitInfoLayout(form),
    [fontsReady, form],
  );
  const introLines = useMemo(
    () => wrapRecruitIntroLines(form.intro),
    [fontsReady, form.intro],
  );
  const { imageRef, isDragging, overlayHandlers } = useAkRecruitImageTransform({
    enabled: Boolean(form.imageUrl),
    previewScale,
    value: {
      imageScale: form.imageScale,
      imageOffsetX: form.imageOffsetX,
      imageOffsetY: form.imageOffsetY,
    },
    onCommit: onImageTransformCommit,
  });

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
        style={{
          left: akRecruitTemplateSpec.organizationLeft,
          top: akRecruitTemplateSpec.organizationTop,
          width: akRecruitTemplateSpec.organizationWidth,
        }}
      />

      {form.imageUrl && baseLayout ? (
        <img
          ref={imageRef}
          src={form.imageUrl}
          alt="上传的角色图片"
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
        className={`absolute inset-0 z-[1] touch-none ${
          form.imageUrl
            ? isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
            : "cursor-default"
        }`}
        {...overlayHandlers}
      />

      <div
        className="absolute z-[2]"
        style={{
          left: infoLayout.blockLeft,
          top: akRecruitTemplateSpec.infoTop,
          width: infoLayout.blockWidth,
        }}
      >
        <div
          className="flex items-center"
          style={{ paddingLeft: akRecruitTemplateSpec.starLeftPadding }}
        >
          {Array.from({ length: form.rarity }).map((_, index) => (
            <img
              key={`star-${index}`}
              src={akRecruitAssets.starImage}
              alt=""
              className={index === 0 ? "" : ""}
              style={{
                width: akRecruitTemplateSpec.starSize,
                height: akRecruitTemplateSpec.starSize,
                marginLeft: index === 0 ? 0 : -akRecruitTemplateSpec.starOverlap,
              }}
            />
          ))}
        </div>

        <div
          className="flex items-start"
          style={{ marginTop: akRecruitTemplateSpec.infoGap }}
        >
          {professionAsset ? (
            <img
              src={professionAsset}
              alt=""
              className="h-auto shrink-0"
              style={{
                width: akRecruitTemplateSpec.professionWidth,
                marginTop: akRecruitTemplateSpec.professionTopOffset,
                marginRight: akRecruitTemplateSpec.professionGap,
              }}
            />
          ) : null}

          <div className="flex flex-col items-start">
            <div
              className="leading-none"
              style={{
                ...posterNameStyle,
                fontSize: akRecruitTemplateSpec.nameFontSize,
                fontWeight: akRecruitTemplateSpec.nameFontWeight,
                lineHeight: akRecruitTemplateSpec.nameLineHeight,
                color: akRecruitTemplateSpec.textColor,
              }}
            >
              {form.name || " "}
            </div>
            <div
              className="whitespace-nowrap leading-none"
              style={{
                ...posterEnNameStyle,
                fontSize: akRecruitTemplateSpec.enNameFontSize,
                lineHeight: akRecruitTemplateSpec.enNameLineHeight,
                color: akRecruitTemplateSpec.textColor,
              }}
            >
              {akRecruitTemplateSpec.enNameUppercase
                ? form.enName.toUpperCase()
                : form.enName || " "}
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[26%]"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.58) 18%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div
        className={`absolute left-1/2 z-[2] w-[1280px] max-w-[calc(100%-96px)] -translate-x-1/2 ${
          akRecruitTemplateSpec.introTextAlign === "left"
            ? "text-left"
            : akRecruitTemplateSpec.introTextAlign === "center"
              ? "text-center"
              : "text-right"
        }`}
        style={{
          ...posterIntroStyle,
          fontSize: akRecruitTemplateSpec.introFontSize,
          color: akRecruitTemplateSpec.textColor,
          bottom: akRecruitTemplateSpec.introBottom,
        }}
      >
        {introLines.map((line, index) => (
          <p
            key={`${line}-${index}`}
            className="m-0"
            style={{ lineHeight: `${akRecruitTemplateSpec.introLineHeight}px` }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
