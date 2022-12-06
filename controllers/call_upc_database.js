import {
  make_directory_paths,
  is_directory,
  write_file,
  is_file,
  readJSONFile,
  read_directory,
} from "../modules/file_system.js";

import axios from "axios";

import { write_image_urls } from "../services/write_image_urls.js";

import { static_url_end_point } from "../router/static_routes/static_routes.js";

export async function call_upc_database(req, res) {
  const upc = req.body.upc;

  const { first, last, email, salt } = req.user[0];

  const company_product_upc_id = upc.slice(0, 6);

  try {
    const file_path = `db/merchants/${email}/inventory/${company_product_upc_id}.json`;

    if (await is_file(file_path)) {
      const user_products = await readJSONFile(file_path);

      if (user_products[upc]) {
        res.status(200).json(user_products[upc]);

        return;
      }
    }
  } catch (error) {
    // console.log("error", error);
  }

  const upc_inventory_file = `db/upc/${company_product_upc_id}.json`;

  const file_exists = await is_file(upc_inventory_file);

  if (file_exists) {
    try {
      const file = await readJSONFile(upc_inventory_file);

      const response_object = file[upc];

      if (response_object) {
        const items = response_object.items;

        const first_item = items[0];

        res.status(200).json(first_item);

        return;
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  try {
    let file = {};

    if (await is_file(upc_inventory_file)) {
      file = await readJSONFile(upc_inventory_file);
    } else {
      await make_directory_paths(
        upc_inventory_file.split("/").slice(0, -1).join("/")
      );
    }

    const call = await axios.get(
      `https://api.upcitemdb.com/prod/trial/lookup?upc=${upc}`
    );

    const data = await call.data;
 
    if (!data.items.length) {
      
    throw Error("empty response");
    
  }
    res.status("200").json(data.items[0]);

    const valid_image_urls = await write_image_urls(
    
      `db/upcImages/${upc}`,
    
      data.items[0].images,
    
      static_url_end_point
    
      );

    data.items[0].images = valid_image_urls;

    file[upc] = data;

    await write_file(upc_inventory_file, JSON.stringify(file));

  } catch (error) {
    
    res.status("400").send('UPC not available in our Database');
    
    console.log("call_upc_database_error:  ", error);
  }
}
