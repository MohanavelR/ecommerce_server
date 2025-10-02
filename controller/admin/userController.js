const Auth = require("../../models/authModel");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await Auth.find({email:{$ne:process.env.EXCEPT_EMAIL}}).select("-password"); // hide password
        res.json({ // res.status(200) removed
            success: true,
            count: users.length,
            message: "All users retrieved successfully.", // Added descriptive message
            data: users
        });
    } catch (error) {
        res.json({ // res.status(500) removed
            success: false, 
            message: "Failed to retrieve users: " + error.message // Improved error message
        });
    }
};


exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.json({ // res.status(400) removed
                success: false, 
                message: "Invalid role specified. Role must be 'user' or 'admin'." // Improved message
            });
        }

        const user = await Auth.findByIdAndUpdate(
            id,
            { role },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.json({ // res.status(404) removed
                success: false, 
                message: "User not found with the provided ID." // Improved message
            });
        }

        res.json({ // res.status(200) removed
            success: true, 
            message: `User role successfully updated to '${user.role}'.`, // Dynamic success message
            data: user 
        });
    } catch (error) {
        // Handle specific error for invalid ID format (CastError)
        if (error.name === 'CastError') {
            return res.json({ // res.status(400) removed
                success: false,
                message: "Invalid format for user ID."
            });
        }
        // General server error
        res.json({ // res.status(500) removed
            success: false, 
            message: "Failed to update user role: " + error.message // Improved error message
        });
    }
};