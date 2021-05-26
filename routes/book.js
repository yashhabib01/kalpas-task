const router = require("express").Router();
const csv = require("fast-csv");
const Books = require("../model/books");
const fs = require("fs");
const multer = require("multer");
const mongoose = require("mongoose");

const { protect } = require("../middlewares/auth");

const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
  const books = await Books.find();

  if (books.length === 0) {
    res.status(400).json({ success: false, message: "No data found" });
  } else {
    res.status(200).json({ success: true, books });
  }
});

router.post("/add", protect, async (req, res) => {
  const { name, author, genre, price } = req.body;

  if (!name || !author || !genre || !price) {
    res.status(400).json({ success: false, message: "Fields are empty" });
  }

  const BookExist = await Books.findOne({ name });
  if (BookExist) {
    res.status(400).json({ success: false, message: "Book is already Exits" });
  }

  const book = await Books.create({
    name,
    author,
    genre,
    price,
  });
  if (book) {
    res.status(201).json({
      success: true,
      message: "Book added",
      data: {
        _id: book._id,
        name: book.name,
        author: book.author,
        genre: book.genre,
        price: book.price,
      },
    });
  } else {
    res.status(400);
    res.status(400).json({ success: false, message: "Invalid book data" });
  }
});

router.put("/update/:id", protect, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Enter valid Id" });
  }

  const book = await Books.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  if (!book) {
    res.status(400).json({ success: false, message: "Something went wrong  " });
  } else {
    res
      .status(200)
      .json({ success: true, message: "Book Updated", data: book });
  }
});

router.delete("/delete/:id", protect, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Enter valid Id" });
  }

  const deleteBook = await Books.findById(req.params.id);
  if (deleteBook) {
    await deleteBook.remove();
    res
      .status(200)
      .json({ success: true, message: "Book deleted Successfully" });
  } else {
    res.status(400).json({ success: false, message: "Book delete failed" });
  }
});

router.post("/upload", upload.single("csvfile"), protect, async (req, res) => {
  if (!req.file)
    return res
      .status(400)
      .json({ success: false, message: "No files were uploaded." });

  let bookFile = req.file;

  let books = [];

  fs.createReadStream(bookFile.path)
    .pipe(csv.parse({ headers: true }))
    .on("error", (error) => console.error(error))
    .on("data", (row) => {
      row["_id"] = new mongoose.Types.ObjectId();
      console.log(row);
      books.push(row);
    })
    .on("end", () => {
      Books.create(books, function (err, documents) {
        if (err)
          res.status(400).json({
            success: false,
            message: "Something went wrong try again",
          });
      });

      res.status(200).json({
        success: true,
        message: ` ${books.length} books have been successfully uploaded`,
      });
    });
});

module.exports = router;
