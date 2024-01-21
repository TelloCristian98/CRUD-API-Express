import { useState, useEffect } from 'react';
import UserList from './components/UserList';
import socketIOClient from 'socket.io-client';
import './App.css'

const ENDPOINT = 'http://localhost:5000';

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const UserResponse = await fetch(`${ENDPOINT}`);
        const UserData = await UserResponse.json();
        setUsers(UserData);
      } catch (err) {
        console.error('Error getting the data' ,err.message);
      }
    };
    
    fetchData();

    const socket = socketIOClient(ENDPOINT);

    socket.on('newUser', (newUser) => {
      setUsers((prevUsers) => [...prevUsers, newUser]);
    });
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Users</h1>
      <UserList users={users} onSelectUser={handleSelectUser} />
      <section className="flex flex-col items-center justify-center">
      <h2>{selectedUser ? 'Update User' : 'Delete User'}</h2>
      </section>
    </div>
  );
};

export default App;
