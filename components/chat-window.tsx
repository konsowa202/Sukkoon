"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, User, Loader2, Paperclip } from "lucide-react"
import { format } from "date-fns"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface Message {
    id: string
    sender_id?: string
    senderId?: string // Support both formats
    content: string
    file_url?: string
    file_name?: string
    file_type?: string
    created_at?: string
    createdAt?: string
}

interface ChatWindowProps {
    appointmentId: string
    recipientName: string
    recipientImage?: string
    recipientRole: "doctor" | "patient" | "admin"
    onClose?: () => void
}

export function ChatWindow({
    appointmentId,
    recipientName,
    recipientImage,
    recipientRole,
    onClose
}: ChatWindowProps) {
    const { user } = useAuth()
    const { toast } = useToast()
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [uploading, setUploading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("sukoon_token")
            const response = await fetch(`/api/chat?appointmentId=${appointmentId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                setMessages(data)
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 10 * 1024 * 1024) {
            toast({
                variant: "destructive",
                title: "File too large",
                description: "Max file size is 10MB"
            })
            return
        }

        setUploading(true)
        try {
            const token = localStorage.getItem("sukoon_token")
            const formData = new FormData()
            formData.append("file", file)
            formData.append("folder", "chat-attachments")
            formData.append("bucket", "payment-proofs")

            const response = await fetch("/api/upload", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            })

            const data = await response.json()
            if (response.ok) {
                // Send a message with the file
                const sendRes = await fetch("/api/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        appointmentId,
                        content: "", // Send empty content explicitly
                        fileUrl: data.url,
                        fileName: file.name,
                        fileType: file.type
                    })
                })

                if (sendRes.ok) {
                    const msgData = await sendRes.json()
                    setMessages(prev => [...prev, msgData])
                    toast({
                        title: "File sent",
                        description: `Successfully sent ${file.name}`
                    })
                } else {
                    const errorData = await sendRes.json()
                    throw new Error(errorData.error || "Failed to send message")
                }
            } else {
                throw new Error(data.error || "Upload failed")
            }
        } catch (error: any) {
            console.error("File upload failed:", error)
            toast({
                variant: "destructive",
                title: "Attachment failed",
                description: error.message || "An error occurred while attaching the file"
            })
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    // Poll for new messages every 3 seconds
    useEffect(() => {
        fetchMessages()
        const interval = setInterval(fetchMessages, 3000)
        return () => clearInterval(interval)
    }, [appointmentId])

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth"
            })
        }
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || sending) return

        setSending(true)
        try {
            const token = localStorage.getItem("sukoon_token")
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    appointmentId,
                    content: newMessage
                })
            })

            if (response.ok) {
                const data = await response.json()
                setMessages(prev => [...prev, data])
                setNewMessage("")
            } else {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to send message")
            }
        } catch (error: any) {
            console.error("Failed to send message:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to send message"
            })
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="flex flex-col h-[500px] w-full max-w-md bg-card rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-sm bg-card/95">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-primary/5">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-primary/20">
                        <AvatarImage src={recipientImage} />
                        <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-bold text-sm leading-none">{recipientName}</h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                            {recipientRole}
                        </p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full h-8 w-8 p-0">
                        ×
                    </Button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : (
                    <ScrollArea className="h-full p-4" ref={scrollRef}>
                        <div className="space-y-4">
                            {messages.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-muted-foreground text-sm italic">No messages yet. Start the conversation!</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = (msg.sender_id || msg.senderId) === user?.id
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${isMe
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-muted text-foreground rounded-tl-none"
                                                    }`}
                                            >
                                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                                {msg.file_url && (
                                                    <div className={`mt-2 p-2 rounded-lg bg-background/20 border border-white/10 flex items-center gap-2 max-w-full overflow-hidden`}>
                                                        <div className="bg-primary/20 p-2 rounded shrink-0">
                                                            <Paperclip className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-medium truncate">{msg.file_name || "Attachment"}</p>
                                                            <button
                                                                onClick={() => window.open(msg.file_url, '_blank')}
                                                                className="text-[10px] text-primary-foreground underline hover:opacity-80 block"
                                                            >
                                                                Download
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                <span className={`text-[10px] block mt-1 opacity-70 ${isMe ? "text-right" : "text-left"}`}>
                                                    {msg.created_at || msg.createdAt ? format(new Date(msg.created_at || msg.createdAt || ""), "HH:mm") : ""}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </ScrollArea>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-background/50">
                <div className="flex gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={uploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="shrink-0 rounded-xl"
                    >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                    </Button>
                    <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
                        disabled={sending}
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim() || sending} className="rounded-xl shrink-0 shadow-lg shadow-primary/20">
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </div>
            </form>
        </div>
    )
}
