/**
 * Requires
 */
const timestamp = require( 'time-stamp' );

/**
 * ASCII code definitions
 * @type {{bred: string, fyellow: string, fmagenta: string, rv: string, fcyan: string, byellow: string, bl: string, fblue: string, bo: string, fwhite: string, bblack: string, bblue: string, fgreen: string, re: string, th: string, bcyan: string, ul: string, bgreen: string, fred: string, hd: string, fblack: string, bmagenta: string, bwhite: string}}
 */
const ASCIIREF = {

    // Style and control
    re : '\x1b[0m', // reset
    bo : '\x1b[1m', // bold
    th : '\x1b[2m', // thin
    ul : '\x1b[4m', // underline
    bl : '\x1b[5m', // blink
    rv : '\x1b[7m', // reverse
    hd : '\x1b[8m', // hidden

    // Foreground colors
    fblack : '\x1b[30m',
    fred : '\x1b[31m',
    fgreen : '\x1b[32m',
    fyellow : '\x1b[33m',
    fblue : '\x1b[34m',
    fmagenta : '\x1b[35m',
    fcyan : '\x1b[36m',
    fwhite : '\x1b[37m',

    // Background colors
    bblack : '\x1b[40m',
    bred : '\x1b[41m',
    bgreen : '\x1b[42m',
    byellow : '\x1b[43m',
    bblue : '\x1b[44m',
    bmagenta : '\x1b[45m',
    bcyan : '\x1b[46m',
    bwhite : '\x1b[47m',
};

/**
 * OutputStyler
 * @class
 */
class OutputStyler {

    /**
     * Constructor
     * @constructor
     * @param {Object} reference - ASCII code reference object
     * @param {null|Object|Console} target - Target object
     */
    constructor( reference, target = null ) {

        /**
         * Output
         * @protected
         * @property
         * @type {Object|Console}
         */
        this._ = target || console;

        // Check target
        if ( typeof this._.log !== 'function' ) {
            throw new Error( 'Invalid target reference, method not found: target.log()' );
        }

        /**
         * Style reference
         * @public
         * @property
         * @type {Object}
         */
        this.reference = reference;

        /**
         * Timestamp format
         * @public
         * @property
         * @type {string}
         */
        this.timestampFormat = 'YYYY-MM-DD HH:mm:ss';

        /**
         * Timestamp prefix
         * @public
         * @property
         * @type {string}
         */
        this.timestampPrefix = '[fwhite][[re][th]';

        /**
         * Timestamp suffix
         * @public
         * @property
         * @type {string}
         */
        this.timestampSuffix = '[re][fwhite]][re] ';

        /**
         * Settable auto prepend time
         * @public
         * @property
         * @type {boolean}
         */
        this.prependTime = false;
    }

    /**
     * Set styles defined in string
     * @public
     * @param {string|number} value - Target string
     * @return {string} - Styled string
     */
    setStyle( value ) {

        // Simple type
        if ( ![ 'string', 'number', 'undefined' ].includes( typeof value ) ) {
            return value;
        }

        // Convert to string
        let styled = value + '';

        // Replace all style references
        Object.keys( this.reference ).forEach( ( key ) => {
            const regex = new RegExp( '\\[(' + key + ')\\]', 'g' );
            styled = styled.replace( regex, this.reference[ key ] );
        } );
        return styled;
    }

    /**
     * Prepends time if required
     * @protected
     * @return {void}
     */
    _prependTime() {
        if ( this.prependTime ) {
            process.stdout.write( this.setStyle( this.timestampPrefix
                + timestamp( this.timestampFormat ) + this.timestampSuffix ) );
        }
    }

    /**
     * Write styled
     * @protected
     * @param {function} fn - Target function
     * @param {Array} data - Arguments
     * @param {null|string} prepend - Style to prepend
     * @param {string} append - Style to append
     * @return {void}
     */
    _write( fn, data, prepend = null, append = ' [re]' ) {
        let added = 0;

        // Prepend time
        this._prependTime();

        // Set opening style
        if ( prepend ) {
            data.unshift( prepend );
            data.push( append );
            added += 2;
        }

        // Only handle style if one was added
        if ( data.length > added ) {
            for ( let i = 0; i < data.length; i++ ) {
                const to = typeof data[ i + 1 ];
                if ( typeof data[ i ] !== 'object' ) {
                    data[ i ] = this.setStyle( data[ i ] );

                    // End style for next complex object
                    if ( to === 'object' && prepend ) {
                        data.splice( i + 1, 0, this.setStyle( append ) );
                        i++;
                    }
                } else if ( prepend && to !== 'undefined' && to !== 'object' ) {

                    // Reopen style for the next element
                    data.splice( i + 1, 0, this.setStyle( prepend ) );
                    i++;
                }
            }
        }

        // Ensure valid target function and call
        if ( !this._[ fn ] ) fn = 'log';
        this._[ fn ]( ...data );
    }

    /**
     * Custom style
     * @public
     * @param {*} data - Data to log
     * @return {void}
     */
    log( ...data ) {
        this._write( 'log', data );
    }

    /**
     * Red error style
     * @public
     * @param {*} data - Data to log
     * @return {void}
     */
    error( ...data ) {
        this._write( 'error', data, '[bred][fwhite] ', ' [re]' );
    }

    /**
     * Yellow warning style
     * @public
     * @param {*} data - Data to log
     * @return {void}
     */
    warn( ...data ) {
        this._write( 'warn', data, '[byellow][fblack] ', ' [re]' );
    }

    /**
     * Cyan info style
     * @public
     * @param {*} data - Data to log
     * @return {void}
     */
    info( ...data ) {
        this._write( 'info', data, '[bblack][fcyan] ', ' [re]' );
    }

    /**
     * Green success style
     * @public
     * @param {*} data - Data to log
     * @return {void}
     */
    success( ...data ) {
        this._write( 'log', data, '[bgreen][fblack] ', ' [re]' );
    }
}

/**
 * Default cfx instance
 * @type {OutputStyler}
 */
const cfx = new OutputStyler( ASCIIREF );

// Export all references
module.exports = {
    ASCIIREF,
    OutputStyler,
    cfx,
};
