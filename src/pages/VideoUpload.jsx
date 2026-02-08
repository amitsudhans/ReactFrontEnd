import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

const VideoUploadPage = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadVideo = async () => {
    if (!file) return alert("Select a video first");

    setUploading(true);

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const fileId = `${file.name}-${file.size}`;

    let startChunk = Number(localStorage.getItem(fileId)) || 0;

    for (let i = startChunk; i < totalChunks; i++) {
      const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);

      await fetch(
        `http://localhost:5000/api/upload/chunk?fileId=${fileId}&chunkIndex=${i}`,
        {
          method: "POST",
          body: chunk,
        }
      );

      localStorage.setItem(fileId, i + 1);
      setProgress(Math.round(((i + 1) / totalChunks) * 100));
    }

    localStorage.removeItem(fileId);

    const res = await fetch("http://localhost:5000/api/upload/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileId,
        fileName: file.name,
        totalChunks,
      }),
    });

    const data = await res.json();
    setVideoUrl(`http://localhost:5000${data.videoUrl}`);
    setUploading(false);
  };

  return (
    <DashboardLayout>
    <div style={{ padding: 30, maxWidth: 700 }}>
      <h2>🎬 Video Upload (Chunk + Resume)</h2>

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={uploadVideo} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Video"}
      </button>

      <div style={{ marginTop: 20 }}>
        <strong>Progress:</strong> {progress}%
        <div
          style={{
            width: "100%",
            height: 10,
            background: "#ddd",
            marginTop: 5,
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "green",
            }}
          />
        </div>
      </div>

      {videoUrl && (
        <div style={{ marginTop: 30 }}>
          <h3>▶ Streamed Video</h3>
          <video width="100%" controls>
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      )}
    </div>
      </DashboardLayout>
  );
};

export default VideoUploadPage;
