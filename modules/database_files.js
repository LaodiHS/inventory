import fs from "fs";
import readline from "readline";
import { inspect } from "util";
import lineReplace from "line-replace";
import lockfile from "proper-lockfile";
import { random_data_generator as generate } from "./random_data_generator.js";
import test from "simple-test-framework";
import { error_logging_service } from "../services/error_logging_service.js";

import {
  file_system,
  is_directory,
  make_directory,
  is_file,
  write_file,
  file_append,
  absolute_directory,
  read_directory,
} from "./file_system.js";

const database_dir = "db";
const default_flag = "expired";

let regExpChinesChars = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/g;

regExpChinesChars.test("你好世界")

const { file_name, file_system_async, this_dir, root_dir, join } = file_system();

export const DataBases = new Map();

export async function set_dbs() {
  if (DataBases.size) return;

  const path = absolute_directory("db");

  let dirs = await read_directory(path);

  for (const db of dirs) {
    let f = join(path, db);

    let k = await is_directory(f);

    if (k) {
      DataBases.set(db, join(database_dir, db));
    }
  }
}

function unregister_user(file, index) {
  var buffer = new Buffer.from("1");

  fs.open(file, "rs+", function (err, fd) {
    // If the output file does not exists
    // an error is thrown else data in the
    // buffer is written to the output file
    if (err) {
      console.log("Cant open file");
    } else {
      fs.write(
        fd,
        buffer,
        0,
        buffer.length,
        index,
        function (err, writtenbytes) {
          if (err) {
            console.log("Cant write to file");
          } else {
            console.log(writtenbytes + " characters added to file");
          }
        }
      );
    }
  });
}

set_dbs();

let id = 0;

export const get_sypher = (email) => {
  const letter = email.trim().split("").shift();

  return letter;
};

async function create_folder(path_to_database_folder) {

  const path = path_to_database_folder.split("/");

  DataBases.set(path[path.length - 1], path.join("/"));

  let dir = root_dir;

  while (path.length) {
    dir = join(dir, path.shift());

    const is_path = await is_directory(dir);

    if (!is_path) {
      await make_directory(dir);
    }
  }
}

export async function create_table(database, email, data, flag = default_flag) {

  const database_folder = join(database_dir, database);

  await create_folder(database_folder);

  const letter = get_sypher(email);

  const file = join(database_folder, `${letter}.txt`);

  const file_exist = await is_file(join(database_folder, `${letter}.txt`));

  data[flag] = "0";

  if (!file_exist) {
    try {
      await write_file(file, JSON.stringify(data) + "\n");
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  } else {
    try {
      await file_append(file, JSON.stringify(data) + "\n");
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }
}

export function create_file_iterator(file) {
  const fileStream = fs.createReadStream(file);

  const rl = readline.createInterface({
    input: fileStream,

    crlfDelay: Infinity,
  });
  return rl;
}

export async function get_record(database, sypher, find = null, flag = default_flag) {
  let file = join(database_dir, join(database, sypher[0])) + ".txt";

  if (!find || !find.length) {
    find = [sypher];
  }

  file = absolute_directory(file);

  const fileStream = fs.createReadStream(file, {start:0});

  const rl = readline.createInterface({
    input: fileStream,

    crlfDelay: Infinity,
  });

  const records = [];

  let total_length = 0;

  for await (let line of rl) {

    if (find.every((param) => line.includes(param))) {
      let zero = line.search(`"0"`);

      if (zero === -1) continue;

      records.push(JSON.parse(line));

      break;
    }

    total_length += line.length +1;
  }

  return records;
}

async function flag_record(database, sypher, find = null, flag = default_flag) {
  await set_dbs();
  if (!find || !find.length) {
    find = [sypher];
  }

  try {
    if (!DataBases.has(database)) {
      throw Error("no such database");
    }
  } catch (error) {
    // Get stack trace for the exception with source file information
    const st = new StackTrace(ex, true);
    // Get the top stack frame
    const frame = st.GetFrame(0);
    // Get the line number from the stack frame
    const line = frame.GetFileLineNumber();

    error_logging_service("database error", {
      file_name: file_name,

      line_number: line,

      error: "no database " + database,
    });
  }

  let file = DataBases.get(database) + "/" + get_sypher(sypher) + `.txt`;

  if (!(await is_file(file))) {
    console.error("no record found");

    return "no record found";
  }

  file = absolute_directory(file);

  const fileStream = fs.createReadStream(file, {start:0});

  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  const rl = readline.createInterface({
    input: fileStream,

    crlfDelay: Infinity,
  });

  const records = [];

  let total_length = 0;

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.



    if (find.every((param) => line.includes(param))) {
      const zero_offset = `"0"`;
      let len_offset = zero_offset.length -2;
      
      if(regExpChinesChars.test(line)){
         len_offset += 2;
      } 

      let zero = line.search(`"0"`);

      if (zero === -1) continue;

      total_length += zero + len_offset;

      unregister_user(file, total_length);

      records.push(JSON.parse(line));

      break;
    }

    total_length += line.length + 1;
  }

  return records;
}

export async function get_table(table_name) {
  const records = [];

  await set_dbs();

  if (DataBases.has(table_name)) {
    const data_table = DataBases.get(table_name);

    const tables = await read_directory(data_table);

    while (tables.length) {
      const file = join(data_table, tables.pop());

      for await (const line of create_file_iterator(file)) {
        const record = JSON.parse(line);
        records.unshift(record);
      }
    }
  }
  return records;
}

export async function database_file_tests() {

  test("generate 100 records", async (table) => {
    let i = 100;

    const select = [];

    while (i--) {

      const user = {
        email: generate.email(),
        username: generate.word(5, 9),
        age: generate.integer(25, 45),
        first: generate.first(),
        password: generate.word(7, 10),
      };

      select.push(user);

      try {
        await create_table("users", user.email, {
          email: user.email,

          salt: "123456fadfa",

          hash: "ad4da56dfa654df4fa",

          first_name: user.first,

          last_name: generate.last(),

          address: "24882 Branch LakeForest CA 92630",

          registered: Date.now().toString(),
        });
      } catch (error) {

        table.check(false, JSON.stringify(error));
        
        break;
      }
    }
    if (!i) table.check(true, "all records created");
    
    else table.check(false, "not all tables were created");
    
    table.test("expired all added records", async (records) => {
      while (select.length) {
        const record = select.pop();
        await flag_record("users", record.email);
      }
      records.check(true, "all records expired");
    });
  });

  const get_all_records = await get_table("users");

  console.log(JSON.stringify(get_all_records));

  // get_record("users");
}

// database_file_tests();



