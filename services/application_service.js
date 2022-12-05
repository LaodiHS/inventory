const application_map = new Map();

/**
 *
 * @desc to initialize more than then express instance
 * @export
 * @param { String } app_name client instance
 * @param { Object } express_instance express app instance
 */
export function application_service(app_name, express_instance) {

    application_map.set(app_name, express_instance);

}

/**
 * 
 * @desc retrieves the host client from a map of applications 
 * @export
 * @param { String } express_app_name 
 * @returns { Object } express app instance
 */
export function get_application_router(express_app_name) {

    return application_map.get(express_app_name);

}