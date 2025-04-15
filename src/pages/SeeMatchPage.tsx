import {
    Card,
    CardContent,
    CardMedia,
    Container,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useLocation, useNavigate } from "react-router-dom";
import { MatchResult } from "@/types/match";
import { useEffect } from "react";

export function MatchesPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const matches: MatchResult[] = location.state?.data;
    console.log(matches)
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
                    <Grid key={match.user.username}>
                        <Card>
                            {match.user.pictures[0]?.url && (
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={match.user.pictures[0]?.url}
                                    alt={match.user.username}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6">{match.user.username}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Age: {match.user.birth_year} | Fame: {match.score.fame_score}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
