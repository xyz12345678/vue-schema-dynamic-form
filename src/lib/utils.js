

export function getSchemaType(schema) {
    let { type } = schema;
    if (!type && schema.enum) {
        type = "string";
    }
    return type;
}

/* 对象相关处理方法  */

//克隆对象
export function clone(object) {
    return merge({}, object)
}
//清空对象
export function clear(object) {
    for (let key in object) {
        delete object[key]
    }
}

//是否为空对象
export function isEmpty(object) {
    for (let key in object) {
        return false
    }
    return true
}

// 是否为基本数据类型  （非数组、对象）
export function isScalar(value) {
    if (value === null) {
        return true
    }
    return /string|number|boolean|undefined/.test(typeof value)
}

//合并对象
export function merge(dest, src) {
    Object.keys(src).forEach((key) => {
        const value = src[key]

        if (isScalar(value)) {
            dest[key] = value
        } else if (value instanceof Array) {
            dest[key] = [...value]
        } else if (value instanceof Function) {
            dest[key] = value
        } else {
            if (!dest[key]) {
                dest[key] = {}
            }
            merge(dest[key], value)
        }
    })

    return dest
}
export const assign = merge


export function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
}

//生成一个唯一的id
export function genId(prefix = '') {
    const suffix = s4() + s4()

    if (prefix) {
        return `${prefix}-${suffix}`
    }
    return suffix
}

//比较两个对象是否一致
export function equals(o1, o2) {
    if (isScalar(o1)) {
        return o1 === o2
    }

    const keys1 = Object.keys(o1)

    if (keys1.length !== Object.keys(o2).length) {
        return false
    }

    return keys1.findIndex((key) => !o2.hasOwnProperty(key) || o1[key] !== o2[key]) === -1
}