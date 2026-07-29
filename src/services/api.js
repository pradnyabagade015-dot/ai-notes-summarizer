// A relative URL works both through Vite's local proxy and on the deployed
// Vercel domain. Set VITE_API_URL only when using a separately hosted backend.
const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

export const TOKEN_KEY = 'ai_notes_token'
export const USER_KEY = 'ai_notes_user'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY)
  if (!user) return null
  try {
    return JSON.parse(user)
  } catch {
    return null
  }
}

export const setStoredUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user))

let onUnauthorizedCallback = null
export const setOnUnauthorizedCallback = (cb) => {
  onUnauthorizedCallback = cb
}

const request = async (endpoint, options = {}) => {
  const token = getToken()
  const headers = { ...options.headers }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const isFormData = options.body instanceof FormData
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const config = {
    ...options,
    headers,
  }

  if (!isFormData && options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body)
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config)
  } catch (err) {
    throw new Error('Unable to connect to the backend server. Please ensure it is running.', { cause: err })
  }

  let data
  try {
    data = await response.json()
  } catch {
    data = { success: false, message: 'Invalid response from server' }
  }

  if (response.status === 401) {
    // Clear invalid or expired token from localStorage automatically
    removeToken()
    if (onUnauthorizedCallback) {
      onUnauthorizedCallback()
    }
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`)
  }

  return data
}

export const apiLogin = async (credentials) => {
  const data = await request('/auth/login', {
    method: 'POST',
    body: credentials,
  })
  if (data.token) setToken(data.token)
  if (data.user) setStoredUser(data.user)
  return data
}

export const apiRegister = async (userData) => {
  const data = await request('/auth/register', {
    method: 'POST',
    body: userData,
  })
  if (data.token) setToken(data.token)
  if (data.user) setStoredUser(data.user)
  return data
}

export const apiGetProfile = async () => {
  const data = await request('/auth/profile', {
    method: 'GET',
  })
  if (data.user) setStoredUser(data.user)
  return data
}

export const apiUploadNote = async (payload) => {
  if (payload instanceof FormData) {
    return request('/notes/upload', {
      method: 'POST',
      body: payload,
    })
  }
  return request('/notes/upload', {
    method: 'POST',
    body: payload,
  })
}

export const apiGetNotes = async () => {
  return request('/notes', {
    method: 'GET',
  })
}

export const apiGetNoteById = async (id) => {
  return request(`/notes/${id}`, {
    method: 'GET',
  })
}

export const apiAskAboutNote = (id, payload) => request(`/notes/${id}/chat`, { method: 'POST', body: payload })

export const apiDeleteNote = async (id) => {
  return request(`/notes/${id}`, {
    method: 'DELETE',
  })
}

export const apiCreateSummary = async (summaryData) => {
  return request('/summaries', {
    method: 'POST',
    body: summaryData,
  })
}

export const apiGetSummaries = async (noteId) => {
  const query = noteId ? `?noteId=${encodeURIComponent(noteId)}` : ''
  return request(`/summaries${query}`, {
    method: 'GET',
  })
}

export const apiGetSummaryById = async (id) => {
  return request(`/summaries/${id}`, {
    method: 'GET',
  })
}

export const apiGetFlashcardsByNoteId = async (noteId) => {
  return request(`/flashcards/${noteId}`, {
    method: 'GET',
  })
}

export const apiGenerateFlashcardsForNote = async (noteId) => {
  return request('/flashcards/generate', {
    method: 'POST',
    body: { noteId },
  })
}

export const apiGetMCQsByNoteId = async (noteId) => {
  return request(`/mcqs/${noteId}`, {
    method: 'GET',
  });
};

export const apiGetStudyPlans = () => request('/study-plans', { method: 'GET' })

export const apiCreateStudyPlan = (plan) => request('/study-plans', { method: 'POST', body: plan })

export const apiUpdateStudyPlan = (id, plan) => request(`/study-plans/${id}`, { method: 'PATCH', body: plan })

export const apiDeleteStudyPlan = (id) => request(`/study-plans/${id}`, { method: 'DELETE' })

export const apiRequestPasswordReset = (email) => request('/auth/forgot-password', { method: 'POST', body: { email } })

export const apiResetPassword = (token, password) => request(`/auth/reset-password/${token}`, { method: 'POST', body: { password } })

export const apiGenerateContent = (payload) => request('/content-generator', { method: 'POST', body: payload })

export const apiCreatePremiumOrder = () => request('/payments/premium-order', { method: 'POST' })

export const apiVerifyRazorpayPayment = (payload) => request('/payments/verify', { method: 'POST', body: payload })

export const apiGetAccountOverview = () => request('/account/overview', { method: 'GET' })
export const apiCreateSupportTicket = (payload) => request('/support/tickets', { method: 'POST', body: payload })
export const apiGetSupportTickets = () => request('/support/tickets', { method: 'GET' })
export const apiCreateFeedback = (payload) => request('/support/feedback', { method: 'POST', body: payload })

export const apiGenerateAndGetMCQsForNote = async (noteId) => {
  return request(`/mcqs/${noteId}`, {
    method: 'POST',
    body: {},
  })
};
