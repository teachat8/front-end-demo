//VNode节点
//https://github.com/answershuto/learnVue/blob/master/docs/VNode%E8%8A%82%E7%82%B9.MarkDown

export default class VNode {
    tag: string | void;
    data: VNodeData | void;
    children: Array<VNode>;
    text: string | void;
    elm: Node | void;
    ns: string | void;
    context: Component | void; // rendered in this component's scope
    functionalContext: Component | void;// only for functional component root nodes
    key: string | number | void;
    componentOptions: VNodeComponentOptions | void;
    componentInstance: Component | void;// component instance
    parent: VNode | void;
    raw: boolean;//contains raw HTML? (server only)
    isStatic: boolean; // hoisted static node
    isRootInsert: boolean; // necessary for enter transition check
    isComment: boolean; // empty comment placeholder?
    isCloned: boolean; // is a cloned node?
    isOnce: boolean; // is a v-once node?

    constructor(tag: string,
                data: VNodeData,
                children: ?Array<VNode>,
                text: string,
                elm: Node,
                context: Component,
                componentOptions: VNodeComponentOptions) {

        //当前节点的名字
        this.tag = tag
        /*当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息*/
        this.data = data
        //当前节点的子节点，是一个数组
        this.children = children
        //当前节点的文本
        this.text = text
        //当前虚拟节点对应的真实dom节点
        this.elm = elm
        //当前节点的名字空间
        this.ns = undefined
        //编译作用域
        this.context = context
        //函数化组件作用域
        this.functionalContext = undefined
        //节点的key属性，被当作节点的标志，可以优化
        this.key = data && data.key
        //组件的option选项
        this.componentOptions = componentOptions
        //当前节点对应的组件实例
        this.componentInstance = undefined
        //当前节点的父节点
        this.parent = undefined
        /*简而言之就是是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false*/
        this.raw = false
        //静态节点标志
        this.isStatic = false
        //是否作为根节点插入
        this.isRootInsert = true
        //是否为注释节点
        this.isComment = false
        //是否为克隆节点
        this.isCloned = false
        //是否有v-once指令
        this.isOnce = false
    }

// DEPRECATED: alias for componentInstance for backwards compat.
    /* istanbul ignore next */
    get child(): Component | void {
        return this.componentInstance
    }

}


//
// tag: 当前节点的标签名
// data: 当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息
// children: 当前节点的子节点，是一个数组
// text: 当前节点的文本
// elm: 当前虚拟节点对应的真实dom节点
// ns: 当前节点的名字空间
// context: 当前节点的编译作用域
// functionalContext: 函数化组件作用域
// key: 节点的key属性，被当作节点的标志，用以优化
// componentOptions: 组件的option选项
// componentInstance: 当前节点对应的组件的实例
// parent: 当前节点的父节点
// raw: 简而言之就是是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false
// isStatic: 是否为静态节点
// isRootInsert: 是否作为跟节点插入
// isComment: 是否为注释节点
// isCloned: 是否为克隆节点
// isOnce: 是否有v-once指令


// 打个比方，比如说我现在有这么一个VNode树
//
// {
//     tag: 'div'
//     data: {
//     class: 'test'
//     },
//     children: [
//         {
//             tag: 'span',
//             data: {
//                 class: 'demo'
//             }
//             text: 'hello,VNode'
//         }
//     ]
// }
// 渲染之后的结果就是这样的
//
// <div class="test">
//     <span class="demo">hello,VNode</span>
// </div>


// createEmptyVNode 创建一个空VNode节点
/*创建一个空VNode节点*/
export const createEmptyVNode = () => {
    const node = new VNode()
    node.text = ''
    node.isComment = true
    return node
}


/*创建一个文本节点*/
export function createTextVNode(val: string | number) {
    return new VNode(undefined, undefined, undefined, String(val))
}

// createComponent 创建一个组件节点
// plain options object: turn it into a constructor
if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
}
// if at this stage it's not a constructor or an async component factory,
// reject.
/*如果在该阶段Ctor依然不是一个构造函数或者是一个异步组件工厂则直接返回*/
if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
        warn(`Invalid Component definition: ${String(Ctor)}`, context)
    }
    return
}
// async component
/*处理异步组件*/
if (isUndef(Ctor.cid)) {
    Ctor = resolveAsyncComponent(Ctor, baseCtor, context)
    if (Ctor === undefined) {
        // return nothing if this is indeed an async component
        // wait for the callback to trigger parent update.
        /*如果这是一个异步组件则不会返回任何东西（undifiened），直接return掉，等待回调函数去触发父组件更新。*/
        return
    }
}
// resolve constructor options in case global mixins are applied after
// component constructor creation
resolveConstructorOptions(Ctor)

data = data || {}

// transform component v-model data into props & events
if (isDef(data.model)) {
    transformModel(Ctor.options, data)
}

// extract props
const propsData = extractPropsFromVNodeData(data, Ctor, tag)

// functional component
if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
}


// extract listeners, since these needs to be treated as
// child component listeners instead of DOM listeners
const listeners = data.on
// replace with listeners with .native modifier
data.on = data.nativeOn

if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners
    data = {}
}

// merge component management hooks onto the placeholder node
mergeHooks(data)

// return a placeholder vnode
const name = Ctor.options.name || tag
const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    {Ctor, propsData, listeners, tag, children}
)
return vnode


// cloneVNode 克隆一个VNode节点
export function cloneVNode(vnode: VNode): VNode {
    const cloned = new VNode(
        vnode.tag,
        vnode.data,
        vnode.children,
        vnode.text,
        vnode.elm,
        vnode.context,
        vnode.componentOptions
    )
    cloned.ns = vnode.ns
    cloned.isStatic = vnode.isStatic
    cloned.key = vnode.key
    cloned.isCloned = true
    return cloned
}


// createElement
// wrapper function for providing a more flexible interface
// without getting yelled at by flow
export function createElement(context: Component,
                              tag: any,
                              data: any,
                              children: any,
                              normalizationType: any,
                              alwaysNormalize: boolean) {

    /*兼容不传data的情况*/
    if (Array.isArray(data) || isPromise(data)) {
        normalizationType = children
        children = data
        data = undefined
    }
    /*如果alwaysNormalize为true，则normalizationType标记为ALWAYS_NORMALIZE*/
    if (isTrue(alwaysNormalize)) {
        normalizationType = ALWAYS_NORMALIZE
    }
    /*创建虚拟节点*/
    return _createElement(context, tag, data, children, normalizationType)
}


/*创建虚拟节点*/
export function _createElement(context: Component,
                               tag: string | Class<Component> | Function | Object,
                               data: VNodeData,
                               children: any,
                               normalizationType: number) {
    /*
     如果传递data参数且data的__ob__已经定义（代表已经被observed，上面绑定了Oberver对象），
     https://cn.vuejs.org/v2/guide/render-function.html#约束
     那么创建一个空节点
     */
    if (isDef(data) && isDef(data).__ob__) {
        process.env.NODE_ENV !== 'production' && warn(
            `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
            'Always create fresh vnode data objects in each render!',
            context
        )
        return createEmptyVNode()
    }
    /*如果tag不存在也是创建一个空节点*/
    if (!tag) {
        // in case of component :is set to falsy value
        return createEmptyVNode()
    }
    // support single function children as default scoped slot
    /*默认默认作用域插槽*/
    if (Array.isArray(children) && typeof children[0] === 'function') {
        data = data || {}
        data.scopedSlots = {default: children[0]}
        children.length = 0
    }
    if (normalizationType === ALWAYS_NORMALIZE) {
        children = normalizeChildren(children)
    } else if (normalizationType === SIMPLE_NORMALIZE) {
        children = simpleNormalizeChildren(children)
    }
    let vnode, ns
    if (typeof tag === 'string') {
        let Ctor
        /*获取tag的命名空间*/
        ns = config.getTagNamespace(tag)
        /*判断是否是保留的标签*/
        if (config.isReservedTag(tag)) {
            // platform built-in elements
            /*如果是保留的标签则创建一个相应节点*/
            vnode = new VNode(
                config.parsePlatformTagName(tag),
                data,
                children,
                undefined,
                undefined,
                context
            )
        } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
            // component
            /*从vm实例的option的components中寻找该tag，存在则就是一个组件，创建相应节点，Ctor为组件的构造类*/
            vnode = createComponent(Ctor, data, context, children, tag)

        } else {
            // unknown or unlisted namespaced elements
            // check at runtime because it may get assigned a namespace when its
            // parent normalizes children
            /*未知的元素，在运行时检查，因为父组件可能在序列化子组件的时候分配一个名字空间*/
            vnode = new VNode(
                tag,
                data,
                children,
                undefined,
                undefined,
                context
            )

        }
    } else {
        // direct component options / constructor
        /*tag不是字符串的时候则是组件的构造类*/
        vnode = createComponent(tag, data, context, children)
    }
    if (isDef(vnode)) {
        /*如果有名字空间，则递归所有子节点应用该名字空间*/
        if (ns) applyNS(vnode, ns)
        return vnode
    } else {
        /*如果vnode没有成功创建则创建空节点*/
        return createEmptyVNode()
    }
}




//
// createElement用来创建一个虚拟节点。
// 当data上已经绑定__ob__的时候，代表该对象已经被Oberver过了，所以创建一个空节点。tag不存在的时候同样创建一个空节点。
// 当tag不是一个String类型的时候代表tag是一个组件的构造类，直接用new VNode创建。
// 当tag是String类型的时候，如果是保留标签，则用new VNode创建一个VNode实例，
// 如果在vm的option的components找得到该tag，代表这是一个组件，否则统一用new VNode创建。
//
//





