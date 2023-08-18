
declare interface Iobj {
    [key:string]:any
}

declare interface IOptions{
    data?:Iobj|(()=>Iobj),
    props?:Array<string>|Iobj,
    components?:object,
    methods?:object,
    directives?:object,
    beforeCreate?:()=>void,
    Created?:()=>void,
    beforeMount?:()=>void,
    Mounted?:()=>void,
    beforeUpdate?:()=>void,
    Updated?:()=>void,
    beforeDestory?:()=>void,
    Destoryed?:()=>void
}

// export interface IOptions{
//     data?:object|(()=>object),
//     props?:Array<string>|object,
//     components?:object,
//     methods?:object,
//     directives?:object,
//     beforeCreate?:()=>void,
//     Created?:()=>void,
//     beforeMount?:()=>void,
//     Mounted?:()=>void,
//     beforeUpdate?:()=>void,
//     Updated?:()=>void,
//     beforeDestory?:()=>void,
//     Destoryed?:()=>void
// }
