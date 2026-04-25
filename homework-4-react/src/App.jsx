import { useState, useEffect } from 'react';
import PetitionForm from './components/PetitionForm';
import SignaturesTable from './components/SignaturesTable';
import SignatureModal from './components/SignatureModal';
import './App.css';

function App() {
  const [signatures, setSignatures] = useState([]);
  const [selectedSig, setSelectedSig] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/signatures')
      .then(res => res.json())
      .then(data => setSignatures(data))
      .catch(err => console.error('Failed to load signatures:', err));
  }, []);

  function handleSignatureAdded(newSig) {
    setSignatures(prev => [...prev, newSig]);
  }

  function handleRowClick(sig) {
    setSelectedSig(sig);
  }

  return (
    <div className="container">
      <h1>Move CPTS 489 to Afternoon in Winter!</h1>
      <PetitionForm onSignatureAdded={handleSignatureAdded} />
      <SignaturesTable signatures={signatures} onRowClick={handleRowClick} />
      <SignatureModal sig={selectedSig} onClose={() => setSelectedSig(null)} />
    </div>
  );
}

export default App;
