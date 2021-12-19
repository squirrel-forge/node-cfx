/**
 * Requires
 */
const { cfx } = require( './index.js' );
const pkg = require( './package.json' );

/**
 * Notify color table
 */
cfx.success( pkg.name + '@' + pkg.version + ' color table' );

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
cfx.warn( 'If above color table or output does not match it\'s descriptions please report an issue here:' );
cfx.info( pkg.bugs.url );
process.exit( 0 );
