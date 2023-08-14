import { compileToFunction } from "./compiler";
import { mountComponent } from "./lifecycle";
import { observe } from "./observe";

export function initMixin(Vue){
    Vue.prototype._init=function(options){
        this.$options = options;
        
        // 初始化状态
        initState(this);

        // 模版编译
        this.$mount(this.$options.el);
    }

    // 模版编译的最终目的是为了拿到render函数，render==>虚拟dom，虚拟dom==>patch得到真实dom
    Vue.prototype.$mount=function(el){
        if(!el) return;
        const app = document.querySelector(el);
        // 如果有render函数就以render函数为准，否则检查template，最后检查模版
        const ops = this.$options;
        let template = null;

        if(!ops.render){
            if(!ops.template){
                template=app.outerHTML;
            }
            else {
                template = ops.template;
            }
            ops.render = compileToFunction(template);
        }

        // 调用render函数实现挂载
        mountComponent(this, app);
    }
}

// 初始化options
function initState(vm){
    const options = vm.$options;
    if(options.data){
        initData(vm);
    }

}

// 初始化data，加工
function initData(vm){
    let data = vm.$options.data;
    data = typeof data == 'function'?data.call(vm):data;
    
    // observe 数据劫持
    observe(data);
    // 此时得到的data就是实现了响应式的data，挂载到this身上方便访问。
    vm._data=data;
    // 二次代理，方便访问直接通过this访问
    proxy(vm,data);

}

// 把响应式的属性代理到data身上
function proxy(vm, data){
    for(const key in data){
        Object.defineProperty(vm,key,{
            get(){
                return data[key];
            },
            set(newval){
                data[key]=newval;
            }
        })
    }
}