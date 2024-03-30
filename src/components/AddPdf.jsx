import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button, Container, Form, Spinner } from 'react-bootstrap';

import './AddPdf.css';

function AddPdf() {
  const [file, setFile] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.set('file', file);

    fetch('http://localhost:8000/api/pdf/upload', {
      method: 'POST',
      body: data,
    })
      .then((response) => {
        if (!response.ok) {
          alert('Could not complete request! Try again.');
          setLoading(false);
        }
        return response.json();
      })
      .then((data) => {
        setId(data._id);
        setRedirect(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
        setLoading(false);
      });
  };

  if (redirect) {
    return <Navigate to={`/getForm/${id}`} />;
  }

  return (
    <Container className="AddPdf">
      <Form className="AddPdf-Form" onSubmit={handleSubmit}>
        <div className="AddPdf-heading">
          <h1 className="head">PDF Extractor</h1>
        </div>
        <div className="AddPdf-desc text-center">
          <p>
            This is the pdf extractor app here you can upload the pdf and you can extract some pages, then you can build a new pdf file, also you can download your new pdf file
          </p>
        </div>

        <Form.Group controlId="formFile" className="mt-5">
          <Form.Label className="form-label">Select a PDF file</Form.Label>
          <Form.Control
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="form-control"
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="my-3" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Upload PDF'}
        </Button>
      </Form>
    </Container>
  );
}

export default AddPdf;
