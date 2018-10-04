import React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

function GettingStarted ({ user }) {
  const content = [
    {
      src: '/imgs/getting-started/step1.png',
      copy: (
        <div>
          <p><span className='lead'>1.</span>Please make sure that you’re properly set up on your tracking app or device:</p>
          <ul className='list-unstyled device-list'>
            <li><a target='_blank' href='https://www.facebook.com/KudosHealth/videos/1295355750483787/'><img src='/imgs/apps/runkeeper.png' />Runkeeper</a></li>
            <li><a target='_blank' href='https://www.facebook.com/KudosHealth/videos/1295358253816870/'><img src='/imgs/apps/google-fit.png' />Google Fit</a></li>
            <li><a target='_blank' href='https://www.facebook.com/KudosHealth/videos/1295350670484295/'><img src='/imgs/apps/strava.png' />Strava</a></li>
            <li><a target='_blank' href='http://help.fitbit.com/articles/en_US/Help_article/1873/'><img src='/imgs/apps/fitbit.png' />Fitbit device connected to the Fitbit app</a></li>
          </ul>
        </div>
      )
    },
    {
      src: '/imgs/getting-started/step1.png',
      copy: (
        <p><span className='lead'>2.</span>
          Keep in mind that the points are calculated based on a comprehensive algorithm based on multiple factors and not just steps or calories. In most cases, you will not be scoring points for all the activity tracked on your tracking app, but only for the intensive activity - this can be anything from brisk walks, cardio workout to a run or cycle.
        </p>
      )
    },
    {
      src: '/imgs/getting-started/step1.png',
      copy: (
        <div>
          <p><span className='lead'>3.</span>
            We recommend you to regularly check your notifications to see what leagues/events you have being invited to take part in, you can also join leagues from the side-bar under <em>Leagues</em>.
          </p>
          <p><strong>If you don’t join a league before its official start date, you will be losing out on points for that league.</strong><small>  If you enter a league prior to its official start date you will only start accruing points for that league from its start date, not the day you joined/accepted the invitation.</small></p>
        </div>
      )
    },
    {
      src: '/imgs/getting-started/step1.png',
      copy: (
        <div>
          <p><span className='lead'>4.</span>
            In order for you to score points, make sure your tracking app is syncing daily with the tracking apps account. (This may require you to have Bluetooth, Wi-Fi/Internet connection).
          </p>
          <p>
            To check that this has happened correctly, you can log into your tracking apps account from your desktop PC; if today’s activities are showing there, your app has synced successfully. If your activities for today are not showing you need to force the app to sync with its account.
          </p>
        </div>
      )
    },
    {
      src: '/imgs/getting-started/step1.png',
      copy: (
        <p><span className='lead'>5.</span>
          Keep in mind that we currently only support data collected directly on our approved apps (Fitbit, Strava, Runkeeper, and Google Fit).
        </p>
      )
    },
    {
      src: '/imgs/getting-started/step1.png',
      copy: (
        <p><span className='lead'>6.</span>
          For easy access to our platform, please also bookmark KudosHealth in your browser. To do so, please use <em>CTRL+D</em>.
        </p>
      )
    }
  ]
  return (
    <div className='m-x-auto max-width-800'>
      <Helmet htmlAttributes={{ class: 'gettings-started-page' }} />
      <div className='well getting-started'>
        <div className='h3'>Data protection is our highest priority!</div>
        <div className='h5'>KudosHealth protects your privacy from your employer – Your employer won’t see when, how long, what routes, or any other details about your activities! They will also not be able to see your personal statistics.  Employers will only see aggregated data.</div>
        {
          content.map((item, i) => {
            return (
              <div className='media' key={i}>
                <div className='media-left'>
                  <img src={item.src} />
                </div>
                <div className='media-body'>
                  {item.copy}
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

const mapStateToProps = ({ user }) => ({ user })

export default connect(mapStateToProps)(GettingStarted)
