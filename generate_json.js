import { promises } from 'fs'
import axios from 'axios';
export async function generate_json() {

    const fs = promises;
    let excluded_files = await fs.readdir("./");
    const json = {};

    const exclude = ["Procfile","multer_image_controller.js","index.js","param_test.js","table_one.json","package.json",".env", "table_two.json","templates","cache", "schema.json","cache",".gitignore", "package-lock.json", ".vscode", "node_modules", "modules", "generate_json.js"]
    
    excluded_files = excluded_files.filter(file => !exclude.includes(file));

    while (excluded_files.length) {

        const file = excluded_files.shift();

        const fstat = await fs.stat(file);

        if (fstat.isDirectory()) {

            const files = await fs.readdir(file);

            files.forEach(second => excluded_files.push(file + "/" + second));

        } else {

            if ( exclude.includes(file.split("/").pop() ) ) continue;
           
            if ( file.includes(".txt") || file.includes(".md") || file.includes(".js") || file.includes(".env") || file.includes(".gitignore")) {
                
                const contents = await fs.readFile(file, { encoding: "utf8" });
                
                if(!contents.length)continue;

                json[file] = contents;
            };

        };

    };

await fs.writeFile("schema.json", JSON.stringify(json));


const schema = await fs.readFile("schema.json", {encoding:"utf8"});

const host = "https://codewalk.herokuapp.com/schema";
const local= "http://localhost:8080/schema";
const response = await axios.post( host, {schema: schema, password:"I haven't got a thing to know."} );

}

generate_json();