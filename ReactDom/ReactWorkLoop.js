import { HostComponent, HostRoot } from './ReactWorkTag'
import { createWorkInProgress } from './ReactFiber';
import { reconcileChildFiber, mountChildFiber } from './ReconcileChildFiber';
import ReactCompleteWork from './ReactFiberCompleteWork';

//当前正在更新的根
let workInProgressRoot = null;
//当前正在更新fiber节点
let workInProgress = null;

export function scheduleUpdateOnFiber (fiber) {
  const fiberRoot = markUpdateLaneFromFiberToRoot(fiber);
  performSyncWorkOnRoot(fiberRoot);
}

/**
 * 找到最顶级的fiber节点，最顶级的fiber节点没有parent指针
 */
function markUpdateLaneFromFiberToRoot (sourceFiber) {
  let node = sourceFiber;
  let parent = node.return;
  while(parent) {
    node = parent;
    parent = node.parent
  }
  return node.stateNode
}

function performSyncWorkOnRoot (fiberRoot) {
  workInProgressRoot = fiberRoot;
  workInProgress = createWorkInProgress(workInProgressRoot.current)

  workLoopSync(); // 执行工作循环
  // commitRoot()  // 提交修改的DOM
}

function workLoopSync () {

  while (workInProgress) {
    performUnitOfWork(workInProgress);
  }
}

/**
 * 执行WorkInProgress工作单元
 */
function performUnitOfWork (unitOfWork) {
  const current = unitOfWork.alternate;
  let next = beginWork(current, unitOfWork);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  // 这里通过beginWork返回了当前unitWork节点的子fiber节点
  // 当子Fiber存在时, 将该子fiber移交workInProgress，继续执行workLoopSync
  if(next) {
    workInProgress = next
  }else {
    completeUnitOfWork(unitOfWork);
  }
}


function completeUnitOfWork (unitOfWork) {
  let completeWork = unitOfWork;
  do {

    const current = completeWork.alternate;
    const returnFiber = completeWork.return;
    ReactCompleteWork(current, completeWork);
    collectEffectList(returnFiber, completeWork)
    const siblingFiber = completeWork.sibling;
    if(siblingFiber) {
      workInProgress = siblingFiber;
      return
    }
    completeWork = returnFiber;
    workInProgress = completeWork
  } while (workInProgress)
}

// 更新currentFiber
function beginWork(current, workInProgress) {
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress);
    case HostComponent:
      return updateHostComponent(current, workInProgress);
    default:
      break
  }
}

function updateHostRoot (current, workInProgress) {
  const updateQueue = workInProgress.updateQueue;
  const nextChildren = updateQueue.shared.pending.payload.element;
  reconcileChildren(current, workInProgress, nextChildren);
  // 将子fiber返回
  return workInProgress.child
}

function updateHostComponent (current, workInProgress) {
  
}



function reconcileChildren (current, workInProgress, nextChildren){

  // 如果current存在,则表示为更新，current不存在时候，为挂载
  if(current) {
    workInProgress.child = reconcileChildFiber(workInProgress, current.child, nextChildren)
  }else {
    workInProgress.child = mountChildFiber(workInProgress, null, nextChildren)
  }
}