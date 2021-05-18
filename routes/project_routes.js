const express = require('express')
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const s3 = new AWS.S3({
    accessKeyId: 'AKIAT77347UL6TTO5BPK',
    secretAccessKey: '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'
  });
const Project = require('../models/project')
// const STATES = require('../helpers/states')
const routes = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const fsPromises = fs.promises

const PROJECT_STATES ={
    DELETED: 0,
    CREATED: 1,
    BACKUP: 2
}
// const upload = multer({
//     dest: '../uploads'
// })
const upload = multer({
    storage: multerS3({
        s3, // instance of your S3 bucket
      contentDisposition: 'attachment',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      bucket(req, file, callb) {
        // logic to dynamically select bucket
        // or a simple `bucket: __bucket-name__,`
        callb(null, '_my_bucket_');
      },
      metadata(req, file, cb) {
        cb(null, {
          'X-Content-Type-Options': 'nosniff',
          'Content-Security-Policy': 'default-src none; sandbox',
          'X-Content-Security-Policy': 'default-src none; sandbox',
        });
      },
      async key(req, file, abCallback) {
        try {
          // logic to dynamically select key or destination
          abCallback(null, ' _dest/key_');
        } catch (err) {
          abCallback(err);
        }
      },
    }),
    limits: {}, // object with custom limits like file size,
  });

routes.get('/all', async (req, res) => {
    const allProjects = await Project.find({status: {$eq: PROJECT_STATES.CREATED}}).populate('changes')
    console.log(req.cookies)
    res.json(allProjects)
})

routes.get('/get_img', async(req,res)=>{
    const name = req.query.name
    res.sendFile(path.join(__dirname, name));
})

routes.use(async (req,res,next)=>{
    if(req.user){
        next()
    }
    else{
        res.send(401)
    }
})



routes.post('/new_project', upload.single('file'), async (req, res) => {
    try{    
    // const truePath = await reName(req.file)

        const project = new Project({
            image: req.file.name,
            title: req.body.title,
            subTitle: req.body.subTitle,
            date: req.body.date,
            created: new Date(),
            status: PROJECT_STATES.CREATED,
            author: req.user._id
    })
    await project.save()
    res.json(project)
    }
       catch(error){
           res.send(error)
        console.log(error)
}
        
})

async function reName(file){

    const extname = path.extname(file.originalname).toLowerCase();
    const allowedExt = ['.png','.jpg','.jpeg']
    
    if(allowedExt.includes(extname)){
        const tempPath = file.path
        const truePath = tempPath + extname
        const targetPath = path.join(__dirname, truePath)
        await fsPromises.rename(tempPath, targetPath)
        return truePath
    }
    else{
        throw new Error('"reNane()" extension false')
    }
}
routes.post('/edit', upload.single('file'), async (req, res) => {
    // let truePath 
    // if(req.file){
    //     truePath = await reName(req.file)   
    // }
    const id = req.body.id
    const newTitle = req.body.title
    const newSubTitle = req.body.subTitle
    const newDate = req.body.date
    const project = await Project.findOne({_id:id})
    const changes = Object.assign([],project.changes)
    project.status = PROJECT_STATES.BACKUP
    const img = req.file.name
    changes.push(id)
    const newProject = new Project({
        title: newTitle,
        subTitle: newSubTitle,
        date: newDate,
        status: PROJECT_STATES.CREATED,
        image: img,
        created: project.created,
        author: project.author,
        changes: changes
    })
    await project.save()
    await newProject.save()
    res.json('project is edited and saved')
})

module.exports = routes
