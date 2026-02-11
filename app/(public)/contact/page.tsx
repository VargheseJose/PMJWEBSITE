"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock, Send, Calendar } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="container py-12 md:py-24 px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">

                {/* Contact Info Side */}
                <div className="space-y-8 text-white">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 drop-shadow-md">Get in Touch</h1>
                        <p className="text-xl text-blue-100/80">
                            Ready to start your project? We're here to help with quotes, availability, and expert advice.
                        </p>
                    </div>

                    {/* Booking Card */}
                    <Card className="glass border-white/10 hover:border-blue-400/30 transition-colors">
                        <CardContent className="p-6 flex items-start gap-4">
                            <div className="p-3 rounded-full bg-blue-500/20 text-blue-300 min-w-12 h-12 flex items-center justify-center">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-lg text-white">Book an Appointment</h3>
                                <p className="text-sm text-blue-100/70">
                                    Schedule a consultation or site visit directly with our team at your convenience.
                                </p>
                                <Button asChild className="mt-2 bg-blue-600 hover:bg-blue-500 text-white shadow-lg" variant="default">
                                    <a href="https://calendar.app.google/saKTGCNfWYeEDwru9" target="_blank" rel="noopener noreferrer">
                                        Schedule Now
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6">
                        <div className="flex items-start gap-4 p-4 rounded-xl glass-card">
                            <div className="p-3 rounded-full bg-blue-500/20 text-blue-300">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-white">Phone</h3>
                                <p className="text-blue-100/60 mb-1">Call us for immediate assistance.</p>
                                <a href="tel:+919447074312" className="text-blue-300 font-bold hover:text-white transition-colors">+91 94470 74312</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-xl glass-card">
                            <div className="p-3 rounded-full bg-blue-500/20 text-blue-300">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-white">Email</h3>
                                <p className="text-blue-100/60 mb-1">Send us your requirements anytime.</p>
                                <a href="mailto:contact@pmjgroup.in" className="text-blue-300 font-bold hover:text-white transition-colors">contact@pmjgroup.in</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-xl glass-card">
                            <div className="p-3 rounded-full bg-blue-500/20 text-blue-300">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-white">Headquarters</h3>
                                <p className="text-blue-100/60 mb-1">Visit our main office.</p>
                                <address className="not-italic font-medium text-white">
                                    PMJ Group Construction Equipment<br />
                                    Kerala, India
                                </address>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-xl glass-card">
                            <div className="p-3 rounded-full bg-blue-500/20 text-blue-300">
                                <Clock className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-white">Business Hours</h3>
                                <p className="text-blue-100/60 mb-1">Available for support.</p>
                                <p className="font-medium text-white">Mon - Sat: 8:00 AM - 6:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <Card className="border-white/10 shadow-2xl glass-strong">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-white">Send Enquiry</CardTitle>
                        <CardDescription className="text-blue-100/70">
                            Fill out the form below and our team will get back to you within 24 hours.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name" className="text-white">First name</Label>
                                    <Input id="first-name" placeholder="John" required className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name" className="text-white">Last name</Label>
                                    <Input id="last-name" placeholder="Doe" required className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white">Email</Label>
                                <Input id="email" placeholder="john@example.com" type="email" required className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                                <Input id="phone" placeholder="+91 98765 43210" type="tel" className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject" className="text-white">Subject</Label>
                                <Input id="subject" placeholder="Equipment Inquiry" className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-white">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Tell us about your project and equipment needs..."
                                    className="min-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 resize-none"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full text-base py-6 font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all bg-primary hover:bg-primary/90 text-white">
                                <Send className="mr-2 h-4 w-4" /> Send Message
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            {/* Background Orbs */}
            <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        </div>
    )
}
