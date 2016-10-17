# Projectsuite Mobile

<img src="https://github.com/msio777/projectsuite.mobile/blob/master/projectsuite_logo.png"  width="60">

Projectsuite Mobile is mobile version of system that is managing working steps of employees in european largest insurance company. 

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
* you need to add argument `"isoWeek"` in moment typescript definition because it is missing. It will not be added until version
[2.16.0](https://github.com/moment/moment/milestone/34). Go to `node_modules/moment/moment.d.ts` and at `line 216` add `"isoWeek" |` after `"w" |`

before

```ts
type UnitOfTime = ("year" | "years" | "y" |
              "quarter" | "quarters" | "Q" |
              "month" | "months" | "M" |
              "week" | "weeks" | "w" |
              "date" | "dates" | "d" |
              "day" | "days" |
              "hour" | "hours" | "h" |
              "minute" | "minutes" | "m" |
              "second" | "seconds" | "s" |
              "millisecond" | "milliseconds" | "ms");
```

after

```ts
type UnitOfTime = ("year" | "years" | "y" |
              "quarter" | "quarters" | "Q" |
              "month" | "months" | "M" |
              "week" | "weeks" | "w" | "isoWeek" |
              "date" | "dates" | "d" |
              "day" | "days" |
              "hour" | "hours" | "h" |
              "minute" | "minutes" | "m" |
              "second" | "seconds" | "s" |
              "millisecond" | "milliseconds" | "ms");
```
