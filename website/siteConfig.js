require('dotenv').config()
/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
	title: "difys docs", // Title for your website.
	tagline: "Touch botting framework",
	url: "https://difysjs.github.io", // Your website URL
	baseUrl: "/",
	docsUrl: '', // Base URL for your project */
	// For github.io type URLs, you would set the url and baseUrl like:
	//   url: 'https://facebook.github.io',
	//   baseUrl: '/test-site/',

	// Used for publishing and more
	projectName: "difysjs",
	organizationName: "difysjs",
	// For top-level user or org sites, the organization is still the same.
	// e.g., for the https://JoelMarcey.github.io site, it would be set like...
	//   organizationName: 'JoelMarcey'

	// For no header links in the top nav bar -> headerLinks: [],
	headerLinks: [
		{ doc: 'introduction/quick-start', label: 'Quick Start' },
		{ doc: 'plugins/plugins-api', label: 'API' },
		{
			href: 'https://www.github.com/difysjs/difys',
			label: 'Github'
		}
	],

	// If you have users set above, you add it here:
	//users,

	/* path to images for header/footer */
	headerIcon: "img/difys.svg",
	footerIcon: "img/difys.svg",
	favicon: "img/favicon.ico",

	/* Colors for website */
	colors: {
		primaryColor: "#151515",
		secondaryColor: "#ffb800"
	},
	docsSideNavCollapsible: true,
	/* Custom fonts for website */
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

	// This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
	copyright: `Copyright © ${new Date().getFullYear()} Difys team`,

	highlight: {
		// Highlight.js theme to use for syntax highlighting in code blocks.
		theme: 'monokai'
	},

	// Add custom scripts here that would be placed in <script> tags.
	scripts: [
		'/scripts/sidebarScroll.js',
		'/scripts/codeblock.js',
		'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
		'https://buttons.github.io/buttons.js'
	],

	// On page navigation for the current documentation page.
	onPageNav: "separate",
	// No .html extensions for paths.
	cleanUrl: true,

	// Open Graph and Twitter card images.
	/* ogImage: "img/undraw_online.svg",
	twitterImage: "img/undraw_tweetstorm.svg", */

	// For sites with a sizable amount of content, set collapsible to true.
	// Expand/collapse the links and subcategories under categories.
	// docsSideNavCollapsible: true,

	// Show documentation's last contributor's name.
	enableUpdateBy: true,

	// Show documentation's last update time.
	enableUpdateTime: true,

	// You may provide arbitrary config keys to be used as needed by your
	// template. For example, if you need your repo's URL...
	//   repoUrl: 'https://github.com/facebook/test-site',
	repoUrl: "https://github.com/difysjs/difys"
}

module.exports = siteConfig
