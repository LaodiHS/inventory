import {file_system} from "../modules/file_system.js";


export async function index(req, res) {
    
    const { root_dir, join } = file_system();

    res.status(200)
        .sendFile( join(root_dir, "public/index.html") );

};