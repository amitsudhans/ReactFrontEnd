import { useEffect, useState } from "react";
import { getQueueHealth } from "../api/upload.api";

const QueueStatus = () => {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    getQueueHealth()
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("Queue not reachable"));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Queue Status</h2>
      <p>{status}</p>
    </div>
  );
};

export default QueueStatus;
