import { assign } from './utils'

const ARRAY_KEYWORDS = ['anyOf', 'oneOf', 'enum'];//数组选项3种类型

//schema 数据类型 
export const SCHEMA_TYPES = Object.freeze({
    ARRAY: 'array',
    BOOLEAN: 'boolean',
    INTEGER: 'integer',
    NUMBER: 'number',
    OBJECT: 'object',
    STRING: 'string'
})

//表单组件类型
export const INPUT_TYPES = Object.freeze({
    CHECKBOX: 'checkbox',
    EMAIL: 'email',  //这个工单里暂时没用到（一般都是域账号不用邮箱），先不做
    HIDDEN: 'hidden',
    NUMBER: 'number',
    RADIO: 'radio',
    SELECT: 'select',
    SWITCH: 'switch',
    TEXT: 'text',
    TEXTAREA: 'textarea',
    URL: 'url' //对应域名
})

export const NUMBER_TYPES = Object.freeze([
    SCHEMA_TYPES.INTEGER,
    SCHEMA_TYPES.NUMBER
])

//标准格式化 数组item
export function parseItems(items) {
    return items.map((item) => {
        if (typeof item !== 'object') {
            return { value: item, label: item }
        }

        return item
    })
}
//设置数组item
export const setItemName = (name, isRadio = false) => (item, i) => {
    if (isRadio) {
        item.name = name
    } else {
        let label = item.label;
        item.label = item.value;
        item.value = label;
    }

    if (!item.name) {
        item.name = name ? `${name}-` : ''
        item.name += item.label.replace(/\s+/g, '-')
    }

    if (name) {
        item.ref = `${name}-${i}`
    }

    return item
}

//多选设置默认值
export function arrayOrderedValues(field) {
    return field.items.map((item) => item.checked ? item.value : undefined)
}
//
export function arrayUnorderedValues(field) {
    return field.items
        .filter((item) => (item.checked || item.selected))
        .map((item) => item.value)
}
//单选 设置默认值
export function singleValue(field) {
    const item = field.items.reverse().find((item) => item.checked || item.selected)

    return item ? item.value : ''
}

//格式化默认值
export function parseEventValue({ target, field, data }) {
    switch (field.schemaType) {
        case SCHEMA_TYPES.BOOLEAN:
            return target.checked === true

        case SCHEMA_TYPES.STRING:
            return data || ''

        case SCHEMA_TYPES.NUMBER:
        case SCHEMA_TYPES.INTEGER:
            if (data !== undefined) {
                return Number(data)
            }
            break

        case SCHEMA_TYPES.ARRAY:
            return data || []

        case SCHEMA_TYPES.OBJECT:
            return data || {}
    }

    return data
}

//获取表单数据结构和表单默认值 
export function parseDefaultObjectValue(schema, fields, value) {
    const data = schema.type === SCHEMA_TYPES.OBJECT ? {} : []

    if (value) {
        assign(data, value)
    }

    fields.forEach((field) => {
        const { type, name } = field.attrs
        const itemValue = field.schemaType === SCHEMA_TYPES.BOOLEAN
            ? typeof data[name] === 'boolean'
                ? data[name]
                : field.attrs.checked === true
            : typeof data[name] !== 'undefined'
                ? data[name]
                : field.attrs.value

        const target = {}
        const eventInput = { field, data: itemValue, target }

        switch (field.schemaType) {
            case SCHEMA_TYPES.BOOLEAN:
                target.checked = itemValue
                data[name] = parseEventValue(eventInput)
                break

            default:
                if (field.isArrayField) {
                    if (data[name] instanceof Array) {
                        data[name] = data[name].filter((value) => {
                            return value !== undefined
                        })
                    } else {
                        data[name] = []
                    }

                    field.itemsNum = type === INPUT_TYPES.CHECKBOX
                        ? field.items.length
                        : field.minItems
                } else {
                    data[name] = parseEventValue(eventInput)
                }
                break
        }
    })

    return data
}


// 加载表单表单项
export function loadFields(schema, fields, name = null, model = null) {
    switch (schema.type) {
        case SCHEMA_TYPES.OBJECT:
            if (schema.required instanceof Array) {
                schema.required.forEach((field) => {
                    schema.properties[field].required = true
                })
            }

            const allProperties = Object.keys(schema.properties)
            const properties = schema.order instanceof Array
                ? schema.order
                : allProperties

            if (properties.length < allProperties.length) {
                allProperties.forEach((prop) => {
                    if (!properties.includes(prop)) {
                        properties.push(prop)
                    }
                })
            }

            if (model === null) {
                model = {}
            }

            properties.forEach((key) => {
                loadFields(schema.properties[key], fields, key, model[key] || null)
            })
            break

        case SCHEMA_TYPES.BOOLEAN:
            fields.push(parseBoolean(schema, name, model))
            break

        case SCHEMA_TYPES.ARRAY:
            fields.push(parseArray(schema, name, model))
            break

        case SCHEMA_TYPES.INTEGER:
        case SCHEMA_TYPES.NUMBER:
        case SCHEMA_TYPES.STRING:
            fields.push(parseString(schema, name, model))
            break
    }
}


// fiels公用结构重置 
export function setCommonFields(schema, field, model = null) {
    if (model !== null) {
        field.attrs.value = model
    } else if (field.attrs.hasOwnProperty('value')) {
        field.attrs.value = field.attrs.value
    } else {
        field.attrs.value = schema.default
    }

    field.order = schema.order
    field.schemaType = schema.type
    field.label = schema.title || ''
    field.description = schema.description || ''
    field.attrs.required = schema.required || false
    field.attrs.disabled = schema.disabled || false
}

//  boolean 类型结构处理
export function parseBoolean(schema, name = null, model = null) {
    const field = {
        attrs: schema.attrs || {}
    }

    if (name) {
        field.attrs.name = name
    }

    setCommonFields(schema, field, model)

    if (!field.attrs.type) {
        field.attrs.type = INPUT_TYPES.CHECKBOX
    }

    if (!field.attrs.hasOwnProperty('checked')) {
        field.attrs.checked = schema.default === true
    }

    delete field.attrs.value

    return field
}
// string类型表单项 结构初始化
export function parseString(schema, name = null, model = null) {
    const field = {
        attrs: schema.attrs || {}
    }

    if (schema.pattern) {
        field.attrs.pattern = schema.pattern
    }

    if (schema.format) {
        switch (schema.format) {
            case 'email':
                if (!field.attrs.type) {
                    field.attrs.type = INPUT_TYPES.EMAIL
                }
                break

            case 'uri':
                if (!field.attrs.type) {
                    field.attrs.type = INPUT_TYPES.URL
                }
                break
        }
    }

    if (!field.attrs.type) {
        field.attrs.type = NUMBER_TYPES.includes(schema.type)
            ? INPUT_TYPES.NUMBER
            : INPUT_TYPES.TEXT
    }

    if (name) {
        field.attrs.name = name
    }

    setCommonFields(schema, field, model)

    if (schema.minLength) {
        field.attrs.minlength = schema.minLength
    }

    if (schema.maxLength) {
        field.attrs.maxlength = schema.maxLength
    }

    return field
}

//array类型表单项 结构初始化
export function parseArray(schema, name = null, model = null) {
    const field = {
        attrs: schema.attrs || {}
    }

    if (name) {
        field.attrs.name = name
    }

    setCommonFields(schema, field, model)

    field.items = []
    field.minItems = parseInt(schema.minItems) || 1
    field.maxItems = parseInt(schema.maxItems) || 1000

    loop:
    for (let keyword of ARRAY_KEYWORDS) {
        if (schema.hasOwnProperty(keyword)) {
            switch (keyword) {
                case 'enum':
                    if (!field.attrs.type) {
                        field.attrs.type = INPUT_TYPES.SELECT
                    }

                    field.items = parseItems(schema[keyword])

                    if (field.attrs.value === void (0) || field.attrs.value.length === 0) {
                        field.attrs.value = field.schemaType === 'array'
                            ? arrayUnorderedValues(field)
                            : singleValue(field)
                    }
                    break loop

                case 'oneOf':
                    field.attrs.type = INPUT_TYPES.RADIO
                    field.attrs.value = field.attrs.value || ''


                    field.items = parseItems(schema[keyword]).map(setItemName(name, true))

                    if (field.attrs.value === void (0) || field.attrs.value.length === 0) {
                        field.attrs.value = singleValue(field)
                    }
                    break loop

                case 'anyOf':
                    field.attrs.type = INPUT_TYPES.CHECKBOX
                    field.attrs.value = field.attrs.value || []
                    //对于checkbox  item  的 label和value需要互换一下 应为element checkboxgroup 组件的参数是反的
                    field.items = parseItems(schema[keyword]).map(setItemName(name))
                    field.isArrayField = true

                    if (field.attrs.value === void (0) || field.attrs.value.length === 0) {
                        field.attrs.value = arrayOrderedValues(field)
                    }
                    break loop
            }
        } else if (field.attrs.type === INPUT_TYPES.SELECT) {
            field.attrs.multiple = field.schemaType === SCHEMA_TYPES.ARRAY
            field.attrs.value = field.attrs.value || field.attrs.multiple ? [] : ''
            field.items = schema.items;
            if (field.attrs.value === void (0) || field.attrs.value.length === 0) {
                if (field.attrs.multiple) {
                    field.isArrayField = true
                    field.attrs.value = arrayUnorderedValues(field)
                } else {
                    field.attrs.value = singleValue(field)
                }
            }
        }
    }

    return field
}

