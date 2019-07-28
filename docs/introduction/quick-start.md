---
id: quick-start
title: Quick Start
sidebar_label: Quick Start
hide_title: true
---

# Getting started with difys

Difys is a touch botting **[framework](https://en.wikipedia.org/wiki/Software_framework)**.

It helps you power up your botting potential to be more than just scripts, it introduces *plugins*, microservices and an intensive API making interractions with the socket server easy from beginners to advanced users.

While it's designed for servers in mind, difys can be run in different environments, if they can run Node, they can run difys (Linux, Windows, Mac...)

## Installation

Currently, the difys CLI is still in development, the only way to install difys is by cloning its public [github repository](https://github.com/difysjs/difys)

For more details, see the [**Installation**](installation.md) page.

## The Difys Core

Difys by itself is just a set of *modules* that handles your connection to the game with a generalized game data store and a plugins API, if you're interested in how difys is working, see the [**Difys Core**](core.md) page. ( If you want to make plugins, reading this is a must! )

## Plugins

Plugins are a new way to enable users to communicate with the native socket connection that touch offers.

Maybe you want to add a new scripting function? Or listen to specific events that are not implemented in difys itself, plugins offer that possibly and with an easy API too!

### Public Plugins

We are also working on a public repository of plugins, something like npm that you can easily use from within the cli with `difys add publicPlugin`

For more details on how to use/make plugins, see the [**Plugins**](plugins.md) page.

## Scripting

Scripts enables you to control the flow of what actions your bot should take in a sequencial way. It's a way for you to use plugins exported functions AND utility functions provided by difys. Head out to the [**Scripts**](scripts.md) page for more information.

## Help and discussion

We currently don't have a forum and we are not planning to open one in the near future. For now, we think that [**Discord**](https://discord.gg/vgvgN2n) is okey and we are very active there. Make sure to check it out!

## Should You Use Difys?

While difys was made with servers in mind, you could always use it in your day-to-day computer, but *should you*?

Honestly, only you can answer that question, while currently difys is very behind from other botting clients out there, keep in mind that we are always growing, and we think that the whole plugins technology will help us grow faster. Difys alpha will be run solely in the terminal, and we aren't planning for a web/mobile interface until _atleast_ the beta.

So should you use difys as your main botting client? Maybe, if you're feeling courageous, while it's pretty much still very young, it won't hurt to give it a shot, explore the possibilities and try to **make plugins**!