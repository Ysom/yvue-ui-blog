---
title: 前置工作
sidebarDepth: 1
---

## 准备工作
### 账号
1. github
2. gitee
### 包管理器（二选一）
1. npm
2. yarn
### 打包工具
1. parcel（无需配置，可快速预览）
2. webpack（项目后续复杂的时候切换到webpack）
### 业界成熟方案
1. ant-design
2. element-ui
3. ant-design-vue
### 原型设计工具
1. Balsamiq
### 交互设计工具
1. 墨刀
2. Sketch(mac)
### 文章系统
1. vuepress
2. github pages
### 持续部署工具
1. Travis CI

## 开始工作
### 初始化项目
1. `npm init`
2. 完成项目初始化
### 添加需要的插件
```
npm i vue
npm i parcel-bundler vuepress -D
```
### 创建文件
1. index.html
2. app.js
3. 在index.html文件引入app.js
4. 使用npx parcel index.html即可根据提示观察打包后结果
5. 开发各个组件

## 坑点总结
1. 使用parcel打包成功后，打开`localhost:1234`会报这样一个错误：
```
You are using the runtime-only build of Vue where the template compiler is not available.
Either pre-compile the templates into render functions,
or use the compiler-included build.
```
这个错误是因为vue有两种模式的代码，`compiler`和`runtime`，vue默认指向的是`runtime`模式，即`dist/vue.runtime.common.js`，
如果是使用webpack的话，可以在webpack.config.js文件添加以下配置：
```js
configureWebpack: {
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
}
```
因为我使用的是parcel，没有配置文件，所以直接在package.json里面添加这一句即可：
```json
"alias": {
  "vue": "./node_modules/vue/dist/vue.esm.js"
}
```

2.如果使用parcel打包后打开页面发现报错了，但是你能确定代码没错的时候，那错误的原因大概就是因为parcel使用了缓存没有重新构建，使用以下命令解决：
```js
npx parcel --no-cache
```
或者删除`.cache`文件夹。因为parcel是默认启用缓存的。

## 闲话
1. 为啥使用parcel？

首先parcel使用起来非常方便，无需配置，只需一个命令，就能自动找到文件所依赖的文件，包括文件需要什么样的依赖包，它都会自动安装；

其次parcel 内置了一个当你改变文件时能够自动重新构建应用的开发服务器，而且为了实现快速开发，该开发服务器支持热模块替换，让我们改动起来十分方便；

最后也是最重要的一个原因，对于我来说，这是一个全新的挑战，刚开始肯定会是在不断试错，如何花最少的成本在短时间得到我想要的效果，parcel会比webpack更适合做这件事情，
等到我对所有流程都比较熟悉、项目开始复杂起来的时候，再切换成webpack也不迟。

2. 只会实现大致功能，不会像成熟的UI框架那么丰富

自己周末仔细地算了一下，每个组件从**功能需求分析-可行性分析-原型设计-交互设计-功能开发-测试-发布**这样的流程会耗费非常多的时间，
而我的主要目的是在于提升技术的深度，所以每个组件应该是尽量只实现核心的功能，
不会囊括常见的所有功能（除非刚好有业务需求）。所以这个项目最后的样子应该是：一个简洁、清爽的UI轮子（不敢说是UI框架了，哈哈哈）。
