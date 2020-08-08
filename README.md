# Mail-in-a-Box User Interface

![Build and Publish](https://github.com/badsyntax/mailinabox-ui/workflows/Build%20and%20Publish/badge.svg)

An experimental SPA user interface for Mail-in-a-Box, using the following tools:

- React & Redux
- TypeScript
- [Fluent UI](https://github.com/microsoft/fluentui) design system
- [Mail-in-a-Box API client](https://github.com/badsyntax/mailinabox-api)

**NOTE**: This is very much alpha software, use at your own risk. See [FEATURES.md](https://github.com/badsyntax/mailinabox-ui/blob/master/FEATURES.md) for missing features.

## Screenshots

👉 [View Screenshots](https://github.com/badsyntax/mailinabox-ui/wiki/Screenshots)

## Demo

👉 [View Demo](https://badsyntax.github.io/mailinabox-ui/)

Use any email and any password to log in.

The demo uses a mock API, you can perform any action.

## Running Locally

### Requirements

- Node.js

### Instructions

1. Clone the repo
2. Copy `src/config/config.example.json` to `src/config/config.json` and
   - Update the `hostname` field, or
   - If you want to use a mock API, set `mockApi` to `true`
3. From the root of the project:
   1. Run `npm install`
   2. Run `npm start`

All API requests sent from the browser are proxied to your box instance via a backend Node.js server to bypass CORS restrictions.

## Running in Production

Production releases can be found here: https://github.com/badsyntax/mailinabox-ui/releases

The releases assume you're running the UI at url `/admin/`. 

## Related Projects

This project uses a [Mail-in-a-Box API client SDK](https://www.npmjs.com/package/mailinabox-api), generated by https://github.com/badsyntax/mailinabox-api.

## Features

See [FEATURES.md](./FEATURES.md)

## License

See [LICENSE.md](./LICENSE.md)
