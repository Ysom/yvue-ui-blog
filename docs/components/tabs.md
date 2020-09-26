# 标签页篇

## 设计细节
1. 结构分明。为了让结构层次更明显，在`tabs-head`里面有子组件`tabs-item`，在`tabs-body`里面有子组件`tabs-pane`，表示各自的标签与内容。

   但结构分明的同时也有些许缺陷，就是`tabs-item`和`tabs-pane`都要加上相同的`name`属性，对于喜欢“偷懒”的程序猿来说，多写一遍属性是比较麻烦的事情。
   
2. 头部支持自定义。`tabs-head`里有名为**actions**的插槽`slot`，可以添加按钮或其它自定义内容。

3. 选中tab下划线滑动。使用一个div元素作为下划线容器，通过JS设置宽度和left。

## 功能细节

1. 组件通信。因为存在**爷tabs** -> **父head、body** -> **孙item、pane**多层组件的通信以及兄弟组件的通信；为了让通信更方便，使用`provide`和`inject`注入属性。

2. 事件通信。还是上面的原因，为了让多层组件的通信更简单，这里使用了**事件总线eventBus**，在tabs组件通过new一个vue实例，将这个实例通过`provide`传递，在各组件通过`inject`注入，来实现组件之间的事件通信：

```vue
<script>
  // tabs.vue
  import Vue from 'vue'
  export default {
    name: "YvTabs",
    provide() {
      return {
        eventBus: this.eventBus
      }
    },
    data() {
      return {
        eventBus: new Vue()
      }
    },
    // ...
  }
</script>
```

3. tab切换以及选中tab下划线滑动。使用一个div元素作为下划线容器，通过JS设置宽度和left。先看下下划线line在模板中的位置以及初始样式：

```vue
<!-- TabsHead.vue -->
<template>
  <div class="yv-tabs-head">
    <div class="title-wrapper" ref="titleWrapper">
      <slot></slot>
      <div class="line" ref='line'></div>
    </div>
    <div class="actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
$tab-item-current-color: #296aef;
.yv-tabs-head{
  // ...
  >.title-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    >.line {
      position: absolute;
      bottom: 0;
      border-bottom: 3px solid $tab-item-current-color;
      transition: all 0.3s linear;
    }
  }
}
</style>
```

**然后分三步走**：

**tabs组件**：在tabs组件中，通过遍历找出当前所选tab，通过eventBus传递出去：

```vue
<script>
  export default {
    // ...
    mounted() {
      // ...
      this.$children.forEach(child => {
        if (child.$options.name === 'YvTabsHead') {
          child.$children.forEach(vm => {
            if (vm.$options.name === 'YvTabsItem' && vm.name === this.selected) {
              this.eventBus.$emit('update:selected', this.selected, vm)
            }
          })
        }
      })
    }
  }
</script>
```

**tabs-item组件**：tabs-item通过eventBus监听事件接收参数，设置自身样式；点击切换时通过eventBus把name属性以及自身实例当成参数传递出去：

```vue
<script>
  export default {
    // ...
    created(){
      if (this.eventBus) {
        this.eventBus.$on('update:selected',(name,vm) => {
          this.active = name === this.name
        })
      }
    },
    methods:{
      selectTab() {
        if (this.disabled) return
        this.eventBus && this.eventBus.$emit('update:selected', this.name, this)
      }
    }
  }
</script>
```

**tabs-head组件**：通过监听**eventBus**，得到当前选中的tab实例，计算出当前tab元素的尺寸和位置，通过JS**动态设置**下划线：

```vue
<script>
  export default {
    // ...
    mounted() {
      this.eventBus.$on('update:selected',(name, vm) => {
        let line = this.$refs.line
        let { left, right, top, height } = vm.$el.getBoundingClientRect()
        let { left: wrapperLeft, top: wrapperTop, height: wrapperHeight } = this.$refs.titleWrapper.getBoundingClientRect()
        line.style.width = right - left + 'px'
        line.style.bottom = -4 +'px'
        line.style.left = left - wrapperLeft + 'px'
      })
    } 
  }
</script>
```

## 人工测试
手动测试。。。已完成。

## 自动化测试
在**test**文件夹下增加`tabs.test.js`和`tabs-item.test.js`文件。

因为`tabs-pane`和`tabs-item`基本一致，这里就不再做自动化测试了。

`tabs.test.js`文件有2个测试用例：**测试tabs是否存在**、**接收selected**；

`tabs-item.test.js`文件有4个测试用例：**测试tabs-item是否存在**、**接收name**、**接收disabled**、**点击事件**。  

运行命令`parcel watch test/* --no-cache`和`karma start`查看测试结果：



![tabs测试结果](../public/images/tabs-test.png)

## vuepress

在**docs/.vuepress/components**文件夹下增加多个`tabs-demo`的vue文件，内容就是我们要展示的`tabs`示例，然后在**docs/components**文件夹下增加`tabs`的md文件，内容就是放置整个`tabs`组件说明。

具体内容请[访问这里](https://ysom.github.io/yvue-ui/components/tabs.html)。
