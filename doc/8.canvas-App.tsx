import { createForm, onFieldMount, onFieldValueChange, onFormInit, onFormReact } from "@formily/core";
import { Field, createSchemaField } from "@formily/react";
import 'antd/dist/antd.css'
import { Form, FormItem, Input, NumberPicker } from '@formily/antd'
import NewDrawPicture from './canvasNew'
import { useEffect } from "react";

// canvas 前端导出图片
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
      <button
        style={{
          display: 'block',
          margin: '20px'
        }}
        onClick={handleCanvas}>导出canvas</button>
      <canvas id="livePlanCanvas" width="750" />
    </div>
  )
}
export default App;