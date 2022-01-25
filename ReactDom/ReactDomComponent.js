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