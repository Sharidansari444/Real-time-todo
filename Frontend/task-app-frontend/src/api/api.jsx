const BASE_URL = "http://localhost:5000/api";

export async function loginUser(data) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function registerUser(data) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function getTasks(token) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function createTask(data, token) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTask(id, data, token) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTask(id, token) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getLogs(token) {
  const res = await fetch(`${BASE_URL}/tasks/logs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
