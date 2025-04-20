import { PublicUser } from '@/types/user';

function groupUsersById(users: PublicUser[]) {
  const map = new Map<number, { user: PublicUser; count: number }>();

  for (const user of users) {
    if (map.has(user.id)) {
      map.get(user.id)!.count += 1;
    } else {
      map.set(user.id, { user, count: 1 });
    }
  }

  return Array.from(map.values());
}

type Props = {
  viewers: PublicUser[];
  views: PublicUser[];
};

export function ProfileViews({ viewers, views }: Props) {
  const groupedViewers = groupUsersById(viewers);
  const groupedViews = groupUsersById(views);

  return (
    <div className="mt-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold">👁️ People Who Viewed You</h3>
        {groupedViewers.length === 0 ? (
          <p className="text-sm text-gray-500">No one has viewed your profile yet.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {groupedViewers.map(({ user, count }) => (
              <li key={`viewer_${user.id}`}>
                👤 {user.first_name} {user.last_name} ({user.username}) — <span className="text-gray-600">{count} view{count > 1 ? 's' : ''}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold">🧭 Profiles You've Viewed</h3>
        {groupedViews.length === 0 ? (
          <p className="text-sm text-gray-500">You haven’t viewed any profiles yet.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {groupedViews.map(({ user, count }) => (
              <li key={`viewed_${user.id}`}>
                📌 {user.first_name} {user.last_name} ({user.username}) — <span className="text-gray-600">{count} view{count > 1 ? 's' : ''}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
