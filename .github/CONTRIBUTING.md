# Contributing

Following these guidelines will make your pull request easier to merge.

## Prerequisites

- Install [EditorConfig](http://editorconfig.org/) plugin for your code editor to make sure it uses correct settings.
- Fork the repository and clone your fork.
- Install dependencies: `npm install`.

## Development workflow

Always make sure to lint and test your code before pushing it to GitHub:

```bash
npm run test && npm run lint
```

After testing and linting, create a changeset for your changes:

```bash
npm run changeset
```

## Other notes

- Do not change the version number inside the `package.json` file.
- Do not update the `CHANGELOG.md` file.

## Need help?

Feel free to ask.
