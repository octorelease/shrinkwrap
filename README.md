# Prune Shrinkwrap plugin

[Octorelease](https://github.com/octorelease/octorelease) plugin to prune npm shrinkwrap files.

[![Build Status](https://github.com/octorelease/prune-shrinkwrap/workflows/Test/badge.svg)](https://github.com/octorelease/octorelease/actions?query=workflow%3ATest+branch%3Amaster)
[![npm latest version](https://img.shields.io/npm/v/@octorelease/prune-shrinkwrap/latest.svg)](https://www.npmjs.com/package/@octorelease/prune-shrinkwrap)
<!-- [![npm next version](https://img.shields.io/npm/v/@octorelease/prune-shrinkwrap/next.svg)](https://www.npmjs.com/package/@octorelease/prune-shrinkwrap) -->

| Step | Description |
|------|-------------|
| `init` | Validate plugin configuration. |
| `version` | Prune unwanted dependencies from npm shrinkwrap file. |

## Install

```bash
$ npm install @octorelease/prune-shrinkwrap -D
```

## Usage

The plugin can be configured in the [Octorelease configuration file](https://github.com/octorelease/octorelease/blob/master/docs/usage.md#configuration):

```json
{
  "plugins": [
    "@octorelease/prune-shrinkwrap"
  ]
}
```

## Configuration

### Options

| Options | Description | Default |
| ------- | ----------- | ------- |
| `filters` | List of [package dependency flags](https://github.com/npm/arborist#package-dependency-flags) to prune from shrinkwrap. | `["dev", "extraneous"]` |
| `packages` | Folder patterns of packages in monorepo that should have shrinkwrap pruned. | `false` |

### Examples

To prune shrinkwrap for only the CLI package in a monorepo:

```json
{
  "plugins": [
    ["@octorelease/prune-shrinkwrap", {
      "packages": ["packages/cli"]
    }]
  ]
}
```
