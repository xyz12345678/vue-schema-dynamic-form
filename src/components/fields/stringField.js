export default {
    functional: true,
    render: function (createElement,context) {

        return createElement('el-form-item',{
            attrs: {
                label: context.props.schemaField['label']
            },
           
        },[
            createElement('el-input',{
                attrs:context.props.schemaField['attrs'],
                // 组件 props
                props: {
                    value:context.props.value,
                },
                // domProps:{
                //     value:self.myValue
                // },
                // on:{
                //     input:function (value) {
                //         self.myValue =value
                //         self.$emit('inputChange', value)
                //     }
                // },
                on:context.listeners
            })
        ])
    },
    // props:[
    //     {
    //     'value':data.props.fieldName
    //     }
    // ],
    computed:{
        // myValue:function () {
        //     return this.value
        // }
    },
}