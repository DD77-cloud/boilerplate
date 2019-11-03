if (process.env.NODE_ENV === 'development') {
  require('./secrets.js')
}
const db = require('./server/database/db.js')

const app = require('./server');
const port = process.env.PORT || 3000;

db.sync()  
  .then(function(){
    app.listen(port) 
  }) 