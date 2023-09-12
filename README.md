
## Install Yarn package manager

```bash
$ npm install --global yarn
```

## Install project dependencies

On root folder:
```bash
$ yarn 
```

## Install Redis

This project uses Redis to store sessions and caching API responses. You will need to have a Redis server instance running locally or remotely.

If using Redis locally, you should install it following the [appropiate instructions for your operative system](https://redis.io/docs/getting-started/).

If you have already installed Redis go to the next step to run it.

## Start Redis server

```bash
$ redis-server
```
## Create an .env file

Add all enviroment variables required for the project following the .env.template guide.

## Run the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

```
## Share, comment and collaborate

Thank you uwu