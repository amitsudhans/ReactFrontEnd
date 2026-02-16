import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

function CSVUpload() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk

  const uploadFile = async () => {
    if (!file) return alert("Select a file");

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("fileName", file.name);
      formData.append("chunkIndex", i);
      formData.append("totalChunks", totalChunks);

      await fetch("http://localhost:5000/upload-chunk", {
        method: "POST",
        body: formData,
      });

      setProgress(Math.round(((i + 1) / totalChunks) * 100));
    }

    alert("All chunks uploaded. Processing started in Redis queue.");
  };

  return (
    <DashboardLayout>
    <div>
      <input type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload CSV</button>
      <p>Progress: {progress}%</p>
    </div>
      </DashboardLayout>
  );
}

export default CSVUpload;
