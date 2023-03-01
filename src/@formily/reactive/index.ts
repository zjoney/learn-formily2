let currentReaction;
const RawReactionsMap = new WeakMap()
export function observable(value) {
  return new Proxy(value, baseHandler);
}
const baseHandler: any = {
  get(target, key) {
    const result = target[key];
    if (currentReaction) { // 当前存在一个响应器
      addRawReactionMap(target, key, currentReaction)
    }
    return result;
  },
  set(target, key, value) {
    target[key] = value;
    RawReactionsMap.get(target)?.get(key)?.forEach(reaction => {
      if (typeof reaction._scheduler === 'function') {
        reaction._scheduler()
      } else {
        reaction()
      }
    });
    return true
  }
}
/**
 * 把此响应器和属性绑定
 * @param target 对象
 * @param key 属性
 * @param reaction 响应器
 */
function addRawReactionMap(target, key, reaction) {
  const reactionsMap = RawReactionsMap.get(target);
  if (reactionsMap) {
    const reactions = reactionsMap.get(key);
    if (reactions) {
      reactions.push(reaction)
    } else {
      reactionsMap.set(key, [reaction])
    }
    return reactionsMap;
  } else {
    const reactionsMap = new Map();
    reactionsMap.set(key, [reaction])
    RawReactionsMap.set(target, reactionsMap)
    return reactionsMap;
  }
}
export function autorun(tracker) {
  // reaction作为响应器，它也是一个函数
  const reaction = () => {
    currentReaction = reaction
    tracker()
    currentReaction = null
  }
  reaction()
}
export class Tracker {
  _scheduler
  constructor(scheduler) { // forceUpdate
    this.track._scheduler = scheduler // 调度更新器
  }
  track: any = (tracker) => {
    currentReaction = this.track;
    const result = tracker()
    currentReaction = null
    return result
  }
}
export default Tracker
