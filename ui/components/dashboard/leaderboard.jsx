import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import format from 'simple-format-number'

const pointsFormat = {fractionDigits: 0}

function renderList (listItems) {
  return (
    <ul className='list-group'>
      {listItems && listItems.map((item, i) => {
        return (
          <li className='list-group-item' key={`${i}-${item}`}>
            <div className='display-ib'>{item.name}</div>
            <div className='pull-sm-right'>
              <div className='display-ib gray-light m-r-2'>average</div>
              <div className='display-ib text-sm-center' style={{minWidth: '30px'}}>
                <span className='badge'>{format(item.avgPoints, {fractionDigits: 2})}</span>
              </div>
              <div className='display-ib gray-light m-r-1 m-l-2'>total</div>
              <div className='display-ib text-sm-center' style={{minWidth: '30px'}}>
                <span className='badge'>{format(item.points, pointsFormat)}</span>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function LeaderBoard ({ title, data }) {
  if (!data) return null
  return (
    <Tabs defaultActiveKey={1} id={`${title.split(' ').join('-').toLowerCase()}-leaderboard`}>
      <Tab eventKey={0} title={title} disabled />
      <Tab eventKey={1} title='This Week'>{renderList(data.week)}</Tab>
      <Tab eventKey={2} title='This Month'>{renderList(data.month)}</Tab>
      <Tab eventKey={3} title='All Time'>{renderList(data.all)}</Tab>
    </Tabs>
  )
}

export default LeaderBoard
