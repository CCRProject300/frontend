import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import KudosPointsGraph from '../ui/components/dashboard/kudos-points-graph'

const narr = (n) => Array(n).fill(n)

storiesOf('KudosPointsGraph', module)
  .add('Loading', () => (
    <KudosPointsGraph
      timespan='daily'
      updateTimespan={(t) => action(t)}
      hasUnconnectedDevices={false}
      loading
    />
  ))
  .add('Daily', () => (
    <KudosPointsGraph
      timespan='daily'
      onChangeTimespan={action('onChangeTimespan')}
      onChangeStartDate={action('onChangeStartDate')}
      hasUnconnectedDevices={false}
      loading={false}
      graph={{
        labels: narr(96).map((x, i) => `${i}:00`),
        series: [
          narr(96).map((x, i) => ({ value: Math.sin(i / 10) * 50, meta: 'Running' })),
          narr(96).map((x, i) => ({ value: x / 2, meta: 'Cycling' })),
          narr(96).map((x, i) => ({ value: i, meta: 'Squash' })),
          narr(96).map((x, i) => ({ value: i, meta: 'Football' }))
        ]
      }}
    />
  ))
  .add('Weekly, 2 activities', () => (
    <KudosPointsGraph
      timespan='weekly'
      onChangeTimespan={action('onChangeTimespan')}
      onChangeStartDate={action('onChangeStartDate')}
      hasUnconnectedDevices={false}
      loading={false}
      graph={{
        labels: narr(7).map((x, i) => `Day ${i}`),
        series: [
          narr(7).map((x, i) => ({value: i / 2, meta: 'walking'})),
          narr(7).map((x, i) => ({value: x / 2, meta: 'cycling'}))
        ]
      }}
    />
  ))
  .add('Weekly, 4 activities', () => (
    <KudosPointsGraph
      timespan='weekly'
      onChangeTimespan={action('onChangeTimespan')}
      onChangeStartDate={action('onChangeStartDate')}
      hasUnconnectedDevices={false}
      loading={false}
      graph={{
        labels: narr(7).map((x, i) => `Day ${i}`),
        series: [
          narr(7).map((x, i) => ({ value: Math.sin(i / 10) * 50, meta: 'Running' })),
          narr(7).map((x, i) => ({ value: x / 2, meta: 'Cycling' })),
          narr(7).map((x, i) => ({ value: i, meta: 'Squash' })),
          narr(7).map((x, i) => ({ value: i, meta: 'Football' }))
        ]
      }}
    />
  ))
  .add('Monthly', () => (
    <KudosPointsGraph
      timespan='monthly'
      onChangeTimespan={action('onChangeTimespan')}
      onChangeStartDate={action('onChangeStartDate')}
      hasUnconnectedDevices={false}
      loading={false}
      graph={{
        labels: narr(30).map((x, i) => `Day ${i}`),
        series: [
          narr(30).map((x, i) => ({ value: Math.sin(i / 10) * 50, meta: 'Running' })),
          narr(30).map((x, i) => ({ value: x / 2, meta: 'Cycling' })),
          narr(30).map((x, i) => ({ value: i, meta: 'Squash' })),
          narr(30).map((x, i) => ({ value: i, meta: 'Football' }))
        ]
      }}
    />
  ))
