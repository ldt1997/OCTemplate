import { useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { ake2TemplateSpec, type Ake2Background } from "./ake2Config";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  image: Ake2Background | null;
  onCancel: () => void;
  onConfirm: (crop: Ake2Background["crop"]) => void;
};

function CropEditor({
  image,
  onCancel,
  onConfirm,
}: Omit<Props, "image"> & { image: Ake2Background }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const maxZoom = Math.max(
    3,
    image.width / image.crop.width,
    image.height / image.crop.height,
  );
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent className="max-h-[90dvh] max-w-3xl overflow-y-auto p-0">
        <DialogHeader className="border-b px-4 py-3">
          <DialogTitle>裁剪背景图片</DialogTitle>
          <DialogDescription>
            拖动图片并调整缩放，裁剪框尺寸为 4:3
          </DialogDescription>
        </DialogHeader>
        <div className="relative h-[42dvh] min-h-48 bg-black">
          <Cropper
            image={image.url}
            crop={crop}
            zoom={zoom}
            aspect={
              ake2TemplateSpec.canvasWidth / ake2TemplateSpec.canvasHeight
            }
            minZoom={1}
            maxZoom={maxZoom}
            objectFit="contain"
            showGrid={false}
            initialCroppedAreaPixels={image.crop}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropAreaChange={(_, pixels) => setArea(pixels)}
          />
        </div>
        <DialogFooter className="flex-row justify-end gap-2 px-4 py-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button
            type="button"
            disabled={!area}
            onClick={() => {
              if (area) onConfirm(area);
            }}
          >
            应用裁剪
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Ake2BackgroundCropDialog({ image, ...props }: Props) {
  return image ? <CropEditor key={image.url} image={image} {...props} /> : null;
}
