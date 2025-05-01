import { GiMusicalNotes, GiPartyPopper } from "react-icons/gi";
import { FaPuzzlePiece, FaBusinessTime, FaTheaterMasks, FaRunning } from "react-icons/fa";
import { PiParkFill, PiPaintBrushFill } from "react-icons/pi";
import { MdSportsTennis, MdOutlineBusinessCenter } from "react-icons/md";

export const categoryConfig = {
  "music": {
    title: "Музыка",
    desc: "Концерты, фестивали и живые выступления",
    color: "#8A2BE2", // Фиолетовый
    textColor: '#FFF',
    icon: <GiMusicalNotes size={48} />,
    gradient: "linear-gradient(135deg, #8A2BE2 0%, #4B0082 100%)",
  },
  "hobbies": {
    title: "Хобби",
    desc: "Мастер-классы и творческие встречи",
    color: "#2E8B57", // Зелёный
    textColor: '#FFF',
    icon: <FaPuzzlePiece size={48} />,
    gradient: "linear-gradient(135deg, #2E8B57 0%, #3CB371 100%)",
  },
  "business": {
    title: "Бизнес",
    desc: "Конференции и нетворкинг-мероприятия",
    color: "#4682B4", // Синий
    textColor: '#FFF',
    icon: <MdOutlineBusinessCenter size={48} />,
    gradient: "linear-gradient(135deg, #4682B4 0%, #1E90FF 100%)",
  },
  "openspace": {
    title: "OpenSpace",
    desc: "Коворкинги и открытые площадки",
    color: "#FF8C00", // Оранжевый
    textColor: '#FFF',
    icon: <PiParkFill size={48} />,
    gradient: "linear-gradient(135deg, #FF8C00 0%, #FF6347 100%)",
  },
  "sport": {
    title: "Спорт",
    desc: "Соревнования и тренировки",
    color: "#DC143C", // Красный
    textColor: '#FFF',
    icon: <FaRunning size={48} />,
    gradient: "linear-gradient(135deg, #DC143C 0%, #FF4500 100%)",
  },
  "culture": {
    title: "Искусство",
    desc: "Выставки и театральные постановки",
    color: "#9932CC", // Тёмно-фиолетовый
    textColor: '#FFF',
    icon: <PiPaintBrushFill size={48} />,
    gradient: "linear-gradient(135deg, #9932CC 0%, #8A2BE2 100%)",
  },
  "parties": {
    title: "Вечеринки",
    desc: "Тематические вечера и клубные события",
    color: "#FF69B4", // Розовый
    textColor: '#FFF',
    icon: <GiPartyPopper size={48} />,
    gradient: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
  },
};