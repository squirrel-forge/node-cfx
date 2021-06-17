/* global require, module, process, console */
'use strict';

/**
 * Requires
 */
const timestamp = require( 'time-stamp' );

/**
 * Code definitions
 *
 * @type {{string: string,...}}
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
 * Output Styler class
 */
class OutputStyler {

    /**
     * Constructor
     *
     * @param {Object} reference - ASCII code reference object
     * @param {Object|console} target - Target object
     */
    constructor( reference, target ) {
        this._target = target || console;
        this._reference = reference;

        /**
         * Settable timestamp format
         * @type {string}
         */
        this.timestampFormat = 'YYYY-MM-DD HH:mm:ss';

        /**
         * Settable auto prepend time
         * @type {boolean}
         */
        this.prependTime = false;
    }

    /**
     * Set styles defined in string
     *
     * @param {string} str - Target string
     *
     * @return {string} - Styled string
     */
    setStyle( str ) {
        if ( typeof str !== 'string' ) {
            return str;
        }
        var styled = str;
        Object.keys( this._reference ).forEach( ( key ) => {
            const regex = new RegExp( '\\[(' + key + ')\\]', 'g' );
            styled = styled.replace( regex, this._reference[ key ] );
        } );
        return styled;
    }

    /**
     * Prepends time if required
     *
     * @return {void}
     */
    _prependTime() {
        if ( this.prependTime ) {
            process.stdout.write( this.setStyle( '[fwhite][[re][th]' + timestamp( this.timestampFormat ) + '[re][fwhite]][re] ' ) );
        }
    }

    /**
     * Write styled
     *
     * @protected
     *
     * @param {function} fn - Target function
     * @param {Array} data - Arguments
     * @param {null|string} prepend - Style to prepend
     * @param {string} append - Style to append
     */
    _write( fn, data, prepend = null, append = ' [re]' ) {
        this._prependTime();
        if ( prepend ) {
            data.unshift( prepend );
            data.push( append );
        }
        for ( let i = 0; i < data.length; i++ ) {
            if ( typeof data[ i ] !== 'object' ) {
                data[ i ] = this.setStyle( data[ i ] );

                if ( typeof data[ i + 1 ] === 'object' ) {
                    data.splice( i + 1, 0, this.setStyle( append ) );
                    i++;
                }
            } else {
                if ( typeof data[ i + 1 ] !== 'object' ) {
                    data.splice( i + 1, 0, this.setStyle( prepend ) );
                    i++;
                }
            }
        }
        if ( !this._target[ fn ] ) {
            fn = 'log'
        }
        this._target[ fn ].apply( this._target, data );
    }

    /**
     * Custom style
     *
     * @param data
     */
    log( ...data ) {
        this._write( 'log', data );
    }

    /**
     * Red error style
     *
     * @param data
     */
    error( ...data ) {
        this._write( 'error', data, '[bred][fwhite] ', ' [re]')
    }

    /**
     * Yellow warning style
     *
     * @param data
     */
    warn( ...data ) {
        this._write( 'warn', data, '[byellow][fblack] ', ' [re]')
    }

    /**
     * Cyan info style
     *
     * @param data
     */
    info( ...data ) {
        this._write( 'info', data, '[bblack][fcyan] ', ' [re]')
    }

    /**
     * Green success style
     *
     * @param data
     */
    success( ...data ) {
        this._write( 'log', data, '[bgreen][fblack] ', ' [re]')
    }
}

/**
 * Default cfx instance
 *
 * @type {OutputStyler}
 */
const cfx = new OutputStyler( ASCIIREF );

/**
 * Export
 * @type {{cfx: OutputStyler, OutputStyler: OutputStyler, ASCIIREF: {string: string, "..."}}}
 */
module.exports = {
    ASCIIREF,
    OutputStyler,
    cfx,
};
