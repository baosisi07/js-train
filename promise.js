class MyPromise {
    constructor(fn) {
        this.state = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.resolveFnArr = [];
        this.rejectFnArr = [];
        let resolve = function(value) {
            if(this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.resolveFnArr.forEach(callbackfn => callbackfn(this.value))
            }
        }
        let reject = function(reason) {
            if(this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                this.rejectFnArr.forEach(callbackfn => callbackfn(this.reason))
            }
        }
        try {
            fn(resolve,reject)
        } catch(e) {
            reject(e)
        }
    }
    then(onFulfilled,onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
        onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err}
        let promise2 = new MyPromise((resolve,reject) => {
            if(this.state === 'fulfilled') {
                setTimeout(() => {
                    try {
                        let x =  onFulfilled(this.value)
                        resolvePromise(promise2,x,resolve,reject)
                    } catch(e) {
                        reject(e)
                    }
                },0);
              
            }
            if(this.state === 'rejected') {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                    resolvePromise(promise2,x,resolve,reject)
                    } catch(e) {
                        reject(e)
                    }
                })
                
            }
            if(this.state === 'pending') {
                this.resolveFnArr.push(function() {
                    setTimeout(() => {
                        try {
                            let x =  onFulfilled(this.value)
                            resolvePromise(promise2,x,resolve,reject)
                        } catch(e) {
                            reject(e)
                        }
                    })
                    
                })
                this.rejectFnArr.push(function() {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2,x,resolve,reject)
                        } catch(e) {
                            reject(e)
                        }
                    })
                    
                })
            }
        })
        return promise2
    }
}

function resolvePromise(promise2,x,resolve,reject) {
    if(promise2 === x) {
        return reject(new TypeError('循环引用'))
    }
    let called = false;
    if(x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then;
        if(typeof then === 'function') {
            then.call(x, y => {
                if(called) return
                called = true
                resolvePromise(promise2,y,resolve,reject)
            }, e => {
                if(called) return
                called = true
                reject(e)
            })
        } else {
            resolve(x)
        }
        } catch(e) {
            if(called) return
            called = true
            reject(e)
        }
        
    } else {
        resolve(x)
    }
}

MyPromise.resolve = function(val) {
    return new MyPromise((resolve) => {
        resolve(val)
    })
}
MyPromise.reject = function(val) {
    return new MyPromise((resolve, reject) => {
        reject(val)
    })
}

MyPromise.race = function(proArr) {
    return new MyPromise((resolve, reject) => {
        for(let i = 0; i < proArr.length; i++) {
            proArr[i].then(resolve, reject)
        }
    })    
}

MyPromise.all = function(proArr) {
    let len = proArr.length;
    let resData = [];
    let processData = function(i,data) {
        resData.push(data)
        if(i === len - 1) {
            resolve(resData)
        }
    }
    return new MyPromise((resolve, reject) => {
        for(let i = 0; i < proArr.length; i++) {
            proArr[i].then(data => {
                processData(i, data)
            }, reject)
        }
    })
}



