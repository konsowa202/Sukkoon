"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Star, Loader2 } from "lucide-react"

interface RatingDialogProps {
    isOpen: boolean
    onClose: () => void
    appointmentId: string
    doctorName: string
    onSuccess?: () => void
}

export function RatingDialog({ isOpen, onClose, appointmentId, doctorName, onSuccess }: RatingDialogProps) {
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async () => {
        if (rating === 0) return

        setLoading(true)
        setError(null)

        try {
            const token = localStorage.getItem("sukoon_token")
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    appointmentId,
                    rating,
                    comment
                })
            })

            if (response.ok) {
                if (onSuccess) onSuccess()
                onClose()
            } else {
                const data = await response.json()
                setError(data.error || "Failed to submit review")
            }
        } catch (err) {
            setError("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-card border-none shadow-2xl rounded-3xl p-8 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                <DialogHeader className="text-center pt-2">
                    <DialogTitle className="text-2xl font-black">How was your session?</DialogTitle>
                    <p className="text-muted-foreground mt-2">
                        Rate your experience with <span className="text-primary font-bold">{doctorName}</span>
                    </p>
                </DialogHeader>

                <div className="flex flex-col items-center gap-8 py-8">
                    {/* Star Rating */}
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="transition-all duration-200 transform hover:scale-125"
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    className={`w-10 h-10 ${(hover || rating) >= star
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted-foreground/30 fill-transparent"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="w-full space-y-2">
                        <p className="text-sm font-medium ml-1">Do you have any feedback? (Optional)</p>
                        <Textarea
                            placeholder="Tell us about your session..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="min-h-[120px] rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 resize-none transition-all"
                        />
                    </div>

                    {error && (
                        <div className="text-destructive text-sm font-medium bg-destructive/10 w-full p-3 rounded-xl text-center">
                            {error}
                        </div>
                    )}
                </div>

                <DialogFooter className="sm:justify-center gap-3">
                    <Button variant="ghost" onClick={onClose} className="rounded-full px-8 bg-transparent">
                        Skip for now
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={rating === 0 || loading}
                        className="rounded-full px-12 font-bold shadow-lg shadow-primary/20"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Submit Review
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
