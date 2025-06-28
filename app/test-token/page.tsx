import { testTokenPermissions, fixMissingKeys } from "@/lib/actions";

export default function TestTokenPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Token Permissions Test</h1>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Token Permissions</h2>
          <form action={testTokenPermissions}>
            <button 
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Test Permissions
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Fix Missing Keys</h2>
          <p className="text-gray-600 mb-4">
            This will fix any existing comments or likes that are missing _key properties in Sanity Studio.
          </p>
          <form action={fixMissingKeys}>
            <button 
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Fix Missing Keys
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 