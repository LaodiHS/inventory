
  import{join} from 'path';
import {
    make_directory_paths,
    is_directory,
    write_file,
    is_file,
    readJSONFile,
    read_directory,
  } from "../modules/file_system.js";
import { paging_component } from "../services/paging_component.js";

  export const products_cash = {};

 export async function products(req, res) {
    const {email, salt} = req.user[0];
    const hash = req.body.query || { query: {} };
    const cashed_query = salt + JSON.stringify(hash);

    const results = [];

    const { count, page } = req.body.page;

     const cashes = products_cash[cashed_query];

    if (false && cashes) {
      res
        .status(200)
        .json({
          data: paging_component(cashes, count, page),
          total: cashes.length,
        });

      return;
    }

    const merchant_file = `db/merchants/${email}/inventory`;
    const dir = await is_directory(merchant_file)
    if (dir) {
      const productFiles = await read_directory(merchant_file);

      const files = productFiles.map((file) => join(merchant_file, file));

      const query = Object.entries(req.body.query);

      while (files.length) {
        const file = files.pop();

        const record = await readJSONFile(file);

        for (const key in record) {
          const truth_table = true;

          for ([col, value] of query) {
            truth_table = record[key][col].includes(value);

            if (!truth_table) break;
          }

          truth_table && results.push(record[key]);
        }
      }

      products_cash[cashed_query] = results;

      res
        .status(200)
        .json({
          data: paging_component(results, count, page),
          total: results.length,
        });
    } else {
      res.status(500).send("no user");
    }
  }