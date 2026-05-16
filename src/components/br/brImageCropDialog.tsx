import { useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { brTemplateSpec, type BrImageCropArea } from "@/components/br/brConfig";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type BrImageCropDialogProps = {
  open: boolean;
  imageUrl: string | null;
  onCancel: () => void;
  onConfirm: (cropArea: BrImageCropArea) => void;
};

export function BrImageCropDialog({
  open,
  imageUrl,
  onCancel,
  onConfirm,
}: BrImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(brTemplateSpec.crop.initialZoom);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setCrop({ x: 0, y: 0 });
    setZoom(brTemplateSpec.crop.initialZoom);
    setCroppedAreaPixels(null);
  }, [open, imageUrl]);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      if (!nextOpen) {
        onCancel();
      }
    }}>
      <DialogContent className="max-h-[90dvh] max-w-2xl overflow-hidden p-0">
        <DialogHeader className="border-b px-4 py-3">
          <DialogTitle>裁剪人物图片</DialogTitle>
          <DialogDescription>
            拖动图片并调整缩放，裁剪框固定为正方形。
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-[52dvh] min-h-[320px] bg-black">
          {imageUrl ? (
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={brTemplateSpec.crop.aspect}
              minZoom={brTemplateSpec.crop.minZoom}
              maxZoom={brTemplateSpec.crop.maxZoom}
              objectFit="contain"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, nextCroppedAreaPixels) => {
                setCroppedAreaPixels(nextCroppedAreaPixels);
              }}
            />
          ) : null}
        </div>

        <div className="px-4 py-4">
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
            <Button
              type="button"
              disabled={!croppedAreaPixels}
              onClick={() => {
                if (!croppedAreaPixels) {
                  return;
                }

                onConfirm({
                  x: Math.round(croppedAreaPixels.x),
                  y: Math.round(croppedAreaPixels.y),
                  width: Math.round(croppedAreaPixels.width),
                  height: Math.round(croppedAreaPixels.height),
                });
              }}
            >
              应用裁剪
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
