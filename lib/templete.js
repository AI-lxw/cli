const Handlebars = require("handlebars");
Handlebars.registerHelper("list", function(items, options) {
    console.log(items);
    console.log(options);
    const itemsAsHtml = items.map(item => "<li>" + options.fn(item) + "</li>");
    return "<ul>\n" + itemsAsHtml.join("\n") + "\n</ul>";
});

const template = Handlebars.compile("{{#list people}}{{firstname}} {{lastname}}{{/list}}");
console.log(template(
    {
        people: [
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
      }
      
));