/**
 * Requires
 */
const timestamp = require( 'time-stamp' );

/**
 * @typedef {Object<string, string>} ASCIIReference
 */

/**
 * ASCII code definitions
 * @type {Object|ASCIIReference}
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
 * @callback OutputLoggerMethod
 * @param {...*} input - Output arguments
 * @return {void}
 */

/**
 * @typedef {Object} OutputLogger
 * @property {Function|OutputLoggerMethod} log - Output any styled
 * @property {null|Function|OutputLoggerMethod} error - Output error style
 * @property {null|Function|OutputLoggerMethod} warn - Output warning style
 * @property {null|Function|OutputLoggerMethod} info - Output info style
 * @property {null|Function|OutputLoggerMethod} success - Output success style
 */

/**
 * @typedef {Object<string, string>} OutputStylerDefaultStyles
 * @property {string} error - Error style
 * @property {string} warn - Warning style
 * @property {string} success - Success style
 * @property {string} info - Info style
 */

/**
 * OutputStyler
 * @class
 */
class OutputStyler {

    /**
     * Constructor
     * @constructor
     * @param {Object|ASCIIReference} reference - ASCII code reference object
     * @param {Object|OutputLogger|Console} target - Target object, default: console
     * @throws Error
     */
    constructor( reference, target ) {

        // Check target
        if ( target && typeof this._.log !== 'function' ) {
            throw new Error( 'Invalid target reference, method not found: target.log()' );
        }

        // Check reference
        if ( reference && ( typeof reference !== 'object' || !Object.keys( reference ).length ) ) {
            throw new Error( 'Invalid ascii reference object or no keys available' );
        }

        /**
         * Output
         * @protected
         * @property
         * @type {Object|Console}
         */
        this._ = target || console;

        /**
         * Style reference
         * @public
         * @property
         * @type {Object}
         */
        this.reference = reference || ASCIIREF;

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

        /**
         * Default reset string
         * @public
         * @property
         * @type {string}
         */
        this.defaultReset = ' [re]';

        /**
         * Default method styles
         * @type {Object|OutputStylerDefaultStyles}
         */
        this.style = {
            error : '[bred][fwhite] ',
            warn : '[byellow][fblack] ',
            info : '[bblack][fcyan] ',
            success : '[bgreen][fblack] ',
        };

        /**
         * Style reset string
         * @public
         * @property
         * @type {string}
         */
        this.styleReset = ' [re]';
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
     * @param {string} fn - Target function name
     * @param {Array<*>} data - Arguments
     * @param {null|string} prepend - Style to prepend, default: null
     * @param {string} append - Style to append, default: null|OutputStyler.defaultReset
     * @return {void}
     */
    _write( fn, data, prepend = null, append = null ) {
        append = append || this.defaultReset;
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
     * @param {...*} data - Data to log
     * @return {void}
     */
    log( ...data ) {
        this._write( 'log', data );
    }

    /**
     * Red error style
     * @public
     * @param {...*} data - Data to log
     * @return {void}
     */
    error( ...data ) {
        this._write( 'error', data, this.style.error, this.styleReset );
    }

    /**
     * Yellow warning style
     * @public
     * @param {...*} data - Data to log
     * @return {void}
     */
    warn( ...data ) {
        this._write( 'warn', data, this.style.warn, this.styleReset );
    }

    /**
     * Cyan info style
     * @public
     * @param {...*} data - Data to log
     * @return {void}
     */
    info( ...data ) {
        this._write( 'info', data, this.style.info, this.styleReset );
    }

    /**
     * Green success style
     * @public
     * @param {...*} data - Data to log
     * @return {void}
     */
    success( ...data ) {
        this._write( 'log', data, this.style.success, this.styleReset );
    }
}

/**
 * Default cfx instance
 * @type {OutputStyler}
 */
const cfx = new OutputStyler();

// Export all public references
module.exports = {
    ASCIIREF,
    OutputStyler,
    cfx,
};
