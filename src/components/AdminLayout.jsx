import Sidebar from "../pages/Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-container" style={{ display: "flex" }}>
      <Sidebar />
      <div className="admin-content" style={{ flexGrow: 1, padding: "20px" }}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
