import { useState, useEffect } from "react";
import { resourceService } from "../services/resourceService";
import { useAuth } from "../context/AuthContext";
import ResourceForm from "../components/ResourceForm";
import ConfirmDelete from "../components/ConfirmDelete";

export default function AdminResources() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await resourceService.getAll();
      setResources(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };
  const openEdit = (r) => {
    setEditing(r);
    setShowForm(true);
  };

  const handleSaved = () => {
    setShowForm(false);
    load();
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
    setShowConfirm(true);
  };
  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await resourceService.delete(deletingId);
      setShowConfirm(false);
      setDeletingId(null);
      load();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409)
        alert("Cannot delete — active bookings exist");
      else alert(err.response?.data?.message || "Delete failed");
    }
  };

  const toggleStatus = async (r) => {
    const next = r.status === "ACTIVE" ? "OUT_OF_SERVICE" : "ACTIVE";
    try {
      await resourceService.update(r.id, { status: next });
      load();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Admin — Manage Resources</div>
          <div className="page-subtitle">
            Create, edit and remove campus resources
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        {user?.role === "ADMIN" && (
          <button className="btn btn-primary" onClick={openCreate}>
            Add Resource
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Availability</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td>{r.type}</td>
                  <td>{r.location}</td>
                  <td>{r.capacity}</td>
                  <td>
                    {r.availabilityStart || "—"}–{r.availabilityEnd || "—"}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${r.status === "ACTIVE" ? "approved" : "cancelled"}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      {user?.role === "ADMIN" && (
                        <>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => openEdit(r)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => confirmDelete(r.id)}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => toggleStatus(r)}
                          >
                            {r.status === "ACTIVE"
                              ? "Mark OUT_OF_SERVICE"
                              : "Mark ACTIVE"}
                          </button>
                        </>
                      )}
                      {user?.role === "OPERATIONS" && (
                        <div style={{ fontSize: 13, color: "var(--gray-600)" }}>
                          Read-only
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
          }}
        >
          <div
            style={{
              width: 720,
              background: "white",
              borderRadius: 8,
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div style={{ fontWeight: 700 }}>
                {editing ? "Edit Resource" : "Create Resource"}
              </div>
              <button
                className="btn btn-ghost"
                onClick={() => setShowForm(false)}
              >
                Close
              </button>
            </div>
            <ResourceForm
              resource={editing}
              onSaved={handleSaved}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmDelete
          title="Delete resource?"
          description="Deleting a resource is irreversible."
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          loading={false}
        />
      )}
    </div>
  );
}
