import studentModel from "../models/studentModel.js";
import bcrypt from "bcrypt";

export const getProfile = async (req, res) => {
    try {
        const studentId = req.user.id; // from authMiddleware

        const user = await studentModel.getFullProfile(studentId);

        if (!user) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Exclude password from the response
        const { password, ...profileData } = user;

        res.status(200).json({
            message: "Profile retrieved successfully",
            profile: profileData
        });

    } catch (error) {
        console.error("Get Profile error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const studentId = req.user.id;

        let updateData = { ...req.body };
        // If password is provided, hash it
        if (updateData.password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        }

        await studentModel.updateProfile(studentId, updateData);

        // Fetch and return the updated profile
        const updatedUser = await studentModel.getFullProfile(studentId);

        res.status(200).json({
            message: "Profile updated successfully",
            profile: updatedUser
        });
    } catch (error) {
        console.error("Update Profile error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteApplication = async (req, res) => {
    try {
        const studentId = req.user.id;
        const applicationId = req.params.applicationId;

        await studentModel.deleteApplication(studentId, applicationId);
        const updatedUser = await studentModel.getFullProfile(studentId);

        res.status(200).json({
            message: "Application deleted successfully",
            profile: updatedUser
        });
    } catch (error) {
        console.error("Delete Application error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
