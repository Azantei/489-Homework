import { useState, useEffect } from 'react';
import PetitionForm from './components/PetitionForm';
import SignaturesTable from './components/SignaturesTable';
import SignatureModal from './components/SignatureModal';
import './Petition2.css';

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
    <>
      <nav>
        <a href="https://www.google.com">Home</a>
        <a href="https://www.google.com">About</a>
        <a href="https://www.google.com">Categories</a>
        <a href="https://www.google.com">Contact</a>
      </nav>

      <div className="container">
        <h1>Move CPTS 489 to Afternoon in Winter!</h1>

        <div className="content-wrapper">
          <div className="petition-body">
            The image you see on the right is a representation of our professor every morning, right before his
            much-needed coffee that helps thaw him out a bit. Imagine having to wake up at 4 or 5 AM in the dead
            of winter just to prepare for class. Technically, since the sun hasn't even risen yet, can we really
            call 4 AM "morning"? The frigid cold, combined with the mental fog of early hours, is an unfair battle
            both for students and faculty alike. No one should have to endure sub-zero temperatures just to attend
            an 8 AM lecture. Morning brain freeze inevitably leads to null pointer exceptions in our heads! For
            these reasons, we humbly request the administration to consider shifting CPTS 489 to a more humane
            afternoon time slot.
          </div>
          <div className="petition-image">
            <img src="http://localhost:4000/images/s-l400-2.jpg" alt="Jack Nicholson in 'The Shining'" />
          </div>
        </div>

        <PetitionForm onSignatureAdded={handleSignatureAdded} />
        <SignaturesTable signatures={signatures} onRowClick={handleRowClick} />
      </div>

      <SignatureModal sig={selectedSig} onClose={() => setSelectedSig(null)} />
    </>
  );
}

export default App;
