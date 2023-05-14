


export const log = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args)
  }
}

export const internalLog = (text) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('%c' + text, 'color: #179b43')
  }
}

export const requestLog = (url) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('%c[REQUEST]', 'color: #cd2114', url)
  }
}

export const responseLog = (response) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('%c[RESPONSE]', 'color:#4500ff', response)
  }
}

export const warn = warning => {
  console.warn(warning)
}

export const emptyFunction = () => {}