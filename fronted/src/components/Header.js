import logo from '../images/logo.svg'
import { useState, useEffect, useContext } from 'react'
import closeIcon from '../images/close-icon.svg'
import burgerButton from '../images/burgerButton.svg'
import CurrentUserContext from '../contexts.js/CurrentUserContext'
import { Routes, Route, useNavigate, Link } from 'react-router-dom'



export default function Header(props) {
  const {onClick} = props;
  const [isTopBarOpen, setIsTopBarOpen] = useState(false)
  const currentUser = useContext(CurrentUserContext);
  

  

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <header className="header">
        <div className={`top-bar ${isTopBarOpen && 'top-bar_active'}`}>
          <span className="header__link">{currentUser.email}</span>
          <a href="#" className="header__link header__link_style_fade responsible-fade" onClick={onClick}>
              Выйти
          </a>
        </div>
        <img src={logo} alt="Логотип приложениея Место." className="header__logo"/>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="header__user-info">
                  <span className="header__link">{currentUser.email}</span>
                    <a
                      href="#"
                      className="header__link header__link_style_fade responsible-fade"
                      onClick={onClick}
                    >
                      Выйти
                    </a>
                </div>
                  <button
                    className="header__button responsible-fade"
                    onClick={() => setIsTopBarOpen(!isTopBarOpen)}
                  >
                    <img
                      className={`header__button-picture ${isTopBarOpen && 'header__button-picture_small'}`}
                      src={isTopBarOpen ? closeIcon : burgerButton}
                    />
                  </button>
              </>
            }
          />
          <Route
            path="/sign-up"
            element={
              <Link to="/sign-in" className="header__link responsible-fade">
                {'Войти'}
              </Link>
            }
          />
          <Route
            path="/sign-in"
            element={
              <Link to="/sign-up" className="header__link responsible-fade">
                {'Зарегистрироваться'}
              </Link>
            }
          />
        </Routes>
      </header>
    </CurrentUserContext.Provider>
    
  )
}
