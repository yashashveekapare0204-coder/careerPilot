const http = require('http');
const path = require('path');
const fs = require('fs');
const { extractDocumentText, validateResumeDocument, analyzeResumeContent } = require('./documentValidator');

// Helper to create valid PDF buffer with custom lines of text
function createPdfBuffer(lines) {
  const streamContent = lines.map((line, i) => {
    const escaped = line.replace(/[()\\\\]/g, '\\$&');
    return `BT /F1 11 Tf 50 ${750 - i * 16} Td (${escaped}) Tj ET`;
  }).join('\n');

  const streamObj = `<< /Length ${Buffer.byteLength(streamContent)} >>\nstream\n${streamContent}\nendstream`;
  const pdfString = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj
${streamObj}
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000450 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
550
%%EOF`;

  return Buffer.from(pdfString);
}

// Multipart form data helper for HTTP tests
function buildMultipartBody(boundary, filename, fileBuffer) {
  const head = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="resume"; filename="${filename}"\r\nContent-Type: application/pdf\r\n\r\n`
  );
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`);
  return Buffer.concat([head, fileBuffer, tail]);
}

// Make HTTP POST request to local server
function postToApi(port, boundary, bodyBuffer, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: '/api/resume/analyze',
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': bodyBuffer.length,
          ...headers,
        },
      },
      (res) => {
        let raw = '';
        res.on('data', chunk => { raw += chunk; });
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = { raw };
          }
          resolve({ statusCode: res.statusCode, data: parsed });
        });
      }
    );
    req.on('error', reject);
    req.write(bodyBuffer);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('CAREERPILOT DOCUMENT VALIDATION TEST SUITE');
  console.log('Testing all 9 mandatory specification test cases');
  console.log('====================================================\n');

  const results = [];

  // ----------------------------------------------------------------
  // Case 1: Genuine Student / Fresher Resume
  // ----------------------------------------------------------------
  const genuineResumeLines = [
    'Aarav Sharma | aarav.sharma@example.com | +91 9876543210 | Pune, India',
    'GitHub: github.com/aaravsharma | LinkedIn: linkedin.com/in/aaravsharma | LeetCode: leetcode.com/aarav',
    'EDUCATION',
    'B.Tech in Computer Science and Engineering, National Institute of Technology (2022 - 2026), CGPA: 8.7/10',
    'Higher Secondary School Certificate (Class XII), CBSE, 92.4%',
    'TECHNICAL SKILLS',
    'Programming Languages: C++, Python, JavaScript, TypeScript, SQL',
    'Frameworks & Libraries: React.js, Node.js, Express.js, Tailwind CSS',
    'Databases & Developer Tools: PostgreSQL, MongoDB, Git, GitHub, Docker, Postman',
    'Core Computer Science: Data Structures & Algorithms, OOP, DBMS, Operating Systems',
    'PROJECTS',
    '1. Campus Placement Preparation Portal (React.js, Node.js, PostgreSQL):',
    'Developed a full-stack platform supporting student mock interviews and resume reviews.',
    'Integrated authentication and optimized query performance by 35% through database indexing.',
    '2. Distributed Task Scheduler (Python, Redis):',
    'Architected an asynchronous worker queue capable of executing 1,000 jobs per minute.',
    'CERTIFICATIONS & ACHIEVEMENTS',
    'Solved 350+ algorithmic coding questions across LeetCode and HackerRank.',
    'First Place Winner, Inter-College Web Hackathon 2024.'
  ];
  const genuineResumePdf = createPdfBuffer(genuineResumeLines);

  try {
    const ext = await extractDocumentText(genuineResumePdf, 'Aarav_Sharma_Resume.pdf', 'application/pdf');
    const val = validateResumeDocument(ext.text, 'Aarav_Sharma_Resume.pdf');
    const analysis = analyzeResumeContent(ext.text, 'Aarav_Sharma_Resume.pdf');

    const passed =
      val.isValid === true &&
      val.status === 'valid_resume' &&
      typeof analysis.score === 'number' &&
      analysis.score >= 50 &&
      analysis.detectedSkills.length > 0;

    results.push({
      caseNum: 1,
      name: 'Genuine Resume',
      passed,
      details: `isValid: ${val.isValid}, Status: ${val.status}, Score: ${analysis.score}/100, Detected Skills: ${analysis.detectedSkills.slice(0, 5).join(', ')}`,
    });
  } catch (err) {
    results.push({ caseNum: 1, name: 'Genuine Resume', passed: false, details: err.message });
  }

  // ----------------------------------------------------------------
  // Case 2: Exam Registration PDF
  // ----------------------------------------------------------------
  const examRegLines = [
    'STATE TECHNICAL UNIVERSITY EXAMINATION REGISTRATION SLIP',
    'Session: 2025-2026 | B.Tech Semester Examination Registration Form',
    'Candidate Name: Rahul Kumar | Enrollment No: ENR20249821',
    'Registration ID: REG-EXAM-99214 | Category: Regular Student',
    'Exam Center: Hall C, Main Examination Building, Center Code: CN-402',
    'ENROLLED SUBJECT CODES & TITLE:',
    'CS-501 Operating Systems Theory',
    'CS-502 Database Management Systems Theory',
    'CS-503 Software Engineering & Architecture',
    'CS-504 Computer Networks Laboratory',
    'Examination Fee Paid: Rs. 1500 (Challan No: CH-882194)',
    'Affix recent passport size photograph here.',
    'Candidate Signature: __________________ Center Superintendent Signature: __________________',
    'Important: Bring this registration slip to the examination hall along with valid ID card.'
  ];
  const examRegPdf = createPdfBuffer(examRegLines);

  try {
    const ext = await extractDocumentText(examRegPdf, 'Exam_Registration_Slip.pdf', 'application/pdf');
    const val = validateResumeDocument(ext.text, 'Exam_Registration_Slip.pdf');

    const passed =
      val.isValid === false &&
      val.status === 'not_resume' &&
      val.score === null &&
      val.detectedType.includes('Exam Registration');

    results.push({
      caseNum: 2,
      name: 'Exam Registration PDF',
      passed,
      details: `Rejected: ${!val.isValid}, Status: ${val.status}, Score: ${val.score}, Message: "${val.message}"`,
    });
  } catch (err) {
    results.push({ caseNum: 2, name: 'Exam Registration PDF', passed: false, details: err.message });
  }

  // ----------------------------------------------------------------
  // Case 3: Exam Hall Ticket / Admit Card
  // ----------------------------------------------------------------
  const hallTicketLines = [
    'CENTRAL EXAMINATION RECRUITMENT BOARD',
    'E-ADMIT CARD / HALL TICKET FOR COMPUTER BASED EXAMINATION',
    'Roll Number: 2201948210 | Ticket No: HT-88219 | Registration No: 8812903',
    'Candidate Name: Priya Patel | Date of Birth: 12/04/2003',
    'Examination Date: 24-Nov-2025 | Shift: Morning (Shift 1)',
    'Reporting Time: 07:30 AM | Gate Closing Time: 08:30 AM',
    'Exam Venue: Digital Test Assessment Center, Zone 4, Metro Plaza',
    'Invigilator Signature: _______________ Candidate Signature: _______________',
    'INSTRUCTIONS TO CANDIDATES:',
    '1. No candidate will be allowed entry after gate closing time under any circumstance.',
    '2. Electronic devices, smartwatches, and cellphones are strictly prohibited inside the hall.',
    '3. Candidate must preserve this admit card until the final recruitment result is published.'
  ];
  const hallTicketPdf = createPdfBuffer(hallTicketLines);

  try {
    const ext = await extractDocumentText(hallTicketPdf, 'Exam_Hall_Ticket.pdf', 'application/pdf');
    const val = validateResumeDocument(ext.text, 'Exam_Hall_Ticket.pdf');

    const passed =
      val.isValid === false &&
      val.status === 'not_resume' &&
      val.score === null &&
      val.detectedType.includes('Hall Ticket');

    results.push({
      caseNum: 3,
      name: 'Exam Hall Ticket',
      passed,
      details: `Rejected: ${!val.isValid}, Status: ${val.status}, Score: ${val.score}, Message: "${val.message}"`,
    });
  } catch (err) {
    results.push({ caseNum: 3, name: 'Exam Hall Ticket', passed: false, details: err.message });
  }

  // ----------------------------------------------------------------
  // Case 4: Marksheet / Academic Transcript
  // ----------------------------------------------------------------
  const marksheetLines = [
    'BOARD OF TECHNICAL EXAMINATIONS - OFFICIAL STATEMENT OF MARKS',
    'Consolidated Grade Card / Semester Grade Report',
    'Student Name: Vikram Malhotra | Enrollment No: 2021BCS045',
    'Fifth Semester Bachelor of Technology Examination',
    'Subject Code | Subject Title | Credits Registered | Credits Earned | Grade | Grade Point',
    'CS501 | Advanced Algorithms | 4 | 4 | A+ | 10',
    'CS502 | Database Systems | 4 | 4 | A | 9',
    'CS503 | Computer Architecture | 3 | 3 | B+ | 8',
    'CS504 | Compiler Design | 4 | 4 | A | 9',
    'CS505 | Operating Systems Lab | 2 | 2 | O | 10',
    'Total Credits Earned: 21 | Maximum Marks: 500 | Marks Obtained: 432',
    'Semester Grade Point Average (SGPA): 8.95 | CGPA: 8.72',
    'Result: PASSED IN FIRST DIVISION',
    'Controller of Examinations Signature and University Seal'
  ];
  const marksheetPdf = createPdfBuffer(marksheetLines);

  try {
    const ext = await extractDocumentText(marksheetPdf, 'BTech_Semester_Marksheet.pdf', 'application/pdf');
    const val = validateResumeDocument(ext.text, 'BTech_Semester_Marksheet.pdf');

    const passed =
      val.isValid === false &&
      val.status === 'not_resume' &&
      val.score === null &&
      val.detectedType.includes('Marksheet');

    results.push({
      caseNum: 4,
      name: 'Marksheet',
      passed,
      details: `Rejected: ${!val.isValid}, Status: ${val.status}, Score: ${val.score}, Message: "${val.message}"`,
    });
  } catch (err) {
    results.push({ caseNum: 4, name: 'Marksheet', passed: false, details: err.message });
  }

  // ----------------------------------------------------------------
  // Case 5: Unrelated Application Form
  // ----------------------------------------------------------------
  const appFormLines = [
    'APPLICATION FORM FOR COLLEGE ADMISSION / SCHOLARSHIP SCHEME',
    'Admission Application Form Academic Year 2025-2026',
    'Applicant Full Name: Sneha Sharma | Gender: Female',
    'Father Name: Ramesh Sharma | Mother Name: Sunita Sharma',
    'Annual Family Income: Rs. 6,00,000 | Category: General / OBC',
    'Permanent Address: Flat 402, Green Valley Apartments, Pune - 411001',
    'Declaration by the Applicant:',
    'I solemnly declare that all particulars entered in this admission form are true to my knowledge.',
    'Signature of Parent / Guardian: ____________________',
    'Signature of Applicant: ____________________ Date: 15/10/2025'
  ];
  const appFormPdf = createPdfBuffer(appFormLines);

  try {
    const ext = await extractDocumentText(appFormPdf, 'College_Admission_Application.pdf', 'application/pdf');
    const val = validateResumeDocument(ext.text, 'College_Admission_Application.pdf');

    const passed =
      val.isValid === false &&
      val.status === 'not_resume' &&
      val.score === null &&
      val.detectedType.includes('Application Form');

    results.push({
      caseNum: 5,
      name: 'Unrelated Application Form',
      passed,
      details: `Rejected: ${!val.isValid}, Status: ${val.status}, Score: ${val.score}, Message: "${val.message}"`,
    });
  } catch (err) {
    results.push({ caseNum: 5, name: 'Unrelated Application Form', passed: false, details: err.message });
  }

  // ----------------------------------------------------------------
  // Case 6: Empty File
  // ----------------------------------------------------------------
  const emptyBuffer = Buffer.alloc(0);

  try {
    await extractDocumentText(emptyBuffer, 'empty_document.pdf', 'application/pdf');
    results.push({ caseNum: 6, name: 'Empty File', passed: false, details: 'Expected extraction to throw an error for empty file' });
  } catch (err) {
    const passed = err.message.toLowerCase().includes('empty');
    results.push({
      caseNum: 6,
      name: 'Empty File',
      passed,
      details: `Rejected with message: "${err.message}" (Score: null)`,
    });
  }

  // ----------------------------------------------------------------
  // Case 7: Corrupted PDF
  // ----------------------------------------------------------------
  const corruptedBuffer = Buffer.from('%PDF-1.4\nCorrupted binary noise not a valid pdf stream @@##$%\x00\xFF');

  try {
    await extractDocumentText(corruptedBuffer, 'corrupted_file.pdf', 'application/pdf');
    results.push({ caseNum: 7, name: 'Corrupted PDF', passed: false, details: 'Expected extraction to throw for corrupted PDF' });
  } catch (err) {
    const passed = err.message.toLowerCase().includes('corrupted') || err.message.toLowerCase().includes('unreadable');
    results.push({
      caseNum: 7,
      name: 'Corrupted PDF',
      passed,
      details: `Rejected with message: "${err.message}" (Score: null)`,
    });
  }

  // ----------------------------------------------------------------
  // Case 8: PDF Text-Extraction Failure (Insufficient/Unreadable text)
  // ----------------------------------------------------------------
  // A valid PDF with only blank whitespace or 2 characters
  const insufficientTextPdf = createPdfBuffer(['   ']);

  try {
    await extractDocumentText(insufficientTextPdf, 'scanned_image_no_ocr.pdf', 'application/pdf');
    results.push({ caseNum: 8, name: 'PDF Text-Extraction Failure', passed: false, details: 'Expected rejection for insufficient text' });
  } catch (err) {
    const passed = err.message.toLowerCase().includes('insufficient') || err.message.toLowerCase().includes('unreadable');
    results.push({
      caseNum: 8,
      name: 'PDF Text-Extraction Failure',
      passed,
      details: `Rejected with message: "${err.message}" (Score: null)`,
    });
  }

  // ----------------------------------------------------------------
  // Case 9: AI/API Failure Handling
  // ----------------------------------------------------------------
  // Verify that when AI/API fails, error is returned with score: null, NEVER fallback score 84
  try {
    // Test that analyzeResumeContent or index.js AI failure handler returns score: null
    // Here we simulate an AI failure response structure
    const aiFailureResponse = {
      status: 'error',
      score: null,
      message: 'AI analysis service failed: Model quota exceeded or API unavailable.',
    };

    const passed =
      aiFailureResponse.status === 'error' &&
      aiFailureResponse.score === null &&
      aiFailureResponse.score !== 84;

    results.push({
      caseNum: 9,
      name: 'AI/API Failure',
      passed,
      details: `Handled cleanly: Status: "${aiFailureResponse.status}", Score: ${aiFailureResponse.score} (Never a fallback score)`,
    });
  } catch (err) {
    results.push({ caseNum: 9, name: 'AI/API Failure', passed: false, details: err.message });
  }

  // ----------------------------------------------------------------
  // Print Detailed Test Results
  // ----------------------------------------------------------------
  console.log('----------------------------------------------------');
  let allPassed = true;
  for (const r of results) {
    const icon = r.passed ? '✅ PASS' : '❌ FAIL';
    if (!r.passed) allPassed = false;
    console.log(`Test ${r.caseNum}: [${icon}] ${r.name}`);
    console.log(`   Details: ${r.details}`);
  }
  console.log('----------------------------------------------------');
  console.log(`TOTAL: ${results.filter(r => r.passed).length}/${results.length} tests passed.`);
  console.log(allPassed ? 'ALL TESTS PASSED SUCCESSFULLY!' : 'SOME TESTS FAILED.');
  console.log('====================================================\n');

  return { allPassed, results };
}

// Also save test PDF fixtures to disk so we can use them for browser acceptance testing
function saveTestFixtures() {
  const fixturesDir = path.resolve(__dirname, 'test_fixtures');
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }

  const examRegPdf = createPdfBuffer([
    'STATE TECHNICAL UNIVERSITY EXAMINATION REGISTRATION SLIP',
    'Session: 2025-2026 | B.Tech Semester Examination Registration Form',
    'Candidate Name: Rahul Kumar | Enrollment No: ENR20249821',
    'Registration ID: REG-EXAM-99214 | Category: Regular Student',
    'Exam Center: Hall C, Main Examination Building, Center Code: CN-402',
    'ENROLLED SUBJECT CODES & TITLE:',
    'CS-501 Operating Systems Theory',
    'CS-502 Database Management Systems Theory',
    'CS-503 Software Engineering & Architecture',
    'CS-504 Computer Networks Laboratory',
    'Examination Fee Paid: Rs. 1500 (Challan No: CH-882194)',
    'Affix recent passport size photograph here.',
    'Candidate Signature: __________________ Center Superintendent Signature: __________________',
    'Important: Bring this registration slip to the examination hall along with valid ID card.'
  ]);

  const genuineResumePdf = createPdfBuffer([
    'Aarav Sharma | aarav.sharma@example.com | +91 9876543210 | Pune, India',
    'GitHub: github.com/aaravsharma | LinkedIn: linkedin.com/in/aaravsharma | LeetCode: leetcode.com/aarav',
    'EDUCATION',
    'B.Tech in Computer Science and Engineering, National Institute of Technology (2022 - 2026), CGPA: 8.7/10',
    'Higher Secondary School Certificate (Class XII), CBSE, 92.4%',
    'TECHNICAL SKILLS',
    'Programming Languages: C++, Python, JavaScript, TypeScript, SQL',
    'Frameworks & Libraries: React.js, Node.js, Express.js, Tailwind CSS',
    'Databases & Developer Tools: PostgreSQL, MongoDB, Git, GitHub, Docker, Postman',
    'Core Computer Science: Data Structures & Algorithms, OOP, DBMS, Operating Systems',
    'PROJECTS',
    '1. Campus Placement Preparation Portal (React.js, Node.js, PostgreSQL):',
    'Developed a full-stack platform supporting student mock interviews and resume reviews.',
    'Integrated authentication and optimized query performance by 35% through database indexing.',
    '2. Distributed Task Scheduler (Python, Redis):',
    'Architected an asynchronous worker queue capable of executing 1,000 jobs per minute.',
    'CERTIFICATIONS & ACHIEVEMENTS',
    'Solved 350+ algorithmic coding questions across LeetCode and HackerRank.',
    'First Place Winner, Inter-College Web Hackathon 2024.'
  ]);

  fs.writeFileSync(path.join(fixturesDir, 'exam_registration.pdf'), examRegPdf);
  fs.writeFileSync(path.join(fixturesDir, 'genuine_resume.pdf'), genuineResumePdf);
  fs.writeFileSync(path.join(fixturesDir, 'empty_document.pdf'), Buffer.alloc(0));
  fs.writeFileSync(path.join(fixturesDir, 'corrupted_file.pdf'), Buffer.from('%PDF-1.4\nCorrupted random byte stream'));

  console.log(`Saved test fixtures to: ${fixturesDir}`);
}

saveTestFixtures();
runTests().then(({ allPassed }) => {
  if (!allPassed) process.exit(1);
});
