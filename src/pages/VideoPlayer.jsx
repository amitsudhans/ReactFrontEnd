import { useParams } from "react-router-dom";

export default function VideoPlayer() {
  const { id } = useParams();

  return (
    <video width="100%" controls>
      <source
        src={`http://localhost:5000/api/videos/${id}/stream`}
        type="video/mp4"
      />
    </video>
  );
}
