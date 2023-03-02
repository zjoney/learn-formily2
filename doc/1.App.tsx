import React, { useMemo, useState } from "react";
import { createForm, onFormInit, onFormReact } from "@formily/core";

export default function () {
  const [state, setState] = useState('未设置')
  const form = useMemo(() => {
    return createForm({
      effects() {
        onFormInit(() => {
          setState('初始化')
        })
        onFormReact((form) => {
          if (form.values.example === 'hello') {
            setState('hello')
          }
        })
      }
    })
  }, [])
  return (
    <div>
      <p>{state}</p>
      <button onClick={() => form.setValuesIn('example', 'hello')}>hello</button>
    </div>
  )
}