// // Uncomment this line to use CSS modules
// // import styles from './app.module.css';
// import NxWelcome from "./nx-welcome";

// import { Route, Routes, Link } from 'react-router-dom';

// export function App() {
//   return (
//     <div>
//       <NxWelcome title="@org/frontend"/>

//     {/* START: routes */}
//     {/* These routes and navigation have been generated for you */}
//     {/* Feel free to move and update them to fit your needs */}
//     <br/>
//     <hr/>
//     <br/>
//     <div role="navigation">
//       <ul>
//         <li><Link to="/">Home</Link></li>
//         <li><Link to="/page-2">Page 2</Link></li>
//       </ul>
//     </div>
//     <Routes>
//       <Route
//         path="/"
//         element={
//           <div>This is the generated root route. <Link to="/page-2">Click here for page 2.</Link></div>
//         }
//       />
//       <Route
//         path="/page-2"
//         element={
//           <div><Link to="/">Click here to go back to root page.</Link></div>
//         }
//       />
//     </Routes>
//     {/* END: routes */}
//     </div>
//   );
// }

// export default App;

import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleFile = (f) => {
    setFile(f);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select a file");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setMessage("✅ " + (data.message || "Processing started"));

      // Fake history update
      setHistory((prev) => [
        {
          name: file.name,
          status: "Processing",
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } catch {
      setMessage("❌ Upload failed");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2>⚡ Referral</h2>
        <p>Dashboard</p>
        <p>Uploads</p>
        <p>Analytics</p>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <h1>📊 Dashboard</h1>

        {/* Stats */}
        <div style={styles.stats}>
          <Card title="Emails Sent" value="120" />
          <Card title="In Progress" value="5" />
          <Card title="Failures" value="2" />
        </div>

        {/* Upload Section */}
        <div style={styles.card}>
          <h3>📤 Upload Excel</h3>

          <div
            style={styles.dropZone}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files[0]);
            }}
          >
            {file ? <p>📄 {file.name}</p> : <p>Drag & Drop Excel or Click</p>}

            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => handleFile(e.target.files[0])}
              style={styles.hiddenInput}
            />
          </div>

          <button onClick={handleUpload} style={styles.button}>
            {loading ? "Uploading..." : "Upload"}
          </button>

          {message && <p>{message}</p>}
        </div>

        {/* Activity */}
        <div style={styles.card}>
          <h3>📜 Recent Activity</h3>

          {history.length === 0 && <p>No uploads yet</p>}

          {history.map((item, i) => (
            <div key={i} style={styles.activityItem}>
              <span>{item.name}</span>
              <span>{item.status}</span>
              <span>{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Card = ({ title, value }) => (
  <div style={styles.statCard}>
    <h4>{title}</h4>
    <p style={styles.statValue}>{value}</p>
  </div>
);

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial",
  },
  sidebar: {
    width: "200px",
    background: "#111",
    color: "#fff",
    padding: "20px",
  },
  main: {
    flex: 1,
    padding: "30px",
    background: "#f5f7fa",
  },
  stats: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },
  statCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    flex: 1,
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  dropZone: {
    border: "2px dashed #aaa",
    padding: "30px",
    textAlign: "center",
    marginBottom: "10px",
    cursor: "pointer",
    borderRadius: "10px",
  },
  hiddenInput: {
    marginTop: "10px",
  },
  button: {
    padding: "10px 20px",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  activityItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },
};

export default App;
