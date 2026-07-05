import Image from "next/image";
import FeedbackForm from "../components/FeedbackForm";

const CONTENT = {
  hero: {
    eyebrow: "",
    headline: ["Sa Huma, Sa Lanan,", "Arunanta Bairingan."],
    ctaPrimary: { label: "Lihat Kegiatan", href: "/event" },
    ctaSecondary: { label: "Tentang Kami", href: "#tentang" },
  },

  visiMisi: {
    visi: "Mewujudkan generasi mahasiswa yang unggul, mandiri, dan berdaya saing melalui pengembangan potensi diri dan solidaritas",
    misi: [
      "Menciptakan lingkungan organisasi yang kekeluargaan, inklusif, dan profesional.",
      "Memfasilitasi kegiatan yang memperkuat ikatan antar anggota dan mendukung perkembangan diri",
      "Menanamkan nilai kepemimpinan, tanggung jawab, dan profesionalisme di kalangan anggota",
      "Memberikan ruang bagai mahasiswa untuk mengeksplorasi minat, bakat, dan kemampuan secara optimal.",
      "Mengoptimalkan penyerapan program kerja oleh sumber daya mahasiswa dan memastikan setiap departemen dapat ikut berperan secara aktif."
    ],
  },

  about: {
    eyebrow: "",
    headline: "Ruang Tumbuh Mahasiswa Ilmu Komputer.",
    body: "Himpunan Mahasiswa Ilmu Komputer (HIMAKOM) adalah organisasi kemahasiswaan yang menaungi seluruh mahasiswa Program Studi Ilmu Komputer. Berdiri sebagai wadah pengembangan diri, HIMAKOM hadir untuk menjembatani dunia akademik dengan dunia profesional melalui berbagai program kerja, kegiatan, dan komunitas.",
    stats: [
      { value: "200+", label: "Anggota Aktif" },
      { value: "20+", label: "Program Kerja" },
      { value: "5+", label: "Tahun Berdiri" },
      { value: "10+", label: "Partner Industri" },
    ],
  },

  partner: {
    label: "Partner & Komunitas",
    items: [
      { name: "Google Developer Groups", logo: "/globe.svg" },
      { name: "Microsoft", logo: "/window.svg" },
      { name: "Dicoding", logo: "/file.svg" },
      { name: "Kampus Merdeka", logo: "/globe.svg" },
      { name: "Tokopedia", logo: "/window.svg" },
      { name: "Gojek", logo: "/file.svg" },
    ],
  },

  feedback: {
    eyebrow: "",
    headline: "Bantu kami menjadi lebih baik.",
    body: "Sampaikan saran, kritik, atau apresiasi kamu terhadap kegiatan dan layanan HIMAKOM. Semua feedback diterima secara anonim dan identitas kamu sepenuhnya aman.",
  },
};

export default function BerandaPage() {
  const { hero, visiMisi, about, partner, feedback } = CONTENT;

  return (
    <>
      <main>

        {/* HERO */}
        <section
          className="hero-section relative min-h-[88vh] flex flex-col justify-end bg-cover bg-center bg-no-repeat overflow-hidden"
          aria-label="Selamat datang di HIMAKOM"
        >
          <div
            className="hero-overlay absolute inset-0"
            aria-hidden="true"
          />

          <div className="relative max-w-7xl mx-auto w-full px-6 pb-24 pt-32 flex flex-col gap-7">
            <div className="flex items-center gap-3">
              <div className="w-8 h-[1px] bg-white/50" aria-hidden="true" />
              <span className="text-xs font-semibold text-white/60 uppercase tracking-[2px]">
                {hero.eyebrow}
              </span>
            </div>

            <h1 className="text-[clamp(56px,15vw,64px)] font-semibold leading-[0.93] tracking-[-2px] text-white m-0 uppercase">
              {hero.headline.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < hero.headline.length - 1 && <br />}
                </span>
              ))}
            </h1>

            <div
              className="hero-divider w-full h-[1px] max-w-xs"
              aria-hidden="true"
            />

            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={hero.ctaPrimary.href}
                className="inline-flex items-center bg-white text-black px-6 py-2.5 text-base font-medium hover:bg-white/80 transition-all hover:shadow-lg no-underline"
              >
                {hero.ctaPrimary.label}
              </a>
              <a
                href={hero.ctaSecondary.href}
                className="inline-flex items-center border border-white/30 bg-white/5 backdrop-blur-sm px-6 py-2.5 text-sm font-medium text-white/90 hover:bg-white/15 transition-colors no-underline"
              >
                {hero.ctaSecondary.label}
              </a>
            </div>
          </div>
        </section>

        {/* VISI & MISI */}
        <section
          className="visi-misi-section py-16 px-6"
          aria-label="Visi dan Misi HIMAKOM"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

            <div
              className="visi-misi-card p-8 flex flex-col gap-4 border-t-[3px] border-t-[#1a1a1a] transition-shadow hover:shadow-xl"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1a1a1a]" aria-hidden="true" />
                <p className="text-xs font-semibold text-[#1a1a1a] uppercase tracking-[1px] m-0">Visi</p>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-1">
                <span
                  className="quote-mark text-[56px] leading-none text-[#1a1a1a] select-none"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <p className="text-[20px] leading-[1.5] text-body m-0 italic font-medium px-4">
                  {visiMisi.visi}
                </p>
                <span
                  className="quote-mark text-[56px] leading-none text-[#1a1a1a] select-none self-end"
                  aria-hidden="true"
                >
                  &rdquo;
                </span>
              </div>
            </div>

            <div
              className="visi-misi-card p-8 flex flex-col gap-4 border-t-[3px] border-t-[#1a1a1a] transition-shadow hover:shadow-xl"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1a1a1a]" aria-hidden="true" />
                <p className="text-xs font-semibold text-[#1a1a1a] uppercase tracking-[1px] m-0">Misi</p>
              </div>
              <ul className="list-none p-0 m-0 flex flex-col gap-3" role="list">
                {visiMisi.misi.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-6 text-body">
                    <span
                      aria-hidden="true"
                      className="shrink-0 w-5 h-5 bg-[#1a1a1a] text-white text-[11px] font-semibold inline-flex items-center justify-center mt-[2px]"
                    >
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        {/* ABOUT US */}
        <section
          id="tentang"
          className="about-section py-20 px-6 relative overflow-hidden"
          aria-label="Tentang HIMAKOM"
        >
          <div
            className="about-decoration absolute right-0 top-0 w-96 h-96 rounded-full opacity-30 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-primary uppercase tracking-[2px] mb-4">{about.eyebrow}</span>
              <h2
                className="text-gradient-dark text-[36px] font-semibold leading-[1.1] tracking-[-0.8px] m-0 mb-3"
              >
                {about.headline}
              </h2>
              <div className="w-10 h-[3px] rounded-full bg-primary mb-6" aria-hidden="true" />
              <p className="text-base leading-7 text-body m-0">{about.body}</p>
            </div>

            <div className="grid grid-cols-2 gap-4" aria-label="Statistik HIMAKOM">
              {about.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="stat-card p-6 flex flex-col gap-1 transition-all hover:-translate-y-1 hover:shadow-xl cursor-default"
                >
                  <p
                    className="text-black text-[40px] font-semibold leading-none tracking-[-1px] m-0 mb-1"
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-muted m-0">{stat.label}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* PARTNER */}
        <section
          className="partner-section py-12 px-6 relative"
          aria-label="Partner HIMAKOM"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8 justify-center">
              <div className="partner-line-right flex-1 h-[1px] max-w-[80px]" aria-hidden="true" />
              <p className="text-xs font-semibold text-muted uppercase tracking-[1.5px] m-0">{partner.label}</p>
              <div className="partner-line-left flex-1 h-[1px] max-w-[80px]" aria-hidden="true" />
            </div>
            <div className="flex items-center justify-center flex-wrap gap-10" role="list">
              {partner.items.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-2.5 opacity-40 hover:opacity-80 transition-all hover:scale-105 cursor-default"
                  role="listitem"
                  title={p.name}
                >
                  <Image src={p.logo} alt={p.name} width={20} height={20} className="grayscale" />
                  <span className="text-sm font-semibold text-[#555] whitespace-nowrap tracking-[-0.2px]">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEEDBACK */}
        <section
          id="feedback"
          className="feedback-section py-20 px-6 relative overflow-hidden"
          aria-label="Kirim feedback"
        >
          <div
            className="feedback-decoration absolute left-0 bottom-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-primary uppercase tracking-[2px] mb-4">{feedback.eyebrow}</span>
              <h2
                className="text-gradient-dark text-[36px] font-semibold leading-[1.1] tracking-[-0.8px] m-0 mb-3"
              >
                {feedback.headline}
              </h2>
              <div className="w-10 h-[3px] rounded-full bg-primary mb-6" aria-hidden="true" />
              <p className="text-base leading-7 text-body m-0">{feedback.body}</p>
            </div>

            <div
              className="feedback-card p-8"
            >
              <FeedbackForm />
            </div>

          </div>
        </section>

      </main>
    </>
  );
}
