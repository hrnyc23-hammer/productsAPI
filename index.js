const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./models.js')

const port = process.env.PORT || 8765

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/products/list', (req, res) => {
    //console.time('list')
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
                    //console.timeEnd('list')
                    res.send(output)
                }
            }
        }
    })
})

app.get('/products/:product_id', (req, res) => {
    //console.time('product')
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
            //console.timeEnd('product')
            res.send(output)
        }
    })
})

app.get('/products/:product_id/styles', (req, res) => {
    //console.time('styles')
    let output = {}
    output.product_id = req.params.product_id
    output.results = []
    db.styles(req.params.product_id, (err, result) => {
        if (err) {
            console.log('Error: ', err)
            res.sendStatus(500)
        } else {
            for (let i = 0; i < result.rows.length; i++) {
                let styleObj = {}
                let id = result.rows[i].id
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
                styleObj['default?'] = result.rows[i].default_style
                styleObj.photos = []
                styleObj.skus = {}
                db.skus(id, (err2, result2) => {
                    if (err2) {
                        console.log('Error: ', err2)
                        res.sendStatus(500)
                    } else {
                        for (let sku of result2.rows) {
                            styleObj.skus[sku.size] = parseInt(sku.quantity)
                        }
                        db.photos(id, (err3, result3) => {
                            if (err3) {
                                console.log('Error: ', err3)
                                res.sendStatus(500)
                            } else {
                                for (let photo of result3.rows) {
                                    let photoObj = {}
                                    photoObj.thumbnail_url = photo.thumbnail_url
                                    photoObj.url = photo.url
                                    styleObj.photos.push(photoObj)
                                }
                                output.results.push(styleObj)
                                if (i === result.rows.length - 1) {
                                    //console.timeEnd('styles')
                                    res.send(output)
                                }
                            }
                        })
                    }
                })
            }
        }
    })
})

app.listen(port, () => {
    console.log('Listening on port ' + port + '...')
})