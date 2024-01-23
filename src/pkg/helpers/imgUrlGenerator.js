exports.imageUrlGenerator = (req, imageFileName) => {
  if (req.hostname === "localhost" || req.host === "127.0.0.1") {
    return `${req.protocol}://${req.get("host")}/static/image/${imageFileName}`;
  } else {
    return `https://${req.hostname}/static/image/${imageFileName}`;
  }
};

exports.photoUrlGenerator = (req, imageFileName) => {
  if (req.hostname === "localhost" || req.host === "127.0.0.1") {
    return `${req.protocol}://${req.get("host")}/static/photo/${imageFileName}`;
  } else {
    return `https://${req.hostname}/static/photo/${imageFileName}`;
  }
};
