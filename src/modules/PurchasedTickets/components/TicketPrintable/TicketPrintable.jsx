import React from "react";
import { formatDate } from "../../../../common/utils/Date/formatDate";
import styles from "./TicketPrintable.module.scss";

const TicketPrintable = ({ eventInfo, purchase, onlineInfo }) => {
  return (
    <div className={styles.ticketPdf}>
      <h1>{eventInfo.name}</h1>
      <p><strong>Дата:</strong> {formatDate(eventInfo.startTime)}</p>
      <p><strong>Место:</strong> {eventInfo.location}</p>
      <p><strong>Цена:</strong> {purchase.price} ₽</p>
      <p><strong>Номер билета:</strong> #{purchase.purchaseId}</p>

      {eventInfo.location === "Онлайн" && onlineInfo && (
        <>
          <p><strong>Ссылка:</strong> {onlineInfo.link}</p>
          {onlineInfo.password && <p><strong>Пароль:</strong> {onlineInfo.password}</p>}
          {onlineInfo.instructions && (
            <>
              <p><strong>Инструкции:</strong></p>
              <div dangerouslySetInnerHTML={{ __html: onlineInfo.instructions }} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TicketPrintable;
