import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Container,
    Grid,
    Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { MatchResult } from "@/types/match";
import { useEffect } from "react";

export function MatchesPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const matches: MatchResult[] = location.state?.data;

    useEffect(() => {
        if (!matches) {
            navigate("/");
        }
    }, [matches, navigate]);

    if (!matches || matches.length === 0) {
        return (
            <Container maxWidth="sm" sx={{ py: 6 }}>
                <Typography variant="h5" align="center">
                    No matches to show.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" gutterBottom>
                Your Matches
            </Typography>

            <Grid container spacing={3}>
                {matches.map((match) => (
                    <Grid item xs={12} sm={6} md={4} key={match.user.username}>
                        <Card>
                            {match.image && (
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={match.image}
                                    alt={match.name}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6">{match.user.username}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Age: {match.user.birth_year} | Fame: {match.score.fame_score}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Distance: {match.score.di?.toFixed(1)} km
                                </Typography>
                                {match.tags && match.tags.length > 0 && (
                                    <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {match.tags.map((tag) => (
                                            <Box
                                                key={tag}
                                                sx={{
                                                    bgcolor: "primary.main",
                                                    color: "white",
                                                    px: 1,
                                                    py: 0.25,
                                                    borderRadius: 1,
                                                    fontSize: "0.75rem",
                                                }}
                                            >
                                                {tag}
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
