import { createForm, onFieldMount, onFieldValueChange, onFormInit, onFormReact } from "@formily/core";
import { Field, createSchemaField } from "@formily/react";
import 'antd/dist/antd.css'
import { Form, FormItem, Input, NumberPicker } from '@formily/antd'
import NewDrawPicture from './canvasNew'
import { useEffect } from "react";

// 联动协议：主动联动、被动联动、effects联动
//  effects联动
const form = createForm({
  effects() {//effects 副作用逻辑，用于实现各种联动逻辑
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
    }
  }
}
function App() {
  // 初始化
  useEffect(() => {
    const drawPicture = new NewDrawPicture('livePlanCanvas', '2023-03', { time: '2022-03-03' })
    drawPicture.init();
  }, [])
  // 画图
  const handleCanvas = (): void => {
    const yearMonthDate = '2023-03'
    const canvas: any = document.getElementById('livePlanCanvas');
    if (canvas) {
      const SAVE_LINK: any = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
      SAVE_LINK.href = canvas.toDataURL('image/png');
      SAVE_LINK.download = `YW${new Date(yearMonthDate).getMonth() + 1}月排班`;
      const event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      SAVE_LINK.dispatchEvent(event);
    }
  };
  return (
    <div>
    <button onClick={handleCanvas}>导出canvas</button>
      <Form form={form} labelCol={6} wrapperCol={5}>
        <SchemaField
          schema={schema}
        />
      </Form>
      <canvas id="livePlanCanvas" width="750" />
    </div>
  )
}
export default App;