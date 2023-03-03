import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/react'
import 'antd/dist/antd.css'
import { Form, FormItem, Input, NumberPicker } from '@formily/antd'
const form = createForm()
// 第三种 Markup写法
const SchemaField = createSchemaField({
  components: {
    Input,
    FormItem,
    NumberPicker
  },
})

function App() {
  return (
    <Form form={form} labelCol={6} wrapperCol={10}>
      <SchemaField>
        <SchemaField.String
          name="name"
          title="姓名"
          required
          x-component="Input"//字段 UI 组件属性
          x-decorator="FormItem"//字段 UI 包装器组件
        />
        <SchemaField.Number
          name="age"
          title="年龄"
          maximum={120}
          x-component="NumberPicker"//字段 UI 组件属性
          x-decorator="FormItem"//字段 UI 包装器组件
        />
      </SchemaField>
    </Form>
  )
}
export default App;