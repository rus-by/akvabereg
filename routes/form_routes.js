const express = require('express')
const Form = require('../models/form')
const STATES = require('../helpers/states')
const routes = express.Router()
const Guest = require('../models/guest')
const BOT = require('../bot')
const User = require('../models/user')

const format = require('date-fns/format')
const ru = require('date-fns/locale/ru')
const parseISO = require('date-fns/parseISO')

routes.post('/create', async(req, res, next) => {
    var form = new Form({
        name: req.body.name,
        phone: req.body.phone,
        text: req.body.text,
        date: req.body.date,
        time: req.body.time,
        created: new Date(),
        status: STATES.CREATED
    });
    await form.save();

    const telegramUsers = await User.find({ chatId: { $ne: null } })
    const formatedDate = format(new Date(), 'd MMMM', { locale: ru })

    if (req.body.date) {
        const parsedDate = parseISO(req.body.date)
        var formatedCallBackDate = format(parsedDate, 'd MMMM', { locale: ru })

    } else {
        formatedCallBackDate = '-'

    }

    for (const user of telegramUsers) {
        try {
            BOT.telegram.sendMessage(user.chatId,
                `НОВАЯ ЗАЯВКА` +
                `\n\n` +
                `Имя:  ${req.body.name},` +
                `\n` +
                `Телефон:  ${req.body.phone},` +
                `\n` +
                `Когда перезвонить:  ${formatedCallBackDate} ${req.body.time},` +
                `\n` +
                `Комментарий:  ${req.body.text},` +
                `\n\n` +
                `Создано:  ${formatedDate},`

            )

        } catch (err) {
            console.log(err)
        }

    }
    res.json(true)
        // res.json(form)
});

routes.post('/new_guest', async(req, res) => {
    var guest = new Guest({
        visit: 1,
        date: [new Date()],
        status: STATES.CREATED
    });
    await guest.save()
    res.json(guest)
});
routes.post('/new_visit', async(req, res) => {
    const id = req.body.id
    const result = await Guest.findOne({ _id: id })
    if (result) {
        result.date.push(new Date())
        result.visit++
            await result.save()
        res.json(result)
    } else {
        res.json('smth goes wrong')
    }

})
routes.post('/complete', async(req, res) => {
    const id = req.body.id
    const data = {
        name: req.body.name,
        phone: req.body.phone,
        date: new Date()
    }
    const result = await Guest.findOne({ _id: id })
    if (result) {
        result.data.push(data)
        await result.save()
        res.json(true)
    } else {
        res.json('smth goes wrong')
    }

})
routes.use(async(req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.send(401)
    }
})

routes.get('/all', async(req, res) => {
    const allForms = await Form.find({ status: { $ne: STATES.DELETED } })
    res.json(allForms)
})

routes.post('/edit', async(req, res) => {
    const id = req.body.id
    const newName = req.body.name
    const newPhone = req.body.phone
    const lead = await Form.findById(id)
    lead.name = newName
    lead.phone = newPhone
    await lead.save()
    res.json('lead is changed and saved')
})
routes.post('/filter', async(req, res) => {
    const filterStatus = req.body.status
    const data = await Form.find({ status: filterStatus })
    res.json(data)
})
routes.post('/filter/date', async(req, res) => {
    const startDate = req.body.startDate
    const endDate = req.body.endDate
    const filter = {}
    if (startDate) {
        filter.$gte = startDate
    }
    if (endDate) {
        filter.$lte = endDate
    }
    const data = await Form.find({ date: filter })
    res.json(data)
})
routes.post('/delete', async(req, res) => {
    const id = req.body.id
    const lead = await Form.findById(id)
    lead.status = STATES.DELETED
    await lead.save()
    res.json('lead is deleted')
})
routes.post('/status', async(req, res) => {
    const id = req.body.id
    const status = req.body.status
    const lead = await Form.findById(id)
    lead.status = status
    await lead.save()
    res.json('lead status is changed')
})
module.exports = routes