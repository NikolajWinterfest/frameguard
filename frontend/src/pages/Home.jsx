import HeroSection from '../components/HeroSection'
import TodoSection from '../components/TodoSection'
import NewsSection from '../components/NewsSection'
import AboutUsSection from '../components/AboutUsSection'
import ProjectsSection from '../components/ProjectsSection'
import ContactsSection from '../components/ContactsSection'
import WatchVideoSection from '../components/WatchVideoSection'

const Home = () => {
  return (
    <main className="main">
      <HeroSection />
      <TodoSection />
      <NewsSection />
      <WatchVideoSection />
      <AboutUsSection />
      <ProjectsSection />
      <ContactsSection />
    </main>
  )
}

export default Home
