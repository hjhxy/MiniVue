const { nanoid } = require('nanoid');

class Dep {
    constructor(vm){
        this.id = nanoid();
        this.watchers = new Set();
    }
    append(){
        if(Dep.target){
            this.watchers.add(Dep.target); // dep添加watcher
            Dep.target.addDep = this; // watcher添加dep
        }
    }
    depend(watcher){
        this.watchers.delete(watcher);
    }
    notify(){
        // 通知watcher更新
        this.watchers.forEach(watcher=>{
            watcher.ququeUpdate();
            // watcher.update();
        })
    }
    
}
Dep.target=null;

export default Dep;