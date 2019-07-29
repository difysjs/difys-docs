---
id: plugins
title: Plugins
sidebar_label: Plugins
hide_title: true
---

# Plugins

Plugins are one of the core aspect difys is built on, you could see difys as an empty vessel without plugins.

On this doc, we'll cover mostly how do they work and what are the things you should know before starting making plugins, the [PluginsAPI](../plugins/plugins-api) page covers a more detailed explanation.

## Making your first plugin

What's a better way of learning than starting by making a plugin? We'll try to implement a plugin that will handle some chat features! This doc already expects you to have a decent knowledge in javascript and how it works, but nevertheless, you could always learn and experiment with plugins!

### Making a folder

First let's start by making a folder inside `~/src/Plugins/`
>**Note on naming**
>
>It is mandatory that your folder name starts with caps and doesn't contain any spaces or special characters
>
>Something like **Chat** or **MyChatPlugin**

### Creating the basic files

As much as we will leave you complete freedom on how to structure your plugin, you have to make an `index.js` that will act as the core of your plugin, you can also have a `config.js` but it's not mandatory.

### `index.js`

1. First let's start by defining an `info` constants that will hold some of the information about the plugin.

```js
import config from "./config";

const info = {
	name: "Chat",
	description: "Handles chat features",
	author: "Difys",
	version: "0.0.1",
	config: config
};
```

`name`: The name of your plugin (Must be the same as the folder name)

`description`: A brief description of what your plugin does

`author`: The name of the author (Make sure it's not the same name as your dofus accounts, ankama is watching)

`version`: Helps keep track of the version of your plugin, if you don't have any idea on how to do versionning, why dont you go ahead and check [SemVer](https://semver.org/)

`config`: The config file you created and we imported. It's in the same folder we created so it's 
```js 
import config from "./config";
```

2. Now, let's make the core. A plugin is essentially a [javascript class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), Why don't we start by defining that in our `index.js`?

```js
class Chat {
	constructor() {}
}
```
> The class name should be the same as the folder and the name we specified in `info`

Okay there are a couple of stuff that may seem weird at first but let's go through them one by one. A constructor basically holds some information that difys will use in order to make your plugin up and running. Let's add some entries to that `contructor() {}`

```js
class Chat {
	constructor() {
		this.config = info.config;
		this.listeners = [];
		this.exports = [];
		this.connections = {};
	}
}
```

> The keyword `this` refers to the class name, in this case `Chat`, so `this.config` <=> `Chat.config`

`PluginName.config`: This holds the configuration of your plugin, it's not mandatory but we highly encourage it.

Before we could talk about listeners, make sure you're familiar with [javascript class methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Class_body_and_method_definitions)

`PluginName.listeners`: Basically an [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of methods, we will visit this later when we will start adding plugin listeners.

`PluginName.exports`: An array of static methods that could be used in scripting, we will also visit this when we will start adding scripting functionalities to difys using plugins.

`PluginName.connections`: An empty [object](https://www.geeksforgeeks.org/objects-in-javascript/) at start, when the plugin is mounted it is preferable that it takes `username: Socket()`
Such as:
```js
PluginName.connections = {
	myUsername: Socket(),
	Zed: Socket()
}
```

We will explain further how `connections` work later in the docs.

Now after defining our `listeners`, `exports`, `config` and `connections`, let's start with the first method that every plugin should have, the `mount` method

```js
class Chat {
	constructor() {
		this.config = info.config;
		this.listeners = [];
		this.exports = [];
	}
	mount(connections) {}
}
```
What we want to do in mount essentially, is to add to `this.connections` the accounts we want to hook with our plugin, this is a good place to implement some kind of logic that only hook usernames defined in the plugin configuration, but to keep things simple, we add every account.

>`mount` is also a good place to log that the plugin is up and running.

Let's do all of that!

```js
class Chat {
	constructor() {
		this.config = info.config;
		this.listeners = [];
		this.exports = [];
	}
	mount(connections) {
		// You could always use the difys logging tool but to keep it simple we'll be using console.log()
		console.log("Chat plugin mounting process started");
		this.connections = connections;
		console.log("All accounts hooked");
		console.log("Chat plugin up!");
	}
}
```

That's it for a basic plugin that does nothing! Now let's try and make stuff interesting.

Basically on how the dofus socket server works, is that it sends and receives `messages` to the client. If you want to know more about the socket system dofus uses, head to the [Touch Protocol](../other/protocol/socket.md) page!

We are interested in one `message`, the `ChatServerMessage`. Each time someone sends a chat message to the server, everyone receives this message with a [payload](https://en.wikipedia.org/wiki/Payload_(computing)). Each message got a different payload and we will try and map them out in the [messages](../other/protocol/messages.md) page.

Every message holds 2 main parts `socket` and `data`

`socket`: The account socket class which holds the account information the message was sent to and some methods so you can send messages to the server.

`data`: The message data, this one varies from message to message. (You can use [Lindo](https://github.com/prixe/lindo) to intercept the data, check our [plugins tips and tricks](../plugins/tips) page for more information)

In the case of `CharServerMessage`, the `data` looks like this:

```json
channel: 5
content: "17 M dispo pour OFFRE EN OR"
fingerprint: "rrjfdasd"
senderAccountId: 54621354
senderId: 56489132
senderName: "Bigdosse"
timestamp: 156213546
urls: []
_isInitialized: true
_messageType: "ChatServerMessage"
```

The idea is that we want some kind of way to log these messages in the console, we are interested in basically 2 keys, `content` and `senderName`

First let's start by defining our class method like this:

```js
class Chat {
	constructor() {
		this.config = info.config
		this.listeners = []
		this.exports = []
		this.connections = {}
	}
	ChatServerMessage(payload) {
		const sender = payload.data.senderName;
		const content = payload.data.content;
		console.log(`${sender} says ${content}`);
	}
}
```

We're not quite done yet, we still need to add the `ChatServerMessage` to the `this.listeners` array, lets do that!

```js
this.listeners = [this.ChatServerMessage];
```

Now, each time a message is sent to the chat, difys will fire the `Chat.ChatServerMessage`.

One last thing, don't forget to export your plugin class at the end of the file!

```js
export default Chat;
```

**Final `index.js`**
```js
import config from "./config";

const info = {
	name: "Chat",
	description: "Handles chat features",
	author: "Difys",
	version: "0.0.1",
	config: config
};

class Chat {
	constructor() {
		this.config = info.config;
		this.listeners = [this.ChatServerMessage];
		this.exports = [];
		this.connections = {};
	}

	mount(connections) {
		console.log("Chat plugin mounting process started");
		this.connections = connections;
		console.log("All accounts hooked");
		console.log("Chat plugin up!");
	}

	ChatServerMessage(payload) {
		const sender = payload.data.senderName;
		const content = payload.data.content;
		console.log(`${sender} says ${content}`);
	}

export default Chat;
```

And you're done! You've made your first plugin :)

Now, this is a basic introduction to plugins, if you want a more advanced tutorial, where we talk about `exports` to add scripting functionalities and using the difys `logger` library, head out to the [Plugins API](../plugins/plugins-api) page








