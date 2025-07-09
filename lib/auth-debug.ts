// Debug utility for NextAuth configuration
export function debugAuthConfig() {
  const config = {
    nodeEnv: process.env.NODE_ENV,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextAuthSecret: process.env.NEXTAUTH_SECRET ? "✓ Set" : "✗ Missing",
    googleClientId: process.env.GOOGLE_CLIENT_ID ? "✓ Set" : "✗ Missing",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? "✓ Set" : "✗ Missing",
    publicApiUrl: process.env.NEXT_PUBLIC_API_URL,
  };

  console.log("NextAuth Configuration Debug:", config);
  return config;
}

// Check if we're in a secure context for cookies
export function checkSecureContext() {
  if (typeof window !== 'undefined') {
    return {
      isSecureContext: window.isSecureContext,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
    };
  }
  return { isSecureContext: false, protocol: 'unknown', hostname: 'server' };
} 