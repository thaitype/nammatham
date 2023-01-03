import { Container } from "inversify";
import { getControllersFromMetadata } from "./utils";
import { TYPE } from "./contants";

export function bootstrap(container: Container){
    console.log('Getting Metadata from method');
    for(const metadata of getControllersFromMetadata()){
        console.log(metadata);
    }
   
}