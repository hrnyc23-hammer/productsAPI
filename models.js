const config = require('./config.js')
const Pool = require('pg').Pool
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'sdc',
//     password: 'root',
//     port: 5432,
// })
const pool = new Pool(config)

module.exports = {

    product: (id, callback) => {
        pool.query('SELECT * FROM product INNER JOIN features ON (product.id = features.product_id) WHERE product.id = $1', [id], (err, result) => {
            callback(err, result)
        })
    },

    style: (styleId, callback) => {
        pool.query('SELECT * FROM styles WHERE productId = $1', [styleId], (err, result) => {
            callback(err, result)
        })
    },

    list: (start, end, callback) => {
        pool.query('SELECT * FROM product WHERE id BETWEEN $1 AND $2', [start, end], (err, result) => {
            callback(err, result)
        })
    }
}