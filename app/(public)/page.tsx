import Link from "next/link"
import { ArrowRight, CheckCircle2, Truck, Clock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="container relative z-10 px-4 md:px-6">
                    <div className="flex flex-col gap-8 items-center text-center max-w-[800px] mx-auto">
                        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-white backdrop-blur-md shadow-[0_0_15px_rgba(77,123,255,0.3)]">
                            <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2 shadow-[0_0_10px_#60a5fa]"></span>
                            Now Serving All Across Kerala
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-md">
                            Build Faster with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300">Premium Equipment</span>
                        </h1>
                        <p className="text-xl text-blue-100/80 md:text-2xl max-w-[600px] leading-relaxed drop-shadow-sm">
                            PMJ Group provides top-tier construction machinery and scaffolding solutions. Reliable, maintained, and ready for your site.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <Link href="/catalog">
                                <Button size="lg" className="h-12 px-8 text-base w-full sm:w-auto shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                                    Browse Catalog <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="h-12 px-8 text-base w-full sm:w-auto glass border-white/20 hover:bg-white/10 text-white">
                                    Request Quote
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Abstract Background Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] -z-10 animate-float" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px] -z-10" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[90px] -z-10" />
            </section>

            {/* Stats Section */}
            <section className="border-y border-white/5 bg-white/5 backdrop-blur-sm py-12">
                <div className="container px-4 md:px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div className="space-y-2">
                            <h3 className="text-3xl font-bold text-white">500+</h3>
                            <p className="text-sm font-medium text-blue-200/70 uppercase tracking-wide">Equipment Units</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-bold text-white">100%</h3>
                            <p className="text-sm font-medium text-blue-200/70 uppercase tracking-wide">Quality Checked</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-bold text-white">24/7</h3>
                            <p className="text-sm font-medium text-blue-200/70 uppercase tracking-wide">Support Available</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-bold text-white">10+</h3>
                            <p className="text-sm font-medium text-blue-200/70 uppercase tracking-wide">Years Experience</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-white">Why Choose PMJ Group?</h2>
                        <p className="max-w-[700px] text-blue-100/70 md:text-lg">
                            We understand construction deadlines. That's why we prioritize reliability and speed in our service.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group glass-card p-8">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-white">Certified Quality</h3>
                            <p className="text-blue-100/60">Every piece of equipment is rigorously inspected and maintained to meet safety standards.</p>
                        </div>
                        <div className="group glass-card p-8">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Clock className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-white">Fast Delivery</h3>
                            <p className="text-blue-100/60">We ensure timely delivery to your construction site so your project never stops.</p>
                        </div>
                        <div className="group glass-card p-8">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Truck className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-white">Wide Inventory</h3>
                            <p className="text-blue-100/60">From scaffolding details to heavy machinery, we have everything your site needs.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Preview */}
            <section className="py-20 glass-strong">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-bold tracking-tighter text-white">Our Inventory Categories</h2>
                            <p className="text-blue-100/70">Explore our comprehensive range of equipment.</p>
                        </div>
                        <Link href="/catalog">
                            <Button variant="ghost" className="group text-white hover:bg-white/10 hover:text-blue-200">
                                View Full Catalog <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Link href="/catalog?category=Scaffolding" className="group relative overflow-hidden rounded-xl aspect-[4/3] glass border border-white/10 hover:border-blue-400/50 transition-colors shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0" />
                            <div className="relative z-10 h-full flex flex-col justify-end p-6">
                                <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-blue-300 transition-colors">Scaffolding</h3>
                                <p className="text-sm text-blue-100/60">H-Frames, Pipes, Cuplocks</p>
                            </div>
                        </Link>
                        <Link href="/catalog?category=Machinery" className="group relative overflow-hidden rounded-xl aspect-[4/3] glass border border-white/10 hover:border-blue-400/50 transition-colors shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0" />
                            <div className="relative z-10 h-full flex flex-col justify-end p-6">
                                <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-blue-300 transition-colors">Machinery</h3>
                                <p className="text-sm text-blue-100/60">Mixers, Hoists, Vibrators</p>
                            </div>
                        </Link>
                        <Link href="/catalog?category=Formwork" className="group relative overflow-hidden rounded-xl aspect-[4/3] glass border border-white/10 hover:border-blue-400/50 transition-colors shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0" />
                            <div className="relative z-10 h-full flex flex-col justify-end p-6">
                                <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-blue-300 transition-colors">Formwork</h3>
                                <p className="text-sm text-blue-100/60">Shutters, Floor Forms, Props</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 lg:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-2xl -z-10" />
                <div className="container px-4 md:px-6 text-center z-10 relative">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-6 text-white">Ready to Start Your Project?</h2>
                    <p className="max-w-[600px] mx-auto text-blue-100/90 md:text-xl mb-10">
                        Get a custom quote for your equipment needs today. Fast response guaranteed.
                    </p>
                    <Link href="/contact">
                        <Button size="lg" className="h-12 px-8 text-base bg-white text-primary hover:bg-blue-50 hover:shadow-xl transition-all shadow-lg">
                            Contact Us Now
                        </Button>
                    </Link>
                </div>
                {/* Blobs for CTA */}
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/30 rounded-full blur-[60px] -z-10" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/30 rounded-full blur-[60px] -z-10" />
            </section>
        </div>
    )
}
