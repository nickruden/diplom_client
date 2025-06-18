import React from 'react'
import { Link } from 'react-router-dom'

import Logo from '../../../../../assets/Logo.svg'
import logoTg from '../../../../../assets/social-media-icons/telegram.svg'
import logoVK from '../../../../../assets/social-media-icons/vkontakte.svg'


import styles from './Footer.module.scss'

const Footer = () => {
  return (
    <footer className={styles.footer}>
        <div className={['my-container', styles.footer__container].join(' ')}>
            <div className={styles.footer__inner}>
                <div className={styles.footer__top}>
                    <Link to='/' className={styles.footer__logo}>
                        <img src={Logo} alt="main-logo" />
                    </Link>
                    <div className={styles.footer__info}>
                        <p className={styles.footer__team}>
                            © 2025 Created by <Link to='https://github.com/nickruden'>Rudenko NK</Link>
                        </p>
                        <p className={styles.footer__university}>
                            Крымский инженерно-педагогический университет им. Февзи Якубова
                        </p>
                    </div>
                </div>
                <hr />
                <div className={styles.footer__bottom}>
                    <div className={styles.footer__policy}>
                        Продолжая работу с нашим сайтом, вы подтверждаете согласие с <Link to='/'>правилами его использования</Link>
                    </div>
                    <div className={styles.footer__socials}>
                        <Link to='/' className={styles.footer__social}><img src={logoTg} alt="logo-telegram" /></Link>
                        <Link to='/' className={styles.footer__social}><img src={logoVK} alt="logo-vkontakte" /></Link>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer;
