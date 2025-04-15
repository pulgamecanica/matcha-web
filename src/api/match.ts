import { MatchFilters, MatchResult } from "@/types/match";
import axiosInstance from "@/api/axios";
import toast from "react-hot-toast";

type DiscoverProps = {
    setLoading: (loading: boolean) => void;
    filters: MatchFilters;
};

export async function discoverMatches({ setLoading, filters }: DiscoverProps) : Promise<MatchResult[]> {

    setLoading(true);

    try {
        const response = await axiosInstance.post<MatchResult[]>("/me/discover", filters);
        setLoading(false);
        return response as unknown as MatchResult[];
    } catch (err: any) {
        toast.error(err.response?.message || "Something went wrong.");
        setLoading(false);
        return []
    }
}