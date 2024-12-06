import React from 'react';
import { useUserContext } from './UserContext';

const UserList = () => {
    const { userdata, setUserdata } = useUserContext();

    // Foydalanuvchini o'chirish uchun funksiya
    const handleDelete = (id) => {
        // O'chirishdan oldin tasdiq olish
        if (window.confirm("Are you sure you want to delete this user?")) {
            const updatedUsers = userdata.user.filter(user => user.id !== id);
            setUserdata({
                ...userdata,
                user: updatedUsers,
            });
        }
    };

    return (
        <div>
            <h2>Users List</h2>
            <ul>
                {userdata.user.map((user, index) => (
                    <li key={index}>
                        {user.id}, {user.name} ({user.email}), {user.password}, {user.phone}, {user.address}, {user.country} - {user.role}
                        {user.role === 'user' && (
                            <button
                                onClick={() => handleDelete(user.id)}
                                className="btn btn-danger"
                                style={{ marginLeft: "10px" }}
                            >
                                Delete
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
