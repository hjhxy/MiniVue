import { initMixin } from "./init";
import { initLifecycle } from "./lifecycle";


function Vue(options){
    if(!this instanceof Vue){
        throw new Error("Vue只能作为构造函数调用");
    }
    this._init(options);
}

initMixin(Vue);
initLifecycle(Vue);

window.Vue = Vue;