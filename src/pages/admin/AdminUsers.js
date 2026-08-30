import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AdminHeader } from './AdminDashboard';
import { format } from 'date-fns';

const AdminUsers = () => {
  const { currentUser, userProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || userProfile?.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    loadUsers();
  }, [currentUser, userProfile, navigate]);

  const loadUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    } catch (error) {
      console.warn('Firestore read skipped:', error.code || error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    if (userId === currentUser.uid) {
      showToast('Cannot change your own role');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      showToast('User role updated successfully');
      loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      showToast('Error updating user role');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <AdminHeader currentPath="/admin/users" onLogout={handleLogout} userProfile={userProfile} />

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Users</h1>
          <p>Manage registered users</p>
        </div>

        <div className="admin-panel">
          <div className="panel-body">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td><strong>{user.name}</strong></td>
                    <td>{user.email}</td>
                    <td>{user.phone || '—'}</td>
                    <td>
                      <span className={`status-badge ${user.role === 'admin' ? 'status-confirmed' : 'status-pending'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {user.createdAt && format(new Date(user.createdAt), 'dd MMM yyyy')}
                    </td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                        style={{ padding: '6px', fontSize: '12px' }}
                        disabled={user.id === currentUser.uid}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-3)' }}>
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
