# learn-formily
formily基础使用
formily进阶使用和表单设计器
手写实现原理:
@formily/reactive、
@formily/core、
@formily/react、
@formily/antd
## 核心优势
高性能 字段数据极多的情况下保持快速响应，可以实现高效联动逻辑
跨端能力 与框架无关，可以兼容react和vue等框架
生态完备 支持了业界主流的antd和element等组件库
协议驱动 可以通过JSON驱动表单渲染，可以成为领域视图模型驱动的低代码渲染引擎

## 分层架构
@formily/core负责管理表单的状态、校验和联动等
@formily/react是UI桥接库，用来接入内核数据实现最终的表单交互效果，不同框架有不同的桥接库
@formily/antd封装了场景化的组件