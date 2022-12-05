const root_import = import.meta.url;

import fs, { write } from "fs";
import Promise from "bluebird";

import { fileURLToPath } from "url";
import { promisify } from "util";
import { dirname, join } from "path";
import simdjson from 'simdjson'
const system_promises = promisify(fs.stat);
const readDir = promisify(fs.readdir);

/**
 * 
 * @param {string} meta Object 
 returns {file_name, file_system_async, this_dir, join} = {file_name: string, file_system_async: () => any, this_dir: string, join: (string, string) => string }= file_system()
 */

export function file_system(meta = import.meta.url) {
  const file_system_async = Promise.promisifyAll(fs);

  const this_dir = dirname(fileURLToPath(meta));

  const root_ = dirname(fileURLToPath(root_import)).split("/");

  root_.pop();

  const root_dir = root_.join("/");

  const file_name = meta;

  return { file_name, file_system_async, this_dir, root_dir, join };
}

export async function is_file(name) {
  name = absolute_directory(name);

  try {
    return fs.statSync(name).isFile();

    return true;
  } catch (err) {
    return false;
  }
}

export async function is_directory(name) {
  const name_a = absolute_directory(name);

  try {
    const dir = await system_promises(name_a);

    return dir.isDirectory();
  } catch (error) {
    return false;
  }
}

export async function read_directory(name) {
  let name_a = absolute_directory(name);

  return await readDir(name_a);
}

export async function make_directory(name) {
  name = absolute_directory(name);

  return await fs.promises.mkdir(name);
}

export async function write_file(name, data, encoding = "utf8") {
  name = absolute_directory(name);

  try {
    return await fs.promises.writeFile(name, data, { encoding: encoding });
  } catch (err) {
    console.error(err);
  }
}

export async function file_size(name) {
  name = absolute_directory(name);

  return (await system_promises(name)).size;
}

export async function file_append(path_to_file, data, encoding = "utf8") {
  path_to_file = absolute_directory(path_to_file);

  try {
    await is_file(path_to_file);
  } catch (error) {
    console.log(error);

    const path = path_to_file.split("/");

    const file_name = path.pop();

    await make_directory_paths(path.join("/"));

    await write_file(path_to_file, "");
  }

  fs.promises.appendFile(path_to_file, data);
}

export async function delete_file(name) {
  name = absolute_directory(name);

  try {
    await fs.promises.unlink(name);
  } catch (error) {
    console.error(`there was an error:`, error.message);
  }
}

export async function delete_dir(name) {
  name = absolute_directory(name);

  const directory = name;

  const files = (await read_directory(directory)).map((file) =>
    path.join(directory, file)
  );

  const adjacent_dirs = [directory];

  for (let file of files) {
    const links =
      (await is_directory(file)) &&
      (await read_directory(file)).map((leaf) =>
        files.push(file + "/" + leaf)
      ) &&
      adjacent_dirs.unshift(file);

    !links && delete_file(file);
  }

  for (let dir of adjacent_dirs) {
    await fs.promises.rmdir(dir, { recursive: true });
  }
}

export async function make_directory_paths(str) {
  const { root_dir } = file_system();

  str = absolute_directory(str.trim());

  str = str.slice(root_dir.length);

  const path_dir = str.split("/").filter((path) => path !== "");

  let trail = "";

  for (let dir of path_dir) {
    trail = join(trail, dir);

    const directoryExist = await is_directory(trail);

    !directoryExist && (await make_directory(trail));
  }

  return trail;
}

export function absolute_directory(file_or_directory) {
  const { root_dir } = file_system();

  if (file_or_directory.includes(root_dir)) {
    return file_or_directory;
  }

  return join(root_dir, file_or_directory);
}

export async function read_file(file_path) {
  absolute_directory(file_path);

  return await fs.promises.readFile(file_path, { encoding: "utf8" });
}

export async function get_vendor_services(file_name) {
  const file_path = absolute_directory(join("vender_services", file_name));

  return JSON.parse(
    await fs.promises.readFile(`${file_path}.json`, { encoding: "utf8" })
  );
}

export async function readJSONFile(file_name) {
  const file_path = absolute_directory(file_name);
  try { 
    
    const contents = await fs.promises.readFile(`${file_path}`, { encoding: "utf8" })
    
    if(!contents.length){
      return {};
    }

   let c =  simdjson.parse(contents);
return c; 
  } catch (error) {

    console.error(error);
  
  }
}

// make_directory_paths('db/mark@gmail.com/db')
// write_file('db/mark@gmail.com/db/products.json', JSON.stringify([{upc:'a', name:'c', cout:5, product_catagory:'cosmetics', price:2.25, detail: 'a is a new brand of cosmetics'}]));

// (async()=>{

//          await readJSONFile('db/mark@gmail.com/db/products')

// await write_file('db/mark@gmail.com/db/products.json', JSON.stringify( [{upc:'k', name:'c', cout:5, product_catagory:'cosmetics', price:3.25, detail: 'a is a new brand of cosmetics'}]))

// })()
