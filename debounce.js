// 将多个连续事件组合成一个执行 如果在小于delay时间内连续事件不停止 则不触发事件执行
const debounce = function(fn, delay) {
    return arg => {
        if(fn.id) {
            clearTimeout(fn.id)
        }
        fn.id = setTimeout(function() {
            fn.call(this, arg)
        }, delay)
    }
}