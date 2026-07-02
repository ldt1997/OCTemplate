# 工程规范

## 技术栈

- Frontend: React + Vite
- Language: TypeScript
- Styling: Tailwind CSS
- UI Library: shadcn/ui
- Icons: lucide-react
- State: React state
- Assets: 本地图片和字体资源
- Deployment target: Cloudflare Pages

除非某个模板确实需要新的底层能力，否则不要引入新的重型依赖。

## 当前项目结构

核心目录：

```text
src/
  app/                  应用入口、路由、Provider
  assets/               模板图片、字体、预览图等静态资源
  components/
    <template>/         模板相关组件和导出逻辑
    layout/             页面布局组件
    shared/             跨页面共享组件
    template/           首页模板卡片等模板入口组件
    ui/                 shadcn/ui 基础组件
  data/                 模板列表等静态数据
  lib/                  通用工具函数
  pages/                路由页面
  styles/               全局样式和字体声明
  types/                通用类型定义
```

## 模板模块推荐结构

新增模板优先参考 `br` 的新版本方向，但不把它视为不可变最佳实践。目标是保持预览与导出一致，同时让文件职责清晰。

推荐文件：

```text
src/pages/<template>Page.tsx
src/components/<template>/<template>Config.ts
src/components/<template>/use<Template>Editor.ts
src/components/<template>/<template>Toolbar.tsx
src/components/<template>/<template>Viewport.tsx
src/components/<template>/<template>Canvas.tsx
src/components/<template>/<template>Renderer.ts
src/components/<template>/<template>Resources.ts
src/components/<template>/<template>Poster.ts
src/components/<template>/<template>Layout.ts
```

按复杂度裁剪即可。简单模板不需要机械创建全部文件，但不要把多个长期增长的职责堆进一个文件。

## 文件职责

`<template>Page.tsx`

- 组合页面结构。
- 配置 Header 操作，如导出按钮。
- 组合 Toolbar、Viewport、Canvas。
- 不直接承载复杂状态、副作用和绘制逻辑。

`use<Template>Editor.ts`

- 管理表单状态。
- 处理图片上传。
- 处理 Object URL 生命周期。
- 处理字体预加载、图片尺寸读取等异步副作用。
- 暴露导出状态和导出 handler。

`<template>Config.ts`

- 定义表单类型。
- 定义默认表单值。
- 定义选项列表和资源映射。
- 定义模板尺寸。
- 定义唯一的 `templateSpec`，收口影响最终图片结果的视觉参数。

`<template>Layout.ts`

- 提供预览和导出共享的纯计算。
- 包含文本换行、位置计算、尺寸计算、对齐计算。
- 不读取 React 状态，不操作 DOM。

`<template>Viewport.tsx`

- 测量可用空间。
- 计算最终画布在编辑器中的展示尺寸。
- 处理空状态。

`<template>Canvas.tsx`

- 负责预览 canvas 渲染。
- 调用共享 renderer。
- 处理预览重绘调度。
- 如模板支持图片拖拽和缩放，可在这里绑定交互并回写状态。

`<template>Renderer.ts`

- 负责整帧绘制顺序。
- 同时服务预览和导出。
- 消费资源、form、spec、layout 结果。

`<template>Resources.ts`

- 加载字体和图片。
- 缓存资源 Promise。
- 读取图片尺寸。
- 回收 Object URL 相关缓存。

`<template>Poster.ts`

- 创建导出 canvas。
- 等待字体和资源加载。
- 调用共享 renderer 绘制最终图片。
- 使用 `canvas.toBlob()` 导出。

`<template>Toolbar.tsx`

- 渲染模板参数输入。
- 桌面端和移动端可以有不同外壳。
- 重复的字段内容应抽成共享渲染片段。

## 预览与导出一致性

新模板默认采用 canvas 预览和 canvas 导出。

核心规则：

- 不通过截图 DOM 导出。
- 不依赖 Tailwind 或 DOM 样式保证最终图片一致。
- 预览和导出共享模板尺寸、`templateSpec`、layout 计算和 renderer。
- 导出尺寸使用模板定义尺寸，不能受屏幕尺寸、预览缩放和设备像素比影响。
- 预览可以使用降采样 render size，但布局计算仍以最终尺寸坐标系为基准。

允许差异：

- 预览优先交互流畅。
- 导出优先图像质量。
- 预览 canvas 的像素尺寸可以小于导出尺寸。

不允许差异：

- 同一文本在预览和导出中使用两套换行逻辑。
- 同一图层在预览和导出中使用两套坐标规则。
- 字体、字号、描边、颜色等最终视觉参数只写在 className 中。

## 模板视觉规格对象

每个模板应有唯一的模板级视觉规格对象，例如：

```ts
export const exampleTemplateSpec = {
  canvasWidth: 1920,
  canvasHeight: 1080,
  titleFontSize: 120,
  textColor: "#ffffff",
  textStrokeWidth: 3,
} as const;
```

应收口到 spec 或 layout 的内容：

- 画布宽高
- 字号、字重、行高
- 字体名称
- 颜色、描边、阴影
- 图层坐标和尺寸
- 间距
- 渐变区域
- 文本对齐方式
- 图片裁切和缩放规则

仅影响编辑器体验的样式可以留在组件 className 中。

## 资源与字体

模板资源放置在：

```text
src/assets/<template>/
```

字体要求：

- 优先使用项目内真实字体文件。
- 可以提供 fallback 字体栈，但项目内字体应为主路径。
- 字体加载使用单例 Promise。
- 字体未加载完成前，不允许导出。
- 预览与导出应共用同一字体定义。

图片要求：

- 上传图片时校验类型和大小。
- 替换上传图片时回收旧 Object URL。
- 页面卸载时回收当前 Object URL。
- 资源加载失败时给出可理解的错误。

## 性能与兼容性

性能原则：

- 预览重绘使用 `requestAnimationFrame` 合帧。
- 高频 slider 更新只改变参数，不重复创建重型资源。
- 图片加载 Promise 可以缓存。
- 导出优先使用 `canvas.toBlob()`，避免默认使用 `toDataURL()`。
- 下载完成后回收导出 Object URL。

兼容性原则：

- 同时支持桌面浏览器和移动端浏览器。
- 不默认信任移动端完整支持 `CanvasRenderingContext2D.filter`。
- 移动端交互优先保证基础可用。
- 避免依赖不稳定 DOM 截图结果。

## 代码维护原则

- 保持文件职责单一。
- 不为了复用提前创建复杂通用框架。
- 不把模板私有逻辑过早抽到全局。
- mock data 放在独立文件或 config 中。
- magic number 优先进入 `templateSpec`。
- 公共工具只有在两个以上模板确实复用时再抽取。
- 每次新增模板只修改相关文件，不顺手重构无关模块。

## 复杂度预警

出现以下情况时，应考虑轻量拆分：

- Page 中出现多个 `useState` 和 `useEffect`，并同时处理上传、导出和异步读取。
- Config 中出现大量布局计算函数。
- Poster 同时承担共享布局规则和导出入口。
- Toolbar 桌面端和移动端字段内容重复。
- Preview 或 Canvas 中写入大量最终视觉参数。

拆分目标不是增加文件数量，而是让长期变化的职责有清晰边界。
