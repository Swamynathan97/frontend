import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Container, Nav, Button, Col, Row } from 'react-bootstrap';

function DownloadPdf() {
  const { id } = useParams();
  const [pdfUrl, setPdfUrl] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:8000/api/pdf/download/${id}`, {
      method: 'post',
    })
      .then((response) => response.json())
      .then((result) => setPdfUrl(result.ExtractedPdfUrl))
      .catch((error) => console.error('Error fetching PDF:', error)); 
  }, [id]); 

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => setPageNumber((prevPage) => Math.max(prevPage - 1, 1));

  const goToNextPage = () =>
    setPageNumber((prevPage) => Math.min(prevPage + 1, numPages || 1));

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl);
    } else {
      console.error('PDF URL is empty');
    }
  };

  return (
    <Container className="Download-section">
      <Container className="Download-div">
        <Nav className="Download-nav">
          <Row className="nav-button">
            <Col>
              <Button onClick={goToPrevPage} className="black-btn">
                Prev
              </Button>
            </Col>
            <Col>
              <Button onClick={goToNextPage} className="black-btn">
                Next
              </Button>
            </Col>
          </Row>
          <Nav.Item>
            <p className="Pdf-pageNum">
              Page {pageNumber} of {numPages}
            </p>
          </Nav.Item>
        </Nav>
        <div className="file-container">
          <Document className="file-viewer" file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} height={600} />
          </Document>
        </div>
        <div className="download-btn-container">
          <Button className="download-btn" onClick={handleDownload}>
            Download
          </Button>
        </div>
      </Container>
    </Container>
  );
}

export default DownloadPdf;