import { HostComponent } from './ReactWorkTag'
import { createElement, appendChild, setInitialProperties, prepareUpdate } from './ReactDomComponent';
import { Update } from './ReactFiberFlags';

function ReactCompleteWork (current, workInProgress) {
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case HostComponent:
      if(current && workInProgress.stateNode) {
        updateHostComponent(current, workInProgress, workInProgress.tag, newProps);
      } else {
        const type = workInProgress.type;
        const instance = createInstance(type, newProps);
        appendAllChildren(instance, workInProgress);
        workInProgress.stateNode = instance;
        finalizeInitialChildren(instance, type, newProps);
      }
  }
}

function createInstance (type) {
  return createElement(type)
}

function appendAllChildren(parent, workInProgress) {
  let node = workInProgress.child;
  while(node) {
    if(node.tag === HostComponent) {
      appendChild(parent, node.stateNode)
    }
    node = node.sibling
  }
}

function finalizeInitialChildren (domElement, type, props) {
  setInitialProperties(domElement, type, props);
}

function updateHostComponent(current, workInProgress, tag, newProps) {
  const oldProps = current.memoizedProps;

  const instance = workInProgress.stateNode;

  const updatePayload = prepareUpdate(instance, tag, oldProps, newProps);

  workInProgress.updateQueue = updatePayload;

  if (updatePayload) {
    workInProgress.flags |= Update
  }

}

export default ReactCompleteWork;