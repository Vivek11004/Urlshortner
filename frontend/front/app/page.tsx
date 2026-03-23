"use client"

import { useState } from "react"
import { UrlShortenerForm } from "@/components/url-shortener-form"
import { ShortenedUrlResult } from "@/components/shortened-url-result"
import { Header } from "@/components/header"
import { FeatureGrid } from "@/components/feature-grid"

export default function Home() {
  const [shortenedData, setShortenedData] = useState<{
    originalUrl: string
    shortUrl: string
  } | null>(null)

  // 🔥 BACKEND CALL ADDED HERE
  const handleUrlShortened = async (originalUrl: string) => {
    try {
      const res = await fetch("https://unfroward-uneffusive-kerrie.ngrok-free.dev/urls/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          long_url: originalUrl,
        }),
      })

      const data = await res.json()

      setShortenedData({
        originalUrl: data.long_url,
        shortUrl: data.short_url,
      })

    } catch (err) {
      console.error("Error:", err)
    }
  }

  const handleReset = () => {
    setShortenedData(null)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-pretty text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Shorten URLs.
            <br />
            <span className="text-primary">Generate QR Codes.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Transform long, unwieldy URLs into clean, shareable links with instant QR code generation.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          {!shortenedData ? (
            <UrlShortenerForm onUrlShortened={handleUrlShortened} />
          ) : (
            <ShortenedUrlResult
              originalUrl={shortenedData.originalUrl}
              shortUrl={shortenedData.shortUrl}
              onReset={handleReset}
            />
          )}
        </div>

        <FeatureGrid />
      </div>
    </main>
  )
}