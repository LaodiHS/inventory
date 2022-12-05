import express from "express";

import router from "./router/router.js";

import { Load_Balancer } from "./services/load_balancer.js";

import { create_tables } from "./services/database_services.js";

import { application_service } from "./services/application_service.js";

import { express_apps, pivot_server, database_tables } from "./config.js";


async function start_server() {

    await create_tables(database_tables);

    const applications = express_apps();

    for (const client of applications) {
        
        const app = express();

        const [app_name, host] = client;
        
        application_service(app_name, app);

        console.log(host.port)
        
        app.listen(host.port);

        router(app);
    }

    const balancer = new Load_Balancer( Object.values(applications).map( app => app.name + app.host), pivot_server.name, pivot_server.port );

    balancer.start();

}

start_server();
