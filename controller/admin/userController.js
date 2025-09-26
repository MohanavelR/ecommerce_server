const authModel = require("../../models/authModel");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await authModel.find().select("-password"); // hide password
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.json({ success: false, message: "Invalid role" });
        }

        const user = await authModel.findByIdAndUpdate(
            id,
            { role },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "Role updated successfully", data: user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};