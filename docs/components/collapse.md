# 折叠面板篇

## 设计细节

1. 展示模式。默认可以同时展示多个折叠面板，也可以通过设置`single`属性来开启手风琴模式，即每次只能展示一个折叠面板。
2. 控制打开与关闭采用单向数据流。关于折叠面板的开关控制方式，在多次试错后，决定采用单向数据流的方式：新建一个**事件总线eventBus**，点击折叠面板后，该子组件不直接操控自身的开启或关闭，而是通过**eventBus**去通知父组件，然后由父组件进行某些逻辑处理后，再通过**eventBus**向子组件传递事件，子组件收到事件后，再判断是开启还是关闭。

## 功能细节

1. 绑定值的使用。这里的绑定值会加上`.sync`修饰符，然后在`collapse`组件里通过提交`update:selected`事件来更新绑定值：

   ```vue
   <script>
   	export default {
           mounted() {
               // 处理值的逻辑
               // ...
               this.$emit('update:selected', this.selectedArray)
           }
       }
   </script>
   ```

2. 处理选中值。区分**手风琴**和**多面板展示**两种模式：

   ```vue
   <script>
   	export default {
           mounted() {
               // 一开始就广播事件
               this.eventBus.$emit('update:selected', this.selected)
               // 监听添加选中事件
               this.eventBus.$on('update:addSelected', (name) => {
                   // 对selected做深拷贝处理
                   this.selectedArray = JSON.parse(JSON.stringify(this.selected))
                   if (this.single) {
                       this.selectedArray = [name]
                   } else {
                       this.selectedArray.push(name)
                   }
                   // 通过eventBus广播事件，子组件监听该事件
                   this.eventBus.$emit('update:selected', this.selectedArray)
                   // 上面第1点讲到的，更新selected值
                   this.$emit('update:selected', this.selectedArray)
               })
           }
       }
   </script>
   ```

   判断`single`值是否为真，为真则将name值设置为数组的唯一值，否则将name值push进数组。

3. 移除非选中值。无需区分模式：

   ```vue
   <script>
   	export default {
           mounted() {
               // 一开始就广播事件
               this.eventBus.$emit('update:selected', this.selected)
               // 监听添加选中事件
               // ...
               
               // 监听选中移除事件
               this.eventBus.$on('update:removeSelected', (name) => {
                   this.selectedArray = JSON.parse(JSON.stringify(this.selected))
                   // 找到当前移除值的索引值
                   let index = this.selectedArray.indexOf(name)
                   // 移除
                   this.selectedArray.splice(index, 1)
                   // 通过eventBus广播事件，子组件监听该事件
                   this.eventBus.$emit('update:selected', this.selectedArray)
                   // 上面第1点讲到的，更新selected值
                   this.$emit('update:selected', this.selectedArray)
               })
           }
       }
   </script>
   ```

4. 处理子组件点击事件。设计细节里面有说到，子组件点击时，不直接处理自身的开启/关闭事件，而是通过**eventBus**广播`addSelected`或`removeSelected`事件，而父组件监听事件并做逻辑处理（第2、3点）后再广播`update:selected`事件，子组件监听事件拿到选中的值后判断是否有自己，有则打开。这样就完成了一个单向数据流。

   ```vue
   <script>
   	export default {
           mounted() {
               // 监听事件 看选中的值中是否有自己 有则打开
               this.eventBus && this.eventBus.$on('update:selected', (names) => {
                   this.open = names.indexOf(this.name) >= 0
               })
           },
           methods: {
               toggle() {
                   if (this.open) {
                       this.eventBus && this.eventBus.$emit('update:removeSelected', this.name)
                   } else {
                       this.eventBus && this.eventBus.$emit('update:addSelected', this.name)
                   }
               }
           }
       }
   </script>
   ```

## vuepress配置

在**docs/.vuepress/components**文件夹下增加`collapse-basic`和`collapse-single`vue文件，内容就是我们要展示的`collapse`示例，然后在**docs/components**文件夹下增加`collapse`的md文件，内容就是放置整个`collapse`组件说明。

具体内容请[访问这里](https://ysom.github.io/yvue-ui/components/collapse.html)。

