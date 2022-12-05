import multer from "multer";

import { file_system } from "../modules/file_system.js";

/**
 *
 *
 * @export
 * @param { String } path
 * @param { Number } image_size
 * @param { Array<String> } image_extensions
 * @param { String } directory_name
 * @param { String } prefix
 */
export async function multer_image_controller(
  app,
  path,
  image_size,
  image_extensions,
  directory_name,
  prefix
) {
  const { root_dir, join } = file_system();

  const upload_multer_object = multer({
    limits: { fileSize: 10000000 },

    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(image_extensions.join("|"))$/)) {
        return;

        cb(new Error("Please upload a valid image file"));
      }

      cb(undefined, true);
    },
  });

  app.post(path, upload_multer_object.array("files"), async (req, res) => {
    const files = req.files;

    while (files.length) {
      try {
        const file = files.shift();

        await sharp(file.buffer)
          .resize({ width: 250, height: 250 })
          .png()
          .toFile(
            join(root_dir, `${directory_name}/${file.originalname + prefix}`)
          );

        res.status(201).send("Image uploaded successful");
      } catch (error) {
        console.log(error);

        res.status(400).send(error);
      }
    }
  });
}
