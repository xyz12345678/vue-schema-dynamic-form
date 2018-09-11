// 复选框组件
export default {
    functional: true,
    render: function (createElement,context) {
        var items = context.props.schemaField.items;
        var checkboxItems = items.map((item) => {
            return createElement('el-checkbox', {
                props: {
                    label:item.label,
                    key:item.label,
                },
            },item.label)

        });
        return createElement('el-form-item',{
            attrs: {
                label: context.props.schemaField['label']
            },
           
        },[
            createElement('el-checkbox-group',{
                attrs:context.props.schemaField['attrs'],
                // 组件 props
                props: {
                    value:context.props.value,
                },
                on:context.listeners
            },checkboxItems)
        ])
    },
    computed:{

    },
}