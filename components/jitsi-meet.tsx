"use client"

import { useEffect, useRef } from "react"

declare global {
    interface Window {
        JitsiMeetExternalAPI: any
    }
}

interface JitsiMeetProps {
    roomName: string
    userName: string
    onLeave?: () => void
}

export function JitsiMeet({ roomName, userName, onLeave }: JitsiMeetProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const apiRef = useRef<any>(null)

    useEffect(() => {
        // Load Jitsi script
        const script = document.createElement("script")
        script.src = "https://meet.jit.si/external_api.js"
        script.async = true
        script.onload = () => {
            if (containerRef.current && window.JitsiMeetExternalAPI) {
                const domain = "meet.jit.si"
                const options = {
                    roomName: roomName,
                    width: "100%",
                    height: "100%",
                    parentNode: containerRef.current,
                    configOverwrite: {
                        startWithAudioMuted: true,
                        startWithVideoMuted: true,
                        disableDeepLinking: true,
                        enableWelcomePage: false,
                    },
                    interfaceConfigOverwrite: {
                        APP_NAME: "Sukoon",
                        DEFAULT_BACKGROUND: "#020617",
                        SHOW_JITSI_WATERMARK: false,
                        SHOW_WATERMARK_FOR_GUESTS: false,
                        TOOLBAR_BUTTONS: [
                            "microphone",
                            "camera",
                            "closedcaptions",
                            "desktop",
                            "fullscreen",
                            "fodeviceselection",
                            "hangup",
                            "profile",
                            "chat",
                            "settings",
                            "raisehand",
                            "videoquality",
                            "tileview",
                            "videobackgroundblur",
                            "help",
                            "mute-everyone",
                            "security",
                        ],
                    },
                    userInfo: {
                        displayName: userName,
                    },
                }

                const api = new window.JitsiMeetExternalAPI(domain, options)
                apiRef.current = api

                api.addEventListener("videoConferenceLeft", () => {
                    if (onLeave) onLeave()
                })
            }
        }

        document.body.appendChild(script)

        return () => {
            if (apiRef.current) {
                apiRef.current.dispose()
            }
            document.body.removeChild(script)
        }
    }, [roomName, userName, onLeave])

    return <div ref={containerRef} className="w-full h-full min-h-[600px] rounded-xl overflow-hidden shadow-2xl bg-slate-950" />
}
