# node-cfx

Node output/console styler.

## Install

```
# npm i @squirrel-forge/node-cfx
```

## Usage

Getting and using a default instance.
```javascript
const cfx = require( '@squirrel-forge/node-cfx' ).cfx;
cfx.log( '[ul][fgreen]something[re]' );
```

Default styled output.
```javascript
cfx.success( 'success' );
cfx.error( 'error' );
cfx.warn( 'warning' );
cfx.info( 'info' );
```

Setting a custom timestamp format, see [time-stamp](https://www.npmjs.com/package/time-stamp) for details.
```javascript
cfx.timestampFormat = 'YYYY-MM-DD HH:mm:ss';
```

## Styling options

Code | Control
---- | ------------
[re] | Reset
[rv] | Reverse
[hd] | Hidden

Code | Text
---- | ------------
[bo] | Bold
[th] | Thin
[ul] | Underline
[bl] | Blink

Code       | Colors
---------- | ------------
[fblack]   | Black
[fred]     | Red
[fgreen]   | Green
[fyellow]  | Yellow
[fblue]    | Blue
[fmagenta] | Magenta
[fcyan]    | Cyan
[fwhite]   | White

Code       | Background
---------- | ------------
[bblack]   | Black
[bred]     | Red
[bgreen]   | Green
[byellow]  | Yellow
[bblue]    | Blue
[bmagenta] | Magenta
[bcyan]    | Cyan
[bwhite]   | White
