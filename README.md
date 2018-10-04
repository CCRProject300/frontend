# KudosHealth frontend [![CircleCI](https://circleci.com/gh/tableflip/kudoshealth-frontend.svg?style=svg&circle-token=ed8da86e59334602db41e04a1ac783c82a75da01)](https://circleci.com/gh/tableflip/kudoshealth-frontend)

## Pre-requisits

- Install Node.js
- Clone and start [kudoshealth-api](https://github.com/tableflip/kudoshealth-api)

## Getting started

1. Clone the kudoshealth-frontend repo
2. Create a `config/runtime.json`
3. Install dependencies `npm install`
4. Start the app `npm start`

Or use `npm run watch` to rebuild and restart the server as you edit things.

### Using PopTart Messages

If your component ever needs to emit a message you can issue a PopTart notification message. Firstly you need to make `addPopTartMsg()` available in your component thus:

```
const mapDispatchToProps = (dispatch) => {addPopTartMsg: (popMsg) => dispatch(addPopTartMsg(popMsg))}

export default connect(null, mapDispatchToProps)(YourComponent)
```
Then you can call the function and pass an object with your `message` and the `level` (or type) of message
```
this.props.addPopTartMsg({message: `Warning bernard ${new Date()}`, level: 'warning'})
this.props.addPopTartMsg({message: `Info bernard ${new Date()}`, level: 'info'})
this.props.addPopTartMsg({message: `Error bernard ${new Date()}`, level: 'error'})
this.props.addPopTartMsg({message: `Success bernard ${new Date()}`, level: 'success'})
```

