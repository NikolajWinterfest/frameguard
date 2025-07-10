import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useTheme } from '../context/ThemeContext'
import NewsCardWindow from '../components/reuseable/NewsCardWindow'

const NewsSection = () => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme } = useTheme()

  //__________________________________________________ HOOKS «useState's» __________________________________________________//
  // useState // Active mode for «Modal window»
  const [windowIsActive, setWindowIsActive] = useState(false)

  // useState // Data of Card which pushing to «Modal Window»
  const [newsCard, setNewsCard] = useState({
    id: '',
    title: '',
    description: '',
    image: '',
    date: '',
  })

  //__________________________________________________ EVENT HANDLER'S __________________________________________________//
  // useRef // Data of cursor position (X, Y)
  const positionX = useRef(0)
  const positionY = useRef(0)

  // EVENT HANDLER // Determination of the starting position
  const handleMouseDown = (e) => {
    positionX.current = e.clientX
    positionY.current = e.clientY
  }

  // EVENT HANDLER // Determination of the final position
  const handleMouseUp = (e, newsCardInfo) => {
    if (e.button !== 0) return

    let currentPositionX = e.clientX
    let currentPositionY = e.clientY

    const distance = Math.sqrt(
      Math.pow(currentPositionX - positionX.current, 2) +
        Math.pow(currentPositionY - positionY.current, 2)
    )

    const swipeThreshold = 10

    if (distance < swipeThreshold) {
      setWindowIsActive(true) // Modal window is ON
      document.body.classList.add('stop-scroll-pr') // Activation «Stop Scroll»

      setNewsCard(newsCardInfo)
    }
  }

  //__________________________________________________ REDUX __________________________________________________//
  // REDUX STORE // GET Data Array «news» from «Store» with REDUX HOOK «useSelector»
  const newsList = useSelector((state) => state.cards.news)

  //__________________________________________________ OTHER FUNCTION'S __________________________________________________//
  // Settings for «Slider»
  const settings = {
    arrows: true,
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    swipeToSlide: true,
    swipe: true,
    touchThreshold: 100,
    draggable: true,
    touchMove: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  return (
    <>
      <NewsCardWindow
        windowIsActive={windowIsActive}
        setWindowIsActive={setWindowIsActive}
        newsCard={newsCard} // News Card Data for «Modal Window»
      />
      <section id="newsline" className="news">
        <div className="news__wrapper">
          <h2 className="news__title secondary-title">НАШИ ПРОДУКТЫ</h2>
          <div className={`news__content news-content ${systemTheme}-theme`}>
            <ul className="news-content__list">
              <Slider {...settings}>
                {newsList.map((newsCard) => {
                  const { id, title, image } = newsCard

                  return (
                    <li
                      key={id}
                      onMouseDown={(e) => handleMouseDown(e)}
                      onMouseUp={(e) => handleMouseUp(e, newsCard)}
                      className={`news-content__item item-news ${systemTheme}-theme`}
                    >
                      <div className="item-news__photowrapper">
                        <img
                          className="item-news__photowrapper-photo"
                          src={
                            image
                              ? `${process.env.REACT_APP_API_URL}${image}`
                              : 'assets/images/other/placeholder.jpg'
                          }
                          alt="Фотография"
                        />
                      </div>
                      <div className="item-news__wrapperinfo news-wrapperinfo">
                        <h3
                          className={`news-wrapperinfo__title ${systemTheme}-theme`}
                        >
                          {title.toUpperCase()}
                        </h3>
                      </div>
                    </li>
                  )
                })}
              </Slider>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}

export default NewsSection
