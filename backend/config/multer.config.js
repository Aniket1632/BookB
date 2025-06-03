import multer from 'multer';
import path from 'path';
import fs from 'fs';

var storage = multer.memoryStorage()

const MediaStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const temp = `${path.resolve()}/backend/asset`
        if (!fs.existsSync(temp))
            fs.mkdirSync(temp)
        cb(null, temp)
    },
    filename: function (req, file, cb) {
        var ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
})

export const uploadImage = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.PNG' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.jpeg') {
            return callback(new Error('Only PNG and JPG file is allowed.'), false)
        }
        callback(null, true)
    }
});

export const uploadVideo = multer({
    storage: MediaStorage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.mp4' && ext !== '.MP4') {
            return callback(new Error('Only MP4 file is allowed.'), false)
        }
        callback(null, true)
    }
});
export const uploadFile = multer({
	storage: storage, fileFilter: function (req, file, callback) {
		var ext = path.extname(file.originalname);
		if (ext !== '.xlsx') {
			return callback(new Error('Only excel file is allowed.'), false)
		}
		callback(null, true)
	}
})

export const uploadMultipleFiles = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (file.fieldname === 'image') {
            if (ext !== '.png' && ext !== '.PNG' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.jpeg') {
                callback(new Error('Only PNG and JPG file is allowed.'), false)

            }
            callback(null, true)
        }
        if (file.fieldname === 'darkImage') {
            if (ext !== '.png' && ext !== '.PNG' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.jpeg') {
                callback(new Error('Only PNG and JPG file is allowed.'), false)

            }
            callback(null, true)
        }
        if (file.fieldname === 'websiteLogoImageURL') {
            if (ext !== '.png' && ext !== '.PNG' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.jpeg') {
                callback(new Error('Only PNG and JPG file is allowed.'), false)

            }
            callback(null, true)
        }
        if (file.fieldname === 'websiteBannerImageURL') {
            if (ext !== '.png' && ext !== '.PNG' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.jpeg') {
                callback(new Error('Only PNG and JPG file is allowed.'), false)

            }
            callback(null, true)
        }
        if (file.fieldname === 'appLogoImageURL') {
            if (ext !== '.png' && ext !== '.PNG' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.jpeg') {
                callback(new Error('Only PNG and JPG file is allowed.'), false)

            }
            callback(null, true)
        }
        if (file.fieldname === 'loginBackgroundImageURL') {
            if (ext !== '.png' && ext !== '.PNG' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.jpeg') {
                callback(new Error('Only PNG and JPG file is allowed.'), false)

            }
            callback(null, true)
        }
        if (file.fieldname === 'registerBackgroundImageURL') {
            if (ext !== '.png' && ext !== '.PNG' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.jpeg') {
                callback(new Error('Only PNG and JPG file is allowed.'), false)

            }
            callback(null, true)
        }
        if (file.fieldname === 'headerImageURL') {
            if (ext !== '.png' && ext !== '.PNG' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.jpeg') {
                callback(new Error('Only PNG and JPG file is allowed.'), false)

            }
            callback(null, true)
        }
        if (file.fieldname === 'videoHeaderImageURL') {
            if (ext !== '.png' && ext !== '.PNG' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.jpeg') {
                callback(new Error('Only PNG and JPG file is allowed.'), false)

            }
            callback(null, true)
        }
        if (file.fieldname === 'shopHeaderImageURL') {
            if (ext !== '.png' && ext !== '.PNG' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.jpeg') {
                callback(new Error('Only PNG and JPG file is allowed.'), false)

            }
            callback(null, true)
        }
        if (file.fieldname === 'profileHeaderImageURL') {
            if (ext !== '.png' && ext !== '.PNG' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.jpeg') {
                callback(new Error('Only PNG and JPG file is allowed.'), false)

            }
            callback(null, true)
        }
    }
});