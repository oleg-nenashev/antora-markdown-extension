'use strict'

const _documentConverter = require('@antora/document-converter')

var temp = require('temp'),
    fs   = require('fs'),
    util  = require('util'),
    exec = require('child_process').exec;

/**
 * Registers the Markdown converter that is supported by Antora out-of-the-box
 */
const registerMarkdownConverter = () => {
  _documentConverter.registerConverter(new MarkdownConverter())
}

class MarkdownConverter {
  constructor () {
    super('markdown', ['text/markdown'])
  }

  loadAsciiDoc (file, contentCatalog = undefined, config = {}) {
    return loadMarkdown(file, contentCatalog, config)
  }

  extractMetadata (doc) {
    return extractMarkdownMetadata(doc)
  }
}

function loadMarkdown (file, contentCatalog = undefined, config = {}) {
    var tempName = temp.path({suffix: '.adoc'});
    var tmpFile = new File(tempName);

    // TODO: Actually we want to cache the files eventually
    temp.track();

    runKramdown(file, tempName);

    return requireAsciiDocLoader.loadAsciiDoc(tmpFile, contentCatalog, config)
}

function extractMarkdownMetadata (doc) {
  let metadata = requireAsciiDocLoader().extractAsciiDocMetadata(doc)
  // TODO: inject markdown specifics
  return metadata; 
}

/**
 * Runs Kramdown-asciidoc to do the actual conversion
 * @param {File} markdownFile Markdown file
 * @param {String} outputfile Output file where AsciiDoc will be written
 */
function runKramdown (markdownFile, outputfile) {
  // Follows https://github.com/asciidoctor/kramdown-asciidoc
  // TODO: Support passing kramdoc configs
  const commandLine = 'kramdoc -o ' + outputfile + ' ' + markdownFile.Path + ' | wc -l' 
  exec(commandLine, (err, stdout, stderr) => {
    if (err) {
      // TODO: propagate error
      return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

function requireAsciiDocLoader () {
    return requireAsciiDocLoader.cache || (requireAsciiDocLoader.cache = require('@antora/asciidoc-loader'))
}

module.exports = registerMarkdownConverter
