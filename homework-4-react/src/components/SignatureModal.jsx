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
    <>
      <div className="modal fade show d-block" id="detailModal" tabIndex="-1" aria-labelledby="modalTitle" aria-modal="true" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalTitle">Details</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <table className="modal-detail-table">
                <tbody>
                  {details.map(([label, value]) => (
                    <tr key={label}>
                      <td>{label}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </>
  );
}
