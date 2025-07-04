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
          response_type: "code"
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
        if (!credentials?.email || !credentials.password) return null;
        
        try {
          // Convert to form data format for OAuth2 compatibility
          const formData = new URLSearchParams();
          formData.append('username', credentials.email);
          formData.append('password', credentials.password);
          
          const response = await axios.post(`${API_URL}/auth/login`, formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
          
          const { access_token, user } = response.data;
          
          return {
            id: user.id,
            email: user.email,
            name: user.username,
            accessToken: access_token
          };
        } catch (error) {
          return null;
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
            // Send Google token to backend for verification and account creation/login
            const response = await axios.post(`${API_URL}/auth/google`, {
              token: account.id_token,
            });
            
            const { access_token, user: backendUser } = response.data;
            
            return {
              ...token,
              accessToken: access_token,
              id: backendUser.id,
              email: backendUser.email,
              name: backendUser.username,
            };
          } catch (error) {
            console.error("Google login error:", error);
            return { ...token, error: "GoogleSignInFailed" };
          }
        } else if (user.accessToken) {
          // If using credentials provider
          return {
            ...token,
            accessToken: user.accessToken,
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
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.picture,
        };
        session.accessToken = token.accessToken;
        session.error = token.error;
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
});

export { handler as GET, handler as POST }; 