import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Card, Avatar, Typography, Col, Flex } from 'antd';
const { Title, Text, Paragraph } = Typography;

import { FaRegTrashAlt, FaFacebookF, FaInstagram, FaTwitter, FaGlobe } from 'react-icons/fa';

import MyButton from '../../../../common/components/UI/Button/MyButton';

import './FollowerCard.module.scss';;
import { useUnfollowOrganizer } from '../../../../common/API/services/user/hooks.api';
import { MyAvatar } from '../../../../common/components';

const FollowerCard = ({ creatorInfo }) => {
  const [ellipsis, setEllipsis] = useState(true);

    const { mutate: unfollow } = useUnfollowOrganizer();

  const handleUnsubscribe = () => {
    unfollow(creatorInfo.id);
  };

  const medias = JSON.parse(creatorInfo.organizerMedias || '{}');

  return (
    <Card
      className="subCard"
      hoverable
      style={{ borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", backgroundColor: "rgb(235 235 235 / 39%)" }}
    >
      <Flex>
        <Col>
          <Link to={`/creator/${creatorInfo.id}`}>
          <MyAvatar imageSrc={creatorInfo.avatar} size={80} />
          </Link>
        </Col>
        <Col flex="auto">
          <Link to={`/creator/${creatorInfo.id}`}>
            <Title level={4} style={{ marginBottom: 5 }}>
              {creatorInfo.organizerName}
            </Title>
          </Link>
          <Flex vertical style={{ marginBottom: "20px" }} wrap>
            <Text>
              Подписчики • <Text style={{fontWeight: 600}}>{creatorInfo.followersCount}</Text>
            </Text>
            <Text>
              Мероприятия • <Text style={{fontWeight: 600}}>{creatorInfo.eventsCount} 10</Text>
            </Text>
          </Flex>
          <Paragraph
            type="secondary"
            ellipsis={ellipsis ? { rows: 2 } : false}
            className="creatorPageHeader__desc"
            style={{marginBottom: "20px"}}
          >
            {creatorInfo.organizerDesc || ""}
          </Paragraph>
          <Flex gap={17} className="subCard__socials">
            {medias.facebook && (
              <a
                href={medias.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF style={{ fontSize: 20 }} />
              </a>
            )}
            {medias.instagram && (
              <a
                href={medias.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram style={{ fontSize: 20 }} />
              </a>
            )}
            {medias.twitter && (
              <a
                href={medias.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter style={{ fontSize: 20 }} />
              </a>
            )}
            {medias.website && (
              <a
                href={medias.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGlobe style={{ fontSize: 20 }} />
              </a>
            )}
          </Flex>
        </Col>
        <Col>
          <MyButton
            type="text"
            icon={<FaRegTrashAlt />}
            onClick={handleUnsubscribe}
            style={{ color: "red" }}
          >
            Отписаться
          </MyButton>
        </Col>
      </Flex>
    </Card>
  );
};

export default FollowerCard;