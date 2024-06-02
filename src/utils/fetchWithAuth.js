export async function fetchWithAuth(url, options = {}) {
    const res = await fetch(url, options);
  
    if (res.status === 401) {
      window.location.href = '/auth/signin'; 
    }
  
    return res.json();
  }
  