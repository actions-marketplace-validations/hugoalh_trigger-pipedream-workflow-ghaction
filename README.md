# Trigger Pipedream Workflow (GitHub Action)

[`TriggerPipedreamWorkflow.GitHubAction`](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction)

![GitHub Action](https://img.shields.io/badge/GitHub%20Action-2088FF?logo=github-actions&logoColor=ffffff&style=flat-square "GitHub Action")
![License](https://img.shields.io/static/v1?label=License&message=MIT&style=flat-square "License")
[![GitHub Stars](https://img.shields.io/github/stars/hugoalh/trigger-pipedream-workflow-ghaction?label=Stars&logo=github&logoColor=ffffff&style=flat-square "GitHub Stars")](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/stargazers)
[![GitHub Contributors](https://img.shields.io/github/contributors/hugoalh/trigger-pipedream-workflow-ghaction?label=Contributors&logo=github&logoColor=ffffff&style=flat-square "GitHub Contributors")](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/graphs/contributors)
[![GitHub Issues](https://img.shields.io/github/issues-raw/hugoalh/trigger-pipedream-workflow-ghaction?label=Issues&logo=github&logoColor=ffffff&style=flat-square "GitHub Issues")](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr-raw/hugoalh/trigger-pipedream-workflow-ghaction?label=Pull%20Requests&logo=github&logoColor=ffffff&style=flat-square "GitHub Pull Requests")](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/pulls)
[![GitHub Discussions](https://img.shields.io/github/discussions/hugoalh/trigger-pipedream-workflow-ghaction?label=Discussions&logo=github&logoColor=ffffff&style=flat-square "GitHub Discussions")](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/discussions)
[![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/hugoalh/trigger-pipedream-workflow-ghaction?label=Grade&logo=codefactor&logoColor=ffffff&style=flat-square "CodeFactor Grade")](https://www.codefactor.io/repository/github/hugoalh/trigger-pipedream-workflow-ghaction)

| **Releases** | **Latest** (![GitHub Latest Release Date](https://img.shields.io/github/release-date/hugoalh/trigger-pipedream-workflow-ghaction?label=&style=flat-square "GitHub Latest Release Date")) | **Pre** (![GitHub Latest Pre-Release Date](https://img.shields.io/github/release-date-pre/hugoalh/trigger-pipedream-workflow-ghaction?label=&style=flat-square "GitHub Latest Pre-Release Date")) |
|:-:|:-:|:-:|
| [![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=ffffff&style=flat-square "GitHub")](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/releases) ![GitHub Total Downloads](https://img.shields.io/github/downloads/hugoalh/trigger-pipedream-workflow-ghaction/total?label=&style=flat-square "GitHub Total Downloads") | ![GitHub Latest Release Version](https://img.shields.io/github/release/hugoalh/trigger-pipedream-workflow-ghaction?sort=semver&label=&style=flat-square "GitHub Latest Release Version") | ![GitHub Latest Pre-Release Version](https://img.shields.io/github/release/hugoalh/trigger-pipedream-workflow-ghaction?include_prereleases&sort=semver&label=&style=flat-square "GitHub Latest Pre-Release Version") |

## 📝 Description

A GitHub Action to trigger Pipedream workflow via SDK or webhook.

## 📚 Documentation

> **⚠ Important:** This documentation is v3.0.0 based; To view other release's/tag's/version's documentation, please visit the [releases/tags/versions list](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/tags) and select the correct release/tag/version.

### Getting Started

#### Install (For Self Host)

- GitHub Actions Runner >= v2.297.0
  - NodeJS ^ v16.13.0

#### Use

```yml
jobs:
  job_id:
    runs-on: "________" # Any
    steps:
      - uses: "hugoalh/trigger-pipedream-workflow-ghaction@<tag/version>"
```

### 📥 Input

> | **Legend** | **Description** |
> |:-:|:--|
> | 🔐 | Should be an encrypted secret. |

#### `key`

**🔐** `<string>` Key; SDK key, SDK URL, webhook key, and webhook URL forms are acceptable.

```
https://sdk.m.pipedream.net/pipelines/pipedream-workflow-key/events  ⬅SDK URL
                                      ^^^^^^^^^^^^^^^^^^^^^^         ⬅SDK Key

https://pipedream-workflow-key.m.pipedream.net  ⬅Webhook URL
        ^^^^^^^^^^^^^^^^^^^^^^                  ⬅Webhook Key
```

#### `method`

**\[Optional\]** `<string>` Method to trigger.

- **Default:** Let this action automatically determine the best method.
- **`"sdk"`:** Use SDK.
- **`"webhook"`:** Use webhook.

When this input is not defined, and input `key` is a:

- SDK key, SDK URL, or webhook key, will use `"sdk"`.
- webhook URL, will use `"webhook"`.

#### `payload`

**\[Optional\]** `<object = {}>` JSON/YAML/YML payload.

### 📤 Output

#### `response`

`<string>` Response content.

#### `status_code`

`<number>` Request status code.

#### `status_ok`

`<boolean>` Whether the request was successful.

#### `status_text`

`<string>` Request status text.

### Example

```yml
jobs:
  job_id:
    name: "Trigger Pipedream Workflow"
    runs-on: "ubuntu-latest"
    steps:
      - uses: "hugoalh/trigger-pipedream-workflow-ghaction@v3.0.0"
        with:
          key: "${{secrets.PIPEDREAM_WORKFLOW_KEY}}"
          payload: |
            message: "Hello, world!"
```

### Guide

#### GitHub Actions

- [Enabling debug logging](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/enabling-debug-logging)
- [Encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
