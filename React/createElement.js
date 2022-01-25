
export const REACT_ELEMENT_TYPE = Symbol.for('react.element')

const PROPS_KEY = ['key', 'ref']

const createElement = (type, config, ...children) => {

  const props = {}

  let key = null;
  let ref = null;

  if(config) {
    if(config.key) {
      key += ''
    }
    if(config.ref) {
      ref = config.ref
    }

    for(let propName in config) {
      if(!PROPS_KEY.includes(propName)) {
        props[propName] = config[propName]
      }
    }
  }

  const childrenLength = children.length

  if(childrenLength === 1) {
    props.children = children[0]
  }else if(childrenLength > 1) {
    props.children = children
  }

  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    ref,
    key,
    props
  }
}

export default createElement;
