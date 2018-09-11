// 下拉框组件
export default {
    functional: true,
    render: function (createElement,context) {
        var items = context.props.schemaField.items;
        var checkboxItems = items.map((item) => {
            return createElement('el-option', {
                props: {
                    label:item.label,
                    key:item.label,
                    value:item.value
                },
            },item.label)

        });
        return createElement('el-form-item',{
            attrs: {
                label: context.props.schemaField['label']
            },
           
        },[
            createElement('el-select',{
                attrs:context.props.schemaField['attrs'],
                multiple:true,
                // 组件 props
                props: {
                    multiple:true,
                    value:context.props.value,
                },
                on:context.listeners
            },checkboxItems)
        ])
    },
    computed:{

    },
}