import axios from "axios";

export const summarisePost = async (text) => {
  const response = await fetch("http://127.0.0.1:8000/summarize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contexts: [text],
    }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const querySummary = async ({ context, question }) => {
  const response = await fetch("http://127.0.0.1:8000/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contexts: [context],
      questions: [question],
    }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const getDocHistory = async () => {
  const response = await fetch("http://127.0.0.1:8000/documents", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const uploadDocumentFile = async ({ file }) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    "http://127.0.0.1:8000/document",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  if (!response.data) {
    throw new Error("Failed to upload file");
  }
  return response.data;
};

export const uploadTextDoc = async ({ text }) => {
  const formData = new FormData();
  formData.append("text", text);
  const response = await axios.post(
    "http://127.0.0.1:8000/document",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  if (!response.data) {
    throw new Error("Failed to upload file");
  }
  return response.data;
};
