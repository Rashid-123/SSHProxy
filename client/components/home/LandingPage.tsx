'use client';

import Link from 'next/link';
import { Shield, Key, Zap, Monitor, Lock, RefreshCw, Terminal, ChevronRight, Github, Linkedin, Globe } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="bg-slate-page text-slate-text">

            {/* Hero */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-slate-border text-slate-muted md:text-sm text-xs mb-8 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    Browser-based SSH Terminal — no client software required
                </div>

                <h1 className="text-5xl sm:text-6xl font-bold text-slate-text leading-tight mb-6 tracking-tight font-mono">
                    SSH into any machine,<br />
                    <span className="text-brand-primary">from anywhere.</span>
                </h1>

                <p className="text-slate-muted text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                    A secure, browser-based SSH Terminal. Your private keys are encrypted
                    before storage —  it is never saved in plain text.
                </p>

                <div className="flex items-center justify-center gap-4">
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primaryHover text-slate-text text-sm transition-colors"
                    >
                        Get Started
                        <ChevronRight size={14} />
                    </Link>
                    <Link
                        href="/login"
                        className="px-6 py-3 border border-slate-border text-slate-muted hover:text-slate-text hover:border-slate-muted text-sm transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </section>


            <div className="h-px bg-gradient-to-r from-slate-page via-slate-border to-slate-page" />

            {/* How it works */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <p className="md:text-md text-xs text-slate-muted uppercase tracking-widest mb-10 text-center font-mono">
                    How it works
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-slate-border border border-slate-border">
                    {[
                        {
                            step: '01',
                            icon: <Key size={16} />,
                            title: 'Add your machine',
                            desc: 'Enter your hostname, SSH private key, and set an encryption password. Your key is encrypted immediately — never stored in plain text.',
                        },
                        {
                            step: '02',
                            icon: <Lock size={16} />,
                            title: 'Enter password to connect',
                            desc: 'Your encryption password decrypts your credentials in memory only. It is never sent to or stored on the server.',
                        },
                        {
                            step: '03',
                            icon: <Terminal size={16} />,
                            title: 'Terminal opens instantly',
                            desc: 'A live SSH session opens in your browser. Works on desktop, tablet, and mobile — no app install needed.',
                        },
                    ].map((item, i) => (
                        <div key={i} className="bg-slate-page p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="text-brand-primary">{item.icon}</div>
                                <span className="text-slate-border text-3xl font-bold font-mono">{item.step}</span>
                            </div>
                            <h3 className="text-slate-text font-semibold mb-2 text-sm">{item.title}</h3>
                            <p className="text-slate-muted text-xs leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="h-px bg-gradient-to-r from-slate-page via-slate-border to-slate-page" />

            {/* Security */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex flex-col sm:flex-row items-start gap-16">

                    {/* Left */}
                    <div className="sm:w-64 shrink-0">
                        <Shield size={22} className="text-brand-primary mb-4" />
                        <p className="text-xs text-slate-muted uppercase tracking-widest mb-3 font-mono">Security</p>
                        <h2 className="text-2xl font-bold text-slate-text leading-snug">
                            Your credentials never leave your control.
                        </h2>
                    </div>

                    {/* Right */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-border border border-slate-border">
                        {[
                            {
                                icon: <Shield size={13} />,
                                title: 'AES-256-GCM Encryption',
                                desc: 'Your private key is encrypted with AES-256-GCM before being written to the database. The stored blob is unreadable without your password.',
                            },
                            {
                                icon: <Key size={13} />,
                                title: 'PBKDF2 Key Derivation',
                                desc: '100,000 iterations of PBKDF2-SHA256 are used to derive your encryption key. Brute-force attacks are computationally impractical.',
                            },
                            {
                                icon: <Zap size={13} />,
                                title: 'Zero Knowledge Storage',
                                desc: 'Your encryption password is never transmitted to or stored on the server. Only you hold the key to your credentials.',
                            },
                            {
                                icon: <RefreshCw size={13} />,
                                title: 'Credentials Discarded After Use',
                                desc: 'Decrypted credentials exist only in memory during the SSH handshake and are immediately cleared once your session is live.',
                            },
                        ].map((f, i) => (
                            <div key={i} className="bg-slate-page p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-brand-primary">{f.icon}</span>
                                    <span className="text-xs font-semibold text-slate-text">{f.title}</span>
                                </div>
                                <p className="text-slate-muted text-xs leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="h-px bg-gradient-to-r from-slate-page via-slate-border to-slate-page" />

            {/* Access anywhere */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex flex-col sm:flex-row items-start gap-16">
                    <div className="sm:w-64 shrink-0">
                        <Monitor size={22} className="text-brand-primary mb-4" />
                        <p className="text-xs text-slate-muted uppercase tracking-widest mb-3 font-mono">Access Anywhere</p>
                        <h2 className="text-2xl font-bold text-slate-text leading-snug">
                            Works on every device.
                        </h2>
                    </div>
                    <div className="flex-1 space-y-4">
                        {[
                            'Open a terminal from your phone, tablet, or any browser — no SSH client software needed.',
                            'Responsive terminal adapts to any screen size, including mobile keyboards.',
                            'Secure sessions from any network — home, office, or on the go.',
                            'All sessions are proxied through the server — your machine only needs to be reachable from the backend.',
                        ].map((point, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-primary flex-shrink-0" />
                                <p className="text-slate-muted text-sm leading-relaxed">{point}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="h-px bg-gradient-to-r from-slate-page via-slate-border to-slate-page" />

            {/* Final CTA */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className="text-3xl font-bold text-slate-text mb-4 font-mono">Ready to connect?</h2>
                <p className="text-slate-muted text-sm mb-8">
                    Create an account and add your first machine in under a minute.
                </p>
                <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primaryHover text-slate-text text-sm transition-colors"
                >
                    Get Started Free
                    <ChevronRight size={14} />
                </Link>
            </section>

            {/* Footer */}
            <div className='border-t border-slate-border'>
                <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

                        {/* Left — built by */}
                        <div className="text-center sm:text-left">
                            <p className="text-slate-text text-sm font-mono">
                                Built by{' '}
                                <a
                                    href="https://rashid-tau.vercel.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-brand-primaryHover hover:text-brand-primary transition-colors"
                                >
                                    Shadan Rashid
                                </a>
                                {' '}— open source &amp; self-hostable.
                            </p>
                            <p className="text-slate-muted text-sm font-mono mt-1">
                                © {new Date().getFullYear()} SSHProxy. All rights reserved.
                            </p>
                        </div>

                        {/* Right — links */}
                        <div className="flex items-center gap-5">
                            <a
                                href="https://github.com/Rashid-123/SSHProxy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-slate-muted hover:text-slate-text transition-colors text-sm font-mono"
                                aria-label="GitHub Repo"
                            >
                                <Github size={16} />
                                Repo
                            </a>
                            <span className="w-px h-3 bg-slate-border" />
                            <a
                                href="https://github.com/Rashid-123"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-muted hover:text-slate-text transition-colors"
                                aria-label="GitHub"
                            >
                                <Github size={16} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/shadan-rashid/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-muted hover:text-slate-text transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={16} />
                            </a>
                            <a
                                href="https://rashid-tau.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-muted hover:text-slate-text transition-colors"
                                aria-label="Portfolio"
                            >
                                <Globe size={16} />
                            </a>
                        </div>

                    </div>
                </footer>
            </div>

        </div>
    );
}

