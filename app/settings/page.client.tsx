'use client';

import { useState } from 'react';
import { Button, Input } from '../_components/ui';
import { useAuthStore } from '../_store/auth';
import { User } from '../types/user';

export default function SettingsPageClient() {
  const { user, updateProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile'); // profile, password
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // In a real app, make an API call to update the profile
    const updatedUser: User = {
      ...user,
      username,
      bio
    };
    
    updateProfile(updatedUser);
    setMessage('Profile updated successfully');
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters long');
      return;
    }
    
    // In a real app, make an API call to update the password
    setMessage('Password updated successfully');
    
    // Clear form and message after 3 seconds
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              프로필 수정
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'password'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('password')}
            >
              비밀번호 변경
            </button>
          </nav>
        </div>
        
        {/* Message */}
        {message && (
          <div className="mb-6 rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">{message}</div>
          </div>
        )}
        
        {/* Profile Update Form */}
        {activeTab === 'profile' && user && (
          <form onSubmit={handleProfileUpdate} className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
            
            <div className="mb-4">
              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <Input
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                multiline
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">저장</Button>
            </div>
          </form>
        )}
        
        {/* Password Change Form */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordChange} className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
            
            <div className="mb-4">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">비밀번호 변경</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}