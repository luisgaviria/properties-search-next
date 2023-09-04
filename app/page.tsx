import Image from 'next/image'
import styles from './page.module.scss'
import Banner from '@/components/Banner/Banner'
export default function Home() {
  return (
    <> 
    <main className={styles.main}>
      <Banner />
      {/* <ImageCards /> */}
     <div className="title-wrapper">
        <h2>Near You</h2>
        {/* <NearYouListings /> */}
      </div>
      <hr />
      <div className="title-wrapper">
        <h2>By the Water</h2>
        {/* <NewListings /> */}
      </div>
      <hr />
      {/* <CTA pageName="home" /> */}
    </main>
    </>
  )
}
