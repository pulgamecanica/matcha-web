import { PublicUser } from '@/types/user';

type Props = {
  viewers: PublicUser[];
  views: PublicUser[];
};

export function ProfileViews({ viewers, views }: Props) {
  return (
    <div className="mt-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold">👁️ People Who Viewed You</h3>
        {viewers.length === 0 ? (
          <p className="text-sm text-gray-500">No one has viewed your profile yet.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {viewers.map((user) => (
              <li key={user.id}>
                👤 {user.first_name} {user.last_name} ({user.username})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold">🧭 Profiles You've Viewed</h3>
        {views.length === 0 ? (
          <p className="text-sm text-gray-500">You haven’t viewed any profiles yet.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {views.map((user) => (
              <li key={user.id}>
                📌 {user.first_name} {user.last_name} ({user.username})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
