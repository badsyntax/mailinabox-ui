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

- Clone the repo
- Change directory to root of project
- Run `npm install`
- Run `npm start`

All API requests sent from the browser are proxied to your box instance via a backend Node.js server to bypass CORS restrictions.

## Running in production

TODO

## Features & TODO

See [FEATURES.md](./FEATURES.md)
