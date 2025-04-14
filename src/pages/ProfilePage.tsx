import { useUserData } from '@/hooks/useUserData'

export function ProfilePage() {
  const { user, loading, error } = useUserData()

  if (loading) return <div className="text-center mt-8">Loading...</div>
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>
  if (!user) return <div className="text-center mt-8">No user data available.</div>

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow bg-dark space-y-4">
      <h1 className="text-2xl font-bold text-center">Profile</h1>

      <div>
        <strong>Username:</strong> {user.username}
      </div>
      <div>
        <strong>Email:</strong> {user.email}
      </div>
      <div>
        <strong>First Name:</strong> {user.first_name}
      </div>
      <div>
        <strong>Last Name:</strong> {user.last_name}
      </div>
      <div>
        <strong>Gender:</strong> {user.gender}
      </div>
      <div>
        <strong>Sexual Preferences:</strong> {user.sexual_preferences}
      </div>
      <div>
        <strong>Biography:</strong> {user.biography || 'N/A'}
      </div>

      {/* Optional: Tags */}
      {user.tags?.length > 0 && (
        <div>
          <strong>Tags:</strong>{' '}
          <span className="flex flex-wrap gap-2 mt-1">
            {user.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {tag.name}
              </span>
            ))}
          </span>
        </div>
      )}

      {/* Optional: Pictures */}
      {user.pictures?.length > 0 && (
        <div>
          <strong>Pictures:</strong>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {user.pictures.map((pic) => (
              <img
                key={pic.id}
                src={pic.url}
                alt="User pic"
                className="w-full h-24 object-cover rounded"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
