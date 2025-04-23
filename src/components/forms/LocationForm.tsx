import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Location } from '@/types/location';
import axiosInstance from '@/api/axios';
import { LocationEditor } from '@/components/location/LocationEditor';
import { useUserMe } from '@/hooks/useUserMe';

type Props = {
  initialLocation: Location | null;
  onSuccess: () => void;
};

export function LocationForm({ initialLocation, onSuccess }: Props) {
  const [lat, setLat] = useState(initialLocation?.latitude || 48.8566);
  const [lng, setLng] = useState(initialLocation?.longitude || 2.3522);
  const [loading, setLoading] = useState(false);
  const { setLocationManually, location } = useUserMe();

  useEffect(() => {
    if (!location || !loading) return;
  
    const updateLocation = async () => {
      try {
        await axiosInstance.post<Location>('/me/location', {
          latitude: location.latitude,
          longitude: location.longitude,
          city: location.city,
          country: location.country,
        });
        toast.success('Location updated!');
        onSuccess();
      } catch (err) {
        toast.error('Failed to update location');
      }
    };
  
    updateLocation();
    setLoading(false);
  }, [location, loading]);
  
  const normalizeLoc = (lon: string): string => {
    const numLon = parseFloat(lon);
    return String(((numLon + 180) % 360 + 360) % 360 - 180);
  };

  
  const handleSubmit = async () => {
    try {
      setLocationManually({latitude: normalizeLoc(lat as string), longitude: normalizeLoc(lng as string)} as unknown as Location);
      setLoading(true)
    } catch {
      toast.error('Failed to update location');
    }
  };

  return (
    <div>
      <div className="h-64 mb-4 rounded overflow-hidden border dark:border-gray-700">
        <LocationEditor lat={lat as number} lng={lng as number} onChange={(lat, lng) => {
          setLat(lat);
          setLng(lng);
        }} />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 w-full"
        >
          Save Location
        </button>
      </div>
    </div>
  );
}
