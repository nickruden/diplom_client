import {
  CalendarOutlined,
  PlusCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { FaRegCircleUser } from "react-icons/fa6";

const menuItems = [
  {
    label: "Мой аккаунт",
    icon: <FaRegCircleUser />,
    path: "/my-account",
  },
  {
    label: "Мои мероприятия",
    icon: <CalendarOutlined />,
    path: "/events/manage/my-events",
  },
  {
    label: "Создать мероприятие",
    icon: <PlusCircleOutlined />,
    path: "/events/manage/create",
  },
  {
    label: "На главную",
    icon: <HomeOutlined />,
    path: "/",
  },
];

export default menuItems;
