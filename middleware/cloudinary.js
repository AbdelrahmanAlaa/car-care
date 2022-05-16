const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "car-care3",
  api_key: "921132538581667",
  api_secret: "nTeBdjKJiv8tAQBeePnri_VCGx8",
});
//[1 , 3]

exports.uploads = async (file) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      (res) => {
        // if (err) return res.status(500).send("upload image error");
        resolve({ url: res.url, id: res.public_id });
      },
      { resource_type: "auto" }
    );
  });
};
