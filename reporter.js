const reporter = require('cucumber-html-reporter')

// These options will be used at the time of HTML Report generation
const options = {
  theme: 'bootstrap',
  jsonFile: 'reports/cucumber_report.json',
  output: 'reports/cucumber_report.html',
  screenshotsDirectory: 'reports/screenshots/',
  storeScreenshots: true,
  reportSuiteAsScenario: true,
  scenarioTimestamp: true,
  launchReport: true,
  failedSummaryReport: true,
  metadata: {
    'App Version': '2.0.0',
    'Test Environment': 'STAGING',
    Browser: 'Chrome 101.0.4951.41',
    Platform: 'MAC OS Monterary - Version: 12.3.1',
  },
}

reporter.generate(options)

