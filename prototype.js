// 模拟new一个对象的过程
let M = function(name) {
    this.name = name
}

let new1 = function(fn,name) {
    var obj = Object.create(fn.prototype) // 创建一个新对象 使用参数来提供新对象的__proto__属性 即指定新对象的原型对象
    const res = fn.call(obj,name) // 将构造函数上下文指向实例对象并执行构造函数
    return typeof res === 'object' ? res : obj // 执行结果为对象则返回该值，否则返回空对象obj
}

const ss = new1(M,'bss')
console.log(ss.name)
console.log(ss.__proto__ === M.prototype)
console.log(ss.__proto__.constructor === M)

// 继承的几种方式

// 1. 借助构造函数
// 可以继承构造函数中的属性方法 （缺点）构造函数的原型属性及方法不能继承
let Parent = function(name) {
    this.name = name
}

Parent.prototype.say = function() {
    console.log('say sth')
}

let Child = function(name) {
    Parent.call(this,name)
    this.type = '1'
}

const child = new Child('child1')

console.log(child)
console.log(child.say)

// 2. 原型继承
// 继承了构造函数的属性方法 并且继承了构造函数的属性和方法 实际是加到原型上
// 缺点：因为实例属性共享 某个实例修改属性 则其他实例属性也随之变化
let Parent1 = function() {
    this.food = [1,2,3]
}

Parent1.prototype.say = function() {
    console.log('parent1 say sth')
}

let Child1 = function() {
    this.type = '2'
}

Child1.prototype = new Parent1()

const child1 = new Child1()
const child12 = new Child1()

console.log('原型继承')
console.log(child1)
console.log(child1.say()) // 继承了构造函数原型的方法

child1.food.push(4) // 构造函数的属性共享 当某个实例修改属性 则其他实例的属性也发生改变
console.log(child1.food)
console.log(child12.food)

// 3. 组合继承
// 构造函数及其原型上的属性及方法都可以被继承 组合了两者的优点
// 缺点：构造函数被调用两次
let Parent2 = function() {
    this.food = [1,2,3]
}

Parent2.prototype.say = function() {
    console.log('parent2 say sth')
}

let Child2 = function() {
    Parent2.call(this)
    this.type = '3'
}

Child2.prototype = new Parent2()

const child2 = new Child2()
const child22 = new Child2()
console.log('组合继承')
console.log(child2)
console.log(child2.say())

child2.food.push(4)
console.log(child2.food)
console.log(child2.__proto__.food)
console.log(child22.food)

console.log(child2.__proto__.constructor === Parent2) // 没有生成自己的constructor

// 4.组合继承优化1
// 在组合继承的基础上避免了二次调用
let Parent3 = function() {
    this.food = [1,2,3]
}

Parent3.prototype.say = function() {
    console.log('parent3 say sth')
}

let Child3 = function() {
    Parent3.call(this)
    this.type = '4'
}

Child3.prototype = Parent3.prototype

const child3 = new Child3()

console.log('组合继承优化1')
console.log(child3.food)
console.log(child3.__proto__.constructor === Parent3) // 没有生成自己的constructor

// 5.组合继承优化2
// 比较完善的方案
let Parent4 = function() {
    this.food = [1,2,3]
}

Parent4.prototype.say = function() {
    console.log('parent4 say sth')
}

let Child4 = function() {
    Parent4.call(this)
    this.type = '4'
}

Child4.prototype = Object.create(Parent4.prototype) // Child4.prototype.__proto__ = Parent4.prototype
Child4.prototype.constructor = Child4
const child4 = new Child4()

console.log('组合继承优化2')
console.log(child4.food)
console.log(child4.__proto__.constructor === Parent4)
console.log(child4.__proto__.constructor === Child4) // 生成自己的constructor