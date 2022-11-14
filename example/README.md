# Radonis Example Application

## Getting Started

Create a `.env` file in the project root. For default environment variables, refer to `.env.example`.

Start the database locally:

```console
docker compose up -d
```

Migrate the database for the first time:

```console
node ace migration:fresh
```

Start the project for development:

```console
npm run dev
```

Build the project for production:

```console
npm run build
```

> Tip: Install the AdonisJS VSCode extension for a better development experience.
