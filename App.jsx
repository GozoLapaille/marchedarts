import { useState } from "react";

// ─── COULEURS ─────────────────────────────────────────────────────────────────
const C = {
  bg: "#0F0E0C",
  surface: "#1A1814",
  card: "#221F1B",
  border: "#2E2A24",
  borderLight: "#3D3830",
  gold: "#C9A84C",
  goldDim: "#8A6E2E",
  cream: "#F0EAD6",
  muted: "#7A7060",
  text: "#E8E0CC",
  white: "#FFFFFF",
  green: "#3A7A4A",
  red: "#7A3030",
};

// ─── DONNÉES ──────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Tous", "Peinture", "Sculpture", "Dessin", "Aquarelle",
  "Art numérique", "Photographie", "Gravure", "Art abstrait",
  "Street art", "Céramique", "Textile", "Bijoux", "Collage", "Autre",
];

const ARTISTS_INIT = [
  { id: 1, name: "Élise Moreau",   avatar: "EM", bio: "Peintre expressionniste basée à Lyon. Ses toiles explorent la lumière et la mémoire.", specialty: "Peinture",      location: "Lyon",     sales: 142, rating: 4.9 },
  { id: 2, name: "Thomas Vidal",   avatar: "TV", bio: "Sculpteur contemporain. Chaque œuvre est une conversation avec le silence.",           specialty: "Sculpture",     location: "Paris",    sales: 89,  rating: 4.7 },
  { id: 3, name: "Camille Renard", avatar: "CR", bio: "Aquarelliste et illustratrice. L'eau comme médium de l'âme.",                          specialty: "Aquarelle",     location: "Bordeaux", sales: 203, rating: 5.0 },
  { id: 4, name: "Hugo Blanc",     avatar: "HB", bio: "Art numérique et gravure traditionnelle. Entre pixels et encre.",                      specialty: "Art numérique", location: "Nantes",   sales: 67,  rating: 4.6 },
];

const ARTWORKS_INIT = [
  { id: 1, artistId: 1, title: "Lumière d'Octobre",  price: 1200, category: "Peinture",      size: "80×100 cm", medium: "Huile sur toile",      year: 2024, sold: false, featured: true,  color: "#6B4A10", accent: "#C8900A", desc: "Une exploration de la lumière automnale." },
  { id: 2, artistId: 1, title: "Mémoire d'Été",      price: 850,  category: "Peinture",      size: "60×80 cm",  medium: "Huile sur toile",      year: 2023, sold: false, featured: false, color: "#1A4A2A", accent: "#4A9A6A", desc: "Les souvenirs d'une saison en palette de verts." },
  { id: 3, artistId: 2, title: "Silence Minéral I",  price: 2400, category: "Sculpture",     size: "40×20 cm",  medium: "Marbre blanc",         year: 2024, sold: false, featured: true,  color: "#4A4238", accent: "#9A8A78", desc: "La pureté du marbre taillé à la main." },
  { id: 4, artistId: 2, title: "Ombre et Lumière",   price: 680,  category: "Photographie",  size: "70×50 cm",  medium: "Tirage argentique",    year: 2023, sold: true,  featured: false, color: "#181818", accent: "#686058", desc: "Contraste dramatique, tirage argentique numéroté." },
  { id: 5, artistId: 3, title: "Rivière Bleue",      price: 420,  category: "Aquarelle",     size: "50×35 cm",  medium: "Aquarelle sur papier", year: 2024, sold: false, featured: true,  color: "#0A2A4A", accent: "#3A78A8", desc: "Le mouvement de l'eau en nuances de bleu." },
  { id: 6, artistId: 3, title: "Jardin Secret",      price: 380,  category: "Aquarelle",     size: "40×30 cm",  medium: "Aquarelle sur papier", year: 2024, sold: false, featured: false, color: "#0A3A0A", accent: "#4A8A4A", desc: "Un jardin imaginaire aux couleurs douces." },
  { id: 7, artistId: 4, title: "Fractale no.7",      price: 320,  category: "Art numérique", size: "60×60 cm",  medium: "Impression giclée",    year: 2024, sold: false, featured: false, color: "#050518", accent: "#4040A0", desc: "Beauté fractale, édition limitée 30 ex." },
  { id: 8, artistId: 4, title: "Gravure Virtuelle",  price: 290,  category: "Art numérique", size: "50×70 cm",  medium: "Impression giclée",    year: 2023, sold: false, featured: false, color: "#180A05", accent: "#885020", desc: "Fusion gravure traditionnelle et numérique." },
];

const ORDERS_INIT = [
  { id: "CMD-001", artwork: "Rivière Bleue",     buyer: "Marie D.",  amount: 420,  status: "expédié",    date: "12 mars 2025", tracking: "CP123456789FR" },
  { id: "CMD-002", artwork: "Fractale no.7",     buyer: "Pierre L.", amount: 320,  status: "en attente", date: "15 mars 2025", tracking: null },
  { id: "CMD-003", artwork: "Lumière d'Octobre", buyer: "Sophie M.", amount: 1200, status: "livré",      date: "2 mars 2025",  tracking: "CP987654321FR" },
];

const MESSAGES_INIT = [
  { id: 1, from: "Marie Dupont",  avatar: "MD", preview: "Bonjour, est-ce que Rivière Bleue est disponible ?", time: "10h32", read: false, thread: [
    { text: "Bonjour, est-ce que Rivière Bleue est disponible ?", mine: false, time: "10h32" },
  ]},
  { id: 2, from: "Pierre Martin", avatar: "PM", preview: "Je voudrais commander une œuvre sur mesure.", time: "Hier", read: true, thread: [
    { text: "Je voudrais commander une œuvre sur mesure.", mine: false, time: "Hier" },
    { text: "Bonjour Pierre, oui c'est possible ! Dites-moi vos idées.", mine: true, time: "Hier" },
  ]},
];

const fmt = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
const getArtist = (id) => ARTISTS_INIT.find((a) => a.id === id);

// ─── HOOK MOBILE ──────────────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 640);
  useState(() => {
    const h = () => setMobile(window.innerWidth < 640);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  });
  return mobile;
}

// ─── COMPOSANTS UI ────────────────────────────────────────────────────────────
function Badge({ color, children }) {
  return (
    <span style={{ background: color, color: C.white, fontSize: 10, letterSpacing: 1.5, padding: "3px 8px", fontFamily: "Georgia,serif" }}>
      {children}
    </span>
  );
}

function Btn({ onClick, style = {}, children, variant = "primary" }) {
  const base = {
    border: "none", cursor: "pointer", fontFamily: "Georgia,serif",
    letterSpacing: 1.5, fontSize: 11, padding: "11px 20px", transition: "opacity 0.2s",
  };
  const variants = {
    primary:  { background: C.gold,    color: C.bg },
    dark:     { background: C.surface, color: C.cream, border: `1px solid ${C.border}` },
    ghost:    { background: "transparent", color: C.muted, border: `1px solid ${C.border}` },
    danger:   { background: C.red,     color: C.white },
    success:  { background: C.green,   color: C.white },
  };
  return <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
}

function Input({ placeholder, value, onChange, type = "text", style = {} }) {
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, padding: "11px 14px", fontSize: 13, outline: "none", fontFamily: "Georgia,serif", width: "100%", boxSizing: "border-box", ...style }}
    />
  );
}

function Select({ value, onChange, options, style = {} }) {
  return (
    <select value={value} onChange={onChange} style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, padding: "11px 14px", fontSize: 13, outline: "none", fontFamily: "Georgia,serif", width: "100%", boxSizing: "border-box", ...style }}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Avatar({ initials, size = 40 }) {
  return (
    <div style={{ width: size, height: size, background: C.goldDim, color: C.gold, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: size * 0.35, fontStyle: "italic", flexShrink: 0, border: `1px solid ${C.goldDim}` }}>
      {initials}
    </div>
  );
}

// ─── ARTWORK CARD ─────────────────────────────────────────────────────────────
function ArtCard({ artwork, onAdd, onView, inCart }) {
  const artist = getArtist(artwork.artistId);
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ background: C.card, border: `1px solid ${hover ? C.gold : C.border}`, transition: "all 0.3s", transform: hover ? "translateY(-3px)" : "none", boxShadow: hover ? `0 12px 32px rgba(201,168,76,0.12)` : "none", overflow: "hidden", cursor: "pointer", width: "100%", boxSizing: "border-box" }}
    >
      <div onClick={() => onView(artwork)} style={{ height: 200, background: `linear-gradient(135deg, ${artwork.color}, ${artwork.accent})`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {artwork.sold && <div style={{ position: "absolute", top: 10, right: 10 }}><Badge color={C.red}>VENDU</Badge></div>}
        {artwork.featured && !artwork.sold && <div style={{ position: "absolute", top: 10, left: 10 }}><Badge color={C.goldDim}>COUP DE CŒUR</Badge></div>}
        <div style={{ color: "rgba(255,255,255,0.15)", fontFamily: "Georgia,serif", fontSize: 10, letterSpacing: 2 }}>{artwork.medium.toUpperCase()}</div>
      </div>
      <div style={{ padding: "16px" }}>
        <div style={{ fontFamily: "Georgia,serif", fontSize: 15, color: C.cream, fontStyle: "italic", marginBottom: 3 }}>{artwork.title}</div>
        <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1, marginBottom: 12 }}>{artist?.name} · {artwork.year}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "Georgia,serif", fontSize: 17, color: C.gold }}>{fmt(artwork.price)}</div>
          {!artwork.sold && (
            <Btn onClick={(e) => { e.stopPropagation(); onAdd(artwork); }} variant={inCart ? "success" : "ghost"} style={{ padding: "6px 12px", fontSize: 10 }}>
              {inCart ? "✓ PANIER" : "+ PANIER"}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MODAL ŒUVRE ─────────────────────────────────────────────────────────────
function ArtworkModal({ artwork, onClose, onAdd, inCart }) {
  const artist = getArtist(artwork.artistId);
  const isMobile = useIsMobile();
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.card, width: "100%", maxWidth: 760, maxHeight: "90vh", overflowY: "auto", display: isMobile ? "block" : "grid", gridTemplateColumns: "1fr 1fr", border: `1px solid ${C.border}` }}>
        <div style={{ height: isMobile ? 220 : 460, background: `linear-gradient(135deg, ${artwork.color}, ${artwork.accent})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "rgba(255,255,255,0.15)", fontFamily: "Georgia,serif", fontSize: 10, letterSpacing: 3 }}>{artwork.medium.toUpperCase()}</div>
        </div>
        <div style={{ padding: isMobile ? "24px 20px" : "36px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 20 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: C.gold, marginBottom: 6 }}>{artwork.category.toUpperCase()}</div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 22, fontStyle: "italic", color: C.cream, marginBottom: 4 }}>{artwork.title}</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>par {artist?.name}, {artwork.year}</div>
            <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "14px 0", marginBottom: 16 }}>
              {[["Médium", artwork.medium], ["Format", artwork.size], ["Ville", artist?.location]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: C.muted, letterSpacing: 1 }}>{l.toUpperCase()}</span>
                  <span style={{ color: C.text, fontFamily: "Georgia,serif" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.8, fontStyle: "italic" }}>{artwork.desc}</div>
          </div>
          <div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 26, color: C.gold, marginBottom: 14 }}>{fmt(artwork.price)}</div>
            {!artwork.sold
              ? <Btn onClick={() => { onAdd(artwork); onClose(); }} variant={inCart ? "dark" : "primary"} style={{ width: "100%" }}>{inCart ? "✓ DÉJÀ DANS LE PANIER" : "AJOUTER AU PANIER"}</Btn>
              : <div style={{ textAlign: "center", padding: 13, background: C.surface, color: C.muted, fontSize: 11, letterSpacing: 2 }}>ŒUVRE VENDUE</div>
            }
            <Btn onClick={onClose} variant="ghost" style={{ width: "100%", marginTop: 8 }}>FERMER</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE GALERIE ─────────────────────────────────────────────────────────────
function Gallery({ onAdd, cart, onView, artworks }) {
  const [filter, setFilter] = useState("Tous");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("récent");

  let filtered = artworks.filter((a) => {
    const matchCat = filter === "Tous" || a.category === filter;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || getArtist(a.artistId)?.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  if (sort === "prix-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "prix-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>
      {/* Hero */}
      <div style={{ background: C.surface, padding: "56px 20px", textAlign: "center", borderBottom: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(201,168,76,0.02) 60px, rgba(201,168,76,0.02) 120px)`, pointerEvents: "none" }} />
        <div style={{ fontFamily: "Georgia,serif", fontSize: 10, letterSpacing: 6, color: C.gold, marginBottom: 16 }}>MARCHÉ D'ARTS</div>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(30px,8vw,52px)", fontStyle: "italic", color: C.cream, fontWeight: "normal", margin: "0 0 12px", lineHeight: 1.1 }}>
          L'art à portée de main
        </h1>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: 32, letterSpacing: 0.5 }}>
          Achetez et vendez des œuvres d'art originales — peinture, sculpture, photographie et plus encore
        </p>
        <Input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une œuvre, un artiste…"
          style={{ maxWidth: 400, margin: "0 auto", display: "block", background: "rgba(255,255,255,0.05)" }}
        />
      </div>

      {/* Filtres catégories */}
      <div style={{ borderBottom: `1px solid ${C.border}`, display: "flex", overflowX: "auto", background: C.surface, WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)} style={{ background: "none", border: "none", padding: "13px 14px", fontSize: 10, letterSpacing: 1.5, cursor: "pointer", color: filter === cat ? C.gold : C.muted, borderBottom: filter === cat ? `2px solid ${C.gold}` : "2px solid transparent", fontFamily: "Georgia,serif", whiteSpace: "nowrap", flexShrink: 0 }}>
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tri */}
      <div style={{ padding: "12px 16px", display: "flex", justifyContent: "flex-end", background: C.bg, borderBottom: `1px solid ${C.border}` }}>
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted, padding: "6px 10px", fontSize: 11, outline: "none", fontFamily: "Georgia,serif" }}>
          <option value="récent">Plus récent</option>
          <option value="prix-asc">Prix croissant</option>
          <option value="prix-desc">Prix décroissant</option>
        </select>
      </div>

      {/* Grille */}
      <div style={{ padding: "24px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(260px,100%), 1fr))", gap: 20, background: C.bg }}>
        {filtered.map((a) => <ArtCard key={a.id} artwork={a} onAdd={onAdd} onView={onView} inCart={cart.some((c) => c.id === a.id)} />)}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: C.muted, fontFamily: "Georgia,serif", fontStyle: "italic" }}>
            Aucune œuvre ne correspond à votre recherche.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PAGE ARTISTES ────────────────────────────────────────────────────────────
function Artists({ setPage, setSelectedArtist, artworks }) {
  return (
    <div style={{ padding: "32px 16px", background: C.bg, boxSizing: "border-box" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 10, letterSpacing: 5, color: C.gold, marginBottom: 10, fontFamily: "Georgia,serif" }}>CRÉATEURS</div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(24px,7vw,36px)", fontStyle: "italic", fontWeight: "normal", color: C.cream, margin: 0 }}>Nos Artistes</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px,100%), 1fr))", gap: 20 }}>
        {ARTISTS_INIT.map((artist) => {
          const works = artworks.filter((a) => a.artistId === artist.id);
          return (
            <div key={artist.id} style={{ border: `1px solid ${C.border}`, padding: 24, background: C.card, boxSizing: "border-box" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
                <Avatar initials={artist.avatar} size={50} />
                <div>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 16, color: C.cream }}>{artist.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{artist.specialty} · {artist.location}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>{artist.bio}</p>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${C.border}`, paddingTop: 14, marginBottom: 16 }}>
                {[["ŒUVRES", works.length], ["VENTES", artist.sales], ["NOTE", artist.rating]].map(([label, val]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "Georgia,serif", fontSize: 18, color: label === "NOTE" ? C.gold : C.cream }}>{val}</div>
                    <div style={{ fontSize: 10, color: C.muted, letterSpacing: 1 }}>{label}</div>
                  </div>
                ))}
              </div>
              <Btn onClick={() => { setSelectedArtist(artist); setPage("artist"); }} variant="dark" style={{ width: "100%" }}>
                VOIR LE PORTFOLIO
              </Btn>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PAGE PROFIL ARTISTE ──────────────────────────────────────────────────────
function ArtistProfile({ artist, onAdd, cart, onView, goBack, artworks }) {
  const works = artworks.filter((a) => a.artistId === artist.id);
  return (
    <div style={{ background: C.bg }}>
      <div style={{ background: C.surface, padding: "32px 16px", borderBottom: `1px solid ${C.border}` }}>
        <Btn onClick={goBack} variant="ghost" style={{ marginBottom: 20, padding: "7px 14px", fontSize: 10 }}>← RETOUR</Btn>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Avatar initials={artist.avatar} size={64} />
          <div>
            <div style={{ fontSize: 10, letterSpacing: 4, color: C.gold, marginBottom: 4 }}>ARTISTE</div>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(20px,6vw,28px)", fontStyle: "italic", color: C.cream, fontWeight: "normal", margin: "0 0 4px" }}>{artist.name}</h2>
            <div style={{ fontSize: 11, color: C.muted }}>{artist.specialty} · {artist.location}</div>
          </div>
        </div>
      </div>
      <div style={{ padding: "20px 16px", background: C.card, borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontStyle: "italic", fontSize: 14, color: C.muted, lineHeight: 1.8, margin: 0 }}>{artist.bio}</p>
      </div>
      <div style={{ padding: "24px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(260px,100%), 1fr))", gap: 20 }}>
        {works.map((a) => <ArtCard key={a.id} artwork={a} onAdd={onAdd} onView={onView} inCart={cart.some((c) => c.id === a.id)} />)}
      </div>
    </div>
  );
}

// ─── PAGE PANIER ──────────────────────────────────────────────────────────────
function Cart({ cart, onRemove, onCheckout }) {
  const total = cart.reduce((s, a) => s + a.price, 0);
  const commission = total * 0.10;
  const artistTotal = total - commission;

  return (
    <div style={{ padding: "32px 16px 60px", maxWidth: 680, margin: "0 auto", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 10, letterSpacing: 5, color: C.gold, marginBottom: 10, fontFamily: "Georgia,serif" }}>SÉLECTION</div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(24px,7vw,36px)", fontStyle: "italic", fontWeight: "normal", color: C.cream, margin: 0 }}>Votre Panier</h2>
      </div>
      {cart.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48, color: C.muted, fontStyle: "italic", fontSize: 15, background: C.card, border: `1px solid ${C.border}` }}>
          Votre panier est vide
        </div>
      ) : (
        <>
          {cart.map((a) => (
            <div key={a.id} style={{ display: "flex", gap: 14, alignItems: "center", background: C.card, border: `1px solid ${C.border}`, padding: 16, marginBottom: 10, boxSizing: "border-box" }}>
              <div style={{ width: 60, height: 60, background: `linear-gradient(135deg, ${a.color}, ${a.accent})`, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 14, fontStyle: "italic", color: C.cream, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{getArtist(a.artistId)?.name}</div>
              </div>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 15, color: C.gold, flexShrink: 0 }}>{fmt(a.price)}</div>
              <button onClick={() => onRemove(a.id)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20, padding: "0 4px" }}>×</button>
            </div>
          ))}

          {/* Récapitulatif */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: 20, marginTop: 8, marginBottom: 24 }}>
            {[["Sous-total", fmt(total)], ["Commission plateforme (10%)", `- ${fmt(commission)}`], ["Reversal artiste", fmt(artistTotal)]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 8 }}>
                <span>{l}</span><span style={{ fontFamily: "Georgia,serif" }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, letterSpacing: 2, color: C.text, fontFamily: "Georgia,serif" }}>TOTAL</span>
              <span style={{ fontFamily: "Georgia,serif", fontSize: 22, color: C.gold }}>{fmt(total)}</span>
            </div>
          </div>

          <Btn onClick={onCheckout} variant="primary" style={{ width: "100%", padding: 15, fontSize: 12 }}>PROCÉDER AU PAIEMENT</Btn>
          <p style={{ textAlign: "center", fontSize: 11, color: C.muted, marginTop: 14 }}>
            🔒 Paiement sécurisé · Certificat d'authenticité inclus
          </p>
        </>
      )}
    </div>
  );
}

// ─── PAGE MESSAGERIE ──────────────────────────────────────────────────────────
function Messaging() {
  const [msgs, setMsgs] = useState(MESSAGES_INIT);
  const [selectedId, setSelectedId] = useState(null);
  const [text, setText] = useState("");
  const isMobile = useIsMobile();
  const selected = msgs.find((m) => m.id === selectedId);

  const send = () => {
    if (!text.trim() || !selectedId) return;
    setMsgs((ms) => ms.map((m) => m.id === selectedId
      ? { ...m, thread: [...m.thread, { text, mine: true, time: "Maintenant" }], preview: text }
      : m
    ));
    setText("");
    setTimeout(() => {
      setMsgs((ms) => ms.map((m) => m.id === selectedId
        ? { ...m, thread: [...m.thread, { text: "Merci pour votre message !", mine: false, time: "Maintenant" }] }
        : m
      ));
    }, 1200);
  };

  const MsgList = () => (
    <div style={{ background: C.surface, borderRight: `1px solid ${C.border}`, overflowY: "auto" }}>
      <div style={{ padding: "16px", borderBottom: `1px solid ${C.border}`, fontSize: 10, letterSpacing: 3, color: C.gold, fontFamily: "Georgia,serif" }}>MESSAGES</div>
      {msgs.map((m) => (
        <div key={m.id} onClick={() => { setSelectedId(m.id); setMsgs((ms) => ms.map((x) => x.id === m.id ? { ...x, read: true } : x)); }}
          style={{ padding: "14px 16px", cursor: "pointer", background: selectedId === m.id ? C.card : C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", gap: 12, alignItems: "center" }}>
          <Avatar initials={m.avatar} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: 13, color: C.cream, fontFamily: "Georgia,serif" }}>{m.from}</div>
              <div style={{ fontSize: 10, color: C.muted }}>{m.time}</div>
            </div>
            <div style={{ fontSize: 11, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.preview}</div>
          </div>
          {!m.read && <div style={{ width: 7, height: 7, background: C.gold, borderRadius: "50%", flexShrink: 0 }} />}
        </div>
      ))}
    </div>
  );

  const Conversation = () => (
    <div style={{ display: "flex", flexDirection: "column", height: isMobile ? "calc(100vh - 60px)" : "100%", background: C.bg }}>
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, background: C.surface }}>
        {isMobile && <button onClick={() => setSelectedId(null)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20 }}>←</button>}
        <Avatar initials={selected?.avatar} size={36} />
        <div style={{ fontFamily: "Georgia,serif", fontSize: 14, color: C.cream }}>{selected?.from}</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {selected?.thread.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.mine ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "75%", background: msg.mine ? C.goldDim : C.card, color: msg.mine ? C.cream : C.text, border: `1px solid ${msg.mine ? C.goldDim : C.border}`, padding: "10px 14px", fontSize: 13, fontFamily: "Georgia,serif", lineHeight: 1.6 }}>
              {msg.text}
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{msg.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, background: C.surface }}>
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Écrire un message…" style={{ background: C.card }} />
        <Btn onClick={send} variant="primary" style={{ flexShrink: 0, padding: "11px 16px" }}>→</Btn>
      </div>
    </div>
  );

  if (isMobile) {
    return selectedId === null ? <MsgList /> : <Conversation />;
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", height: "calc(100vh - 60px)" }}>
      <MsgList />
      {selectedId ? <Conversation /> : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontStyle: "italic", background: C.bg }}>
          Sélectionnez une conversation
        </div>
      )}
    </div>
  );
}

// ─── PAGE TABLEAU DE BORD ARTISTE ─────────────────────────────────────────────
function Dashboard({ artworks, setArtworks }) {
  const [tab, setTab] = useState("oeuvres");
  const [orders] = useState(ORDERS_INIT);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", price: "", category: "Peinture", size: "", medium: "", desc: "", color: "#8B4513", accent: "#D2691E" });

  const myArtworks = artworks.filter((a) => a.artistId === 1);
  const totalRevenu = orders.filter((o) => o.status === "livré").reduce((s, o) => s + o.amount * 0.9, 0);

  const addArtwork = () => {
    if (!form.title || !form.price) return;
    const newArt = { id: Date.now(), artistId: 1, title: form.title, price: parseFloat(form.price), category: form.category, size: form.size || "Format libre", medium: form.medium || "Technique mixte", year: new Date().getFullYear(), sold: false, featured: false, color: form.color, accent: form.accent, desc: form.desc };
    setArtworks((prev) => [...prev, newArt]);
    setShowForm(false);
    setForm({ title: "", price: "", category: "Peinture", size: "", medium: "", desc: "", color: "#8B4513", accent: "#D2691E" });
  };

  const statusColor = { "livré": C.green, "expédié": C.goldDim, "en attente": C.border };
  const tabs = [["oeuvres", "MES ŒUVRES"], ["commandes", "COMMANDES"], ["stats", "STATISTIQUES"]];

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: C.surface, padding: "24px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <Avatar initials="EM" size={50} />
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: C.gold, fontFamily: "Georgia,serif" }}>TABLEAU DE BORD</div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 18, fontStyle: "italic", color: C.cream }}>Élise Moreau</div>
          </div>
        </div>
        {/* Stats rapides */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[["ŒUVRES", myArtworks.length], ["VENTES", "142"], ["REVENUS", fmt(totalRevenu)]].map(([l, v]) => (
            <div key={l} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "14px 10px", textAlign: "center" }}>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 18, color: C.gold }}>{v}</div>
              <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, background: C.surface, overflowX: "auto" }}>
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ background: "none", border: "none", padding: "13px 16px", fontSize: 10, letterSpacing: 1.5, cursor: "pointer", color: tab === id ? C.gold : C.muted, borderBottom: tab === id ? `2px solid ${C.gold}` : "2px solid transparent", fontFamily: "Georgia,serif", whiteSpace: "nowrap" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: 16 }}>

        {/* Onglet Œuvres */}
        {tab === "oeuvres" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: C.muted }}>{myArtworks.length} œuvre(s) publiée(s)</div>
              <Btn onClick={() => setShowForm(!showForm)} variant="primary" style={{ padding: "9px 16px", fontSize: 10 }}>
                {showForm ? "ANNULER" : "+ AJOUTER UNE ŒUVRE"}
              </Btn>
            </div>

            {/* Formulaire ajout */}
            {showForm && (
              <div style={{ background: C.card, border: `1px solid ${C.gold}`, padding: 20, marginBottom: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: C.gold, fontFamily: "Georgia,serif", marginBottom: 4 }}>NOUVELLE ŒUVRE</div>
                <Input placeholder="Titre de l'œuvre *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <Input placeholder="Prix en € *" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} type="number" />
                <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={CATEGORIES.slice(1)} />
                <Input placeholder="Format (ex: 80×100 cm)" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
                <Input placeholder="Médium (ex: Huile sur toile)" value={form.medium} onChange={(e) => setForm({ ...form, medium: e.target.value })} />
                <Input placeholder="Description de l'œuvre" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>Couleurs :</div>
                  <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} style={{ width: 40, height: 32, border: "none", background: "none", cursor: "pointer" }} />
                  <input type="color" value={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.value })} style={{ width: 40, height: 32, border: "none", background: "none", cursor: "pointer" }} />
                  <div style={{ width: 60, height: 32, background: `linear-gradient(135deg, ${form.color}, ${form.accent})` }} />
                </div>
                <Btn onClick={addArtwork} variant="primary" style={{ width: "100%" }}>PUBLIER L'ŒUVRE</Btn>
              </div>
            )}

            {/* Liste œuvres */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {myArtworks.map((a) => (
                <div key={a.id} style={{ background: C.card, border: `1px solid ${C.border}`, padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 50, height: 50, background: `linear-gradient(135deg, ${a.color}, ${a.accent})`, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "Georgia,serif", fontSize: 14, fontStyle: "italic", color: C.cream, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{a.category} · {fmt(a.price)}</div>
                  </div>
                  <Badge color={a.sold ? C.red : C.green}>{a.sold ? "VENDU" : "EN VENTE"}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Onglet Commandes */}
        {tab === "commandes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {orders.map((o) => (
              <div key={o.id} style={{ background: C.card, border: `1px solid ${C.border}`, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: "Georgia,serif", fontSize: 14, fontStyle: "italic", color: C.cream }}>{o.artwork}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{o.buyer} · {o.date}</div>
                  </div>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 16, color: C.gold }}>{fmt(o.amount * 0.9)}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Badge color={statusColor[o.status] || C.border}>{o.status.toUpperCase()}</Badge>
                  {o.tracking && <div style={{ fontSize: 10, color: C.muted, fontFamily: "Georgia,serif" }}>📦 {o.tracking}</div>}
                  {o.status === "en attente" && <Btn variant="primary" style={{ padding: "5px 12px", fontSize: 10 }}>MARQUER EXPÉDIÉ</Btn>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Onglet Stats */}
        {tab === "stats" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["Revenus ce mois", fmt(1450), C.gold],
              ["Revenus totaux", fmt(totalRevenu), C.gold],
              ["Taux de vente", "78%", C.green],
              ["Note moyenne", "4.9 / 5", C.gold],
              ["Œuvres vues", "1 284", C.text],
              ["Nouveaux messages", "3", C.text],
            ].map(([l, v, col]) => (
              <div key={l} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>{l.toUpperCase()}</div>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 20, color: col }}>{v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MODAL PAIEMENT ───────────────────────────────────────────────────────────
function CheckoutModal({ onClose, total }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ nom: "", adresse: "", ville: "", pays: "France", carte: "", expiry: "", cvv: "" });
  const steps = ["Livraison", "Paiement", "Confirmation"];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.card, width: "100%", maxWidth: 480, padding: "36px 24px", border: `1px solid ${C.border}`, maxHeight: "90vh", overflowY: "auto", boxSizing: "border-box" }}>
        {/* Steps */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 28 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 26, height: 26, background: i + 1 <= step ? C.gold : "transparent", border: `1px solid ${i + 1 <= step ? C.gold : C.border}`, color: i + 1 <= step ? C.bg : C.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontFamily: "Georgia,serif" }}>
                {i + 1 < step ? "✓" : i + 1}
              </div>
              {i < 2 && <div style={{ width: 28, height: 1, background: i + 1 < step ? C.gold : C.border }} />}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 10, letterSpacing: 3, color: C.gold, textAlign: "center", marginBottom: 4, fontFamily: "Georgia,serif" }}>ÉTAPE {step}/3</div>
        <h3 style={{ fontFamily: "Georgia,serif", fontSize: 20, fontStyle: "italic", fontWeight: "normal", color: C.cream, textAlign: "center", marginBottom: 24 }}>{steps[step - 1]}</h3>

        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[["nom", "Nom complet"], ["adresse", "Adresse"], ["ville", "Ville & Code postal"], ["pays", "Pays"]].map(([k, p]) => (
              <Input key={k} placeholder={p} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
            ))}
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: 14, display: "flex", gap: 12, marginBottom: 4 }}>
              {["💳 Carte", "🍎 Apple Pay", "G Google Pay"].map((m) => (
                <div key={m} style={{ fontSize: 12, color: C.muted, cursor: "pointer" }}>{m}</div>
              ))}
            </div>
            {[["carte", "Numéro de carte"], ["expiry", "MM/AA"], ["cvv", "CVV"]].map(([k, p]) => (
              <Input key={k} placeholder={p} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
            ))}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: 14, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: C.muted }}>Total</span>
              <span style={{ color: C.gold, fontFamily: "Georgia,serif" }}>{fmt(total)}</span>
            </div>
            <div style={{ fontSize: 11, color: C.muted, textAlign: "center" }}>🔒 Paiement sécurisé par Stripe</div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 60, height: 60, background: C.green, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 20px", borderRadius: "50%" }}>✓</div>
            <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 14, color: C.muted, lineHeight: 1.9 }}>
              Commande confirmée !<br />
              Vous recevrez un e-mail avec votre certificat d'authenticité.
            </p>
          </div>
        )}

        <Btn onClick={() => step < 3 ? setStep((s) => s + 1) : onClose()} variant="primary" style={{ width: "100%", marginTop: 24, padding: 14, fontSize: 12 }}>
          {step < 3 ? "CONTINUER →" : "FERMER"}
        </Btn>
      </div>
    </div>
  );
}

// ─── PAGE INSCRIPTION ─────────────────────────────────────────────────────────
function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("acheteur");
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "40px 28px", width: "100%", maxWidth: 420, boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "Georgia,serif", fontSize: 24, fontStyle: "italic", color: C.cream, marginBottom: 4 }}>
            <span style={{ color: C.gold }}>◆</span> Marché d'Arts
          </div>
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1 }}>
            {mode === "login" ? "CONNEXION" : "CRÉER UN COMPTE"}
          </div>
        </div>

        {mode === "register" && (
          <>
            <Input placeholder="Votre nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              {["acheteur", "artiste"].map((r) => (
                <button key={r} onClick={() => setRole(r)} style={{ flex: 1, background: role === r ? C.gold : C.surface, color: role === r ? C.bg : C.muted, border: `1px solid ${role === r ? C.gold : C.border}`, padding: "10px", fontSize: 11, letterSpacing: 1.5, cursor: "pointer", fontFamily: "Georgia,serif" }}>
                  {r === "acheteur" ? "🛒 ACHETEUR" : "🎨 ARTISTE"}
                </button>
              ))}
            </div>
          </>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" />
          <Input placeholder="Mot de passe" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" />
        </div>

        <Btn onClick={() => onLogin(role)} variant="primary" style={{ width: "100%", padding: 14, fontSize: 12, marginBottom: 16 }}>
          {mode === "login" ? "SE CONNECTER" : "CRÉER MON COMPTE"}
        </Btn>

        <div style={{ textAlign: "center", fontSize: 12, color: C.muted }}>
          {mode === "login" ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <span onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ color: C.gold, cursor: "pointer" }}>
            {mode === "login" ? "S'inscrire" : "Se connecter"}
          </span>
        </div>

        {mode === "login" && (
          <div style={{ marginTop: 24, borderTop: `1px solid ${C.border}`, paddingTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 10, color: C.muted, textAlign: "center", letterSpacing: 1, marginBottom: 4 }}>DEMO RAPIDE</div>
            <Btn onClick={() => onLogin("acheteur")} variant="dark" style={{ width: "100%", fontSize: 10 }}>ACCÉDER EN TANT QU'ACHETEUR</Btn>
            <Btn onClick={() => onLogin("artiste")} variant="dark" style={{ width: "100%", fontSize: 10 }}>ACCÉDER EN TANT QU'ARTISTE</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APP PRINCIPALE ───────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("gallery");
  const [cart, setCart] = useState([]);
  const [artworks, setArtworks] = useState(ARTWORKS_INIT);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const addToCart = (aw) => setCart((c) => c.find((a) => a.id === aw.id) ? c : [...c, aw]);
  const removeFromCart = (id) => setCart((c) => c.filter((a) => a.id !== id));
  const navigate = (id) => { setPage(id); setSelectedArtist(null); setMobileMenuOpen(false); };
  const login = (role) => { setUser({ role, name: role === "artiste" ? "Élise Moreau" : "Visiteur" }); setPage("gallery"); };
  const logout = () => { setUser(null); setPage("gallery"); setCart([]); };

  if (!user) return <Auth onLogin={login} />;

  const isArtiste = user.role === "artiste";

  const navItems = [
    { id: "gallery",   label: "Galerie" },
    { id: "artists",   label: "Artistes" },
    { id: "messages",  label: "Messages" },
    { id: "cart",      label: cart.length ? `Panier (${cart.length})` : "Panier" },
    ...(isArtiste ? [{ id: "dashboard", label: "Mon espace" }] : []),
  ];

  return (
    <div style={{ fontFamily: "Georgia,serif", background: C.bg, minHeight: "100vh", color: C.text, width: "100%", overflowX: "hidden", boxSizing: "border-box" }}>

      {/* Navigation */}
      <nav style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, height: 60, boxSizing: "border-box" }}>
        <div onClick={() => navigate("gallery")} style={{ fontFamily: "Georgia,serif", fontSize: 18, fontStyle: "italic", color: C.cream, cursor: "pointer", flexShrink: 0 }}>
          <span style={{ color: C.gold }}>◆</span> Marché d'Arts
        </div>

        {isMobile ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {cart.length > 0 && (
              <button onClick={() => navigate("cart")} style={{ background: C.gold, color: C.bg, border: "none", borderRadius: "50%", width: 26, height: 26, fontSize: 11, cursor: "pointer", fontFamily: "Georgia,serif" }}>
                {cart.length}
              </button>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: "none", border: `1px solid ${C.border}`, padding: "6px 10px", cursor: "pointer", color: C.muted, fontFamily: "Georgia,serif", fontSize: 16, color: C.cream }}>
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center" }}>
            {navItems.map((n) => (
              <button key={n.id} onClick={() => navigate(n.id)} style={{ background: "none", border: "none", padding: "0 14px", height: 60, fontSize: 10, letterSpacing: 2, cursor: "pointer", color: (page === n.id || (page === "artist" && n.id === "artists")) ? C.gold : C.muted, borderBottom: (page === n.id || (page === "artist" && n.id === "artists")) ? `2px solid ${C.gold}` : "2px solid transparent", fontFamily: "Georgia,serif" }}>
                {n.label.toUpperCase()}
              </button>
            ))}
            <div style={{ marginLeft: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 11, color: C.muted }}>{user.name}</div>
              <Btn onClick={logout} variant="ghost" style={{ padding: "6px 12px", fontSize: 10 }}>DÉCONNEXION</Btn>
            </div>
          </div>
        )}
      </nav>

      {/* Menu mobile */}
      {isMobile && mobileMenuOpen && (
        <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 60, zIndex: 99 }}>
          {navItems.map((n) => (
            <button key={n.id} onClick={() => navigate(n.id)} style={{ display: "block", width: "100%", background: page === n.id ? C.card : C.surface, border: "none", borderBottom: `1px solid ${C.border}`, padding: "14px 20px", fontSize: 11, letterSpacing: 2, cursor: "pointer", color: page === n.id ? C.gold : C.muted, fontFamily: "Georgia,serif", textAlign: "left", boxSizing: "border-box" }}>
              {n.label.toUpperCase()}
            </button>
          ))}
          <button onClick={logout} style={{ display: "block", width: "100%", background: C.surface, border: "none", borderBottom: `1px solid ${C.border}`, padding: "14px 20px", fontSize: 11, letterSpacing: 2, cursor: "pointer", color: C.red, fontFamily: "Georgia,serif", textAlign: "left", boxSizing: "border-box" }}>
            DÉCONNEXION
          </button>
        </div>
      )}

      {/* Pages */}
      {page === "gallery"   && <Gallery onAdd={addToCart} cart={cart} onView={setSelectedArtwork} artworks={artworks} />}
      {page === "artists"   && <Artists setPage={setPage} setSelectedArtist={setSelectedArtist} artworks={artworks} />}
      {page === "artist"    && selectedArtist && <ArtistProfile artist={selectedArtist} onAdd={addToCart} cart={cart} onView={setSelectedArtwork} goBack={() => setPage("artists")} artworks={artworks} />}
      {page === "messages"  && <Messaging />}
      {page === "cart"      && <Cart cart={cart} onRemove={removeFromCart} onCheckout={() => setShowCheckout(true)} />}
      {page === "dashboard" && isArtiste && <Dashboard artworks={artworks} setArtworks={setArtworks} />}

      {/* Modals */}
      {selectedArtwork && <ArtworkModal artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} onAdd={addToCart} inCart={cart.some((c) => c.id === selectedArtwork.id)} />}
      {showCheckout && <CheckoutModal total={cart.reduce((s, a) => s + a.price, 0)} onClose={() => { setShowCheckout(false); setCart([]); navigate("gallery"); }} />}
    </div>
  );
}
