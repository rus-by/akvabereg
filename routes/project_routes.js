const express = require('express')
const Project = require('../models/project')
const STATES = require('../helpers/states')
const routes = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const upload = multer({
    dest: './uploads'
})

routes.post('/new_project', upload.single('file'), async (req, res) => {
    
    const target = req.file.destination + req.file.originalname
    const targetPath = path.join(__dirname, target)
    const tempPath = req.file.path
    fs.rename(tempPath, targetPath, async (err) => {
        if (err) return console.log(err, res)
        var project = new Project({
        image: target,
        title: req.body.title,
        subTitle: req.body.subTitle,
        date: req.body.date,
        created: new Date(),
        status: STATES.CREATED,
        author: req.user.id
    })
    await project.save()
    res.json(project)

    })
})


//routes.get()
//
//
//
//}
//
//routes.get
//res.sendFile(path.join(__dirname, name));
//


routes.get('/all', async (req, res) => {
    const allTasks = await Project.find()
    res.json(allTasks)
})
routes.post('/create', async (req, res) => {
    if (req.body.title) {
        const newTask = {
            title: req.body.title,
            done: false
        }
        const task = new Task(newTask)
        await task.save()
        res.json(task)
    } else {
        res.status(500).send({
            error: 'Something failed!'
        })
    }
})
routes.get('/edit', async (req, res) => {
    const id = req.query._id
    const newTitle = req.query.title
    const task = await Task.findById(id)
    task.title = newTitle
    await task.save()
    res.json('task is saved')
})
routes.delete('/delete', async (req, res) => {
    const id = req.query._id
    await Task.findByIdAndDelete(id)
    res.json('deleted')
})
routes.get('/copy', async (req, res) => {
    const allTasks = await Task.find()
    const index = allTasks.findIndex((el) => el._id == req.query._id)
    const newTask = {
        title: req.query.title,
        done: false
    }
    const task = new Task(newTask)
    await task.save()
    allTasks.splice(index + 1, 0, newTask)
    res.json(allTasks)

})

module.exports = routes
