const API_BASE_URL = 'http://localhost:8000';

async function handleResponse(response) {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || response.statusText);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json().catch(() => null);
}

export async function saveWorkflow(payload) {
  const response = await fetch(`${API_BASE_URL}/workflow/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function startExecution() {
  const response = await fetch(`${API_BASE_URL}/workflow/start`, {
    method: 'POST',
  });

  return handleResponse(response);
}
