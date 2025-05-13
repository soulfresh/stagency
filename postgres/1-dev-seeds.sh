#!/bin/bash
set -e

# For all TSV files in the seeds folder, copy their data into the appropriate table.
# To work, the TSV file name must match the name of the table to insert into and the
# TSV must have a header line with the name of the columns to insert into.

for f in /app/seeds/dev/*.tsv
do
echo "Processing seed file: $f"

TABLE="$(basename $f .tsv)"
echo "Copying into table: $TABLE"

read -r HEADER < "$f"
echo "TSV header: $HEADER"

COLUMNS=${HEADER//$'\t'/,}
echo "Importing columns: $COLUMNS"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  COPY app.$TABLE ($COLUMNS)
  FROM '$f'
  DELIMITER E'\t'
  ESCAPE '\'
  CSV HEADER;
EOSQL
done

