export default function Config() {
    return (
      <div>
        <h2>Configuration réseau</h2>
        <form className="mt-3">
          <label>Adresse IP :</label>
          <input type="text" className="form-control mb-2" defaultValue="192.168.1.1" />
          <label>Passerelle :</label>
          <input type="text" className="form-control mb-2" defaultValue="192.168.1.254" />
          <label>Mode Maintenance :</label>
          <select className="form-control mb-2">
            <option>Off</option>
            <option>On</option>
          </select>
          <button className="btn btn-danger">Enregistrer</button>
        </form>
      </div>
    );
  }
  