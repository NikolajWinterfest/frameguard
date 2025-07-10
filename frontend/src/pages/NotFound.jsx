import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const NotFound = () => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme } = useTheme()

  return (
    <main className="main">
      <section className="notfound">
        <div className="notfound__wrapper">
          <div className="notfound__content notfound-content">
            <h1 className="notfound-content__title">
              ДАННОЙ СТРАНИЦЫ НЕ СУЩЕСТВУЕТ
            </h1>
            <p className="notfound-content__descr">
              Возможно, страница устарела, была удалена или вовсе
              не&nbsp;существовала. Также возможно, был введён неверный адрес
              в&nbsp;браузерную строку
            </p>
            <Link
              className={`notfound-content__link ${systemTheme}-theme`}
              to="/"
            >
              Вернуться на главную страницу
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default NotFound
