import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      }
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.error("Missing email or password");
          return null;
        }
        
        try {
          // Convert to form data format for OAuth2 compatibility
          const formData = new URLSearchParams();
          formData.append('username', credentials.email);
          formData.append('password', credentials.password);
          
          console.log(`Attempting login for user: ${credentials.email}`);
          console.log(`API URL: ${API_URL}/api/v1/auth/login`);
          
          const response = await axios.post(`${API_URL}/api/v1/auth/login`, formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
          
          console.log("Login successful, response:", response.status);
          const { access_token, user } = response.data;
          
          return {
            id: user.id,
            email: user.email,
            name: user.username,
            accessToken: access_token
          };
        } catch (error) {
          // Enhanced error handling: propagate backend error details so the UI
          // shows the real reason (401, 422, etc.) instead of a generic 500.
          if (axios.isAxiosError(error) && error.response) {
            const detail = (error.response.data as any)?.detail;
            console.error('Login failed:', detail || error.message);
            throw new Error(detail || 'Invalid credentials');
          }
          console.error('Login request failed:', error);
          throw new Error('LoginRequestFailed');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // If signing in
      if (account && user) {
        if (account.provider === "google") {
          try {
            console.log("Attempting Google auth with backend...");
            // Send Google token to backend for verification and account creation/login
            const response = await axios.post(`${API_URL}/api/v1/auth/google`, {
              token: account.id_token,
            }, {
              timeout: 10000, // 10 second timeout
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            console.log("Google auth successful:", response.status);
            const { access_token, user: backendUser } = response.data;
            
            return {
              ...token,
              accessToken: access_token,
              id: backendUser.id,
              email: backendUser.email,
              name: backendUser.full_name || backendUser.username,
              username: backendUser.username,
            };
          } catch (error) {
            console.error("Google login error:", error);
            // Instead of returning error, throw to prevent sign-in
            throw new Error("GoogleSignInFailed");
          }
        } else if ((user as any).accessToken) {
          // If using credentials provider
          return {
            ...token,
            accessToken: (user as any).accessToken,
            id: user.id,
            email: user.email,
            name: user.name,
          };
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as any).user = {
          id: token.id,
          name: token.name,
          username: (token as any).username,
          email: token.email,
          image: (token as any).picture,
        };
        (session as any).accessToken = token.accessToken;
        // Remove error propagation to session
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode for better error logging
});

export { handler as GET, handler as POST }; 