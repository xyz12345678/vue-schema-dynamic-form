import {assign} from './utils'

export const SCHEMA_TYPES = Object.freeze({
    ARRAY: 'array',
    BOOLEAN: 'boolean',
    INTEGER: 'integer',
    NUMBER: 'number',
    OBJECT: 'object',
    STRING: 'string'
  })
  
  export const INPUT_TYPES = Object.freeze({
    CHECKBOX: 'checkbox',
    EMAIL: 'email',
    HIDDEN: 'hidden',
    NUMBER: 'number',
    RADIO: 'radio',
    SELECT: 'select',
    SWITCH: 'switch',
    TEXT: 'text',
    TEXTAREA: 'textarea',
    URL: 'url'
  })

  export const NUMBER_TYPES = Object.freeze([
    SCHEMA_TYPES.INTEGER,
    SCHEMA_TYPES.NUMBER
  ])

export function parseDefaultObjectValue (schema, fields, value) {
    const data = schema.type === SCHEMA_TYPES.OBJECT ? {} : []
  
    if (value) {
      assign(data, value)
    }
  
    // fields.forEach((field) => {
    //   const { type, name } = field.attrs
    //   const itemValue = field.schemaType === SCHEMA_TYPES.BOOLEAN
    //     ? typeof data[name] === 'boolean'
    //       ? data[name]
    //       : field.attrs.checked === true
    //     : typeof data[name] !== 'undefined'
    //       ? data[name]
    //       : field.attrs.value
  
    //   const target = {}
    //   const eventInput = { field, data: itemValue, target }
  
    //   switch (field.schemaType) {
    //     case SCHEMA_TYPES.BOOLEAN:
    //       target.checked = itemValue
    //       data[name] = parseEventValue(eventInput)
    //       break
  
    //     default:
    //       if (field.isArrayField) {
    //         if (data[name] instanceof Array) {
    //           data[name] = data[name].filter((value) => {
    //             return value !== undefined
    //           })
    //         } else {
    //           data[name] = []
    //         }
  
    //         field.itemsNum = type === INPUT_TYPES.CHECKBOX
    //           ? field.items.length
    //           : field.minItems
    //       } else {
    //         data[name] = parseEventValue(eventInput)
    //       }
    //       break
    //   }
    // })
  
    return data
  }

  export function parseDefaultScalarValue (schema, fields, value) {
    if (typeof value !== 'undefined' && isScalar(value)) {
      return value
    }
  
    if (fields.length) {
      if (fields[0].schemaType === SCHEMA_TYPES.BOOLEAN) {
        return fields[0].attrs.checked === true
      }
  
      if (fields[0].attrs.hasOwnProperty('value')) {
        return fields[0].attrs.value
      }
    }
  
    return undefined
  }

// 加载表单表单项
  export function loadFields (schema, fields, name = null, model = null) {
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
        // fields.push(parseBoolean(schema, name, model))
        break
  
      case SCHEMA_TYPES.ARRAY:
        // fields.push(parseArray(schema, name, model))
        break
  
      case SCHEMA_TYPES.INTEGER:
      case SCHEMA_TYPES.NUMBER:
      case SCHEMA_TYPES.STRING:
        // for (let keyword of ARRAY_KEYWORDS) {
        //   if (schema.hasOwnProperty(keyword)) {
        //     schema.items = {
        //       type: schema.type,
        //       enum: schema[keyword]
        //     }
  
        //     fields.push(parseArray(schema, name, model))
        //     return
        //   }
        // }
        fields.push(parseString(schema, name, model))
        break
    }
  }

// fiels  结构重置
  export function setCommonFields (schema, field, model = null) {
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
    // field.attrs.id = field.attrs.id || genId(field.attrs.name)
    field.attrs.required = schema.required || false
    field.attrs.disabled = schema.disabled || false
  }

// string类型变单项 结构初始化
export function parseString (schema, name = null, model = null) {
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