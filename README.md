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
- 暂时静态资源存放：/temp_assets，请将他们存放在合适的位置，并在最后删除这个临时文件夹

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

#### 组件功能和详情
1. ToolBar表单配置项
配置修改后实时生效。
```json
{
  legend: "形象设置",
  desc: "调整人物图片的显示效果与位置",
  fields: [
    {
      component: "Input",
      type: "file",
      label: "人物图片",
      id: "image",
      options: null,
      placeholder: "上传图片",
      constraints: {
        accept: "image/png, image/jpeg",
        maxSize: "5MB"
      },
      default: null
    },
    {
      component: "Slider",
      label: "图片缩放",
      id: "scale",
      options: {
        min: 0.1,
        max: 1,
        step: 0.01
      },
      placeholder: null,
      constraints: null,
      default: 0.5
    },
    {
      component: "Slider",
      label: "水平偏移 (X)",
      id: "offsetX",
      options: {
        min: 0,
        max: 1,
        step: 0.01
      },
      placeholder: null,
      constraints: null,
      default: 0.5
    },
    {
      component: "Slider",
      label: "垂直偏移 (Y)",
      id: "offsetY",
      options: {
        min: 0,
        max: 1,
        step: 0.01
      },
      placeholder: null,
      constraints: null,
      default: 0.5
    }
  ]
}
```

```json
{
  legend: "角色信息",
  desc: "选择角色星级职业和所属组织",
  fields: [
    {
      component: "Select",
      label: "所属组织",
      id: "organization",
      options: [
  { label: "罗德岛", value: "rhodes_island" },
  { label: "莱茵生命", value: "rhine" },
  { label: "龙门", value: "lungmen" },
  { label: "深海猎人", value: "abyssal_hunters" },
  { label: "企鹅物流", value: "penguin_logistics" },
  { label: "黑钢国际", value: "black_steel" },
  { label: "莱塔尼亚", value: "leithania" }
],
      placeholder: "选择组织",
      constraints: null,
      default: "lungmen"
    },
    {
      component: "Select",
      label: "职业",
      id: "profession",
      options: [
  { label: "先锋", value: "vanguard" },
  { label: "近卫", value: "guard" },
  { label: "重装", value: "defender" },
  { label: "狙击", value: "sniper" },
  { label: "术师", value: "caster" },
  { label: "医疗", value: "medic" },
  { label: "辅助", value: "supporter" },
  { label: "特种", value: "specialist" }
],
      placeholder: "选择职业",
      constraints: null,
      default: null
    },
    {
      component: "Slider",
      label: "星级",
      id: "rarity",
      options: {
        min: 1,
        max: 6,
        step: 1
      },
      placeholder: null,
      constraints: null,
      default: 6
    }
  ]
}
```

```json
{
  legend: "文本信息",
  desc: "设置角色展示文本",
  fields: [
    {
      component: "Input",
      label: "名称",
      id: "name",
      options: null,
      placeholder: "10个字以内",
      constraints: {
        maxLength: 10
      },
      default: ""
    },
    {
      component: "Input",
      label: "英文名称",
      id: "enName",
      options: null,
      placeholder: "20个字以内",
      constraints: {
        maxLength: 20
      },
      default: ""
    },
    {
      component: "Textarea",
      label: "开场白",
      id: "intro",
      options: null,
      placeholder: "100字以内",
      constraints: {
        maxLength: 100
      },
      default: ""
    }
  ]
}
```

2. 画布：支持滚轮（浏览器）和双指（移动端）缩放。支持拖动画布，拖动时鼠标变为抓取手的形状。该缩放和移动应在模版图片外部，不应影响画布内容布局。

3. 模版图片部分：尺寸固定为1920*1080px，超出画布的内容需要隐藏。所需静态资源和字体暂时存放在/temp_assets。图层信息依次为：
- bg.webp：背景图片，占满画布。
- 所属组织（organization）：对应图片资源为 organization_white.webp (需要维护一个映射)。图片宽度为500px，位置固定为X：342，Y：190
- 人物图片（image），默认和画布同高，位于画布垂直居中
- 角色信息（charinfo）：位于画布水平居中，Y：586。内部从上至下流式布局，左侧居中
    - stars：左侧margin 16px，星星从左至右流式排列，水平gap -35px
    - 角色名称和职业：左右flex排列，gap 4px
        - 角色职业（profession），对应图片为profession.webp(需要维护一个映射)
        - 角色名称：上下排列，左对齐
            - 中文名称（name）：字体：Source han Serif CN，weight：heavy，size：120px；color：white；border：1px，black，solid
            - 英文名称（enName）：字体：Novensento wide，weight：Normal，size：48px；color：white；border：1px，black，solid
- 底部文本遮罩：100%宽，只有底部5%为黑色，到顶部渐变到透明
- 文本（intro）：固定宽度80，水平居中，距离底部120 margin，字体：Hei，regular，size：36px，白色

4. 导出：点击后下载当前模版图片到本地。导出尺寸为1920*1080，该方法应同时兼容浏览器和移动端，无元素错位。命名为akrecruit_当前时间戳,格式为png。


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
- 初始化页面结构
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