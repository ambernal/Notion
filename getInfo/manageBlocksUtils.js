const funcs = {
  async getDatabaseInfo(databaseId,notion,pages) { 
    //const databaseId = '18f7b4a2-5164-4e4d-bfa8-97306d263932';
    const databaseId2 = '7c8a11c4-f4fb-429c-8aec-46a01ffe101d';
    let endPage = true;
    const response = await notion.databases.query({
      database_id: databaseId,
      /* filter: {
        or: [
          {
            property: 'In stock',
            checkbox: {
              equals: true,
            },
          },
          {
            property: 'Cost of next trip',
            number: {
              greater_than_or_equal_to: 2,
            },
          },
        ],
      }, */
      sorts: [
        {
          property: 'Name',
          direction: 'ascending',
        },
      ],
    });
    console.log('getDatabaseInfo-> '+JSON.stringify(response, null, 4));
    response.results.forEach(function(page){
      //console.log(' ==== new childBlockInfo ===');
      console.log('====== Start Database Row-> '+JSON.stringify(page, null, 4));

      if(page.object ==="page"){
        endPage = false;
        let pageInfo = page.properties;

        console.log('endPage = false para page -> '+pageInfo.Name.title[0].plain_Text);

     
        let  preparePage = {
          "id": page.id,
          "type": page.object,
          "name": pageInfo.Name.title[0].plain_Text
        }
        pages.push(preparePage);

      }
    });
    console.log('getDatabaseInfo<-');

    return endPage;
  }, 
  async getBlockChilds(randomPage,notion,pages){
    console.log('getBlockChilds del blockId-> ' + randomPage.id);
    let endPage = true;

    const mainBlockInfo = await notion.blocks.children.list({
      block_id: randomPage.id,
      page_size: 550,
    });
    if(randomPage.name !='Initial') console.log('getBlockChilds - Children Block Retrieved-> '+JSON.stringify(mainBlockInfo, null, 4));
    const responseResultsPromises = mainBlockInfo.results.map(async (childBlockInfo) => {
      //console.log(' ==== new childBlockInfo ===');
      //console.log(childBlockInfo.id);
      const blockId = childBlockInfo.id;
      
     const response = await notion.blocks.retrieve({
        block_id: blockId,
      });  
      //console.log('response-> '+JSON.stringify(response, null, 4));
     let pageName = '';
     let addPage = false;
     if(response.type === 'child_database'){
        pageName =response.child_database;
        addPage = true;
  /*    }else if(response.type === 'synced_block'){
      pageName =response.synced_block.synced_from.block_id;
      addPage = true; */
     }else if(response.type === 'bulleted_list_item'){
      console.log('getBlockChilds - bulleted_list_item-> '+response.bulleted_list_item.rich_text[0].plain_text );
      addPage = false;
     }else if(response.type === 'paragraph'){
      console.log('getBlockChilds - paragraph-> No hacemos nada' );
      addPage = false;
     }else if(response.type === 'heading_3' || response.type === 'heading_2'){
      console.log('getBlockChilds - heading_3-> ' +response.rich_text[0].plain_text);
      addPage = true;
      pageName =response.child_database;   
     }else {
      //console.log(' Is a Childpage? ->' +JSON.stringify(response, null, 4)); //response.child_page
      pageName = response.child_page
      addPage = true;
     } 
     if (addPage){
      endPage = false;
      console.log('getBlockChilds - There is a page added to pages so endPage = false');
      let  page = {
          "id": response.id,
          "type": response.type,
          "name": pageName
      }
      pages.push(page);
     }
    }); 
   
    const usernames = await Promise.all(responseResultsPromises);
    console.log('getBlockChilds<-');

    return endPage;
  },

  async getBlockInfoByType(randomPage,notion,pages){
    //console.log('getBlockInfoByType ->' +JSON.stringify(randomPage, null, 4));
    let response 
    if(randomPage.type==="child_database"){
      console.log('getBlockInfoByType is: child_database');
       response = await funcs.getDatabaseInfo(randomPage.id,notion,pages); 
      }else if(randomPage.type==="child_page"){ 
        //TODO : comprobar que type=page debería ir por aquí en vez de por getBlockChilds y quitar el manejo de textos del getBlockChilds
        //esta es page 40fc7382-9d6d-488f-b7b3-f3a4349d4078
        console.log('getBlockInfoByType is: child_page');
        response = await funcs.getPageText(randomPage.id,notion,pages); 
      }else {
        console.log('getBlockInfoByType is != child_database or child_page, is: '+randomPage.type);
        response = await funcs.getBlockChilds(randomPage,notion,pages); 

      };
    
    //  const usernames = await Promise.all(responseResultsPromises);

    console.log('getBlockInfoByType Response-> ' + JSON.stringify(response, null, 4));
    return response;
  },
 
async testGetPage() { const pageId = '18f7b4a2-5164-4e4d-bfa8-97306d263932';
  const response = await notion.pages.retrieve({ page_id: pageId });
  console.log('magic->'+JSON.stringify(response, null, 4));
},

async testGetPageInfo(){
    const pageInfo = getPageInfo('18f7b4a2-5164-4e4d-bfa8-97306d263932');
    console.log('pageInfo->'+JSON.stringify(pageInfo, null, 4));
},

async getPageText(randomPage,notion,pages){
  console.log('getPageText de la page-> ' + randomPage);
  let endPage = false;
  const pageInfo = await notion.blocks.children.list({
    block_id: randomPage,
    page_size: 550,
  });
  console.log('getPageText pageInfo-> '+JSON.stringify(pageInfo, null, 4));
  //const responseResultsPromises = mainBlockInfo.results.map(async (childBlockInfo) => {
    pageInfo.results.forEach(function(page){
      if(page.type == 'heading_3') console.log('heading_3: '+JSON.stringify(page.heading_3.rich_text[0].plain_text, null, 4));
      if(page.type == 'heading_2') console.log('heading_2: '+JSON.stringify(page.heading_2.rich_text[0].plain_text, null, 4));
      if(page.type == 'heading_1') console.log('heading_1: '+JSON.stringify(page.heading_1.rich_text[0].plain_text, null, 4));
      if(page.type == 'table') console.log('table: '+JSON.stringify(page.type, null, 4));
      if(page.type == 'toggle') console.log('toggle: '+JSON.stringify(page.toggle.rich_text[0].plain_text, null, 4));
      if(page.type == 'bulleted_list_item') console.log('bulleted_list_item: '+JSON.stringify(page.bulleted_list_item.rich_text[0].plain_text, null, 4));

      //console.log(' '+JSON.stringify(page.type, null, 4));
      if(page.type == 'heading_1' || page.type == 'heading_2' || page.type == 'heading_3'|| page.type == 'table'|| page.type == 'toggle' || page.type =='bulleted_list_item') endPage = true;
 
    
      if (page.type == 'child_page'){
        console.log('There is a page added to pages so endPage = false');
        let  preparePage = {
            "id": page.id,
            "type": page.type,
            "name": page.child_page
        }
        pages.push(preparePage);
      }
 
    }); 
    console.log('getPageText<-');

  return endPage;
},
 /*  async getDatabase(databaseId){
  const response = await notion.blocks.children.list({
    block_id: databaseId,
    page_size: 50,
  });
  console.log('getDatabase-> '+JSON.stringify(response, null, 4));
 }, */

/*  async getPageInfo(pageId){
  const response = await notion.pages.retrieve({ page_id: pageId });
  console.log('magic->'+JSON.stringify(response, null, 4));
}, */
//baz() { funcs.foo(); funcs.bar() } // here is the fix
}

export default funcs
  

// TEST VARIOS 
//const database = await getDatabase('18f7b4a2-5164-4e4d-bfa8-97306d263932');
//const childLevelPrueba = await getChildPages('839d6648-e91f-4067-b83e-401e16dc8e56');
// END TEST VARIOS 