import {
    Card,
    CardContent,
    CardMedia,
    Chip,
    Container,
    Typography,
    Box,
    LinearProgress,
    Grid,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { MatchResult } from "@/types/match";
import { useEffect } from "react";
import { Circle } from '@mui/icons-material';
import { green, red } from '@mui/material/colors';


export function MatchesPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const matches: MatchResult[] = location.state?.data;

    useEffect(() => {
        if (!matches) {
            navigate("/");
        }
    }, [matches, navigate]);

    const calculateAge = (birthYear: string) => {
        const year = parseInt(birthYear, 10);
        return new Date().getFullYear() - year;
    };

    if (!matches || matches.length === 0) {
        return (
            <Container maxWidth="sm" sx={{ py: 6 }}>
                <Typography variant="h5" align="center" className="text-gray-900 dark:text-white">
                    No matches to show.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }} className="dark:bg-gray-900">
            <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white">
                Your Matches
            </Typography>

            <Grid container spacing={3}>
                {matches.map((match) => {
                    const { user, score } = match;
                    const profilePic = user.pictures.find((p) => p.is_profile === "t")?.url;
                    const age = calculateAge(user.birth_year);
                    const famePercentage = (parseFloat(score.fame_score) / 20) * 100;
                    const barColor = famePercentage >= 50 ? 'success.main' : 'error.main';

                    return (
                        <Grid key={user.username}>
                            <Card className="bg-white dark:bg-gray-800 dark:text-white">
                                {profilePic ? (
                                    <CardMedia
                                        className="bg-white dark:bg-gray-800"
                                        component="img"
                                        height="200"
                                        image={profilePic}
                                        alt={user.username}
                                    />
                                ) : (
                                    <Box
                                        className="bg-white dark:bg-gray-800 text-white"
                                        height={200}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Typography variant="body2">No Image</Typography>
                                    </Box>
                                )}

                                <CardContent className="bg-white dark:bg-gray-800 text-white">
                                    <Typography variant="h6" className="text-gray-900 dark:text-white">
                                        {user.first_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" className="text-gray-900 dark:text-white">
                                        @{user.username}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} className="text-gray-900 dark:text-white">
                                        Age: {age}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} className="text-gray-900 dark:text-white">
                                        Popularity:
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={famePercentage}
                                        sx={{
                                            mt: 1,
                                            height: 8,
                                            borderRadius: 2,
                                            backgroundColor: "grey.300",
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: barColor,
                                            },
                                        }}
                                    />
                                    <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1 }}>
                                        <Circle
                                            sx={{
                                                fontSize: 10,
                                                color: user.online_status ? green[500] : red[500],
                                            }}
                                        />
                                        <Typography variant="body2" color="text.secondary" className="text-gray-900 dark:text-white">
                                            {user.online_status ? 'Online' : 'Offline'}
                                        </Typography>
                                    </Box>

                                    {user.tags?.length > 0 && (
                                        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }} className="dark:bg-gray-800">
                                            {user.tags.map((tag) => (
                                                <Chip sx={{
                                                    padding: 2,
                                                }} key={tag.id} label={tag.name} size="small" className="dark:text-white" />
                                            ))}
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
}
