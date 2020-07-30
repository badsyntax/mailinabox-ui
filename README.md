# mailinabox UI

## Features

## API

- [x] API client
- [ ] Mock data returned from API client via middleware
- [ ] Error handling for all requests

## State

- [x] Redux store
- [ ] Reduce the amount of selectors - extract from state directly (see redux-toolkit advanced docs)
- [x] Top-level URL state
- [ ] Sub-level URL state (eg `/mail/users/add`)
- [ ] Don't always refresh data lists on mount, instead refresh them after actions, and store open groups in  state

## Main layout

- [x] Primary Nav

## Status Checks

- [x] Render checks in a list view
- [ ] Reboot
- [ ] Disable new versions
- [ ] Select headings
- [x] Prevent virtual rendering
- [ ] Add filter for domain
- [x] Add summary

## TLS Certicates

- [x] Show certificate status
- [x] Form to install custom certificates
- [ ] Install custom certificate
- [ ] Replace custom certificate
- [ ] can_provision logic (`/ssl/provision`)

## External DNS

- [ ] Download Zone file

## Mail

- [ ] Download instructions PDF

## Backups

- [ ] Save config

## Auth

 - [ ] Log out
 - [ ] Middleware for redirections with 405

## Performance

- [ ] Async imports & code splitting

## Accessibility

- [ ] Mobile support (not possible with fluentui)
- [ ] ARIA labels
- [ ] Audit
