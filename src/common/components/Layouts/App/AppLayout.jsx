import React, { useEffect } from "react";
import { Layout } from "antd";

import Footer from "./Footer/Footer";
import Header from "./Header/Header";

const { Content } = Layout;

import styles from './AppLayout.module.scss';
import { useAuth } from "../../../hooks/useAuth";
import { useGetFollowingOrganizers, useGetUserInfo } from "../../../API/services/user/hooks.api";
import { useGetFavoriteEvents } from "../../../API/services/events/hooks.api";

const AppLayout = ({ children }) => {
  const { user, isAuthorized } = useAuth();

  const { } = useGetUserInfo(user?.id, isAuthorized);
  const {  } = useGetFollowingOrganizers(isAuthorized);
  const {  } = useGetFavoriteEvents(isAuthorized);
  
  // При монтировании компонента скроллим вверх
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout className={styles.lyaout}>
      <Header />
      <Content className={styles.main}>{children}</Content>
      <Footer />
    </Layout>
  );
};

export default AppLayout;