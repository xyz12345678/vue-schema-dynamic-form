
import FormSchemaField from './fields/index.js'
import {parseDefaultObjectValue,loadFields} from '../lib/parser'

import {equals,clone,clear,isEmpty,assign,genId} from '../lib/utils'
export default {
    data: () => ({
        ref: genId('form-schema'),
        data: {}, //表单数据
        loadedSchema:{}, //schemajson数据
        fields:[], //用于存储表单项
        rules: {
            firstName: [
                { required: true, message: '请输入活动名称', trigger: 'blur' }
            ],
            lastName: [
                { required: true, message: '请输入活动名称', trigger: 'blur' }
            ],
            bio: [
                { required: true, message: '请输入活动名称', trigger: 'blur' }
            ]
        }
    }),
    props: {
        /**
         * The JSON Schema object.
         * @default {}
         */
        schema: { type: Object, default: () => ({}) },
        /**
         * @model
         * @default undefined
         */
        value: {
            type: [ Number, String, Array, Object, Boolean ],
            default: undefined
        },
        /**
         * 提交表单的方法
         */
        method: { type: String, default: 'post' },

    },
   
    render: function (createElement) {
        var self = this;
        const nodes = []
        const { title, description,submit } = this.loadedSchema;

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
           
        if (this.fields) {
            const formItemNodes = this.fields.map((field) => {
                const value =  field.attrs?this.data[field.attrs.name]:"";
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
                        },
                        change: (parsedValue) => {
                            this.data[field.attrs.name] = parsedValue
                            this.emitChangeEvent();      
                        }
                    }
                })

            });
            nodes.push(createElement('el-form',{
                
                ref:self.ref,
                rule:self.rules,
                props:{
                    model:self.data,
                    
                    'label-width':"140px",
                    'inline':"true",
                }
            },formItemNodes));

        }else {
            nodes.push(createElement('p', 'No items found. '));
        }

        // 提交按钮
        if (submit) {
            nodes.push(createElement('el-button',{
                style:{
                    'text-align':'center',
                    'margin-left':'30%'
                },
                attrs:submit.attrs,
                on:{
                    click: () => {
                        this.submit();
                    }
                }
            }, submit.title))
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
        /**
         * 触发选项值改变
         */
        emitChangeEvent () {
            this.$emit('change', this.data)
        },
        /**
         * 表单验证
         */
        checkValidity(){
            
            this.$refs[this.ref].validate((valid) => {
                if (valid) {
                  alert('submit!');
                  return true;
                } else {
                  alert.log('error submit!!');
                  return false;
                }
            });
        },
        /**
         * 表单提交
         */
        submit (event) {
            this.$emit('invalid', e);
            if (this.checkValidity()) {
              /**
               * Fired when a form is submitted
               */
              this.$emit('submit', event)
            }
          },
    },
    created () {
        if (!isEmpty(this.schema)) {
            this.load(this.schema, this.value, false)
        }
    },
    watch:{
        //输入值改变后执行的方法
        schema:function(){
            if (!isEmpty(this.schema)) {
                this.load(this.schema, this.value, false)
            }
        }
            

        
    }
}
