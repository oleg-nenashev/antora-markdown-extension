'use strict'

/**
 * Markdown Loader component for Antora
 *
 * Uses Asciidoctor.js to load AsciiDoc content in a way that integrates tightly
 * with the Antora environment. It resolves include files, page references, and
 * image references to files in Antora's virtual content catalog.
 *
 * @namespace markdown-loader
 */
module.exports = require('./load-markdown')
