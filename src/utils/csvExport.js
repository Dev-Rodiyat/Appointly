export const exportToCSV = (rows) => {
  const headers = ['Title','Description','Date','Start','End','Status','Location','Tags','Notes'];
  const csv = [
    headers.join(','),
    ...rows.map(a => [
      a.title, a.description || '', a.date, a.startTime, a.endTime, a.status,
      a.location || '', (a.tags || []).join('|'), a.notes || ''
    ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = 'appointments.csv'; link.click();
  URL.revokeObjectURL(url);
};
