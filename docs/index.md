# OCTemplate 文档入口

OCTemplate 是一个基于 React + Vite + TypeScript 的图片模板生成网站。用户选择模板、上传图片、配置参数、实时预览，并导出固定尺寸图片。

本目录中的文档用于指导后续功能迭代，尤其是新增模板页面时保持需求清晰、实现一致、代码可维护。

## 文档地图

- [产品规格](./product-spec.md)：回答“产品最终应该长什么样”。适合在理解项目目标、页面结构、用户流程、UI 风格时阅读。
- [工程规范](./engineering-spec.md)：回答“工程上怎么实现”。适合在设计模块结构、实现预览和导出、处理资源和兼容性时阅读。
- [新增模板需求](./new-template-requirements.md)：回答“新增模板前要补齐什么信息”。适合在正式开发前整理 PRD 和验收标准。
- [开发流程](./development-workflow.md)：回答“怎么协作和推进”。适合在每次新增模板或迭代模板时作为执行 checklist。

## 新增模板时的推荐阅读顺序

1. 先用 [新增模板需求](./new-template-requirements.md) 补齐模板信息。
2. 再对照 [产品规格](./product-spec.md) 确认页面和体验是否符合项目定位。
3. 开发前阅读 [工程规范](./engineering-spec.md)，确定模块边界和预览导出方案。
4. 开发过程中按 [开发流程](./development-workflow.md) 小步推进和验证。

## prompts 目录定位

`docs/prompts/` 中的文件是历史开发 prompt 和方案草稿：

- `new-template-prompt.md`
- `preview-dom-to-canvas.md`

这些文件暂时保留，用作迁移参考。长期规范以当前目录下的正式文档为准。

当正式文档已经完整覆盖旧 prompt 内容，并且至少完成一次新模板开发验证后，可以删除 `docs/prompts/` 中的临时 prompt，避免两套规则分叉。
