import { observable, autorun } from './@formily/reactive'
// observable是用来创建不同响应式行为的可观察对象
const obs = observable({name: '1'})
//reaction 可订阅的订阅者


/**
 * autorun可以创建自动执行的响应器,
 * 可以接受一个tracker函数，如果函数内有消费者数据，数据发生变化tracker会重新执行
 */
const tracker = ()=>{
  console.log(obs.name)
}
autorun(tracker)
obs.name = '2'
