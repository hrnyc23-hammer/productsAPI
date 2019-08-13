const express = require('express')
const bodyParser = require('body-parser')
const atob = require('atob')
const app = express()
const db = require('./models.js')
const path = require('path')
const redis = require('redis')
const r = redis.createClient(6379, '18.191.35.41')
const port = process.env.PORT || 8765

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static(path.join(__dirname, 'dist')))

app.get('/products/list', (req, res) => {
    let output = []
    let page = Number(req.query.page) || 1
    let count = Number(req.query.count) || 5
    let start = ((page - 1) * count) + 1
    let end = ((page - 1) * count) + count
    r.get(page + 'l' + count, (err, resultr) => {
        if (err) {
            console.log('Error: ', err)
            res.sendStatus(500)
        } else {
            if (resultr === null) {
                db.list(start, end, (err, result) => {
                    if (err) {
                        console.log('Error: ', err)
                        res.sendStatus(500)
                    } else {
                        r.set(page + 'l' + count, JSON.stringify(result))
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
            } else {
                resultr = JSON.parse(resultr)
                for (let i = 0; i < resultr.rows.length; i++) {
                    let productObj = {}
                    let price
                    if (parseInt(resultr.rows[i].default_price) == resultr.rows[i].default_price) {
                        price = resultr.rows[i].default_price
                    } else {
                        price = resultr.rows[i].default_price.split(' ')[1]
                    }
                    productObj.id = resultr.rows[i].id
                    productObj.name = resultr.rows[i].name
                    productObj.slogan = resultr.rows[i].slogan
                    productObj.description = resultr.rows[i].description
                    productObj.category = resultr.rows[i].category
                    productObj.default_price = price
                    output.push(productObj)
                    if (i === resultr.rows.length - 1) {
                        res.send(output)
                    }
                }
            }
        }
    })
})

app.get('/products/:product_id', (req, res) => {
    let output = {}
    r.get(req.params.product_id + 'p', (err, resultr) => {
        if (err) {
            console.log('Error: ', err)
            res.sendStatus(500)
        } else {
            if (resultr === null) {
                db.product(req.params.product_id, (err, result) => {
                    if (err) {
                        console.log('Error: ', err)
                        res.sendStatus(500)
                    } else {
                        r.set(req.params.product_id + 'p', JSON.stringify(result))
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
                        output.features = JSON.parse(atob(result.rows[0].features)).features
                        for (let item of output.features) {
                            if (item.value === 'null') {
                                item.value = ''
                            }
                        }
                        res.send(output)
                    }
                })
            } else {
                resultr = JSON.parse(resultr)
                let price
                if (parseInt(resultr.rows[0].default_price) == resultr.rows[0].default_price) {
                    price = resultr.rows[0].default_price
                } else {
                    price = resultr.rows[0].default_price.split(' ')[1]
                }
                output.id = resultr.rows[0].id
                output.name = resultr.rows[0].name
                output.slogan = resultr.rows[0].slogan
                output.description = resultr.rows[0].description
                output.default_price = price
                output.features = JSON.parse(atob(resultr.rows[0].features)).features
                for (let item of output.features) {
                    if (item.value === 'null') {
                        item.value = ''
                    }
                }
                res.send(output)
            }
        }
    })

})

app.get('/products/:product_id/styles', (req, res) => {
    let output = {}
    output.product_id = req.params.product_id
    output.results = []
    r.get(req.params.product_id + 's', (err, resultr) => {
        if (err) {
            console.log(err)
            res.sendStatus(500)
        } else {
            if (resultr === null) {
                db.style(req.params.product_id, (err, result) => {
                    if (err) {
                        console.log('Error: ', err)
                        res.sendStatus(500)
                    } else {
                        r.set(req.params.product_id + 's', JSON.stringify(result))
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
                            if (Object.keys(JSON.parse(atob(result.rows[i].skus))).length === 0) {
                                styleObj.skus = { null: null }
                            } else {
                                styleObj.skus = JSON.parse(atob(result.rows[i].skus))
                                for (let key in styleObj.skus) {
                                    styleObj.skus[key] = parseInt(styleObj.skus[key])
                                }
                            }
                            if (JSON.parse(atob(result.rows[i].photos)).photos.length === 0) {
                                styleObj.photos = [{ thumbnail_url: null, url: null }]
                            } else {
                                styleObj.photos = JSON.parse(atob(result.rows[i].photos)).photos
                            }
                            output.results.push(styleObj)
                            if (i === result.rows.length - 1) {
                                res.send(output)
                            }
                        }
                    }
                })
            } else {
                resultr = JSON.parse(resultr)
                for (let i = 0; i < resultr.rows.length; i++) {
                    let styleObj = {}
                    let sale
                    if (resultr.rows[i].sale_price === 'null') {
                        sale = '0'
                    } else {
                        sale = resultr.rows[i].sale_price
                    }
                    styleObj.style_id = resultr.rows[i].id
                    styleObj.name = resultr.rows[i].name
                    styleObj.sale_price = sale
                    styleObj.original_price = resultr.rows[i].original_price
                    styleObj['default?'] = parseInt(resultr.rows[i].default_style)
                    if (Object.keys(JSON.parse(atob(resultr.rows[i].skus))).length === 0) {
                        styleObj.skus = { null: null }
                    } else {
                        styleObj.skus = JSON.parse(atob(resultr.rows[i].skus))
                        for (let key in styleObj.skus) {
                            styleObj.skus[key] = parseInt(styleObj.skus[key])
                        }
                    }
                    if (JSON.parse(atob(resultr.rows[i].photos)).photos.length === 0) {
                        styleObj.photos = [{ thumbnail_url: null, url: null }]
                    } else {
                        styleObj.photos = JSON.parse(atob(resultr.rows[i].photos)).photos
                    }
                    output.results.push(styleObj)
                    if (i === resultr.rows.length - 1) {
                        res.send(output)
                    }
                }
            }
        }
    })

})

app.listen(port, () => {
    console.log('Listening on port ' + port + '...')
})