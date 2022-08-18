# Trigger Pipedream Workflow (GitHub Action)

[`TriggerPipedreamWorkflow.GitHubAction`](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction)
[![GitHub Contributors](https://img.shields.io/github/contributors/hugoalh/trigger-pipedream-workflow-ghaction?label=Contributors&logo=github&logoColor=ffffff&style=flat-square)](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/graphs/contributors)
[![GitHub Issues](https://img.shields.io/github/issues-raw/hugoalh/trigger-pipedream-workflow-ghaction?label=Issues&logo=github&logoColor=ffffff&style=flat-square)](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr-raw/hugoalh/trigger-pipedream-workflow-ghaction?label=Pull%20Requests&logo=github&logoColor=ffffff&style=flat-square)](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/pulls)
[![GitHub Discussions](https://img.shields.io/github/discussions/hugoalh/trigger-pipedream-workflow-ghaction?label=Discussions&logo=github&logoColor=ffffff&style=flat-square)](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/discussions)
[![GitHub Stars](https://img.shields.io/github/stars/hugoalh/trigger-pipedream-workflow-ghaction?label=Stars&logo=github&logoColor=ffffff&style=flat-square)](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/hugoalh/trigger-pipedream-workflow-ghaction?label=Forks&logo=github&logoColor=ffffff&style=flat-square)](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/network/members)
![GitHub Languages](https://img.shields.io/github/languages/count/hugoalh/trigger-pipedream-workflow-ghaction?label=Languages&logo=github&logoColor=ffffff&style=flat-square)
[![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/hugoalh/trigger-pipedream-workflow-ghaction?label=Grade&logo=codefactor&logoColor=ffffff&style=flat-square)](https://www.codefactor.io/repository/github/hugoalh/trigger-pipedream-workflow-ghaction)
[![License](https://img.shields.io/static/v1?label=License&message=MIT&style=flat-square)](./LICENSE.md)

| **Release** | **Latest** (![GitHub Latest Release Date](https://img.shields.io/github/release-date/hugoalh/trigger-pipedream-workflow-ghaction?label=%20&style=flat-square)) | **Pre** (![GitHub Latest Pre-Release Date](https://img.shields.io/github/release-date-pre/hugoalh/trigger-pipedream-workflow-ghaction?label=%20&style=flat-square)) |
|:-:|:-:|:-:|
| [**GitHub**](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/releases) ![GitHub Total Downloads](https://img.shields.io/github/downloads/hugoalh/trigger-pipedream-workflow-ghaction/total?label=%20&style=flat-square) | ![GitHub Latest Release Version](https://img.shields.io/github/release/hugoalh/trigger-pipedream-workflow-ghaction?sort=semver&label=%20&style=flat-square) | ![GitHub Latest Pre-Release Version](https://img.shields.io/github/release/hugoalh/trigger-pipedream-workflow-ghaction?include_prereleases&sort=semver&label=%20&style=flat-square) |

## 📝 Description

A GitHub Action to trigger Pipedream workflow via SDK or webhook.

*Previous named "\[GitHub Action\] Send To Pipedream".*

## 📚 Documentation

> **⚠ Important:** This documentation is v2.2.0 based; To view other tag's/version's documentation, please visit the [tag/version list](https://github.com/hugoalh/trigger-pipedream-workflow-ghaction/tags) and select the correct tag/version.

### 🎯 Entrypoint / Target

```yml
jobs:
  job_id:
    runs-on: "________"
    steps:
      - uses: "hugoalh/trigger-pipedream-workflow-ghaction________@<tag/version>"
```

|  | **`jobs.job_id.runs-on`** | **`jobs.job_id.steps[*].uses`** | **Require Software** |
|:-:|:-:|:-:|:-:|
| **Default (`+default`)** | `ubuntu-________` | *None* | Docker |
| **Docker (`+docker`)** | `ubuntu-________` | `/use-docker` | Docker |
| **NodeJS (`+nodejs`)** | Any | `/use-nodejs` | NodeJS (>= v14.15.0) + NPM (>= v6.14.8) |
| **PowerShell (`+powershell`)** | Any | `/use-powershell` | PowerShell (>= v7.2.0) |

> **⚠ Important:**
>
> - Default entrypoint is currently based to Docker (`+docker`), base can be changed between versions without announcement to ensure the stability.
> - NodeJS entrypoint maybe need extra steps to manually setup NodeJS version.
> - PowerShell entrypoint is suitable for advanced user.

### 📥 Input

> | **Legend** | **Description** |
> |:-:|:--|
> | 🔐 | Should be an encrypted secret. |

#### `key`

**🔐** `<string>` Key; SDK key, SDK URL, webhook key, and webhook URL forms are acceptable.

```
https://sdk.m.pipedream.net/pipelines/pipedream-workflow-key/events
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  SDK URL
                                      ^^^^^^^^^^^^^^^^^^^^^^         SDK Key

https://pipedream-workflow-key.m.pipedream.net
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  Webhook URL
        ^^^^^^^^^^^^^^^^^^^^^^                  Webhook Key
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

**\[Optional\]** `<object>` JSON/YAML/YML payload.

> **⚠ Important:** PowerShell entrypoint only accept JSON payload.

### 📤 Output

*N/A*

### Example

```yml
jobs:
  job_id:
    name: "Trigger Pipedream Workflow"
    runs-on: "ubuntu-latest"
    steps:
      - uses: "hugoalh/trigger-pipedream-workflow-ghaction@v2.2.0"
        with:
          key: "${{secrets.PIPEDREAM_WORKFLOW_KEY}}"
          payload: |
            message: "Hello, world!"
```

### Guide

#### GitHub Actions

- [Enabling debug logging](https://docs.github.com/en/actions/managing-workflow-runs/enabling-debug-logging)
- [Encrypted secrets](https://docs.github.com/en/actions/reference/encrypted-secrets)
