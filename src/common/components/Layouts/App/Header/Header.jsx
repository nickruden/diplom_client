import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../../../assets/Logo.svg';
import { AudioOutlined, BellOutlined } from '@ant-design/icons';
import { Input, Space, Dropdown, Menu, Avatar, Flex, Badge, Tabs, List } from 'antd';
import { CgProfile } from "react-icons/cg";
import { FaMapMarkerAlt } from 'react-icons/fa';
import MyButton from '../../../UI/Button/MyButton';
import styles from './Header.module.scss';
import { useAuth } from '../../../../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../../../store/slices/user.slice';
import { IoIosArrowDown, IoMdNotificationsOutline } from "react-icons/io";
import MyDropdown from '../../../UI/Dropdown/MyDropdown';
import { CiCirclePlus, CiLogout } from 'react-icons/ci';
import { resetFollowingOrganizer } from '../../../../store/slices/following.slice';
import SearchInput from '../../../UI/Search/Search';
import { HiOutlineHome } from 'react-icons/hi2';
import { IoNotificationsOutline } from "react-icons/io5";
import NotificationBell from '../../../../../modules/Notifications/components/NotificationBell/NotificationBell';



const { Search } = Input;

const Header = () => {
  const { user } = useAuth();

  const followingOrganizers = useSelector((state) => state.userFollowing.followingOrganizers);
  const followingCount = followingOrganizers.length;
  const favoriteCount = null;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const logout = () => {
    dispatch(logoutUser());
    dispatch(resetFollowingOrganizer());
    navigate('/');
  };

  const items = [
    {
      key: '1',
      label: <Link to="/my-account">Мой аккаунт</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: <Link to="/events/manage/my-events">Управление мероприятиями</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: <Link to="/tickets">Купленные билеты</Link>,
    },
    {
      key: '4',
      label: <Link to="/favorites">Избранное ({favoriteCount || 0})</Link>,
    },
    {
      key: '5',
      label: <Link to="/my-folowing">Подписки ({followingCount})</Link>,
    },
    {
      key: '6',
      label: <MyButton type='link' danger style={{padding: "0px", fontSize: 14}} className={styles.logoutButton}><CiLogout size={25} /> Выйти</MyButton>,
      onClick: logout,
    },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__inner}>
          <div className={styles.header__leftContent}>
            <Link to='/' className={styles.header__logo}><img src={Logo} alt='logo' /></Link>
          </div>
          <nav className={styles.header__menu}>
              <Link to='/' className={styles.header__menuLink}><HiOutlineHome size={20} /></Link>
              <SearchInput placeholder="Найти мероприятие" size='large' width='450px' />
            </nav>
          <div className={styles.header__actions}>
            <Link to={`/events/manage/create`} className={styles.createButton}>
              <CiCirclePlus size={30} style={{fontWeight: 600}} /> Создать
            </Link>
            {user ? (
              <>
              <NotificationBell className={styles.notifications} />
              <MyDropdown menu={{items}} placement="bottomRight">
                <Flex align='center' gap='8px' className={styles.userDropdown}>
                <span className={styles.userName}>{user.firstName} {user.lastName}</span>
                  {/* <Avatar 
                    src={user.avatar} 
                    icon={!user.avatar && <CgProfile />} 
                    className={styles.userAvatar}
                  /> */}
                  <IoIosArrowDown />
                </Flex>
              </MyDropdown>
              </>
            ) : (
              <Link to='/auth' className={styles.loginButton}>
                <CgProfile size='20px' /> Войти
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;