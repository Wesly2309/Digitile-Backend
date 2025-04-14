const db = require('../utils/db');

const getLogs = async (req, res) => {
    try {
       
        const logs = await db.logs.findMany({
            where: {
                userId: req.user.id,
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Retrieving Logs',
            data: logs, 
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message,
        });
    }
};

const storeLog = async (req, res) => {
    try {
     
        const { capsuleId } = req.body;

        if (!capsuleId) {
            return res.status(422).json({
                success: false,
                message: 'Capsule ID is required',
            });
        }

        const newLog = await db.logs.create({
            data: {
                capsuleId,
                open_at: new Date().toLocaleDateString('id-ID'),
                userId: req.user.id,
            },
        });

        return res.status(201).json({
            success: true,
            message: 'Successfully created a new Log',
            data: newLog,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message,
        });
    }
};

const getLogDetails = async (req, res) => {
    try {
       

        const id = req.params.id;

        const logDetail = await db.logs.findFirst({
            where: {
                id: id,
                userId: req.user.id,
            },
        });

        if (!logDetail) {
            return res.status(404).json({
                success: false,
                message: 'Log not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: `Log detail id: ${id}`,
            data: logDetail,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message,
        });
    }
};

module.exports = {
    getLogs,
    storeLog,
    getLogDetails,
};
