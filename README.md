# backend-express-nodejs

## First
first you need to run node ./util/genSecretKey.js, this will generate secret key in console & save this key in .env file with TOKEN_SECRET.

## Second 
run these command
``` npx sequelize-cli db:migrate ```
for undo run this
``` npx sequelize-cli db:migrate:undo:all ```
