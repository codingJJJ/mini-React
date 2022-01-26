import { REACT_ELEMENT_TYPE } from "../React/createElement";
import { createFiberFromElement } from "./ReactFiber";
import { Placement, Deletion } from "./ReactFiberFlags";

function childReconciler(shouldTrackSideEffects) {
  function placeSingleChild(newFiber) {
    // 当需要跟踪副作用且新的fiber节点没有alternate时,说明是新节点则追加flags为Placement
    if (shouldTrackSideEffects && !newFiber.alternate) {
      newFiber.flags = Placement;
    }
    return newFiber;
  }

  function useFiber (oldFiber, pendingProps) {
    // console.log(oldFiber, pendingProps);
  }

  function reconcileSingleElement(returnFiber, currentFirstChild, element) {
    const key = element.key;
    let child = currentFirstChild;

    // 通过循环遍历去寻找所有的子fiber节点，匹配当前的key
    while (child) {
      if (child.key === key) {
        // 先判断新老fiber的key是否相同
        // 判断老fiber的type和新的虚拟Dom的type是否相同
        if (child.type == element.type) {
          // 如果type也相同那么可以直接复用节点
          // 先删除剩下的fiber节点
          deleteRemainingChildren(returnFiber, child.sibling);
          const existing = useFiber(child, element.props);
          existing.return = returnFiber;
          return existing;
        } else {
          deleteRemainingChildren(returnFiber, child);
          break;
        }
      } else {
        // 若匹配上了key type不同，同样删除后续的老fiber
        deleteChild(returnFiber, child);
      }
      // 没有匹配到key，则继续向下寻找
      child = child.sibling;
    }

    // 若上面的while一直都没找到key，说明该fiber属于新fiber，则创建该fiber
    const create = createFiberFromElement(element);
    create.return = returnFiber;
    return create;
  }

  function deleteRemainingChildren(returnFiber, childToDelete) {
    let child = childToDelete;
    while (child) {
      deleteChild(returnFiber, child);
      child = child.sibling;
    }
  }

  function deleteChild() {
    // 如果不需要跟着副作用， 说明是挂载，则直接返回
    if (!shouldTrackSideEffects) return;
    const lastEffect = returnFiber.lastEffect;
    if (lastEffect) {
      // 当副作用链存在时, 直接向lastEffect追加副作用
      lastEffect.nextEffect = childToDelete;
      returnFiber.lastEffect = childToDelete;
    } else {
      // 当副作用不存在时, 需要向fiberFiber和lastEffect添加副作用链
      returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
    }
    // 清空下一个副作用指向
    childToDelete.nextEffect = null;
    childToDelete.flags = Deletion;
  }

  function reconcileChildFiber(returnFiber, currentFirstChild, newChild) {
    // 判断newChild是否是一个对象
    const isObject = typeof newChild === "object" && newChild;

    if (isObject) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFirstChild, newChild)
          );
      }
    }

    if (Array.isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstChild, newChild);
    }

    // console.log(returnFiber, currentFirstChild, newChild);
  }
  return reconcileChildFiber;
}

export const reconcileChildFiber = childReconciler(true);

export const mountChildFiber = childReconciler(false);
