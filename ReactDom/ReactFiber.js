import { HostRoot, HostComponent } from "./ReactWorkTag";

import { NoFlags } from './ReactFiberFlags'

export const createHostRootFiber = () => {
  return createFiber(HostRoot);
}

/**
 * 创建fiber节点
 */
function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}

export function createFiberFromElement(element) {
  const { key, type, props } = element;
  let tag
  if(typeof type === 'string') {
    tag = HostComponent
  }
  const fiber = new FiberNode(tag, props, key);
  fiber.type = type;
  return fiber;
}

export function createWorkInProgress (current, pendingProps) {
  let workInProgress = current.alternate;
  // 当workInProgress不存在时，说明是第一次挂载.否者就是更新
  if(!workInProgress) {
    workInProgress = createFiber(current.tag, pendingProps, current.key);
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    
    // workInProgress 和 current 通过alternate指针可以进行相互访问
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  }else {
    // 更新操作 将更新队列加入pendingProps
    workInProgress.pendingProps = pendingProps
  }

  // 副作用
  workInProgress.flags = NoFlags;
  // 子节点
  workInProgress.child = null;
  // 兄弟节点
  workInProgress.sibling = null;

  // 更新队列
  workInProgress.updateQueue = current.updateQueue;
  // 用于beginWork阶段收集副作用链,当初始化为null
  workInProgress.firstEffect = null;
  workInProgress.lastEffect = null;
  workInProgress.nextEffect = null

  return workInProgress
}

class FiberNode {
  constructor(tag, pendingProps, key) {
    this.tag = tag;
    this.pendingProps = pendingProps;
    this.key = key;
  }
}
