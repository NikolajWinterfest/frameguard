import { useTheme } from '../context/ThemeContext'

const Footer = () => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme } = useTheme()

  return (
    <footer className={`footer ${systemTheme}-theme`}>
      <div className="footer__wrapper container">
        <div className="footer__sponsor">
          <div className="footer__sponsor-imagewrap">
            <img
              className="footer__sponsor-imagewrap-image"
              src="/assets/images/other/fund.png"
              alt=""
            />
          </div>
          <p className="footer__sponsor-descr">
            Проект поддержан ФСИ в&nbsp;рамках программы &laquo;Студенческий
            стартап&raquo; федерального проекта &laquo;Платформа
            университетского технологического предпринимательства&raquo;
          </p>
        </div>
        <div className="footer__wrapper-companyinfo footer-companyinfo">
          <div className="footer-companyinfo__copyright">
            ООО &laquo;ФреймГуард&raquo;
          </div>
          <div className="footer-companyinfo__director">
            Генеральный директор, Шкоков Родион Олегович
          </div>
          <div className="footer-companyinfo__unique-numbers">
            ОГРН 1245400010503, ИНН 5473014680
          </div>
          <div className="footer-companyinfo__address">
            630090, г. Новосибирск, ул. Николаева, д. 12
          </div>
        </div>
        <div className="footer__companyname">&#169; FrameGuard</div>
      </div>
    </footer>
  )
}

export default Footer
