
const Handlebars = require("handlebars");
const template = Handlebars.compile("{{foo}}{{a}}");
template({foo:123});
console.log(template({foo:[{a:123}]}));