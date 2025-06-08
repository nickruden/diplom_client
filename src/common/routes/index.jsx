import { AccountPage } from "../../pages/AccountPage";
import { AuthPage, RegisterPage } from "../../pages/AuthPage";
import { CategoryPage } from "../../pages/CategoryPage";
import { CreateEventPage } from "../../pages/CreateEvent";
import { CreatorPage } from "../../pages/CreatorPage";
import { EditEventInfoPage, EventConfirmPage, EventTicketsPage } from "../../pages/EditEvent";
import { EventPage } from "../../pages/EventPage";
import { EventStats, MyEvents } from "../../pages/ManageEvents";
import { MyFavoritePage } from "../../pages/MyFavorite";
import { FolowingPage } from "../../pages/MyFolowing";
import { MyTicketsPage } from "../../pages/MyTickets";
import { SearchEvents } from "../../pages/SearchEvents";

export const routes = [
    {
        path: '/',
        element: <SearchEvents />,
    },
    {
        path: '/auth',
        element: <AuthPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        path: '/my-account',
        element: <AccountPage />,
    },
    {
        path: '/my-folowing',
        element: <FolowingPage />,
    },
    {
        path: '/my-favorites',
        element: <MyFavoritePage />,
    },
    {
        path: '/my-tickets',
        element: <MyTicketsPage />,
    },
    {
        path: '/event/:id',
        element: <EventPage />,
    },
    {
        path: '/category/:slug',
        element: <CategoryPage />
    },
    {
        path: '/creator/:id',
        element: <CreatorPage />
    },
    {
        path: '/events/manage/my-events',
        element: <MyEvents />
    },
    {
        path: '/events/manage/event/:id/stats',
        element: <EventStats />
    },
    {
        path: '/events/manage/create',
        element: <CreateEventPage />
    },
    {
        path: '/events/manage/edit/:id/info',
        element: <EditEventInfoPage />
    },
    {
        path: '/events/manage/edit/:id/tickets',
        element: <EventTicketsPage />
    },
    {
        path: '/events/manage/edit/:id/confirm',
        element: <EventConfirmPage />
    },
]
