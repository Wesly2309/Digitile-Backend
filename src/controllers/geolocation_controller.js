const db = require('../utils/db')


const getGeoLocations = async (req,res) => {
try {
    
            const geolocations = await db.geolocation.findMany({
                where: {
                    userId: req.user.id 
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



} catch (err) {
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    })
}
}

const storeGeoLocation = async (req, res) => {
  try {
    const { capsuleId, clue, hint, difficult_type, latitude, longitude } = req.body;

    if (!capsuleId) {
      return res.status(400).json({
        success: false,
        message: 'Capsule is required',
      });
    }

    // Cek apakah req.user tersedia
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User ID not found from token',
      });
    }

    // Opsional: validasi bahwa user ID memang ada di database
    const userExists = await db.user.findUnique({ where: { id: req.user.id } });
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found in database',
      });
    }

    const newGeolocation = await db.geolocation.create({
      data: {
        capsuleId,
        clue,
        userId: req.user.id, // pastikan ini valid
        hint,
        latitude,
        longitude,
        difficult_type,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Geo Location Created',
      data: newGeolocation,
    });
  } catch (err) {
    console.error('Create GeoLocation Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};


const detailGeoLocation = async (req,res) => {
    try {
       
                const id = req.params['id'] 
                const detailGeo = await db.geolocation.findFirst({
                    where: {
                        id: id , 
                        userId : req.user.id
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
       
                const id = req.params['id']
                const {clue , hint  , capsuleId , difficult_type} = req.body 
                const updatedGeo = await db.geolocation.update({
                    where: {
                        id: id , 
                        userId: req.user.id 
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
       
                const id = req.params['id']
               await db.geolocation.delete({
                    where: {
                        id, 
                        userId: req.user.id
                    }
                }).then(() => {
                    
                return res.status(200).json({
                    success: true,
                    message: 'Delete geo location success'
                })
                })

          
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
