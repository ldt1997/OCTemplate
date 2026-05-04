你是一个资深独立网站开发工程师。请从 0 开始帮我搭建一个轻量、清晰、可维护的网站项目。

## 1. 项目目标
我要开发的网站是：
提供多种支持参数配置化的图片模版，支持用户根据模版和参数生成统一视觉化风格的图片。该网站同时支持浏览器端和移动端访问。

目标用户是：
喜爱打造个人原创角色的二次元爱好者、插画创造者。

核心使用场景是：
选择某个模版，上传人物角色图片，配置参数（比如角色名称，背景颜色），预览效果（支持画布缩放），导出图片

## 2. 技术栈
请使用以下技术栈：
- Frontend: React + Vite
- Language: TypeScript
- Styling: Tailwind CSS
- UI Library: shadcn/ui
- Icons: lucide-react
- State Management: React state（如无必要，请勿引入不必要的状态管理）
- Data: 本地图片和字体资源
- Deployment target: Vercel

## 3. 开发原则
请严格遵守：
- 初期保持代码轻量，不引入不必要的库
- 优先实现静态页面和核心交互
- 组件结构清晰，但不要过度抽象
- 样式统一，避免全局样式混乱
- 使用UI组件库默认样式，不引入不必要的手写样式
- 页面支持浏览器端和移动端自响应
- 每个文件职责明确
- 不要一次性生成复杂架构
- 每一步修改后说明改了哪些文件、为什么这样设计
- 对于导出的图片，画布缩放和不同的屏幕分辨率下应保持导出图片的尺寸固定，且元素的相对位置和大小保持不变

## 4. 页面结构

### Layout
网站布局为上下结构，上面是Header，下面是页面内容

#### Header
- Figma原型：https://www.figma.com/design/VNhwRbO9bFCVtzCDAjSw1L/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E4%B8%AA%E4%BA%BA%E7%AE%80%E4%BB%8B?node-id=3218-227&t=qxN7QUZcFeCL6jK7-1
- 样式：白色背景，padding：12 16px；网站Logo和按钮组space between排列

功能：
- Logo：内容：OCTEMPLATE文字，样式如下：
```
    color: #ff385c;
    letter-spacing: -.02em;
    font-size: 24px;
    font-weight: 800;
    text-decoration: none;
    cursor: pointer;
```
点击后重定向到/

- 按钮组：从右到左flex排列，gap 12px，支持在子页面传入btn
 - Toggle theme Icon：icon button，样式为ghost，点击后切换暗黑模式（https://ui.shadcn.com/docs/dark-mode/vite）

### Pages
网站目前包含这些页面：

### Page 1: Home主页
路径：
/; /home

Figma原型：
- 浏览器端：https://www.figma.com/design/VNhwRbO9bFCVtzCDAjSw1L/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E4%B8%AA%E4%BA%BA%E7%AE%80%E4%BB%8B?node-id=3222-100&t=qxN7QUZcFeCL6jK7-1
- Mobile端：https://www.figma.com/design/VNhwRbO9bFCVtzCDAjSw1L/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E4%B8%AA%E4%BA%BA%E7%AE%80%E4%BB%8B?node-id=3227-557&t=qxN7QUZcFeCL6jK7-1

功能：
- Grid网格展示模版Card列表。

页面结构大致是：
- Header: 默认Header，不传入任何按钮。
- Main Content：背景色#F5F5F5，padding 32px
 - CardList: Grid布局，Grid的列数根据屏幕宽度自适应，gap 24px
    - Card：使用Card带图片组件（https://ui.shadcn.com/docs/components/radix/card#image），包含：模版图片，模版名称，单个标签，模版描述，底部按钮（点击后进入该模版界面）

### Page 2: 明日方舟干员招募模版
路径：
/akrecruit

功能：
- 暂时保持空白。

## 5. UI 风格
整体视觉风格：
极简，黑白

颜色倾向：
白色背景，黑色文字

布局偏好：
流式布局

字体偏好：
系统字体

参考网站或设计：
[shadcn官网](https://ui.shadcn.com/)

## 6. 当前优先级
现在请只完成第一阶段：

第一阶段目标：
- 初始化项目结构
- 创建基础页面
- 创建基础 layout
- 创建核心组件

请先输出：
1. 推荐的项目目录结构
2. 第一阶段需要创建的文件列表
3. 简短说明每个文件的职责

经过我人工确认后再开始生成代码。

## 7. 代码要求
- 使用清晰命名
- 添加必要但不过量的注释
- 避免 magic number
- 保持组件小而直观
- 不要创建暂时用不到的复杂工具函数
- mock data 放在独立文件中
- 样式尽量复用统一 class 或变量

## 8. 工作方式
请按小步提交的方式工作：
1. 先搭建基础结构
2. 再实现页面 layout
3. 再实现组件
4. 再填充 mock data
5. 最后优化样式和交互

每一步完成后，请说明：
- 修改了什么
- 下一步建议做什么
- 是否有可以暂时不做的复杂功能

如果发现我的需求会导致项目过早复杂化，请直接指出，并给出更轻量的替代方案。
如果发现我的需求有遗漏考虑的地方，请直接指出，说明理由，并给出解决方案。