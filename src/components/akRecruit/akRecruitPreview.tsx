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
  getRecruitGradientLayout,
  getRecruitIntroLayout,
  getRecruitIntroTextAlign,
  getRecruitInfoLayout,
  wrapRecruitIntroLines,
} from "@/components/akRecruit/akRecruitLayout";
import { useAkRecruitImageTransform } from "@/components/akRecruit/useAkRecruitImageTransform";

type AkRecruitPreviewProps = {
  form: RecruitFormState;
  imageSize: ImageSize | null;
  previewScale: number;
  onImageTransformCommit: (
    next: Pick<
      RecruitFormState,
      "imageScale" | "imageOffsetX" | "imageOffsetY"
    >,
  ) => void;
};

export function AkRecruitPreview({
  form,
  imageSize,
  previewScale,
  onImageTransformCommit,
}: AkRecruitPreviewProps) {
  const professionAsset = form.profession
    ? professionAssetMap[form.profession]
    : null;
  const shouldShowRightBadges =
    form.showSeniorVoucher || form.showHeadhuntingContract;

  const baseLayout = useMemo(() => {
    if (!imageSize) {
      return null;
    }

    return getBaseImageLayout(imageSize.width, imageSize.height);
  }, [imageSize]);

  const infoLayout = useMemo(
    () => getRecruitInfoLayout(form),
    [form],
  );
  const introLines = useMemo(
    () => wrapRecruitIntroLines(form.intro),
    [form.intro],
  );
  const introLayout = useMemo(
    () => getRecruitIntroLayout(introLines.length),
    [introLines.length],
  );
  const introTextAlign = useMemo(
    () => getRecruitIntroTextAlign(introLines.length),
    [introLines.length],
  );
  const gradientLayout = useMemo(() => getRecruitGradientLayout(), []);
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

      {form.isNewOperator ? (
        <img
          src={akRecruitAssets.newTagImage}
          alt=""
          className="pointer-events-none absolute z-[2] h-auto select-none"
          style={{
            left: akRecruitTemplateSpec.newTagLeft,
            top: akRecruitTemplateSpec.newTagTop,
            width: akRecruitTemplateSpec.newTagWidth,
          }}
        />
      ) : null}

      {shouldShowRightBadges ? (
        <div
          className="absolute z-[2] flex flex-col items-end"
          style={{
            top: akRecruitTemplateSpec.rightBadgeTop,
            right: akRecruitTemplateSpec.rightBadgeRight,
          }}
        >
          {form.showSeniorVoucher ? (
            <img
              src={akRecruitAssets.seniorVoucherIconImage}
              alt=""
              className="h-auto"
              style={{
                width: akRecruitTemplateSpec.rightBadgeWidth,
                height: akRecruitTemplateSpec.rightBadgeHeight,
              }}
            />
          ) : null}
          {form.showHeadhuntingContract ? (
            <img
              src={akRecruitAssets.headhuntingContractIconImage}
              alt=""
              className="h-auto"
              style={{
                width: akRecruitTemplateSpec.rightBadgeWidth,
                height: akRecruitTemplateSpec.rightBadgeHeight,
              }}
            />
          ) : null}
        </div>
      ) : null}

      <div
        className="pointer-events-none absolute inset-x-0 z-[2]"
        style={{
          top: gradientLayout.top,
          height: gradientLayout.height,
          background: gradientLayout.previewBackground,
        }}
      />

      <div
        className={`absolute z-[2] ${
          introTextAlign === "center" ? "text-center" : "text-left"
        }`}
        style={{
          ...posterIntroStyle,
          fontSize: akRecruitTemplateSpec.introFontSize,
          color: akRecruitTemplateSpec.textColor,
          left: introLayout.x,
          top: introLayout.y,
          width: introLayout.width,
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
