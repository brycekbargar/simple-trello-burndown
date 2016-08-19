require('docstring');
const server = require('./../src/server.js');
const routes = server.router.mounts;

const Table = require('cli-table2');
const table = new Table();
for (var key in routes) {
  if (routes.hasOwnProperty(key) && key !== 'getapi') {
    let spec = routes[key].spec;
    let row = {};
    row[spec.method]  = [ spec.path, spec.docString || '' ]; 
    table.push(row);
  }
}

console.log(table.toString());
 
