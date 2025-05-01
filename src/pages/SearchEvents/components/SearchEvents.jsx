import React from 'react';
import { AppLayout } from '../../../common/components';
import { EventList } from '../../../modules/EventList';
import { CategoriesList } from '../../../modules/CategoriesList';
import { mockEventData } from '../../../modules/EventList/API/mock';
import { PopularList } from '../../../modules/PopularCreators';
import { FiltersList } from '../../../modules/EventFilters';
import { BigBanner } from '../../../modules/BigBanner';

export const SearchEvents = () => {
  return (
    <AppLayout>
      <BigBanner />
      <CategoriesList />
      <FiltersList />
      <EventList />
      <PopularList />
      {/* (фильтры будут: по локации или онлайн, по времени, по цене(бесплатно или платно - выбрать можно промежуток или все платные)
      по фильтрам есть решение в дипсике, но вот запрос: стоп а если мне вот, я нажал на кнопку фильтров бесплатные, я перехожу на страницу ивента, и хочу вернутся назад нажимаю на лого или на Найти события а там залочена ссылка на главную просто без параметров (/) но мне надо чтоб сохранились все фильтры что делать в таком случае?) */}
    </AppLayout>
  )
}
