const fs = require("fs")

function extractFailedTests(report, failedArray) {
    Array.from(report.test_suites).filter((testSuite) => testSuite.failed > 0)
        .map((failedTestSuite) => {
            failedTestSuite.tests.filter((test) => test.status === "FAILED")
                .map((failedTest) => {
                    failedArray.push({
                        "function": failedTestSuite.name,
                        "testName": failedTest.name,
                        "messages": failedTest.messages
                    })
                })
        })
    console.log(failedArray)
}

function extractCrashedTests(report, crashedArray) {
    report.test_suites.filter((testSuite) => testSuite.errored > 0)
        .map((crashedTestSuite) => {
            crashedTestSuite.tests.filter((test) => test.status === "ERRORED")
                .map((crashedTest) => {
                    crashedArray.push({
                        "function": crashedTestSuite.name,
                        "testName": crashedTest.name,
                        "messages": crashedTest.messages
                    })
                })
        })
    console.log(crashedArray)
}

function readJSONFile(reportFilename) {
    const content = fs.readFileSync(reportFilename)

    const report = JSON.parse(content)
    return report
}

function extractReportInformations(reportFilename) {
    const report = require(reportFilename)
    let errors = []
    let crashed = []

    extractFailedTests(report, errors)
    extractCrashedTests(report, crashed)

    return {
        "nbFailed": report.failed,
        "nbPassed": report.passed,
        "nbCrashed": report.errored,
        "errors": errors,
        "crashed": crashed
    }
}

module.exports = extractReportInformations