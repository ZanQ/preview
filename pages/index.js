import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'

export default function Home() {
  return (
    <Layout>
      <Head>
        <meta
            name="description"
            content="Preview Page"
        />
        <title>{siteTitle}</title>

        <script async src={"https://www.googletagmanager.com/gtag/js?id=G-NQH25QFK8N"}/>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-NQH25QFK8N');
              `,
          }}
        />
      </Head>
      <section className={utilStyles.headingMd}>…</section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>ZanQ Preview Pages</h2>
      </section>
    </Layout>
  )
}