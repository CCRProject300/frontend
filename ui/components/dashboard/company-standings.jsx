import React from 'react'
import ChartistGraph from 'react-chartist'
import { Tabs, Tab } from 'react-bootstrap'
import format from 'simple-format-number'

const pts = {fractionDigits: 0}

function CompanyStandings ({ data }) {
  if (!data || !data.community) return null

  const averageSummary = getAverageSummary(data)
  const ageSummary = getAgeSummary(data)
  const genderSummary = getGenderSummary(data)
  const chartOpts = {
    axisY: {
      showLabel: false
    }
  }

  return (
    <div className='container-fluid company-standings'>
      <div className='h4 text-center text-muted m-y-3'>Average Points per Employee</div>
      <div className='row m-b-3'>
        <div className='col-xs-12 col-md-6'>
          <ChartistGraph data={averageSummary.chart} options={chartOpts} type='Bar' />
        </div>
        <div className='col-xs-12 col-md-6 text-center m-b-3'>
          <div className='p-y-3 hidden-xs hidden-sm'></div>
          <div className={`h1 text-${averageSummary.className}`}>{averageSummary.points}</div>
          <div>{averageSummary.standing}</div>
        </div>
      </div>
      <div className='row m-b-3'>
        <div className='col-xs-12'>
          <Tabs className='age-tabs' defaultActiveKey={0}>
            <Tab eventKey={-1} title='By age' disabled />
            {ageSummary.map((age, i) => (
              <Tab eventKey={i} key={i} title={age.title}>
                <div className='row'>
                  <div className='col-xs-12 col-md-6'>
                    <ChartistGraph data={age.chart} options={chartOpts} type='Bar' />
                  </div>
                  <div className='col-xs-12 col-md-6 text-center m-b-3'>
                    <div className='p-y-3 hidden-xs hidden-sm'></div>
                    <div className={`h1 text-${age.className}`}>{age.points}</div>
                    <div>{age.standing}</div>
                  </div>
                </div>
              </Tab>
            ))}
          </Tabs>
        </div>
      </div>
      <div className='row'>
        <div className='col-xs-12'>
          <Tabs className='gender-tabs' defaultActiveKey={0}>
            <Tab eventKey={-1} title='By gender' disabled />
            {genderSummary.map((gender, i) => (
              <Tab eventKey={i} key={i} title={gender.title}>
                <div className='row'>
                  <div className='col-xs-12 col-md-6'>
                    <ChartistGraph data={gender.chart} options={chartOpts} type='Bar' />
                  </div>
                  <div className='col-xs-12 col-md-6 text-center m-b-3'>
                    <div className='p-y-3 hidden-xs hidden-sm'></div>
                    <div className={`h1 text-${gender.className}`}>{gender.points}</div>
                    <div>{gender.standing}</div>
                  </div>
                </div>
              </Tab>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function getAverageSummary (data) {
  const companyAvg = data.company.data.monthlyAverage
  const kudosAvg = data.community.data.monthlyAverage
  const title = 'Monthly Average Kudos Points per Employee'
  const label = data.company.name
  return createRenderData(companyAvg, kudosAvg, title, label)
}

function getAgeSummary (data) {
  return Object.keys(data.community.data.age).map((key, i) => {
    const companyAvg = data.company.data.age[key]
    const kudosAvg = data.community.data.age[key]
    const title = key
    const label = data.company.name
    return createRenderData(companyAvg, kudosAvg, title, label)
  })
}

function getGenderSummary (data) {
  const keys = ['Male', 'Female']
  return keys.map((key) => {
    const companyAvg = data.company.data.gender[key]
    const kudosAvg = data.community.data.gender[key]
    const title = key
    const label = data.company.name
    return createRenderData(companyAvg, kudosAvg, title, label)
  })
}

function createRenderData (companyAvg, kudosAvg, title, label) {
  let diff = companyAvg - kudosAvg
  let position = diff > 0 ? 'Above' : 'Below'
  diff === 0 ? position = 'Level with' : position
  let points = diff === 0 ? '---' : format(parseInt(diff, 10), pts)
  return {
    title: title,
    points: points,
    standing: `Points ${position} Average`,
    className: diff > 0 ? 'success' : 'danger',
    chart: {
      labels: [label, 'Kudos Community'],
      series: [[companyAvg, kudosAvg]]
    }
  }
}

export default CompanyStandings
