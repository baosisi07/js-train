// 基础版本
function deepClone(obj) {
    if(!isObject(obj) && !isArray(obj)) {
        return obj
    }

    let copy = isArray(obj) ? [] : {}

    for(let key in obj) {
        if(obj.hasOwnProperty(key)) {
            if(isObject(obj[key]) || isArray(obj[key])) {
                copy[key] = deepClone(obj[key])
            } else {
                copy[key] = obj[key]
            }
        }
    }
    return copy
}

const isObject = function(x) {
    if(Object.prototype.toString.call(x).slice(8,-1) === 'Object') {
        return true
    } else {
        return false
    }
}

const isArray = function(x) {
    if(Object.prototype.toString.call(x).slice(8,-1) === 'Array') {
        return true
    } else {
        return false
    }
}


const createData = function(deep, breath) {
    let data = {};
    let temp = data;
    for(let i = 0; i < deep; i++) {
        temp = temp['data'] = {}
        for(let j = 0; j < breath; j++) {
            temp[j] = j
        }
    }
    return data;
}


// 验证基础深拷贝
let a1 = {
    a: {b: {c: 123}},
    b: {d: { m: 111, n: 222}, s: [1,2,3]}
}

let a2 = deepClone(a1)

console.log(a2.a === a1.a)
console.log(a1.b.s === a2.b.s)

// 当嵌套层级过深会导致栈溢出
// deepClone(createData(10000))
// 广度不会导致栈溢出
deepClone(createData(1, 100000))

// 栈溢出解决方案
// 用循环代替递归

const loopDeepClone = function(x) {
    let root = {}
    let loopList = [{
        parent: root,
        key: undefined,
        data: x
    }]

    while(loopList.length > 0) {
        let node = loopList.pop();
        let { parent, key, data } = node;
        let res = parent;
        if(typeof key !== 'undefined') {
            res = parent[key] = isArray(data) ? [] : {}
        }

        for(let k in data) {
            if(data.hasOwnProperty(k)) {
                if(isObject(data[k]) || isArray(data[k])) {
                    loopList.push({
                        parent: res,
                        key: k,
                        data: data[k]
                    })
                } else {
                    res[k] = data[k]
                }
            }
        }    
    }
    return root
}

const loopData = loopDeepClone(createData(100000))
const loopData1 = loopDeepClone(a1)

console.log(loopData1.a === a1.a)
console.log(a1.b.s === loopData1.b.s)

// 循环引用解决方案 循环引用也会导致栈溢出
// 1. 使用唯一性数组存储已拷贝的数据 执行拷贝前先到数组中查找 找到则直接取数据 否则存入数组并执行拷贝逻辑

const uniqueDeepClone = function(x) {
    let root = {}
    let uniqueList = []
    let loopList = [
        {
            parent: root,
            key: undefined,
            data: x
        }
    ]

    while(loopList.length > 0) {
        let node = loopList.pop()
        let {parent,key,data} = node
        let res = parent
        if(typeof key !== 'undefined') {
            res = parent[key] = isArray(data) ? [] : {}
        }

        let uniqueData = find(uniqueList, data)
        if(uniqueData) {
            parent[key] = uniqueData.target
            continue // 终止本次循环
        }

        uniqueList.push({
            source: data,
            target: res
        })

        for(let k in data) {
            if(data.hasOwnProperty(k)) {
                if(isObject(data[k]) || isArray(data[k])) {
                    loopList.push({
                        parent: res,
                        key: k,
                        data: data[k]
                    })
                } else {
                    res[k] = data[k]
                }
            }
        }
    }
    return root
}

const find = function(list, data) {
    for(let i = 0; i< list.length; i++) {
        if(list[i].source === data) {
            return list[i]
        }
    }
    return null
}

// 2. 利用ES6的WeakMap结构实现

const uniqueMapDeepClone = function(x, map = new WeakMap()) {
    let root = {}
    let loopList = [
        {
            parent: root,
            key: undefined,
            data: x
        }
    ]

    while(loopList.length > 0) {
        let node = loopList.pop()
        let {parent,key,data} = node
        let res = parent
        if(typeof key !== 'undefined') {
            res = parent[key] = isArray(data) ? [] : {}
        }
        if(map.get(data)) {
            parent[key] = map.get(data)
            continue
        }
        map.set(data, res)
        for(let k in data) {
            if(data.hasOwnProperty(k)) {
                if(isObject(data[k]) || isArray(data[k])) {
                    loopList.push({
                        parent: res,
                        key: k,
                        data: data[k]
                    })
                } else {
                    res[k] = data[k]
                }
            }
        }
    }
    return root
}



a1.a1 = a1
// deepClone(a1)
const re = uniqueDeepClone(a1)
const re1 = uniqueMapDeepClone(a1)
console.log(re)
console.log(re1)