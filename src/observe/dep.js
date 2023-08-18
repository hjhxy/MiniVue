const {
    nanoid
} = require('nanoid');

class Dep {
    constructor(vm) {
        this.id = nanoid();
        this.watchers = new Set();
    }
    append() {
        if (Dep.target) {
            this.watchers.add(Dep.target); // dep添加watcher
            Dep.target.addDep(this); // watcher添加dep
        }
    }
    depend(watcher) {
        this.watchers.delete(watcher);
    }
    notify() {
        // 通知watcher更新
        this.watchers.forEach(watcher => {
            // 如果是计算属性watcher的话，每次数据更新要重新置dirty=true
            // 同时还要通知视图更新
            if (watcher.lazy) {
                watcher.dirty = true;
                watcher._dep.notify(); //对于计算属性来说，既是watcher也有dep
            }
            watcher.ququeUpdate();
            // watcher.update();
        })
        // 如果是计算属性触发的setter，同时也要通知视图更新
    }

}
Dep.target = null;
Dep.stack = [];
Dep.pushTarget = function (watcher) {
    Dep.target = watcher;
    Dep.stack.push(watcher);
}
Dep.popTarget = function () {
    Dep.target = null;
    Dep.stack.pop();
}
Dep.cleanTarget = function (watcher) {
    Dep.stack = Dep.stack.filter(el => {
        el != watcher;
    });
}

export default Dep;