// import ArrayField from "./ArrayField";
// import BooleanField from "./BooleanField";
// import DescriptionField from "./DescriptionField";
import numberField from "./numberField";
// import ObjectField from "./ObjectField";
// import SchemaField from "./SchemaField";
import StringField from "./StringField";
import titleField from "./titleField";
// import UnsupportedField from "./UnsupportedField";


var EmptyList = { /* ... */ }
var TableList = { /* ... */ }
var OrderedList = { /* ... */ }
var UnorderedList = { /* ... */ }
export default  {
  functional: true,
  render: function (createElement, context) {
    function appropriateListComponent () {
      var items = context.props.schemaField
      if (items.schemaType === 'string')         return StringField
    }
    return createElement(
        appropriateListComponent(),
    //   {
    //     props: {
    //         value:context.props.schemaField.default||"",
    //         schema:context.props.schemaField,
    //         fieldName:context.props.fieldName
    //     },
    //     on:{
    //         inputChange:function (value) {
    //             context.$emit('input', value)
    //         }
    //     },
    //   }
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