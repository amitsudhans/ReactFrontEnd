import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";


const CHUNK_SIZE = 5 * 1024 * 1024;

function App() {
  const [progress, setProgress] = useState(0);

  const uploadVideo = async (file) => {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
      const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);

      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("chunkIndex", i);
      formData.append("totalChunks", totalChunks);
      formData.append("fileName", file.name);

      await fetch("http://localhost:5000/upload-chunk", {
        method: "POST",
        body: formData,
      });

      setProgress(Math.round(((i + 1) / totalChunks) * 100));
    }

    alert("Upload & compression started!");
  };

  return (
  <DashboardLayout>
    <div style={{ padding: 40 }}>
      <h2>Big Video Upload (Redis + Compression)</h2>

      <input
        type="file"
        accept="video/*"
        onChange={(e) => uploadVideo(e.target.files[0])}
      />

      <progress value={progress} max="100" />
      <p>{progress}%</p>
    </div>
      </DashboardLayout>
  );
}

export default App;
