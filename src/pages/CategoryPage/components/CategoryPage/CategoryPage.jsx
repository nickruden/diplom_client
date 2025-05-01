import React from 'react'
import { AppLayout } from '../../../../common/components'
import { CategoriesList } from '../../../../modules/CategoriesList';
import { EventList } from '../../../../modules/EventList';
import { FiltersList } from '../../../../modules/EventFilters';
import { PopularList } from '../../../../modules/PopularCreators';
import { CategoryCover } from '../../../../modules/CategoryCover';
import { useParams } from 'react-router-dom';
import { categoryConfig } from '../../API/caregoryStyles';

export const CategoryPage = () => {
  const { slug } = useParams();
  const bgColorCategory = categoryConfig[slug].color;

  return (
    <AppLayout>
      <CategoriesList type='categoryPage' activeCategory={slug} bgColorCategory={bgColorCategory}/>
      <CategoryCover categorySlug={slug} categoryConfig={categoryConfig} />
      <FiltersList />
      <EventList slug={slug} />
      <PopularList />
    </AppLayout>
  )
}
