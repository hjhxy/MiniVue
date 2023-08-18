// 重写数组中的部分方法(数组与原型中间插入一个原型对象)
// 创建一个新的原型继承至数组的原型

import {
    observe
} from ".";

let newproto = Object.create(Array.prototype);

let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
];

methods.forEach(method => {
    // 重写的同时监听数组的变化，并调用原方法。
    newproto[method] = function (...args) {
        console.log(this, "数组调用了" + method);
        this._dep.notify();
        const proto = newproto.__proto__;
        proto[method] && proto[method].call(this, ...args);

        let observeData = [];
        switch (method) {
            case 'push':
            case 'unshift':
                // 对于新增项
                observeData = args;
                break;
            case 'splice':
                observeData = args.slice(2);
                break;
            default:
                break;
        }
        for (const data of observeData) {
            observe(data);
        }
    };
})

export function test(data) {
    Object.setPrototypeOf(data, newproto);
}