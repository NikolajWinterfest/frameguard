import { useTheme } from '../context/ThemeContext'

const HeroSection = () => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme } = useTheme()

  return (
    <section id="hero" className="hero">
      <div className="hero__wrapper container">
        <div className="hero__content">
          {true ? (
            <img
              className="hero__logotype"
              src="/assets/images/header/header_frameguard-logo.png"
              alt="Логотип FrameGuard"
            />
          ) : (
            <div className={`hero__logotype ${systemTheme}-theme`}>FG</div>
          )}
          <h1 className="hero__title">
          АПСКЕЙЛЕР ДЛЯ ФОТО И ВИДЕО: ДЛЯ БИЗНЕСА, ДЛЯ ЛЮДЕЙ, С ПОМОЩЬЮ ИИ
          </h1>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
