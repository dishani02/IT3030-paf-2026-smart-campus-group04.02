import React from 'react';
import { Link } from 'react-router-dom';
import {
    Building2,
    Mail,
    Phone,
    MapPin,
    Twitter,
    Linkedin,
    Github,
    Instagram,
    ArrowRight,
} from 'lucide-react';

const Footer = () => {
    const year = new Date().getFullYear();

    const quickLinks = [
        { label: 'Home', href: '#home', external: false, isHash: true },
        { label: 'About Us', href: '#about', external: false, isHash: true },
        { label: 'Facilities', href: '#features', external: false, isHash: true },
        { label: 'How It Works', href: '#how-it-works', external: false, isHash: true },
    ];

    const facilityLinks = [
        { label: 'Resource Booking', href: '/login' },
        { label: 'Maintenance Tickets', href: '/login' },
        { label: 'Campus Analytics', href: '/login' },
        { label: 'Role Management', href: '/login' },
    ];

    const legalLinks = [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Contact Helpdesk', href: '/contact' },
        { label: 'Cookie Settings', href: '/cookies' },
    ];

    const socials = [
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Github, href: '#', label: 'GitHub' },
        { icon: Instagram, href: '#', label: 'Instagram' },
    ];

    return (
        <footer className="bg-slate-900 relative overflow-hidden">
            {/* Top gradient divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />

            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-600/5 rounded-full blur-3xl pointer-events-none" />

            {/* ── Main content ────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 relative z-10">

                {/* Grid: brand | links | links | links */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">

                    {/* Brand column (2 of 5) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-app rounded-2xl flex items-center justify-center shadow-lg shadow-sky-600/30 ring-2 ring-white/10 flex-shrink-0">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-black text-white tracking-tight leading-none block">UniSphere</span>
                                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Education Platform</span>
                            </div>
                        </div>

                        <p className="text-slate-400 text-sm leading-relaxed font-medium max-w-xs">
                            The ultimate all-in-one platform for booking campus resources, tracking maintenance, and managing role-based access—designed for modern universities.
                        </p>

                        {/* Contact info */}
                        <ul className="space-y-3">
                            {[
                                { icon: Mail, text: 'support@smartcampushub.edu' },
                                { icon: Phone, text: '+1 (800) 555-CAMPUS' },
                                { icon: MapPin, text: 'Campus Innovation Centre, Block A' },
                            ].map(({ icon: Icon, text }) => (
                                <li key={text} className="flex items-start gap-3 text-xs text-slate-400 font-medium">
                                    <Icon className="w-3.5 h-3.5 text-sky-500 flex-shrink-0 mt-0.5" />
                                    {text}
                                </li>
                            ))}
                        </ul>

                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-extrabold mb-5 text-sm tracking-wide">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map(({ label, href, isHash }) => (
                                <li key={label}>
                                    {isHash ? (
                                        <a
                                            href={href}
                                            className="text-slate-400 text-sm font-medium hover:text-sky-400 transition-colors flex items-center gap-1.5 group"
                                        >
                                            <span className="w-0 group-hover:w-3 h-px bg-sky-400 transition-all duration-200 overflow-hidden" />
                                            {label}
                                        </a>
                                    ) : (
                                        <Link
                                            to={href}
                                            className="text-slate-400 text-sm font-medium hover:text-sky-400 transition-colors flex items-center gap-1.5 group"
                                        >
                                            <span className="w-0 group-hover:w-3 h-px bg-sky-400 transition-all duration-200 overflow-hidden" />
                                            {label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Facilities */}
                    <div>
                        <h4 className="text-white font-extrabold mb-5 text-sm tracking-wide">Facilities</h4>
                        <ul className="space-y-3">
                            {facilityLinks.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        to={href}
                                        className="text-slate-400 text-sm font-medium hover:text-sky-400 transition-colors flex items-center gap-1.5 group"
                                    >
                                        <span className="w-0 group-hover:w-3 h-px bg-sky-400 transition-all duration-200 overflow-hidden" />
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-extrabold mb-5 text-sm tracking-wide">Legal & Support</h4>
                        <ul className="space-y-3">
                            {legalLinks.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        to={href}
                                        className="text-slate-400 text-sm font-medium hover:text-sky-400 transition-colors flex items-center gap-1.5 group"
                                    >
                                        <span className="w-0 group-hover:w-3 h-px bg-sky-400 transition-all duration-200 overflow-hidden" />
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ── Bottom bar ──────────────────────────────────────────── */}
                <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-5">
                    <p className="text-slate-500 text-xs font-medium text-center sm:text-left">
                        © {year} UniSphere. All rights reserved. Made with ♥ for modern education.
                    </p>

                    {/* Social icons */}
                    <div className="flex items-center gap-3">
                        {socials.map(({ icon: Icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                aria-label={label}
                                className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-app hover:border-transparent transition-all duration-200 hover:scale-110"
                            >
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
