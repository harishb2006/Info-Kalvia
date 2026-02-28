import dbWrapper from "../db/index.js";

const studentModel = {
    findByEmail: async (email) => {
        const query = `SELECT * FROM students WHERE email = ?`;
        return await dbWrapper.get(query, [email]);
    },

    findById: async (id) => {
        const query = `SELECT * FROM students WHERE id = ?`;
        return await dbWrapper.get(query, [id]);
    },

    getFullProfile: async (id) => {
        const studentQuery = `
      SELECT 
        s.id, s.full_name as name, s.email, s.phone, s.city, s.date_of_birth,
        e.tenth_board as tenthBoard, e.tenth_percentage as tenthScore,
        e.twelfth_board as twelfthBoard, e.twelfth_percentage as twelfthScore
      FROM students s
      LEFT JOIN education_details e ON s.id = e.student_id
      WHERE s.id = ?
    `;
        const result = await dbWrapper.get(studentQuery, [id]);

        if (!result) return null;

        // Fetch applications array
        const appsQuery = `
      SELECT 
        a.id as applicationId, a.status,
        c.id as courseId, c.title as course, c.duration_months as duration, c.fee as fee
      FROM applications a
      JOIN courses c ON a.course_id = c.id
      WHERE a.student_id = ?
    `;
        const applications = await dbWrapper.query(appsQuery, [id]);

        // Format duration strings for the array
        const formattedApplications = applications.map(app => ({
            ...app,
            duration: app.duration ? app.duration + " Months" : "N/A"
        }));

        result.applications = formattedApplications;

        // Format scores to add "%" if it exists
        if (result.tenthScore) result.tenthScore += "%";
        if (result.twelfthScore) result.twelfthScore += "%";

        return result;
    },

    updateProfile: async (id, profileData) => {
        const { name, phone, date_of_birth, city, tenthBoard, tenthScore, twelfthBoard, twelfthScore, course, duration, status, password } = profileData;

        // 1. Update students table
        // We use COALESCE so if a value isn't provided, it retains its existing value
        let query = `UPDATE students SET full_name = COALESCE(?, full_name), phone = COALESCE(?, phone), date_of_birth = COALESCE(?, date_of_birth), city = COALESCE(?, city)`;
        let params = [name || null, phone || null, date_of_birth || null, city || null];

        if (password) {
            query += `, password = ?`;
            params.push(password);
        }
        query += ` WHERE id = ?`;
        params.push(id);

        await dbWrapper.run(query, params);

        // 2. Upsert education_details
        const extractNum = (str) => {
            if (!str) return null;
            const parsed = parseInt(String(str).replace(/[^0-9]/g, ''));
            return isNaN(parsed) ? null : parsed;
        };

        const tScore = extractNum(tenthScore);
        const twScore = extractNum(twelfthScore);

        const edu = await dbWrapper.get(`SELECT id FROM education_details WHERE student_id = ?`, [id]);
        if (edu) {
            await dbWrapper.run(
                `UPDATE education_details SET tenth_board = COALESCE(?, tenth_board), tenth_percentage = COALESCE(?, tenth_percentage), twelfth_board = COALESCE(?, twelfth_board), twelfth_percentage = COALESCE(?, twelfth_percentage) WHERE student_id = ?`,
                [tenthBoard || null, tScore, twelfthBoard || null, twScore, id]
            );
        } else {
            await dbWrapper.run(
                `INSERT INTO education_details (student_id, tenth_board, tenth_percentage, twelfth_board, twelfth_percentage) VALUES (?, ?, ?, ?, ?)`,
                [id, tenthBoard || null, tScore, twelfthBoard || null, twScore]
            );
        }

        // 3. Insert new application (courses & applications)
        const { newApplication } = profileData;

        if (newApplication && newApplication.course) {
            let courseRecord = await dbWrapper.get(`SELECT id FROM courses WHERE title = ?`, [newApplication.course]);
            let courseId;
            const dur = extractNum(newApplication.duration);
            const feeVal = newApplication.fee ? parseFloat(newApplication.fee) : null;

            if (courseRecord) {
                courseId = courseRecord.id;
                // If a new fee is provided, update the course fee
                if (feeVal !== null) {
                    await dbWrapper.run(`UPDATE courses SET fee = ? WHERE id = ?`, [feeVal, courseId]);
                }
            } else {
                const res = await dbWrapper.run(`INSERT INTO courses (title, duration_months, fee) VALUES (?, ?, ?)`, [newApplication.course, dur, feeVal]);
                // dbWrapper.run returns the 'this' context of underlying sqlite which has lastID
                courseId = res.lastID;
            }

            // Check if application already exists for this student and course
            const existingApplication = await dbWrapper.get(
                `SELECT id FROM applications WHERE student_id = ? AND course_id = ?`,
                [id, courseId]
            );

            if (existingApplication) {
                // Update existing application
                await dbWrapper.run(
                    `UPDATE applications SET status = COALESCE(?, status) WHERE student_id = ? AND course_id = ?`,
                    [newApplication.status, id, courseId]
                );
            } else {
                // Insert a new application
                await dbWrapper.run(
                    `INSERT INTO applications (student_id, course_id, status, applied_at) VALUES (?, ?, ?, datetime('now'))`,
                    [id, courseId, newApplication.status || 'submitted']
                );
            }
        }
    },

    create: async (studentData) => {
        const { full_name, email, password, phone, date_of_birth, city } = studentData;
        const query = `
      INSERT INTO students (full_name, email, password, phone, date_of_birth, city, created_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `;
        const params = [
            full_name,
            email,
            password,
            phone || null,
            date_of_birth || null,
            city || null
        ];

        return await dbWrapper.run(query, params);
    },

    deleteApplication: async (studentId, applicationId) => {
        const query = `DELETE FROM applications WHERE id = ? AND student_id = ?`;
        return await dbWrapper.run(query, [applicationId, studentId]);
    }
};

export default studentModel;
