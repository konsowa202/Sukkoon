"use client"

import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
    const phoneNumber = "201227390041"
    const whatsappUrl = `https://wa.me/${phoneNumber}`

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 animate-bounce group"
            aria-label="Contact support on WhatsApp"
        >
            <MessageCircle className="w-8 h-8 fill-current" />
            <span className="absolute right-16 bg-white text-black text-xs font-bold py-1 px-3 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border">
                الدعم السريع | Quick Support
            </span>
        </a>
    )
}
