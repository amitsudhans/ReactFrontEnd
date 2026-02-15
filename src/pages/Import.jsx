import { useState } from "react";
import { uploadChunk } from "../api/upload.api";
import DashboardLayout from "../layouts/DashboardLayout";


const UploadPage = () => {
  const [progress, setProgress] = useState(0);

  const uploadFileInChunks = async (file) => {
    const chunkSize = 5 * 1024 * 1024; // 5MB
    const totalChunks = Math.ceil(file.size / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);

      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("fileName", file.name);
      formData.append("chunkIndex", i);
      formData.append("totalChunks", totalChunks);

      await uploadChunk(formData);

      setProgress(Math.round(((i + 1) / totalChunks) * 100));
    }

    alert("Upload completed & queued for processing");
  };

  return (
  <DashboardLayout>
    <div style={{ padding: 20 }}>
      <h2>Chunk File Upload</h2>

      <input
        type="file"
        onChange={(e) => uploadFileInChunks(e.target.files[0])}
      />

      <div style={{ marginTop: 20 }}>
        <progress value={progress} max="100" />
        <span> {progress}%</span>
      </div>
    </div>
     </DashboardLayout>
  );
};

export default UploadPage;
