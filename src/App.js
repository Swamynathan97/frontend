import './App.css';

import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import AddPdf from './components/AddPdf';
import ExtractPdf from './components/ExtractPdf';
import DownloadPdf from './components/DownloadPdf';
function App() {
  return (
    <>
     <div className="App">
  <Router>
    <Routes>
      <Route exact='/' path='/'element={<AddPdf/>}/>
      <Route path='/getform/:id' element={<ExtractPdf/>}/>
      <Route path='/downloadform/:id' element={<DownloadPdf/>}/>
    </Routes>
  </Router>
  </div>
    </>
  );
}

export default App;
