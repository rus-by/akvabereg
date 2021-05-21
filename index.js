require('dotenv').config()
const port = process.env.PORT || 3000;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();

app.get(/.*/, function (req, res, next) {
    if (req.headers['x-forwarded-proto'] != 'https') res.redirect('https://www.akvabereg.ru' + req.url) 
    else next() 
   })
var session = require('express-session');
const cookieParser = require('cookie-parser')
const passport = require('./passport');


//ROUTES
const userRoutes = require('./routes/user_routes');
const formRoutes = require('./routes/form_routes');
const projectRoutes = require('./routes/project_routes');

mongoose.connect('mongodb+srv://admin:0kJxFLOZD3WsZiDS@cluster0.qrccy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true }).
    then(db => console.log('[OK] DB is connected')).
    catch(err => console.error(err));
app.use(cors({ credentials: true, origin: 'http://localhost:8080' }))
app.use(session({ secret: 'SECRET' }))
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json())
app.options('*', cors())
app.set('port', port);
app.use('/api/user', userRoutes)
app.use('/api/lead', formRoutes)
app.use('/api/project', projectRoutes)

app.use(express.static(__dirname + '/public/'))
app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.listen(app.get('port'), () => {
    console.log(`[OK] Server is running on localhost:${app.get('port')}`);
});
