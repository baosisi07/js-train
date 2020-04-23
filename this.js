person = {
    fn(arg) {
        console.log(arg+' '+this.name)
    }
}

person1 = {
    name: 'ss',
    age: '27'
}

person.fn.call(person1,'hello')
person.fn.apply(person1, ['hello'])
person.fn.bind(person1, 'hello')()

// 手动实现call方法 apply方法类似 只是参数处理方式不同
// 1.将调用对象的this指向新对象 因为call和apply作为函数的方法 所以为了执行函数需要在新对象上定义fn
// 2.处理arguments,从第二个参数开始作为参数列表调用定义的fn
// 3.删除新增加到新对象上的fn(注意处理对象原本方法名的重复 使用hasOwnProperty及Math.random)

Function.prototype.myCall = function(context) {
    // context指要绑定的新对象
    context = context || window
    let key = 'fn'+Math.random()
    if(context.hasOwnProperty(key)) {
        key = 'fn' + Math.random()
    }
    context[key] = this // this指向调用对象 即函数fn
    let argsArr = Array.from(arguments)
    let args = argsArr.slice(1)
    const result = context[key](args)
    delete context[key]
    return result
}

person.fn.myCall(person1, 'hello')
