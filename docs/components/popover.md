# 弹出框篇

## 设计细节
1. 触发方式。可设置通过`trigger`属性设置**点击click**或者**覆盖hover**触发弹出框。同时通过点击触发的弹出框，再次点击或者点击页面其它地方，将会关闭该弹出框，但点击弹出框区域不关闭。
2. 弹出位置。可通过`position`属性设置弹出位置，有**顶部top**、**底部bottom**、**左侧left**和**右侧right**。

## 功能细节

1. 弹出框元素层级。遇到的第一个坑，弹出框的容器是放在popover里面的，看下结构：

   ```vue
   <template>
   	<div class='yv-popover' ref="popover">
           <div class="content-wrapper">
             <slot name="content"></slot>
           </div>
           <span ref="triggerWrapper">
             <slot></slot>
           </span>
     </div>
   </template>
   ```

   如果popover的父容器设置了`overflow: hidden`的样式值，弹出框的内容就会被隐藏。解决方案就是让弹出框放在body里面而不是popover里面，这样弹出框就不会受到包裹了popover的元素的影响。

2. 弹出框的定位值。这是继第一个坑之后的坑。弹出框是设置了绝对定位，在它出现在body里面之前，它是相对于popover容器定位，出现在body里面之后，就是相对于body定位，所以坑就出现了，如果当前位置超过了当前视口的大小而出现了滚动条，弹出框出现的位置一直是相对于body的位置而不能精准出现在当前视口，看下图示：

   ![](../public/images/popover1.png)

   从图示可以看到popover弹出层出现的位置并没有在浏览器视口中，解决方案就是需要加上滚动条的高度，即`window.scrollY`，同理，左边需要加上`window.screenX`，具体的设置请看**弹出位置设置**。

3. 设置弹出框的位置。这里不管弹出位置在上下还是左右，都通过top和left来设置位置，所以写成一个对象，到时通过传入值来匹配：

   ```javascript
   let positions = {
   	top: {
           top: '',
           left: ''
       },
       bottom: {
           // ...
       },
       left: {
           // ...
       },
       right: {
           // ...
       }
   }
   ```

   顶部位置就是一开始的设置：

   ```javascript
   top: {
       top: top + window.scrollY,
       left: left + window.screenX,
   }
   ```

   底部位置：由于是出现在content底部，所以top值还需要加上content本身的高度：

   ```javascript
   bottom: {
       top: top + height + window.scrollY,
       left: left + window.screenX
   }
   ```

   左侧位置和右侧位置：一般两个元素并列居中展示会看着比较舒服，如果让弹出框和content层居中展示呢？将top值加上用两个元素之间的差值除以2的值，得到的就是弹出框的位置：
   
   ```javascript
   left: {
       top: top + window.scrollY + (height - contentHeight) / 2,
       left: left + window.screenX
   }
   ```
   
   同时由于在右侧弹出，所以右侧的left值还需加上content的宽度：
   
   ```javascript
   right: {
       top: top + window.scrollY + (height - contentHeight) / 2,
       left: left + width + window.screenX
   }
   ```
   
   上面所用到的left、width等均来自：
   
   ```javascript
   const { contentWrapper, triggerWrapper } = this.$refs
   let { width, height, left, top } = triggerWrapper.getBoundingClientRect()
   let { height: contentHeight } = contentWrapper.getBoundingClientRect()
   ```
   
   然后根据用户传进来的`position`位置属性值，给弹出框`contentWrapper`赋值：
   
   ```javascript
   contentWrapper.style.top = positions[this.position].top + 'px'
   contentWrapper.style.left = positions[this.position].left + 'px'
   ```
   
   最后还有优化的地方，即给弹出框加上一个小尾巴，这个属于CSS范畴且样式代码比较多，同样也是要分成上下左右四部分设置，看源码即可。

4. 触发方式的处理。点击方式通过给**document**添加**click**监听事件，这里有个点需要注意，如果是给**body**添加**click**监听，有可能会出现因为body**高度不够**而点击不到的问题。**hover**触发方式是通过给`popover`添加**mouseenter**和**mouseleave**监听事件。

   ```vue
   <script>
     export default {
       mounted() {
         if (this.trigger === 'click') {
         	this.$refs.popover.addEventListener('click', (e) => {
             this.showPopover(e)
           })
         } else {
             this.$refs.popover.addEventListener('mouseenter', () => {
               this.open()
             })
             this.$refs.popover.addEventListener('mouseleave', () => {
               this.close()
             })
           }
         }
     }
    </script>
   ```

   

5. 点击关闭弹出框的处理。对于点击后弹出的弹出框，需求是再次点击触发的区域或者页面其它地方，会关闭弹出框，点击弹出框自身不关闭。这个需求开发过程中也出现一些坑：第一个大坑是在第一次开启关闭弹出框之后，已经给document添加了监听事件，在第二次以及后面的点击弹出框时，由于事件冒泡机制，会依次触发：**点击popover弹出弹出框** -> **点击document关闭弹出框**，就会造成一个问题，弹出框刚弹出马上就被关闭了，看不到弹出框；第二个坑是关闭事件没有统一处理起来，每个需要关闭的地方都要写一遍，如果关闭的时候忘记对document取消监听click事件，就会导致后面弹出的弹出框关闭的时候会触发多次关闭事件。

   针对第二个问题，先将关闭事件内聚，统一写成一个方法，将弹出框关闭，并移除对click事件的监听：

   ```vue
   <script>
    export default {
      methods: {
       close() {
         this.visible = false
         document.removeEventListener('click', this.eventHandler)
       } 
     }
   }
   </script>
   ```

   针对第一个问题，本来是用`click.stop`加上修饰符`.stop`来阻止事件冒泡，这样在点击popover的时候就不会再触发document的点击事件，但是这样会导致用户在包裹了popover的元素上自定义的click事件失效，这显然是不行的。最后的解决方案就是各自管各自的，即document只管自己的，popover只管popover的，具体通过click事件中的参数`event.target`来判断：
   
   ```vue
   <script>
     export default {
       methods: {
        eventHandler(e) {
          if (this.$refs.popover && (this.$refs.popover === e.target || this.$refs.popover.contains(e.target))) {
            return
          }
          if (this.$refs.contentWrapper && (this.$refs.contentWrapper === e.target || this.$refs.contentWrapper.contains(e.target))) {
            return
          }
          this.close()
        },
       }
     }
   </script>
   ```
   
   有两个判断，如果当前存在**popover**、**contentWrapper**，并且**popover**或者**contentWrapper**等于或包含了`e.target`，则不做任何处理直接返回。若不是，则调用close事件。

## vuepress配置

在**docs/.vuepress/components**文件夹下增加`popover-demo`vue文件，内容就是我们要展示的`popover`示例，然后在**docs/components**文件夹下增加`popover`的md文件，内容就是放置整个`popover`组件说明。

具体内容请[访问这里](https://ysom.github.io/yvue-ui/components/popover.html)。
