const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files
// TODO Task: give option to delete uploaded file + its evaluation

// Ensure the uploads directory exists
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Multer Set up file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const filename = `${timestamp}_${file.originalname}`;
        cb(null, filename);
    },
});

const upload = multer({ storage });
// Load evaluations from file
const evaluationsFile = 'evaluations.json';
let evaluations = {}; // Simulating a database for this example

app.post('/upload-pdf', upload.single('pdf'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    
    const pdfPath = req.file.path;
    const evaluationId = req.file.filename.split('.')[0]; // use timestamp as ID

    // Store the evaluation and file information in the database
    // For simplicity, assuming you store this in a database
    const evaluationRecord = {
        id: evaluationId,
        filePath: pdfPath,
        status: "Pending Evaluation",
        createdAt: new Date(),
    };

    // Save record to the database (e.g., MongoDB, PostgreSQL)
    // Example with a simple object (you can replace with a real database)
    evaluations[evaluationId] = evaluationRecord;
    // Call evaluatePDF to simulate evaluation after uploading
    evaluatePDF(evaluationId);

    res.json({ message: "File uploaded successfully", evaluationId });
});

// List Uploaded Files
app.get('/list-uploads', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading upload directory' });
        }
        res.json(files);
    });
});
// app.get('/list-evaluated', (req, res) => {
//     const evaluatedFiles = Object.values(evaluations)
//         .filter(evaluation => evaluation.status === "Evaluated")
//         .map(evaluation => path.basename(evaluation.filePath));

//     res.json(evaluatedFiles);
// });
// async function checkEvaluationStatus(evaluationId) {
//     try {
//         const response = await fetch(`/get-evaluation/${evaluationId}`);
//         if (!response.ok) throw new Error("Failed to fetch evaluation status");

//         const result = await response.json();
//         document.getElementById('evaluationStatus').textContent = result.status;
//     } catch (error) {
//         console.error("Error fetching evaluation status:", error);
//         document.getElementById('evaluationStatus').textContent = "Error retrieving status";
//     }
// }

// Replace with the actual evaluation ID you receive after uploading
// const evaluationId = "your_real_evaluation_id"; 
// checkEvaluationStatus(evaluationId);

// Load evaluations from file when the server starts
if (fs.existsSync(evaluationsFile)) {
    evaluations = JSON.parse(fs.readFileSync(evaluationsFile, 'utf-8'));
}

// Function to save evaluations to file
function saveEvaluations() {
    fs.writeFileSync(evaluationsFile, JSON.stringify(evaluations, null, 2), 'utf-8');
}
// Example of saving evaluation results
app.post('/evaluate-pdf', (req, res) => {
    const { evaluationId, evaluationResult } = req.body;

    const evaluation = evaluations[evaluationId];
    if (!evaluation) {
        return res.status(404).send('Evaluation not found');
    }

    evaluation.status = "Evaluated";
    evaluation.result = evaluationResult;
    evaluation.updatedAt = new Date();

    // Save to the database (example: MongoDB)
    // db.collection('evaluations').updateOne({ id: evaluationId }, { $set: evaluation });

    res.json({ message: "Evaluation completed successfully", evaluation: evaluations[evaluationId] });
});
app.get('/get-evaluation/:evaluationId', (req, res) => {
    const evaluationId = req.params.evaluationId;
    const evaluation = evaluations[evaluationId];

    if (!evaluation) {
        // Call evaluatePDF to simulate evaluation after uploading
        evaluatePDF(evaluationId);

        return res.status(404).json({ message: 'Evaluation not found' });
    }

    res.json({ status: evaluation.status, result: evaluation.result || "Pending" });
});
function evaluatePDF(evaluationId) {
    if (!evaluations[evaluationId]) return;

    const evaluationResult = {
        Market: parseFloat((Math.random() * 5).toFixed(1)),
        Solution: parseFloat((Math.random() * 5).toFixed(1)),
        Idea_Novelty: parseFloat((Math.random() * 5).toFixed(1)),
        Market_Attractiveness: parseFloat((Math.random() * 5).toFixed(1)),
        Market_Size: parseFloat((Math.random() * 5).toFixed(1)),
        Market_Growth: parseFloat((Math.random() * 5).toFixed(1)),
        Market_Competition: parseFloat((Math.random() * 5).toFixed(1)),
        User_Pain_Level: parseFloat((Math.random() * 5).toFixed(1)),
        Solution_Inventiveness: parseFloat((Math.random() * 5).toFixed(1)),
        Launch_Readiness: parseFloat((Math.random() * 5).toFixed(1)),
        Team_Potential: parseFloat((Math.random() * 5).toFixed(1)),
        Overall_Feeling: parseFloat((Math.random() * 5).toFixed(1)),
        // Total_Score: Market+Solution+Idea_Novelty+Market_Attractiveness+Market_Size+Market_Growth+User_Pain_Level+Solution_Inventiveness+Launch_Readiness+Team_Potential+Overall_Feeling,  // Random score between 50-100
        // Standardized_Score: (Total_Score/12).toFixed(2)
    };
    // Calculate Total Score
    const Total_Score = Object.values(evaluationResult).reduce((sum, val) => sum + val, 0);

    // Add total and standardized scores to the result
    evaluationResult.Total_Score = Total_Score.toFixed(1);
    evaluationResult.Standardized_Score = (Total_Score / 12).toFixed(2);

    evaluations[evaluationId].status = "Evaluated";
    evaluations[evaluationId].result = evaluationResult;
    evaluations[evaluationId].updatedAt = new Date();
    saveEvaluations();  // Save results to file
}
app.listen(5000, () => console.log('Server running on port 5000'));
