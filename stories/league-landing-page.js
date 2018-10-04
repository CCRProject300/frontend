import React from 'react'
import { storiesOf } from '@kadira/storybook'
import { LeagueLandingPage } from '../ui/pages/league-landing-page.jsx'

storiesOf('LeagueLandingPage', module)
  .add('Default', () => (
    <LeagueLandingPage
      heroImage='https://images.pexels.com/photos/221210/pexels-photo-221210.jpeg?w=1880&h=1300&auto=compress&cs=tinysrgb'
      logo='http://global.canon/en/corporate/logo/img/logo_01.jpg'
      title='The Most Exciting League'
      body='He moonlight difficult engrossed an it sportsmen. Interested has all devonshire difficulty gay assistance joy. Unaffected at ye of compliment alteration to. Place voice no arise along to. Parlors waiting so against me no. Wishing calling are warrant settled was luckily. Express besides it present if at an opinion visitor.'
    />
  ))
  .add('Alternative', () => (
    <LeagueLandingPage
      heroImage='https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/0D4B7B7FED.jpg'
      logo='https://upload.wikimedia.org/wikipedia/en/c/cc/IDC_Corporate_Logo.jpg'
      title='This league has quite a long name really'
      body='Offices parties lasting outward nothing age few resolve. Impression to discretion understood to we interested he excellence. Him remarkably use projection collecting. Going about eat forty world has round miles. Attention affection at my preferred offending shameless me if agreeable.'
    />
  ))
