import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'

const ErrorPage = ({ statusCode, error, message }) => (
  <div>
    <Helmet
      htmlAttributes={{class: 'error-page'}}
      title={`${statusCode} ${error}`}
    />
    <div className='container'>
      <img src='/imgs/logo.png' alt='KudosHealth' className='img-responsive m-y-3' style={{maxWidth: '300px'}} />
      <p className='lead white'>{statusCode} {error}</p>
      <p className='m-b-3'>{message || 'Sorry, an error occurred.'}</p>
      <p>What now? You can return to the <a href='/' className='gray-dark' style={{ textDecoration: 'underline' }}>home page</a> or report this error to <a href='mailto:support@kudoshealth.com' className='gray-dark' style={{ textDecoration: 'underline' }}>support@kudoshealth.com</a>.</p>
    </div>
  </div>
)

ErrorPage.propTypes = {
  statusCode: PropTypes.number.isRequired,
  // HTTP status message (e.g. 'Bad Request', 'Internal Server Error') derived from statusCode
  error: PropTypes.string.isRequired,
  message: PropTypes.string
}

export default ErrorPage

export const Error404 = () => (
  <ErrorPage statusCode={404} error={'Not Found'} message={'Page not found.'} />
)

Error404.displayName = 'error404'
