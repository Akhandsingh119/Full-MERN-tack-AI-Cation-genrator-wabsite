import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-obsidian min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 sunburst pointer-events-none" />
        <div className="absolute inset-0 crosshatch-bg pointer-events-none opacity-60" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-24 pb-28 sm:pt-32 sm:pb-40">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-gold/30 bg-charcoal text-gold text-xs font-body font-semibold uppercase tracking-widest mb-10 animate-fade-in">
              <span className="w-1.5 h-1.5 bg-gold animate-glow-pulse" />
              AI-Powered Caption Generation
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-champagne leading-[1.1] tracking-wide mb-6 animate-fade-up uppercase">
              Generate Perfect{' '}
              <span className="text-gold">Captions</span> Instantly
            </h1>

            <div className="mx-auto w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-6 animate-fade-in" style={{ animationDelay: '0.05s' }} />

            <p className="text-base sm:text-lg text-champagne/60 font-body font-light leading-relaxed mb-12 max-w-lg mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Upload any image and let advanced AI craft engaging, creative captions that resonate with your audience.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="solid" size="lg">
                    Go to Dashboard
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button variant="solid" size="lg">
                      Get Started
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="default" size="lg">Sign In</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-28">
        <div className="text-center mb-16">
          <p className="text-xs font-body font-semibold uppercase tracking-widest text-gold mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-display text-champagne uppercase tracking-wide mb-4">Everything You Need</h2>
          <div className="mx-auto w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-4" />
          <p className="text-champagne/50 font-body max-w-md mx-auto">Powerful tools designed to streamline your content creation workflow.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { numeral: 'I', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>), title: 'Smart Upload', desc: 'Upload images directly with seamless processing and automatic optimization.' },
            { numeral: 'II', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>), title: 'AI Captions', desc: 'Advanced AI analyzes images and generates creative, context-aware captions.' },
            { numeral: 'III', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>), title: 'Secure & Fast', desc: 'JWT authentication with secure session management for your privacy.' },
          ].map((f) => (
            <div key={f.title} className="group bg-charcoal border border-gold/30 corner-decor p-6 sm:p-8 transition-all duration-500 hover:border-gold hover:-translate-y-2 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 border-2 border-gold/40 flex items-center justify-center text-gold transition-all duration-500 group-hover:border-gold group-hover:shadow-[0_0_10px_rgba(212,175,55,0.3)]">{f.icon}</div>
                <span className="text-2xl font-display text-gold/20 group-hover:text-gold/40 transition-colors duration-500">{f.numeral}</span>
              </div>
              <h3 className="text-base font-display text-champagne uppercase tracking-widest mb-2">{f.title}</h3>
              <p className="text-sm font-body text-champagne/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gold/20">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-charcoal" />
          <div className="absolute inset-0 sunburst pointer-events-none opacity-50" />
          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-24 text-center">
            <p className="text-xs font-body font-semibold uppercase tracking-widest text-gold mb-4">Begin Your Journey</p>
            <h2 className="text-3xl sm:text-4xl font-display text-champagne uppercase tracking-wide mb-4">Ready to Create Amazing Captions?</h2>
            <div className="mx-auto w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-4" />
            <p className="text-champagne/50 font-body text-base mb-12 max-w-md mx-auto">Join now and start generating AI-powered captions for your images.</p>
            {!isAuthenticated && (
              <Link to="/register">
                <Button variant="solid" size="lg">
                  Start for Free
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
