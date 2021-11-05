# Trigger Pipedream Workflow (GitHub Action Edition)

[`TriggerPipedreamWorkflow.GitHubAction`](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction)
[![GitHub Contributors](https://img.shields.io/github/contributors/hugoalh/trigger-pipedream-workflow-ghaction?label=Contributors&logo=github&logoColor=ffffff&style=flat-square)](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/graphs/contributors)
[![GitHub Issues](https://img.shields.io/github/issues-raw/hugoalh/trigger-pipedream-workflow-ghaction?label=Issues&logo=github&logoColor=ffffff&style=flat-square)](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr-raw/hugoalh/trigger-pipedream-workflow-ghaction?label=Pull%20Requests&logo=github&logoColor=ffffff&style=flat-square)](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/pulls)
[![GitHub Discussions](https://img.shields.io/github/discussions/hugoalh/trigger-pipedream-workflow-ghaction?label=Discussions&logo=github&logoColor=ffffff&style=flat-square)](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/discussions)
[![GitHub Stars](https://img.shields.io/github/stars/hugoalh/trigger-pipedream-workflow-ghaction?label=Stars&logo=github&logoColor=ffffff&style=flat-square)](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/hugoalh/trigger-pipedream-workflow-ghaction?label=Forks&logo=github&logoColor=ffffff&style=flat-square)](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/network/members)
![GitHub Languages](https://img.shields.io/github/languages/count/hugoalh/trigger-pipedream-workflow-ghaction?label=Languages&logo=github&logoColor=ffffff&style=flat-square)
[![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/hugoalh/trigger-pipedream-workflow-ghaction?label=Grade&logo=codefactor&logoColor=ffffff&style=flat-square)](https://www.codefactor.io/repository/github/hugoalh/trigger-pipedream-workflow-ghaction)
[![LGTM Alerts](https://img.shields.io/lgtm/alerts/g/hugoalh/trigger-pipedream-workflow-ghaction?label=Alerts&logo=lgtm&logoColor=ffffff&style=flat-square)
![LGTM Grade](https://img.shields.io/lgtm/grade/javascript/g/hugoalh/trigger-pipedream-workflow-ghaction?label=Grade&logo=lgtm&logoColor=ffffff&style=flat-square)](https://lgtm.com/projects/g/hugoalh/trigger-pipedream-workflow-ghaction)
[![License](https://img.shields.io/static/v1?label=License&message=MIT&color=brightgreen&style=flat-square)](./LICENSE.md)

| **Release** | **Latest** (![GitHub Latest Release Date](https://img.shields.io/github/release-date/hugoalh/trigger-pipedream-workflow-ghaction?label=%20&style=flat-square)) | **Pre** (![GitHub Latest Pre-Release Date](https://img.shields.io/github/release-date-pre/hugoalh/trigger-pipedream-workflow-ghaction?label=%20&style=flat-square)) |
|:-:|:-:|:-:|
| [**GitHub**](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/releases) ![GitHub Total Downloads](https://img.shields.io/github/downloads/hugoalh/trigger-pipedream-workflow-ghaction/total?label=%20&style=flat-square) | ![GitHub Latest Release Version](https://img.shields.io/github/release/hugoalh/trigger-pipedream-workflow-ghaction?sort=semver&label=%20&style=flat-square) | ![GitHub Latest Pre-Release Version](https://img.shields.io/github/release/hugoalh/trigger-pipedream-workflow-ghaction?include_prereleases&sort=semver&label=%20&style=flat-square) |

## 📝 Description

A GitHub Action to trigger Pipedream workflow via SDK or webhook.

*Previous named "\[GitHub Action\] Send To Pipedream".*

## 📚 Documentation

> **⚠ Important:** This documentation is v2.0.0-beta.1 based. To view other tag's/version's documentation, visit the [tag/version list](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/tags) and select the correct tag/version.

### 🎯 Entrypoint / Target

#### Default (`+default`)

> **⚠ Important:** This entrypoint is currently based to <u>Docker (`+docker`)</u>, base can be changed between versions without announcement to ensure the stability.

```yml
jobs:
  job_id:
    runs-on: # Depend on the base requirement, recommended "ubuntu-________"
    steps:
      - uses: "hugoalh/trigger-pipedream-workflow-ghaction@<tag/version>"
```

#### Docker (`+docker`)

```yml
jobs:
  job_id:
    runs-on: "ubuntu-________"
    steps:
      - uses: "hugoalh/trigger-pipedream-workflow-ghaction/use-docker@<tag/version>"
```

##### Require Software

- Docker

#### NodeJS (`+nodejs`)

> **⚠ Important:** This entrypoint maybe need extra steps to manually setup NodeJS version.

```yml
jobs:
  job_id:
    runs-on: *any*
    steps:
      - uses: "hugoalh/trigger-pipedream-workflow-ghaction/use-nodejs@<tag/version>"
```

##### Require Software

- NodeJS (>= v14.15.0) + NPM (>= v6.14.8)

#### PowerShell (`+powershell`)

> **⚠ Important:**
> - This entrypoint is suitable for advanced user.
> - This entrypoint's input `method` is always `"webhook"`.

```yml
jobs:
  job_id:
    runs-on: *any*
    steps:
      - uses: "hugoalh/trigger-pipedream-workflow-ghaction/use-powershell@<tag/version>"
```

##### Require Software

- PowerShell (>= v7.1.0)

### 📥 Input

> | **Legend** | **Description** |
> |:-:|:--|
> | 🔐 | Should be an encrypted secret. |

#### `key`

**🔐** `<string>` SDK key or webhook URL.

#### `method`

**\[Optional\]** `<string>` Method to trigger.

- **Default:** Let this action automatically determine the best method.
- **`"sdk"`:** Use SDK.
- **`"webhook"`:** Use webhook.

When this input is not defined, and input `key` is a:

- SDK key, will use `"sdk"`.
- webhook, will use `"webhook"`.

#### `payload`

**\[Optional\]** `<object = {}>` JSON payload.

#### `dryrun`

**\[Optional\]** `<boolean = false>` Dry run; For debug use.

### 📤 Output

*N/A*

### Example

```yml
jobs:
  job_id:
    name: "Trigger Pipedream Workflow"
    runs-on: "ubuntu-latest"
    steps:
      - uses: "hugoalh/trigger-pipedream-workflow-ghaction@v2.0.0"
        with:
          key: "${{secrets.PIPEDREAM_KEY}}"
          payload: |
            {
              "message": "Hello, world!"
            }
```

### Guide

#### GitHub Actions

- [Enabling debug logging](https://docs.github.com/en/actions/managing-workflow-runs/enabling-debug-logging)
- [Encrypted secrets](https://docs.github.com/en/actions/reference/encrypted-secrets)
