
import serve_static from 'serve-static';

import { file_system } from '../../modules/file_system.js';

const {  root_dir, join } = file_system();

export const static_url_end_point = 'upc-images';
export default async function static_routes(app){
     
    app.use(serve_static(join(root_dir,'public'), 

    {

        maxAge : '50d'

    }));

    app.use('', serve_static( join(root_dir,'public')) );


    app.use('upc-images',serve_static(join(root_dir, 'db/upcImages')));


    app.use( serve_static( join(root_dir,'node_modules/axios/dist')) );
       
}