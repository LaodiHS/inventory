
import { capture_image } from "../controllers/capturama_controller.js";

import { api_logging } from "../services/logging_services.js";
import { validation_parameters } from "../services/validation_service.js";
import { capturama_response } from "../services/response_service.js";

import { activity_stats_controller } from "../controllers/capturama_stats_controller.js"; 

export const gojos = {
    /**
     *
     * @returns {Object}; validation schema object
     */
    validate: validation_parameters([
        {
            "url" : ["in-body", "isEmpty", "isURL", "exists", "isLength-5"]
        }
    ]),


    async handel(req, res, next) {

        const { api_name, status, data } = await capture_image(req, res);

        await api_logging(api_name, status, data);

        return capturama_response(res, status, data);

    }

};

export const gojos_selector = {
    /**
     *
     * @returns {Object}; validation schema object
     */
    validate: validation_parameters([
        {
            "url":
                ["in-body", "isEmpty", "isURL", "exists", "isLength-5"]
        },
        {
            "selector":
                ["in-body", "isEmpty", "exists", "isLength-5"]
        }
    ]),


    async handel(req, res, next) {

        const { api_name, status, data } = await capture_image(req, res);

        await api_logging(api_name, status, data);

        return capturama_response(res, status, data);

    }

};


export const gojos_metrics = {

    async handel(req, res, next){

        activity_stats_controller(req, res);

    }

};