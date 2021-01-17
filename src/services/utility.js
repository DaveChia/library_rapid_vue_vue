//  Function clears all local storages
export function clearSessionInstance () {
    localStorage.removeItem('loginstatus');
    localStorage.removeItem('activeuserid');
    localStorage.removeItem('activeusername');
    localStorage.removeItem('currentUserType');
  }