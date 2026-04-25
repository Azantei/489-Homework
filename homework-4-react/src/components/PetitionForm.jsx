import { useState } from 'react';

export default function PetitionForm({ onSignatureAdded }) {
  const [fields, setFields] = useState({
    name: '', email: '', city: '', state: '', signerType: '',
    studentLevel: '', studentMajor: '',
    facultyRole: '', facultyDept: '',
    militaryBranch: '', militaryStatus: '',
    industrySector: '', industryCompany: '',
    otherAffiliation: '',
    comment: '',
  });
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/signatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Submission failed.');
        return;
      }
      onSignatureAdded(data);
      setFields({
        name: '', email: '', city: '', state: '', signerType: '',
        studentLevel: '', studentMajor: '',
        facultyRole: '', facultyDept: '',
        militaryBranch: '', militaryStatus: '',
        industrySector: '', industryCompany: '',
        otherAffiliation: '',
        comment: '',
      });
    } catch {
      setError('Could not reach the server.');
    }
  }

  const { signerType } = fields;

  return (
    <div className="signup-module">
      <h2>Sign the Petition</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="text" name="name" placeholder="Your Name" value={fields.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <input type="email" name="email" placeholder="Your Email" value={fields.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <input type="text" name="city" placeholder="City" value={fields.city} onChange={handleChange} />
        </div>
        <div className="form-group">
          <input type="text" name="state" placeholder="State (e.g., WA)" maxLength={2} value={fields.state} onChange={handleChange} />
        </div>
        <div className="form-group">
          <select name="signerType" value={fields.signerType} onChange={handleChange}>
            <option value="">-- I am a ... --</option>
            <option value="Student">Student</option>
            <option value="Faculty">Faculty / Staff</option>
            <option value="Military">Military / Veteran</option>
            <option value="Industry">Industry Professional</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {signerType === 'Student' && (
          <div className="conditional-section">
            <label>Academic level:
              <select name="studentLevel" value={fields.studentLevel} onChange={handleChange}>
                <option value="">-- Select --</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
              </select>
            </label>
            <label>Major (optional):
              <input type="text" name="studentMajor" placeholder="e.g., Computer Science" value={fields.studentMajor} onChange={handleChange} />
            </label>
          </div>
        )}

        {signerType === 'Faculty' && (
          <div className="conditional-section">
            <label>Your role:
              <select name="facultyRole" value={fields.facultyRole} onChange={handleChange}>
                <option value="">-- Select --</option>
                <option value="Professor">Professor</option>
                <option value="Instructor">Instructor</option>
                <option value="TA">TA</option>
                <option value="Administrative">Administrative</option>
                <option value="Research">Research</option>
              </select>
            </label>
            <label>Department:
              <input type="text" name="facultyDept" placeholder="e.g., School of EECS" value={fields.facultyDept} onChange={handleChange} />
            </label>
          </div>
        )}

        {signerType === 'Military' && (
          <div className="conditional-section">
            <label>Branch:
              <select name="militaryBranch" value={fields.militaryBranch} onChange={handleChange}>
                <option value="">-- Select --</option>
                <option value="Army">Army</option>
                <option value="Navy">Navy</option>
                <option value="Air Force">Air Force</option>
                <option value="Marine Corps">Marine Corps</option>
                <option value="Coast Guard">Coast Guard</option>
                <option value="Space Force">Space Force</option>
              </select>
            </label>
            <label>Status:
              <select name="militaryStatus" value={fields.militaryStatus} onChange={handleChange}>
                <option value="">-- Select --</option>
                <option value="Active Duty">Active Duty</option>
                <option value="Veteran">Veteran</option>
                <option value="Reservist">Reservist</option>
              </select>
            </label>
          </div>
        )}

        {signerType === 'Industry' && (
          <div className="conditional-section">
            <label>Your industry sector:
              <select name="industrySector" value={fields.industrySector} onChange={handleChange}>
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
            </label>
            <label>Company name (optional):
              <input type="text" name="industryCompany" placeholder="e.g., Microsoft" value={fields.industryCompany} onChange={handleChange} />
            </label>
          </div>
        )}

        {signerType === 'Other' && (
          <div className="conditional-section">
            <label>Please describe your affiliation:
              <textarea name="otherAffiliation" placeholder="Describe your affiliation..." value={fields.otherAffiliation} onChange={handleChange} />
            </label>
          </div>
        )}

        <div className="form-group">
          <textarea name="comment" placeholder="Leave a comment (optional)" value={fields.comment} onChange={handleChange} />
        </div>

        {error && <div className="error-message visible">{error}</div>}

        <button type="submit" className="submit-button">Sign Petition</button>
      </form>
    </div>
  );
}
