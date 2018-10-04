import React from 'react'
import Helmet from 'react-helmet'

export default function ({ googleAnalyticsToken }) {
  return (
    <Helmet
      defaultTitle='KudosHealth'
      titleTemplate='KudosHealth - %s'
      link={[
        { rel: 'stylesheet', href: '/bundle.css?v=2' },
        { rel: 'shortcut icon', sizes: '16x16', href: '/imgs/icon-16x16.png' },
        { rel: 'shortcut icon', sizes: '196x196', href: '/imgs/icon-196x196.png' },
        { rel: 'apple-touch-icon-precomposed', href: '/imgs/icon-152x152.png' }
      ]}
      script={[
        { innerHTML: `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', '${googleAnalyticsToken}', 'auto');
  ga('send', 'pageview');` }
      ]}
    />
  )
}
