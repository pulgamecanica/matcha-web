import { Grid } from "@mui/material";
import { MatchCard } from "./MatchCard";
import { SortSelector } from "./SortSelector";
import { MatchResult } from "@/types/match";
import { SortType } from "@/pages/MatchingPage";
import { useEffect, useState } from "react";
import { NoMatches } from "./NoMatches";

type MatchResultsProps = {
  matches: MatchResult[];
  sort: SortType;
  onSortChange: (sort: SortType) => void;
  loading: boolean;
};

export function MatchResults({ matches, sort, onSortChange, loading }: MatchResultsProps) {
  const [sortedMatches, setSortedMatches] = useState<MatchResult[]>([]);

  useEffect(() => {
    const sorted = [...matches].sort((a, b) =>
      parseFloat(b.score[sort] as string) - parseFloat(a.score[sort] as string)
    );
    setSortedMatches(sorted);
  }, [matches, sort]);

  if (loading) return;

  if (!sortedMatches || sortedMatches.length === 0) {
    return <NoMatches />;
  }

  return (
    <>
      <SortSelector value={sort} onChange={onSortChange} />
      <Grid container spacing={3}>
        {sortedMatches.map((match) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={match.user.username}>
            <MatchCard match={match} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
