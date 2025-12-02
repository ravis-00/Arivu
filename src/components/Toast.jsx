// src/components/Toast.jsx
export default function Toast({ message, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "22px",
        right: "22px",
        background: "#b91c1c",
        color: "white",
        padding: "14px 20px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 9999,
        minWidth: "260px",
      }}
    >
      <strong style={{ display: "block", marginBottom: "4px" }}>
        Arivu – Process Awareness
      </strong>
      {message}

      <div style={{ textAlign: "right", marginTop: "8px" }}>
        <button
          onClick={onClose}
          style={{
            background: "white",
            color: "#b91c1c",
            padding: "4px 10px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
