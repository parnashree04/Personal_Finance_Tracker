import { useEffect, useState } from 'react';

const useUser = () => {
  const [user, setUser] = useState({
    name: 'FloStack User',
    email: ''
  });

  useEffect(() => {
    fetch('http://localhost/Personal_Finance_Tracker/api/user.php', {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser({
            name: data.name || 'FloStack User',
            email: data.email || ''
          });
        }
      })
      .catch((error) => {
        console.error('Failed to load user:', error);
      });
  }, []);

  return user;
};

export default useUser;