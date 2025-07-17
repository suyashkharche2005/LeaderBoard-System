import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser , setSelectedUser ] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await axios.get('http://localhost:5000/users');
            setUsers(response.data);
        };
        fetchUsers();
    }, []);

    const claimPoints = async (userId) => {
        const response = await axios.post(`http://localhost:5000/claim/${userId}`);
        alert(`Claimed ${response.data.randomPoints} points for ${response.data.user.name}`);
        setUsers(users.map(user => user._id === userId ? response.data.user : user));
    };

    return (
        <div>
            <h1>Leaderboard</h1>
            <select onChange={(e) => setSelectedUser (e.target.value)}>
                <option value="">Select User</option>
                {users.map(user => (
                    <option key={user._id} value={user._id}>{user.name}</option>
                ))}
            </select>
            <button onClick={() => claimPoints(selectedUser )}>Claim Points</button>
            <h2>Rankings</h2>
            <ul>
                {users.map((user, index) => (
                    <li key={user._id}>{index + 1}. {user.name} - {user.points} points</li>
                ))}
            </ul>
        </div>
    );
};

export default App;
