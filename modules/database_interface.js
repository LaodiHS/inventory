import { write_file, read_file, is_file, file_system } from './file_system.js'

/**
 * @key {String} table_name
 * @Object {String: table_name, String: file_location, Object: table, Number: active_operations}
 */
const data_tables = new Map();

function table_path(table_name, path='db') {

    `${table_name}.json`;

    const { root_dir, join } = file_system()

    const db_files = join(root_dir, path);

    return join(db_files, table_name);

}

export async function get_table_file(table_name, path='db') {

    const db_path = `${table_path(table_name, path)}.json`;

    const table = JSON.parse(await read_file(db_path));

    data_tables.set(table_name, { table_name: table_name, file_location: db_path, table: table, active_operations: 0 });

    return data_tables.get(table_name);

}

export async function get_db(table_name, path='db') {

    let db_path = table_path(table_name, path);

    db_path = `${db_path}.json`;

    const exists = await is_file(db_path);

    if (exists) {

        return await get_table_file(table_name);

    } else {

        try {

            await write_file(db_path, "[]", "utf8");

            return { table_name: table_name, file_location: db_path, table: [] };

        } catch (error) {

            console.error(error);
            
        }
    }
}

/**
 * dec adds record to existing table then saves it.
 * @param {Object} database_table 
 * @param {Object} column 
 * @returns {Boolean}
 */
export async function add_table_record(database_table, column) {
    try {

        database_table.active_operations++;

        column.id = database_table.table.length;

        database_table.table.push(column);

        await write_file(database_table.file_location, JSON.stringify(database_table.table));

        database_table.active_operations--;

        console.log("successfully written to", database_table.file_location.split(".").shift());

        return true;

    } catch (err) {

        database_table.active_operations--;

        console.error(err);

        return false;
    }

}


export async function get_table(table_name, path = 'db') {

    const db = data_tables.get(table_name);

    if (db) return db;

    const db_path = table_path(table_name, path);

    const exists = await is_file(db_path);

    if (!exists) {

        console.log(`no table with ${table_name} name`);
        
        return false;
    }

    return get_table_file(table_name);

}

export async function whole_object_save(table_name) {

    const table_object = data_tables.get(table_name);

    try {

        if (!table_object) throw Error('No such table exists');

        await write_file(table_object.file_location, JSON.stringify(table_object.table));

        return true;

    } catch (error) {

        return error;
    }

}

/**
 * @dsc creates tables from an Array of Strings 
 * @param {Array<String>} tables 
 */
export const Data_Base = class {

    constructor(tables) {

        this.tables = tables;

        this.table;

        this.table_name;

    }

    static async set_tables(table_names) {

        while (table_names.length) {

            const table_name = table_names.pop()

            await get_db(table_name);

        }

        return new Data_Base(data_tables)

    }

    async get_table(table_name) {

        const table = this.tables.get(table_name);

        try {

            if (!table) throw Error('No such table exists')
            
            this.table = table.table
            
            this.table_name = table_name

        } catch (error) {

            error.status = error.status || 'read table error';

            return error;
        }

    }

    async save() {

        try {

            await whole_object_save(this.table_name)

            get_table(this.table_name)

            return true;

        } catch (error) {

            error.status = error.status || 'save error';
            
            return error

        }


    }


    async insert(data) {

        try {

            await add_table_record(this.table, data);

        } catch (error) {

            return error
        }

    }

}


