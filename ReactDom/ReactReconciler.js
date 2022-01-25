import { createUpdate, enqueueUpdate } from './ReactUpdateQueue'
import { scheduleUpdateOnFiber } from './ReactWorkLoop'

export function updateContainer (element, container) {
  const current = container.current;
  const update = createUpdate();
  update.payload = { element };
  // 添加更新队列
  enqueueUpdate(current, update);
  // 更新入口
  scheduleUpdateOnFiber(current);
}