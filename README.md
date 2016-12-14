# Projectsuite Ionic 2

<img src="https://github.com/msio777/projectsuite.mobile/blob/master/projectsuite_logo.png"  width="60">

Projectsuite Ionic 2 is mobile version of system that is managing working steps of employees in european largest insurance company written in [Ionic 2](http://ionic.io/2) 

## Screenshots
iOS

<img src="https://github.com/msio777/projectsuite.mobile/blob/master/screens/screen_ios.png" width="30%" height="30%">
<img src="https://github.com/msio777/projectsuite.mobile/blob/master/screens/screen2_ios.png" width="30%" height="30%">
<img src="https://github.com/msio777/projectsuite.mobile/blob/master/screens/screen3_ios.png" width="30%" height="30%">

Android

<img src="https://github.com/msio777/projectsuite.mobile/blob/master/screens/screen_android.png" width="30%" height="30%">
<img src="https://github.com/msio777/projectsuite.mobile/blob/master/screens/screen2_android.png" width="30%" height="30%">
<img src="https://github.com/msio777/projectsuite.mobile/blob/master/screens/screen3_android.png" width="30%" height="30%">


## Installation
* clone repository
* in root directory
```shell
npm install
```

## Start in Browser 
```shell
ionic serve
```
Login `b1234` Pass: `1234`

Projectsuite uses fake REST API [JSON Server](https://github.com/typicode/json-server) and is started with `ionic serve`. In root directory is config file `json-server.json` where can be set port and delay of this API. Default values are

```json
{
  "port": 4000,
  "delay": 200
}
```
Data is in `db.json` file stored in root directory.

## Build for Mobile

Follow ionic 2 instructions [here](http://ionicframework.com/docs/v2/getting-started/installation/)


