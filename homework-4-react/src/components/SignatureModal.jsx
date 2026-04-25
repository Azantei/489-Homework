export default function SignatureModal({ sig, onClose }) {
  if (!sig) return null;

  const details = [
    ['Name', sig.name],
    ['Email', sig.email],
    ['City', sig.city],
    ['State', sig.state],
    ['Type', sig.signerType],
    ...Object.entries(sig.conditionalFields || {}),
    ['Comment', sig.comment || '(none)'],
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="modal-title">Details</h5>
          <button className="btn-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <table className="modal-detail-table">
            <tbody>
              {details.map(([label, value]) => (
                <tr key={label}>
                  <th>{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
