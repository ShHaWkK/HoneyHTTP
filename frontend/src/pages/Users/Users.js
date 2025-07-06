
import React, { useState, useEffect } from "react";

export default function Users() {
  const [filter, setFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAdminStatus = async () => {
		try {
		  const token = localStorage.getItem("jwt");

			const res = await fetch('http://localhost:8081/api/auth/check', {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

		  const data = await res.json();
		  setIsAdmin(data.isAdmin);
		} catch (err) {
		  console.error('Erreur vérification admin:', err);
		  setIsAdmin(false);
		}
	};


  const fetchUsers = async () => {
		try {
		  setLoading(true);
		  setError(null);
		  
		  const token = localStorage.getItem("jwt");

			const headers = {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			};

			const res = await fetch(`http://localhost:8081/api/users?filter=${encodeURIComponent(filter)}`, {
				headers
			});

		    
      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        throw new Error('Format de données invalide');
      }
    } catch (err) {
      console.error('Erreur récupération utilisateurs:', err);
      setError(`Erreur: ${err.message}`);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin !== null) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleSearch = () => {
    fetchUsers();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👥 Utilisateurs</h2>
        {isAdmin && (
          <span className="badge bg-success">👑 Mode Admin - Mots de passe visibles</span>
        )}
      </div>
      
      <div className="row mb-3">
        <div className="col-md-8">
          <div className="input-group">
            <input
              className="form-control"
              placeholder="Rechercher un utilisateur (nom ou ID)"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              🔍 Rechercher
            </button>
          </div>
        </div>
        <div className="col-md-4 text-end">
          <small className="text-muted">
            {users.length} utilisateur(s) trouvé(s)
          </small>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center p-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last Login</th>
                {isAdmin && <th>🔐 Password</th>}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? "6" : "5"} className="text-center text-muted p-4">
                    {filter ? 'Aucun utilisateur trouvé avec ce filtre' : 'Aucun utilisateur disponible'}
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <span className="badge bg-secondary">{user.id}</span>
                    </td>
                    <td>
                      <strong>{user.username}</strong>
                      {user.role === 'admin' && (
                        <span className="badge bg-warning ms-2">Admin</span>
                      )}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-info'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">{user.lastLogin}</small>
                    </td>
                    {isAdmin && (
                      <td>
                        <code className="bg-light p-1 rounded">
                          {user.password}
                        </code>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3">
        <small className="text-muted">
          💡 Statut: {isAdmin ? 'Administrateur' : 'Utilisateur standard'} | 
          Base de données: SQLite | 
          Dernière mise à jour: {new Date().toLocaleString()}
        </small>
      </div>
    </div>
  );
}
