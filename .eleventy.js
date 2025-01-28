const pluginSass = require('eleventy-sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  
  eleventyConfig.addPlugin(pluginSass, {
    postcss: postcss([autoprefixer]),
    input: './src/css/*.sass',
    output: './_site/css',
  });

  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addPassthroughCopy('src/css/*.css');
  eleventyConfig.addPassthroughCopy('src/js');
  eleventyConfig.addPassthroughCopy('src/img');
  eleventyConfig.setServerOptions({
    liveReload: true,
    domDiff: true,
    port: 3000,
    watch: [],
    showAllHosts: true,
    encoding: "utf-8",
    showVersion: false,
    indexFileName: "index.html",
    onRequest: {},
  });

  return {
    dir: {
      input: 'src',
    },
  };
};
