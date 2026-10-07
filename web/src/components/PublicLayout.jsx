import EventBanner from './EventBanner.jsx';
import Footer from './Footer.jsx';
import Header from './Header.jsx';
import SponsorsBar from './SponsorsBar.jsx';

/** Estructura común de las páginas públicas: header + contenido + evento + footer. */
export default function PublicLayout({
  children,
  conHeader = true,
  conEvento = true,
  conSponsors = conEvento,
  cafeteriaSlug,
}) {
  return (
    <>
      {conHeader && <Header cafeteriaSlug={cafeteriaSlug} />}
      <main>{children}</main>
      {conEvento && <EventBanner />}
      {conSponsors && <SponsorsBar />}
      <Footer />
    </>
  );
}
