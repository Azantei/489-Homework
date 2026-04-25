import { useState } from 'react';

export default function PetitionForm({ onSignatureAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [signerType, setSignerType] = useState('');
  const [studentLevel, setStudentLevel] = useState('');
  const [studentMajor, setStudentMajor] = useState('');
  const [facultyRole, setFacultyRole] = useState('');
  const [facultyDept, setFacultyDept] = useState('');
  const [militaryBranch, setMilitaryBranch] = useState('');
  const [militaryStatus, setMilitaryStatus] = useState('');
  const [industrySector, setIndustrySector] = useState('');
  const [industryCompany, setIndustryCompany] = useState('');
  const [otherAffiliation, setOtherAffiliation] = useState('');
  const [comment, setComment] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  function resetForm() {
    setName('');
    setEmail('');
    setCity('');
    setState('');
    setSignerType('');
    setStudentLevel('');
    setStudentMajor('');
    setFacultyRole('');
    setFacultyDept('');
    setMilitaryBranch('');
    setMilitaryStatus('');
    setIndustrySector('');
    setIndustryCompany('');
    setOtherAffiliation('');
    setComment('');
    setErrorMsg('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await fetch('http://localhost:4000/api/signatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, city, state, signerType,
          studentLevel, studentMajor,
          facultyRole, facultyDept,
          militaryBranch, militaryStatus,
          industrySector, industryCompany,
          otherAffiliation,
          comment,
        }),
      });
      const data = await res.json();
      if (res.status === 400) {
        setErrorMsg(data.error || 'Submission failed.');
        return;
      }
      onSignatureAdded(data);
      resetForm();
    } catch {
      setErrorMsg('Could not reach the server.');
    }
  }

  return (
    <div className="signup-module">
      <h2>Sign the Petition</h2>
      <form id="petitionForm" onSubmit={handleSubmit}>

        <div className="form-group">
          <input
            type="text"
            id="nameInput"
            name="name"
            placeholder="Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            id="emailInput"
            name="email"
            placeholder="Your Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            id="cityInput"
            name="city"
            placeholder="City"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            id="stateInput"
            name="state"
            placeholder="State (e.g., WA)"
            maxLength={2}
            value={state}
            onChange={e => setState(e.target.value)}
          />
        </div>

        <div className="form-group">
          <select
            id="signerType"
            name="signerType"
            value={signerType}
            onChange={e => setSignerType(e.target.value)}
          >
            <option value="">-- I am a ... --</option>
            <option value="Student">Student</option>
            <option value="Faculty">Faculty / Staff</option>
            <option value="Military">Military / Veteran</option>
            <option value="Industry">Industry Professional</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {signerType === 'Student' && (
          <div id="section-student" className="conditional-section visible">
            <label htmlFor="studentLevel">Academic level:</label>
            <select
              id="studentLevel"
              name="studentLevel"
              value={studentLevel}
              onChange={e => setStudentLevel(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Graduate">Graduate</option>
            </select>
            <label htmlFor="studentMajor">Major (optional):</label>
            <input
              type="text"
              id="studentMajor"
              name="studentMajor"
              placeholder="e.g., Computer Science"
              value={studentMajor}
              onChange={e => setStudentMajor(e.target.value)}
            />
          </div>
        )}

        {signerType === 'Faculty' && (
          <div id="section-faculty" className="conditional-section visible">
            <label htmlFor="facultyRole">Your role:</label>
            <select
              id="facultyRole"
              name="facultyRole"
              value={facultyRole}
              onChange={e => setFacultyRole(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="Professor">Professor</option>
              <option value="Instructor">Instructor</option>
              <option value="TA">TA</option>
              <option value="Administrative">Administrative</option>
              <option value="Research">Research</option>
            </select>
            <label htmlFor="facultyDept">Department:</label>
            <input
              type="text"
              id="facultyDept"
              name="facultyDept"
              placeholder="e.g., School of EECS"
              value={facultyDept}
              onChange={e => setFacultyDept(e.target.value)}
            />
          </div>
        )}

        {signerType === 'Military' && (
          <div id="section-military" className="conditional-section visible">
            <label htmlFor="militaryBranch">Branch:</label>
            <select
              id="militaryBranch"
              name="militaryBranch"
              value={militaryBranch}
              onChange={e => setMilitaryBranch(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="Army">Army</option>
              <option value="Navy">Navy</option>
              <option value="Air Force">Air Force</option>
              <option value="Marine Corps">Marine Corps</option>
              <option value="Coast Guard">Coast Guard</option>
              <option value="Space Force">Space Force</option>
            </select>
            <label htmlFor="militaryStatus">Status:</label>
            <select
              id="militaryStatus"
              name="militaryStatus"
              value={militaryStatus}
              onChange={e => setMilitaryStatus(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="Active Duty">Active Duty</option>
              <option value="Veteran">Veteran</option>
              <option value="Reservist">Reservist</option>
            </select>
          </div>
        )}

        {signerType === 'Industry' && (
          <div id="section-industry" className="conditional-section visible">
            <label htmlFor="industrySector">Your industry sector:</label>
            <select
              id="industrySector"
              name="industrySector"
              value={industrySector}
              onChange={e => setIndustrySector(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail">Retail</option>
              <option value="Government">Government</option>
              <option value="Non-profit">Non-profit</option>
              <option value="Other">Other</option>
            </select>
            <label htmlFor="industryCompany">Company name (optional):</label>
            <input
              type="text"
              id="industryCompany"
              name="industryCompany"
              placeholder="e.g., Microsoft"
              value={industryCompany}
              onChange={e => setIndustryCompany(e.target.value)}
            />
          </div>
        )}

        {signerType === 'Other' && (
          <div id="section-other" className="conditional-section visible">
            <label htmlFor="otherAffiliation">Please describe your affiliation:</label>
            <textarea
              id="otherAffiliation"
              name="otherAffiliation"
              placeholder="Describe your affiliation..."
              value={otherAffiliation}
              onChange={e => setOtherAffiliation(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <textarea
            id="commentInput"
            name="comment"
            placeholder="Leave a comment (optional)"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>

        <div id="formError" className={`error-message${errorMsg ? ' visible' : ''}`}>
          {errorMsg}
        </div>

        <button type="submit" className="submit-button">Sign Petition</button>
      </form>
    </div>
  );
}
