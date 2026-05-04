import { useMemo } from "react";
import {
  akRecruitAssets,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
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
};

export function AkRecruitPreview({ form, imageSize }: AkRecruitPreviewProps) {
  const professionAsset = form.profession ? professionAssetMap[form.profession] : null;
  const imageLayout = useMemo(() => {
    if (!form.imageUrl || !imageSize) {
      return null;
    }

    return getImageLayout(
      imageSize.width,
      imageSize.height,
      form.scale,
      form.offsetX,
      form.offsetY,
    );
  }, [form.imageUrl, form.offsetX, form.offsetY, form.scale, imageSize]);

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
          className="pointer-events-none absolute select-none"
          style={{
            left: imageLayout.imageX,
            top: imageLayout.imageY,
            width: imageLayout.imageWidth,
            height: imageLayout.imageHeight,
          }}
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
              className={`h-[90px] w-[90px] ${index === 0 ? "" : "-ml-[35px]"}`}
            />
          ))}
        </div>

        <div className="mt-[18px] flex items-start gap-1">
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
