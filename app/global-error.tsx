'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="nl">
      <body style={{ margin: 0, padding: 0, fontFamily: 'Inter, sans-serif' }}>
        <div 
          style={{
            minHeight: '100vh',
            backgroundColor: '#000000',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative',
          }}
        >
          {/* Noise Overlay */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.03,
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ maxWidth: '600px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
            {/* Error Icon */}
            <div style={{ marginBottom: '40px' }}>
              <svg 
                style={{ width: '120px', height: '120px', margin: '0 auto', color: '#f5c80d' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>

            {/* Title */}
            <h1 
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                marginBottom: '24px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              KRITIEKE <span style={{ color: '#f5c80d' }}>FOUT</span>
            </h1>

            {/* Description */}
            <p 
              style={{
                fontSize: '18px',
                color: '#cccccc',
                marginBottom: '40px',
                lineHeight: '1.6',
              }}
            >
              Er is een ernstige fout opgetreden. Probeer de pagina opnieuw te laden. 
              Als het probleem aanhoudt, neem dan contact met ons op.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              <button
                onClick={reset}
                style={{
                  backgroundColor: '#f5c80d',
                  color: '#000000',
                  border: '2px solid #f5c80d',
                  padding: '16px 32px',
                  borderRadius: '9999px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontSize: '14px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#000000';
                  e.currentTarget.style.color = '#f5c80d';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5c80d';
                  e.currentTarget.style.color = '#000000';
                }}
              >
                PROBEER OPNIEUW
              </button>

              <a
                href="/"
                style={{
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  padding: '16px 32px',
                  borderRadius: '9999px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.3s',
                  fontSize: '14px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#f5c80d';
                  e.currentTarget.style.backgroundColor = 'rgba(245, 200, 13, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#ffffff';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                TERUG NAAR HOME
              </a>
            </div>

            {/* Contact */}
            <div style={{ marginTop: '40px' }}>
              <p style={{ fontSize: '14px', color: '#999999' }}>
                Bel ons:{' '}
                <a 
                  href="tel:0615452108" 
                  style={{ color: '#f5c80d', textDecoration: 'none', fontWeight: '500' }}
                >
                  06 15 45 21 08
                </a>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
