"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { LinkIcon, Sparkles } from "lucide-react"

interface UrlShortenerFormProps {
  onUrlShortened: (originalUrl: string, shortUrl: string) => void
}

function generateShortCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function UrlShortenerForm({ onUrlShortened }: UrlShortenerFormProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const validateUrl = (urlString: string): boolean => {
    try {
      new URL(urlString)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }

    let urlToShorten = url.trim()
    if (!urlToShorten.startsWith("http://") && !urlToShorten.startsWith("https://")) {
      urlToShorten = "https://" + urlToShorten
    }

    if (!validateUrl(urlToShorten)) {
      setError("Please enter a valid URL")
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const shortCode = generateShortCode()
    const shortUrl = `snip.io/${shortCode}`

    setIsLoading(false)
    onUrlShortened(urlToShorten, shortUrl)
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Paste your long URL here..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError("")
              }}
              className="h-14 rounded-xl border-border bg-input pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            disabled={isLoading}
            className="h-14 rounded-xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <Spinner className="mr-2 h-5 w-5" />
            ) : (
              <Sparkles className="mr-2 h-5 w-5" />
            )}
            {isLoading ? "Shortening..." : "Shorten URL"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
