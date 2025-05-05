import React, { useState, useEffect } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import styles from './MyLocationMap.module.scss';
import MySkeleton from '../Skeleton/MySkeleton';

const MyLocationMap = ({ location, defaultCenter = [55.751574, 37.573856], defaultZoom = 12, height }) => {
  const [coordinates, setCoordinates] = useState(defaultCenter);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        if (!window.ymaps) {
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = `https://api-maps.yandex.ru/2.1/?apikey=f028c4f8-776d-4ba3-b079-94a909b9cca1&lang=ru_RU`;
            script.onload = resolve;
            document.head.appendChild(script);
          });
        }
        setMapLoaded(true);
      } catch (err) {
        setError('Не удалось загрузить карты');
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (mapLoaded && location) {
      window.ymaps.ready(() => {
        window.ymaps.geocode(location, { results: 1 }).then((res) => {
          const firstGeoObject = res.geoObjects.get(0);
          if (firstGeoObject) {
            setCoordinates(firstGeoObject.geometry.getCoordinates());
          } else {
            setError('Адрес не найден');
          }
        }).catch(() => {
          setError('Ошибка геокодирования');
        });
      });
    }
  }, [location, mapLoaded]);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!mapLoaded) {
    return <MySkeleton width="100%" height="400px" />;
  }

  return (
    <div className={styles.mapContainer}>
      <YMaps>
        <Map
          state={{
            center: coordinates,
            zoom: location ? 14 : defaultZoom,
          }}
          width="100%"
          height={height}
        >
          <Placemark
            geometry={coordinates}
            properties={{
              balloonContent: location || 'Местоположение не указано',
            }}
            options={{
              preset: 'islands#redDotIcon',
            }}
          />
        </Map>
      </YMaps>
    </div>
  );
};

export default MyLocationMap;