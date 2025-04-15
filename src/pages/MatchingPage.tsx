import {
    Box,
    Button,
    Checkbox,
    Chip,
    CircularProgress,
    Container,
    FormControlLabel,
    Paper,
    Slider,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MatchFilters } from "@/types/match";
import { discoverMatches } from "@/api/match";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function MatchingPage() {
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    const [useDistance, setUseDistance] = useState(true);
    const [maxDistance, setMaxDistance] = useState(50);

    const [useAgeRange, setUseAgeRange] = useState(true);
    const [ageRange, setAgeRange] = useState<[number, number]>([18, 35]);

    const [useFame, setUseFame] = useState(true);
    const [fameRating, setFameRating] = useState(50);

    const [useTags, setUseTags] = useState(true);
    const [tags, setTags] = useState<string[]>([]);
    const [inputTag, setInputTag] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLatitude(pos.coords.latitude);
                setLongitude(pos.coords.longitude);
            },
            (err) => console.error("Location error:", err)
        );
    }, []);

    const handleAddTag = () => {
        if (inputTag && !tags.includes(inputTag)) {
            setTags([...tags, inputTag]);
            setInputTag("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const handleSearch = async () => {
        const filters: MatchFilters = {
            latitude: latitude ?? undefined,
            longitude: longitude ?? undefined,
            ...(useDistance && { max_distance_km: maxDistance }),
            ...(useAgeRange && { min_age: ageRange[0], max_age: ageRange[1] }),
            ...(useFame && { min_fame: fameRating }),
            ...(useTags && { tags }),
        };

        const result = await discoverMatches({ setLoading, filters });

        if (result && result.length > 0) {
            toast.success(`Found ${result.length} match${result.length > 1 ? "es" : ""}!`);
            navigate("/matches", { state: { data: result } });
        } else {
            toast.error("No matches found.");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Find Matches
                </Typography>

                {/* Distance */}
                <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                        control={<Checkbox checked={useDistance} onChange={(e) => setUseDistance(e.target.checked)} />}
                        label="Filter by Distance"
                    />
                    <Slider
                        value={maxDistance}
                        onChange={(_, val) => setMaxDistance(val as number)}
                        min={1}
                        max={500}
                        disabled={!useDistance}
                        valueLabelDisplay="auto"
                    />
                    <Typography>Max Distance: {maxDistance} km</Typography>
                </Box>

                {/* Age Range */}
                <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                        control={<Checkbox checked={useAgeRange} onChange={(e) => setUseAgeRange(e.target.checked)} />}
                        label="Filter by Age Range"
                    />
                    <Slider
                        value={ageRange}
                        onChange={(_, val) => setAgeRange(val as [number, number])}
                        min={18}
                        max={100}
                        disabled={!useAgeRange}
                        valueLabelDisplay="auto"
                    />
                    <Typography>
                        Age: {ageRange[0]} - {ageRange[1]}
                    </Typography>
                </Box>

                {/* Fame */}
                <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                        control={<Checkbox checked={useFame} onChange={(e) => setUseFame(e.target.checked)} />}
                        label="Minimum Fame Rating"
                    />
                    <Slider
                        value={fameRating}
                        onChange={(_, val) => setFameRating(val as number)}
                        min={0}
                        max={100}
                        disabled={!useFame}
                        valueLabelDisplay="auto"
                    />
                    <Typography>Fame Rating: {fameRating}</Typography>
                </Box>

                {/* Tags */}
                <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                        control={<Checkbox checked={useTags} onChange={(e) => setUseTags(e.target.checked)} />}
                        label="Match by Tags"
                    />
                    <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                        <TextField
                            value={inputTag}
                            onChange={(e) => setInputTag(e.target.value)}
                            label="Add tag"
                            disabled={!useTags}
                            fullWidth
                        />
                        <Button onClick={handleAddTag} disabled={!useTags}>
                            Add
                        </Button>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {tags.map((tag) => (
                            <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} />
                        ))}
                    </Box>
                </Box>

                <Button variant="contained" fullWidth onClick={handleSearch} disabled={loading}>
                    Search
                </Button>

                {/* Loading */}
                {loading && (
                    <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                        <CircularProgress />
                    </Box>
                )}
            </Paper>
        </Container>
    );
}
