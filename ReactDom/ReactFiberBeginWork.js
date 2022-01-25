import { HostComponent, HostRoot } from "./ReactWorkTag";
import { reconcileChildren } from './ReactReconciler';

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
  console.log(current, workInProgress);
}