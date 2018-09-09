
const widgetMap = {
    boolean: {
      checkbox: "CheckboxWidget",
      radio: "RadioWidget",
      select: "SelectWidget",
      hidden: "HiddenWidget",
    },
    string: {
      text: "TextWidget",
      password: "PasswordWidget",
      email: "EmailWidget",
      hostname: "TextWidget",
      ipv4: "TextWidget",
      ipv6: "TextWidget",
      uri: "URLWidget",
      "data-url": "FileWidget",
      radio: "RadioWidget",
      select: "SelectWidget",
      textarea: "TextareaWidget",
      hidden: "HiddenWidget",
      date: "DateWidget",
      datetime: "DateTimeWidget",
      "date-time": "DateTimeWidget",
      "alt-date": "AltDateWidget",
      "alt-datetime": "AltDateTimeWidget",
      color: "ColorWidget",
      file: "FileWidget",
    },
    number: {
      text: "TextWidget",
      select: "SelectWidget",
      updown: "UpDownWidget",
      range: "RangeWidget",
      radio: "RadioWidget",
      hidden: "HiddenWidget",
    },
    integer: {
      text: "TextWidget",
      select: "SelectWidget",
      updown: "UpDownWidget",
      range: "RangeWidget",
      radio: "RadioWidget",
      hidden: "HiddenWidget",
    },
    array: {
      select: "SelectWidget",
      checkboxes: "CheckboxesWidget",
      files: "FileWidget",
    },
  };

  export function getDefaultRegistry() {
    return {
      fields: require("../components/fields").default,
    //   widgets: require("../components/widgets").default,
      definitions: {},
      formContext: {},
    };
  }
  
  export function getSchemaType(schema) {
    let { type } = schema;
    if (!type && schema.enum) {
      type = "string";
    }
    return type;
  }

/* 对象相关处理方法  */  
export function clone (object) {
    return merge({}, object)
  }
  
  export function clear (object) {
    for (let key in object) {
      delete object[key]
    }
  }
  
  export function isEmpty (object) {
    for (let key in object) {
      return false
    }
    return true
  }

  export function isScalar (value) {
    if (value === null) {
      return true
    }
    return /string|number|boolean|undefined/.test(typeof value)
  }

  export function merge (dest, src) {
    Object.keys(src).forEach((key) => {
      const value = src[key]
  
      if (isScalar(value)) {
        dest[key] = value
      } else if (value instanceof Array) {
        dest[key] = [ ...value ]
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