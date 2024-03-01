/**
 * @description 函数防抖---在wait时间间隔内，传入的函数如果没有再次被调用，那么该函数就会被调用
 * @author CY
 * @date 2024-03-01 10:53:34
 * @param { Function } fn 要防抖的函数
 * @param { Number } wait 等待执行的时间，单位ms
 * @returns { Function }
*/
export const debounce = function(fn: Function, wait: number): Function {
  let timer: NodeJS.Timeout | null =  null
  return function<T>(this: T) {
    const args = arguments
    const context = this
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, wait)
  }
}

/**
 * @description 函数节流---立即执行传入的函数，间隔wait毫秒后，这个函数才能被再次触发
 * @author CY
 * @date 2024-03-01 14:45:08
 * @param { Function } fn 要节流的函数
 * @param { Number } wait 等待执行的时间，单位ms
 * @returns { Function }
*/
// 节流函数 
export const throttle = function(fn: Function, wait: number): Function {
  let timer: NodeJS.Timeout | null = null
  return function<T>(this: T) {
    const args = arguments
    if (!timer) {
      fn.apply(this, args)
      timer = setTimeout(() => {
        timer && clearTimeout(timer)
        timer = null
      }, wait)
    }
  }
}
