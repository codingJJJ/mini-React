export function createElement (type) {
  return document.createElement(type)
}

export function appendChild (parentInstance, child) {
  return parentInstance.appendChild(child)
}

// 根据props给domElement设置属性
export function setInitialProperties (domElement, type, props) {
  for(const propKey in props) {
    const nextProps = props[propKey]
    if(propKey === 'children' ) { // 优化纯字符串数字类型的节点
      if(typeof nextProps === 'string' || typeof nextProps === 'number') {
        domElement.textContent = nextProps;
      }
    } else if (propKey === 'style') { // style 特殊处理
      for(let styleKey in nextProps) {
        domElement.style[styleKey] = nextProps[styleKey]
      }
    } else {
      domElement[propKey] = nextProps;
    }
  }
}

// 是否需要设置字符串内容
export function shouldSetTextContent (pendingProps) {
  return typeof pendingProps.children === 'string' || typeof pendingProps.children === 'number'
}

export function prepareUpdate(domElement, type, oldProps, newProps) {
  return diffProperties(domElement, type, oldProps, newProps)
}

export function diffProperties(domElement, tag, lastProps, nextProps) {
  let updatePayload = null;
  let propKey;
  for (propKey in lastProps) {
      if (lastProps.hasOwnProperty(propKey) && (!nextProps.hasOwnProperty(propKey))) {
          //updatePayload更新数组 [更新的key1,更新的值1,更新的key2,更新的值2]
          (updatePayload = updatePayload || []).push(propKey, null);
      }
  }
  for (propKey in nextProps) {
      const nextProp = nextProps[propKey];
      if (propKey == 'children') {
          if (typeof nextProp === 'string' || typeof nextProp === 'number') {
              if (nextProp !== lastProps[propKey]) {
                  (updatePayload = updatePayload || []).push(propKey, nextProp);
              }
          }
      } else {
          //如果新的属性和老的属性不一样
          if (nextProp !== lastProps[propKey]) {
              (updatePayload = updatePayload || []).push(propKey, nextProp);
          }
      }
  }
  return updatePayload;
}