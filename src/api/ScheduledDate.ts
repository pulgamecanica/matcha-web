import axiosInstance from '@/api/axios';
import { ScheduledDateResponse, SetDatePayload } from '@/types/scheduledDates';
import toast from 'react-hot-toast';

export async function setDate(payload: SetDatePayload): Promise<ScheduledDateResponse | null> {
  try {
    const data  = await axiosInstance.post<ScheduledDateResponse>('/me/dates', payload);

    toast.success('Date successfully scheduled!');
    return data as unknown as ScheduledDateResponse;
  } catch (error) {
    toast.error('Something went wrong while scheduling the date.');
    return null;
  }
}
