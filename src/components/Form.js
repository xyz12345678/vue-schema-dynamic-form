
import FormSchemaField from './fields/index.js'
import {parseDefaultScalarValue,parseDefaultObjectValue,loadFields} from '../lib/parser'

import {clone,clear,isEmpty,assign} from '../lib/utils'
export default {
    data: () => ({
        data: {}, //表单数据
        loadedSchema:{}, //schemajson数据
        fields:[], //用于存储表单项
    }),
    props: {
        /**
         * The JSON Schema object.
         *
         * @default {}
         */
        schema: { type: Object, default: () => ({}) },
        /**
         * Use this directive to create two-way data bindings with the
         * component. It automatically picks the correct way to update the
         * element based on the input type.
         *
         * @model
         * @default undefined
         */
        value: {
            type: [ Number, String, Array, Object, Boolean ],
            default: undefined
        },
        /**
         * The HTTP method that the browser uses to submit the form.
         *
         */
        method: { type: String, default: 'post' },

    },
   
    render: function (createElement) {
        var self = this;
        const nodes = []
        const { title, description } = this.loadedSchema;

        if (title) {
            nodes.push(createElement('h2', {
                style:{
                    'text-align':'center'
                }
            },title))
        }
    
        if (description) {
            nodes.push(createElement('h4',{
                style:{
                    'text-align':'center'
                }
            }, description))
        }
    
        // if (this.schema.error) {
        //     nodes.push(createElement(components.$.error.component, this.error))
        // }
        
        if (this.fields) {
            const formItemNodes = this.fields.map((field) => {
                const value =  this.data[field.attrs.name];
                return createElement(FormSchemaField, {
                    field,
                    props: {
                        schemaField: field,
                        fieldName:field.attrs.name,
                        value:value
                    },
                    on:{
                        input: (parsedValue) => {
                            this.data[field.attrs.name] = parsedValue
                            console.log(parsedValue)
                            this.emitInputEvent();
                        }
                    }
                })

            });
            nodes.push(createElement('el-form',{
                props:{
                    'label-width':"140px",
                    'inline':"true"
                }
            },formItemNodes));

        }else {
            nodes.push(createElement('p', 'No items found. '));
        }
        return createElement('div',nodes);
    },
    methods: {
        load (schema, model = this.value, reset = true) {
            this.fields.splice(0);

            clear(this.loadedSchema);

            assign(this.loadedSchema, schema)

            loadFields(this.loadedSchema, this.fields, null, model);

            this.data = parseDefaultObjectValue(schema, this.fields, model)
        },
        /**
         * 触发表单值改变
         */
        emitInputEvent () {
            this.$emit('input', this.data)
        },
    },
    created () {
        if (!isEmpty(this.schema)) {
            this.load(this.schema, this.value, false)
        }
    },
    wacth:{

        schema:function(){
            if (!isEmpty(this.schema)) {
                this.load(this.schema, this.value, false)
            }
        }
            

        
    }
}
