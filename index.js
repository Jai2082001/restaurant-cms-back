const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoConnect = require('./database/database').mongoConnect;
const cookieParser = require('cookie-parser');
const productroute = require('./routes/products');
const userroutes = require('./routes/userflow')
const categoriesroute = require('./routes/category');
let port = process.env.PORT || 5000




app.use(cors({
    origin: true,
    credentials: true 
}));
app.use(cookieParser())
app.use(bodyParser.json({limit: '100mb'}))
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.post('/api/products', productroute);
app.post('/categories/add', categoriesroute)
app.get('/api/categories', categoriesroute)
app.get('/api/products', productroute)
app.post('/api/user/login', userroutes)
app.post('/api/user/register', userroutes);

app.get('/', (req, res, next)=>{
    console.log('here we are');
    console.log(req.cookies)
    res.send({status: 'hello'})
})
mongoConnect(() => {
    app.listen(port, ()=>{
        console.log('Connected at ' + port)
    });
})