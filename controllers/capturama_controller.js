import axios from "axios";

import { error_logging_service } from "../services/error_logging_service.js";

import { get_vendor_services } from "../modules/file_system.js";
import { file_system } from "../modules/file_system.js";

const { file_name, join } = file_system();
/**
 * 
 * @desc  capturama controller handles all capturama errors codes 4XX / 5XX and error logs them.
 * @param { Object } res; 
 * @param { Object } req; 
 * @returns { Object {api_name, status_code, data } };
 *  
 */
export async function capture_image(req, res) {

const capturama_service = (await get_vendor_services('imaging_vendors')).capturama_service;

    const { body } = req;

    try {

        const result = await axios.post(capturama_service.api_url, body);

        const { status, data } = result;
        const { image_url } = data;

        return {

            api_name: capturama_service.name,

            status: status,

            data: image_url

        };

    } catch (error) {

         error_logging_service(error.code, 

            {
            
                file_name: file_name, 
            
                error: error
            
            });

        return {

            api_name: capturama_service.name,

            status: 200,

            data: {

                msg: "205",

                image_url: [ join( capturama_service.base_url, "205.png" ) ]

            }

        };

    }

}
