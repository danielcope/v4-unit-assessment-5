INSERT INTO helo_users (username,hash,profile_pic)
VALUES 
  ($1,$2,$3)

returning username,profile_pic