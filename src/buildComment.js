function failsAndCrashsCount(results) {
    if ((results.nbFailed - results.nbCrashed) === 0)
        return results.nbCrashed.toString() + " tests crashed"
    else if (results.nbCrashed)
        return (results.nbFailed - results.nbCrashed).toString() + " tests failed and "
            + results.nbCrashed.toString() + " tests crashed"
    else
        return results.nbFailed.toString() + " tests failed"
}

function buildTable(datas) {
    let table = "| Function | Test name | Messages |\n| --- | --- | ---|\n"

    datas.map((error) => {
        table += "| " + error.function + " | " + error.testName + " | <ul>"
        error.messages.map((message) => {
            table += "<li>" + message + "</li>"
        })
        table += "</ul> |\n"
    })
    return table
}

function addTables(results) {
    if ((results.nbFailed - results.nbCrashed) === 0)
        return "Tests crashed : \n\n" +buildTable(results.crashed)
    else if (results.nbCrashed)
        return  "Tests failed : \n\n" +buildTable(results.errors) + "\n\n\n"
            + "Tests crashed : \n\n" +buildTable(results.crashed)
    else
        return "Tests failed : \n\n" +buildTable(results.errors)
}

function buildFailComment(results) {
    return "❌ "
        + failsAndCrashsCount(results)
        + "\n\n\n\n"
        + addTables(results)
}

function buildSuccessComment() {
    return "✔️Every tests passed successfully"
}

function buildComment(results) {
    if (results.nbFailed > 0) {
        return buildFailComment(results)
    } else
        return buildSuccessComment()
}

module.exports = buildComment