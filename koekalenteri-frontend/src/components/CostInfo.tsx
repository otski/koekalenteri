import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { CEvent } from "../stores/classes";

export const CostInfo = observer(function CostInfo({ event }: { event: CEvent }) {
  const { t } = useTranslation();

  return (
    <>
      {t('event.cost')}: {event.cost} €<br />
      {t('event.costMember')}: {event.costMember} €<br />
      {t('event.accountNumber')}: {event.accountNumber}<br />
      {t('event.referenceNumber')}: {event.referenceNumber}<br />
      {event.paymentDetails}
    </>
  );
})
