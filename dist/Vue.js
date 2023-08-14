/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/compiler/index.js":
/*!*******************************!*\
  !*** ./src/compiler/index.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   compileToFunction: () => (/* binding */ compileToFunction)\n/* harmony export */ });\n/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parse */ \"./src/compiler/parse.js\");\n\nfunction generatorProps(attrs = []) {\n  if (attrs.length == 0) {\n    return 'null';\n  }\n  let str = \"\";\n  for (let i = 0; i < attrs.length; i++) {\n    let attr = attrs[i];\n    if (attr.name == 'style') {\n      let obj = {};\n      attr.value.split(';').forEach(item => {\n        let [key, value] = item.split(':');\n        obj[key] = value;\n      });\n      attr.value = obj;\n    }\n    str += `${attr.name}:${JSON.stringify(attr.value)},`;\n  }\n  return `{${str.slice(0, -1)}}`;\n}\nfunction generatorChild(children) {\n  // 如果是元素节点\n  if (!children || children.length == 0) {\n    return \"\";\n  }\n  let childrenCodes = [];\n  for (let i = 0; i < children.length; i++) {\n    // 如果是文本调用_s\n    if (children[i].type == 'TEXT_TYPE') {\n      let text = children[i].text.trim();\n      const defaultTagRE = /\\{\\{((?:.|\\r?\\n)+?)\\}\\}/g;\n      if (!defaultTagRE.test(text)) {\n        // 普通文本\n        return `_v(\"${text}\")`;\n      } else {\n        let tokens = [];\n        let match;\n        defaultTagRE.lastIndex = 0;\n        let lastIndex = 0;\n        while (match = defaultTagRE.exec(text)) {\n          let index = match.index;\n          if (index > lastIndex) {\n            tokens.push(JSON.stringify(text.slice(lastIndex, index)));\n          }\n          tokens.push(`_s(${match[1].trim()})`);\n          lastIndex = index + match[0].length;\n        }\n        if (lastIndex < text.length) {\n          tokens.push(JSON.stringify(text.slice(lastIndex)));\n        }\n        return `_v(${tokens.join('+')})`;\n      }\n    } else {\n      // 否则继续递归\n      childrenCodes.push(generator(children[i]));\n    }\n  }\n  return childrenCodes.join(',');\n}\n\n// 根据ast树构造为render函数的语法。\nfunction generator(ast) {\n  //_c，_v，_s：分别用来创建节点/创建文本/替换变量\n  let code = `_c(\"${ast.tag}\",${generatorProps(ast.attrs)},${generatorChild(ast.children)})`;\n  return code;\n}\n\n// 生成render函数\nfunction compileToFunction(template = \"\") {\n  let ast = (0,_parse__WEBPACK_IMPORTED_MODULE_0__.parse)(template);\n  let code = generator(ast);\n  console.log(code);\n  const renderFn = new Function(`with(this){console.log(\"this\",this);return ${code}}`);\n  return renderFn;\n}\n\n//# sourceURL=webpack://minivue/./src/compiler/index.js?");

/***/ }),

/***/ "./src/compiler/parse.js":
/*!*******************************!*\
  !*** ./src/compiler/parse.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   parse: () => (/* binding */ parse)\n/* harmony export */ });\nconst ncname = `[a-zA-Z_][\\\\-\\\\.0-9_a-zA-Z]*`; //匹配标签名 形如 abc-123\nconst qnameCapture = `((?:${ncname}\\\\:)?${ncname})`; //匹配特殊标签 形如 abc:234 前面的abc:可有可无\nconst startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配标签开始 形如 <abc-123 捕获里面的标签名\nconst startTagClose = /^\\s*(\\/?)>/; // 匹配标签结束  >\nconst endTag = new RegExp(`^<\\\\/${qnameCapture}[^>]*>`); // 匹配标签结尾 如 </abc-123> 捕获里面的标签名\nconst attribute = /^\\s*([^\\s\"'<>\\/=]+)(?:\\s*(=)\\s*(?:\"([^\"]*)\"+|'([^']*)'+|([^\\s\"'=<>`]+)))?/; // 匹配属性  形如 id=\"app\"\n\n// 将模板编译为ast（抽象语法树）\nfunction parse(template = \"\") {\n  let stack = []; //通过栈来构造树结构\n  let rootnode = null;\n  while (template) {\n    // 开始标签 或结束标签\n    let index = template.indexOf('<');\n    if (index == 0) {\n      const startTagMatch = parseStartTag();\n      template = template.trim();\n      if (startTagMatch) {\n        start(startTagMatch);\n        continue;\n      }\n      let endTagMatch;\n      if (endTagMatch = template.match(endTag)) {\n        end();\n        advance(endTagMatch[0].length);\n      }\n    }\n    if (index > 0) {\n      // 处理文本\n      const text = template.slice(0, index);\n      chars(text);\n      advance(index);\n    }\n  }\n  function advance(len) {\n    template = template.slice(len);\n  }\n\n  /* 解析开始标签及其属性 */\n  function parseStartTag() {\n    let res;\n    // 解析到开始标签\n    if (res = template.match(startTagOpen)) {\n      let node = {\n        tag: res[1],\n        attrs: [],\n        children: null\n      };\n      advance(res[0].length);\n      // 解析当前标签的所有属性，结束标签的匹配在前，防止逻辑短路取不到结束标签\n      let attr;\n      let endTag;\n      while (!(endTag = template.match(startTagClose)) && (attr = template.match(attribute))) {\n        node.attrs.push({\n          name: attr[1],\n          value: attr[3]\n        });\n        advance(attr[0].length);\n      }\n      advance(endTag[0].length);\n      return node;\n    }\n    return null;\n  }\n  function createASTElement(tag, attrs) {\n    return {\n      tag,\n      type: \"ELEMENT_TYPE\",\n      children: [],\n      attrs,\n      parent: null\n    };\n  }\n  function start({\n    tag,\n    attrs\n  }) {\n    const node = createASTElement(tag, attrs);\n    if (!rootnode) {\n      rootnode = node;\n    } else {\n      //非根元素，确立父子关系\n      let parentNode = stack[stack.length - 1];\n      if (!parentNode.children) {\n        parentNode.children = [];\n      }\n      parentNode.children.push(node);\n      node.parent = parentNode;\n    }\n    stack.push(node);\n  }\n  function chars(text) {\n    if (text.trim().length != 0) {\n      // 非空文本添加\n      stack[stack.length - 1].children.push({\n        type: \"TEXT_TYPE\",\n        text,\n        parent: stack[stack.length - 1]\n      });\n    }\n  }\n  function end() {\n    stack.pop();\n  }\n  return rootnode;\n}\n\n//# sourceURL=webpack://minivue/./src/compiler/parse.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _init__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./init */ \"./src/init.js\");\n/* harmony import */ var _lifecycle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lifecycle */ \"./src/lifecycle.js\");\n\n\nfunction Vue(options) {\n  if (!this instanceof Vue) {\n    throw new Error(\"Vue只能作为构造函数调用\");\n  }\n  this._init(options);\n}\n(0,_init__WEBPACK_IMPORTED_MODULE_0__.initMixin)(Vue);\n(0,_lifecycle__WEBPACK_IMPORTED_MODULE_1__.initLifecycle)(Vue);\nwindow.Vue = Vue;\n\n//# sourceURL=webpack://minivue/./src/index.js?");

/***/ }),

/***/ "./src/init.js":
/*!*********************!*\
  !*** ./src/init.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initMixin: () => (/* binding */ initMixin)\n/* harmony export */ });\n/* harmony import */ var _compiler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./compiler */ \"./src/compiler/index.js\");\n/* harmony import */ var _lifecycle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lifecycle */ \"./src/lifecycle.js\");\n/* harmony import */ var _observe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./observe */ \"./src/observe/index.js\");\n\n\n\nfunction initMixin(Vue) {\n  Vue.prototype._init = function (options) {\n    this.$options = options;\n\n    // 初始化状态\n    initState(this);\n\n    // 模版编译\n    this.$mount(this.$options.el);\n  };\n\n  // 模版编译的最终目的是为了拿到render函数，render==>虚拟dom，虚拟dom==>patch得到真实dom\n  Vue.prototype.$mount = function (el) {\n    if (!el) return;\n    const app = document.querySelector(el);\n    // 如果有render函数就以render函数为准，否则检查template，最后检查模版\n    const ops = this.$options;\n    let template = null;\n    if (!ops.render) {\n      if (!ops.template) {\n        template = app.outerHTML;\n      } else {\n        template = ops.template;\n      }\n      ops.render = (0,_compiler__WEBPACK_IMPORTED_MODULE_0__.compileToFunction)(template);\n    }\n\n    // 调用render函数实现挂载\n    (0,_lifecycle__WEBPACK_IMPORTED_MODULE_1__.mountComponent)(this, app);\n  };\n}\n\n// 初始化options\nfunction initState(vm) {\n  const options = vm.$options;\n  if (options.data) {\n    initData(vm);\n  }\n}\n\n// 初始化data，加工\nfunction initData(vm) {\n  let data = vm.$options.data;\n  data = typeof data == 'function' ? data.call(vm) : data;\n\n  // observe 数据劫持\n  (0,_observe__WEBPACK_IMPORTED_MODULE_2__.observe)(data);\n  // 此时得到的data就是实现了响应式的data，挂载到this身上方便访问。\n  vm._data = data;\n  // 二次代理，方便访问直接通过this访问\n  proxy(vm, data);\n}\n\n// 把响应式的属性代理到data身上\nfunction proxy(vm, data) {\n  for (const key in data) {\n    Object.defineProperty(vm, key, {\n      get() {\n        return data[key];\n      },\n      set(newval) {\n        data[key] = newval;\n      }\n    });\n  }\n}\n\n//# sourceURL=webpack://minivue/./src/init.js?");

/***/ }),

/***/ "./src/lifecycle.js":
/*!**************************!*\
  !*** ./src/lifecycle.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initLifecycle: () => (/* binding */ initLifecycle),\n/* harmony export */   mountComponent: () => (/* binding */ mountComponent)\n/* harmony export */ });\n/* harmony import */ var _observe_watcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./observe/watcher */ \"./src/observe/watcher.js\");\n/* harmony import */ var _vdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vdom */ \"./src/vdom/index.js\");\n\n\n\n/* 调用js原生方法创建dom，并往虚拟节点vnode上存储一份 */\nfunction createEle(vnode) {\n  const {\n    vm,\n    tag,\n    key,\n    data,\n    children,\n    text\n  } = vnode;\n  if (typeof tag == 'string') {\n    // 非文本节点\n    vnode.el = document.createElement(tag); // 将真实元素挂载到身上，方便更新\n    patchProps(vnode.el, data);\n    children.forEach(child => {\n      vnode.el.appendChild(createEle(child));\n    });\n  } else {\n    vnode.el = document.createTextNode(text);\n  }\n  return vnode.el;\n}\n\n/* 生产props */\nfunction patchProps(el, props) {\n  for (const key in props) {\n    if (key == 'style') {\n      for (let styleName in props[key]) {\n        el.style[styleName] = props[key][styleName];\n      }\n      continue;\n    }\n    el.setAttribute(key, props[key]);\n  }\n}\n\n/* 第一次就直接初始化渲染，后续进行虚拟dom对比更新 */\n/* 对于patch方法来说对比和更新都是使用的一个patch方法,，因此要区分第一个参数 */\nfunction patch(elOrvnode, vnode, firstMount) {\n  // if(firstMount){ // 如果说是第一次挂载的话\n  const parentNode = elOrvnode.parentNode;\n  const el = createEle(vnode);\n  parentNode.innerHTML = \"\";\n  parentNode.appendChild(el);\n  return el;\n  // }\n}\n\n/* 扩展_update和_render方法 */\nfunction initLifecycle(Vue) {\n  /* 渲染为真实dom */\n  Vue.prototype._update = function (vnode) {\n    console.log(\"vnode\", vnode);\n    const vm = this;\n    const el = this.$el;\n    // 虚拟dom对比更新\n    // 初次挂载\n    if (!vm._vnode) {\n      console.log(\"第一次挂载patch\");\n      // this.$el = patch(el, vnode, true);\n    } else {\n      console.log(\"节点更新的patch\");\n    }\n    this.$el = patch(this.$el, vnode);\n    this._vnode = vnode;\n  };\n\n  /* 生成虚拟dom，只有第一次通过模版生成render方法，后续的模版更新都是通过修改虚拟dom，重新执行render方法*/\n  Vue.prototype._render = function () {\n    const ops = this.$options;\n    return ops.render.call(this);\n  };\n\n  // 解析节点\n  Vue.prototype._c = function (...args) {\n    return (0,_vdom__WEBPACK_IMPORTED_MODULE_1__.createElementVNode)(this, ...args);\n  };\n\n  // 解析文本\n  Vue.prototype._v = function (...args) {\n    return (0,_vdom__WEBPACK_IMPORTED_MODULE_1__.createTextVNode)(this, ...args);\n  };\n\n  /* 解析变量，碰到变量的时候去this上取(放到_v做了)，碰到对象JSON.stringfy */\n  // 传递过来value是直接到vue实例上去取值\n  // 因此就可以在这里取值的时候配合响应式的操作\n  Vue.prototype._s = function (value) {\n    if (typeof value == 'object') return JSON.stringify(value);\n    return value;\n  };\n\n  // 批量收集，异步执行\n  Vue.prototype.$nextTick = function (cb) {\n    (0,_observe_watcher__WEBPACK_IMPORTED_MODULE_0__.nextTick)(cb);\n  };\n}\nfunction mountComponent(vm, el) {\n  /* 组件开始挂载  */\n  // 1. 调用render函数生成虚拟dom。\n  // 2. 根据虚拟dom产生真实dom。\n  // 3. 插入到el元素中。\n  vm.$el = el;\n  new _observe_watcher__WEBPACK_IMPORTED_MODULE_0__[\"default\"](vm, () => {\n    vm._update(vm._render());\n  });\n}\n\n//# sourceURL=webpack://minivue/./src/lifecycle.js?");

/***/ }),

/***/ "./src/observe/array.js":
/*!******************************!*\
  !*** ./src/observe/array.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   test: () => (/* binding */ test)\n/* harmony export */ });\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ \"./src/observe/index.js\");\n/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dep */ \"./src/observe/dep.js\");\n// 重写数组中的部分方法(数组与原型中间插入一个原型对象)\n// 创建一个新的原型继承至数组的原型\n\n\n\nlet newproto = Object.create(Array.prototype);\nlet methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];\nmethods.forEach(method => {\n  // 重写的同时监听数组的变化，并调用原方法。\n  newproto[method] = function (...args) {\n    console.log(this, \"数组调用了\" + method);\n    this._dep.notify();\n    const proto = newproto.__proto__;\n    proto[method]?.call(this, ...args);\n    let observeData = [];\n    switch (method) {\n      case 'push':\n      case 'unshift':\n        // 对于新增项\n        observeData = args;\n        break;\n      case 'splice':\n        observeData = args.slice(2);\n        break;\n      default:\n        break;\n    }\n    for (const data of observeData) {\n      (0,___WEBPACK_IMPORTED_MODULE_0__.observe)(data);\n    }\n  };\n});\nfunction test(data) {\n  Object.setPrototypeOf(data, newproto);\n}\n\n//# sourceURL=webpack://minivue/./src/observe/array.js?");

/***/ }),

/***/ "./src/observe/dep.js":
/*!****************************!*\
  !*** ./src/observe/dep.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst {\n  nanoid\n} = __webpack_require__(/*! nanoid */ \"./node_modules/nanoid/index.browser.js\");\nclass Dep {\n  constructor(vm) {\n    this.id = nanoid();\n    this.watchers = new Set();\n  }\n  append() {\n    if (Dep.target) {\n      this.watchers.add(Dep.target); // dep添加watcher\n      Dep.target.addDep = this; // watcher添加dep\n    }\n  }\n\n  depend(watcher) {\n    this.watchers.delete(watcher);\n  }\n  notify() {\n    // 通知watcher更新\n    this.watchers.forEach(watcher => {\n      watcher.ququeUpdate();\n      // watcher.update();\n    });\n  }\n}\n\nDep.target = null;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Dep);\n\n//# sourceURL=webpack://minivue/./src/observe/dep.js?");

/***/ }),

/***/ "./src/observe/index.js":
/*!******************************!*\
  !*** ./src/observe/index.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   observe: () => (/* binding */ observe)\n/* harmony export */ });\n/* harmony import */ var _array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./array */ \"./src/observe/array.js\");\n/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dep */ \"./src/observe/dep.js\");\n\n\nclass Observe {\n  constructor(data) {\n    // 标识是否已经做过响应式，同时响应式数据还可以通过_vm拿到组件实例。\n    Object.defineProperty(data, '_vm', {\n      enumerable: false,\n      value: true\n    });\n    /* 监听数组的七个方法。对于数组并没有对每一个索引项做监听 */\n    if (Array.isArray(data)) {\n      this.observeArray(data);\n    } else {\n      this.walk(data);\n    }\n  }\n  walk(data) {\n    Object.keys(data).forEach(key => {\n      defineReactive(data, key, data[key]);\n    });\n  }\n  // 监听数组中的元素\n  observeArray(data) {\n    //1. 修改原型，监听数组自身\n    (0,_array__WEBPACK_IMPORTED_MODULE_0__.test)(data);\n    //2. 递归监听子元素。\n    data.forEach(el => observe(el));\n  }\n}\nfunction defineReactive(target, key, value) {\n  observe(target[key]);\n  const dep = new _dep__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\n  if (Array.isArray(target[key])) {\n    // 如果是数组的话就往数组身上存一份，因为数组不存在闭包\n    Object.defineProperty(target[key], '_dep', {\n      // 整个数组对应一个dep\n      enumerable: false,\n      //不可枚举(遍历)\n      value: dep\n    });\n    dep.append();\n  }\n  Object.defineProperty(target, key, {\n    // 收集watcher到本属性的dep身上\n    get() {\n      dep.append(); //将全局变量中存储的watcher添加到当前\n      console.log(\"get数据：\" + key);\n      return value;\n    },\n    // 更新dep内存储的所有watcher\n    set(newval) {\n      console.log(\"set数据：\" + key);\n      value = newval;\n      dep.notify();\n    }\n  });\n}\n\n// 对数据做劫持。\nfunction observe(data) {\n  if (typeof data !== 'object' || data == null || data._vm) return;\n  return new Observe(data);\n}\n\n//# sourceURL=webpack://minivue/./src/observe/index.js?");

/***/ }),

/***/ "./src/observe/watcher.js":
/*!********************************!*\
  !*** ./src/observe/watcher.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   nextTick: () => (/* binding */ nextTick)\n/* harmony export */ });\n/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dep */ \"./src/observe/dep.js\");\n\nconst {\n  nanoid\n} = __webpack_require__(/*! nanoid */ \"./node_modules/nanoid/index.browser.js\");\n\n/* ，每一种watch驱动的时候其实都对应了一种回调函数 */\nclass Watcher {\n  constructor(vm, callback, isrenderWatcher) {\n    this.id = nanoid(); // watch的唯一id\n    this.callback = callback; // 触发watchder的回调函数\n    this.renderWatcher = isrenderWatcher; // 表示是否为渲染watcher\n    this.deps = new Set(); //组件卸载的时候拿到watcher当前的deps，方便清除watcher，避免更新\n    this.update();\n    vm._watcher = this;\n  }\n  update() {\n    // 解析当前组件的时候就将全局变量的值置为vm。这样就可以把watcher和dep建立关联\n    _dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"].target = this;\n    console.log(\"视图更新\");\n    this.callback();\n    _dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"].target = null;\n  }\n  ququeUpdate() {\n    queueWatcher(this);\n  }\n  addDep(dep) {\n    this.deps.add(dep);\n  }\n}\n\n/* vue源码的思路是每次添加都只记录但是不放入事件队列(通过节流实现，这样可以控制最后一次执行)， \n    而我的思路是每次只要不存在就放入时间队列，执行的是每个watcher的第一次。\n*/\nlet queue = new Set();\nfunction queueWatcher(watcher) {\n  if (!queue.has(watcher)) {\n    // queue.add(watcher);\n    // 放入事件队列中循环执行，而且尽可能早的执行\n    nextTick(() => {\n      watcher.update();\n      // 刷完一次后要做清除工作，否则下次更新无效\n      queue.clear();\n    });\n    queue.add(watcher);\n  }\n}\nfunction nextTick(callback) {\n  if (Promise) {\n    Promise.resolve().then(callback, 0);\n  } else {\n    setTimeout(() => {\n      callback();\n    }, 0);\n  }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Watcher);\n\n//# sourceURL=webpack://minivue/./src/observe/watcher.js?");

/***/ }),

/***/ "./src/vdom/index.js":
/*!***************************!*\
  !*** ./src/vdom/index.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createElementVNode: () => (/* binding */ createElementVNode),\n/* harmony export */   createTextVNode: () => (/* binding */ createTextVNode)\n/* harmony export */ });\nfunction createElementVNode(vm, tag, data, ...children) {\n  data = data == null ? {} : data;\n  let key = data.key;\n  if (key) {\n    delete data.key;\n  }\n  return vnode(vm, tag, key, data, children);\n}\nfunction createTextVNode(vm, text) {\n  return vnode(vm, undefined, undefined, undefined, undefined, text);\n}\n\n/* vue自定义的对象节点 */\nfunction vnode(vm, tag, key, data, children, text) {\n  return {\n    vm,\n    tag,\n    key,\n    data,\n    children,\n    text\n  };\n}\n\n//# sourceURL=webpack://minivue/./src/vdom/index.js?");

/***/ }),

/***/ "./node_modules/nanoid/index.browser.js":
/*!**********************************************!*\
  !*** ./node_modules/nanoid/index.browser.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   customAlphabet: () => (/* binding */ customAlphabet),\n/* harmony export */   customRandom: () => (/* binding */ customRandom),\n/* harmony export */   nanoid: () => (/* binding */ nanoid),\n/* harmony export */   random: () => (/* binding */ random),\n/* harmony export */   urlAlphabet: () => (/* reexport safe */ _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_0__.urlAlphabet)\n/* harmony export */ });\n/* harmony import */ var _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./url-alphabet/index.js */ \"./node_modules/nanoid/url-alphabet/index.js\");\n\nlet random = bytes => crypto.getRandomValues(new Uint8Array(bytes));\nlet customRandom = (alphabet, defaultSize, getRandom) => {\n  let mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1;\n  let step = -~(1.6 * mask * defaultSize / alphabet.length);\n  return (size = defaultSize) => {\n    let id = '';\n    while (true) {\n      let bytes = getRandom(step);\n      let j = step;\n      while (j--) {\n        id += alphabet[bytes[j] & mask] || '';\n        if (id.length === size) return id;\n      }\n    }\n  };\n};\nlet customAlphabet = (alphabet, size = 21) => customRandom(alphabet, size, random);\nlet nanoid = (size = 21) => crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {\n  byte &= 63;\n  if (byte < 36) {\n    id += byte.toString(36);\n  } else if (byte < 62) {\n    id += (byte - 26).toString(36).toUpperCase();\n  } else if (byte > 62) {\n    id += '-';\n  } else {\n    id += '_';\n  }\n  return id;\n}, '');\n\n//# sourceURL=webpack://minivue/./node_modules/nanoid/index.browser.js?");

/***/ }),

/***/ "./node_modules/nanoid/url-alphabet/index.js":
/*!***************************************************!*\
  !*** ./node_modules/nanoid/url-alphabet/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   urlAlphabet: () => (/* binding */ urlAlphabet)\n/* harmony export */ });\nconst urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';\n\n//# sourceURL=webpack://minivue/./node_modules/nanoid/url-alphabet/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("d2f38ffb947d34b1ca48")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "minivue:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							},
/******/ 							[])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = __webpack_require__.hmrS_jsonp = __webpack_require__.hmrS_jsonp || {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			currentUpdatedModulesList = updatedModulesList;
/******/ 			return new Promise((resolve, reject) => {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = (event) => {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		self["webpackHotUpdateminivue"] = (chunkId, moreModules, runtime) => {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.jsonp = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;