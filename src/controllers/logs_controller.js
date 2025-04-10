const jwt = require('jsonwebtoken');
const db = require('../utils/db');

const getLogs = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a token',
            });
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifyToken) {
            return res.status(403).json({
                success: false,
                message: 'Invalid token',
            });
        }

        const logs = await db.logs.findMany({
            where: {
                userId: verifyToken.id,
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
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a token',
            });
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifyToken) {
            return res.status(403).json({
                success: false,
                message: 'Invalid token',
            });
        }

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
                userId: verifyToken.id,
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
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a token',
            });
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifyToken) {
            return res.status(403).json({
                success: false,
                message: 'Invalid token',
            });
        }

        const id = req.params.id;

        const logDetail = await db.logs.findFirst({
            where: {
                id: id,
                userId: verifyToken.id,
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
