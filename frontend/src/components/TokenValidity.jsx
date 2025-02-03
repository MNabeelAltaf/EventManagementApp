export const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };
  
  export const getAuthHeaders = () => {
    const token = getAuthToken();
    
    if (!token) {
      return null;
    }
  
    return {
      'Authorization': `Bearer ${token}`,  
    };
  };
  

  