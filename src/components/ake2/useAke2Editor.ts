import { useEffect, useRef, useState } from "react";
import { ake2TemplateSpec, initialAke2FormState, type Ake2FormState } from "./ake2Config";
import { ake2Professions } from "./ake2Professions";
import { getAke2SelectionKey, type Ake2Point } from "./ake2Layout";
import { exportAke2Image } from "./ake2Poster";
import {
  disposeAke2ObjectUrl, ensureAke2FontsLoaded, loadAke2Image,
  loadAke2Resources, type Ake2Resources,
} from "./ake2Resources";

type TextField = "name" | "enName" | "watermark" | "description";

export function useAke2Editor() {
  const [form, setForm] = useState<Ake2FormState>(initialAke2FormState);
  const [resources, setResources] = useState<Ake2Resources | null>(null);
  const [resourceError, setResourceError] = useState<string | null>(null);
  const [fontError, setFontError] = useState<string | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const exportLock = useRef(false);
  const mounted = useRef(false);
  const uploadVersion = useRef(0);
  const ownedUrls = useRef(new Set<string>());
  const currentImageUrl = useRef<string | null>(null);

  const releaseUrl = (url: string) => {
    if (ownedUrls.current.delete(url)) disposeAke2ObjectUrl(url);
  };

  useEffect(() => {
    let active = true;
    mounted.current = true;
    void ensureAke2FontsLoaded().then(() => {
      if (active) setFontsReady(true);
    }).catch(() => {
      if (active) setFontError("模板字体加载失败，请刷新页面重试。");
    });
    const urls = ownedUrls.current;
    return () => {
      active = false;
      mounted.current = false;
      uploadVersion.current += 1;
      urls.forEach(disposeAke2ObjectUrl);
      urls.clear();
    };
  }, []);

  useEffect(() => {
    let active = true;
    setResourceError(null);
    void loadAke2Resources(form).then((loaded) => {
      if (active) setResources(loaded);
    }).catch(() => {
      if (active) setResourceError("海报图片加载失败，请重新选择图片、职业或刷新页面重试。");
    });
    return () => { active = false; };
    // 文本、颜色与位置变化只重绘，不重新加载资源。
  }, [form.profession, form.branch, form.image]);

  const resourcesReady = resources?.selectionKey === getAke2SelectionKey(form);
  const canExport = resourcesReady && fontsReady && !resourceError && !isImageLoading && !isExporting;

  const handleExport = async () => {
    if (!canExport || !resources || exportLock.current) return;
    exportLock.current = true;
    setIsExporting(true);
    setExportError(null);
    try {
      // 捕获点击时的表单与已解码资源；导出期间继续编辑不会改变本次导出。
      const blob = await exportAke2Image(form, resources);
      if (!mounted.current) return;
      const url = URL.createObjectURL(blob);
      ownedUrls.current.add(url);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${ake2TemplateSpec.filePrefix}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => releaseUrl(url), 1000);
    } catch (error) {
      if (mounted.current) setExportError(error instanceof Error ? error.message : "导出失败，请重试。");
    } finally {
      exportLock.current = false;
      if (mounted.current) setIsExporting(false);
    }
  };

  const onUpload = async (file: File | null) => {
    if (!file) return;
    const version = ++uploadVersion.current;
    setIsImageLoading(false);
    setImageError(null);
    if (!ake2TemplateSpec.image.acceptedTypes.includes(file.type)) {
      setImageError("请上传 PNG 或 JPEG 图片。");
      return;
    }
    if (file.size > ake2TemplateSpec.image.maxBytes) {
      setImageError("图片大小不能超过 10 MB。");
      return;
    }

    const url = URL.createObjectURL(file);
    ownedUrls.current.add(url);
    setIsImageLoading(true);
    try {
      const image = await loadAke2Image(url);
      if (version !== uploadVersion.current) {
        releaseUrl(url);
        return;
      }
      const previousUrl = currentImageUrl.current;
      currentImageUrl.current = url;
      setForm((current) => ({
        ...current,
        image: { url, name: file.name, width: image.naturalWidth, height: image.naturalHeight },
        scale: 100,
        imagePosition: { ...ake2TemplateSpec.image.initialPosition },
      }));
      if (previousUrl) releaseUrl(previousUrl);
    } catch {
      releaseUrl(url);
      if (version === uploadVersion.current) setImageError("无法读取这张图片，请选择有效的 PNG 或 JPEG 文件。");
    } finally {
      if (version === uploadVersion.current) setIsImageLoading(false);
    }
  };

  const onRemoveImage = () => {
    uploadVersion.current += 1;
    // 导出下载 URL 独立保留到下载开始，移除立绘只释放上传资源。
    if (currentImageUrl.current) releaseUrl(currentImageUrl.current);
    currentImageUrl.current = null;
    setIsImageLoading(false);
    setImageError(null);
    setForm((current) => ({ ...current, image: null }));
  };

  const onProfessionChange = (value: string) => {
    const profession = ake2Professions.find((item) => item.value === value);
    if (!profession) return;
    setForm((current) => ({
      ...current, profession: profession.value, branch: profession.branches[0].value,
    }));
  };

  const onBranchChange = (value: string) => {
    setForm((current) => {
      const profession = ake2Professions.find((item) => item.value === current.profession);
      const branch = profession?.branches.find((item) => item.value === value);
      return branch ? { ...current, branch: branch.value } : current;
    });
  };

  const onNumberChange = (field: "scale" | "rarity", value: number) => {
    if (!Number.isFinite(value)) return;
    const range = field === "scale" ? ake2TemplateSpec.image.scale : ake2TemplateSpec.rarity;
    setForm((current) => ({ ...current, [field]: Math.round(Math.max(range.min, Math.min(range.max, value))) }));
  };

  const onImagePositionChange = (position: Ake2Point) => {
    if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) return;
    setForm((current) => ({ ...current, imagePosition: position }));
  };

  const onResetImage = () => {
    setForm((current) => ({
      ...current, scale: 100, imagePosition: { ...ake2TemplateSpec.image.initialPosition },
    }));
  };

  return {
    form, resources, resourcesReady, resourceError, setResourceError, fontError, fontsReady,
    canExport, isExporting, exportError, handleExport, onImagePositionChange,
    toolbarProps: {
      form, imageError, isImageLoading, onUpload, onRemoveImage, onResetImage,
      onProfessionChange, onBranchChange, onNumberChange,
      onTextChange: (field: TextField, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
      },
      onThemeColorChange: (value: string) => {
        if (/^#[\da-f]{6}$/i.test(value)) setForm((current) => ({ ...current, themeColor: value }));
      },
    },
  };
}
