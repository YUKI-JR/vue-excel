export function filterEarliestTime(dates) {
    const filteredDates = dates.reduce((acc, date) => {
      const dateStr = date.split(' ')[0];
      const timeStr = date.split(' ')[1];
      const existingDate = acc.find(item => item.startsWith(dateStr));
      if (!existingDate || timeStr < existingDate.split(' ')[1]) {
        if (existingDate) {
          acc.splice(acc.indexOf(existingDate), 1);
        }
        acc.push(date);
      }
  
      return acc;
    }, []);
  
    return filteredDates;
  }
  