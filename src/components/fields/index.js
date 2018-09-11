
import numberField from "./numberField";
import inputField from "./inputField"
import checkboxField from "./checkboxField"
import checkboxgroupField from "./checkboxgroupField"
import selectField from "./selectField"
import { SCHEMA_TYPES, INPUT_TYPES } from '../../lib/parser'



export default  {
  functional: true,
  render: function (createElement, context) {
    function appropriateListComponent () {
        var field = context.props.schemaField
        switch (field.attrs.type) {
            case INPUT_TYPES.TEXTAREA:
                break
            case INPUT_TYPES.RADIO:
            
                break
            case INPUT_TYPES.SWITCH:
                break
            case INPUT_TYPES.CHECKBOX:
                //分为 checkbox  和 checkboxgroup
                if(field.hasOwnProperty('items')){
                    return checkboxgroupField
                }else{
                    return checkboxField
                }
                break
            case INPUT_TYPES.SELECT:
                return selectField
                break
            default:
                if(field.schemaType === 'integer')   return numberField
                if (field.schemaType === 'string')   return inputField
                break;
        }
    }
    return createElement(
        appropriateListComponent(),
        context.data,
        context.children
    )
  },
  props: {
    schemaField: {
      type: Object,
      required: true
    },
    fieldName:String
  },
  methods:{

  }
};