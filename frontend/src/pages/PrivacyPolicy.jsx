import privacypolicy from '../data/privacypolicy.json'
import ListOfRulesPrivacyPolicy from '../components/reuseable/ListOfRulesPrivacyPolicy'

const PrivacyPolicy = () => {
  return (
    <main className="main">
      <div className="privacypolicy">
        <div className="privacypolicy__wrapper">
          <div className="privacypolicy__content privacypolicy-content">
            <h2 className="privacypolicy-content__title secondary-title">
              ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
            </h2>
            <ListOfRulesPrivacyPolicy privacypolicy={privacypolicy} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default PrivacyPolicy
