import React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import uccdn from '../lib/uccdn'

const UploadButton = ({ onClick }) => (
  <button type='button' className='btn btn-primary btn-block' onClick={onClick}>
    <i className='fa fa-picture-o'></i> Upload an image
  </button>
)

const UploadcareInner = React.createClass({
  propTypes: {
    files: React.PropTypes.array,
    label: React.PropTypes.string,
    opts: React.PropTypes.object,
    onChange: React.PropTypes.func,
    image: React.PropTypes.string,
    noImageComponent: React.PropTypes.element,
    error: React.PropTypes.string
  },

  getInitialState () {
    return { progress: 0 }
  },

  changeContents () {
    const { files, opts, onChange } = this.props
    let dialog = window.uploadcare.openDialog(files, opts)
    dialog.done((file) => {
      file.done((info) => {
        onChange(info)
      })
      file.fail((info) => {
        console.error('Uploadcare upload error', info)
      })
      file.progress((data) => this.setState({ progress: data.progress === 1 ? 0 : Math.round(data.progress * 100) }))
    })
    dialog.fail((info) => {
      console.error('Uploadcare dialog error', info)
    })
  },

  render () {
    const { label, image, error, noImageComponent } = this.props
    const EmptyComponent = noImageComponent || UploadButton

    return (
      <div style={{ marginBottom: '1em' }}>
        <div>
          {label ? <label>{label}</label> : null}
          <div>
            {
              image
              ? (
                <img
                  className='image-preview'
                  style={{ maxWidth: '100%', maxHeight: '300px', cursor: 'pointer', display: 'block', margin: 'auto' }}
                  src={uccdn(image, '-/preview/300x300')}
                  onClick={this.changeContents}
                />
              )
              : (
                <EmptyComponent onClick={this.changeContents} />
              )
            }
            {
              this.state.progress
              ? (
                <div className='progress-container' style={{ width: '100%', marginTop: '5px' }}>
                  <div className='progress progress-striped' value={this.state.progress} max='100'>
                    <div className='progress'>
                      <span className='progress-bar' style={{width: `${this.state.progress}%`}}>{this.state.progress}%</span>
                    </div>
                  </div>
                </div>
              )
              : null
            }
            {error ? (<small className='text-danger'>{error}</small>) : null}
          </div>
        </div>
      </div>
    )
  }
})

const Uploadcare = (props) => (
  <div>
    <Helmet
      script={[
        { type: 'text/javascript', innerHTML: `window.UPLOADCARE_PUBLIC_KEY = '${props.config.uploadcarePublicKey}'` },
        { type: 'text/javascript', innerHTML: 'window.UPLOADCARE_MANUAL_START = true' },
        { type: 'text/javascript', src: 'https://ucarecdn.com/widget/2.8.2/uploadcare/uploadcare.full.min.js' }
      ]}
    />
    <UploadcareInner {...props} />
  </div>
)

const mapStateToProps = ({ config }) => ({ config })

export default connect(mapStateToProps)(Uploadcare)
