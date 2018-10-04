const breakpoints = {
  sm: 768,
  md: 992,
  lg: 1200
}

export default function () {
  const width = window && window.innerWidth
  if (!width) return 'xs'
  return Object.keys(breakpoints).reduce((memo, bp) => {
    return breakpoints[bp] < width ? bp : memo
  }, 'xs')
}
