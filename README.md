# GraphQL Server + PostgreSQL Deployment to Heroku

* `heroku create <App>`
* `heroku addons:create heroku-postgresql:hobby-dev --app <App>`
* `heroku config:set NPM_CONFIG_PRODUCTION=false YARN_PRODUCTION=false SECRET=<Value> --app <App>`
