// 闭包

// 1.基础概念理解
var name = 'bss';
const personFn = function() {
    var name = 'hello'
    return function() {
        console.log(name)
    }
}

const person = personFn() // 引用的匿名函数包含外层函数变量 所以外层的作用域和变量会一直存在内存中 因作用域链访问是从内向外访问 所以首先访问到外层函数的变量 返回hello
person() // hello


// 2.向外部提供公共属性及方法（特权方法）
// 方式一：利用构造函数
var Person = function(name) {
    const area = 'china'
    this.getName = function() { //公共方法
        return {area,name} //私有变量
    }
}
const person1 = new Person('lala')
console.log(person1.getName())

// 方式二：原型模式
// 此处使用立即调用表达式，它的好处在于执行内部代码的同时不被引用，所以表达式执行结束内部变量会全部销毁（比如privateCarBrand） 除非定义了全局变量 （此处比如构造函数PersonalCar）
;(function() {
    var privateCarBrand = 'BMW'
    PersonalCar = function(value) {
        privateCarBrand = value
    }
    PersonalCar.prototype.publicMethod = function() {
        return privateCarBrand
    }
})();

var myCar = new PersonalCar('Audi')
console.log(myCar.publicMethod())
// console.log(privateCarBrand) // 报错 因为表达式执行完毕 内部变量被销毁


// 方式三：模块模式
var singleton = function(){ 
    //私有变量和私有函数
    var privateVariable = 10;
    function privateFunction(){
        console.log('hhh')
    }

    return {
        publicProperty: true, // 公共属性
        publicMethod(){ // 公共方法
            privateVariable++;
            return privateFunction();
            }
    };
   }();

   singleton.publicMethod()


// 3.函数柯里化
// 在一个闭包中返回函数 函数被调用时 往返回函数中传入一些额外参数
// 通俗地说就是对一个函数进行加工，返回另一个函数，可对返回函数的上下文及参数进行改变
// 调用时需要传入柯里化的函数及必要参数

// 通用方式
const curry = function(fn) {
    const outerArgs = Array.prototype.slice.call(arguments,1) // arguments外层函数参数 除了第一个参数
    return function() {
        const innerArgs = Array.prototype.slice.call(arguments) // arguments内层函数参数
        const finalArgs = outerArgs.concat(innerArgs)
        fn.apply(null, finalArgs)
    }
}

const add = function(n1, n2) {
    console.log(n1 + n2)
}

const curryAdd = curry(add,1)
curryAdd(4)

// 绑定上下文
const curry1 = function(fn,context) {
    const outerArgs = Array.prototype.slice.call(arguments,2) // 从第二个往后的参数
    return function() {
        const innerArgs = Array.prototype.slice.call(arguments) 
        const finalArgs = outerArgs.concat(innerArgs)
        fn.apply(context, finalArgs)
    }
}

const obj = {
    name: 'ss'
}

const handler = function() {
    console.log(this.name + '' + Array.from(arguments))
}
const curryFn = curry1(handler,obj,2)
curryFn(3)