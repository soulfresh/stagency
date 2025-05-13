# postgres

This folder contains the initialization scripts for the Postgres database.

## Migrations

Database migrations are managed by the Hasura migration tool. The setup scripts in this folder are only intended for
standing new databases (in production or development). See the top level README for instructions on standing up new
databases and applying migrations.

## Development Seeds

In addition to initializing the database, this project also contains data seeds for each environment in the `/seeds`
folder. Development seeds include `.js` files that can generate fake data for use in development. Each `.js` file should
generate a `.tsv` data file matching a table and columns in the database. All `.tsv` files in the `/seeds/{env}` folder
will be automatically copied into the database when is starts.

### Data .tsv Files

Each `.tsv` file in `/seeds/{env}` should include the data for a single table in the database. The file name **MUST**
match the table name and the column headers must match column headers in the table. You are not required to
include every column in the table (ex. you don't need to specify any `id` or `updated_at` columns).
