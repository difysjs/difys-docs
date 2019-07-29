---
id: configuration
title: Configuration
sidebar_label: Configuration
hide_title: true
---

# Configuration

All of difys' configuration is done in the `./src/Config ` directory, we tried to modularize it to make it easier for users. 

In this doc, will go through the various configuration files to get you up and started using difys.

## Accounts
`~/src/Config/accounts.js`

First things first, let's add a couple of accounts

Here's an example accounts.js which represents adding a new account:

```js
const accountsList = {
	myUsername: {
		username: "myUsername",
		password: "mySuperSecretPassword",
		proxy: false,
		directLogin: false
	},
	Zed: {
		username: "Zed",
		password: "mySuperSecretPassword",
		proxy: "135.65.43.11",
		directLogin: false,
		server: "Oshimo",
		character: "myCharacter"
	}
};

export default accountsList;
```
>**Note on boilerplate**
>
>_myUsername_ must be written twice, if your username is Alistar, you'll have to both define it as an accountsList property **and** as a value for `username`.
>
>Resulting in `Alistar.username = "Alistar"`
>
>This is called [normalizing](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape) and it helps with easy access to the data, you'll find the same pattern in our generalized redux data store docs

An account is an object inside the accountList.

### `directLogin` boolean

* `true`: difys will ignore `server` and `character` and will directly connect you to the last character you were connected to.
* `false`: difys will check the server and the character and tries to connect you to it.

### `proxy` string
If you want, you can specify a proxy. We highly recommend using proxies, check our [usage guide](../usage/guide.md) to help secure yourself against bans

## General
`~/src/Config/general.js`

Holds the general configuration of difys.

```js
const general = {
	country: "fr",
	language: "fr",
	telemetry: true,
	logLevel: "debug"
};

export default general;
```

### `telemetry` boolean
Enabling this will send some usage data to difys, in order to make it better.

**What you will send**

* Performance data including CPU usage, memory etc..
* Platforms difys is used on
* Fights data

**What you will not send**

* Your account information or anything that might expose your account

### `logLevel` string
* `debug`: logs everything
* `verbose`: logs details and everything beneath
* `info`: only logs information

>**Note on logging**
>
>This only handles difys' core and base plugins logging, other community-made plugins may use a different logging system.

