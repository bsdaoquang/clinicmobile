import { DateTime } from "@bsdaoquang/rncomponent";

export const getDateUpdate = (num: number) => {
  const date = new Date(num).toISOString();
  const today = new Date().toISOString();

  const strDate = date.split('T')[0].split('-');
  const strToday = today.split('T')[0].split('-');

  if (
    strDate[0] == strToday[0] &&
    strDate[1] === strToday[1] &&
    strDate[2] === strToday[2]
  ) {
    const time = new Date().getTime() - num;
    const second = time / 1000;
    const min = time / (60 * 1000);
    const hour = time / (60 * 60 * 1000);

    let timeStr = '';

    if (second < 60) {
      timeStr = 'Vừa mới';
    } else if (min < 60) {
      timeStr = `${min.toFixed(0)} phút trước`;
    } else if (hour > 0 && hour < 24) {
      timeStr = `${hour.toFixed(0)} giờ trước`;
    }
    return timeStr;

  } else {
    return DateTime.dateToDateString(new Date(num));
  }
};