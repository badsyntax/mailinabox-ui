# mailinabox UI

## Features

## API

- [x] API client
- [ ] Mock data returned from API client via middleware
- [ ] Error handling for all requests

## State

- [x] Redux store
- [ ] Reduce the amount of selectors - extract from state directly (see redux-toolkit advanced docs)
- [x] Top-level URL state
- [ ] Sub-level URL state (eg `/mail/users/add`)
- [ ] Don't always refresh data lists on mount, instead refresh them after actions, and store open groups in  state
- [ ] Normalise store (eg when performing actions, don't replicate entities): https://redux.js.org/introduction/learning-resources#normalization

## Main layout

- [x] Primary Nav
- [x] Body containers

## Status Checks

- [x] Render checks in a list view
- [ ] Reboot
- [ ] Disable new versions
- [ ] Select headings
- [x] Prevent virtual rendering
- [ ] Add filter for domain
- [x] Add summary

## TLS Certificates

- [x] Show certificate status
- [x] Form to install custom certificates
- [x] Install custom certificate
- [x] Replace custom certificate
- [ ] can_provision logic (`/ssl/provision`)
- [ ] Generate CSR without country selection

## External DNS

- [ ] Download Zone file

## Mail

- [ ] Download instructions PDF

## Backups

- [x] Save config

## Forms

- [ ] Simplify field data handling - use object instead of separate vars

## Auth

 - [ ] Log out
 - [ ] Middleware for redirections with 405

## Performance

- [ ] Async imports & code splitting

## Accessibility

- [ ] Mobile support (not possible with fluentui)
- [ ] ARIA labels
- [ ] Audit
