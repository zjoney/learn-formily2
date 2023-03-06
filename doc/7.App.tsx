import React, { useState } from 'react'
import { createForm, onFieldMount, onFieldValueChange, onFieldReact, onFormInit, onFormReact } from "@formily/core";
import { Field, createSchemaField } from "@formily/react";
import 'antd/dist/antd.css'
import { Form, FormItem, Input, NumberPicker } from '@formily/antd'

// 联动协议：主动联动、被动联动、effects联动
//  effects联动
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
      // 'x-reactions': [
      //   {
      //     'dependencies': ['source'],
      //     // 'target': 'target', // 要操作的字段路径
      //     //代表当前字段实例，可以在普通属性表达式中使用，也能在 x-reactions 中使用
      //     'when': "{{$deps[0] == '123'}}", // 联动条件
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
    age: {
      type: 'string',
      title: '年龄',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        'placeholder': '请输入'
      },
    },
    addr: {
      type: 'string',
      title: '地址',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        'placeholder': '请输入'
      },
    }
  }
}
function App() {
  const [response, setResponse] = useState('')
  const form = createForm({
    //effects 副作用逻辑，用于实现各种联动逻辑
    effects(form) {
      // 用于实现字段响应式逻辑的副作用钩子,初始化会执行，同时依赖发生变化会执行
      onFieldReact('age', (field: any) => {
        setResponse('10')
        form.setFieldState(field.query('addr'), () => {
          field.setValue('18')
        })
      })
      onFieldReact('addr', (field: any) => {
        form.setFieldState(field.query('addr'), () => {
          field.setValue('新住址')
          setTimeout(()=>{
            field.setValue('第二遍新住址')
          }, 3000)
        })
      })
      //用于监听某个字段已挂载的副作用钩子
      onFieldMount('target', (field: any) => {
        form.setFieldState(field.query('target'), (targetState) => {
          if (field.value == 123) {
            targetState.visible = true
          } else {
            targetState.visible = false
          }
        })
      })
      //用于监听某个字段值变化的副作用钩子
      onFieldValueChange('source', (field: any) => {
        form.setFieldState(field.query('target'), (targetState) => {
          if (field.value == 123) {
            targetState.visible = true
          } else {
            targetState.visible = false
          }
        })
      })
    }
  })
  return (
    <div>
      <Form form={form} labelCol={6} wrapperCol={5}>
        年龄：{response}
        <SchemaField
          schema={schema}
        />
      </Form>
    </div>
  )
}
export default App;