import NavbarWrapper from './_components/layout/NavbarWrapper';
import { Button } from './_components/ui';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <NavbarWrapper />
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Micro SNS</h1>
        <p className="text-gray-700 mb-6">This is a social networking service built with Next.js, Tailwind CSS, and Zustand.</p>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Get Started</h2>
          <p className="text-gray-600 mb-4">
            Join our community to share posts, follow friends, and connect with others.
          </p>
          <div className="flex space-x-4">
            <Button>
              <a href="/auth/signup">Sign Up</a>
            </Button>
            <Button variant="secondary">
              <a href="/auth/signin">Sign In</a>
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Create and share posts with text and images</li>
            <li>Follow other users and see their posts in your feed</li>
            <li>Like and comment on posts</li>
            <li>Search for users and content</li>
            <li>Use hashtags to categorize and discover content</li>
          </ul>
        </div>
      </div>
    </main>
  );
}