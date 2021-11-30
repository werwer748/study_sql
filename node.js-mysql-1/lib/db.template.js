var mysql = require('mysql');

var db = mysql.createConnection({
    host     : '',
    user     : '',
    password : '',
    database : ''
});

//git 같은데 올리면 안됨 ㅇㅇ
//dotenv 같이 빈파일로 받아서 서버에서 작성
db.connect();

//   module.exports = db;