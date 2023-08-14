import Dep from './dep';

const { nanoid } = require('nanoid');

/* ，每一种watch驱动的时候其实都对应了一种回调函数 */
class Watcher{
    constructor(vm, callback, isrenderWatcher){
        this.id = nanoid(); // watch的唯一id
        this.callback = callback; // 触发watchder的回调函数
        this.renderWatcher = isrenderWatcher; // 表示是否为渲染watcher
        this.deps = new Set();//组件卸载的时候拿到watcher当前的deps，方便清除watcher，避免更新
        this.update();
        vm._watcher = this;
    }
    update(){
        // 解析当前组件的时候就将全局变量的值置为vm。这样就可以把watcher和dep建立关联
        Dep.target = this;
        console.log("视图更新")
        this.callback();
        Dep.target = null;
    }
    ququeUpdate(){
        queueWatcher(this);
    }
    addDep(dep){
        this.deps.add(dep);
    }
}

/* vue源码的思路是每次添加都只记录但是不放入事件队列(通过节流实现，这样可以控制最后一次执行)， 
    而我的思路是每次只要不存在就放入时间队列，执行的是每个watcher的第一次。
*/
let queue = new Set();
function queueWatcher(watcher){
    if(!queue.has(watcher)){
        // queue.add(watcher);
        // 放入事件队列中循环执行，而且尽可能早的执行
        nextTick(() => {
            watcher.update();
            // 刷完一次后要做清除工作，否则下次更新无效
            queue.clear();
        });
        queue.add(watcher);
    }
}

export function nextTick(callback){
    if(Promise){
        Promise.resolve().then(callback, 0);
    }
    else {
        setTimeout(() => {
            callback();
        }, 0);
    }
}

export default Watcher;