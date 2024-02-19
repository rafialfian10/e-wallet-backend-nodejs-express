const httpStatus = require("http-status");
const multer = require("multer");
const path = require("path");
// --------------------------------------------------

const diskStoragePhoto = multer.diskStorage({
  // konfigurasi lokasi penyimpanan file
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../../uploads/photo"));
  },
  // konfigurasi penamaan file yang unik
  filename: function (req, file, cb) {
    let fileName = `img-${new Date().getTime()}`;
    cb(null, fileName + path.extname(file.originalname));
  },
});

const diskStorageFile = multer.diskStorage({
  // konfigurasi lokasi penyimpanan file
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../../uploads/file-message"));
  },
  // konfigurasi penamaan file yang unik
  filename: function (req, file, cb) {
    let fileName = `img-${new Date().getTime()}`;
    cb(null, fileName + path.extname(file.originalname));
  },
});

const uploadPhoto = multer({
  storage: diskStoragePhoto,
  // limits: 8192000,
  limits: { fileSize: 8192000 }, // 8Mb
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/jpg" &&
      file.mimetype !== "image/jpeg" &&
      file.mimetype !== "image/webp"
    ) {
      return cb(new Error("Only .png, .jpg, .webp and .jpeg format allowed!"));
    } else {
      cb(null, true);
    }
  },
});

const uploadFile = multer({
  storage: diskStorageFile,
  // limits: 8192000,
  limits: { fileSize: 8192000 }, // 8Mb
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/jpg" &&
      file.mimetype !== "image/jpeg" &&
      file.mimetype !== "image/webp"
    ) {
      return cb(new Error("Only .png, .jpg, .webp and .jpeg format allowed!"));
    } else {
      cb(null, true);
    }
  },
});

exports.uploadPhoto = async (req, res, next) => {
  uploadPhoto.single("photo")(req, res, function (err) {
    try {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        throw err;
      } else if (err) {
        // An unknown error occurred when uploading.
        throw err;
      }

      // Everything went fine.
      next();
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  });
};

exports.uploadSingleFile = async (req, res, next) => {
  uploadFile.single("file")(req, res, function (err) {
    try {
      if (err instanceof multer.MulterError) {
        throw err;
      } else if (err) {
        throw err;
      }

      next();
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  });
};

exports.uploadMultipleFile = async (req, res, next) => {
  uploadFile.fields([
    {
      name: "file",
    },
  ])(req, res, function (err) {
    try {
      if (err instanceof multer.MulterError) {
        throw err;
      } else if (err) {
        throw err;
      }

      next();
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  });
};
