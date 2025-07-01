"use client"

const partners = [
  {
    name: "arXiv",
    logo_dark: "https://cdn.simpleicons.org/arxiv/FFFFFF",
    logo_light: "https://cdn.simpleicons.org/arxiv/000000",
  },
  {
    name: "Semantic Scholar",
    logo_dark: "https://cdn.simpleicons.org/semanticscholar/FFFFFF",
    logo_light: "https://cdn.simpleicons.org/semanticscholar/000000",
  },
  {
    name: "Google Scholar",
    logo_dark: "https://cdn.simpleicons.org/googlescholar/FFFFFF",
    logo_light: "https://cdn.simpleicons.org/googlescholar/000000",
  },
  {
    name: "Scopus",
    logo_dark: "https://cdn.simpleicons.org/scopus/FFFFFF",
    logo_light: "https://cdn.simpleicons.org/scopus/000000",
  },
  {
    name: "IEEE",
    logo_dark: "https://cdn.simpleicons.org/ieee/FFFFFF",
    logo_light: "https://cdn.simpleicons.org/ieee/000000",
  },
  {
    name: "ResearchGate",
    logo_dark: "https://cdn.simpleicons.org/researchgate/FFFFFF",
    logo_light: "https://cdn.simpleicons.org/researchgate/000000",
  },
  {
    name: "Springer",
    logo_dark: "/logo/springer.svg",
    logo_light: "/logo/springer.svg",
  },
  {
    name: "ACM",
    logo_dark: "/logo/acm.svg",
    logo_light: "/logo/acm.svg",
  },
  {
    name: "PubMed",
    logo_dark: "https://cdn.simpleicons.org/pubmed/FFFFFF",
    logo_light: "https://cdn.simpleicons.org/pubmed/000000",
  },
];

const Partners = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-white dark:bg-black">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black opacity-80 pointer-events-none"></div>
      
      {/* Subtle grid background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTMwIDMwaDMwVjBoLTMwdjMwem0wIDMwaDMwVjMwaC0zMHpNMCA2MGgzMFYzMEgwdjMwem0wLTMwaDMwVjBIMHYzMHoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+')]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">Powering the world's best research</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-16 text-center">From academic institutions to cutting-edge research labs</p>
          
          <div className="w-full overflow-hidden">
            <div className="flex w-max animate-scroll hover:paused">
              {[...partners, ...partners].map((partner, index) => (
                <div
                  key={index}
                  className="group flex flex-col items-center mx-8"
                >
                  <img
                    src={partner.logo_light}
                    alt={partner.name}
                    className="h-12 opacity-80 group-hover:opacity-100 transition-opacity dark:hidden"
                  />
                  <img
                    src={partner.logo_dark}
                    alt={partner.name}
                    className="h-12 opacity-80 group-hover:opacity-100 transition-opacity hidden dark:inline-block"
                  />
                  <span className="mt-2 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Partners
