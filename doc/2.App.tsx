import { createForm, onFormInit, onFormReact } from "@formily/core";
import { Field } from "@formily/react";
import 'antd/dist/antd.css'
import { Form, FormItem, Input, NumberPicker } from '@formily/antd'
// 第一种纯JSX
const form = createForm()
function App(){
  return (
    <Form form={form} labelCol={6} wrapperCol={5}>
      <Field
        name='name'
        title='姓名'
        required
        component={[Input, {}]} // 字段数组，第一个参数代表指定组件类型，第二个参数代表指定组件属性
        decorator={[FormItem, {}]}//字段装饰器，第一个参数代表指定组件类型，第二个参数代表指定组件属性 
      />
      <Field
        name='age'
        title='年龄'
        required
        component={[NumberPicker, {}]}
        decorator={[FormItem, {}]}
      />
    </Form>
  )
}
export default App;