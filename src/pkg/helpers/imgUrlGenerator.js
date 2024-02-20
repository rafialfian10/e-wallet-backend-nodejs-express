exports.fileUrlGenerator = (req, imageFileName) => {
  if (req.hostname === "localhost" || req.host === "127.0.0.1") {
    return `${req.protocol}://${req.get("host")}/static/file-message/${imageFileName}`;
  } else {
    return `${req.protocol}://${req.get("host")}/static/file-message/${imageFileName}`;
    // return `https://${req.hostname}/static/file-message/${imageFileName}`;
  }
};

exports.photoUrlGenerator = (req, imageFileName) => {
  if (req.hostname === "localhost" || req.host === "127.0.0.1") {
    return `${req.protocol}://${req.get("host")}/static/photo/${imageFileName}`;
  } else {
    return `${req.protocol}://${req.get("host")}/static/photo/${imageFileName}`;
    // return `https://${req.hostname}/static/photo/${imageFileName}`;
  }
};
