import { useTheme } from '../context/ThemeContext'

const TodoSection = () => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme } = useTheme()

  return (
    <section className="todo">
      <div className="todo__wrapper">
        <h2 className="todo__title secondary-title">ЗАГОЛОВОК</h2>
        <div className="todo__content">
          <ul className="todo__list">
            <li className="todo__item">
              <div className="todo__item-imagewrap">
                <img
                  className={
                    systemTheme === 'night'
                      ? `todo__item-icon is-active`
                      : `todo__item-icon`
                  }
                  src="./assets/images/other/todo__camera-night.png"
                  alt=""
                />
                <img
                  className={
                    systemTheme === 'day'
                      ? `todo__item-icon is-active`
                      : `todo__item-icon`
                  }
                  src="./assets/images/other/todo__camera-day.png"
                  alt=""
                />
              </div>
              <p className="todo__item-descr">УВЕЛИЧЕНИЕ КАЧЕСТВА ФОТО</p>
            </li>
            <li className="todo__item">
              <div className="todo__item-imagewrap">
                <img
                  className={
                    systemTheme === 'night'
                      ? `todo__item-icon is-active`
                      : `todo__item-icon`
                  }
                  src="./assets/images/other/todo__film-night.png"
                  alt=""
                />
                <img
                  className={
                    systemTheme === 'day'
                      ? `todo__item-icon is-active`
                      : `todo__item-icon`
                  }
                  src="./assets/images/other/todo__film-day.png"
                  alt=""
                />
              </div>
              <p className="todo__item-descr">ПОВЫШЕНИЕ FPS</p>
            </li>
            <li className="todo__item">
              <div className="todo__item-imagewrap">
                <img
                  className={
                    systemTheme === 'night'
                      ? `todo__item-icon is-active`
                      : `todo__item-icon`
                  }
                  src="./assets/images/other/todo__camcorder-night.png"
                  alt=""
                />
                <img
                  className={
                    systemTheme === 'day'
                      ? `todo__item-icon is-active`
                      : `todo__item-icon`
                  }
                  src="./assets/images/other/todo__camcorder-day.png"
                  alt=""
                />
              </div>
              <p className="todo__item-descr">УВЕЛИЧЕНИЕ КАЧЕСТВА ВИДЕО</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default TodoSection
