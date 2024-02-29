

/**
 * @description 判断一个值的类型
 * @author CY
 * @date 2024-02-29
 * @param { any } val 要判断类型的值
 * @returns { String } Number | String | Boolean | Object | Array | Function | Null | Undefined
*/
export const judgeType = function(val: any): String {
  return Object.prototype.toString.call(val).slice(8, -1)
}

/**
 * @description 判断一个值是否是数字
 * @author CY
 * @date 2024-02-29
 * @param val 要判断的值
 * @returns 
*/
export const isNumber = function(val: any): Boolean {
  return judgeType(val) === 'Number'
}

/**
 * @description 判断一个值是否是NaN
 * @author CY <1447047194@qq.com>
 * @date 2024-02-29
 * @param { Any } val
 * @returns { Boolean }
*/
export const isNaN = function(val: any): boolean {
  return isNumber(val) && window.isNaN(val)
}
