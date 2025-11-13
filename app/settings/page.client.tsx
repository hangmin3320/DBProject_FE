'use client';

import { useState } from 'react';
import { Button, Input } from '../_components/ui';
import { useAuthStore } from '../_store/auth';
import { userApi } from '../_lib/api';

export default function SettingsPageClient() {
  const { user, updateProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile'); // profile, password
  
  // Profile state
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setProfileLoading(true);
    setProfileMessage({ type: '', text: '' });

    try {
      const updatedUserData = await userApi.updateUser(user.user_id, { username, bio });
      updateProfile(updatedUserData);
      setProfileMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (error) {
      console.error('Profile update error:', error);
      setProfileMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setProfileLoading(false);
      setTimeout(() => setProfileMessage({ type: '', text: '' }), 3000);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });

    try {
      await userApi.updatePassword(user.user_id, {
        old_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordMessage({ type: 'success', text: 'Password updated successfully' });
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordMessage({ type: 'error', text: 'Failed to change password. Check your current password.' });
    } finally {
      setPasswordLoading(false);
      setTimeout(() => setPasswordMessage({ type: '', text: '' }), 3000);
    }
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
        
        {/* Profile Update Form */}
        {activeTab === 'profile' && user && (
          <form onSubmit={handleProfileUpdate} className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
            
            {profileMessage.text && (
              <div className={`mb-4 rounded-md p-4 ${profileMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <div className="text-sm">{profileMessage.text}</div>
              </div>
            )}
            
            <div className="mb-4">
              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={profileLoading}
              />
            </div>
            
            <div className="mb-6">
              <Input
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                multiline
                disabled={profileLoading}
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" loading={profileLoading}>저장</Button>
            </div>
          </form>
        )}
        
        {/* Password Change Form */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordChange} className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>

            {passwordMessage.text && (
              <div className={`mb-4 rounded-md p-4 ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <div className="text-sm">{passwordMessage.text}</div>
              </div>
            )}
            
            <div className="mb-4">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={passwordLoading}
              />
            </div>
            
            <div className="mb-4">
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={passwordLoading}
              />
            </div>
            
            <div className="mb-6">
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={passwordLoading}
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" loading={passwordLoading}>비밀번호 변경</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}