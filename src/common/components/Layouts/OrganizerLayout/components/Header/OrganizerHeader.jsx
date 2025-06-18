import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Avatar, Flex, Typography } from 'antd';
const { Text } = Typography;

import { IoIosArrowDown } from "react-icons/io";
import { CiCalendar, CiCirclePlus, CiLogout } from "react-icons/ci";
import { HiOutlineHome } from "react-icons/hi2";
import { FiUser } from "react-icons/fi";
import Logo from '../../../../../../assets/Logo.svg';

import { useAuth } from '../../../../../hooks/useAuth';
import { logoutUser } from '../../../../../store/slices/user.slice';

import MyButton from '../../../../UI/Button/MyButton';
import MyDropdown from '../../../../UI/Dropdown/MyDropdown';

import MyStatistic from '../../../../Statistic/MyStatistic';

import styles from './OrganizerHeader.module.scss';


const OrganizerHeader = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const logout = () => {
    dispatch(logoutUser());
    navigate('/')
  };

  const items = [
    {
      key: "1",
      label: (
        <MyStatistic
          followersCount={user.followersCount}
          eventsCount={user.eventsCount}
          shadow={false}
        />
      ),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <Link to="/events/manage/my-events"><CiCalendar size={25} /> Мои мероприятия</Link>
      ),
    },
    {
      key: "3",
      label: <Link to="/"><HiOutlineHome size={25} /> Искать мероприятия</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "4",
      label: <MyButton type='link' danger style={{padding: "0px", fontSize: 14}}><CiLogout size={25} /> Выйти</MyButton>,
      onClick: logout,
    },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__inner}>
          <div className={styles.header__leftContent}>
            <Link to="/" className={styles.header__logo}>
              <img src={Logo} alt="logo" />
            </Link>
          </div>
          <div className={styles.header__actions}>
            <Link to={`/events/manage/create`} className={styles.createButton}>
              <CiCirclePlus size={30} /> Создать
            </Link>
            <MyDropdown menu={{ items }}
              placement="bottomRight"
              className={styles.userDropdown} >
                <Flex
                align="center"
                gap={50}
                justify='flex-between'
                className={styles.userDropdown__inner}
              >
                <Flex gap={12} align='center'>
                <Avatar
                  src={user.avatar}
                  icon={!user.avatar && <FiUser size={25} />}
                  className={styles.userAvatar}
                  size={40}
                />
                <Flex vertical className={styles.userNames}>
                  <Text className={styles.organizerName}>
                    {user.organizerName}
                  </Text>
                  <Text type="secondary" className={styles.userName}>
                    {user.firstName} {user.lastName}
                  </Text>
                </Flex>
                </Flex>
                <IoIosArrowDown style={{marginLeft: "auto"}} />
              </Flex>
              </MyDropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default OrganizerHeader;