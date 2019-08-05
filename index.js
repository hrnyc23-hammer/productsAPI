const express = require('express')
const bodyParser = require('body-parser')
const atob = require('atob')
const app = express()
const db = require('./models.js')
const port = process.env.PORT || 8765

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/products/list', (req, res) => {
    let output = []
    let page = Number(req.query.page) || 1
    let count = Number(req.query.count) || 5
    let start = ((page - 1) * count) + 1
    let end = ((page - 1) * count) + count
    db.list(start, end, (err, result) => {
        if (err) {
            console.log('Error: ', err)
            res.sendStatus(500)
        } else {
            for (let i = 0; i < result.rows.length; i++) {
                let productObj = {}
                let price
                if (parseInt(result.rows[i].default_price) == result.rows[i].default_price) {
                    price = result.rows[i].default_price
                } else {
                    price = result.rows[i].default_price.split(' ')[1]
                }
                productObj.id = result.rows[i].id
                productObj.name = result.rows[i].name
                productObj.slogan = result.rows[i].slogan
                productObj.description = result.rows[i].description
                productObj.category = result.rows[i].category
                productObj.default_price = price
                output.push(productObj)
                if (i === result.rows.length - 1) {
                    res.send(output)
                }
            }
        }
    })
})

app.get('/products/:product_id', (req, res) => {
    let output = {}
    db.product(req.params.product_id, (err, result) => {
        if (err) {
            console.log('Error: ', err)
            res.sendStatus(500)
        } else {
            let price
            if (parseInt(result.rows[0].default_price) == result.rows[0].default_price) {
                price = result.rows[0].default_price
            } else {
                price = result.rows[0].default_price.split(' ')[1]
            }
            output.id = result.rows[0].id
            output.name = result.rows[0].name
            output.slogan = result.rows[0].slogan
            output.description = result.rows[0].description
            output.default_price = price
            output.features = []
            for (let item of result.rows) {
                let value
                if (item.value === 'null') {
                    value = ''
                } else {
                    value = item.value
                }
                output.features.push({
                    feature: item.feature,
                    value: value
                })
            }
            res.send(output)
        }
    })
})

app.get('/products/:product_id/styles', (req, res) => {
    let output = {}
    output.product_id = req.params.product_id
    output.results = []
    db.style(req.params.product_id, (err, result) => {
        if (err) {
            console.log('Error: ', err)
            res.sendStatus(500)
        } else {
            for (let i = 0; i < result.rows.length; i++) {
                let styleObj = {}
                let sale
                if (result.rows[i].sale_price === 'null') {
                    sale = '0'
                } else {
                    sale = result.rows[i].sale_price
                }
                styleObj.style_id = result.rows[i].id
                styleObj.name = result.rows[i].name
                styleObj.sale_price = sale
                styleObj.original_price = result.rows[i].original_price
                styleObj['default?'] = parseInt(result.rows[i].default_style)
                styleObj.skus = JSON.parse(atob(result.rows[i].skus))
                for (let key in styleObj.skus) {
                    styleObj.skus[key] = parseInt(styleObj.skus[key])
                }
                styleObj.photos = JSON.parse(atob(result.rows[i].photos)).photos
                output.results.push(styleObj)
                if (i === result.rows.length - 1) {
                    res.send(output)
                }
            }
        }
    })
})

app.listen(port, () => {
    console.log('Listening on port ' + port + '...')
})