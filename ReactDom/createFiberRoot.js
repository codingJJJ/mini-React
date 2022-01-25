import { initializeUpdateQueue } from './ReactUpdateQueue'

import { createHostRootFiber } from './ReactFiber';

const createFiberRoot = (containerInfo) => {
  const fiberRoot = { containerInfo }

  const hostRootFiber = createHostRootFiber();

  fiberRoot.current = hostRootFiber;

  hostRootFiber.stateNode = fiberRoot;

  initializeUpdateQueue(hostRootFiber)

  return fiberRoot;
}

export default createFiberRoot;