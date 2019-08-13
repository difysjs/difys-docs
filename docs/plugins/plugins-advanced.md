---
id: plugins-advanced
title: Plugins - Advanced
sidebar_label: Plugins - Advanced
hide_title: true
---

# Plugins - Advanced tutorial

We talked about plugins earlier in a merely basic way, the difys plugin API is evolving really fast and while we add more and more functionalities to it, let's explore plugins in an advanced way.

In this tutorial you will learn the following stuff:

- Advanced plugin API
- Making your own utility functions
	- Making a logger
	- Making a simple calculator from an api
- Interacting with the game
	- Receive messages
	- Process them
	- Send messages
- Interacting with the redux store
	- Making your own actions
	- Dispatching to your plugin store

## The Plugin structure

While we let you to come up with your own structure, this is currently the preferred way of structuring your plugin folder.
>This is also the structure we'll be following in this tutorial
```css
/actions
/utils
index.js
config.js
```

## Our plugin

It's important to lay out first what your plugin is for, what can and what cannot it do. In this tutorial we'll build a **math chatbot plugin**!

Imagine you're in game, you're too lazy to get your calculator up, and you just want to message a friend so it can do your math for you. Sure, your friends can do `1+1`, but how about `652*6521/321+3265-1321` or maybe `cos(3)`? **quick mafs**

So we want to make a plugin and implement it in a bot to do the following stuff:

- Receives and process messages from friends
- Optional `trusted` list that can be configured
- Detect the command `!math`
- If the stuff after the `!math` can be calulcated, it calculates it and sends it back
- Dispatch the number of operations solved to the redux store
- Log errors and operations to the terminal

## Making the structure

After installing difys, let's go ahead and make a folder inside the `~/plugins` directory.

```bash
$ mkdir ChatMath
$ cd ChatMath
$ mkdir actions
$ mkdir utils
$ code .
```

## `index.js`

### The Core of the Plugin
First, we make our `info` const:

```js
import config from "./config";

const info = {
    name: "ChatMath",
    description: "Because my friends can't do quik mafs",
    author: "Difys",
    version: "0.0.1",
    config
};
```

>The `config` file is currently empty but we'll comeback to it later.

Now, the core of our plugin!

```js
class ChatMath {
    constructor() {
        this.config = info.config;
        this.listeners = [];
        this.exports = [];
        this.connections = {};
    }

    mount(connections) {}
}
```

### Utility functions
Let's switch the focus a lil bit to `~/utils/` let's make an `index.js` there and add our first utility function which is a custom logger.
> While it's completely possible to make your custom logger inside the Plugin class, we hugely recommend you keep stuff modular and keep the utility [pure functions](https://www.sitepoint.com/functional-programming-pure-functions/) outside your class.

`/utils/index.js`

```js
import { logger } from "../../../Libs";

/**
 * The ChatBot plugin logger
 * @param {String} message
 */
const myLogger = {
	debug: message => logger.debug(`[ChatMath] ${message}`),
	info: message => logger.info(`[ChatMath] ${message}`),
	warn: message => logger.warn(`[ChatMath] ${message}`),
	error: error => logger.error(new Error(`[ChatMath] ${error}`))
};

/**
 * Evaluates a math expression using an api, because using eval() is bad!
 * @param {String} mathExp
 */
const evaluateMath = async mathExp => {
	// We encode our math expression
	const encodedMathExp = encodeURIComponent(mathExp);
	// concat it with the api string
	const url = `http://api.mathjs.org/v4/?expr=${encodedMathExp}`;
	// we make our request using got and await for it
	const response = await got(url);
	// we return the response
	return response.body;
};

export { myLogger, evaluateMath };
```

We're going to use the difys `logger` library and build our logger on it, this way we can use `myLogger.level()` and it will give us back a shiny log with our plugin name on it ;)

>This can be done in several other ways, maybe faster, maybe prettier, but to keep it plain and simple, we're just gonna go with this for now.

We finally export our utility functions, this way we can access to them from the core by using

```js
import { myLogger } from "./utils";
```

### Mounting

Before we can use the pluginAPI, we need to mount our plugin. Here we can inform the user that our plugin is up and running and hook accounts to our plugin, this is a good place to implement some kind of logic to only mount accounts whom the user defined in our plugin config. So let's go and visit `config.js`.

```js
const config = {
	enabled: true,
	accounts: ["myBotUsername"]
};
export default config
```

Again, we leave to you the freedom to do your own config structure. But to keep things plain and simple we're gonna give the user the ability to add to that array the usernames of bots he want to hook the plugin with, we're also gonna give the ability to the user to enable/disable plugin.

>Following **v0.0.3** you need to return either `false` or `true` in the `mount()` method in order for difys to know wether you want to disable/enable your plugin.

Now back to our mount method at `index.js`

```js
export default class ChatMath {
	constructor() {
		// the constructor stuff
	}

	mount(connections) {
		const accounts = this.config.accounts;
		if (this.config.enabled) {
			myLogger.info("Initiating...");
			// we loop through each account in the config accounts array
			accounts.forEach(account => {
				// we check if the username exists in the difys core connections
				if (connections.hasOwnProperty(account)) {
					// we push the account and its socket into this.connections
					// so that this.connections[account] returns the account socket
					this.connections[account] = connections[account];

					// we let the user know that we hooked the account
					myLogger.info(`${account} hooked successfully!`);
				} else {
					// We didn't find any username in the difys core accounts that exists in our config
					// We let the user know, maybe he mispelled the account username?
					myLogger.warn(
						`${account} doesn't exist in the difys core, are you sure it's correct username?`
					);
				}
			});

			// we inform the user that we finished mounting the plugin
			myLogger.info("Finished mounting!");

			// we return true to the difys core, letting it know that the mounting process was successful
			return true;
		} else {
			myLogger.warn(
				"Plugin disabled, if you wish to reenable it, check your config.js"
			);
			// we return true to the difys core, letting it know that the mounting process was not successful
			// ergo disabling the plugin...
			return false;
		}
	}
}
```

Now that we mounted the plugin, let's go start interacting with the touch server!


### Adding a listener

We covered this back in the basic plugins tutorial, but let's go and revisit it again to make you more familiar on how listeners actually work.

A listener is just a method to your plugin class that has the same name as the one in the touch socket protocol. In this tutorial we are interested in the `ChatServerMessage` let's go ahead and make our method!

```js
async ChatServerMessage(payload) {
	const { socket, data } = payload;
	const { channel, content } = data;

	// We check if it's a private message or not
	// 9 is the id for private messages
	if (channel === 9) {
		// Now we check if the message starts with "!math"
		// With do that with Regular Expressions
		const isCommand = /^(!math)/g;
		if (isCommand.test(content)) {
			// It is! now let's grab our mathematical operation from the message
			const regex = /([A-Za-z0-9-+\-*/()[\]]+)$/g;
			const mathExp = content.match(regex);
			// We send this to our evaluator utility function
			const response = evaluateMath(mathExp);

			// We grab the senderName from the data payload
			const senderName = data.senderName;

			// We log it to debug
			myLogger.debug(`Received a math expression from ${senderName}`);

			// We send the response to him
			// always wrap anything that has await inside "try"
			// this way if there is an error we can send it
			try {
				socket.sendMessage("ChatClientPrivateMessage", {
					// our evaluateMath is an async function it returns a promise
					// let's await that promise
					content: `${await response} quick mafs`,
					receiver: senderName
				});
			} catch (error) {
				// we log the error
				myLogger.error(error);
				// we also send it to the senderName inside the game, why not :)
				socket.sendMessage("ChatClientPrivateMessage", {
					content: "An error has occured!",
					receiver: senderName
				});
			}
		}
	}
}
```

And we're done with the core!
>If you're having a hard time understanding regex, don't worry you're not alone, why don't you go ahead and learn it, it's a very powerful tool and will help you vastly. [Learn it here](https://regexone.com/)!

### The Redux store

Sometimes, we want to store our plugin data somewhere, make it accessible for other plugins AND expose it to the difys server. To do so, difys uses a generalized data store, it's an advanced system that let all modules and plugins communicate with eachothers in a fast, easy way! In this part of the tutorial we're gonna learn how to interact with that store, get data from it and push data to it.

If you want to dive deep into how redux works, check their website https://redux.js.org/

For our use case, we want to store how many times our bot was successful into solving mathematical operations, so each time our bot solves an operation, we increment a counter.

>While it is doable in the plugin constructor, keep in mind that the whole idea of redux is to expose your data to other components of the app, you can see the constructor as local data, while redux as inter data.


#### The State

The state is just an object with your plugin name on it, each account has its own plugins state, so `myFirstAccount.plugins.ChatMath` **is not** `mySecondAccount.plugins.ChatMath`.

The state is normally **immutable** but we're using [ImmerJs](https://github.com/immerjs/immer) which let us workaround and mutate it directly via `actions`.

The plugins state looks like this:

```js
const plugins = {
	ChatMath: {},
	Inventory: {},
	Map: {}
	// Other plugins...
}
```

#### Actions

Redux actions are just functions that change the `state`, we them dispatch via the slice reducers and the redux api handles state updates.

>If you want to read more on advanced plugin redux structure check the [Redux & Plugins](redux-plugins.md) page

Before we can make our incrementing action, first we need to make an initiation action

`/actions/account/chatmath.js`

```js
const initChatMath = (state, action) => {
	// We grab the username from the payload
	const username = action.payload.username;
	// We initiate a counter
	state[username].plugins.ChatMath = {
		solves: 0
	};
};
```

We always take the previous state and the action as an argument, the payload could be everything you want but it will generally look like this most of the time

```js
const payload = {
	username: "someUsername"
	// extra stuff if necessary
}
```

Let's make our incrementing action!

```js
const incrementSolves = (state, action) => {
	const username = action.payload.username;
	// We increment the counter
	state[username].plugins.ChatMath.solved++;
};
```
With immer, we don't have to worry about immutibility, we can mutate the state directly with `++`

We export our actions, and we're ready to go!

```js
export { initChatMath, incrementSolves }
```

## Finishing our plugin

With the new redux part we learned, we can now dispatch `initChatMath()` in the mounting process, then increment our solves with `incrementSolves()` each time the bot makes a solve. Let's do that!

`index.js` - root

First let's import the `accounts` slice and the redux store in order to use and dispatch our actions.

```js
import store from "../../Modules/Store";
import { accounts } from "../Store/reducers/slices";
```

`mount()`
```js
mount(connections) {
	// all the stuff we already did
	this.connections[username] = connections[username];

	// we dispatch with the username in the payload
	store.dispatch(accounts.actions.initChatMath({ username }));
}
```

`ChatServerMessage()`
```js
ChatServerMessage(payload) {
	// we dispatch with the username in the payload
	store.dispatch(
		accounts.actions.increment({
			// We can grab the username from inside payload.socket.account.username
			username: socket.account.username
		})
	);
}
```

Now the number of solves is available everywhere! Even in the difys api.

## Wrapping up

As you can see, with the difys plugin api, the possiblities are endless... You can make literally whatever you want once you master it! We hope it wasn't too hard and if you have more questions don't hesitate to join our discord server. **Make plugins!**

### Final `~/ChatMath/index.js`

```js
import config from "./config";
import { myLogger, evaluateMath } from "./utils/";
import store from "../../Modules/Store";
import { accounts } from "../Store/reducers/slices";

const info = {
	name: "ChatMath",
	description: "Because my friends can't do quik mafs",
	author: "Difys",
	version: "0.0.1",
	config
};

export default class ChatMath {
	constructor() {
		this.config = info.config;
		this.listeners = [this.ChatServerMessage];
		this.exports = [];
		this.connections = {};
	}

	mount(connections) {
		const allAccounts = this.config.accounts;
		if (this.config.enabled) {
			myLogger.info("Initiating...");
			// we loop through each account in the config accounts array
			allAccounts.forEach(username => {
				// we check if the username exists in the difys core connections
				if (connections.hasOwnProperty(username)) {
					// we push the account and its socket into this.connections
					// so that this.connections[account] returns the account socket
					this.connections[username] = connections[username];

					store.dispatch(accounts.actions.initChatMath({ username }));

					// we let the user know that we hooked the account
					myLogger.info(`${username} hooked successfully!`);
				} else {
					// We didn't find any username in the difys core accounts that exists in our config
					// We let the user know, maybe he mispelled the account username?
					myLogger.warn(
						`${username} doesn't exist in the difys core, are you sure it's correct username?`
					);
				}
			});

			// we inform the user that we finished mounting the plugin
			myLogger.info("Finished mounting!");

			// we return true to the difys core, letting it know that the mounting process was successful
			return true;
		} else {
			myLogger.warn(
				"Plugin disabled, if you wish to reenable it, check your config.js"
			);
			// we return true to the difys core, letting it know that the mounting process was not successful
			// ergo disabling the plugin...
			return false;
		}
	}

	async ChatServerMessage(payload) {
		const { socket, data } = payload;
		const { channel, content } = data;

		// We check if it's a private message or not
		// 9 is the id for private messages
		if (channel === 9) {
			// Now we check if the message starts with "!math"
			// With do that with Regular Expressions
			const isCommand = /^(!math)/g;
			if (isCommand.test(content)) {
				// It is! now let's grab our mathematical operation from the message
				const regex = /([A-Za-z0-9-+\-*/()[\]]+)$/g;
				const mathExp = content.match(regex);
				// We send this to our evaluator utility function
				const response = evaluateMath(mathExp);

				// We grab the senderName from the data payload
				const senderName = data.senderName;

				// We log it to debug
				myLogger.debug(`Received a math expression from ${senderName}`);

				// We send the response to him
				// always wrap anything that has await inside "try"
				// this way if there is an error we can send it
				try {
					socket.sendMessage("ChatClientPrivateMessage", {
						// our evaluateMath is an async function it returns a promise
						// let's await that promise
						content: await response,
						receiver: senderName
					});

					// dispatch an incrementation to the redux store!
					store.dispatch(
						accounts.actions.incrementSolves({
							username: socket.account.username
						})
					);
				} catch (error) {
					// we log the error
					myLogger.error(error);
					// we also send it to the senderName inside the game, why not :)
					socket.sendMessage("ChatClientPrivateMessage", {
						content: "An error has occured!",
						receiver: senderName
					});
				}
			}
		}
	}
}
```

### Final `~/ChatMath/utils`

```js
import { logger } from "../../../Libs";
import got from "got";

/**
 * The ChatBot plugin logger
 * @param {String} message
 */
const myLogger = {
	debug: message => logger.debug(`[ChatMath] ${message}`),
	info: message => logger.info(`[ChatMath] ${message}`),
	warn: message => logger.warn(`[ChatMath] ${message}`),
	error: error => logger.error(new Error(`[ChatMath] ${error}`))
};

/**
 * Evaluates a math expression using an api, because using eval() is bad!
 * @param {String} mathExp
 */
const evaluateMath = async mathExp => {
	const encodedMathExp = encodeURIComponent(mathExp);
	const url = `http://api.mathjs.org/v4/?expr=${encodedMathExp}`;
	const response = await got(url);
	return response.body;
};

export { myLogger, evaluateMath };
```

### Final `~/ChatMath/actions/chatmath.js`

```js
const initChatMath = (state, action) => {
	// We grab the username from the payload
	const username = action.payload.username;
	// We initiate a counter
	state[username].plugins.ChatMath = {
		solves: 0
	};
};

const incrementSolves = (state, action) => {
	const username = action.payload.username;
	// We increment the counter
	state[username].plugins.ChatMath.solved++;
};

export { initChatMath, incrementSolves };
```


## Screenshots

</br>
<center><img src="../../img/screenshots/chatmath1.png" alt="Chat Math Screenshot" /></br>

The bot doing quick mafs</center>

</br>
<center><img src="../../img/screenshots/chatmath2.png" alt="Chat Math Screenshot" /></br>

PostMan request to the difys server, ergo the redux store</center>