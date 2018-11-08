//数字输入框组件
export default {
    functional: true,
    render: function (createElement,context) {
        
        return createElement('el-form-item',{
            attrs: {
                label: context.props.schemaField['label']
            },
        },[
            createElement('el-input-number',{
                attrs:context.props.schemaField['attrs'],
                // 组件 props
                min:context.props.schemaField['attrs'].min,
                max:context.props.schemaField['attrs'].max,
                props: {
                    value:context.props.value,
                    
                },
                on:context.listeners
            })
        ])
    },
    computed:{

    },
}