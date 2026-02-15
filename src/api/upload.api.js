const API_URL = "http://localhost:5000/api";

export const uploadChunk = async (formData) => {
  return fetch(`${API_URL}/importcsv/upload-chunk`, {
    method: "POST",
    body: formData,
  });
};

export const getQueueHealth = async () => {
  return fetch(`${API_URL}/queue/health`);
};
