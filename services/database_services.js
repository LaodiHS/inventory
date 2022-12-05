import { Data_Base } from "../modules/database_interface.js";

/**
 * 
 * @dsc Instantiates a Data_Base interface before client starts
 * File System Object
 */
export let DB;
 
/**
 * 
 * @dsc create tables if they do not exist
 * @param { Array <Strings> } table_names 
 */
export async function create_tables(table_names) {

    DB = await Data_Base.set_tables(table_names);
    
}




