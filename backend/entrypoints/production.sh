#!/bin/sh
set -e

echo "WAITING FOR DATABASE. DB_HOST = $DB_HOST"
./entrypoints/wait-for.sh $DB_HOST:5432
npx sequelize-cli db:migrate --migrations-path src/migrations || true

exec "$@"
