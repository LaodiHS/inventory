import * as dot from 'dotenv';
import { error_logging_service } from "../services/error_logging_service.js";
import { DB } from "../services/database_services.js";
import { file_system } from '../modules/file_system.js';
const { GEOAPIFY } = dot.config().parsed;
export async function register(body) {
    try {
        await DB.get_table('users');
        console.log(DB.table);
    }
    catch (error) {
        const { file_name } = file_system();
        const { code } = error;
        error_logging_service(code, {
            file_name,
            error
        });
    }
}
// export async function(address) {
//     await register(address);
// }

//# sourceMappingURL=register_controller.js.map