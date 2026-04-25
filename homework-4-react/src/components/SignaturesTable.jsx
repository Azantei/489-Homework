export default function SignaturesTable({ signatures, onRowClick }) {
  return (
    <div className="signatures-module">
      <h2>Signatures</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Type</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {signatures.map((sig, i) => (
            <tr key={i} onClick={() => onRowClick(sig)}>
              <td>{sig.name}</td>
              <td>{sig.city}</td>
              <td>{sig.signerType}</td>
              <td><a href="#" onClick={e => { e.preventDefault(); onRowClick(sig); }}>more »</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
