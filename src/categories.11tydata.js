// Tiêu đề và mô tả của mỗi trang danh mục lấy từ src/_data/menu.json
module.exports = {
  eleventyComputed: {
    title: (data) => data.cat.name,
    description: (data) => data.cat.description,
  },
};
