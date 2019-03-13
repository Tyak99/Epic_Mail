import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';
import db from '../db/index';

const LocalOption = { usernameField: 'email' };

const LocalLogin = new LocalStrategy(LocalOption, (email, password, done) => {
  db.query('SELECT * FROM users WHERE email = $1', [email], (err, res) => {
    // if the user doesnt exist return done with null and false
    if (!res.rows[0]) {
      done(null, false);
    } else {
      const hash = res.rows[0].password;
      console.log(hash);
      bcrypt.compare(password, hash, (err, response) => {
        // res === true
        if (response === false) {
          done(null, false);
        } else {
          console.log(res.rows[0]);
          done(null, res.rows[0]);
        }
      });
    }
  });
});

passport.use(LocalLogin);
