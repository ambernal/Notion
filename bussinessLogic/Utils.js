const funcsUtils = {

  showArray(level, length, content, pages){
    console.log(' Level '+level);
    if(length)console.log(pages.length);
    if(content){
      pages.forEach(pageArray => {
        console.log("page del Array Pages: " +JSON.stringify(pageArray, null, 4));
      });
    }
  },

  getRandomPage(pages){
    const randomPage = pages[Math.floor(Math.random()*pages.length)];
    console.log("getRandomPage-> " +JSON.stringify(randomPage, null, 4));
    return randomPage;
   },

  typeOfBlock(randomPage){
    //console.log("typeOfBlock randomPage-> " +JSON.stringify(randomPage, null, 4));

        let nextLevel = false;
        if(randomPage.type != 'heading_3' || randomPage.type != 'heading_2')nextLevel = true;
        console.log("typeOfBlock of randomPage has more level? ->" +nextLevel);
        return nextLevel;
   },

  bar() { console.log('bar') },
  baz() { funcs.foo(); funcs.bar() } // here is the fix
}

export default funcsUtils
  