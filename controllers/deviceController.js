import { v4 as uuidv4 } from 'uuid';
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Device, DeviceInfo } from '../models/models.js'
import { ApiError } from '../error/ApiError.js'

const __dirname = dirname(fileURLToPath(import.meta.url));

class DeviceController {
    async create(req, res, next) {
        try {

            let { name, price, brandId, typeId, info } = req.body
            const { img } = req.files
            let fileName = uuidv4() + ".png"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const device = await Device.create({ name, price, brandId, typeId, img: fileName })

            if (info) {
                info = JSON.parse(info)
                info.forEach(i => {
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                });
            }

            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.massage))
        }
    }

    async getAll(req, res) {
        let { brandId, typeId, limit, page } = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let devices
        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({ limit, offset })
        }
        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({ where: { brandId }, limit, offset })
        }
        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({ where: { typeId }, limit, offset })
        }
        if (brandId && typeId) {
            devices = await Device.findAndCountAll({ where: { typeId, brandId }, limit, offset })
        }
        return res.json(devices)
    }

    async getOne(req, res, next) {
        try {

            const { id } = req.params
            const device = await Device.findOne(
                {
                    where: { id },
                    include: [{ model: DeviceInfo, as: 'info' }]
                }
            )
            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.massage))
        }
    }
}

export const deviceController = new DeviceController()
