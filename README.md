你是一个资深独立网站开发工程师。请协助我完成搭建一个轻量、清晰、可维护的网站项目。这是一个已有项目，请在此基础上继续开发。

项目信息：
- 项目目标：提供多种支持参数配置化的图片模版，支持用户根据模版和参数生成统一视觉化风格的图片。该网站同时支持浏览器端和移动端访问。
- 核心使用场景是：
选择某个模版，上传人物角色图片，配置参数（比如角色名称，背景颜色），预览效果（支持画布缩放），导出图片
- 当前状态：已完成框架搭建和首页开发（使用mockdata）

## 技术栈
请使用以下技术栈：
- Frontend: React + Vite
- Language: TypeScript
- Styling: Tailwind CSS
- UI Library: shadcn/ui
- Icons: lucide-react
- State Management: React state（如无必要，请勿引入不必要的状态管理）
- Data: 本地图片和字体资源
- Deployment target: Vercel

## 开发原则
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
- 不重构已有结构，不引入新库
- 保持当前代码风格，只修改相关文件
- 对于导出的图片，画布缩放和不同的屏幕分辨率下应保持导出图片的尺寸固定，且元素的相对位置和大小保持不变

## 当前要开发的新功能

### 明日方舟干员招募模版
路径：
/akrecruit

Figma原型：
- 浏览器端：https://www.figma.com/design/VNhwRbO9bFCVtzCDAjSw1L/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E4%B8%AA%E4%BA%BA%E7%AE%80%E4%BB%8B?node-id=3211-890&t=qxN7QUZcFeCL6jK7-1
- Mobile端：https://www.figma.com/design/VNhwRbO9bFCVtzCDAjSw1L/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E4%B8%AA%E4%BA%BA%E7%AE%80%E4%BB%8B?node-id=3218-151&t=qxN7QUZcFeCL6jK7-1
- 该模版图层和配置示例：https://www.figma.com/design/VNhwRbO9bFCVtzCDAjSw1L/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E4%B8%AA%E4%BA%BA%E7%AE%80%E4%BB%8B?node-id=3203-239&t=qxN7QUZcFeCL6jK7-1

页面功能：
- 用户在工具栏输入参数配置。在画布预览模版效果，点击导出最终图片。

页面结构大致是：
- Header: 默认Header，传入导出按钮（primary样式，包含download icon和文字“导出”）
- Main Content：背景色#F5F5F5，高度为减去Header的剩余屏幕高度。
    - ToolBar：背景颜色为白色，padding 16px。
        - 浏览器端样式：固定在左侧，宽度固定320px，其中的选项以 FieldGroup 垂直流式排列，支持y项滚动
        - 移动端样式：位在底部，位于画布上一层，根据FieldGroup分为多个Tab，Tab标题为FieldGroup标题，内容高度根据FieldGroup内容自适应，不滚动。
    - 画布：背景颜色不设置，padding为0，默认占满剩余宽度
        - 预览模版模块：默认占满画布宽度

- 组件功能：
    - 

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

## 工作方式
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