import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Building2,
    CalendarCheck,
    Wrench,
    BellRing,
    ArrowRight,
    Search,
    ShieldCheck,
    Activity,
    ChevronRight,
    Star,
    Layout,
    Cpu,
    Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
    <div 
        className="group bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl shadow-blue-900/5 hover:shadow-blue-600/10 hover:-translate-y-2 transition-all duration-500 animate-fade-in"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/10 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{title}</h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
);

const LandingPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen relative bg-white overflow-x-hidden">
            
            {/* ── Navbar (Solid White Space) ────────────────────── */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white py-4 shadow-xl shadow-blue-900/5 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-app rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-base font-bold text-slate-900 leading-tight tracking-tight">Unisphere</p>
                            <p className="text-[10px] text-blue-600 font-bold tracking-widest uppercase leading-none">Smart Operations</p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        <a href="#about" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">About</a>
                        <a href="#features" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Platform</a>
                        <a href="#roles" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Roles</a>
                        <div className="h-4 w-px bg-slate-200" />
                        {user ? (
                            <Link to="/" className="text-sm font-bold text-blue-600 hover:text-blue-700">Go to Dashboard</Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors tracking-tight">Sign In</Link>
                                <Link to="/register" className="px-7 py-2.5 bg-blue-600 text-white rounded-full text-sm font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all tracking-tight">
                                    Join the Hub
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── Hero Section (Old Manner Background) ───────────── */}
            <section id="home" className="relative min-h-screen flex flex-col justify-center pt-48 pb-32 overflow-hidden">
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0">
                    <div 
                        className="absolute inset-0 scale-105"
                        style={{
                            backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    {/* Dark Manner Overlay */}
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 mb-8 animate-fade-in backdrop-blur-md">
                        <Star className="w-4 h-4 fill-blue-400 text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest">The Next-Gen Campus OS</span>
                    </div>

                    <h1 className="text-4xl lg:text-7xl font-black text-white tracking-tight leading-[0.95] mb-8 animate-slide-up">
                        Digital Intelligence<br />
                        <span className="text-blue-400">For Your Campus.</span>
                    </h1>

                    <p className="text-base lg:text-lg text-white/80 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed mb-12 animate-slide-up" style={{ animationDelay: '100ms' }}>
                        Modernize your institution with a unified administrative ecosystem. 
                        Manage bookings, track assets, and resolve issues in real-time.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <Link to="/register" className="w-full sm:w-auto px-9 py-4 bg-blue-600 text-white rounded-full font-black text-base shadow-2xl shadow-blue-600/40 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                            Get Started Now <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a href="#features" className="w-full sm:w-auto px-9 py-4 bg-white/10 backdrop-blur-xl text-white rounded-full font-black text-base shadow-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/20">
                            View Platform
                        </a>
                    </div>
                </div>
            </section>

            <main className="relative z-10 bg-slate-50/50 backdrop-blur-3xl">

                {/* ── About Us Section (Historical Content) ─────────── */}
                <section id="about" className="mt-48 max-w-7xl mx-auto px-6 lg:px-12 space-y-32">
                    {/* Mission / Vision / Impact Grid */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-bold text-[10px] tracking-widest uppercase mb-4">
                            About UniSphere
                        </div>
                        <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight">Built for Modern <span className="text-blue-600">Institutions</span></h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { i: Star, t: 'Our Mission', d: 'To digitalise and centralise campus operations—bookings, asset tracking, and maintenance—into a single, intuitive platform that saves time and reduces friction.', b: 'blue' },
                            { i: Cpu, t: 'Our Vision', d: 'A world where every student, lecturer, and administrator can manage their campus lifecycle effortlessly—freeing them to focus on what truly matters: education.', b: 'indigo' },
                            { i: Activity, t: 'Our Impact', d: 'Deployed across 150+ institutions, UniSphere has streamlined over 200K bookings, resolved 50K maintenance tickets, and saved thousands of operational hours.', b: 'emerald' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white shadow-xl shadow-blue-900/5 hover:-translate-y-2 transition-all duration-500">
                                <div className={`w-14 h-14 bg-${item.b}-50 text-${item.b}-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner`}>
                                    <item.i className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-4">{item.t}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.d}</p>
                            </div>
                        ))}
                    </div>

                    {/* Detailed Story & Stats Section */}
                    <div className="flex flex-col lg:flex-row items-center gap-20 bg-white/40 backdrop-blur-md rounded-[3rem] p-10 lg:p-20 border border-white shadow-xl shadow-blue-900/5">
                        <div className="lg:w-1/2 space-y-8">
                            <h3 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight">From a Problem to a <span className="text-blue-600">Global Solution</span></h3>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                We started in 2022 when a group of engineers noticed students wasting hours queuing for labs and track room reservations. UniSphere was shaped through months of research with real students and technicians.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Designed with accessibility as a first-class concern',
                                    'Continuously improved through user feedback loops',
                                    'Trusted by leading universities across the region',
                                ].map((pt, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                            <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
                                        </div>
                                        {pt}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="lg:w-1/2 grid grid-cols-2 gap-6 w-full">
                            {[
                                { i: Layout, t: 'Research-Driven', v: '3 yrs' },
                                { i: Activity, t: 'Team Members', v: '25+' },
                                { i: Cpu, t: 'Growth YoY', v: '120%' },
                                { i: Star, t: 'Data Points/Day', v: '1M+' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-lg text-center group hover:bg-white transition-colors">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <stat.i className="w-6 h-6" />
                                    </div>
                                    <p className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{stat.v}</p>
                                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">{stat.t}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Facilities Section (Original Numbered Content) ── */}
                <section id="features" className="mt-48 max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                            Comprehensive <span className="text-blue-600">Facilities</span>
                        </h2>
                        <p className="text-slate-500 font-medium">Everything you need to orchestrate a smart campus environment.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { i: Building2, t: 'Facilities & Assets', d: 'Secure management of all campus rooms, labs, and highly requested physical resources.', g: 'from-sky-500 to-blue-600', n: '01' },
                            { i: CalendarCheck, t: 'Booking System', d: 'Automated workflows block schedule clashes and instantly notify proper authorities.', g: 'from-indigo-500 to-violet-600', n: '02' },
                            { i: Wrench, t: 'Maintenance Tickets', d: 'Real-time incident reporting directly routes physical campus issues to technicians.', g: 'from-emerald-500 to-teal-600', n: '03' },
                            { i: BellRing, t: 'Alerts & CommHub', d: 'Instant updates on bookings, approvals, and emergency-wide campus alerts.', g: 'from-amber-500 to-orange-600', n: '04' },
                        ].map((item, i) => (
                            <div key={i} className="group bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl shadow-blue-900/5 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden" style={{ background: '#f2f4f6', color: '#191c1e' }}>
                                <span className="text-[11px] font-black text-slate-300 tracking-widest absolute top-8 right-8 uppercase">{item.n}</span>
                                <div className={`w-14 h-14 bg-gradient-to-br ${item.g} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                    <item.i className="w-7 h-7" />
                                </div>
                                <h4 className="text-lg font-black text-slate-900 mb-3">{item.t}</h4>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.d}</p>
                                <div className="mt-6 flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                    Learn More <ChevronRight className="w-3 h-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── How It Works ──────────────────────────────────── */}
                <section id="how-it-works" className="mt-48 max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">Maximum Operational Ease</h2>
                        <p className="text-slate-500 font-medium">A streamlined 4-step process for students and staff.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { i: Smartphone, t: '1. Login SSO', d: 'Secure access with institutional email.' },
                            { i: Search, t: '2. Discover/Book', d: 'Reserve assets in real-time instantly.' },
                            { i: Activity, t: '3. Track Lifecycle', d: 'Monitor operations from start to finish.' },
                            { i: ShieldCheck, t: '4. Resolve', d: 'System-driven resolution workflows.' },
                        ].map((step, i) => (
                            <div key={i} className="bg-white/40 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-sm text-center relative group hover:bg-white transition-colors">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-xs shadow-lg shadow-blue-600/30">
                                    {i+1}
                                </div>
                                <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/10 mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <step.i className="w-6 h-6" />
                                </div>
                                <h4 className="font-black text-slate-900 mb-2">{step.t}</h4>
                                <p className="text-slate-500 text-xs font-semibold leading-relaxed">{step.d}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Role Based Access ─────────────────────────────── */}
                <section id="roles" className="mt-48 mb-64 max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                            Tailored <span className="text-blue-600">Institutional Roles</span>
                        </h2>
                        <p className="text-slate-500 font-medium max-w-xl mx-auto">
                            Precision interfaces providing every campus stakeholder with exactly the tools they need to succeed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { r: 'Student / User', i: Activity, d: 'Browse resources, make bookings, and submit tickets transparently.', c: 'blue' },
                            { r: 'System Admin', i: ShieldCheck, d: 'Master control over approvals, user management, and system settings.', c: 'indigo' },
                            { r: 'Technician', i: Wrench, d: 'Real-time ticket routing and resolution workflows for campus assets.', c: 'rose' },
                        ].map((role, i) => (
                            <div key={i} className="group bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white shadow-xl shadow-blue-900/5 hover:-translate-y-2 transition-all duration-500">
                                <div className={`w-14 h-14 bg-white text-${role.c}-600 rounded-2xl flex items-center justify-center shadow-lg mb-8 shadow-${role.c}-600/10 group-hover:scale-110 transition-transform`}>
                                    <role.i className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{role.r}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{role.d}</p>
                                <div className={`mt-8 h-1 w-12 rounded-full bg-gradient-to-r ${role.c === 'blue' ? 'from-blue-500 to-blue-600' : role.c === 'rose' ? 'from-rose-500 to-rose-600' : 'from-indigo-500 to-indigo-600'}`} />
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer Restoration */}
            <Footer />
        </div>
    );
};

export default LandingPage;
