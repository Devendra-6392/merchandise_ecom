"use client";

export default function JournalSection() {
  const articles = [
    {
      id: "1",
      date: "OCTOBER 24, 2026",
      category: "EDITORIAL",
      title: "THE DECONSTRUCTION OF STREETWEAR IN PARIS FASHION WEEK",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=85",
      readTime: "4 MIN READ",
    },
    {
      id: "2",
      date: "NOVEMBER 12, 2026",
      category: "MATERIALS",
      title: "MATTER & WEIGHT: WHY WE INSIST ON 500 GSM JAPANESE COTTON",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=85",
      readTime: "6 MIN READ",
    },
    {
      id: "3",
      date: "DECEMBER 01, 2026",
      category: "ARCHIVE",
      title: "LOOKBOOK VOL. 04: BEHIND THE SCENES AT MILAN INDUSTRIAL STUDIO",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=85",
      readTime: "5 MIN READ",
    },
  ];

  return (
    <section id="journal" className="py-24 px-6 md:px-16 max-w-[1440px] mx-auto bg-surface">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-outline-variant pb-8">
        <div>
          <span className="font-body text-xs font-bold tracking-[0.2em] text-primary uppercase block mb-2">
            PRESS & ESSAYS
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-on-surface">
            THE STUDIO JOURNAL
          </h2>
        </div>
        <a
          href="#"
          className="mt-4 md:mt-0 font-body text-xs font-bold text-primary tracking-widest uppercase hover:underline editorial-line"
        >
          VIEW ALL ESSAYS →
        </a>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {articles.map((article) => (
          <article
            key={article.id}
            className="group bg-surface-container-lowest border border-outline-variant/30 hover:border-primary transition-all duration-300 flex flex-col"
          >
            <div className="aspect-[16/10] overflow-hidden relative bg-surface-container-low">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 font-body tracking-widest uppercase">
                {article.category}
              </span>
            </div>

            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <div className="flex justify-between items-center text-[11px] font-body font-medium text-on-surface-variant mb-3">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
                  {article.title}
                </h3>
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant/15 flex items-center justify-between">
                <span className="font-body text-xs font-bold text-primary tracking-wider uppercase group-hover:translate-x-2 transition-transform duration-300 inline-block">
                  READ ESSAY →
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
