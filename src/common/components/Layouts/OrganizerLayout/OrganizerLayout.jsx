import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Layout, Typography, Flex, Divider } from "antd";

const { Sider, Content } = Layout;
const { Text } = Typography;

import { TeamOutlined, FireOutlined } from "@ant-design/icons";
import { CiLogout } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import miniLogo from '../../../../assets/MiniLogo.svg';

import { logoutUser } from "../../../store/slices/user.slice";
import { useAuth } from "../../../hooks/useAuth";
import menuItems from "./helpers/siderMenuItems";

import MyButton from "../../UI/Button/MyButton";

import OrganizerHeader from "./components/Header/OrganizerHeader";
import SidebarMenu from "../../SidebarMenu/SidebarMenu";

import EventPreviewCard from "./components/EventPreviewCard/EventPreviewCard";

import styles from "./OrganizerLayout.module.scss";
import { formatDate, formatTime } from "../../../utils/Date/formatDate";


const OrganizerLayout = ({ children, steps, formData = null, type = null, refetchEventData }) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [collapsed, setCollapsed] = useState(true);

  const location = useLocation();
  const isEventPage = location.pathname.includes("edit") || location.pathname.includes("create") || location.pathname.includes("stats") || false;
  const isStats = location.pathname.includes("stats") || false;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <Layout className={styles.wrapper}>
      <Layout className={styles.inner}>
        <Sider
          className={styles.sidebar}
          collapsed={collapsed}
          scrollbarGutter="stable"
          scrollbarWidth="thin"
        >
          <Flex vertical justify="space-between" style={{ height: "100%" }}>
            <Flex vertical>
              <Flex vertical className={styles.profileInfo}>
                <Flex vertical gap={5} justify="center" align="center">
                  <Link to="/" style={{ maxWidth: 40 }}>
                    <img src={miniLogo} alt="" className="miniLogo" />
                  </Link>
                  <Divider style={{ margin: "0px 0px 25px 0px" }} />
                  <Flex vertical align="center" gap={16}>
                    <Flex vertical align="center" gap={5}>
                      <TeamOutlined style={{ fontSize: 18 }} />
                      <Text strong>{user.followersCount}</Text>
                    </Flex>
                    <Flex vertical align="center" gap={5}>
                      <FireOutlined style={{ fontSize: 18 }} />
                      <Text strong>{user.eventsCount}</Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>

              <Divider />

              <SidebarMenu menuItems={menuItems} collapsed={collapsed} />

              <Divider />
            </Flex>

            <div className={styles.logout}>
              <MyButton
                danger
                type="text"
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                <CiLogout size={25} />
              </MyButton>
            </div>
          </Flex>
        </Sider>

        {isEventPage ? (
          <Sider
            className={styles.stepsSidebar}
            scrollbarGutter="stable"
            scrollbarWidth="thin"
            style={{ width: 100 }}
          >
            <Flex vertical className={styles.stepsSidebar__inner}>
              <Link
                to="/events/manage/my-events"
                style={{
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  color: "blue",
                }}
              >
                <IoIosArrowBack /> Все события
              </Link>
              <Divider />
              {formData ? (
                <>
                  <Flex vertical>
                    <EventPreviewCard
                      title={formData.title || formData.name}
                      date={formatTime(formData.startTime, {
                        showDate: true,
                        showYear: true,
                        noNormalize: isStats ? false : true,
                      })}
                      status={formData.status}
                      previewLink={`/event/${id}`}
                      refetchEventData={refetchEventData}
                    />
                  </Flex>
                  <Divider style={{ margin: "20px 0px 10px 0px" }} />{" "}
                </>
              ) : (
                ""
              )}
              {steps}
              <Divider style={{ margin: "10px 0px" }} />
              {formData ? (
                <Link
                  to={`/events/manage/event/${id}/stats`}
                  className={`${styles.siderButton} ${
                    isStats ? styles.active : ""
                  }`}
                >
                  Статистика мероприятия
                </Link>
              ) : (
                ""
              )}
            </Flex>
          </Sider>
        ) : (
          ""
        )}

        <Layout className={styles.main}>
          <OrganizerHeader />
          <Content
            className={styles.content}
            style={type === "stats" ? { padding: "130px 30px 50px 30px" } : {}}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default OrganizerLayout;
