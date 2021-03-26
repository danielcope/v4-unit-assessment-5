require('dotenv').config();
const express = require('express'),
      userCtrl = require('./controllers/user'),
     postCtrl = require('./controllers/posts');
const massive = require('massive');
const session = require('express-session');
const app = express();


const { SERVER_PORT,CONNECTION_STRING,SESSION_SECRET } = process.env;

app.use(express.json());

app.use(session({
  secret:SESSION_SECRET,
  resave:false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  }

}));

//Auth Endpoints
app.post('/api/auth/register', userCtrl.register);
app.post('/api/auth/login', userCtrl.login);
app.get('/api/auth/me', userCtrl.getUser);
app.post('/api/auth/logout', userCtrl.logout);

//Post Endpoints
// app.get('/api/posts', postCtrl.readPosts);
// app.post('/api/post', postCtrl.createPost);
// app.get('/api/post/:id', postCtrl.readPost);
// app.delete('/api/post/:id', postCtrl.deletePost)



massive ({
  connectionString: CONNECTION_STRING,
  ssl:{
    rejectUnauthorized:false
  }
})
  .then(dbInst => {
    app.set('db',dbInst)
      
    app.listen(SERVER_PORT,() => console.log(`Server running on port` + ' ' +SERVER_PORT))
  })
  .catch(err => console.log(err));