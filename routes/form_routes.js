const express = require('express')
const Form = require('../models/form')
const STATES = require('../helpers/states')
const routes = express.Router()
const Guest = require('../models/guest')


routes.post('/create', async (req, res, next) => {
  var form = new Form({name: req.body.name, 
                       phone: req.body.phone,
                       text: req.body.text, 
                       date: req.body.date,
                       created: new Date(),
                       status: STATES.CREATED
                      });
  await form.save();
    res.json(form)
});

routes.post('/new_guest', async (req,res)=>{
  var guest = new Guest({
    visit: 1,
    date: [new Date()],
    status: STATES.CREATED
  });
  await guest.save()
  res.json(guest)
});
routes.post('/new_visit', async (req,res)=>{
  const id= req.body.id
  const result = await Guest.findOne({_id:id})
  if(result){
    result.date.push(new Date())
    result.visit++
    await result.save()
    res.json(result)
  }
  else{
    res.json('smth goes wrong')
  }
  
})

routes.get('/all', async (req, res) => {
    const allForms = await Form.find()
    res.json(allForms)
})
module.exports = routes