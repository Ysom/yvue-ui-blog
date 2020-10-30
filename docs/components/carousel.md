# 轮播篇

## 设计细节

1. 轮播分为有缝轮播和无缝轮播，这里采用的是无缝轮播。
2. 轮播功能主要基于[vue过渡&动画](https://cn.vuejs.org/v2/guide/transitions.html)实现。
3. 加上`touchStart`和`touchEnd`事件处理，增加对移动端的支持。
4. 本次父子组件通信使用`$parent`和`$children`。
5. 使用到了`updated`生命周期来处理轮播的选中更新等操作。

## 功能细节

未完成更新，待补充。

## vuepress配置

在**docs/.vuepress/components**文件夹下增加`carousel-demo`vue文件，内容就是我们要展示的`carousel`示例，然后在**docs/components**文件夹下增加`carousel`的md文件，内容就是放置整个`carousel`组件说明。

具体内容请[访问这里](https://ysom.github.io/yvue-ui/components/carousel.html)。
