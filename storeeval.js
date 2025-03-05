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

    res.json({ message: "Evaluation completed successfully", evaluation });
});
