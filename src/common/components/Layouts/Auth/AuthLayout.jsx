import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../../assets/Logo.svg";

import styles from "./AuthLayout.module.scss";
import { HiOutlineHome } from "react-icons/hi2";
import { Layout } from "antd";
import MyButton from "../../UI/Button/MyButton";

const { Content } = Layout;

function AuthLayout({ children }) {
  const navigate = useNavigate();

  return (
    <Layout className={styles.authLayout}>
        <header className={styles.header}>
          <MyButton type='text' onClick={() => navigate('/')} className={styles.backLink}><HiOutlineHome size={20} /> На главную</MyButton>
          <Link to={{ pathname: "/" }} className={styles.logo}>
            <img src={Logo} alt="логотип" />
          </Link>
        </header>
        <Content className={styles.main}>{children}</Content>
    </Layout>
  );
}

export default AuthLayout;
