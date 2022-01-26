import { HostComponent, HostRoot } from "./ReactWorkTag";
import { reconcileChildren } from './ReactReconciler';
import { shouldSetTextContent } from "./ReactDomComponent"

// 更新currentFiber
export function beginWork(current, workInProgress) {
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress);
    case HostComponent:
      return updateHostComponent(current, workInProgress);
    default:
      break;
  }
}

function updateHostRoot(current, workInProgress) {
  const updateQueue = workInProgress.updateQueue;
  const nextChildren = updateQueue.shared.pending.payload.element;
  reconcileChildren(current, workInProgress, nextChildren);
  // 将子fiber返回
  return workInProgress.child;
}

function updateHostComponent(current, workInProgress) {
  const type = workInProgress.type;
  const nextProps = workInProgress.pendingProps;
  let nextChildren = nextProps.children;

  // 优化子接点为原生字符串时
  let isDirectTextChild = shouldSetTextContent(nextProps);
  if(isDirectTextChild) { // 当需要children为单节点字符串时,将nextChildren,让后续不对nextChildren做操作
    nextChildren = null
  }

  reconcileChildren(current, workInProgress, nextChildren);

  // 返回第一个子fiber
  return workInProgress.child

}

