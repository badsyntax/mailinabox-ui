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

### Status Checks

- [x] List checks
- [ ] Reboot
- [ ] Disable new versions
- [x] Prevent virtual rendering?
- [ ] Add filter for domain
- [x] Add summary

### TLS Certificates

- [x] List certificate status
- [x] Install custom certificate
  - [ ] Generate CSR without country selection
- [ ] can_provision logic (`/ssl/provision`)
- [x] Replace/Install actions

### Backup Status

- [x] List backup status
- [x] Save backup config
  - [x] Reflect current backup config in form

### Custom DNS

- [x] List custom DNS records
- [x] Add custom DNS record
- [x] Remove custom DNS record
- [x] Add secondary nameserver
  - [ ] Add secondary nameserver clear instructions
- [ ] Update API schema to support omitting type (for dynadns) - add new endpoints

### External DNS

- [x] List all DNS records with corresponding info
- [ ] Download Zone file (Zone file generator)

### Mail Instructions

- [x] List instructions
- [ ] Download instructions PDF

### Mail Users

- [x] List mail users
- [x] Update mail user privilege (normal/admin)
- [x] Update mail user password
- [x] Archive mail user account
- [x] Add mail user
- [ ] Fix user actions (eg archive)

### Mail Aliases

- [x] List mail aliases
- [x] Update mail alias
  - [x] Prevent update of alias address
  - [x] Prevent changing type
- [x] Remove mail alias
- [x] Add mail alias

### Contacts/Calendar

- [x] List Contacts & Calendar Synchronization information
- [ ] Download sync guide

### Web

- [x] List domains
- [x] Change domain root directory
- [x] List uploading instructions

### API

- [x] API client
- [ ] Mock data returned from API client via middleware
- [x] Error handling for all requests

### State

- [x] Redux store
- [ ] Reduce the amount of selectors - extract from state directly (see redux-toolkit advanced docs)
- [x] Top-level URL state
- [ ] Sub-level URL state (eg `/mail/users/add`)
- [ ] Don't always refresh data lists on mount, instead refresh them after actions, and store open groups in state
- [ ] Normalise store (eg when performing actions, don't replicate entities): https://redux.js.org/introduction/learning-resources#normalization

### Main layout

- [x] Primary Nav
- [x] Body containers

### Forms

- [ ] Simplify field data handling - use object instead of separate vars

### Auth

- [x] Log in
 - [x] Remember me (stored in local/session storage)
- [x] Log out
- [ ] Middleware for redirections with 405

### Performance

- [ ] Async imports & code splitting
- [ ] Try reduce bundle size

### Routes

- [ ] Fix 404
- [ ] External DNS route jumps when changing nested routes

### Accessibility

- [ ] Mobile support (not possible with fluentui)
- [ ] ARIA labels
- [ ] Audit

### Production

- [ ] Customise the root box url

### Project Setup

- [ ] README updated
- [ ] LICENSE added
