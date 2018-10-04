import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router'

const content = [
  {
    heading: 'What is KudosHealth',
    copy: (
      <p>KudosHealth is a platform to reward & motivate people to be physically active and lead a healthier lifestyle</p>
    )
  },
  {
    heading: 'What data and info does my employer see?',
    copy: (
      <p>We value your privacy so we created KudosPoints, this is a single score created from your fitness activities so this single score is all that your employers sees - they don&#39;t see what activity you did, how long you did it for, where you did it &amp; who you did it with. Your activities as a combined company activity can be seen by the employer, so an employer can see that employees completed 200k of cycling this week and 150k of running this week, an employer see how many k you completed</p>
    )
  },
  {
    heading: 'What applications and wearable devices can I connect on KudosHealth?',
    copy: (
      <p>
        For the moment we support FitBit, Runkeeper and Strava. You can download the apps following the links below: <a href='https://runkeeper.com/running-app' target='_blank'>Runkeeper</a>; <a href='https://www.strava.com/mobile' target='_blank'>Strava</a>; Fitbit on: <a href='https://play.google.com/store/apps/details?id=com.fitbit.FitbitMobile&hl=en' target='_blank'>Android</a> and <a href='https://play.google.com/store/apps/details?id=com.fitbit.FitbitMobile&hl=en' target='_blank'>iOs</a>
      </p>
    )
  },
  {
    heading: 'How can I connect a device?',
    copy: (
      <p>To connect a device simple click "Connect [name of app]" from the list found on "My Apps and Devices", on the left sidebar.</p>
    )
  },
  {
    heading: 'I\'ve connected an app, but I don\'t receive any points. What should I do?',
    copy: (
      <p>KudosHealth synchronises the data every 15 minutes. You still need to track your fitness activity using the application.</p>
    )
  },
  {
    heading: 'How are KudosPoints calculated?',
    copy: (
      <p>The KudosPoints were created to protect your privacy. This way, no one will know what type of activities have you actually done, but you can still enjoy the gamification and compete with your friends and colleagues.</p>
    )
  },
  {
    heading: 'How do I create a challenge for my teams?',
    copy: (
      <p>Go to "Leagues" and - from the dropdown - select "Manage leagues", click on "Create new" and then name the league and set its start and end dates.</p>
    )
  },
  {
    heading: 'How soon do my points appear after an activity?',
    copy: (
      <p>Your points will appear on the platform as soon as your device or app database syncs with KudosHealth.</p>
    )
  },
  {
    heading: 'What activities can I earn points with?',
    copy: (
      <p>You&#39;re basically earning points for any activity that&#39;s burning calories, if you&#39;re using the likes of a wearable device like Fitbit and with other apps your earning points for completing tracked activity.</p>
    )
  },
  {
    heading: 'What happens if I forget to synchronise my device during a League? Will I still get points for the previous days once I sync the app or device?',
    copy: (
      <p>This situation could only appear if you don&#39;t have internet access for a long period of time, or if you forget to sync your wearable device. In this situation, if you participate in any league, we will only take into consideration the last 48 hours of data from the moment you synced your device. On your own dashboard, you will see all your previous data.</p>
    )
  },
  {
    heading: 'Can I see the "Getting started" page again?',
    copy: (
      <p>Of course. Please click <Link to='/getting-started'>here</Link> to access the 'Getting started' page.</p>
    )
  }
].map((item) => {
  item.id = item.heading.split(' ').join('').toLowerCase()
  return item
})

export default React.createClass({
  render () {
    return (
      <div className='m-x-auto max-width-800'>
        <Helmet htmlAttributes={{class: 'faq-page'}} />
        <div className='list-group m-b-2'>
          {
            content.map((item, i) => {
              let id = '#' + item.id
              return (<a key={i} className='lead primary list-group-item' list-group-item href={id}>{item.heading}</a>)
            })
          }
        </div>
        <ul className='list-group'>
          {
            content.map((item, i) => {
              return (
                <li className='list-group-item' key={item.id} id={item.id}>
                  <p className='lead'>{item.heading}</p>
                  {item.copy}
                  <a href='#top' className='pull-right' style={{marginTop: -16}}><i className='fa fa-arrow-up' title='Back to top'></i></a>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
})
