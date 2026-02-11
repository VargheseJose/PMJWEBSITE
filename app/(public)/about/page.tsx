
import { Button } from "@/components/ui/button"
import { Construction, MapPin, Phone, Star, ShieldCheck, Clock, Users } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden bg-muted/30">
                <div className="container relative z-10 px-4 md:px-6">
                    <div className="max-w-3xl space-y-4">
                        <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                            Established 2010
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                            Building Dreams for Over 16 Years
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            PMJ Group Hiring Services has been a pillar in Kerala's construction industry, providing reliable equipment and expert support since 2010.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 border-y bg-background">
                <div className="container px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-3xl font-bold flex items-center gap-2">
                                4.1 <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                            </h3>
                            <p className="text-sm text-muted-foreground uppercase tracking-wider">Customer Rating</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-3xl font-bold">16+</h3>
                            <p className="text-sm text-muted-foreground uppercase tracking-wider">Years Experience</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-3xl font-bold">500+</h3>
                            <p className="text-sm text-muted-foreground uppercase tracking-wider">Happy Clients</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-3xl font-bold">100%</h3>
                            <p className="text-sm text-muted-foreground uppercase tracking-wider">Service Guarantee</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story / Details */}
            <section className="py-20 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Your Trusted Partner in Construction</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Located in Mulanthuruthy, Ernakulam, PMJ Group Hiring Services specializes in providing high-quality construction equipment on rent. We understand the critical nature of construction timelines and ensure that our machinery is always in top condition and ready for deployment.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                From scaffolding to heavy machinery, our inventory is curated to meet the diverse needs of contractors, builders, and developers across Kerala.
                            </p>

                            <div className="grid gap-4 mt-8">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 bg-primary/10 p-2 rounded-full text-primary">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Quality Assured</h4>
                                        <p className="text-sm text-muted-foreground">Rigorous maintenance checks before every rental.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 bg-primary/10 p-2 rounded-full text-primary">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Timely Delivery</h4>
                                        <p className="text-sm text-muted-foreground">We value your time and ensure prompt equipment delivery.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 bg-primary/10 p-2 rounded-full text-primary">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Expert Support</h4>
                                        <p className="text-sm text-muted-foreground">Our team provides on-site guidance for equipment usage.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted rounded-2xl overflow-hidden shadow-2xl border aspect-square lg:aspect-auto h-full min-h-[400px] relative group">
                            {/* Placeholder for an office or team image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
                                <Construction className="h-32 w-32 text-primary/20" />
                            </div>
                            {/* Map Embed - Using a static map image or iframe */}
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.228512148119!2d76.38208807584166!3d9.90105539019934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0875a5fb054b27%3A0x64d4faf1d8af2c27!2sPMJ%20Group%20Hiring%20Services!5e0!3m2!1sen!2sin!4v1709230000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Location & Contact CTA */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tighter">Visit Our Headquarters</h2>
                            <div className="space-y-2 text-primary-foreground/90">
                                <p className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Sariga Mulanthuruthy, Pallithazham, Mulanthuruthy, Kerala 680314
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="h-5 w-5" />
                                    +91 94470 74312
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="https://maps.app.goo.gl/gpPbuMEvy57FrB6cA" target="_blank">
                                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                                    Get Directions
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
