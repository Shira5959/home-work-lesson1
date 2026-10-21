const books = [
    { code: 1, name: "book1", category: "category1", price: 100, isBorrowed: true,
      borrowedBy: { date: "2023-01-01", code: 101 } },
    { code: 2, name: "book2", category: "category2", price: 200, isBorrowed: false,
      borrowedBy: null },
    { code: 3, name: "book3", category: "category3", price: 300, isBorrowed: true,
      borrowedBy: { date: "2023-02-01", code: 102 } }
];

module.exports = { books };