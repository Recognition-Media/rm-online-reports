'use client'

import { useState, useEffect } from 'react'
import type { Report, FormField } from '@/sanity/types'
import { trackSignupConversion } from '@/lib/analytics'
import { buildCioIdentity } from '@/lib/cioIdentity'
import type { MapContent } from './types'

// One theme for map reports. Values are CSS variables from the report's
// brand.css, so the gate restyles with the rest of the report.
const theme = {
  overlay: 'var(--map-gate-overlay)',
  frame: 'var(--map-gate-frame)',
  card: 'var(--map-gate-card)',
  font: 'var(--map-font-body)',
  text: 'var(--map-gate-text)',
  accent: 'var(--map-gate-accent)',
  buttonText: 'var(--map-gate-button-text)',
  privacyUrl: 'https://www.webbyawards.com/privacy-policy/',
  privacyName: 'The Webby Awards',
}

function FieldInput({ field, value, onChange }: { field: FormField; value: string; onChange: (v: string) => void }) {
  const placeholder = field.label

  if (field.fieldType === 'dropdown') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-2 bg-transparent px-1 py-2 text-base outline-none transition-colors"
      >
        <option value="">{placeholder}</option>
        {field.dropdownOptions?.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    )
  }

  return (
    <input
      type={field.fieldType}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={field.required}
      className="w-full border-0 border-b-2 bg-transparent px-1 py-2 text-base outline-none transition-colors"
    />
  )
}

export function SignupGate({ report, copy, onComplete, onClose }: { report: Report; copy: MapContent['gate']; onComplete: () => void; onClose?: () => void }) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [consented, setConsented] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fields = report.formFields || []

  function updateField(label: string, value: string) {
    setFormData((prev) => ({ ...prev, [label]: value }))
  }

  useEffect(() => {
    if (!onClose) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const cioIdentity = buildCioIdentity(fields, formData)

      // Links for Customer.io's triggered emails, built from where the
      // visitor actually signed up so the domain is right (these reports are
      // served from several). shareLink is the plain URL, so anyone it's
      // forwarded to still meets the gate and becomes a new lead;
      // privateLink carries the ?access=direct bypass so the recipient lands
      // straight in without filling the form again.
      const reportUrl = `${window.location.origin}${window.location.pathname}`
      const shareLink = reportUrl
      const privateLink = `${reportUrl}?access=direct`

      await fetch(`${process.env.NEXT_PUBLIC_SIGNUP_API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportSlug: report.slug.current,
          reportTitle: report.title,
          property: report.property || 'webby',
          formData,
          cioIdentity,
          consented,
          consentedAt: new Date().toISOString(),
          specifier: report.specifier,
          privateLink,
          shareLink,
        }),
      }).catch(() => {})

      trackSignupConversion()
      if (cioIdentity) {
        window.analytics?.identify(cioIdentity.email, {
          firstName: cioIdentity.firstName,
          lastName: cioIdentity.lastName,
          organizationName: cioIdentity.company,
          jobTitle: cioIdentity.jobTitle,
        })
        window.analytics?.track('lead_created', { source: 'gated_content' })
      }
      onComplete()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="signup-gate-scope fixed inset-0 z-50 flex items-center justify-center px-3 md:px-4 py-4"
      style={{
        // Pin to the *dynamic* viewport height. 100vh ignores mobile browser
        // chrome (the collapsing URL bar), which is what pushed the submit
        // button below the fold on phones; 100dvh tracks the usable area.
        height: '100dvh',
        background: theme.overlay,
        // CSS vars consumed by the .signup-gate-scope rules in globals.css
        // for input border / focus / placeholder colors + font.
        ['--gate-text' as string]: theme.text,
        ['--gate-accent' as string]: theme.accent,
        ['--gate-font' as string]: theme.font,
      }}
    >
      <div
        className={`w-full max-w-[575px] p-[3px] md:p-[4px] text-center flex flex-col max-h-full`}
        style={{ background: theme.frame }}
      >
        {/* The card is a flex column capped at the viewport height: the header
            and fields scroll internally while the consent line and submit
            button stay pinned to the bottom, so the CTA is reachable at any
            screen size instead of bleeding past the fold. */}
        <div
          className={`relative flex flex-col min-h-0 overflow-hidden`}
          style={{
            background: theme.card,
            fontFamily: theme.font,
          }}
        >
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-2 right-2 md:top-3 md:right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none transition-opacity cursor-pointer opacity-60 hover:opacity-100"
              style={{ color: theme.text }}
            >
              &#215;
            </button>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
            <div className="gate-scroll min-h-0 overflow-y-auto px-5 md:px-10 pt-4 md:pt-6">
              <h3
                className="uppercase font-bold text-xs md:text-sm tracking-wider pb-2 whitespace-pre-line"
                style={{ color: theme.text }}
              >
                {report.signupTitle || copy.title}
              </h3>
              <p
                className="text-xs md:text-sm mb-4 leading-relaxed whitespace-pre-line"
                style={{ color: theme.text, opacity: 0.7 }}
              >
                {report.signupSubhead || copy.subhead}
              </p>

              {/* Mobile: compact stacked inputs */}
              <div className="md:hidden flex flex-col gap-2.5 text-left">
                {fields.map((field) => (
                  <div key={field.label} className="w-full">
                    <FieldInput
                      field={field}
                      value={formData[field.label] || ''}
                      onChange={(v) => updateField(field.label, v)}
                    />
                  </div>
                ))}
              </div>

              {/* Desktop: side-by-side label + input */}
              <div className="hidden md:block">
                {fields.map((field) => (
                  <div key={field.label} className="flex flex-row items-center mb-3 text-left">
                    <label
                      className="w-[30%] text-sm font-bold text-right pr-4"
                      style={{ color: theme.text }}
                    >
                      {field.label}{field.required ? <span className="ml-0.5" style={{ color: theme.accent }}>*</span> : ''}
                    </label>
                    <div className="w-[70%]">
                      <FieldInput
                        field={field}
                        value={formData[field.label] || ''}
                        onChange={(v) => updateField(field.label, v)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="shrink-0 px-5 md:px-10 pb-4 md:pb-6 pt-2">
              {error && <p className="text-xs md:text-sm" style={{ color: theme.accent }}>{error}</p>}

              <label
                className="flex items-start gap-2 text-left text-[10px] md:text-xs mt-2 md:mt-3 cursor-pointer"
                style={{ color: theme.text, opacity: 0.7 }}
              >
                <input
                  type="checkbox"
                  checked={consented}
                  onChange={(e) => setConsented(e.target.checked)}
                  required
                  className="mt-0.5"
                />
                <span>
                  I agree to the{' '}
                  <a href={theme.privacyUrl} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: theme.text }}>
                    Privacy Policy
                  </a>{' '}
                  and consent to receive communications from {theme.privacyName}.
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting || !consented}
                className="flex items-center justify-between w-full max-w-[280px] mx-auto uppercase font-medium py-3 md:py-[14px] px-5 md:px-6 mt-3 md:mt-4 text-xs md:text-sm tracking-wider transition-colors disabled:opacity-50 cursor-pointer rounded-full"
                style={{ background: theme.accent, color: theme.buttonText }}
              >
                <span>{submitting ? 'Submitting...' : (report.submitButtonText || 'Explore The Report')}</span>
                <span className="text-base md:text-lg">→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
