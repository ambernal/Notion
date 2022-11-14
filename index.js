import { Client } from "@notionhq/client"
import manageBlocksUtils from './getInfo/manageBlocksUtils.js';
import utils from './bussinessLogic/Utils.js';




const notion = new Client({ auth: process.env.NOTION_KEY });
const databaseId = '1418214cb01d4dcc937139962b2b9776';
var randomPage = {
  //"id": '0c6cb062-a4bd-4181-863a-db7e2def3dad',
  "id":databaseId,
  "type": 'InitialPage',
  "name": 'Initial'
}

var pages =[];
let nextLevel = false;

 let isTheEnd = false;
 let iterator = 1;

 while(!isTheEnd || isTheEnd=='true'){
    console.log("Iteraccion numero ->"+ iterator);

        console.log("Pagina a tratar ->"+ JSON.stringify(randomPage, null, 4));
        isTheEnd = await manageBlocksUtils.getBlockInfoByType(randomPage,notion,pages)
        console.log("isTheEnd ->"+ isTheEnd)
        //if (typeof isTheEnd == "boolean") console.log("isTheEnd is Boolean")
        if(!isTheEnd || isTheEnd === false){
          //utils.showArray(iterator,true,true,pages);
          randomPage = utils.getRandomPage(pages);
          pages =[];
          console.log('topic selected->' +JSON.stringify(randomPage, null, 4));

        }
     
    iterator++;
    console.log("=============================================");
}

//TODO debería de faltar el tema de tratar tablas de páginas