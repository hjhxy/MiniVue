#### vue核心

模版编译，虚拟dom，响应式。

生命周期的原理是什么？

其它的一些补丁方法。

#### 7/30号
√ 1. 使用webpack搭建开发环境。
√ 2. 完成了基本的独享数据响应式，对象属性劫持，深度劫持。
√ 3. 对数组实现数据劫持。
√ 4. 模板编译原理，生成AST树。
√ 5. 代码生成，实现虚拟dom。
√ 6. 虚拟dom转为真实dom。
  7. diff算法
  8. watch，computed
  9. 完整的响应式（watcher，dep，observe）(依赖收集、异步更新)

#### 7月31号

1. nextTick方法
2. $set,$delete方法
3. keep-alive


#### 封装的过程中碰到的一些小问题
1. replaceAll虽然可以替换所有的情况，不能使用正则作为参数。如果想要实现全局正则替换，有两种方法，第一种是边替换边删除，第二种是直接加 /g
   1. replace(/\d/g,1) // 全局替换


#### 数据变化如何驱动视图
watcher：
视图也是一种watch，不过和watch、computed不同的地方在于，视图的更新是通过_update()方法达到更新的效果。
dep：

observe：

#### vuex


#### vue-router

