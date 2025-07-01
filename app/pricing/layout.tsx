import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function PricingLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 relative overflow-hidden">
        <div className="grid-background"></div>
  
        <Header />
  
        <main className="relative z-10 pt-16">
          {children}
        </main>
  
        <Footer />
      </div>
    );
  } 