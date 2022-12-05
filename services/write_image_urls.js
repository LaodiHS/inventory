import {

  make_directory_paths,
  is_directory,
  write_file,
  is_file,
  readJSONFile,
  read_directory,

} from "../modules/file_system.js";
import fs from 'fs';
import axios from "axios";
import { file_system } from "../modules/file_system.js";
 
const { file_name, join } = file_system();

export const write_image_urls = async (path, imageUrls, static_route_name) => {

const paths = [];


  for(const url of imageUrls){

    // const path get file path or create
    
      const imageUPCDir = path; 
      
      const upcDirImages = await is_directory(imageUPCDir )
      
      if(!upcDirImages){
        
        await make_directory_paths(imageUPCDir);
  
      };
          
          try{
    
            const response =  await axios({
          
            url,
          
            method:'Get',
          
            responseType:'stream'
           
          });
         
        const data = await response.data;
    
        const path = join(imageUPCDir, new Date().getTime()+'.'+response.headers['content-type'].split('/').pop()); 
         
          try{

          const writer = fs.createWriteStream( path );
    
          response.data.pipe(writer);
    
          await new Promise((resolve, reject) => {
    
          writer.on('finish', resolve)
            
          writer.on('error', reject);
            
          });

          paths.push(join(static_route_name, path));
        
        }catch(error){
          
          console.log('write error', error)
        
        }
            }catch(error){
    
        //      console.log('error', error);
      
            }
    
          }
      
          return paths;
      
        };

