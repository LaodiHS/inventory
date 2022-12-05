import { request_address_check } from '../controllers/geoapify_controller.js';
import { validation_parameters } from '../services/validation_service.js';
import { api_logging } from '../services/logging_services.js';
export const location = {
    'housenumber': ['in-body', 'isEmpty', 'exists', 'isLength-3'],
    'street': ['in-body', 'exists', 'isLength-2'],
    'postcode': ['in-body', 'exists', 'isLength-5'],
    'city': ['in-body', 'exists', 'isLength-3'],
    'limit': ['in-body', 'exists', 'isLength-1']
};
const validate = [location];
export const valid_address = {
    validate: validation_parameters(validate),
    async handel(req, res, next) {
        const { status, data } = await request_address_check(req.body);
        if (status === 200) {
            api_logging('geoapify', status, data);
            res.status(200).json(data);
        }
        else
            res.status(status).json(data);
    }
};
//# sourceMappingURL=geoapify.js.map