const Product = require("../models/ProductModel");
const fs = require("fs");
const path = require("path");

const getProduct = async (req, res) => {
  try {
    const response = await Product.findAll();

    res.json(response);

    res.status(200).json(products);
  } catch (error) {
    console.log(error.message);
  }
};
const getProductById = async (req, res) => {
  try {
    const response = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

const CreateProduct = async (req, res) => {
  try {
    if (req.files === null)
      return res.status(400).json({ msg: "No File Uploaded" });

    const name = req.body.name;
    const harga = req.body.harga;
    const jumlah = req.body.jumlah;
    const image = req.files.image;
    const fileSize = image.data.length;
    const ext = path.extname(image.name);
    const fileName = image.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedTypes = [".png", ".jpg", ".jpeg"];

    // Validasi
    if (!name || !harga || !jumlah) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    if (!allowedTypes.includes(ext.toLowerCase())) {
      return res.status(422).json({ msg: "Invalid Images" });
    }
    if (fileSize > 5000000) {
      return res.status(422).json({ msg: "Image must be less than 5 MB" });
    }

    const uploadPath = "./public/images/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Simpan file ke direktori
    image.mv(`${uploadPath}${fileName}`, async (err) => {
      if (err) {
        return res.status(500).json({ msg: err.message });
      }
      // Simpan data produk ke database
      try {
        await Product.create({
          name,
          harga,
          jumlah,
          image: fileName,
          url,
        });

        res.status(201).json({ msg: "Product Created Successfully" });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Failed to create product" });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const UpdateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!product) {
      return res.status(404).json({ msg: "No Data Found" });
    }

    const name = req.body.name || product.name;
    const harga = req.body.harga || product.harga;
    const jumlah = req.body.jumlah || product.jumlah;

    let fileName = product.image;
    let url = product.url;

    if (req.files && req.files.image) {
      const image = req.files.image;
      const fileSize = image.data.length;
      const ext = path.extname(image.name);
      const newFileName = image.md5 + ext;
      const allowedTypes = [".png", ".jpg", ".jpeg"];

      // Validasi file
      if (!allowedTypes.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid Images" });
      }
      if (fileSize > 5000000) {
        return res.status(422).json({ msg: "Image must be less than 5 MB" });
      }

      const uploadPath = "./public/images/";
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      // Hapus file lama jika ada
      const oldFilePath = path.join(
        __dirname,
        "../public/images",
        product.image
      );
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      // Simpan file baru
      image.mv(`${uploadPath}${newFileName}`, (err) => {
        if (err) {
          return res.status(500).json({ msg: err.message });
        }
      });

      fileName = newFileName;
      url = `${req.protocol}://${req.get("host")}/images/${newFileName}`;
    }

    // Update data produk
    await Product.update(
      { name, harga, jumlah, image: fileName, url },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({ message: "Product Update Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
};

const DeleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!product) {
      return res.status(404).json({ msg: "No Data Found" });
    }

    const filepath = path.join(__dirname, "../public/images", product.image);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    } else {
      console.log("File not found:", filepath);
    }

    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ msg: "Product Deleted Successfully" });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ msg: "An error occurred while deleting the product" });
  }
};

module.exports = {
  getProduct,
  getProductById,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
};
