import { Link } from 'react-router-dom'

const ListOfRulesPrivacyPolicy = ({ privacypolicy }) => {
  return (
    <ul className="privacypolicy-content__paragraphs paragraphs-privacypolicy">
      {privacypolicy.paragraphs.flatMap(
        ({ id, title, description, list, email }) => {
          return (
            <li key={id} className="paragraphs-privacypolicy__item">
              <h4 className="paragraphs-privacypolicy__item-title fourth-title">
                {id}. {title.toUpperCase()}
              </h4>
              <p className="paragraphs-privacypolicy__item-descr">
                {description}{' '}
                <Link
                  to={`mailto:${email}`}
                  className="paragraphs-privacypolicy__item-descr-email"
                >
                  {email ? email : ''}
                </Link>
              </p>
              {list ? (
                <ul className="paragraphs-privacypolicy__item-descr-list">
                  {list.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className="paragraphs-privacypolicy__item-descr-item item-descr"
                      >
                        <span className="item-descr__text">{item.item}</span>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                ''
              )}
            </li>
          )
        }
      )}
    </ul>
  )
}

export default ListOfRulesPrivacyPolicy
