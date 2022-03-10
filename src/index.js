const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs')
const extractReportInformations = require('./extractReportInformations')
const buildComment = require('./buildComment')


async function run() {
    try {
        const token = core.getInput('token', { required: true })
        const reportFilepath = core.getInput('reportFilepath')
        const octokit = github.getOctokit(token);
        const { context = {} } = github;
        const { pull_request } = context.payload;

        const results = extractReportInformations(reportFilepath)

        console.log(results)
        console.log(buildComment(results))

        await octokit.rest.issues.createComment({
            ...context.repo,
            issue_number: pull_request.number,
            body: buildComment(results)
        });
        if (results.nbFailed > 0) {
            await octokit.rest.pulls.update({
                ...context.repo,
                pull_number: pull_request.number,
                state: 'closed'
            })
            core.error("Some tests have failed")
            core.setFailed("Some tests have failed")
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run()