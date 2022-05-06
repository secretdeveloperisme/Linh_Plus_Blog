$(() => {
  const postsPerMonthData = JSON.parse($("#postsPerMonthData").attr("postsPerMonth"))
  console.log(postsPerMonthData)
  const labels = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    "8",
    "9",
    "10",
    "11",
    "12"
  ];

  const data = {
    labels: labels,
    datasets: [{
      label: 'Amount Of Posts',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: postsPerMonthData,
    }]
  };
  const config = {
    type: 'line',
    data: data,
    options: {}
  };

  const myChart = new Chart(
    document.getElementById('chartPostsPerMonth'),
    config
  );
  console.log(myChart)
})