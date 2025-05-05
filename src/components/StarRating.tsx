import { useState } from "react";
import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StarRating() {
  const [rating, setRating] = useState(0); // Current selected rating
  const [submitted, setSubmitted] = useState(false); // Submission state

  const handleRating = (value: number) => {
    setRating(value); // Update the rating when a star is clicked
  };

  const handleSubmit = () => {
    if (rating === 0) return; // Prevent submission if no rating is selected
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false); // Reset submission state
      setRating(0); // Reset rating after showing the message
    }, 2000); // Show "Rated!" message for 2 seconds
  };

  return (
    <div className="flex flex-row items-center w-fit gap-6 mb-6 align-middle">
      {/* Star Rating */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <StarIcon
            key={value}
            className={`w-6 h-6 cursor-pointer transition ${
              value <= rating ? "fill-primary" : "fill-muted stroke-muted-foreground"
            } hover:fill-primary-foreground`}
            onClick={() => handleRating(value)}
          />
        ))}
      </div>

      {/* Submit Button */}
      <Button
        variant="outline"
        onClick={handleSubmit}
        disabled={submitted || rating === 0}
        className="w-40"
      >
        {submitted ? "Rated!" : "Submit Rating"}
      </Button>
    </div>
  );
}
