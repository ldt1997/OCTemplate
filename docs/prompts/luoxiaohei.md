# 模版信息
名称：罗小黑人物双色海报
描述：自动提取主题双色，一键生成风格统一的视觉海报。
路径：/luoxiaohei

模版所需静态资源位于临时文件夹 /temp_assets，请将其中内容放置于正确的位置，并在开发结束后删除此文件夹。

# 页面原型
Figma原型：
- 浏览器端：和 /akrecruit 页面保持一致
- Mobile端：和 /akrecruit 页面保持一致
- 该模版图层示例：https://www.figma.com/design/VNhwRbO9bFCVtzCDAjSw1L/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E4%B8%AA%E4%BA%BA%E7%AE%80%E4%BB%8B?node-id=3265-102&t=qxN7QUZcFeCL6jK7-1

* 注：当Figma MCP无法读取原型时，以用户上传的图片为备用参考。

用户如何使用此页面：
- 用户在工具栏输入参数配置。在画布预览模版效果，点击导出最终图片。

## 页面结构
- Header: 默认Header，传入导出按钮
- Main Content
    - ToolBar
        - 浏览器端：固定在左侧
        - 移动端：位在底部，为Drawer
    - 画布：背景颜色不设置，padding为0，默认占满剩余宽度
        - 预览模版模块：默认占满画布宽度

# 组件功能和详情
1. ToolBar表单配置项
配置修改后实时生效。
```json
[
  {
    legend: "基础设置",
    desc: "",
    fields: [
      {
        component: "Input",
        type: "file",
        label: "上传图片",
        id: "image",
        default: null,
      },
      {
        component: "Slider",
        label: "缩放",
        id: "scale",
        options: {
          min: 0.1,
          max: 2,
          step: 0.01,
        },
        default: 1,
      },
      {
        component: "ButtonGroup",
        label: "推荐色卡",
        id: "presetColors",
        options: 三个选项，每个选项为色卡，包含两种cht-color中的传统颜色,
        default: 当前选项第一个,
      },
      {
        component: "ColorPicker",
        label: "背景色 1",
        id: "bgColor1",
        default: "#ff385c",
      },
      {
        component: "ColorPicker",
        label: "背景色 2",
        id: "bgColor2",
        default: "#222222",
      },
      {
        component: "Input",
        label: "左侧标题",
        id: "titleLeft",
        default: "",
        placeholder: "朝",
      },
      {
        component: "Input",
        label: "右侧标题",
        id: "titleRight",
        default: "",
        placeholder: "夜",
      },
      {
        component: "Input",
        label: "人物名称",
        id: "name",
        default: "",
        placeholder: "请输入角色名称",
      },
    ],
  },

  {
    name: "LOGO",
    fields: [
      {
        component: "ButtonGroup",
        label: "LOGO 颜色",
        id: "logoColor",
        options: [
          { label: "黑色", displayValue: "#000000",value:'black' },
          { label: "红色", displayValue: "#560f0c",value:'red' },
          { label: "黄色", displayValue: "#564b0c",value:'yellow' },
          { label: "绿色", displayValue: "#0c561f" ,value:'green'},
          { label: "蓝色", displayValue: "#120d57" ,value:'blue'},
          { label: "白色", displayValue: "#FFFFFF" ,value:'white'},
        ],
        default: "black",
      },
    ],
  },
];
```

主题色卡交互逻辑：
1. 用户上传图片后，将提取图片中前三个主题色，并将每个主题色映射到cht-color.json中与其最相近的颜色。将其组合成3个双色色卡，默认选中第一个双色色卡。
2. 选中色卡后，自动更改bgColor1颜色为色卡中第一个颜色值，将titleLeft更改为色卡中第一个颜色对应的名字。自动更改bgColor2颜色为色卡中第二个颜色值，将titleRight更改为色卡中第二个颜色对应的名字。

2. 画布：占满剩余宽度，高度占满剩余高度，不出现滚动条

3. 模版图片部分：预览时高度占满画布高度，宽度自适应。导出尺寸固定为1080*1920px，超出画布的内容需要隐藏。图层信息依次为：
- ColorBlocks:从左至右flex布局
    - LeftColorBlock：540*1920px，背景颜色从上至下渐变：0% bgColor1, 50% bgColor1, 100% #fff
    - rightColorBlock：540*1920px，背景颜色从上至下渐变：0% bgColor2, 50% bgColor2, 100% #fff
- bamboo.webp 占满画布
- TextBlocks
    - LeftTextBlock：绝对定位，left 0px, top 0px。内部从上至下流式布局，Align bottom left, gap为0px。
        - leftTitle：内容为leftTitle，字体Source Han（src/assets/akrecruit/SourceHanSerifCN-Regular-1.otf），size 220px，color：bgColor2，竖直排列
        - colorRGB：内容为bgColor1的大写rgb值（e.g., RGB 210 173 93），字体为Roboto，兜底字体为系统默认字体，size30，color为bgColor2
        - colorHue：内容为bgColor1的小写hue值（e.g., d2ad5d），字体为Roboto，兜底字体为系统默认字体，size30，color为bgColor2
    - RightTextBlock：绝对定位，right 0px, top 0px。内部从上至下流式布局，Align top right, gap为0px。
        - rightTitle：内容为 rightTitle ，字体Source Han（src/assets/akrecruit/SourceHanSerifCN-Regular-1.otf），size 220px，color：bgColor1，竖直排列
        - colorRGB：内容为bgColor2的大写rgb值（e.g., RGB 210 173 93），字体为Roboto，兜底字体为系统默认字体，size30，color为bgColor1
        - colorHue：内容为bgColor2的小写hue值（e.g., d2ad5d），字体为Roboto，兜底字体为系统默认字体，size30，color为bgColor1
- 用户上传图片：默认尺寸为模版高度的70%，水平垂直居中，支持拖动移动位置
- luoxiaoheiLoGO：尺寸固定为604*300px，水平居中，距离bottom 58px。根据logoColor选择对应的logo.webp（需要维护一个映射

4. 导出：点击后下载当前模版图片到本地。导出尺寸为1080*1920px，该方法应同时兼容浏览器和移动端，无元素错位。命名为luoxiaohei_当前时间戳,格式为png。

## 5. UI 风格
整体视觉风格：
极简，黑白，无圆角

颜色倾向：
白色背景，黑色文字

布局偏好：
流式布局

字体偏好：
系统字体

参考网站或设计：
[shadcn官网](https://ui.shadcn.com/)

## 7. 代码要求
- 使用清晰命名
- 添加必要但不过量的注释
- 避免 magic number
- 保持组件小而直观
- 不要创建暂时用不到的复杂工具函数
- mock data 放在独立文件中
- 样式尽量复用统一 class 或变量
- 除了特殊情况，单个文件不要超过350line

## 工作方式
请先输出：
1. 推荐的项目目录结构
2. 第一阶段需要创建的文件列表
3. 简短说明每个文件的职责

经过我人工确认后再开始生成代码。

每一步完成后，请说明：
- 修改了什么
- 下一步建议做什么
- 是否有可以暂时不做的复杂功能

如果发现我的需求会导致项目过早复杂化，请直接指出，并给出更轻量的替代方案。
如果发现我的需求有遗漏考虑的地方，请直接指出，说明理由，并给出解决方案。