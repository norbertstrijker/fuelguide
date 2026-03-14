"use client"
import { useState } from "react"
import styles from "./page.module.css"

const LABELS = {
  basis: { nl: "Basis", icon: "💧", omschrijving: "Gewone benzine van het tankstation. Werkt, maar niet optimaal voor bewaring." },
  beter: { nl: "Beter", icon: "⭐", omschrijving: "Merkspecifieke olie of premium benzine. Betere bescherming voor jouw motor." },
  best:  { nl: "Best",  icon: "🏆", omschrijving: "Alkylaatbenzine. Schoner, langer houdbaar, starters altijd goed — ook na de winter." }
}

export default function Home() {
  const [invoer, setInvoer] = useState("")
  const [laden, setLaden] = useState(false)
  const [resultaat, setResultaat] = useState(null)
  const [fout, setFout] = useState(null)

  async function zoek(e) {
    e.preventDefault()
    if (!invoer.trim()) return
    setLaden(true)
    setResultaat(null)
    setFout(null)

    try {
      const res = await fetch(`/api/zoek?q=${encodeURIComponent(invoer)}&taal=nl`)
      const data = await res.json()
      setResultaat(data)
    } catch {
      setFout("Er ging iets mis. Probeer het opnieuw.")
    } finally {
      setLaden(false)
    }
  }

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="FuelGuide logo" style={{height: "52px", width: "auto"}} />
        </div>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.titel}>
          Welke brandstof heeft<br />
          <span className={styles.accent}>jouw machine</span> nodig?
        </h1>
        <p className={styles.subtitel}>
          Typ het merk en modelnummer — direct het juiste antwoord.
        </p>

        {/* Zoekbalk */}
        <form className={styles.zoekForm} onSubmit={zoek}>
          <div className={styles.zoekWrapper}>
            <input
              className={styles.zoekInput}
              type="text"
              placeholder="bijv. Honda HRG 416 of Stihl MS 250"
              value={invoer}
              onChange={e => setInvoer(e.target.value)}
              autoComplete="off"
              autoFocus
            />
            <button className={styles.zoekKnop} type="submit" disabled={laden}>
              {laden ? <span className={styles.spinner} /> : "Zoeken"}
            </button>
          </div>
        </form>

        {/* Voorbeeldlinks */}
        <div className={styles.voorbeelden}>
          {["Honda HRG 416", "Husqvarna 125B", "Stihl MS 250"].map(v => (
            <button
              key={v}
              className={styles.voorbeeldBtn}
              onClick={() => { setInvoer(v); }}
            >
              {v}
            </button>
          ))}
        </div>
      </section>

      {/* Resultaat */}
      {fout && (
        <div className={styles.foutBlok}>{fout}</div>
      )}

      {resultaat && !resultaat.gevonden && (
        <div className={styles.geenResultaat}>
          <p className={styles.geenTitel}>Niet gevonden</p>
          <p className={styles.geenTekst}>
            We konden <strong>{resultaat.invoer}</strong> niet vinden. Controleer het merk en modelnummer en probeer opnieuw.
          </p>
        </div>
      )}

      {/* Suggesties bij meerdere treffers */}
      {resultaat && resultaat.type === 'suggesties' && (
        <div className={styles.suggestiesBlok}>
          <p className={styles.suggestiesTitel}>Welk model bedoel je?</p>
          <div className={styles.suggestiesLijst}>
            {resultaat.suggesties.map(s => (
              <button
                key={s.id}
                className={styles.suggestieKnop}
                onClick={() => {
                  setInvoer(`${s.merk} ${s.modelnummer}`)
                  // Direct zoeken
                  fetch(`/api/zoek?q=${encodeURIComponent(s.merk + ' ' + s.modelnummer)}&taal=nl`)
                    .then(r => r.json())
                    .then(d => setResultaat(d))
                }}
              >
                <span className={styles.suggestieMerk}>{s.merk} {s.modelnummer}</span>
                <span className={styles.suggestieCategorie}>{s.categorie} · {s.motortype}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {resultaat && resultaat.gevonden && resultaat.type === 'resultaat' && (
        <section className={styles.resultaatBlok}>
          {/* Machine info */}
          <div className={styles.machineKaart}>
            <div className={styles.machineHeader}>
              <div>
                <span className={styles.machineLabel}>
                  {resultaat.bron === 'database' ? '✅ Gevonden in database' : '🤖 Schatting op basis van merk & categorie'}
                </span>
                <h2 className={styles.machineNaam}>
                  {resultaat.machine.merk} {resultaat.machine.modelnummer}
                </h2>
                <span className={styles.machineCategorie}>{resultaat.machine.categorie}</span>
              </div>
              <div className={styles.motorBadge} data-type={resultaat.machine.motortype}>
                {resultaat.machine.motortype}
              </div>
            </div>

            <div className={styles.specs}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Motortype</span>
                <span className={styles.specWaarde}>{resultaat.machine.motortype}</span>
              </div>
              {resultaat.machine.mengverhouding && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Mengverhouding</span>
                  <span className={styles.specWaarde}>{resultaat.machine.mengverhouding}</span>
                </div>
              )}
              <div className={styles.specItem}>
                <span className={styles.specLabel}>E10 geschikt</span>
                <span className={styles.specWaarde}>
                  {resultaat.machine.e10_geschikt === true ? "✅ Ja" :
                   resultaat.machine.e10_geschikt === false ? "❌ Nee — gebruik E5" :
                   "Onbekend"}
                </span>
              </div>
              {resultaat.machine.bouwjaar_van && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Bouwjaar</span>
                  <span className={styles.specWaarde}>
                    {resultaat.machine.bouwjaar_van}
                    {resultaat.machine.bouwjaar_tot ? ` – ${resultaat.machine.bouwjaar_tot}` : " – heden"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Kwaliteitslagen */}
          {resultaat.producten.length > 0 && (
            <div className={styles.productensectie}>
              <h3 className={styles.productenTitel}>Kies je brandstof</h3>
              <div className={styles.productenGrid}>
                {["basis", "beter", "best"].map(kwaliteit => {
                  const product = resultaat.producten.find(p => p.kwaliteit === kwaliteit)
                  if (!product) return null
                  const label = LABELS[kwaliteit]
                  return (
                    <div key={kwaliteit} className={styles.productKaart} data-kwaliteit={kwaliteit}>
                      <div className={styles.productHeader}>
                        <span className={styles.productIcon}>{label.icon}</span>
                        <span className={styles.productKwaliteit}>{label.nl}</span>
                      </div>
                      <p className={styles.productNaam}>{product.product_naam}</p>
                      <p className={styles.productOmschrijving}>{label.omschrijving}</p>
                      {product.prijs_indicatie && (
                        <p className={styles.productPrijs}>{product.prijs_indicatie}</p>
                      )}
                      <a
                        href={product.affiliate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.productKnop}
                      >
                        Bekijk product →
                      </a>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Hoe werkt het */}
      {!resultaat && (
        <section className={styles.uitleg}>
          <div className={styles.uitlegStap}>
            <span className={styles.uitlegNummer}>1</span>
            <p>Zoek op het <strong>merk en modelnummer</strong> van je machine</p>
          </div>
          <div className={styles.uitlegStap}>
            <span className={styles.uitlegNummer}>2</span>
            <p>We zoeken het juiste <strong>brandstofadvies</strong> op</p>
          </div>
          <div className={styles.uitlegStap}>
            <span className={styles.uitlegNummer}>3</span>
            <p>Kies je kwaliteit en bestel <strong>direct online</strong></p>
          </div>
        </section>
      )}

      <footer className={styles.footer}>
        <p>© 2026 FuelGuide · Brandstofadvies voor buitenmachines</p>
      </footer>
    </main>
  )
}
