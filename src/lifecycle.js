import Watcher, { nextTick } from "./observe/watcher";
import { createElementVNode, createTextVNode } from "./vdom";

/* 调用js原生方法创建dom，并往虚拟节点vnode上存储一份 */
function createEle(vnode){
    const {vm,tag,key,data,children,text} = vnode;
    if(typeof tag == 'string'){// 非文本节点
        vnode.el = document.createElement(tag);// 将真实元素挂载到身上，方便更新
        patchProps(vnode.el, data);
        children.forEach(child=>{
            vnode.el.appendChild(createEle(child));
        })
    }
    else {
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}

/* 生产props */
function patchProps(el, props){
    for(const key in props){
        if(key=='style'){
            for(let styleName in props[key]){
                el.style[styleName] = props[key][styleName];
            }
            continue;
        }
        el.setAttribute(key,props[key]);
    }
}

/* 第一次就直接初始化渲染，后续进行虚拟dom对比更新 */
/* 对于patch方法来说对比和更新都是使用的一个patch方法,，因此要区分第一个参数 */
function patch(elOrvnode, vnode, firstMount) {
    // if(firstMount){ // 如果说是第一次挂载的话
        const parentNode = elOrvnode.parentNode;
        const el = createEle(vnode);
        parentNode.innerHTML = "";
        parentNode.appendChild(el);
        return el;
    // }
}

/* 扩展_update和_render方法 */
export function initLifecycle(Vue){
    /* 渲染为真实dom */
    Vue.prototype._update=function(vnode){
        console.log("vnode", vnode);
        const vm  = this;
        const el = this.$el;
        // 虚拟dom对比更新
        // 初次挂载
        if(!vm._vnode){
            console.log("第一次挂载patch");
            // this.$el = patch(el, vnode, true);
        }
        else {
            console.log("节点更新的patch");
        }
        this.$el = patch(this.$el, vnode);
        this._vnode = vnode;
    }

    /* 生成虚拟dom，只有第一次通过模版生成render方法，后续的模版更新都是通过修改虚拟dom，重新执行render方法*/
    Vue.prototype._render=function(){
        const ops = this.$options;
        return ops.render.call(this);
    }

    // 解析节点
    Vue.prototype._c=function(...args){
        return createElementVNode(this, ...args);
    }

    // 解析文本
    Vue.prototype._v=function(...args){
        return createTextVNode(this, ...args);
    }

    /* 解析变量，碰到变量的时候去this上取(放到_v做了)，碰到对象JSON.stringfy */
    // 传递过来value是直接到vue实例上去取值
    // 因此就可以在这里取值的时候配合响应式的操作
    Vue.prototype._s=function(value){
        if(typeof value == 'object') return JSON.stringify(value);
        return value;
    }

    // 批量收集，异步执行
    Vue.prototype.$nextTick=function(cb){
        nextTick(cb);
    }
}

export function mountComponent(vm, el){
    /* 组件开始挂载  */ 
    // 1. 调用render函数生成虚拟dom。
    // 2. 根据虚拟dom产生真实dom。
    // 3. 插入到el元素中。
    vm.$el = el;
    
    new Watcher(vm, ()=>{
        vm._update(vm._render());
    })

}