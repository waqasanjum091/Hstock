import { Helmet } from 'react-helmet-async'

export default function SEO({ title, description, keywords, url }) {
  const baseTitle = 'PVA Brand - Premium Digital Accounts Marketplace'
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || 'Premium digital accounts marketplace. Buy verified Instagram, Gmail, TikTok, and more accounts.'} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={`https://pvabrand.com${url}`} />}
    </Helmet>
  )
}
