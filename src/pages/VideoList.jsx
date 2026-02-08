import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";


export default function VideoList() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/videos")
      .then(res => res.json())
      .then(setVideos);
  }, []);

  return (
    <DashboardLayout>
<div>
  <h2>Uploaded Videos</h2>

  <div className="video-grid">
    {videos.map(v => (
      <div key={v._id} className="video-card">
        <p className="video-title">
          {v.title || "Untitled Video"}
        </p>

        <video className="video-player" controls>
          <source
            src={`http://localhost:5000/uploads/videos/${v.filename}`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    ))}
  </div>
</div>

 
     </DashboardLayout>
  );
}
