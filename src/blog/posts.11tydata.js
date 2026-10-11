// Áp dụng cho mọi bài trong thư mục blog/ (Cẩm nang du lịch)
// URL: /cam-nang/{tên-file}/
module.exports = {
  layout: "post.njk",
  tags: ["post"],
  permalink: "/cam-nang/{{ page.fileSlug }}/",
};
