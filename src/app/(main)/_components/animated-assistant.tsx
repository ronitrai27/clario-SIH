"use client"

import { useEffect, useState } from "react"
import { LuMic } from "react-icons/lu"
import { Typewriter } from "react-simple-typewriter"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAssistantDialogStore } from "@/lib/store/useAssistantDialog"
import { Star } from "lucide-react"
import { BsStars } from "react-icons/bs";

export default function AnimatedAssistant() {
  const [showWave, setShowWave] = useState(false)
  const [displayText, setDisplayText] = useState("AI Assistant")
   const { isOpen, close } = useAssistantDialogStore();

  const texts = [
    "Do You Need help?",
    "Ask me anything.",
    "AI Assistant",
    "How can I help today?"
  ]

  useEffect(() => {
    let waveTimeout: NodeJS.Timeout
    let triggerTimeout: NodeJS.Timeout

    const triggerEffect = () => {
      let newText = displayText
      while (newText === displayText && texts.length > 1) {
        newText = texts[Math.floor(Math.random() * texts.length)]
      }
      setDisplayText(newText)

      setShowWave(true)
      waveTimeout = setTimeout(() => setShowWave(false), 1200)

      const nextDelay = Math.random() * 10000 + 8000
      triggerTimeout = setTimeout(triggerEffect, nextDelay)
    }

    triggerEffect()

    return () => {
      clearTimeout(waveTimeout)
      clearTimeout(triggerTimeout)
    }
  }, [])

  return (
    <>
      <div className="flex items-center gap-4 relative">
        <div
          onClick={() => useAssistantDialogStore.getState().open()}
          className="relative bg-blue-50/90 w-11 h-11 rounded-full flex items-center justify-center shadow-md cursor-pointer"
        >
          <BsStars className="text-[20px] text-black z-10" />
          {showWave && (
            <>
              <span className="absolute w-full h-full rounded-full bg-blue-400/20 animate-ping z-0" />
              <span className="absolute w-14 h-14 rounded-full bg-blue-400/10 animate-ping z-0" />
              <span className="absolute w-16 h-16 rounded-full bg-blue-200/10 animate-ping z-0" />
            </>
          )}
        </div>

        <p className="font-poppins text-base text-black">
          <Typewriter
            words={[displayText]}
            loop={1}
            typeSpeed={60}
            deleteSpeed={30}
            delaySpeed={2000}
          />
        </p>
      </div>

      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>AI Assistant</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            This is your future assistant panel.
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}