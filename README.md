# Mail-in-a-Box User Interface

An experimental SPA user interface for Mail-in-a-Box, using the following tools:

- React & Redux
- TypeScript
- [Fluent UI](https://github.com/microsoft/fluentui) design system
- [Mail-in-a-Box API client](https://github.com/badsyntax/mailinabox-api)

## Running locally

### Requirements

- Node.js

### Instructions

1. Clone the repo
2. Copy `src/config/index.example.json` to `src/config/index.json` and update the `hostname` field within `index.json` to point to your box
3. From the root of the project:
   1. Run `npm install`
   2. Run `npm start`

All API requests sent from the browser are proxied to your box instance via a backend Node.js server to bypass CORS restrictions.

## Running in production

TODO

## Features & TODO

See [FEATURES.md](./FEATURES.md)

## License

See [LICENSE.md](./LICENSE.md)
