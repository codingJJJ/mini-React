import { createElement, appendChild, setInitialProperties } from './ReactDomComponent';

function ReactCompleteWork (current, workInProgress) {
  const newProps = workInProgress.pendingProps;

  switch (workInProgress.tag) {
    case HostComponent:
      const type = workInProgress.type;
      const instance = createInstance(type, newProps);
      appendAllChildren(instance, workInProgress);
      workInProgress.stateNode = instance;
      finalizeInitialChildren(instance, type, newProps)
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

export default ReactCompleteWork;