# backend-express-nodejs

## First
first you need to run node ./util/genSecretKey.js, this will generate secret key in console & save this key in .env file with TOKEN_SECRET.

## Second 
Run these command
``` npx sequelize-cli init ``` and then run ``` npx sequelize-cli db:migrate ```
for undo run this
``` npx sequelize-cli db:migrate:undo:all ```
Note you need to create todo

# Note 
You will also need to install postgres sql in your local mechine & connect it on sql workbench or DBraver desktop app
