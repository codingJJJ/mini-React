import { createUpdate, enqueueUpdate } from './ReactUpdateQueue'
import { scheduleUpdateOnFiber } from './ReactWorkLoop'
import { reconcileChildFiber } from './ReconcileChildFiber'

export function updateContainer (element, container) {
  const current = container.current;
  const update = createUpdate();
  update.payload = { element };
  // 添加更新队列
  enqueueUpdate(current, update);
  // 更新入口
  scheduleUpdateOnFiber(current);
}

export function reconcileChildren(current, workInProgress, nextChildren) {
  // 如果current存在,则表示为更新，current不存在时候，为挂载
  if (current) {
    workInProgress.child = reconcileChildFiber(
      workInProgress,
      current.child,
      nextChildren
    );
  } else {
    workInProgress.child = mountChildFiber(workInProgress, null, nextChildren);
  }
}