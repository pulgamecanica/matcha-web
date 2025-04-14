import { Location } from '@/types/location';

type Props = {
  location: Location | null;
};

export function LocationCard({ location }: Props) {
  if (!location) return null;

  return (
    <div className="mt-4 text-sm text-gray-500">
      📍 Last seen in <strong>{location.city}, {location.country}</strong> on{' '}
      {new Date(location.recorded_at).toLocaleString()}
    </div>
  );
}
