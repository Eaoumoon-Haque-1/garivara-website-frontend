import AppDownload from '../components/home/AppDownload/AppDownload'
import HeroCarousel from '../components/home/HeroCarousel/HeroCarousel'
import HowItWorks from '../components/home/HowItWorks/HowItWorks'
import PopularCarRoutes from '../components/home/PopularCarRoutes/PopularCarRoutes'
import VehicleSearch from '../components/home/VehicleSearch/VehicleSearch'
import WhyChooseUs from '../components/home/WhyChooseUs/WhyChooseUs'

function HomePage() {
  return (
    <main id="home" className="w-full">
      <div className="min-h-[calc(100svh-5rem)]">
        <div className="relative">
          <HeroCarousel />
        </div>
        <VehicleSearch />
      </div>
      <WhyChooseUs />
      <HowItWorks />
      <AppDownload />
      <PopularCarRoutes />
    </main>
  )
}

export default HomePage