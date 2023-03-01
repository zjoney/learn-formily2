import { FormPath } from '@formily/core'

const target = {array: []}
// 占路径
FormPath.setIn(target, 'a.b.c', 'dotValue')
console.log(FormPath.getIn(target, 'a.b.c'))

// 下标
FormPath.setIn(target, 'array.0.d', 'dValue')
console.log(FormPath.getIn(target, 'array.0.d'))

// 解构在前后端数据不一致情况下最方便
FormPath.setIn(target, 'parent,[f, g]', '[1, 2]')

console.log(target)

