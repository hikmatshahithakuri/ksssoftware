document.addEventListener('DOMContentLoaded', () => {
    // --- Global Student Data (simulated with localStorage) ---
    let students = JSON.parse(localStorage.getItem('kankaliStudents')) || [];
    let nextStudentId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;

    // --- Student Registration Form Handling (students.html) ---
    const studentRegistrationForm = document.getElementById('studentRegistrationForm');
    const studentTableBody = document.getElementById('studentTableBody');
    const editStudentForm = document.getElementById('editStudentForm');
    const editStudentModal = new bootstrap.Modal(document.getElementById('editStudentModal'));

    if (studentRegistrationForm) {
        studentRegistrationForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const newStudent = {
                id: nextStudentId++,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                dob: document.getElementById('dob').value,
                gender: document.getElementById('gender').value,
                address: document.getElementById('address').value,
                contact: document.getElementById('contact').value,
                email: document.getElementById('email').value,
                className: document.getElementById('className').value,
                rollNumber: document.getElementById('rollNumber').value,
                // Initialize attendance and exam results (empty for now)
                attendance: {}, // { '2025-05-24': 'Present', '2025-05-23': 'Absent' }
                exams: {}     // { 'Math': 85, 'Science': 92 }
            };

            students.push(newStudent);
            localStorage.setItem('kankaliStudents', JSON.stringify(students));
            renderStudentTable();
            studentRegistrationForm.reset();
            alert('Student registered successfully!');
        });
    }

    // --- Render Student Table (students.html) ---
    function renderStudentTable() {
        if (!studentTableBody) return; // Exit if not on the students.html page

        studentTableBody.innerHTML = ''; // Clear existing rows

        students.forEach(student => {
            const row = studentTableBody.insertRow();
            row.insertCell().textContent = student.id;
            row.insertCell().textContent = `${student.firstName} ${student.lastName}`;
            row.insertCell().textContent = student.className;
            row.insertCell().textContent = student.rollNumber;
            row.insertCell().textContent = student.contact;

            const actionsCell = row.insertCell();
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-sm btn-warning me-2';
            editButton.textContent = 'Edit';
            editButton.onclick = () => openEditStudentModal(student.id);
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-sm btn-danger';
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteStudent(student.id);
            actionsCell.appendChild(deleteButton);
        });
    }

    // --- Open Edit Student Modal ---
    function openEditStudentModal(studentId) {
        const studentToEdit = students.find(s => s.id === studentId);
        if (studentToEdit) {
            document.getElementById('editStudentId').value = studentToEdit.id;
            document.getElementById('editFirstName').value = studentToEdit.firstName;
            document.getElementById('editLastName').value = studentToEdit.lastName;
            document.getElementById('editDob').value = studentToEdit.dob;
            document.getElementById('editGender').value = studentToEdit.gender;
            document.getElementById('editAddress').value = studentToEdit.address;
            document.getElementById('editContact').value = studentToEdit.contact;
            document.getElementById('editEmail').value = studentToEdit.email;
            document.getElementById('editClassName').value = studentToEdit.className;
            document.getElementById('editRollNumber').value = studentToEdit.rollNumber;
            editStudentModal.show();
        }
    }

    // --- Save Edited Student Data ---
    if (editStudentForm) {
        editStudentForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const studentId = parseInt(document.getElementById('editStudentId').value);
            const studentIndex = students.findIndex(s => s.id === studentId);

            if (studentIndex > -1) {
                students[studentIndex] = {
                    ...students[studentIndex], // Keep existing properties like attendance, exams
                    firstName: document.getElementById('editFirstName').value,
                    lastName: document.getElementById('editLastName').value,
                    dob: document.getElementById('editDob').value,
                    gender: document.getElementById('editGender').value,
                    address: document.getElementById('editAddress').value,
                    contact: document.getElementById('editContact').value,
                    email: document.getElementById('editEmail').value,
                    className: document.getElementById('editClassName').value,
                    rollNumber: document.getElementById('editRollNumber').value
                };
                localStorage.setItem('kankaliStudents', JSON.stringify(students));
                renderStudentTable();
                editStudentModal.hide();
                alert('Student record updated successfully!');
            }
        });
    }

    // --- Delete Student ---
    function deleteStudent(studentId) {
        if (confirm('Are you sure you want to delete this student record?')) {
            students = students.filter(s => s.id !== studentId);
            localStorage.setItem('kankaliStudents', JSON.stringify(students));
            renderStudentTable();
            alert('Student record deleted.');
        }
    }

    // --- Initial render when page loads ---
    if (studentTableBody) {
        renderStudentTable();
    }


    // --- Attendance Management (attendance.html) ---
    const attendanceDateInput = document.getElementById('attendanceDate');
    const attendanceClassSelect = document.getElementById('attendanceClass');
    const attendanceListBody = document.getElementById('attendanceListBody');
    const saveAttendanceBtn = document.getElementById('saveAttendanceBtn');

    if (attendanceClassSelect) {
        // Populate class options (if not already done in HTML)
        // You might want to get unique classes from your student data
        for (let i = 1; i <= 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            attendanceClassSelect.appendChild(option);
        }

        attendanceClassSelect.addEventListener('change', loadAttendanceForClass);
        attendanceDateInput.addEventListener('change', loadAttendanceForClass);
    }

    function loadAttendanceForClass() {
        if (!attendanceListBody) return;

        const selectedClass = attendanceClassSelect.value;
        const selectedDate = attendanceDateInput.value;

        if (!selectedClass || !selectedDate) {
            attendanceListBody.innerHTML = '<tr><td colspan="4" class="text-center">Please select a class and date.</td></tr>';
            return;
        }

        const filteredStudents = students.filter(s => s.className == selectedClass);
        attendanceListBody.innerHTML = '';

        if (filteredStudents.length === 0) {
            attendanceListBody.innerHTML = '<tr><td colspan="4" class="text-center">No students found for this class.</td></tr>';
            return;
        }

        filteredStudents.forEach(student => {
            const row = attendanceListBody.insertRow();
            row.insertCell().textContent = student.rollNumber;
            row.insertCell().textContent = `${student.firstName} ${student.lastName}`;
            const statusCell = row.insertCell();

            const presentRadio = document.createElement('input');
            presentRadio.type = 'radio';
            presentRadio.name = `attendance_${student.id}`;
            presentRadio.value = 'Present';
            presentRadio.id = `present_${student.id}`;
            presentRadio.className = 'form-check-input me-1';
            const presentLabel = document.createElement('label');
            presentLabel.htmlFor = `present_${student.id}`;
            presentLabel.textContent = 'Present';

            const absentRadio = document.createElement('input');
            absentRadio.type = 'radio';
            absentRadio.name = `attendance_${student.id}`;
            absentRadio.value = 'Absent';
            absentRadio.id = `absent_${student.id}`;
            absentRadio.className = 'form-check-input me-1 ms-3';
            const absentLabel = document.createElement('label');
            absentLabel.htmlFor = `absent_${student.id}`;
            absentLabel.textContent = 'Absent';

            // Set initial state based on existing attendance
            const currentStatus = student.attendance[selectedDate];
            if (currentStatus === 'Present') {
                presentRadio.checked = true;
            } else if (currentStatus === 'Absent') {
                absentRadio.checked = true;
            }

            statusCell.appendChild(presentRadio);
            statusCell.appendChild(presentLabel);
            statusCell.appendChild(absentRadio);
            statusCell.appendChild(absentLabel);
        });
    }

    if (saveAttendanceBtn) {
        saveAttendanceBtn.addEventListener('click', () => {
            const selectedDate = attendanceDateInput.value;
            if (!selectedDate) {
                alert('Please select a date.');
                return;
            }

            const updatedStudents = students.map(student => {
                const radioName = `attendance_${student.id}`;
                const selectedOption = document.querySelector(`input[name="${radioName}"]:checked`);
                if (selectedOption) {
                    student.attendance[selectedDate] = selectedOption.value;
                }
                return student;
            });

            students = updatedStudents;
            localStorage.setItem('kankaliStudents', JSON.stringify(students));
            alert('Attendance saved successfully!');
        });
    }


    // --- Exam Results Entry (exams.html) ---
    const examClassSelect = document.getElementById('examClass');
    const examStudentSelect = document.getElementById('examStudent');
    const examForm = document.getElementById('examForm');
    const examSubjects = ['Nepali', 'English', 'Math', 'Science', 'Social Studies', 'Health']; // Example subjects

    if (examClassSelect) {
        for (let i = 1; i <= 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            examClassSelect.appendChild(option);
        }
        examClassSelect.addEventListener('change', populateExamStudents);
    }

    function populateExamStudents() {
        if (!examStudentSelect) return;

        const selectedClass = examClassSelect.value;
        const filteredStudents = students.filter(s => s.className == selectedClass);

        examStudentSelect.innerHTML = '<option value="">Select Student</option>';
        filteredStudents.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.firstName} ${student.lastName} (Roll: ${student.rollNumber})`;
            examStudentSelect.appendChild(option);
        });

        // Clear previous exam fields if any
        const examMarksDiv = document.getElementById('examMarks');
        if (examMarksDiv) examMarksDiv.innerHTML = '';
    }

    if (examStudentSelect) {
        examStudentSelect.addEventListener('change', loadStudentExamMarks);
    }

    function loadStudentExamMarks() {
        const studentId = parseInt(examStudentSelect.value);
        const student = students.find(s => s.id === studentId);
        const examMarksDiv = document.getElementById('examMarks');
        examMarksDiv.innerHTML = '';

        if (student) {
            examSubjects.forEach(subject => {
                const div = document.createElement('div');
                div.className = 'mb-3';
                div.innerHTML = `
                    <label for="${subject.toLowerCase()}Mark" class="form-label">${subject} Marks</label>
                    <input type="number" class="form-control" id="${subject.toLowerCase()}Mark" min="0" max="100" value="${student.exams[subject] || ''}">
                `;
                examMarksDiv.appendChild(div);
            });
        }
    }

    if (examForm) {
        examForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const studentId = parseInt(document.getElementById('examStudent').value);
            const studentIndex = students.findIndex(s => s.id === studentId);

            if (studentIndex > -1) {
                const marks = {};
                examSubjects.forEach(subject => {
                    const inputElement = document.getElementById(`${subject.toLowerCase()}Mark`);
                    if (inputElement && inputElement.value) {
                        marks[subject] = parseInt(inputElement.value);
                    }
                });

                students[studentIndex].exams = marks;
                localStorage.setItem('kankaliStudents', JSON.stringify(students));
                alert('Exam results saved successfully!');
            } else {
                alert('Please select a student.');
            }
        });
    }


    // --- Gradesheet Generation (gradesheet.html) ---
    const gradesheetClassSelect = document.getElementById('gradesheetClass');
    const gradesheetStudentSelect = document.getElementById('gradesheetStudent');
    const generateGradesheetBtn = document.getElementById('generateGradesheetBtn');
    const gradesheetOutput = document.getElementById('gradesheetOutput');

    if (gradesheetClassSelect) {
        for (let i = 1; i <= 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            gradesheetClassSelect.appendChild(option);
        }
        gradesheetClassSelect.addEventListener('change', populateGradesheetStudents);
    }

    function populateGradesheetStudents() {
        if (!gradesheetStudentSelect) return;

        const selectedClass = gradesheetClassSelect.value;
        const filteredStudents = students.filter(s => s.className == selectedClass);

        gradesheetStudentSelect.innerHTML = '<option value="">Select Student</option>';
        filteredStudents.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.firstName} ${student.lastName} (Roll: ${student.rollNumber})`;
            gradesheetStudentSelect.appendChild(option);
        });
        gradesheetOutput.innerHTML = ''; // Clear previous output
    }

    if (generateGradesheetBtn) {
        generateGradesheetBtn.addEventListener('click', generateGradesheet);
    }

    function generateGradesheet() {
        const studentId = parseInt(gradesheetStudentSelect.value);
        const student = students.find(s => s.id === studentId);

        if (!student) {
            gradesheetOutput.innerHTML = '<div class="alert alert-warning">Please select a student to generate gradesheet.</div>';
            return;
        }

        let gradesheetHtml = `
            <div class="card p-4 gradesheet-printable">
                <h4 class="text-center mb-4">Kankali School - Gradesheet</h4>
                <p><strong>Student Name:</strong> ${student.firstName} ${student.lastName}</p>
                <p><strong>Class:</strong> ${student.className}</p>
                <p><strong>Roll Number:</strong> ${student.rollNumber}</p>
                <p><strong>Date of Birth:</strong> ${student.dob}</p>
                <p><strong>Contact:</strong> ${student.contact}</p>

                <h5 class="mt-4">Exam Results</h5>
                <table class="table table-bordered table-sm">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Marks Obtained (Out of 100)</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        let totalMarks = 0;
        let subjectsCount = 0;

        examSubjects.forEach(subject => {
            const marks = student.exams[subject] || 0;
            const grade = getGrade(marks);
            totalMarks += marks;
            subjectsCount++;
            gradesheetHtml += `
                <tr>
                    <td>${subject}</td>
                    <td>${marks}</td>
                    <td>${grade}</td>
                </tr>
            `;
        });

        const percentage = subjectsCount > 0 ? (totalMarks / (subjectsCount * 100)) * 100 : 0;
        const overallGrade = getOverallGrade(percentage);

        gradesheetHtml += `
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colspan="1">Total Marks:</th>
                            <td colspan="2"><strong>${totalMarks}</strong></td>
                        </tr>
                        <tr>
                            <th colspan="1">Percentage:</th>
                            <td colspan="2"><strong>${percentage.toFixed(2)}%</strong></td>
                        </tr>
                        <tr>
                            <th colspan="1">Overall Grade:</th>
                            <td colspan="2"><strong>${overallGrade}</strong></td>
                        </tr>
                    </tfoot>
                </table>

                <h5 class="mt-4">Attendance Summary</h5>
                <table class="table table-bordered table-sm">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        const attendanceDates = Object.keys(student.attendance).sort(); // Sort dates for better display
        if (attendanceDates.length > 0) {
            attendanceDates.forEach(date => {
                gradesheetHtml += `
                    <tr>
                        <td>${date}</td>
                        <td>${student.attendance[date]}</td>
                    </tr>
                `;
            });
        } else {
            gradesheetHtml += `<tr><td colspan="2" class="text-center">No attendance recorded.</td></tr>`;
        }

        gradesheetHtml += `
                    </tbody>
                </table>
                <div class="text-end mt-4">
                    <p>Date: ${new Date().toLocaleDateString()}</p>
                    <p>_________________________</p>
                    <p>Class Teacher's Signature</p>
                </div>
            </div>
            <div class="text-center mt-3">
                <button class="btn btn-primary" onclick="window.print()">Print Gradesheet</button>
            </div>
        `;

        gradesheetOutput.innerHTML = gradesheetHtml;
    }

    function getGrade(marks) {
        if (marks >= 90) return 'A+';
        if (marks >= 80) return 'A';
        if (marks >= 70) return 'B+';
        if (marks >= 60) return 'B';
        if (marks >= 50) return 'C+';
        if (marks >= 40) return 'C';
        return 'F';
    }

    function getOverallGrade(percentage) {
        if (percentage >= 90) return 'Distinction';
        if (percentage >= 75) return 'First Division';
        if (percentage >= 60) return 'Second Division';
        if (percentage >= 40) return 'Third Division';
        return 'Fail';
    }

    // Initialize students and populate tables/dropdowns on page load if applicable
    if (document.querySelector('body').classList.contains('students-page')) { // Add a class to body for specific page JS
        renderStudentTable();
    }
});
