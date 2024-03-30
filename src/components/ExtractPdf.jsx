import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Document, Page } from 'react-pdf';

import { Button, Container, Form, Card } from 'react-bootstrap';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function ExtractPdf() {
  const { id } = useParams();
  const [path, setPath] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [selectedPages, setSelectedPages] = useState([]);
  const [extractedId, setExtractedId] = useState('');

  useEffect(() => {
    fetch(`http://localhost:8000/api/pdf/upload/${id}`, {
      method: 'POST',
    })
      .then((response) => {
        response.json().then((data) => setPath(data));
      });
  }, [id]); 

  const handleCheckboxChange = (item) => {
    setSelectedPages((prevSelectedPages) => {
      const isSelected = prevSelectedPages.some((prevItem) => prevItem === item);
      if (isSelected) {
        return prevSelectedPages.filter((prevItem) => prevItem !== item);
      } else {
        return [...prevSelectedPages, item];
      }
    });
  };

  async function handleExtract(e) {
    e.preventDefault();
    if (selectedPages.length === 0) {
      alert('Select the pages');
    }
    const response = await fetch('http://localhost:8000/api/pdf/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedPages),
    });

    if (response.status === 200) {
      const result = await response.json();
      setExtractedId(result.id);
      setRedirect(true);
    } else {
      alert("Couldn't merge docs");
    }
  }

  if (redirect) {
    return <Navigate to={`/downloadform/${extractedId}`} />;
  }

  return (
    <Container className='ExtractPage'>
      <h1 className='heading'>Select the pages to be extracted and click extract</h1>
      <Container className='extract-div'>
        {path &&
          path.map((item, index) => (
            <Card key={index} className='extract-card'>
              <Document file={item} className='extract-doc'>
                <Page className='extract-page' height="400" pageNumber={1} />
              </Document>
              <Form.Check
                className="input-label"
                type="checkbox"
                label={`Select Page ${index + 1}`}
                checked={selectedPages.some((selectedItem) => selectedItem === item)}
                onChange={() => handleCheckboxChange(item)}
              />
            </Card>
          ))}
      </Container>
      <Button className='black-btn' onClick={handleExtract}>Extract</Button>
    </Container>
  );
}

export default ExtractPdf;