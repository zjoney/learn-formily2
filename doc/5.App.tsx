import { createForm, onFormInit, onFormReact } from "@formily/core";
import { Field, createSchemaField } from "@formily/react";
import 'antd/dist/antd.css'
import { Form, FormItem, Input, NumberPicker } from '@formily/antd'

// 联动协议：主动联动、被动联动、effects联动
//  被动联动
const form = createForm()
const SchemaField = createSchemaField({
  components: {
    FormItem, Input, NumberPicker
  }
});

const schema = {
  type: 'object',
  properties: {
    source: {
      type: 'string',
      title: '来源',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        'placeholder': '请输入source'
      },
      // 'x-reactions': [
      //   {
      //     'target': 'target', // 要操作的字段路径
      //     //代表当前字段实例，可以在普通属性表达式中使用，也能在 x-reactions 中使用
      //     'when': "{{$self.value == '123'}}", // 联动条件
      //     'fulfill': {//满足条件
      //       'state': {//更新状态
      //         visible: true
      //       }
      //     },
      //     'otherwise': {//不满足条件
      //       'state': {//更新状态
      //         visible: false
      //       }
      //     }
      //   }
      // ]
    },
    target: {
      type: 'string',
      title: '目标',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        'placeholder': '请输入'
      },
      'x-reactions': [
        {
          'dependencies': ['source'],
          // 'target': 'target', // 要操作的字段路径
          //代表当前字段实例，可以在普通属性表达式中使用，也能在 x-reactions 中使用
          'when': "{{$deps[0] == '123'}}", // 联动条件
          'fulfill': {//满足条件
            'state': {//更新状态
              visible: true
            }
          },
          'otherwise': {//不满足条件
            'state': {//更新状态
              visible: false
            }
          }
        }
      ]
    }
  }
}
function App() {
  return (
    <Form form={form} labelCol={6} wrapperCol={5}>
      <SchemaField
        schema={schema}
      />
    </Form>
  )
}
export default App;