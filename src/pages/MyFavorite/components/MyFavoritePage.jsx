import React from 'react'
import { AppLayout } from '../../../common/components'
import { FavoriteList } from '../../../modules/FavoriteEvents'

const MyFavoritePage = () => {
  return (
    <AppLayout>
        <FavoriteList />
    </AppLayout>
  )
}

export default MyFavoritePage