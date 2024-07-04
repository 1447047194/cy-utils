/**
 * @description 函数防抖---在wait时间间隔内，传入的函数如果没有再次被调用，那么该函数就会被调用
 * @author CY
 * @date 2024-03-01 10:53:34
 * @param { Function } fn 要防抖的函数
 * @param { Number } wait 等待执行的时间，单位ms
 * @returns { Function }
 */
export const debounce = function (fn: Function, wait: number): Function {
	let timer: NodeJS.Timeout | null = null
	return function <T>(this: T) {
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
export const throttle = function (fn: Function, wait: number): Function {
	let timer: NodeJS.Timeout | null = null
	return function <T>(this: T) {
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

/**
 * @description 生成随机32位字符串---会替换给定字符串的x和y为随机字符串
 * @author CY
 * @date 2024-03-07 16:41:51
 * @param {String} str 包含xy的字符串
 * @returns {String} 默认32位字符串-根据传入的str生成对应长度的字符串
 */
export const getUuid = function (str: String = 'xxyyxxx3xyxx7xx4yxx2xxxx6xxxxxxx'): String {
	return str.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0
		const v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}

/**
 * @description 复制文本（异步）
 * @author CY
 * @date 2024-03-07 17:56:14
 * @param { String } text 要复制的文本
 * @returns {Promise} 返回一个Promise，复制成功抛出复制的文本，失败抛出false
 */
export const copyTxt = function <T extends string>(text: T): Promise<T> {
	return new Promise((resolve, reject) => {
		// TODO：优先使用新api Clipboard
		try {
			navigator.clipboard.writeText(text).then(() => {
				resolve(text)
			})
		} catch (error) {
			console.log('-----Clipboard api copy is failed')
			try {
				const input = document.createElement('textarea')
				input.value = text
				document.body.appendChild(input)
				input.select()
				const succ = document.execCommand('copy')
				input.remove()
				if (succ) return resolve(text)
				console.log('-----execCommand copy is failed')
				reject(false)
			} catch (error) {
				reject(false)
			}
		}
	})
}

/**
 * @description 深拷贝
 * @author CY
 * @date 2024-04-14 14:29:00
 * @param {T} obj
 * @returns
 */
export const deepClone = function <T>(obj: T): T {
	if (typeof obj !== 'object' || obj === null) return obj
	const isArray = Array.isArray(obj)
	if (isArray) {
		const newArr: any[] = []
		obj.forEach((item, index) => (newArr[index] = deepClone(item)))
		return newArr as T
	} else {
		const newObj: { [key: string]: any } = {}
		for (let k in obj) {
			newObj[k] = deepClone(obj[k])
		}
		return newObj as T
	}
}

/**
 * @description 扁平结构转树状
 * @author CY
 * @date 2024-04-12 14:12:40
 * @param {Array} arr 扁平数据
 * @param {String} id id字段名
 * @param {String} pid 父id字段名
 * @param {String} children 子节点字段名
 * @returns {Array} tree 树状结构
 */
export const arrayToTree = function (arr: Array<any> = [], id: string = 'id', pid: string = 'pid', children: string = 'children'): Array<any> {
	const data: any[] = deepClone(arr)
	const idMap = new Map()
	const tree: any[] = []
	data.forEach(item => idMap.set(item[id], item))
	data.forEach(item => {
		if (!item[pid]) return tree.push(item)
		const parent = idMap.get(item[pid])
		if (!parent[children]) parent[children] = []
		parent[children].push(item)
	})
	return tree
}

/**
 * @description bytes字节单位转换
 * @author CY
 * @date 2024-06-27 17:13:27
 * @param {number} bytes 字节
 * @param {number} decimal 精度
 * @returns {string} 字节单位
 */
export const formatBytes = function (bytes: number, decimal: number = 2): string {
	if (bytes === 0) return '0B'
	const k = 1024
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
	const dm = decimal && decimal > 0 ? decimal : 0
	let i = 0
	let endStr = dm > 0 ? ''.padEnd(dm, '0') : ''
	while (bytes >= k && i < units.length - 1) {
		bytes /= k
		i++
	}
	if (dm === 0) return `${bytes}${units[i]}`
	return Number.isInteger(bytes) ? `${bytes}${units[i]}` : bytes.toFixed(dm).endsWith(endStr) ? `${bytes.toFixed(dm).split('.')[0]}${units[i]}` : `${bytes.toFixed(dm)}${units[i]}`
}

interface IOptions {
	valueKey?: string
	value: string | number | (string | number)[]
	getKey?: string
	flag?: boolean
}
/**
 * @description 根据value值，获取一组数据对象的(某个 | 多个)属性值或者某条数据（通常用于下拉选项根据value获取label值）
 * @author CY
 * @date 2024-07-04 16:35:24
 * @param {array} data 数据列表
 * @param {object} options 数据列表
 * @param {string} options.valueKey value对应的属性名(唯一键)
 * @param {string} options.value value值
 * @param {string} options.getKey 匹配value成功后，要获取的key值
 * @param {string} options.flag 获取单个属性值true | 获取整条数据false，默认true
 * @returns 匹配value值的item[getKey] || item项，当value为数组时，返回数组
 */
export const getSelectedItems = function <T>(data: Array<{ [key: string]: any }>, options: IOptions): any[] | any {
	const { valueKey = 'value', value, getKey = 'label', flag = true } = options
	const type = typeof value
	const isArray = value instanceof Array
	if (!['string', 'number'].includes(type) || (type === 'object' && !isArray))
		throw new Error(`value类型错误：期望得到“string | number | (string | number)[]”类型，但得到了${type}类型`)
	const valueMap = new Map()
	data.forEach(item => valueMap.set(item[valueKey], flag ? item[getKey] : item))
	if (!isArray) return valueMap.get(value)
	const arr: Array<T[keyof T]> = []
	value.forEach(v => arr.push(valueMap.get(v)))
	return arr
}
