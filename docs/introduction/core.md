---
id: core
title: The difys core
sidebar_label: The Core
hide_title: true
---

# The Difys Core
The difys core consists generally of two things, the `ModuleLoader` and the `PluginLoader`, and an entry to control the flow of mounting these two things. We generally refer to the ModuleLoader as the core, but it's not explicitly the case.

## The Entry
aka `~/src/index.js`


### Grabbing the Metadata
We first get the metadata which includes:

`assetsVersion`: Includes both the assetsVersion and the staticDataVersion

`appVersion`: We grab this from the itunes store search API in order to tell the socket that we are running the latest version of dofus touch

`buildVersion`: We grab this from the script.js (The game source code). Special thanks to Zirpoo for making this the fastest grab in the west.

### Initiating

Then initiate all plugins by mounting the `PluginLoader` with the connections returned from the `ModuleLoader`

## The `ModuleLoader`

The `ModuleLoader` is essentially a class that, when mounted, loops through the accountsList specified in the `accounts.js` and spawns a `Connection` class that grabs the token and spawns a `Socket` to connect to the game.

## The `PluginLoader`

