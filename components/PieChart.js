function PieChart({ data, title }) {
    try {
        const canvasRef = React.useRef(null);
        const chartRef = React.useRef(null);

        React.useEffect(() => {
            if (canvasRef.current && data && data.length > 0) {
                const ctx = canvasRef.current.getContext('2d');
                
                if (chartRef.current) {
                    chartRef.current.destroy();
                }

                const labels = data.map(item => item.distrito);
                const approvalData = data.map(item => item.approvalRate);
                const disapprovalData = data.map(item => item.disapprovalRate);

                chartRef.current = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Aprobación (%)',
                            data: approvalData,
                            backgroundColor: [
                                '#10B981', '#059669', '#047857', '#065F46', '#064E3B',
                                '#6366F1', '#4F46E5', '#4338CA', '#3730A3', '#312E81'
                            ],
                            borderColor: '#ffffff',
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color: '#374151',
                                    font: {
                                        size: 12
                                    }
                                }
                            },
                            title: {
                                display: true,
                                text: title,
                                color: '#374151',
                                font: {
                                    size: 16,
                                    weight: 'bold'
                                }
                            }
                        }
                    }
                });
            }
        }, [data, title]);

        React.useEffect(() => {
            return () => {
                if (chartRef.current) {
                    chartRef.current.destroy();
                }
            };
        }, []);

        return (
            <div data-name="pie-chart" data-file="components/PieChart.js" className="glass-effect rounded-2xl p-6">
                <canvas ref={canvasRef} width="400" height="400"></canvas>
            </div>
        );
    } catch (error) {
        console.error('PieChart component error:', error);
        reportError(error);
    }
}
