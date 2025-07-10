import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTheme } from '../context/ThemeContext'
import EmployeeCardWindow from './reuseable/EmployeeCardWindow'
import TemporaryPhotoStub from './reuseable/TemporaryPhotoStub'

const AboutUs = () => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme } = useTheme()

  //__________________________________________________ HOOKS «useState's» __________________________________________________//

  // useState // Data of Card which pushing to «Modal Window»
  const [employeeCard, setEmployeeCard] = useState({
    id: '',
    name: '',
    surname: '',
    workposition: '',
    description: '',
    experience: '',
    image: '',
    gender: '',
  })

  // useState // Active mode for «Modal window»
  const [windowIsActive, setWindowIsActive] = useState(false)

  //__________________________________________________ EVENT HANDLER'S __________________________________________________//
  // EVENT HANDLER // Push data employee in «employeeCard»
  const handleEmployeeCard = (companyEmployee) => {
    setWindowIsActive(true) // Modal window is ON
    document.body.classList.add('stop-scroll-pr') // Activation «Stop Scroll»

    return setEmployeeCard(companyEmployee) // Data of employee for «Card» of «Modal window»
  }

  // FUNCTION // Photo blank for man and woman
  const photoEmployee = (image, gender) => {
    if (image !== '') {
      return process.env.REACT_APP_API_URL + image
    } else if (gender === 'female') {
      return '/assets/aboutus/person-woman.jpg'
    } else {
      return '/assets/aboutus/person-man.jpg'
    }
  }

  // FUNCTION // Description of "alt" for "img"
  const photoNameEmployee = (image, name, surname) => {
    if (image === '') {
      return `Временная фотография сотрудника`
    }

    return `Портрет сотрудника – ${name} ${surname}`
  }

  //__________________________________________________ REDUX __________________________________________________//
  // REDUX STORE // GET Data Array «Employees» from «Store» with REDUX HOOK «useSelector»
  const companyEmployees = useSelector((state) => state.cards.employees)

  return (
    <>
      <EmployeeCardWindow
        employee={employeeCard}
        windowIsActive={windowIsActive}
        setWindowIsActive={setWindowIsActive}
        photoEmployee={photoEmployee}
        photoNameEmployee={photoNameEmployee}
      />
      <section id="aboutus" className="aboutus">
        <div className="aboutus__wrapper container">
          <div className="aboutus__companyinfo companyinfo">
            <h2 className="companyinfo__title secondary-title">
              О&nbsp;КОМПАНИИ
            </h2>
            <div className="companyinfo__content companyinfo-content">
              <div className="companyinfo-content__companyideals companyideals">
                <div className="companyideals__paragraphblock">
                  <p className="companyideals__paragraphblock-descr">
                    ФреймГуард — молодая, но амбициозная IT-компания,
                    занимающаяся разработкой инновационных решений для улучшения
                    качества фото и видео. Мы предлагаем пользователям
                    современные инструменты, которые помогают повысить
                    разрешение, улучшить четкость и устранить шумы в
                    изображениях и видео. Мы используем новейшие технологии и
                    искусственный интеллект, чтобы сделать ваши снимки и
                    видеозаписи более качественными и запоминающимися. Наша цель
                    - это чтобы каждый мог наслаждаться воспоминаниями в
                    наилучшем качестве
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`companyinfo__companyname background-companyname ${systemTheme}-theme`}
            >
              FrameGuard
            </div>
            <div
              className={`companyinfo__companyname background-companyname ver-mobile ${systemTheme}-theme`}
            >
              FG
            </div>
          </div>
          <section className="aboutus__teaminfo teaminfo">
            <h2 className="teaminfo__title secondary-title">НАША КОМАНДА</h2>
            <div className="teaminfo__content teaminfo-content">
              <ul className="teaminfo-content__list">
                {companyEmployees.map((employee) => {
                  const { id, name, surname, workposition, image, gender } =
                    employee

                  return (
                    <li
                      onClick={() => handleEmployeeCard(employee)}
                      key={id}
                      className={`teaminfo-content__item personcard ${systemTheme}-theme`}
                    >
                      <div className="personcard__photoblock">
                        <img
                          className={
                            image
                              ? 'personcard__photoblock-photo'
                              : 'personcard__photoblock-photo invisible'
                          }
                          src={`${photoEmployee(image, gender)}`}
                          alt={photoNameEmployee(image, name, surname)}
                        />
                        <TemporaryPhotoStub name={name} image={image} />
                      </div>
                      <div className="personcard__information">
                        <h3 className="personcard__information-title">
                          {name.toUpperCase()}&ensp;{surname.toUpperCase()}
                        </h3>
                        <p className="personcard__information-descr">
                          {workposition}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>
        </div>
      </section>
    </>
  )
}

export default AboutUs
