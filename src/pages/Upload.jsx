import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

const CHUNK = 5 * 1024 * 1024;

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);

  const upload = async () => {
    const total = Math.ceil(file.size / CHUNK);
    const id = file.name + file.size;

    for (let i = 0; i < total; i++) {
      await fetch(
        `http://localhost:5000/api/upload/chunk?fileId=${id}&index=${i}`,
        { method: "POST", body: file.slice(i * CHUNK, (i + 1) * CHUNK) }
      );
      setProgress(Math.round(((i + 1) / total) * 100));
    }

    await fetch("http://localhost:5000/api/upload/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileId: id,
        filename: file.name,
        totalChunks: total,
        title,
        size: file.size,
      }),
    });

    alert("Upload complete");
  };

  return (
      <DashboardLayout>
    <div>
      <h2>Upload Video</h2>
      <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={upload}>Upload</button>
      <p>{progress}%</p>
    </div>
    </DashboardLayout>
  );
}
