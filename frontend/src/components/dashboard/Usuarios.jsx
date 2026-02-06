import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaUsers,
  FaUserShield,
  FaBuilding,
  FaUser,
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { getUsers, deleteUser } from "../../services/users.service";
import ConfirmModal from "../common/ConfirmModal";
import AlertModal from "../common/AlertModal";
import UsuarioFormModal from "./UsuarioFormModal";
import UsuarioEditModal from "./UsuarioEditModal";

export default function Usuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data || []); // Asegurarse de que siempre sea un array
      setError(null);
    } catch (err) {
      setError("Error al cargar los usuarios");
      setUsers([]); // Asegurarse de que sea un array vacío en caso de error
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      loadUsers();
    } catch (error) {
      console.error("Error al eliminar:", error);
      setAlertMessage("Error al eliminar el usuario.");
      setShowAlert(true);
    } finally {
      setUserToDelete(null);
    }
  };

  const getRoleName = (role) => {
    const roles = {
      admin: "Administrador",
      sysadmin: "Super Administrador",
      agencia: "Agencia",
      operador: "Operador",
    };
    return roles[role] || role;
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <FaUserShield />;
      case "sysadmin":
        return <FaUserShield />;
      case "agencia":
        return <FaBuilding />;
      case "operador":
        return <FaUser />;
      default:
        return <FaUser />;
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: { bg: "#fee", color: "#c53030" },
      sysadmin: { bg: "#fce4ec", color: "#c2185b" },
      agencia: { bg: "#e3f2fd", color: "#0d47a1" },
      operador: { bg: "#e8f5e9", color: "#2e7d32" },
    };
    return colors[role] || { bg: "#f7fafc", color: "#2d3748" };
  };

  const filteredUsers = (users || []).filter((user) => {
    const matchSearch =
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = !roleFilter || user.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (loading) {
    return (
      <div className="section-container">
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div
            className="spinner"
            style={{
              margin: "0 auto 1rem",
              border: "4px solid #e2e8f0",
              borderTop: "4px solid #4a5568",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p style={{ color: "#718096" }}>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-container">
        <div className="alert alert-danger" style={{ margin: "2rem" }}>
          {error}
          <button
            onClick={loadUsers}
            className="btn-secondary"
            style={{ marginTop: "1rem" }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="section-container">
        {/* Toolbar */}
        <div className="section-toolbar">
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <FaPlus /> Nuevo Usuario
          </button>
          <div className="toolbar-actions">
            <div className="search-box-crm">
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="sysadmin">Super Administrador</option>
              <option value="agencia">Agencia</option>
              <option value="operador">Operador</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e3f2fd" }}>
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>{filteredUsers.length}</h3>
              <p>
                Usuarios {searchTerm || roleFilter ? "Filtrados" : "Totales"}
              </p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fee" }}>
              <FaUserShield />
            </div>
            <div className="stat-content">
              <h3>{(users || []).filter((u) => u.role === "admin").length}</h3>
              <p>Administradores</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#f3e5f5" }}>
              <FaBuilding />
            </div>
            <div className="stat-content">
              <h3>
                {(users || []).filter((u) => u.role === "agencia").length}
              </h3>
              <p>Agencias</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e8f5e9" }}>
              <FaUser />
            </div>
            <div className="stat-content">
              <h3>
                {(users || []).filter((u) => u.role === "operador").length}
              </h3>
              <p>Operadores</p>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {filteredUsers.length === 0 ? (
          <div className="alert alert-info" style={{ margin: "2rem" }}>
            <p>No se encontraron usuarios con los filtros aplicados</p>
          </div>
        ) : (
          <div className="packages-grid">
            {filteredUsers.map((user) => (
              <div key={user.id} className="package-card">
                <div className="package-header">
                  <div className="package-category">
                    <span
                      className="category-badge"
                      style={{
                        background: getRoleBadgeColor(user.role).bg,
                        color: getRoleBadgeColor(user.role).color,
                      }}
                    >
                      {getRoleIcon(user.role)} {getRoleName(user.role)}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn-icon"
                      onClick={() => handleEditClick(user)}
                      title="Editar usuario"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDeleteClick(user)}
                      title="Eliminar usuario"
                      style={{ color: "#e53e3e" }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="package-body">
                  <h3 className="package-title">{user.nombre}</h3>
                  <div className="package-info">
                    <div className="info-item">
                      <span className="info-icon">
                        <FaEnvelope />
                      </span>
                      <span>{user.email}</span>
                    </div>
                    {user.telefono && (
                      <div className="info-item">
                        <span className="info-icon">
                          <FaPhone />
                        </span>
                        <span>{user.telefono}</span>
                      </div>
                    )}
                    {user.direccion && (
                      <div className="info-item">
                        <span className="info-icon">
                          <FaMapMarkerAlt />
                        </span>
                        <span>{user.direccion}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="package-footer">
                  <div className="package-price">
                    <span className="price-label">Registrado</span>
                    <span className="price-value">
                      {new Date(user.createdAt).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <UsuarioFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadUsers}
      />

      <UsuarioEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={loadUsers}
        usuario={selectedUser}
      />

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar a "${userToDelete?.nombre}"?`}
        isDanger={true}
      />

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="Error"
        message={alertMessage}
        type="error"
      />
    </>
  );
}
