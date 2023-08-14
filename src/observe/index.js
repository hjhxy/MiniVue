import { test } from "./array";
import Dep from "./dep";

class Observe{
    constructor(data){
        // 标识是否已经做过响应式，同时响应式数据还可以通过_vm拿到组件实例。
        Object.defineProperty(data,'_vm',{
            enumerable:false,
            value:true,
        })
        /* 监听数组的七个方法。对于数组并没有对每一个索引项做监听 */
        if(Array.isArray(data)){
            this.observeArray(data);
        }
        else {
            this.walk(data);
        }
    }

    walk(data){
        Object.keys(data).forEach(key=>{
            defineReactive(data,key,data[key]);
        })
    }
    // 监听数组中的元素
    observeArray(data){
        //1. 修改原型，监听数组自身
        test(data);
        //2. 递归监听子元素。
        data.forEach(el=>observe(el));
    }
}


function defineReactive(target,key,value){
    observe(target[key]);
    const dep = new Dep();
    if(Array.isArray(target[key])){ // 如果是数组的话就往数组身上存一份，因为数组响应式这快不存在闭包
        Object.defineProperty(target[key], '_dep', {// 整个数组对应一个dep
            enumerable:false,//不可枚举(遍历)
            value:dep
        })
        dep.append();
    }
    Object.defineProperty(target,key,{
        // 收集watcher到本属性的dep身上
        get(){
            dep.append();//将全局变量中存储的watcher添加到当前
            console.log("get数据："+key);
            return value;
        },
        // 更新dep内存储的所有watcher
        set(newval){
            console.log("set数据："+key);
            value = newval;
            dep.notify();
        }
    })
}


// 对数据做劫持。
export function observe(data){
    if(typeof data !== 'object' || data==null || data._vm) return;
 
    return new Observe(data);
}