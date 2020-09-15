# 容器篇

## 设计细节

容器的功能比较简单，主要将页面切分成`头部header`、`侧边栏aside`、`主要区域main`、`底部footer`，这几个部分都放在`容器container`里。

在没有侧边栏的时候，container里的排列方向是`column`，当有侧边栏时，container里的排列方向就切换成`row`：

```vue
<script>
export default {
  name: "YvContainer",
  data() {
    return {
      containerClass: {
        hasAside: false
      }
    }
  },
  mounted() {
    this.$children.some(child => {
      if (child.$options.name === 'YvAside') {
        this.containerClass.hasAside = true
        return true
      }
    })
  }
}
</script>
```

通过遍历判断是否存在`aside`组件，存在`aside`的时候将`hasAside`设置为`true`，同时给`container`加上了`hasAside`的类，样式为`flex-direction: row`

## vuepress配置

在**docs/.vuepress/components**文件夹下增加`container-demo`的vue文件，内容就是我们要展示的`container`示例，然后在**docs/components**文件夹下增加`container`的md文件，内容就是放置整个`container`组件说明。