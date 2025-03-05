const AWS = require('aws-sdk');
const multer = require('multer');
const s3 = new AWS.S3();
const upload = multer();
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";  // Change based on your MongoDB setup
const client = new MongoClient(uri);
let db;
client.connect().then(() => {
    db = client.db("evaluationDB");
});

app.post('/evaluate-pdf', async (req, res) => {
    const { evaluationId, evaluationResult } = req.body;

    if (!evaluationId) {
        return res.status(400).send("Invalid evaluation ID");
    }

    const updateResult = await db.collection("evaluations").updateOne(
        { id: evaluationId },
        { $set: { status: "Evaluated", result: evaluationResult, updatedAt: new Date() } },
        { upsert: true }
    );

    res.json({ message: "Evaluation completed successfully", updateResult });
});
app.post('/upload-pdf', upload.single('pdf'), (req, res) => {
    const fileContent = req.file.buffer;
    const fileName = `${Date.now()}_${req.file.originalname}`;
    
    const params = {
        Bucket: 'your-bucket-name',
        Key: fileName,
        Body: fileContent,
        ContentType: 'application/pdf',
    };
    
    s3.upload(params, (err, data) => {
        if (err) {
            return res.status(500).send('Error uploading file to S3');
        }
        
        const evaluationId = fileName.split('.')[0]; // Use timestamp as evaluation ID
        const evaluationRecord = {
            id: evaluationId,
            filePath: data.Location, // S3 file URL
            status: "Pending Evaluation",
            createdAt: new Date(),
        };

        // Save record in your database (e.g., MongoDB)
        evaluations[evaluationId] = evaluationRecord;

        res.json({ message: "File uploaded successfully", evaluationId });
    });
});
