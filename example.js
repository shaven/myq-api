const MyQ = require('myq-api');
const account = new MyQ('email', 'password');

const delay = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

const data = {};
console.log('Logging in');
account.login()
  .then((result) => {
    console.log('login result:', result);
    console.log('Getting all devices on account');
    return account.getDevices([17]);
  }).then((result) => {
    console.log('getDevices result:', result);
    if (result.returnCode !== 0) {
      throw 'getDevices unsuccessful!';
    }

    const doors = result.devices;
    for (let door of doors) {
      console.log(`Name: ${door.name}, State: ${door.doorState}`);
    }
    return doors;
  }).then((doors) => {
    data.doors = doors;
    if (doors.length > 0) {
      console.log('Closing door');
      return account.setDoorState(doors[0].id, 0);
    }
  }).then((result) => {
    console.log('setDoorState result:', result);
    if (result.returnCode !== 0) {
      throw 'setDoorState unsuccessful!';
    }

    return;
  }).then(() => {
    console.log('Waiting five seconds before polling state again');
    return delay(5000);
  }).then(() => {
    return account.getDoorState(data.doors[0].id);
    // print out state
  }).then((result) => {
    console.log('getDoorState result:', result);
    if (result.returnCode !== 0) {
      throw 'getDoorState unsuccessful!';
    }

    console.log(`State: ${result.doorState}`);
  }).catch((err) => {
    console.error(err);
  });
