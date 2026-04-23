import React from "react";

export default function ResourceCard({ resource, onClick, onPrimary }) {
  return (
    <div
      className="resource-card"
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={() => onClick?.(resource)}
    >
      <div className="resource-card-header">
        <div className={`resource-type-icon ${resource.type?.toLowerCase()}`}>
          {resource.type}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>{resource.name}</div>
          <div style={{ fontSize: 12, color: "var(--gray-500)" }}>
            {resource.type}
          </div>
        </div>
        <span
          className={`status-badge ${resource.status === "ACTIVE" ? "approved" : "cancelled"}`}
        >
          {resource.status === "ACTIVE" ? "Available" : "Out of Service"}
        </span>
      </div>
      <div className="resource-card-body">
        {resource.location && (
          <div style={{ fontSize: 13, color: "var(--gray-600)" }}>
            {resource.location}
          </div>
        )}
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          {onPrimary && (
            <button
              className="btn btn-primary btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onPrimary(resource);
              }}
            >
              Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
