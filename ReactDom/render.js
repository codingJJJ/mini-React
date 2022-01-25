import createFiberRoot from './createFiberRoot'

import { updateContainer } from './ReactReconciler';

/**
 * 
 * @param {*} element 
 * @param {*} container 
 */
function render (element, container) {
  let fiberRoot = container._reactRootContainer;
  if(!fiberRoot) {
    fiberRoot = container._reactRootContainer = createFiberRoot(container);
  }
  updateContainer(element, fiberRoot)
}

export default render
