import jwt from 'jsonwebtoken'

export function authMiddleware(req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1] //Первым идет тип токена, а после него уже сам токен. Поэтому надо сначала разъединить их пробелом, а потом взять ту часть, что идет после пробела
        if (!token) {
            return res.status(401).json({ message: "Не авторизован" })
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()
    } catch (e) {
        res.status(401).json({ message: "Не авторизован" })
    }
}