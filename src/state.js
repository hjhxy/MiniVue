import {
    observe
} from "./observe";
import Dep from "./observe/dep";
import Watcher from "./observe/watcher";

// 初始化data，加工
export function initData(vm) {
    let data = vm.$options.data;
    data = typeof data == 'function' ? data.call(vm) : data;

    // observe 数据劫持
    observe(data);
    // 此时得到的data就是实现了响应式的data，挂载到this身上方便访问。
    vm._data = data;
    // 二次代理，方便访问直接通过this访问
    proxy(vm, data);

}

// 把响应式的属性代理到vm身上
function proxy(vm, data) {
    for (const key in data) {
        Object.defineProperty(vm, key, {
            get() {
                return data[key];
            },
            set(newval) {
                data[key] = newval;
            }
        })
    }
}

// 初始化computed
// computed直接代理到实例vm身上即可。
export function initComputed(vm) {
    const computed = vm.$options.computed;
    let watchers = vm._computedwatchers = {};
    for (const key in computed) {
        const getter = typeof computed[key] == 'function' ? computed[key] : computed[key].get;
        watchers[key] = new Watcher(vm, getter, {
            lazy: true
        });
        proxyComputed(vm, key, computed[key]);
    }
}


// 把computed代理到vm身上
// 1. 添加computed自己的视图watcher
// 2. 将自己添加到watcher全局变量队列中
function proxyComputed(vm, key, computed) {
    const getter = typeof computed == 'function' ? computed : computed.get;
    const setter = computed.set || (() => {})
    // 一样的收集到dep，但是dep的触发不再由自己触发(自己也没办法触发，一般不直接修改computed)
    const dep = new Dep()
    Object.defineProperty(vm, key, {
        get: createComputedGetter(key, getter, dep),
        set(newval) {
            setter(newval);
        }
    })
}

function createComputedGetter(key, getter, dep) {
    // 获取计算属性值的时候会触发get方法，接着触发属性的getter，此时进行依赖收集
    /* 在没有修改依赖属性的情况下多次调用会走缓存(依靠dirty属性判断)，一旦修改依赖重新计算(重新将dirty=true) */
    return function (param) {
        const vm = this;
        const watcher = vm._computedwatchers[key];
        watcher._dep = dep;
        dep.append();
        return watcher.get();
    }
}

/* 处理watch */
// 监视属性watcher和视图watcher一样，都是页面加载就要收集依赖
export function initWatch(vm) {
    const watchs = vm.$options.watch;
    vm._watchwatchers = {};
    for (const key in watchs) {
        console.log("watch-->", key);
        if (!vm[key]) {
            throw new Error("监视的属性不存在")
        }
        vm._watchwatchers[key] = new Watcher(vm, watchs[key], {
            lazy: true
        })
    }
}