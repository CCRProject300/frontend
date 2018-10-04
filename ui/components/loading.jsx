import React from 'react'

const Loading = React.createClass({

  componentDidMount () {
    this.timeoutId = setTimeout(() => { this.containerEl.className += ' in' }, 500)
  },

  componentWillUnmount () {
    clearTimeout(this.timeoutId)
  },

  render () {
    return (
      <img
        ref={(el) => { this.containerEl = el }}
        src='/imgs/loading.gif'
        className='fade'
        style={{ display: 'block', margin: '0 auto' }}
      />
    )
  }
})

export default Loading
