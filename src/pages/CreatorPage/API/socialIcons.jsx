import { 
    FacebookOutlined,
    InstagramOutlined,
    TwitterOutlined,
    YoutubeOutlined,
    LinkedinOutlined,
    LinkOutlined
  } from '@ant-design/icons';
  
  export const socialIcons = {
    facebook: <FacebookOutlined style={{ fontSize: '30px' }} />,
    instagram: <InstagramOutlined style={{ fontSize: '30px' }} />,
    twitter: <TwitterOutlined style={{ fontSize: '30px' }} />,
    youtube: <YoutubeOutlined style={{ fontSize: '30px' }} />,
    website: <LinkOutlined style={{ fontSize: '30px' }} />,
  };
  
  export const getSocialIcon = (key) => {
    return socialIcons[key] || null;
  };