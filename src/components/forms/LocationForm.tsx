import { useState } from 'react';
import toast from 'react-hot-toast';
import { Location } from '@/types/location';
import axiosInstance from '@/api/axios';
import { LocationEditor } from '@/components/location/LocationEditor';

type Props = {
  initialLocation: Location | null;
  onSuccess: () => void;
};

export function LocationForm({ initialLocation, onSuccess }: Props) {
  const [lat, setLat] = useState(initialLocation?.latitude || 48.8566);
  const [lng, setLng] = useState(initialLocation?.longitude || 2.3522);
  const [city, setCity] = useState(initialLocation?.city || '');
  const [country, setCountry] = useState(initialLocation?.country || '');

  const handleSubmit = async () => {
    try {
      await axiosInstance.post('/me/location', {
        latitude: lat,
        longitude: lng,
        city,
        country,
      });
      toast.success('Location updated!');
      onSuccess();
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

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200">City</label>
          <input
            className="w-full mt-1 p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200">Country</label>
          <input
            className="w-full mt-1 p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
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
