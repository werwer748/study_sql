var http = require('http');
var url = require('url');

var db = require('./lib/db');
var template = require('./lib/template.js');
var qs = require('querystring');

var topic = require('./lib/topic');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        topic.home(request, response);
      } else {
        topic.page(request,response,queryData);
      }
    } else if(pathname === '/create'){
      topic.create(request, response);
    } else if(pathname === '/create_process'){
      topic.create_process(request, response);
    } else if(pathname === '/update'){
      topic.update(request, response, queryData);
    } else if(pathname === '/update_process'){
      topic.update_pocess(request, response);
    } else if(pathname === '/delete_process'){
      topic.delete_process(request, response);
    } else if(pathname === '/authors'){
      db.query(`SELECT * FROM topic`, function(error,topics){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM author`, function(error2,authors){
          var title = 'Authors';
          var list = template.list(topics);
          var html = template.HTML(title, list,
          template.table(authors),
          `<a href="/author_create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    } else if(pathname === "/author_create"){
      db.query(`SELECT * FROM topic`, function(error,topics){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM author`, function(error2,authors){
          var title = 'Authors';
          var list = template.list(topics);
          var html = template.HTML(title, list,
            `<form action="/author_create_process" method="post>
              <p>
                name: <input type="text">
              </p>
              <p>
                profile: <input type="textarea">
              </p>
            </form>`,
            template.table(authors),
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    }else {
      response.writeHead(404);
      response.end('Not found');
    }
});

app.listen(3000);
