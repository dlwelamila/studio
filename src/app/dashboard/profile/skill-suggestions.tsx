'use client';
import { useState, useEffect } from 'react';
import { Lightbulb, Loader, X } from 'lucide-react';

import { suggestSkills, SuggestSkillsOutput } from '@/ai/flows/suggest-skills';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Helper } from '@/lib/data';

type SkillSuggestionsProps = {
  helper: Helper;
};

export function SkillSuggestions({ helper }: SkillSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SuggestSkillsOutput['suggestions']>([]);
  const [loading, setLoading] = useState(true);
  const [visibleSuggestions, setVisibleSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const getSuggestions = async () => {
      setLoading(true);
      try {
        const result = await suggestSkills({ currentSkills: helper.serviceCategories });
        if (result && result.suggestions) {
          setSuggestions(result.suggestions);
          setVisibleSuggestions(result.suggestions.map(s => s.skill));
        }
      } catch (error) {
        console.error('Failed to get skill suggestions:', error);
      } finally {
        setLoading(false);
      }
    };
    // getSuggestions();
    setLoading(false); // Temporarily disable AI call
  }, [helper.serviceCategories]);

  const dismissSuggestion = (skill: string) => {
    setVisibleSuggestions(current => current.filter(s => s !== skill));
  };

  const visibleItems = suggestions.filter(s => visibleSuggestions.includes(s.skill));

  if (loading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    )
  }

  if (visibleItems.length === 0) {
    // Return null or a placeholder if you don't want to show anything when there are no suggestions.
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <span>Growth Suggestions</span>
        </CardTitle>
        <CardDescription>
          Consider adding these skills to unlock more job opportunities.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {visibleItems.map(suggestion => (
          <div key={suggestion.skill} className="relative rounded-lg border p-4">
            <h4 className="font-semibold text-sm mb-1">{suggestion.skill}</h4>
            <p className="text-xs text-muted-foreground pr-6">{suggestion.reason}</p>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => dismissSuggestion(suggestion.skill)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
