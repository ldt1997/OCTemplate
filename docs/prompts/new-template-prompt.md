# 新模板开发 Prompt

你是一个资深独立网站开发工程师。请基于当前项目已有的 `akRecruit` 模板实现方式，继续新增一个图片模板页面。目标是保持项目轻量、清晰、可维护，并让“预览效果”和“导出图片”尽量一致。

## 项目背景

- 这是一个 React + Vite + TypeScript 的模板图片生成网站。
- 当前已有模板：`akRecruit`
- 已有能力：
  - 模板入口页和首页模板列表
  - 工具栏参数配置
  - 固定尺寸模板预览
  - 图片上传、缩放、位移
  - 统一视觉规格对象
  - Canvas 导出 PNG

## 技术栈

- Frontend: React + Vite
- Language: TypeScript
- Styling: Tailwind CSS
- UI Library: shadcn/ui
- Icons: lucide-react
- State: React state
- Assets: 本地图片、字体
- Deploy target: Vercel

## 开发原则

- 不引入不必要的新库
- 不重构已有结构，只修改和新增相关文件
- 保持和现有 `akRecruit` 模块一致的代码风格
- 优先复用现有页面结构、组件组织方式和导出逻辑
- 每个文件职责明确，避免单文件过大
- 页面同时支持浏览器端和移动端
- 导出图片尺寸必须固定，不能受屏幕尺寸和画布缩放影响
- 影响最终图片的视觉参数，统一收口到模板级 spec 中维护
- 只影响编辑器体验的样式，留在组件 className 中

## 你要做的事情

请新增一个模板，参考 `akRecruit` 的实现方式，完成以下内容：

1. 新增模板页面路由
2. 新增首页模板入口卡片
3. 新增模板工具栏
4. 新增模板预览组件
5. 新增模板导出逻辑
6. 新增模板专属配置与视觉规格对象
7. 接入模板所需的图片和字体资源

## 你必须先理解并遵守的现有实现方式

请优先参考当前 `akRecruit` 相关文件：

- `src/pages/akRecruitPage.tsx`
- `src/components/akRecruit/akRecruitToolbar.tsx`
- `src/components/akRecruit/akRecruitPreview.tsx`
- `src/components/akRecruit/akRecruitPoster.ts`
- `src/components/akRecruit/akRecruitConfig.ts`

新增模板时，请尽量沿用这套分工：

- `xxxPage.tsx`
  - 导出按钮
  - 页面结构编排
  - 组合 Toolbar / Canvas / Preview

- `useXxxEditor.ts`
  - 页面级状态
  - 图片上传处理
  - Object URL 生命周期管理
  - 图片元信息读取
  - 颜色提取等异步副作用
  - 导出 loading 和导出 handler

- `xxxLayout.ts`
  - 预览与导出共享的纯布局计算
  - 文本换行
  - 展示值格式化
  - 图片尺寸和位置计算

- `xxxToolbar.tsx`
  - 模板参数输入
  - 浏览器端与移动端不同外壳
  - 共用字段内容

- `xxxPreview.tsx`
  - 预览渲染
  - 与最终图片内容直接相关的视觉展示

- `xxxPoster.ts`
  - 导出逻辑
  - 资源加载
  - Canvas 绘制辅助函数
  - 消费共享布局计算，不反向提供给 Preview

- `xxxConfig.ts`
  - options
  - 类型
  - 默认表单值
  - 资源映射
  - 模板级视觉规格对象
  - 不要放持续膨胀的布局计算和副作用逻辑

## 模板级视觉规格对象要求

请为新模板创建唯一的模板级视觉规格对象，命名格式建议：

- `xxxTemplateSpec`

该对象统一维护：

- 字号
- 字重
- 行高
- 颜色
- 描边宽度和颜色
- 位置坐标
- 间距
- 宽高
- 渐变区域
- 文字对齐方式
- 其他所有影响最终导出图片结果的参数

不要把同一类视觉参数分散写在：

- Preview 的 Tailwind class
- 导出的 Canvas 常量
- Page 里的局部变量

## 预览与导出一致性要求

新增模板时，必须遵守以下规则：

1. 预览不是截图导出，而是 Canvas 重绘导出
2. 所以不能依赖 Tailwind 自动保证导出一致
3. 影响最终图片的布局和样式，必须由共享 spec 和共享布局函数驱动
4. 预览和导出要尽量共用：
   - 文本换行逻辑
   - 位置计算逻辑
   - 尺寸和间距参数
   - 字体与颜色定义
5. Preview 应依赖 `Config + Layout + interaction hook`，不要从 `Poster` 导入共享布局函数

## 文本处理要求

如果模板中存在多行文本：

- 不要只依赖 CSS 自动换行
- 请实现共享的换行函数
- 预览端和导出端共同消费同一份换行结果

如果模板中存在英文字段：

- 是否大写
- 字距
- 行高

这些规则也要显式写入模板 spec，而不是隐含在 className 中。

## 字体要求

- 模板依赖的字体优先使用项目内真实字体文件
- 不要依赖不确定的本地系统字体作为唯一来源
- 可以提供 fallback 字体栈，但项目内字体应为主路径
- 字体加载使用单例 Promise
- 字体未加载完成前，不允许导出
- 预览与导出应共用同一字体定义，不允许各自隐式兜底成不同字体

## 工具栏要求

- 浏览器端和移动端可以保留不同容器结构
- 但重复的分组内容应抽成共享渲染层
- 不要为了复用而把双端外壳强行混成一套复杂分支

## 资源放置要求

新增模板资源请放在类似目录：

- `src/assets/<template-name>/`

不要放在临时目录中长期保留。

## 生命周期与性能要求

请按下面的页面生命周期实现模板：

1. 初始化默认表单状态
2. 预加载导出所需字体
3. 用户输入更新统一 form state
4. 基于 form state 做共享布局和展示值派生
5. 预览负责展示，交互结果回写统一 form state
6. 导出时重新基于共享 spec 与 layout 重绘 Canvas
7. 清理 Object URL 和失效异步任务

同时必须检查以下性能与内存安全项：

- 替换上传图片时，必须 `URL.revokeObjectURL`
- 页面卸载时，必须清理当前图片 `ObjectURL`
- 图片尺寸读取、主题色提取等异步任务，必须防止旧任务回写新状态
- 导出优先使用 `canvas.toBlob()` + `URL.createObjectURL()`，不要默认使用 `toDataURL()`
- 下载完成后，需要回收导出用的 `ObjectURL`

## 重构与复杂度控制要求

如果新增模板过程中发现 `Page / Config / Poster` 任一文件开始同时承担多种职责，请优先做轻量拆分，而不是继续堆叠代码。推荐判断标准：

- `xxxPage.tsx` 出现多个 `useState + useEffect` 且包含上传、导出、异步读取逻辑时，应抽 `useXxxEditor.ts`
- `xxxConfig.ts` 同时包含大量布局计算函数时，应抽 `xxxLayout.ts`
- `xxxPoster.ts` 同时承担共享布局规则和导出入口时，应把共享纯函数移到 `xxxLayout.ts`

拆分目标不是增加文件数量，而是保持边界清晰：

- Page 负责编排
- Editor hook 负责状态和副作用
- Config 负责静态定义
- Layout 负责共享纯计算
- Preview 负责展示
- Poster 负责导出

## 输出要求

完成实现后，请按下面格式汇报：

1. 改了哪些文件
2. 每个文件的职责
3. 为什么这样设计
4. 预览与导出一致性是如何保证的
5. 是否完成了构建验证
6. 是否完成了生命周期与内存安全检查

## 开始开发前，你需要我补充的信息

如果我要新增一个模板，我会再提供以下信息，你应基于这些信息完成开发：

- 模板名称
- 路由路径
- 模板用途
- Figma 或视觉稿链接
- 画布固定尺寸
- 图层顺序
- 每个图层的位置、尺寸、间距
- 文本字段定义
- 表单字段定义
- 资源映射关系
- 导出要求
- 浏览器端和移动端布局要求

## 直接可复用的执行指令

当我下次要新增模板时，你可以直接按下面这段开始执行：

> 请基于当前项目已有的 `akRecruit` 模板实现方式，新增一个同级模板。保持项目现有技术栈、代码风格和文件职责拆分方式不变。请为新模板建立独立的 `Page / Toolbar / Preview / Poster / Config` 文件，并创建唯一的 `xxxTemplateSpec` 作为模板统一视觉规格来源。所有影响最终导出图片结果的布局和样式参数，都必须进入该 spec 或共享布局函数。预览和导出必须通过共享布局参数和共享文本换行逻辑来保证一致。完成后请说明修改文件、设计原因，并执行构建验证。
