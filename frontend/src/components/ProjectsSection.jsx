import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useSelector } from 'react-redux'
import ProjectCardWindow from './reuseable/ProjectCardWindow'

const Projects = () => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme } = useTheme()

  //__________________________________________________ HOOKS «useState's» __________________________________________________//
  // useState // Data of Card which pushing to «Modal Window»
  const [projectCard, setProjectCard] = useState({
    id: '',
    title: '',
    description: '',
    image: '',
    company: '',
  })

  // useState // Active mode for «Modal window»
  const [windowIsActive, setWindowIsActive] = useState(false)

  //__________________________________________________ EVENT HANDLER'S __________________________________________________//
  // EVENT HANDLER // Pushing data project in «projectCard»
  const handleProjectCard = (dataProjectCard) => {
    document.body.classList.add('stop-scroll-pr') // Activation «Stop Scroll»
    setWindowIsActive(true) // Modal window is ON

    return setProjectCard(dataProjectCard) // Data of project for «Card» of «Modal window»
  }

  //__________________________________________________ REDUX __________________________________________________//
  // REDUX STORE // GET Data Array «Projects» from «Store» with REDUX HOOK «useSelector»
  const projects = useSelector((state) => state.cards.projects)

  return (
    <>
      <ProjectCardWindow
        projectCard={projectCard} // News Card Data for «Modal Window»
        windowIsActive={windowIsActive}
        setWindowIsActive={setWindowIsActive}
      />
      <section id="projects" className="projects">
        <div className="projects__wrapper">
          <h2 className="projects__title secondary-title container">ПРОЕКТЫ</h2>
          <ul className="projects__list">
            {projects.map((project) => {
              const { id, image, title, company } = project

              return (
                <li
                  key={id}
                  onClick={() => {
                    handleProjectCard(project)
                  }}
                  className={`projects__item card-projects ${systemTheme}-theme`}
                >
                  <div className="card-projects__photowrapper">
                    <img
                      className="card-projects__photowrapper-photo"
                      src={
                        image
                          ? `${process.env.REACT_APP_API_URL}${image}`
                          : 'assets/images/other/placeholder.jpg'
                      }
                      alt="Обложка проекта"
                    />
                  </div>
                  <div
                    className={`card-projects__information information-project ${systemTheme}-theme`}
                  >
                    <div className="information-project__infowrap">
                      <h4 className="information-project__infowrap-title">
                        {title.toUpperCase()}
                      </h4>
                      <div className="information-project__infowrap-companyname">
                        {company}
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}

export default Projects
