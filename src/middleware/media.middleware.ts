import multer from 'multer'

const upload = multer({
    storage: multer.memoryStorage()
})

const mediaMiddleware = {
    single(fieldName: string) {
        return upload.single(fieldName)
    },
    multiple(fieldName: string) {
        return upload.array(fieldName)
    }
}

export default mediaMiddleware;