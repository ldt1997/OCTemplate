# OCTemplate

一个基于 React + Vite + TypeScript 的图片模板生成网站。用户可以选择模板、上传图片、调整参数、实时预览，并导出固定尺寸的最终图片。

当前已实现模板：

- `akRecruit`：明日方舟干员招募图

## 技术栈

- React 19
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react

## 功能概览

- 首页模板列表
- 模板页面路由
- 浏览器端和移动端自适应工具栏
- 固定尺寸模板预览
- 上传图片后拖拽、缩放角色图
- 本地图片和字体资源管理
- Canvas 导出 PNG
- 浅色 / 暗黑模式切换

## 本地开发

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

生产构建：

```bash
npm run build
```

本地预览构建结果：

```bash
npm run preview
```

## 项目结构

```text
src/
  app/                  应用入口、路由、Provider
  assets/               模板图片、图标、字体等静态资源
  components/
    akRecruit/          akRecruit 模板相关组件与导出逻辑
    layout/             页面布局组件
    shared/             共享功能组件
    template/           首页模板卡片等模板入口组件
    ui/                 shadcn/ui 基础组件
  data/                 模板列表等静态数据
  lib/                  通用工具函数
  pages/                路由页面
  styles/               全局样式
  types/                通用类型定义
docs/
  prompts/              后续新增模板时可复用的开发 prompt
```

## 部署

项目部署目标为 Vercel。
