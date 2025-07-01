"use client"

import PublicPageLayout from "@/components/layouts/PublicPageLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <PublicPageLayout
      pageTitle="Contact Us"
      pageDescription="Have a question or want to work with us? We'd love to hear from you."
    >
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your Name" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
             <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="What is your message about?" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Your message..." rows={5} />
            </div>
            <Button type="submit">Send Message</Button>
          </form>
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Our Office</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-4 text-gray-500"/>
                        <span>123 Innovation Drive, Research City, 12345</span>
                    </div>
                     <div className="flex items-center">
                        <Mail className="w-5 h-5 mr-4 text-gray-500"/>
                        <span>contact@ideaverse.ai</span>
                    </div>
                     <div className="flex items-center">
                        <Phone className="w-5 h-5 mr-4 text-gray-500"/>
                        <span>(555) 123-4567</span>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Sales & Support</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>For sales inquiries or support questions, please email us at <a href="mailto:sales@ideaverse.ai" className="text-blue-600 dark:text-blue-500">sales@ideaverse.ai</a>.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </PublicPageLayout>
  )
} 