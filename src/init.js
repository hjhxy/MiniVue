import {
    compileToFunction
} from "./compiler";
import {
    mountComponent
} from "./lifecycle";
import {
    initComputed,
    initData,
    initWatch
} from "./state";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        this.$options = options;

        // 初始化状态
        initState(this);

        // 模版编译
        this.$mount(this.$options.el);
    }

    // 模版编译的最终目的是为了拿到render函数，render==>虚拟dom，虚拟dom==>patch得到真实dom
    Vue.prototype.$mount = function (el) {
        if (!el) return;
        const app = document.querySelector(el);
        // 如果有render函数就以render函数为准，否则检查template，最后检查模版
        const ops = this.$options;
        let template = null;

        if (!ops.render) {
            if (!ops.template) {
                template = app.outerHTML;
            } else {
                template = ops.template;
            }
            ops.render = compileToFunction(template);
        }

        // 调用render函数实现挂载
        mountComponent(this, app);
    }
}

// 初始化options
function initState(vm) {
    const options = vm.$options;
    if (options.data) {
        initData(vm);
    }
    if (options.computed) {
        initComputed(vm);
    }
    if (options.watch) {
        initWatch(vm);
    }
}