import { createForm, onFormInit, onFormReact } from "@formily/core";
import { Field, createSchemaField } from "@formily/react";
import 'antd/dist/antd.css'
import { Form, FormItem, Input, NumberPicker } from '@formily/antd'

// 第二种 schema写法
const form = createForm()
const SchemaField = createSchemaField({
  components: {
    FormItem, Input, NumberPicker
  }
});
const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '姓名',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    age: {
      type: 'number',
      title: '年龄',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker'
    },
    email: {
      type: 'string',
      title: '邮箱',
      required: true,
      'x-validator': 'email',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
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