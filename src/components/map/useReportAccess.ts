'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import type { Report } from '@/sanity/types'

function getCookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1]
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/`
}

// Cookie and URL don't change while the page is open (except via
// grantAccess, which updates local state), so there's nothing to subscribe to.
const subscribe = () => () => {}

/**
 * Same access rules as the other templates: a cookie for returning
 * visitors, ?access=direct to skip (this page load only, no cookie),
 * ?reset to clear the cookie, and the CMS gate on/off switch.
 */
export function useReportAccess(report: Report) {
  const cookieKey = `report-access-${report.slug.current}`
  const gateOff = report.signupGateEnabled === false
  const [granted, setGranted] = useState(false)

  const allowedOnLoad = useSyncExternalStore(
    subscribe,
    () =>
      gateOff ||
      new URLSearchParams(window.location.search).get('access') === 'direct' ||
      Boolean(getCookie(cookieKey)),
    // Server render: locked. The browser re-checks right after hydration.
    () => false,
  )

  useEffect(() => {
    // Dev shortcut: ?reset clears the signup cookie so the gate shows again.
    if (new URLSearchParams(window.location.search).has('reset')) {
      document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
      window.location.replace(window.location.pathname)
    }
  }, [cookieKey])

  const grantAccess = useCallback(() => {
    setCookie(cookieKey, 'true', 365)
    setGranted(true)
  }, [cookieKey])

  return { hasAccess: granted || allowedOnLoad, grantAccess }
}
