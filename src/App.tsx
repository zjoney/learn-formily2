import { createForm, onFormInit, onFormReact } from "@formily/core";
import { Field, createSchemaField } from "@formily/react";
import 'antd/dist/antd.css'
import { Form, FormItem, Input, NumberPicker } from '@formily/antd'

// 第三种schema写法， 推荐
const form = createForm()
const SchemaField = createSchemaField({
  components: {
    FormItem, Input, NumberPicker
  }
});
function App() {
  return (
    <Form form={form} labelCol={6} wrapperCol={5}>
      <SchemaField>
        <SchemaField.String
          name='name'
          title='姓名'
          required
          x-component='Input' // 字段UI组件属性
          x-component-props={{}}
          x-decorator='FormItem' // 字段包装器组件
        />
        <SchemaField.Number
          name='age'
          title='年龄'
          x-component='NumberPicker' // 字段UI组件属性
          x-decorator='FormItem' // 字段包装器组件
        />
        <SchemaField.String
          name='email'
          title='邮箱'
          required
          x-validator={'email'}
          x-component='Input' // 字段UI组件属性
          x-decorator='FormItem' // 字段包装器组件
        />
      </SchemaField>
    </Form>
  )
}
export default App;