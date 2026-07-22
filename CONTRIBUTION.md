# Contributing

## Development

Install dependencies and run the checks before opening a pull request:

```sh
pnpm install --frozen-lockfile
pnpm test -- --runInBand
pnpm build
```

## Release configuration

Releases are handled by [the release workflow](.github/workflows/release.yml). The workflow runs when a
tag whose name starts with `v` is pushed. The tag version must exactly match the version in `package.json`.

Configure an Actions secret named `NPM_TOKEN` before the first release:

1. Open the repository's **Settings > Secrets and variables > Actions** page.
2. Add a repository secret named `NPM_TOKEN` with an npm access token that can publish this package.
3. Optionally create a GitHub Environment named `npm` and configure required reviewers for releases.

`GITHUB_TOKEN`, `GITHUB_REF_NAME`, and the npm registry URL are provided by GitHub Actions and do not need
to be configured manually.

## Publishing a release

Start from an up-to-date branch with a clean working tree. Create the version commit and tag, then push both:

```sh
git switch main
git pull --ff-only
pnpm install --frozen-lockfile
pnpm test -- --runInBand
pnpm build
npm version patch
git push --follow-tags origin main
```

Use `npm version minor` or `npm version major` when appropriate. The workflow validates the version, installs
dependencies, runs tests, builds all distributions, checks the package contents, publishes to npm with
provenance, and creates a GitHub Release.

Prerelease versions such as `1.9.0-beta.0` are automatically published with the npm `next` dist-tag:

```sh
npm version prerelease --preid=beta
git push --follow-tags origin main
```

## Retrying a failed release

For transient infrastructure failures, use **Re-run jobs** from the failed workflow run. A rerun always uses
the workflow and source from the commit referenced by the existing tag.

If the workflow itself had to be fixed, rerunning the old job will not use that fix. The safest option is to
publish a new patch version after merging the workflow change:

```sh
npm version patch
git push --follow-tags origin main
```

If the failure happened before npm publishing and no GitHub Release was created, the original tag may instead
be recreated on the fixed commit. Verify both conditions before doing this:

```sh
git tag -d v1.8.0
git push origin :refs/tags/v1.8.0
git tag v1.8.0
git push origin HEAD
git push origin v1.8.0
```

Never move or reuse a tag after that version has been published to npm. npm package versions are immutable;
create a new patch version instead.
