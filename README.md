# gh-tag

[![Release](https://img.shields.io/github/v/release/libnudget/gh-tag?logo=github&label=latest)](https://github.com/libnudget/gh-tag/releases)

A GitHub Action that creates annotated semver tags with consistent
messages from CI.

gh-tag checks whether the tag already exists, creates it as an annotated
tag pointing at the current commit, and reports whether it was created.
It pairs with [release-notes](https://github.com/libnudget/release-notes)
to turn a push into a fully tagged release.

## Usage

```yaml
- uses: libnudget/gh-tag@main
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    tag: 0.2.0
    message: "Release 0.2.0"
```

To fail the workflow when the tag already exists instead of skipping it:

```yaml
- uses: libnudget/gh-tag@main
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    tag: 0.2.0
    check-if-exists: "true"
```

## Inputs

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `token` | yes | `github.token` | Token with permission to create tags. |
| `tag` | yes | — | Semver tag to create. A `v` prefix is added if missing. |
| `message` | no | tag name | Message for the annotated tag. |
| `check-if-exists` | no | `false` | Fail if the tag already exists instead of skipping it. |

## Outputs

| Name | Description |
| --- | --- |
| `tag` | The normalized tag that was created or already existed. |
| `created` | `true` when the tag was created, `false` when it already existed. |

## Development

```sh
npm install
npm run lint
npm test
```

## License

MIT
