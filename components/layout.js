import Head from 'next/head'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

const name = 'Peter'
export const siteTitle = 'ZanQ: An Anonymous Personal Stories platform'

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Sometimes the best stories just happen to be real ones."
        />
        <meta name="og:title" content={siteTitle} />
      </Head>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="http://dev.zanq.co/Zan/">
            <a>← Share a Story</a>
          </Link>
        </div>
      )}
    </div>
  )
}