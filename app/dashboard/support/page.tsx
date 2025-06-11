"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, HelpCircle, MessageSquare, Mail, Globe, Phone } from "lucide-react"
import { SupportForm } from "@/components/support-form"

export default function SupportPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="border-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-blue-500" />
              Support Center
            </h1>
            <p className="text-slate-400">Get help with any blockchain issue</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <SupportForm
              issueType="General Support"
              title="Contact Support"
              description="Our team is ready to help with any blockchain or wallet issue you're experiencing."
            />
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  Contact Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-700/30 rounded-lg flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white mb-1">Email Support</h4>
                    <p className="text-slate-300 text-sm">support@multichain-protocol.com</p>
                    <p className="text-slate-400 text-xs mt-1">Response time: 24-48 hours</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg flex items-start gap-3">
                  <Globe className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white mb-1">Knowledge Base</h4>
                    <p className="text-slate-300 text-sm">Visit our help center for guides and tutorials</p>
                    <Button variant="link" className="text-blue-400 p-0 h-auto text-sm">
                      Browse Knowledge Base →
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg flex items-start gap-3">
                  <Phone className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white mb-1">Phone Support</h4>
                    <p className="text-slate-300 text-sm">Available for premium users</p>
                    <p className="text-slate-400 text-xs mt-1">Mon-Fri, 9am-5pm UTC</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Common Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => router.push("/dashboard/migration")}
                  >
                    Migration Issues
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => router.push("/dashboard/swap")}
                  >
                    Swap/Exchange Problems
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => router.push("/dashboard/missing-funds")}
                  >
                    Missing Funds
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => router.push("/dashboard/gas-fees")}
                  >
                    Gas Fee Issues
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
