const User = require('../models/User');

exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const { targetRole, experienceLevel } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { targetRole, experienceLevel },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        next(error);
    }
};
