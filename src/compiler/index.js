import { parse } from "./parse";

function generatorProps(attrs=[]){
    if(attrs.length==0){
        return 'null';
    }
    let str="";
    for(let i=0;i<attrs.length;i++){
        let attr = attrs[i];
        if(attr.name=='style'){
            let obj = {};
            attr.value.split(';').forEach(item=>{
                let [key, value] = item.split(':');
                obj[key] = value;
            });
            attr.value = obj;
        }
        str+=`${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0,-1)}}`;
}

function generatorChild(children){
    // 如果是元素节点
    if(!children || children.length==0){
        return "";
    }
    let childrenCodes = [];
    for(let i=0;i<children.length;i++){
        // 如果是文本调用_s
        if(children[i].type == 'TEXT_TYPE'){
            let text = children[i].text.trim();
            const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
            if(!defaultTagRE.test(text)){// 普通文本
                return `_v("${text}")`;
            }
            else {
                let tokens = [];
                let match;
                defaultTagRE.lastIndex=0;
                let lastIndex=0;
                while(match=defaultTagRE.exec(text)){
                    let index = match.index;
                    if(index>lastIndex){
                        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
                    }
                    tokens.push(`_s(${match[1].trim()})`);
                    lastIndex = index + match[0].length;
                }
                if(lastIndex < text.length){
                    tokens.push(JSON.stringify(text.slice(lastIndex)))
                }
                return `_v(${tokens.join('+')})`;
            }
        }
        else { // 否则继续递归
            childrenCodes.push(generator(children[i]));
        }
    }
    return childrenCodes.join(',');
}

// 根据ast树构造为render函数的语法。
function generator(ast){
    //_c，_v，_s：分别用来创建节点/创建文本/替换变量
    let code = `_c("${ast.tag}",${generatorProps(ast.attrs)},${generatorChild(ast.children)})`;

    return code;
}

// 生成render函数
export function compileToFunction(template=""){
    let ast = parse(template);
    let code = generator(ast);
    console.log(code);

    const renderFn = new Function(`with(this){console.log("this",this);return ${code}}`)

    return renderFn;
}