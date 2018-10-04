import React from 'react'
import { Link } from 'react-router'

function Leagues ({ leagues }) {
  return (
    <div className='panel panel-default'>
      <div className='panel-heading'>
        <h3 className='panel-title'>My Leagues</h3>
      </div>
      <table className='table table-condensed table-striped'>
        <tbody>
          {leagues.map((league) => {
            return (
              <tr key={league.name} className={`${progressToStatus(league.progress)}`}>
                <td className='v-mid lead p-l-2'>{league.name}</td>
                <td className='v-mid lead'>#{league.ranking}</td>
                <td className='v-mid text-center'><i className={`fa fa-2x ${progressToIcon(league.progress)}`}></i></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className='panel-body text-right'>
        <Link to='/leagues' className='btn btn-default'>View all</Link>
      </div>
    </div>
  )
}

function progressToIcon (progress) {
  return {
    '1': 'fa-arrow-circle-up',
    '0': 'fa-minus',
    '-1': 'fa-arrow-circle-down'
  }[progress]
}

function progressToStatus (progress) {
  return {
    '1': 'success',
    '0': '',
    '-1': 'warning'
  }[progress]
}

export default Leagues
