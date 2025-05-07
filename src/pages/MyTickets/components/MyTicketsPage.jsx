import React from 'react'
import { AppLayout } from '../../../common/components'
import { TicketsList } from '../../../modules/PurchasedTickets'

const MyTicketsPage = () => {
  return (
    <AppLayout>
        <TicketsList />
    </AppLayout>
  )
}

export default MyTicketsPage;