// 勾选框组件
export default {
    functional: true,
    render: function (createElement,context) {
        
        return createElement('el-form-item',{
            attrs: {
                label: context.props.schemaField['label']
            },
           
        },[
            createElement('el-checkbox',{
                attrs:context.props.schemaField['attrs'],
                // 组件 props
                props: {
                    checked:context.props.value,
                },
                on:context.listeners
            },context.props.schemaField['label'])
        ])
    },
    computed:{

    },
}