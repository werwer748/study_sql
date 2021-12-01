var db = require('./db');
var template = require('./template.js');
var qs = require('querystring');

exports.home = function(request, response){
    db.query(`SELECT * FROM topic`, function(error,topics){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM author`, function(error2,authors){
          var title = 'Authors';
          var list = template.list(topics);
          var html = template.HTML(title, list,
            `
            ${template.authorTable(authors)}
            <form action="/author/create_process" method="post">
                <p>
                    <input type="text" name="name" placeholder="name">
                </p>
                <p>
                    <textarea name="profile" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>
          `,
          ``
          );
          response.writeHead(200);
          response.end(html);
        });
    });
}

exports.create_process = function(request, response){
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      db.query(`
        INSERT INTO author (name, profile) VALUES(?, ?)`,
        [post.name, post.profile],
        function(error, result){
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/author`});
          response.end();
        }
      );
  });
}

exports.update = function(request,response,queryData){
  db.query(`SELECT * FROM topic`, function(error,topics){
      if(error){
        throw error;
      }
      db.query(`SELECT * FROM author`, function(error2,authors){
        if(error2){
          throw error2;
        }
        db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], function(error2,author){
          var title = "author"
          var list = template.list(topics);
          var html = template.HTML(title, list,
            `
            ${template.authorTable(authors)}
            <form action="/author/update_process" method="post">
                <p>
                    <input type="hidden" name="id" value="${queryData.id}">
                </p>
                <p>
                    <input type="text" name="name" value="${author[0].name}" placeholder="name">
                </p>
                <p>
                    <textarea name="profile" placeholder="description">${author[0].profile}</textarea>
                </p>
                <p>
                    <input type="submit" value="update">
                </p>
            </form>
          `,
          ``
          );
          response.writeHead(200);
          response.end(html);
        });
      });
  });
}

exports.update_pocess = function(request, response){
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      db.query(`
      UPDATE author SET name=?, profile=? WHERE id=?`,
      [post.name, post.profile, post.id],
      function(error, result){
          if(error){
          throw error;
          }
          response.writeHead(302, {Location: `/author`});
          response.end();
      }
      );
  });
};

exports.delete_process = function(request, response){
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      db.query(`DELETE FROM topic WHERE author_id=?`,[post.id],
      function(error,result){
      if(error){
          throw error;
      }
        db.query(`DELETE FROM author WHERE id=?`,[post.id],
        function(error1,result1){
        if(error1){
            throw error1;
        }
        response.writeHead(302, {Location: `/author`});
        response.end();
        });
      });
  });
};