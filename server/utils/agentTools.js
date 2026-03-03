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
                // Validate date_of_birth if provided
                if (args.date_of_birth) {
                    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                    if (!dateRegex.test(args.date_of_birth)) {
                        // Try to parse it as a date
                        const date = new Date(args.date_of_birth);
                        if (isNaN(date.getTime())) {
                            return `Invalid date format for date of birth. Please provide a valid date in YYYY-MM-DD format (e.g., 2006-05-14).`;
                        }
                        // Convert to YYYY-MM-DD format
                        args.date_of_birth = date.toISOString().split('T')[0];
                    }
                }

                // Validate scores if provided (should be numeric)
                if (args.tenthScore && !/^\d+\.?\d*$/.test(args.tenthScore.replace('%', '').trim())) {
                    return `Invalid 10th score. Please provide a numeric value (e.g., 85 or 85%).`;
                }
                if (args.twelfthScore && !/^\d+\.?\d*$/.test(args.twelfthScore.replace('%', '').trim())) {
                    return `Invalid 12th score. Please provide a numeric value (e.g., 78 or 78%).`;
                }

                // Validate phone if provided (should be numeric and reasonable length)
                if (args.phone && (!/^\d+$/.test(args.phone) || args.phone.length < 10)) {
                    return `Invalid phone number. Please provide a valid 10-digit phone number.`;
                }

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
        description: "Deletes a specific course application for the user. IMPORTANT: Extract ONLY the course/program name, removing filler words like 'course', 'application', 'this', etc.",
        schema: z.object({
            courseName: z.string().describe("The ACTUAL course name ONLY (e.g., 'BCA', 'Kalvium', 'MCA'). Do NOT include words like 'course', 'application', 'this', 'program'.")
        }),
        func: async ({ courseName }) => {
            try {
                console.log('[deleteApplicationTool] Looking for course:', courseName);
                const profile = await studentModel.getFullProfile(studentId);
                if (!profile || !profile.applications || profile.applications.length === 0) {
                    return "You have no active applications to delete.";
                }

                console.log('[deleteApplicationTool] Available courses:', profile.applications.map(a => a.course).join(', '));
                
                // Try exact match first (case-insensitive)
                let app = profile.applications.find(a => a.course.toLowerCase() === courseName.toLowerCase());
                
                // If no exact match, try partial match
                if (!app) {
                    app = profile.applications.find(a => a.course.toLowerCase().includes(courseName.toLowerCase()));
                }
                
                if (!app) {
                    return `Could not find an application for course '${courseName}'. Available courses: ${profile.applications.map(a => a.course).join(', ')}`;
                }

                console.log('[deleteApplicationTool] Deleting application:', app.applicationId, 'for course:', app.course);
                await studentModel.deleteApplication(studentId, app.applicationId);
                return `Application for course '${app.course}' successfully deleted.`;
            } catch (error) {
                console.error("Error in deleteApplicationTool:", error);
                return `Failed to delete application due to an error: ${error.message}`;
            }
        },
    });
};
