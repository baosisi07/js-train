

function async(args, callback) {
    setTimeout(function() {
        callback(args)
    },1000)
}
function final(res) {
    console.log('执行完毕',res)
}


// 串行执行 耗时6s

// let arr = [1, 2, 3, 4, 5, 6]
// let result = []

// function runner(item) {
//     if(item) {
//         async (item, function (arg) {
//             console.log('等待1秒' + arg)
//             result.push(arg * 2)
//             return runner(arr.shift())
//         })
//     } else {
//         final(result)
//     }
// }
// runner(arr.shift())

// 并行执行 耗时1s
// let arr1 = [1, 2, 3, 4, 5, 6]
// let result1 = []

// arr1.forEach(function(item,index) {
//     async (item, function (arg) {
//         console.log('等待1秒' + arg)
//         result1.push(arg * 3)
//         if (index === arr1.length - 1) {
//             final(result1)
//         }
//     })
// })

// 控制并行个数 即串行并行结合
let arr2 = [1, 2, 3, 4, 5, 6];
let runnerNum = 0;
let limit = 2;
let result2 = [];
function runner1() {
    while (runnerNum < limit && arr2.length > 0) {
        let item = arr2.shift()
        async (item, function (arg) {
            console.log('等待1秒' + arg)
            result2.push(arg * 4)
            runnerNum--
            if (arr2.length > 0) {
                runner1()
                
            } else if(runnerNum ===0) {
                final(result2)
            }
        })
        runnerNum++
    }
}
runner1()