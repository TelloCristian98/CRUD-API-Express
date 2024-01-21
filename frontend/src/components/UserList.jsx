import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

const UserList = ({ onSelectUser }) => {
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000');
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();

        const socket = io('http://localhost:5000');
        socket.on('newUser', (newUser) => {
            setUsers((prevUsers) => [...prevUsers, newUser]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center">
            <ul className="list-disc">
                {users.map((user) => (
                    <li
                        className="text-blue-500 hover:underline cursor-pointer"
                        key={user.id}
                        onClick={() => onSelectUser(user)}
                    >
                        {user.firstName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

UserList.propTypes = {
    onSelectUser: PropTypes.func.isRequired,
};

export default UserList;