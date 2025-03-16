// This is done to do the mapping for Assertions, Hooks and Step Definition files
const common = `
    -f json:cucumber_report.json
    --publish-quiet
    --require setup/assertions.js
    --require setup/hooks.js
    --require 'steps/**/*.js'
`
module.exports = {
  default: `${common} features/**/*.feature`,
  debug: `${common} --inspect-brk features/**/*.feature`
}

