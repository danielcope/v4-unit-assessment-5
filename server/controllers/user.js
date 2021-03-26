const bcrypt = require('bcryptjs');

module.exports = {
    register: async (req, res) => {
      const { username, password } = req.body;
      const db = req.app.get('db');
      const result = await db.find_user_by_username([username]);
      const existingUser = result[0];

      if (existingUser) {
        return res.status(409).send('Username taken');
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      
      const profile_pic = `https://robohash.org/${username}.png`

      const registeredUser = await db.create_user([ username, hash, profile_pic ]);
      const user = registeredUser[0];
      req.session.user = { username: user.username, id: user.id, profile_pic: user.profile_pic };
      return res.status(201).send(req.session.user);
    },
  
    login: async (req, res) => {
      const { username, password } = req.body;
      const foundUser = await req.app.get('db').find_user_by_username([username]);
      const user = foundUser[0];
      if (!user) {
        return res.status(401).send('User not found. Please register as a new user before logging in.');
      }
      const isAuthenticated = bcrypt.compareSync(password, user.hash);
      if (!isAuthenticated) {
        return res.status(403).send('Incorrect password');
      }
      req.session.user = { id: user.id, username: user.username };
      return res.send(req.session.user);
    },
    logout: (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    },

    getUser: (req,res) => {
      const { username } = req.session.user;
      
      if(username) {
        return res.status(200).send(req.session.user)
      } else {
        return res.status(404).send('No user logged in.')
      };
    }
  }