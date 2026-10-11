// Áp dụng cho các trang tĩnh (chính sách, điều khoản...)
// URL: /{tên-file}/
module.exports = {
  layout: "page.njk",
  permalink: "/{{ page.fileSlug }}/",
};
