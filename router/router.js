import express_configuration from "./express_config.js";

import static_routes from "./static_routes/static_routes.js";

import { dynamic_routes } from "./dynamic_routes/dynamic_routes.js";

export default async function router(app) {

await express_configuration(app);

    static_routes(app);

    dynamic_routes(app);

}