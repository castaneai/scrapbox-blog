const fetch = require("isomorphic-unfetch");

const projectName = "help-jp";

module.exports = {
  env: {
    projectName: projectName
  },
  exportTrailingSlash: true,
  exportPathMap: async () => {
    const paths = {
      "/": { page: "/" }
    };
    console.log(`crawling scrapbox (project: ${projectName})`);
    const uriBase = `https://scrapbox.io/api/pages/${projectName}`;
    const posts = (
      await (await fetch(`${uriBase}?sort=created&limit=10`)).json()
    ).pages;
    posts.forEach(post => {
      paths[`/posts/${post.title}`] = {
        page: "/posts/[title]",
        query: { title: post.title }
      };
    });
    return paths;
  }
};
