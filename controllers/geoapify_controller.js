import axios from 'axios';
import * as dot from 'dotenv';
import { error_logging_service } from "../services/error_logging_service.js";
import { file_system } from '../modules/file_system.js';
import test from "simple-test-framework";
const { GEOAPIFY } = dot.config().parsed;
;
;
;
export async function check_address(body) {
    const { housenumber, street, postcode: postcode, city } = body;
    try {
        const response = await axios.get(`https://api.geoapify.com/v1/geocode/search?housenumber=${encodeURIComponent(housenumber)}&street=${encodeURIComponent(street)}&postcode=${encodeURIComponent(postcode)}&city=${encodeURIComponent(city)}&limit=3&format=json&&apiKey=${GEOAPIFY}`);
        const data = await response.data;
        const { results } = data;
        return { status: response.status, data: results };
    }
    catch (error) {
        const { file_name } = file_system();
        const { code, response } = error;
        const { status, data } = response;
        error_logging_service(code, {
            file_name,
            error
        });
        return { status, data: data };
    }
}
export async function request_address_check(address) {
    return await check_address(address);
}
export async function geoapify() {
    test('check_address', (tests) => {
        tests("address: house 24882, street: branch, postcode: 92630, city: lake forest, limit:5", async (tests) => {
            const body = { housenumber: "24882", street: "branch", postcode: "92630", city: "lake forest", limit: "5" };
            const response = await check_address(body);
            const { status, data } = response;
            console.log(status);
            console.log(data);
        });
    });
}
//# sourceMappingURL=geoapify_controller.js.map