import { useState } from 'react';
import { setDate } from '@/api/ScheduledDate';
import { Input, TextField, Button } from '@mui/material';
import { useUserMe } from '@/hooks/useUserMe';
import { ScheduledDate } from '@/types/scheduledDate';

type Props = {
  onClose: () => void;
  username: string;
};

export function DatesModal({ onClose, username }: Props) {
  const [scheduledAt, setScheduledAt] = useState('');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const { addScheduledDate } = useUserMe();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await setDate({
      username,
      scheduled_at: scheduledAt,
      location: location || undefined,
      note: note || undefined,
    });

    addScheduledDate({...(result as unknown as ScheduledDate), partner_username: username});

    setLoading(false);
    if (result) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-lg relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white text-center w-full">❤️ Set Your Date</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Scheduled At
            </label>
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              required
              fullWidth
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Café Luna"
              fullWidth
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Note (Optional)
            </label>
            <TextField
              multiline
              minRows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any special instructions?"
              fullWidth
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={onClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule Date'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}