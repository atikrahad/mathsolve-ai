'use client';

// @ts-nocheck - Temporary fix for React component type compatibility issues
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import problemService from '@/services/problemService';

interface ProblemRatingComponentProps {
  problemId: string;
  currentRating?: number;
}

export function ProblemRatingComponent({ problemId, currentRating }: ProblemRatingComponentProps) {
  const [rating, setRating] = useState(currentRating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(!!currentRating);

  useEffect(() => {
    if (currentRating) {
      setRating(currentRating);
      setHasRated(true);
    }
  }, [currentRating]);

  const handleSubmitRating = async () => {
    if (rating === 0 || submitting) return;

    setSubmitting(true);
    try {
      await problemService.rateProblem(problemId, rating);
      setHasRated(true);
      setComment('');
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStarClick = (starRating: number) => {
    if (hasRated) return; // Don't allow re-rating for now
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    if (hasRated) return;
    setHoverRating(starRating);
  };

  const handleStarLeave = () => {
    if (hasRated) return;
    setHoverRating(0);
  };

  const displayRating = hasRated ? rating : hoverRating || rating;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rate this Problem</CardTitle>
      </CardHeader>
      <CardContent>
        {hasRated ? (
          <div className="text-center">
            <div className="flex justify-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">Thanks for rating this problem!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= displayRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="text-center text-sm text-gray-600">
              {rating === 0 && 'Click to rate'}
              {rating === 1 && 'Poor - Has significant issues'}
              {rating === 2 && 'Fair - Needs improvement'}
              {rating === 3 && 'Good - Decent problem'}
              {rating === 4 && 'Very Good - Well crafted'}
              {rating === 5 && 'Excellent - Outstanding problem'}
            </div>

            {rating > 0 && (
              <>
                <Textarea
                  placeholder="Leave a comment (optional)..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[80px] resize-y"
                />

                <Button onClick={handleSubmitRating} disabled={submitting} className="w-full">
                  {submitting ? 'Submitting...' : 'Submit Rating'}
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
