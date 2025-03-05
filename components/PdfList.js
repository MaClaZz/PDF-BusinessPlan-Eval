import React, { useState, useEffect } from "react";

const PdfList = () => {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [evaluation, setEvaluation] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/list-uploads")
      .then((res) => res.json())
      .then((data) => setPdfs(data));
  }, []);

  const fetchEvaluation = (pdf) => {
    fetch(`http://localhost:5000/get-evaluation/${pdf}`)
      .then((res) => res.json())
      .then((data) => setEvaluation(data));
    setSelectedPdf(pdf);
  };

  return (
    <div className="pdf-list">
      <h2>Uploaded PDFs</h2>
      <ul>
        {pdfs.map((pdf, index) => (
          <li key={index} onClick={() => fetchEvaluation(pdf)}>
            {pdf}
          </li>
        ))}
      </ul>
      {selectedPdf && (
        <div className="popup">
          <h3>Evaluation for {selectedPdf}</h3>
          <pre>{JSON.stringify(evaluation, null, 2)}</pre>
          <button onClick={() => setSelectedPdf(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default PdfList;
