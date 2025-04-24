document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('chart').getContext('2d');

    const chartData = {
        labels: ['Información', 'Juicio', 'Vocabulario', 'Síntesis', 'Concentración', 'Análisis', 'Abstracción', 'Planeación', 'Organización', 'Atención'],
        datasets: [{
            label: 'Fluctuación',
            data: [
                termanData.serie1,
                termanData.serie2,
                termanData.serie3,
                termanData.serie4,
                termanData.serie5,
                termanData.serie6,
                termanData.serie7,
                termanData.serie8,
                termanData.serie9,
                termanData.serie10
            ],
            borderColor: 'blue',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0
        }]
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    };

    new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: chartOptions
    });
});