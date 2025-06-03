import passport from 'passport';
import { LocalStrategy } from 'passport-local';
import User from '../model/userModel.js';


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, (email, password, done) => {
    User.findOne({ userName: email })
        .then((user) => {
            if (!user || !user.validatePassword(password)) {
                return done(null, false, { errors: { 'email or password': 'is invalid' } });
            }
            return done(null, user);
        }).catch(done);
}));