'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Input, Button } from '../../_components/ui';
import { useAuthStore } from '../../_store/auth';
import { userApi } from '../../_lib/api';
import { validateEmail, validatePassword } from '../../_lib/utils';

export default function SignUpPageClient() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, login } = useAuthStore();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      router.push('/');
      router.refresh();
    }
  }, [user, router]);

  // If user is already logged in, don't render the component
  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!validateEmail(email)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    if (!validatePassword(password)) {
      setError('비밀번호는 8자 이상, 대/소문자, 숫자를 포함해야 합니다.');
      return;
    }

    setLoading(true);

    try {
      // API call to sign up
      const userData = await userApi.signup({
        email,
        username,
        bio,
        password
      });

      // After signup, log the user in automatically
      const loginResponse = await userApi.login(email, password);

      // Set token in cookie
      Cookies.set('access_token', loginResponse.access_token, { expires: 7, secure: true, sameSite: 'strict' });

      // Update auth store
      login(userData, loginResponse.access_token);

      // Redirect to home page
      router.push('/');
      router.refresh(); // Refresh to update the UI based on auth status
    } catch (err) {
      setError('계정 생성에 실패했습니다. 다시 시도해주세요.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            계정 생성
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                label="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Input
                id="username"
                name="username"
                type="text"
                required
                label="사용자 이름"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <Input
                id="bio"
                name="bio"
                type="text"
                label="자기소개 (선택)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                label="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                이미 계정이 있으신가요? 로그인
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              loading={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              가입하기
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}