const express = require('express')
const User = require('../models/user')
const routes = express.Router()
const cors = require('cors')
const passport = require('../passport')

// routes.post('/register', cors({credentials: true}), (req, res, next) => {
//   var user = new User({ username: req.body.username, password: req.body.password});
//   user.save(function(err) {
//     return err
//       ? next(err)
//       : req.logIn(user, function(err) {
//         return err
//           ? next(err)
//           : res.json(user);
//       });
//   });
// });


routes.post('/testAut', (req, res, next) => {
  res.send(req.isAuthenticated())
})

routes.post('/login',  (req, res, next) => {
  passport.authenticate('local',
    function(err, user, info) {
      if (err) {
        res.json(err)
      } else {
        req.logIn(user, function(err) {
          if (user) {
            res.send(user)
          } else {
            res.send(info)
          }
        })
      }
    }
  )(req, res, next)
})

routes.get('/get', async (req, res) => {
  const u = await User.find({isDeleted: false}).populate('posts')
//  .then(function(models){
//      models.forEach(function(model){
//        model.isDeleted = false
//        model.save()   
//      })
//  })

  res.json(u)
})


routes.get('/log_out', (req, res) =>{
    req.logout()
    res.send('is loged out')
})

module.exports = routes