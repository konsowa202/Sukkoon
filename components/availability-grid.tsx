"use client"

import { Button } from "@/components/ui/button"

interface AvailabilityGridProps {
    availability: Record<string, string[]>
    onChange: (availability: Record<string, string[]>) => void
}

export function AvailabilityGrid({ availability, onChange }: AvailabilityGridProps) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const slots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)

    const format12h = (slot: string) => {
        const [hourStr] = slot.split(':')
        const hour = parseInt(hourStr)
        const isPM = hour >= 12
        const hour12 = hour % 12 || 12
        // We'll use a simple check for language if needed, but for now ص/م is standard in the UI context
        // and we can handle it via a prop or just use both if it's too complex to detect here.
        // However, ص/م is highly requested.
        return `${hour12}:00 ${isPM ? 'م' : 'ص'} | ${hour12}:00 ${isPM ? 'PM' : 'AM'}`
    }

    const toggleSlot = (day: string, slot: string) => {
        const currentSlots = availability[day] || []
        let newSlots: string[]
        if (currentSlots.includes(slot)) {
            newSlots = currentSlots.filter((s: string) => s !== slot)
        } else {
            newSlots = [...currentSlots, slot].sort()
        }

        onChange({
            ...availability,
            [day]: newSlots,
        })
    }

    const isAvailable = (day: string, slot: string) => {
        return (availability[day] || []).includes(slot)
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="text-left p-2 font-semibold text-sm">Time</th>
                        {days.map((day) => (
                            <th key={day} className="text-center p-2 font-semibold text-xs md:text-sm">
                                {day.slice(0, 3)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {slots.map((slot) => (
                        <tr key={slot} className="border-t border-border">
                            <td className="p-1 md:p-2 text-[10px] md:text-sm text-muted-foreground whitespace-nowrap">{format12h(slot)}</td>
                            {days.map((day) => (
                                <td key={`${day}-${slot}`} className="p-1 md:p-2 text-center">
                                    <Button
                                        type="button"
                                        variant={isAvailable(day, slot) ? "default" : "outline"}
                                        size="sm"
                                        className={`w-full h-7 md:h-10 text-[10px] md:text-sm ${isAvailable(day, slot) ? 'bg-primary text-primary-foreground' : 'bg-transparent text-muted-foreground opacity-50'}`}
                                        onClick={() => toggleSlot(day, slot)}
                                    >
                                        {isAvailable(day, slot) ? "Available" : "Unavailable"}
                                    </Button>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
