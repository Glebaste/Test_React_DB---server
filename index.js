import 'dotenv/config.js'
import express from 'express'
import { sequelize } from './db.js'
import {
    User,
    Basket,
    BasketDevice,
    Device,
    Type,
    Brand,
    Rating,
    DeviceInfo,
    TypeBrand
} from './models/models.js'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import {router} from './routes/index.js'
import {errorHandler} from './middleware/ErrorHandlingMiddleware.js'
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({}))
app.use('/api', router)

//Обработка ошибок, последний Middleware
app.use(errorHandler)



const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()