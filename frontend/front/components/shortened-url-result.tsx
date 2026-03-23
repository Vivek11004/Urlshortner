"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Copy, Download, RotateCcw, ExternalLink } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"

interface ShortenedUrlResultProps {
  originalUrl: string
  shortUrl: string
  onReset: () => void
}

export function ShortenedUrlResult({ originalUrl, shortUrl, onReset }: ShortenedUrlResultProps) {
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  const fullShortUrl = shortUrl

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas")
    if (canvas) {
      const url = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `qr-${shortUrl.replace("/", "-")}.png`
      link.href = url
      link.click()
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          {/* QR Code Section */}
          <div className="flex flex-col items-center gap-4">
            <div
              ref={qrRef}
              className="rounded-2xl bg-foreground p-4"
            >
              <QRCodeCanvas
                value={fullShortUrl}
                size={160}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={false}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadQR}
              className="gap-2 border-border text-foreground hover:bg-secondary"
            >
              <Download className="h-4 w-4" />
              Download QR
            </Button>
          </div>

          {/* URL Info Section */}
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">Shortened URL</span>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-xl border border-border bg-input px-4 py-3">
                  <a
                    href={fullShortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-lg font-semibold text-primary hover:underline"
                  >
                    {shortUrl}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <Button
                  onClick={handleCopy}
                  className="h-12 w-12 shrink-0 bg-primary p-0 hover:bg-primary/90"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-primary-foreground" />
                  ) : (
                    <Copy className="h-5 w-5 text-primary-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">Original URL</span>
              <div className="rounded-xl border border-border bg-input px-4 py-3">
                <p className="truncate text-sm text-muted-foreground">{originalUrl}</p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={onReset}
              className="gap-2 border-border text-foreground hover:bg-secondary"
            >
              <RotateCcw className="h-4 w-4" />
              Shorten Another URL
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
