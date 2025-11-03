import { useEffect, useRef, useState } from "react";

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New User Signup", message: "John Doe has requested access.", time: "2 mins ago" },
    { id: 2, title: "API Request", message: "API `/getCustomerData` pending approval.", time: "10 mins ago" },
    { id: 3, title: "Reminder", message: "Update endpoint description.", time: "1 hour ago" },
  ]);

  const dropdownRef = useRef();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="position-relative me-3" ref={dropdownRef}>
      {/* Bell Icon */}
      <div
        className="fs-2"
        style={{ color: "#007bff", cursor: "pointer" }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <i className="fa-solid fa-bell"></i>
        {notifications.length > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle rounded-circle bg-danger text-white d-flex align-items-center justify-content-center"
            style={{
                width: "20px",
                height: "20px",
                fontSize: "13px",
                transform: "translate(-30%, 30%)",
            }}
          >
  {notifications.length}
</span>
        )}
      </div>

      {/* Dropdown box */}
      {open && (
  <div
    className="position-absolute end-0 mt-2 p-2 shadow rounded bg-white border"
    style={{
      width: "300px",
      zIndex: 1000,
      maxHeight: "300px",
      overflowY: "auto",
      fontSize: "13px", // smaller text
      lineHeight: "1.3", // tighter line spacing
    }}
  >
    <div className="d-flex justify-content-between align-items-center mb-2">
      <h6 className="fw-semibold mb-0" style={{ fontSize: "14px" }}>
        Notifications
      </h6>
      <small
        className="text-primary"
        style={{ cursor: "pointer", fontSize: "12px" }}
        onClick={() => setNotifications([])}
      >
        Mark all read
      </small>
    </div>

    {notifications.length === 0 ? (
      <p className="text-muted text-center mb-0" style={{ fontSize: "12px" }}>
        No notifications
      </p>
    ) : (
      notifications.map((n) => (
        <div
          key={n.id}
          className="border-bottom py-1 px-1"
          style={{ cursor: "pointer" }}
          onClick={() => alert(`Clicked on: ${n.title}`)}
        >
          <div className="fw-semibold" style={{ fontSize: "13px" }}>
            {n.title}
          </div>
          <div className="text-muted" style={{ fontSize: "12px" }}>
            {n.message}
          </div>
          <div
            className="text-muted fst-italic text-end"
            style={{ fontSize: "11px" }}
          >
            {n.time}
          </div>
        </div>
      ))
    )}
  </div>
)}

    </div>
  );
}

export default NotificationBell;