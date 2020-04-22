// 保证每X毫秒执行一次
const throttle = function (fn, delay) {
    return arg => {
        if (fn.id) return
        fn.id = setTimeout(function () {
            fn.call(this, arg)
            clearTimeout(fn.id)
            fn.id = null
        }, delay)
    }
}