
import { createWorkInProgress } from "./ReactFiber";
import { reconcileChildFiber, mountChildFiber } from "./ReconcileChildFiber";
import ReactCompleteWork from "./ReactFiberCompleteWork";
import { beginWork }  from "./ReactFiberBeginWork"

//当前正在更新的根
let workInProgressRoot = null;
//当前正在更新fiber节点
let workInProgress = null;

export function scheduleUpdateOnFiber(fiber) {
  const fiberRoot = markUpdateLaneFromFiberToRoot(fiber);
  performSyncWorkOnRoot(fiberRoot);
}

/**
 * 找到最顶级的fiber节点，最顶级的fiber节点没有parent指针
 */
function markUpdateLaneFromFiberToRoot(sourceFiber) {
  let node = sourceFiber;
  let parent = node.return;
  while (parent) {
    node = parent;
    parent = node.parent;
  }
  return node.stateNode;
}

function performSyncWorkOnRoot(fiberRoot) {
  workInProgressRoot = fiberRoot;
  workInProgress = createWorkInProgress(workInProgressRoot.current);

  workLoopSync(); // 执行工作循环
  // commitRoot()  // 提交修改的DOM
}

function workLoopSync() {
  while (workInProgress) {
    performUnitOfWork(workInProgress);
  }
}

/**
 * 执行WorkInProgress工作单元
 */
function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;
  let next = beginWork(current, unitOfWork);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  // 这里通过beginWork返回了当前unitWork节点的子fiber节点
  // 当子Fiber存在时, 将该子fiber移交workInProgress，继续执行workLoopSync
  if (next) {
    workInProgress = next;
  } else {
    completeUnitOfWork(unitOfWork);
  }
}

function completeUnitOfWork(unitOfWork) {
  let completeWork = unitOfWork;
  do {
    const current = completeWork.alternate;
    const returnFiber = completeWork.return;
    ReactCompleteWork(current, completeWork);
    collectEffectList(returnFiber, completeWork);
    const siblingFiber = completeWork.sibling;
    if (siblingFiber) {
      workInProgress = siblingFiber;
      return;
    }
    completeWork = returnFiber;
    workInProgress = completeWork;
  } while (workInProgress);
}

/**
 * 收集副用链表并上交给父fiber节点
 * @param {父Fiber} returnFiber
 * @param {工作中的子Fiber} completeWork
 */
function collectEffectList(returnFiber, completeWork) {
  // 当有父节点时，收集副作用
  if (returnFiber) {
    // 如果父亲没有副作用链表头，则将当前的副作用的表头交给父亲
    if (!returnFiber.firstEffect) {
      returnFiber.firstEffect = completeWork.firstEffect;
    }
    // 如果自己有链表尾
    if (completeWork.lastEffect) {
      // 如果父亲也有链表尾
      if (returnFiber.lastEffect) {
        // 将自己的头接入父亲的尾
        returnFiber.lastEffect.nextEffect = completeWork.firstEffect;
      }
      // 处理尾部,确保父fiber节点的lastEffect始终是副作用链表的表尾
      returnFiber.lastEffect = completeWork.lastEffect;
    }
    // flags标识当前fiber是否用副作用
    const flags = completeWork.flags;
    if (flags) {
      // 判断父亲的链表尾是否存在
      if (returnFiber.lastEffect) {
        // 存在则直接上交副作用
        returnFiber.lastEffect.nextEffect = completeWork;
      } else {
        // 不存在则从当前新建副作用头
        returnFiber.firstEffect = completeWork;
      }
      // 处理尾部,确保父fiber节点的lastEffect始终是副作用链表的表尾
      returnFiber.lastEffect = completeWork.lastEffect;
    }
  }
}


