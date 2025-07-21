fetch('http://localhost:5000/dashboard-data')
  .then(res => res.json())
  .then(data => {
    const report = document.getElementById('report');
    data.forEach(entry => {
      const div = document.createElement('div');
      div.textContent = `${entry._id} - ${Math.floor(entry.totalTime / 60)} mins`;
      report.appendChild(div);
    });
  });
