
import * as dot from 'dotenv';
import { error_logging_service } from "../services/error_logging_service.js";

import { DB } from "../services/database_services.js";

import { file_system } from '../modules/file_system.js';
import { Address } from '../views/geoapify.js'
import test from "simple-test-framework";
import { STATUS_CODES } from 'http';

const { GEOAPIFY }: any = dot.config().parsed;







export async function register(body: { email:string, password:string, housenumber: string, street: string, postcode: string, city: string}): Promise< void  > {

    // const { housenumber, street, postcode: postcode, city } = body;

    try {
        await DB.get_table('users')
           console.log( DB.table)
       
        // const data: Response = await response.data;

        // const { results }: { results: ResponseData[] } = data;

        // return {status : response.status, data: results};


    } catch (error: any) {

        const { file_name }: { file_name: string } = file_system();

        const { code}: { code: string  } = error;

        // const { status, data}: {status: number, data: AxiosError} = response;
    
        error_logging_service(code,

            {
                file_name,
                error

            });

    // return  {status, data: data};

    }

}


export async function request_address_check(address: any): Promise< void > {

   await register(address);

}

request_address_check({email:"bob", password:"123", housenumber: "1235", street: "festivo", postcode: "92503", city: "laguna" })

/**
 * test end point dynamic_routes/dynamic_routes.ts -> views/geoapify.ts -> geoapify_controller.ts
 */
