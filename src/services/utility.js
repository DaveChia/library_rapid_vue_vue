export function clearSessionInstance () {
    localStorage.removeItem('loginstatus');
    localStorage.removeItem('activeuserid');
    localStorage.removeItem('activeusername');
  }