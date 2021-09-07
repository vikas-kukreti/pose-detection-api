const express = require('express')
const app = express()
const router = require('./routes')

app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

app.use(router)

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log('🚀 App running at port ' + port)
})