


import {
    make_directory_paths,
    is_directory,
    write_file,
    is_file,
    readJSONFile,
    read_directory,
  } from "../modules/file_system.js";





export async function write_to_inventory(req, res) {

    const { first, last, email, salt } = req.user[0];

    const upc = req.body.upc;

    let file = {};

    const company_upc_id = upc.slice(0, 6);
    
    const file_path = `db/merchants/${email}/inventory/${company_upc_id}.json`;

    try {
   
        if (await is_file(file_path)) {

        file = await readJSONFile(file_path);
      
      } else {
      
        await make_directory_paths(file_path.split("/").slice(0, -1).join("/"));
      
      }

      file[upc] = req.body;

      await write_file(file_path, JSON.stringify(file));

      res.status(201).send("database updated");

    } catch (error) {

      res.status(501).send("internal server error");

      console.error("error writing to file:  ", error);
    }
  }