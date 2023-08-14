const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //匹配标签名 形如 abc-123
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //匹配特殊标签 形如 abc:234 前面的abc:可有可无
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配标签开始 形如 <abc-123 捕获里面的标签名
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束  >
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾 如 </abc-123> 捕获里面的标签名
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性  形如 id="app"


// 将模板编译为ast（抽象语法树）
export function parse(template = ""){
    let stack=[];//通过栈来构造树结构
    let rootnode=null;
    while(template){
        // 开始标签 或结束标签
        let index=template.indexOf('<');
        if(index==0){
            const startTagMatch = parseStartTag();
            template = template.trim();
            if(startTagMatch){
                start(startTagMatch);
                continue;
            }

            let endTagMatch;
            if(endTagMatch = template.match(endTag)){
                end();
                advance(endTagMatch[0].length);
            }
        }
        if(index>0) {// 处理文本
            const text = template.slice(0,index);
            chars(text);
            advance(index);
        }
    }

    function advance(len){
        template = template.slice(len);
    }
    
    /* 解析开始标签及其属性 */
    function parseStartTag(){
        let res;
        // 解析到开始标签
        if(res = template.match(startTagOpen)){
            let node ={
                tag:res[1],
                attrs:[],
                children:null
            };
            advance(res[0].length)
            // 解析当前标签的所有属性，结束标签的匹配在前，防止逻辑短路取不到结束标签
            let attr;
            let endTag;
            while(!(endTag=template.match(startTagClose))&&(attr=template.match(attribute))){
                node.attrs.push({
                    name:attr[1],
                    value:attr[3],
                })
                advance(attr[0].length);
            }
            advance(endTag[0].length)
            return node;
        }
        return null
    }


    function createASTElement(tag, attrs){
        return {
            tag,
            type:"ELEMENT_TYPE",
            children:[],
            attrs,
            parent:null
        }
    }

    function start({tag,attrs}){
        const node = createASTElement(tag, attrs);
        if(!rootnode){
            rootnode=node;
        }
        else {//非根元素，确立父子关系
            let parentNode=stack[stack.length-1];
            if(!parentNode.children){
                parentNode.children=[];
            }
            parentNode.children.push(node);
            node.parent=parentNode;
        }
        stack.push(node);
    }

    function chars(text){
        if(text.trim().length!=0){ // 非空文本添加
            stack[stack.length-1].children.push({
                type:"TEXT_TYPE",
                text,
                parent:stack[stack.length-1]
            });
        }
    }
    function end(){
        stack.pop();
    }

    return rootnode;
}