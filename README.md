# sfimport-auth0

## Requirements

* [NodeJS](https://nodejs.org/en/)

## Installation and Execution

```bash
npm install
```

Complete these configurations

```js
// run.js
var SF_ADMIN_USERNAME = ""; // specify admin username here (needs api permissions. generic support account should be ready to use support@elasticpath.com)
var SF_ADMIN_PASSWORD = ""; // specify admin password here
var SF_ADMIN_PASSWORD_SECURITY_TOKEN = ""; // If you don't know this, reset your password
```

run

```bash
node run.js
```

The output will be a generic file with a JSON array containing user details. Note the file location.

## Importing to auth0

Navigate to

* [Auth0 Management API](https://auth0.com/docs/api/management/v2)

Scroll and click into Jobs -> Import users

Underneath Scopes click

```bash
create:users
```

Underneath Parameters

* users - Click and navigate to the file outputted earlier.
* connection_id - the id of the DB you're importing to. Can be obtained by referring to Connections -> Get all connections earlier in the documentation
* upsert - true
* external_id

Execute by clicking TRY
