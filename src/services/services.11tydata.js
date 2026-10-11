// Áp dụng cho mọi bài trong thư mục services/ (dịch vụ, khách sạn, vận chuyển, căn hộ)
// URL được tạo theo danh mục và tên file: /{danh-mục}/{tên-file}/
const { categories } = require("../_data/menu.json");

module.exports = {
  layout: "page.njk",
  tags: ["service"],
  permalink: "/{{ category }}/{{ page.fileSlug }}/",
  eleventyComputed: {
    eyebrow: (data) => {
      const cat = categories.find((c) => c.slug === data.category);
      return cat ? cat.name : "";
    },
  },
};
