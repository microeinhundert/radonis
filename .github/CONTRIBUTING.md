# Contributing

Following these guidelines will make your pull request easier to merge.

## Prerequisites

- Install [EditorConfig](http://editorconfig.org/) plugin for your code editor to make sure it uses correct settings.
- Fork the repository and clone your fork.
- Install dependencies: `pnpm install`.

## Development workflow

First, create a changeset for your changes:

```bash
pnpm run changeset
```

Always make sure to lint and test your code before pushing it to GitHub:

```bash
pnpm run test && pnpm run lint
```

## Other notes

- Do not change the version number inside the `package.json` file.
- Do not update the `CHANGELOG.md` file.

## Need help?

Feel free to ask.
