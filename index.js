const express = require('express');
const mongoose = require('mongoose');



const cors = require('cors')
const app = express();
var session = require('express-session');
const cookieParser = require('cookie-parser')
const passport = require('./passport');


//ROUTES
const userRoutes = require('./routes/user_routes');
const formRoutes = require('./routes/form_routes');
const projectRoutes = require('./routes/project_routes');


mongoose.connect('mongodb://localhost:27017/akvabereg', { useNewUrlParser: true }).
then(db => console.log('[OK] DB is connected')).
catch(err => console.error(err));
app.use(cors({credentials: true, origin: 'http://localhost:8080'}))
app.use(session({secret: 'SECRET'}))
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json())
app.options('*', cors())
app.set('port', 3001);
app.use('/api/user', userRoutes)
app.use('/api/lead', formRoutes)
app.use('/api/project', projectRoutes)


app.listen(app.get('port'), () => {
    console.log(`[OK] Server is running on localhost:${app.get('port')}`);
});