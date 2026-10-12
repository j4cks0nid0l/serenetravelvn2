module.exports = function (eleventyConfig) {
  // Static assets copied as-is to the output folder
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Collections
  eleventyConfig.addCollection("services", (api) =>
    api.getFilteredByGlob("src/services/*.md")
  );
  eleventyConfig.addCollection("posts", (api) =>
    api
      .getFilteredByGlob("src/blog/*.md")
      .sort((a, b) => b.date - a.date)
  );

  // Filters
  eleventyConfig.addFilter("servicesIn", (list, categorySlug) =>
    (list || [])
      .filter((s) => s.data.category === categorySlug)
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  );
  eleventyConfig.addFilter("viDate", (value) =>
    new Date(value).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Asia/Ho_Chi_Minh",
    })
  );
  eleventyConfig.addFilter("isoDate", (value) =>
    new Date(value).toISOString().slice(0, 10)
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
};
