function ExportData({ works, participations }) {
    try {
        const [exportOptions, setExportOptions] = React.useState({
            format: 'pdf',
            timeRange: 'months',
            selectedMonths: [],
            selectedYear: new Date().getFullYear()
        });
        const [loading, setLoading] = React.useState(false);

        const generatePDFReport = (filteredWorks, filteredParticipations) => {
            const reportContent = `
                <html>
                <head>
                    <title>Reporte de Obras Públicas</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .summary { background: #f8f9fa; padding: 20px; margin-bottom: 30px; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .footer { margin-top: 30px; text-align: center; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Sistema Participa Perú</h1>
                        <h2>Reporte de Obras Públicas</h2>
                        <p>Período: ${exportOptions.timeRange === 'months' ? `Últimos ${exportOptions.timeValue} meses` : `Últimos ${exportOptions.timeValue} años`}</p>
                        <p>Fecha de generación: ${new Date().toLocaleDateString('es-PE')}</p>
                    </div>
                    
                    <div class="summary">
                        <h3>Resumen Ejecutivo</h3>
                        <p><strong>Total de obras:</strong> ${filteredWorks.length}</p>
                        <p><strong>Inversión total:</strong> S/ ${filteredWorks.reduce((sum, w) => sum + Number(w.objectData.inversion), 0).toLocaleString()}</p>
                        <p><strong>Total de observaciones:</strong> ${filteredParticipations.length}</p>
                    </div>
                    
                    <h3>Detalle de Obras</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Obra</th>
                                <th>Municipalidad</th>
                                <th>Inversión</th>
                                <th>Estado</th>
                                <th>Fecha Inicio</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredWorks.map(work => `
                                <tr>
                                    <td>${work.objectData.codigo}</td>
                                    <td>${work.objectData.obra}</td>
                                    <td>${work.objectData.municipalidad}</td>
                                    <td>S/ ${Number(work.objectData.inversion).toLocaleString()}</td>
                                    <td>${work.objectData.estado}</td>
                                    <td>${new Date(work.objectData.fechaInicio).toLocaleDateString('es-PE')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div class="footer">
                        <p>Generado por Sistema Participa Perú - Transparencia y Participación Ciudadana</p>
                    </div>
                </body>
                </html>
            `;
            
            const newWindow = window.open('', '_blank');
            newWindow.document.write(reportContent);
            newWindow.document.close();
            newWindow.print();
        };

        const generateExcelData = (filteredWorks, filteredParticipations) => {
            const csvContent = [
                ['Código', 'Obra', 'Municipalidad', 'Inversión', 'Estado', 'Contratista', 'Fecha Inicio', 'Fecha Fin'],
                ...filteredWorks.map(work => [
                    work.objectData.codigo,
                    work.objectData.obra,
                    work.objectData.municipalidad,
                    work.objectData.inversion,
                    work.objectData.estado,
                    work.objectData.contratista,
                    work.objectData.fechaInicio,
                    work.objectData.fechaFinalizacion
                ])
            ].map(row => row.join(',')).join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `reporte_obras_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        const handleExport = async () => {
            setLoading(true);
            try {
                let filteredWorks = [];
                let filteredParticipations = [];
                
                if (exportOptions.timeRange === 'months') {
                    filteredWorks = works.filter(work => {
                        const workDate = new Date(work.objectData.fechaRegistro);
                        return workDate.getFullYear() === exportOptions.selectedYear &&
                               exportOptions.selectedMonths.includes(workDate.getMonth() + 1);
                    });
                    
                    filteredParticipations = participations.filter(p => {
                        const pDate = new Date(p.objectData.fechaParticipacion);
                        return pDate.getFullYear() === exportOptions.selectedYear &&
                               exportOptions.selectedMonths.includes(pDate.getMonth() + 1);
                    });
                } else {
                    const selectedYears = exportOptions.selectedYears || [];
                    filteredWorks = works.filter(work => {
                        const workYear = new Date(work.objectData.fechaRegistro).getFullYear();
                        return selectedYears.includes(workYear);
                    });
                    
                    filteredParticipations = participations.filter(p => {
                        const pYear = new Date(p.objectData.fechaParticipacion).getFullYear();
                        return selectedYears.includes(pYear);
                    });
                }
                
                if (exportOptions.format === 'pdf') {
                    generatePDFReport(filteredWorks, filteredParticipations);
                } else {
                    generateExcelData(filteredWorks, filteredParticipations);
                }
                
                alert(`Reporte ${exportOptions.format.toUpperCase()} generado exitosamente`);
            } catch (error) {
                console.error('Error generating report:', error);
                alert('Error al generar el reporte');
            } finally {
                setLoading(false);
            }
        };

        return (
            <div data-name="export-data" data-file="components/ExportData.js" className="glass-effect rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <i data-lucide="download" className="w-5 h-5 mr-2 text-green-500"></i>
                    Exportar Datos
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Formato</label>
                        <select
                            value={exportOptions.format}
                            onChange={(e) => setExportOptions({...exportOptions, format: e.target.value})}
                            className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                        >
                            <option value="pdf">PDF</option>
                            <option value="excel">Excel (CSV)</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Período</label>
                        <select
                            value={exportOptions.timeRange}
                            onChange={(e) => setExportOptions({...exportOptions, timeRange: e.target.value})}
                            className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                        >
                            <option value="months">Por Meses</option>
                            <option value="years">Por Años</option>
                        </select>
                    </div>
                </div>

                {exportOptions.timeRange === 'months' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 mb-2 font-medium">Año</label>
                            <select
                                value={exportOptions.selectedYear}
                                onChange={(e) => setExportOptions({...exportOptions, selectedYear: parseInt(e.target.value)})}
                                className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                            >
                                {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 mb-2 font-medium">Meses (seleccione múltiples)</label>
                            <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                                {[
                                    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                                ].map((month, index) => (
                                    <label key={month} className="flex items-center space-x-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={exportOptions.selectedMonths.includes(index + 1)}
                                            onChange={(e) => {
                                                const months = [...exportOptions.selectedMonths];
                                                if (e.target.checked) {
                                                    months.push(index + 1);
                                                } else {
                                                    const idx = months.indexOf(index + 1);
                                                    if (idx > -1) months.splice(idx, 1);
                                                }
                                                setExportOptions({...exportOptions, selectedMonths: months});
                                            }}
                                            className="rounded"
                                        />
                                        <span>{month}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {exportOptions.timeRange === 'years' && (
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 font-medium">Años (seleccione múltiples)</label>
                        <div className="grid grid-cols-4 gap-2 border border-gray-300 rounded-lg p-4">
                            {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(year => (
                                <label key={year} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={exportOptions.selectedYears?.includes(year) || false}
                                        onChange={(e) => {
                                            const years = [...(exportOptions.selectedYears || [])];
                                            if (e.target.checked) {
                                                years.push(year);
                                            } else {
                                                const idx = years.indexOf(year);
                                                if (idx > -1) years.splice(idx, 1);
                                            }
                                            setExportOptions({...exportOptions, selectedYears: years});
                                        }}
                                        className="rounded"
                                    />
                                    <span>{year}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
                
                <button
                    onClick={handleExport}
                    disabled={loading}
                    className="btn-primary px-6 py-3 rounded-lg disabled:opacity-50"
                >
                    {loading ? 'Generando...' : `Exportar ${exportOptions.format.toUpperCase()}`}
                </button>
            </div>
        );
    } catch (error) {
        console.error('ExportData component error:', error);
        reportError(error);
    }
}