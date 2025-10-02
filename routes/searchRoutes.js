// const { searchProducts } = require("../controller/searchController")

const { searchProducts } = require('../controller/searchController')

const router = require('express').Router()

router.get('/:keyword',searchProducts)

module.exports=router