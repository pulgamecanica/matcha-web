import { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
  Slider,
  Typography,
  Button,
} from "@mui/material";
import { MatchFilters } from "@/types/match";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useUserMe } from "@/hooks/useUserMe";
import { DistanceMap } from "@/components/location/DistanceMap";
import { TagsInput } from '@components/forms/TagsInput';

type FilterPanelProps = {
  onSearch: (filters: MatchFilters) => void;
  initialFilters?: MatchFilters | null;
};

export function FilterPanel({ onSearch, initialFilters }: FilterPanelProps) {
  const { location } = useUserMe();
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [useDistance, setUseDistance] = useState(true);
  const [maxDistance, setMaxDistance] = useState(1);

  const [useAgeRange, setUseAgeRange] = useState(true);
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 35]);

  const [useFame, setUseFame] = useState(true);
  const [fameRating, setFameRating] = useState(0);

  const [useTags, setUseTags] = useState(true);

  const [tags, setTags] = useState<string[]>([]);

  const [showAdvanced, setShowAdvanced] = useState(() => {
    return localStorage.getItem("showAdvancedSearch") === "true";
  });

  useEffect(() => {
    if (initialFilters) {
      setMaxDistance(initialFilters.location?.max_distance_km || 1);
      setAgeRange([initialFilters.min_age || 18, initialFilters.max_age || 35]);
      setFameRating(initialFilters.min_fame || 0);
      setTags(initialFilters.tags || []);
    }
  }, [initialFilters]);

  useEffect(() => {
    if (!useDistance) return;
    if (!location || !location.latitude || !location.longitude) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
        },
        (err) => console.error("Location error:", err)
      );
    } else {
      setLatitude(parseFloat(location.latitude as string));
      setLongitude(parseFloat(location.longitude as string));
    }
  }, [useDistance, location]);

  const handleSubmit = () => {
    const filters: MatchFilters = {};

    if (latitude !== null && longitude !== null && useDistance) {
      filters.location = {
        latitude,
        longitude,
        max_distance_km: maxDistance,
      };
    }

    if (useAgeRange) {
      filters.min_age = ageRange[0];
      filters.max_age = ageRange[1];
    }

    if (useFame) {
      filters.min_fame = fameRating;
    }

    if (useTags) {
      filters.tags = tags;
    }

    onSearch(filters);
  };

  return (
    
    <Paper className="p-6 mb-4 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white" elevation={3}>
      <Box className="flex items-center justify-between">
      <Typography variant="h5">Advanced Search</Typography>
      <Button
        size="small"
        onClick={() => {
          const next = !showAdvanced;
          setShowAdvanced(next);
          localStorage.setItem("showAdvancedSearch", String(next));
        }}
        startIcon={showAdvanced ? <ExpandLess /> : <ExpandMore />}
      >
        {showAdvanced ? "Hide" : "Show"}
      </Button>
    </Box>

    {showAdvanced && (
      <>
        <FormControlLabel
          control={<Checkbox checked={useDistance} onChange={(e) => setUseDistance(e.target.checked)} />}
          label="Filter by Distance"
        />
        <Slider value={maxDistance} onChange={(_, val) => setMaxDistance(val as number)} min={1} max={500} disabled={!useDistance} valueLabelDisplay="auto" />
        <Typography>Max Distance: {maxDistance} km</Typography>

        {useDistance && latitude !== null && longitude !== null && (
          <DistanceMap latitude={latitude} longitude={longitude} radiusKm={maxDistance} />
        )}
        
        <FormControlLabel
          control={<Checkbox checked={useAgeRange} onChange={(e) => setUseAgeRange(e.target.checked)} />}
          label="Filter by Age Range"
        />
        <Slider value={ageRange} onChange={(_, val) => setAgeRange(val as [number, number])} min={18} max={100} disabled={!useAgeRange} valueLabelDisplay="auto" />
        <Typography>Age: {ageRange[0]} - {ageRange[1]}</Typography>

        <FormControlLabel
          control={<Checkbox checked={useFame} onChange={(e) => setUseFame(e.target.checked)} />}
          label="Minimum Fame"
        />
        <Slider value={fameRating} onChange={(_, val) => setFameRating(val as number)} min={0} max={100} disabled={!useFame} valueLabelDisplay="auto" />
        <Typography>Fame Rating: {fameRating}</Typography>

        <FormControlLabel
          control={<Checkbox checked={useTags} onChange={(e) => setUseTags(e.target.checked)} />}
          label="Match by Tags"
        />

        <TagsInput
          value={tags}
          onChange={setTags}
          disabled={!useTags}
        />

        <Button variant="contained" fullWidth onClick={handleSubmit} className="mt-2">
          Search
        </Button>
      </>
    )}
    </Paper>
  );
}
