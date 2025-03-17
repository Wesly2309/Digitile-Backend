const jwt = require('jsonwebtoken')
const db = require('../utils/db')


const getGeoLocations = async (req,res) => {
try {
    const token = req.headers.authorization?.split(' ')[1]

    if(!token) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a token'
        })
    }

    if(token) {
        const verifyToken = jwt.verify(token , process.env.JWT_SECRET)
        if(verifyToken) {
            const geolocations = await db.geolocation.findMany({
                where: {
                    userId: verifyToken.id 
                } , 
                include: {
                    capsule: true
                }
            })

            return res.status(200).json({
                success: true,
                message: 'List of Geo Locations',
                data: geolocations
            })
        } else {
            throw new Error('User is not valid')
        }
    }


} catch (err) {
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    })
}
}

const storeGeoLocation = async (req,res ) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]


        if(token) {
            const verifyToken = jwt.verify(token , process.env.JWT_SECRET)
            
            
            if(verifyToken) {
                const {capsuleId , clue , hint , difficult_type} = req.body 
                if(!capsuleId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Capsule is required'
                    })
                }
                const newGeolocation = await db.geolocation.create({
                    data: {
                        capsuleId , 
                        clue , 
                        userId: verifyToken.id , 
                        hint , 
                        difficult_type
                    }
                })

                

                return res.status(201).json({
                    success: true ,
                    message: 'Geo Location Created',
                    data: newGeolocation
                })
            } else {
                throw new Error('Token is not valid')
            }
        }else {
            throw new Error('Please provide a token')
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

const detailGeoLocation = async (req,res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if(token) {
            const verifyToken = jwt.verify(token , process.env.JWT_SECRET)
            if(verifyToken) {
                const id = req.params['id'] 
                const detailGeo = await db.geolocation.findFirst({
                    where: {
                        id: id , 
                        userId : verifyToken.id
                    },
                    include: {
                        capsule: true
                    }
                })

                return res.status(200).json({
                    success: true,
                    message: 'Detail of Geo Location',
                    data: detailGeo
                })

            } else {
                throw new Error('Invalid token')
            }
        }else {
            throw new Error('Please provide a token')
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

const updateGeoLocation = async (req,res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if(token) {
            const verifyToken = jwt.verify(token , process.env.JWT_SECRET)
            if(verifyToken) {
                const id = req.params['id']
                const {clue , hint  , capsuleId , difficult_type} = req.body 
                const updatedGeo = await db.geolocation.update({
                    where: {
                        id: id , 
                        userId: verifyToken.id 
                    },
                    data: {
                        clue , hint , capsuleId , difficult_type
                    }
                })
                return res.status(200).json({
                    success: true , 
                    message: 'Success update geo location',
                    data: updatedGeo
                })
            } else {
                throw new Error('Invalid token')
            }
        } else {
            throw new Error('Please provide a token')
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message 
        })
    }
}

const deleteGeoLocation = async (req,res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if(token) {
            const verifyToken = jwt.verify(token , process.env.JWT_SECRET)
            if(verifyToken) {
                const id = req.params['id']
                const deletedGeo = await db.geolocation.delete({
                    where: {
                        id, 
                        userId: verifyToken.id
                    }
                })
                console.log(deletedGeo)
                return res.status(200).json({
                    success: true,
                    message: 'Delete geo location success'
                })
            }else {
                throw new Error('Invalid token')
            }
        } else {
            throw new Error('Please provide a token')
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

module.exports = {
    getGeoLocations,
    storeGeoLocation,
    detailGeoLocation,
    updateGeoLocation,
    deleteGeoLocation

}