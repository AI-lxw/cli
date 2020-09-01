const Handlebars = require("handlebars");
const readfile = require('./lib/readfile').asyncReadFile
Handlebars.registerHelper("import", function(items, options) {
    console.log(items);
    console.log(options);
    
    const itemsAsHtml = items.map(item => "<li>" + options.fn(item) + "</li>");
    return "<ul>\n" + itemsAsHtml.join("\n") + "\n</ul>";
});
let hbs = async ()=>{
    let c = await readfile('./index.html')
    const template = Handlebars.compile(c);
    console.log(template(
             [
              {
                firstname: "你好",
                lastname: "Katz",
              },
              {
                firstname: "Carl",
                lastname: "Lerche",
              },
              {
                firstname: "Alan",
                lastname: "Johnson",
              },
            ],
    ));
}
hbs()
