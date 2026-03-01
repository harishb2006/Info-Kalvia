import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import studentModel from "../models/studentModel.js";

// Tool 1: Get Profile Tool
export const getProfileTool = (studentId) => {
    return new DynamicStructuredTool({
        name: "get_student_profile",
        description: "Fetch the complete profile, education details, percentage, city, and ALL course applications/statuses of the currently logged-in student. Call this immediately when the student asks about their name, city, courses, eligibility, applications, percentage, or profile details.",
        schema: z.object({
            query: z.string().optional().describe("Leave this empty")
        }),
        func: async () => {
            try {
                const profile = await studentModel.getFullProfile(studentId);
                if (!profile) return "No profile found.";
                return JSON.stringify(profile);
            } catch (error) {
                console.error("Error in getProfileTool:", error);
                return "Error fetching profile.";
            }
        },
    });
};

// Tool 2: Update Profile Tool
export const updateProfileTool = (studentId) => {
    return new DynamicStructuredTool({
        name: "update_student_profile",
        description: "Updates the currently logged-in student's profile, education details, or adds a new course application.",
        schema: z.object({
            name: z.string().optional().describe("Full name of the student"),
            phone: z.string().optional().describe("Phone number"),
            date_of_birth: z.string().optional().describe("Date of birth (YYYY-MM-DD or similar format)"),
            city: z.string().optional().describe("City of the student"),
            tenthBoard: z.string().optional().describe("10th grade board name (e.g., CBSE, State Board)"),
            tenthScore: z.string().optional().describe("10th grade score or percentage"),
            twelfthBoard: z.string().optional().describe("12th grade board name (e.g., CBSE, State Board)"),
            twelfthScore: z.string().optional().describe("12th grade score or percentage"),
            newApplication: z.object({
                course: z.string().optional().describe("Title of the course to apply for or update"),
                duration: z.string().optional().describe("Duration of the course in months (e.g., '6 Months')"),
                fee: z.string().optional().describe("Course fee"),
                status: z.string().optional().describe("Application status (e.g., 'submitted', 'pending')")
            }).optional().describe("Use this object to apply for a new course or update an existing application status")
        }),
        func: async (args) => {
            try {
                // Pass the data down to the model
                await studentModel.updateProfile(studentId, args);

                // Fetch the updated profile to confirm
                const updatedProfile = await studentModel.getFullProfile(studentId);
                return `Profile updated successfully. Here is the new state: ${JSON.stringify(updatedProfile)}`;
            } catch (error) {
                console.error("Error in updateProfileTool:", error);
                return `Failed to update profile due to an error: ${error.message}`;
            }
        },
    });
};

// Tool 3: Delete Application Tool
export const deleteApplicationTool = (studentId) => {
    return new DynamicStructuredTool({
        name: "delete_course_application",
        description: "Deletes a specific course application for the user.",
        schema: z.object({
            applicationId: z.number().describe("The numeric ID of the application to delete. You must get this ID from the get_student_profile tool first.")
        }),
        func: async ({ applicationId }) => {
            try {
                await studentModel.deleteApplication(studentId, applicationId);
                return `Application ID ${applicationId} successfully deleted.`;
            } catch (error) {
                console.error("Error in deleteApplicationTool:", error);
                return `Failed to delete application due to an error: ${error.message}`;
            }
        },
    });
};
