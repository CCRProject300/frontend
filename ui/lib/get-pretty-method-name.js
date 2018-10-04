const methods = {
  fitbit: 'Fitbit',
  'google-fit': 'Google Fit',
  runkeeper: 'Runkeeper',
  strava: 'Strava'
}

export default function (methodName) {
  return methods[methodName] || methodName
}
