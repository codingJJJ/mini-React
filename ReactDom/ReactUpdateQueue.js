export const initializeUpdateQueue = (fiber) => {
  const updateQueue = {
    shared: {
      pending: null
    }
  }
  fiber.updateQueue = updateQueue
}

export function createUpdate() {
  return {}
}

export function enqueueUpdate (fiber, update) {
  const pending = fiber.updateQueue.shared;
  if(!pending) {
    update.next = update
  } else {
    update.next = pending.next;
    pending.next = update
  }
  fiber.updateQueue.shared.pending = update
}