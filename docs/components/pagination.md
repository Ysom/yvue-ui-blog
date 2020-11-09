# 分页器篇

## 设计细节
1. 页码样式。页码不采用圆圈显示：当页码数值比较大时，有可能溢出圆圈，样式也并不好看。

2. 页码显示。存在多于一页的情况时，页码显示第一页、当前页-2，-1、当前页、当前页+1，+2、最后一页，重复则去重，中间未显示的页码用“...”代替。

## 功能细节
1. 页码去重。组件需要通过传入当前页码和总页码来计算出需要显示的页码，默认只展示第一页、当前页-2，-1、当前页、当前页+1，+2、最后一页。计算页码的过程需要去重，一开始是想使用ES6中的Set来去重，但为了兼顾到兼容性问题，因此使用将页码作为对象的键，最后遍历对象键的方式来去重：

   ```js
   function unique (array) {
     // ES6
     // return [...new Set(array)]
   
     const object = {}
     array.map((number) => {
       object[number] = true
     })
     return Object.keys(object).map((s) => parseInt(s, 10))
   }
   ```

   因为对象的键都为字符串，所以还需要最后转为数值的一步。

2. 页码显示。在对页码去重后，还需筛选出范围在**1~totalPage**的页码并排序，这时再遍历这个有序的页码数组，如果前后两个值不连续，说明页码是不连续的，再在中间加上“**...**”：

   ```vue
   <script>
   export default {
   	computed: {
   		pages() {
             return unique([1, this.totalPage,
               this.currentPage,
               this.currentPage - 1, this.currentPage - 2,
               this.currentPage + 1, this.currentPage + 2]
               .filter((n) => n >= 1 && n <= this.totalPage)
               .sort((a, b) => a - b))
               .reduce((prev, current, index, array) => {
                 prev.push(current)
                 array[index + 1] !== undefined && array[index + 1] - array[index] > 1 && prev.push('...')
                 return prev
               }, [])
           }
   	}
   }
   </script>
   ```
   
3. 页码切换。页码切换处理起来很简单，给页码和前进后退按钮绑定点击事件，传入点击的页码或-1、+1，通过`$emit`提交更新的值和`change`事件，父组件可通过`.sync`或者监听`change`事件来处理更新：

   ```vue
   <script>
   export default {
       methods: {
           onClickPage (n) {
             if (n >= 1 && n <= this.totalPage) {
               this.$emit('update:currentPage', n)
               this.$emit('change', n)
             }
           }
       }
   }
   </script>
   ```

   

## 人工测试
已完成。

## vuepress设置

在**docs/.vuepress/components**文件夹下增加`pagination-demo`vue文件，内容就是我们要展示的`pagination`示例，然后在**docs/components**文件夹下增加`pagination`的md文件，内容就是放置整个`pagination`组件说明。

具体内容请[访问这里](https://ysom.github.io/yvue-ui/components/pagination.html)。


