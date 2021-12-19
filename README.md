# @squirrel-forge/node-cfx

Node output/console styler.

## Install

```
npm i @squirrel-forge/node-cfx
```

## Usage

Getting and using a default instance.
```javascript
const { cfx } = require( '@squirrel-forge/node-cfx' );
cfx.log( '[ul][fgreen]something[re]' );
```

Default styled output.
```javascript
cfx.success( 'success' );
cfx.error( 'error' );
cfx.warn( 'warning' );
cfx.info( 'info' );
```

Get a styled string:
```javascript
const str = cfx.setStyle( '[ul][fgreen]something[re]' ); // \x1b[4m\x1b[32msomething\x1b[0m
```

To enable automatic prefixing with the current timestamp set the *prependTime* property:
```javascript
cfx.prependTime = true;
```

To change the timestamp style, use the *timestampPrefix* and *timestampSuffix* properties:
```javascript
cfx.timestampPrefix = '[fwhite][[re][th]';
cfx.timestampSuffix = '[re][fwhite]][re] ';
```

Setting a custom timestamp format, see [time-stamp](https://www.npmjs.com/package/time-stamp) for details.
```javascript
cfx.timestampFormat = 'YYYY-MM-DD HH:mm:ss';
```

## Styling options

### Control and text style

 Code | Control | Code | Text
----- | ------- | ---- | -----
 [re] | Reset   | [bo] | Bold
 [rv] | Reverse | [th] | Thin
      |         | [ul] | Underline
      |         | [bl] | Blink
      |         | [hd] | Hidden

### Text and background colors

 Text       | Background | Color
----------- | ---------- | -------
 [fblack]   | [bblack]   | Black
 [fred]     | [bred]     | Red
 [fgreen]   | [bgreen]   | Green
 [fyellow]  | [byellow]  | Yellow
 [fblue]    | [bblue]    | Blue
 [fmagenta] | [bmagenta] | Magenta
 [fcyan]    | [bcyan]    | Cyan
 [fwhite]   | [bwhite]   | White

## Issues

Please submit issues here: [https://github.com/squirrel-forge/node-cfx/issues](https://github.com/squirrel-forge/node-cfx/issues)
