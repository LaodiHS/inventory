import express from "express"
import request from "request"


export class Load_Balancer {
        /**
         * 
         * @param { Array <String> } servers   
         * @param { String } host current host
         * @param { Number } port
         */
        constructor(servers, host, port) {

                this.servers = servers;
                
                this.current_server = 0;

                this.pivot_port = port;

                this.pivot = host;

        }

        handler(req, res) {

                const _req = request({ url: this.servers[this.current_server] + req.url }).on("error", error => {

                        res.status(500).send(error.message);
                });

                req.pipe(_req).pipe(res);

                this.current_server = (this.current_server + 1) % this.servers.length;

        }

        main_route() {

                if (this.servers > 1) {

                        this.pivot = express();

                        this.pivot.get("*", this.handler).post("*", this.handler);

                        this.pivot.listen(this.pivot_port, () => {

                                console.log(`pivot server is listening on ${this.pivot_port}`);

                        });
                }

        }

        start() {

                this.main_route();

        }

}





