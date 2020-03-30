require("dotenv").config();

module.exports = {
	title: "difys docs",
	tagline: "Touch botting framework",
	url: "https://difysjs.github.io",
	baseUrl: "/",
	docsUrl: "",
	projectName: "difysjs",
	organizationName: "difysjs",
	headerLinks: [
		{ doc: "introduction/quick-start", label: "Quick Start" },
		{
			href: "https://www.github.com/difysjs/difys",
			label: "Github"
		}
	],
	headerIcon: "img/difys.svg",
	footerIcon: "img/difys.svg",
	favicon: "img/favicon.ico",
	colors: {
		primaryColor: "#151515",
		secondaryColor: "#ffb800"
	},
	docsSideNavCollapsible: true,
	/*
	fonts: {
		myFont: [
		"Times New Roman",
		"Serif"
		],
		myOtherFont: [
		"-apple-system",
		"system-ui"
		]
	},
  	*/
	copyright: `Copyright © ${new Date().getFullYear()} Difys team`,
	highlight: {
		theme: "monokai"
	},
	scripts: [
		"/scripts/sidebarScroll.js",
		"/scripts/codeblock.js",
		"https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.6/clipboard.min.js",
		"https://buttons.github.io/buttons.js"
	],
	onPageNav: "separate",
	cleanUrl: true,
	enableUpdateBy: true,
	enableUpdateTime: true,
	repoUrl: "https://github.com/difysjs/difys"
};