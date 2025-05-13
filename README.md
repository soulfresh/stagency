# Stagency v3

## Development Environment Setup

1. Install Yarn (Required):

```!#bin/bash
> brew install yarn
```

2. Optionally install nvm and avn to automatically switch node versions.

- [Node Version Manager](https://github.com/nvm-sh/nvm)
- [Automatic Version Switching for Node.js](https://github.com/wbyoung/avn)

3. Install Docker and Docker Compose

- [Docker Desktop](https://docs.docker.com/get-docker/) is the simplest solution and includes both Docker and Docker
Compose.

4. Install Hasura CLI

- [NPM](https://hasura.io/docs/latest/graphql/core/hasura-cli/install-hasura-cli/#install-through-npm) is the simplest
way to get the `hasura` command. You'll need to install it globally since the backend services are currently not NodeJS
projects.

## Running the Frontend

There are two options for developing the app.

1. Develop against the mock data server. In this setup, all API requests are
dynamically mocked by the front end and you don't need to connect to Docker or any live
services.
1. Develop against a locally running backed. In this setup you will run the
GraphQL APIs locally with Docker and point the app towards those APIs.

### Running Against Mocks

```!#bin/bash
> cd react-frontend
> yarn start-mock
```

This will start the development server using mock APIs based on our GraphQL
schema. If you need to make any changes to the GraphQL schema during
development, you will need to switch to running the local GraphQL environment,
make your changes, download the schema into the frontend project and then you
can go back to developing against the mocks. For more information, see the
documentation in the `react-frontend` project.

### Running Against a Local Backend

```!#bin/bash
> docker compose up -d
> cd react-frontend
> yarn start
```

This will start the Docker environment with a local Postgres DB and Hasura
GraphQL API and will run the frontend project against the APIs running in Docker.

## Running the Local Backend

Our backend is run using `docker compose` which will start up Hasura and Postgres for you.

```!#bin/bash
> docker compose up -d
```

> Be aware that you will need to shut down docker manually when you are finished
> with your development.

You can connect to the Hasura Console via Hasura CLI to verify the metadata and migrations were applied.
To run hasura cli commands you need to be in the `graphql-engine/stagency` folder
(next to the `config.yaml` file).

```!#bin/bash
> cd ./graphql-engine/stagency
> hasura console
```

Database migrations and Hasura metadata are automatically applied when starting the
Docker environment. This can take a little time so if you get a connection error running
`hasura console` right after starting the Docker environment, wait 30 seconds and try
again. You can also keep an eye on the Docker logs with `docker compose logs -f` to watch
the migration status.

You can also see what migrations have been applied with

```!#bin/bash
> hasura migrate status

VERSION        NAME                             SOURCE STATUS  DATABASE STATUS
1629994276879  Adding data ingestion tables...  Present        Present
1632438246782  add_inbound_email_attachment...  Present        Present
```

### Making the DB schema

Hasura is used to manage database migrations which means all schema changes need to be performed
through the Hasura CLI or Console.

#### Making schema changes through the Console

The simplest way to edit the schema is through the Hasura Console.

1. run `hasura console` from the `graphql-engine/stagency` folder
  - This opens a web browser with the Hasura Console UI
1. Make any changes you want to the database or object relationships through the Console UI
  - This will track changes in migration files for every change you make.
  - You can find some documentation on this process
    [here](https://hasura.io/docs/latest/graphql/core/migrations/migrations-setup/#step-5-add-a-new-table-and-see-how-migrations-and-metadata-is-updated)
1. When your feature is ready for PR, squash your migrations into a single migration file for the
   current feature.
  - This is described in the [migrations
  documentation](https://hasura.io/docs/latest/graphql/core/migrations/migrations-setup/#step-6-squash-migrations-and-add-checkpoints-to-version-control)
  - And the [hasura migrate docs](https://hasura.io/docs/latest/graphql/core/hasura-cli/hasura_migrate_squash/)
1. Commit everything in the `graphql-engine/stagency` folder and push your changes.

#### Making schema changes through the Hasura CLI

It's also possible to create schema migration files directly through the Hasura CLI. This requires
running the [hasura migrate create](https://hasura.io/docs/latest/graphql/core/hasura-cli/hasura_migrate_create/)
command with the text of the migration you want to apply.


```!#bin/bash
> hasura migrate create \
    migration-name \
    --up-sql "CREATE TABLE article(id serial NOT NULL, title text NOT NULL, content text NOT NULL);"  \
    --down-sql "DROP TABLE article;""
```

This will generate up and down migration files in the `graphql-engine/stagency/migrations` folder. You'll next need
to track the metadata for your schema changes by either running `hasura console` and making updates there or by
manually editing the metadata files as described [in the
docs](https://hasura.io/docs/latest/graphql/core/migrations/config-v2/reference/metadata-format/)

#### Making schema changes manually

If you really want to, you can also manually create and edit migration files as described in the
[hasura docs](https://hasura.io/docs/latest/graphql/core/migrations/advanced/writing-migrations-manually/).

### Fixing Inconsistent Hasura Metadata

Sometimes you may find yourself in a situation where the Hasura metadata does not match the database schema. In these
situations, you'll receive an error from Hasura CLI or the web console that `WARN Metadata is inconsistent`. To resolve
the errors you can either fix the Hasura metadata or migrate the database to the correct version as follows.

#### Fix Hasura Metadata

To fix the Hasura metadata, use the
[`hasura metadata ic list`](https://hasura.io/docs/latest/graphql/core/hasura-cli/hasura_metadata_inconsistency/) to
list all of the relationships that are inconsistent. Note the relationships and then use the button in the Console to
remove all inconsistent metadata fields. Then manually fix any relationships from the previous inconsistencies list
using the Console UI.

> You can also perform all of these tasks through the CLI if you prefer.

#### Fix Database to bring Hasuar into a consistent state

If the Hasura metadata is correct but the database schema is old, you can use `hasura migrate apply` to apply all Hasura
migrations to bring the database in sync with the metadata. You may also need to reapply the Hasura metadata with
`hasura metdata apply`.

### Resetting Hasura Metadata and Migrations

If you need to reset Hasura and the database to a fresh state, you can use the following commands.

```sh
> hasura metadata clear
> hasura migrate delete --all --server --database-name default
```

If you want to verify the current state, use `hasura migrate status`:

```sh
> hasura migrate status
Database: default
VERSION        NAME                                       SOURCE STATUS  DATABASE STATUS
1644204563684  init                                       Present        Not Present
1650058433523  alter_table_app_deal_add_deal_status_type  Present        Not Present
```

You can now re-apply all Hasura migrations and metadata:

```sh
> hasura migrate apply
> hasura metadata apply
```

## Closing the application

Docker needs to be told explicitly to close all running app containers. Simply
exiting out of the terminal will not properly stop them, and issues will arise
if you try to run the application again. Use this command to properly close the
application.

```!#bin/bash
> docker-compose down -v
```

> The `-v` (or `--volumes`) flag will shut down the volumes used to store data. This will
> ensure the database starts up in a completely fresh state.

## Storybook

A lot of the frontend development happens in our component library provided by
Storybook. You can startup storybook with


```!#bin/bash
> cd react-frontend
> yarn storybook
```

> More information is provided in the react-frontend README

