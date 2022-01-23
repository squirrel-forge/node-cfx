/**
 * Requires
 */
const { cfx, ASCIIREF, OutputStyler } = require( './index.js' );
const pkg = require( './package.json' );

/**
 * Notify
 */
cfx.success( 'Running ' + pkg.name + '@' + pkg.version + ' tests' );

/**
 * Check exports
 */
if ( cfx instanceof OutputStyler ) {
    cfx.log( 'cfx instanceof OutputStyler' );
} else {
    cfx.error( '>>> Error please report:', OutputStyler );
}
if ( cfx.reference === ASCIIREF ) {
    cfx.log( 'cfx.reference === ASCIIREF' );
} else {
    cfx.error( '>>> Error please report:\n', ASCIIREF );
}

/**
 * Default styles
 */
cfx.info( '>>> 1. Default styles:' );

cfx.log( 'no style, default colors' );
cfx.error( 'error style, background: red, text: white' );
cfx.warn( 'warning style, background: yellow, text: black' );
cfx.info( 'information style, background: black, text: cyan' );
cfx.success( 'success style, background: green, text: black' );

/**
 * Timestamp
 */
cfx.info( '>>> 2. Timestamp styles:' );
cfx.prependTime = true;
cfx.log( 'no style with timestamp' );
cfx.timestampPrefix = '[bwhite][fblue][[fblack]';
cfx.timestampSuffix = '[fblue]][re] ';
cfx.log( 'no style with timestamp in custom style' );
cfx.timestampFormat = 'HH:mm:ss';
cfx.log( 'no style with time only' );
cfx.prependTime = false;

/**
 * Colors and text styles
 */
cfx.info( '>>> 3. Color table:' );

/**
 * Colors 16
 * @type {string[]}
 */
const colors = [ 'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white' ];

/**
 * Text modifiers
 * @type {string[]}
 */
const mods = [ 'th', 'bo', 'ul' ];

/**
 * Output column descriptions
 */
cfx.log( [
    '  [ul]   name   ',
    'txt    ',
    'bg     ',
    'thin   ',
    '       ',
    'bold   ',
    '       ',
    'ul     ',
    '       ',
    'space  [re]',
].join( ' | ' ) );

/**
 * Create line output for each color
 */
for ( let i = 0; i < colors.length; i++ ) {
    const color = colors[ i ];

    // Default color foreground and background
    const line = [
        '  -- ' + color + ' '.repeat( 7 - color.length ),
        '[f' + color + ']' + color + ' '.repeat( 7 - color.length ) + '[re]',
        '[b' + color + ']' + color + ' '.repeat( 7 - color.length ) + '[re]',
    ];

    // Add modified output
    for ( let j = 0; j < mods.length; j++ ) {
        const mod = mods[ j ];
        line.push( '[f' + color + '][' + mod + ']' + color + ' '.repeat( 7 - color.length ) + '[re]' );
        line.push( '[b' + color + '][' + mod + ']' + color + ' '.repeat( 7 - color.length ) + '[re]' );
    }

    // Empty color line
    line.push( '[b' + color + ']' + ' '.repeat( 7 ) + '[re]' );
    cfx.log( line.join( ' | ' ) );
}

/**
 * Notify bug reports
 */
cfx.info( '>>> 4. Issues and bugs' );
cfx.warn( 'If any of the above output does not match it\'s descriptions please report an issue here:' );
cfx.info( pkg.bugs.url );
cfx.success( 'Tests for ' + pkg.name + '@' + pkg.version + ' completed.' );
process.exit( 0 );
