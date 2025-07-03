import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        BarElement,
        LineElement,
        PointElement,
        ArcElement,
        Title,
        Tooltip,
        Legend,
        Filler
} from 'chart.js';
import { Bar, Line, Doughnut, Scatter } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        LineElement,
        PointElement,
        ArcElement,
        Title,
        Tooltip,
        Legend,
        Filler
);

function Analytics() {
        const [students, setStudents] = useState([]);
        const [loading, setLoading] = useState(true);
        const [chartType, setChartType] = useState('bar');
        const [sortBy, setSortBy] = useState('rollno');

        const fetchData = async () => {
                try {
                        setLoading(true);
                        const response = await axios.get("http://localhost:8000/get-students");
                        setStudents(response.data);
                } catch (error) {
                        toast.error("Failed to fetch student data");
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => {
                fetchData();
        }, []);

        // Sort students based on selected criteria
        const sortedStudents = [...students].sort((a, b) => {
                if (sortBy === 'rollno') return a._id - b._id;
                if (sortBy === 'marks') return b.marks - a.marks;
                if (sortBy === 'name') return a.name.localeCompare(b.name);
                return 0;
        });

        // Generate colors for charts
        const generateColors = (count) => {
                const colors = [];
                for (let i = 0; i < count; i++) {
                        const hue = (i * 137.508) % 360; // Golden angle approximation
                        colors.push(`hsl(${hue}, 70%, 60%)`);
                }
                return colors;
        };

        // Chart data configuration
        const chartData = {
                labels: sortedStudents.map(student => `Roll ${student._id}`),
                datasets: [
                        {
                                label: 'Student Marks',
                                data: sortedStudents.map(student => student.marks),
                                backgroundColor: generateColors(sortedStudents.length),
                                borderColor: generateColors(sortedStudents.length).map(color => color.replace('60%', '50%')),
                                borderWidth: 2,
                                borderRadius: 8,
                                borderSkipped: false,
                        }
                ]
        };

        // Line chart data
        const lineChartData = {
                labels: sortedStudents.map(student => `Roll ${student._id}`),
                datasets: [
                        {
                                label: 'Student Performance',
                                data: sortedStudents.map(student => student.marks),
                                borderColor: 'rgb(102, 126, 234)',
                                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                borderWidth: 3,
                                fill: true,
                                tension: 0.4,
                                pointBackgroundColor: 'rgb(102, 126, 234)',
                                pointBorderColor: 'white',
                                pointBorderWidth: 2,
                                pointRadius: 6,
                                pointHoverRadius: 8,
                        }
                ]
        };

        // Doughnut chart data (Grade distribution)
        const getGradeDistribution = () => {
                const grades = { 'A+ (90-100)': 0, 'A (80-89)': 0, 'B (70-79)': 0, 'C (60-69)': 0, 'D (50-59)': 0, 'F (0-49)': 0 };
                students.forEach(student => {
                        if (student.marks >= 90) grades['A+ (90-100)']++;
                        else if (student.marks >= 80) grades['A (80-89)']++;
                        else if (student.marks >= 70) grades['B (70-79)']++;
                        else if (student.marks >= 60) grades['C (60-69)']++;
                        else if (student.marks >= 50) grades['D (50-59)']++;
                        else grades['F (0-49)']++;
                });
                return grades;
        };

        const gradeDistribution = getGradeDistribution();
        const doughnutData = {
                labels: Object.keys(gradeDistribution),
                datasets: [
                        {
                                data: Object.values(gradeDistribution),
                                backgroundColor: [
                                        '#4CAF50', // A+
                                        '#8BC34A', // A
                                        '#FF9800', // B
                                        '#FF5722', // C
                                        '#F44336', // D
                                        '#9C27B0'  // F
                                ],
                                borderWidth: 3,
                                borderColor: 'white',
                                hoverBorderWidth: 5,
                        }
                ]
        };

        // Scatter plot data
        const scatterData = {
                datasets: [
                        {
                                label: 'Roll No vs Marks',
                                data: students.map(student => ({
                                        x: student._id,
                                        y: student.marks
                                })),
                                backgroundColor: 'rgba(102, 126, 234, 0.6)',
                                borderColor: 'rgb(102, 126, 234)',
                                borderWidth: 2,
                                pointRadius: 8,
                                pointHoverRadius: 12,
                        }
                ]
        };

        // Chart options
        const chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                        legend: {
                                position: 'top',
                                labels: {
                                        font: { size: 14, weight: 'bold' },
                                        color: '#333',
                                        usePointStyle: true,
                                }
                        },
                        title: {
                                display: true,
                                text: 'Student Performance Analysis',
                                font: { size: 18, weight: 'bold' },
                                color: '#333',
                                padding: 20
                        },
                        tooltip: {
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                titleColor: 'white',
                                bodyColor: 'white',
                                borderColor: 'rgb(102, 126, 234)',
                                borderWidth: 1,
                                cornerRadius: 8,
                                displayColors: false,
                        }
                },
                scales: {
                        x: {
                                grid: {
                                        display: false,
                                },
                                ticks: {
                                        color: '#666',
                                        font: { size: 12 }
                                }
                        },
                        y: {
                                beginAtZero: true,
                                max: 100,
                                grid: {
                                        color: 'rgba(0, 0, 0, 0.1)',
                                },
                                ticks: {
                                        color: '#666',
                                        font: { size: 12 }
                                }
                        }
                },
                animation: {
                        duration: 2000,
                        easing: 'easeInOutQuart',
                }
        };

        const doughnutOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                        legend: {
                                position: 'right',
                                labels: {
                                        font: { size: 12, weight: 'bold' },
                                        color: '#333',
                                        usePointStyle: true,
                                        padding: 15
                                }
                        },
                        title: {
                                display: true,
                                text: 'Grade Distribution',
                                font: { size: 18, weight: 'bold' },
                                color: '#333',
                                padding: 20
                        },
                        tooltip: {
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                titleColor: 'white',
                                bodyColor: 'white',
                                borderColor: 'rgb(102, 126, 234)',
                                borderWidth: 1,
                                cornerRadius: 8,
                                callbacks: {
                                        label: function (context) {
                                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                                return `${context.label}: ${context.parsed} students (${percentage}%)`;
                                        }
                                }
                        }
                },
                animation: {
                        animateRotate: true,
                        animateScale: true,
                        duration: 2000,
                }
        };

        // Statistics
        const getStatistics = () => {
                if (students.length === 0) return {};

                const marks = students.map(s => s.marks);
                const total = marks.reduce((a, b) => a + b, 0);
                const average = total / students.length;
                const highest = Math.max(...marks);
                const lowest = Math.min(...marks);
                const topStudent = students.find(s => s.marks === highest);

                return {
                        total: students.length,
                        average: average.toFixed(2),
                        highest,
                        lowest,
                        topStudent: topStudent?.name || 'N/A'
                };
        };

        const stats = getStatistics();

        const renderChart = () => {
                const commonProps = {
                        data: chartType === 'line' ? lineChartData : chartData,
                        options: chartOptions,
                        height: 400
                };

                switch (chartType) {
                        case 'bar':
                                return <Bar {...commonProps} />;
                        case 'line':
                                return <Line {...commonProps} />;
                        case 'doughnut':
                                return <Doughnut data={doughnutData} options={doughnutOptions} height={400} />;
                        case 'scatter':
                                return <Scatter data={scatterData} options={chartOptions} height={400} />;
                        default:
                                return <Bar {...commonProps} />;
                }
        };

        if (loading) {
                return (
                        <Container className="py-5">
                                <div className="text-center">
                                        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                                                <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <h4 className="mt-3">Loading Analytics...</h4>
                                </div>
                        </Container>
                );
        }

        if (students.length === 0) {
                return (
                        <Container className="py-5">
                                <Alert variant="info" className="text-center">
                                        <Alert.Heading>📊 No Data Available</Alert.Heading>
                                        <p>Add some students to see beautiful analytics and charts!</p>
                                </Alert>
                        </Container>
                );
        }

        return (
                <div className="analytics-page fade-in-up">
                        <Container fluid className="py-4">
                                <Row>
                                        <Col>
                                                <h1 className="text-center mb-4">📊 Student Analytics Dashboard</h1>
                                        </Col>
                                </Row>

                                {/* Statistics Cards */}
                                <Row className="mb-4">
                                        <Col md={3} sm={6} className="mb-3">
                                                <Card className="stats-card text-center h-100">
                                                        <Card.Body>
                                                                <div className="stats-icon">👥</div>
                                                                <h3 className="text-primary">{stats.total}</h3>
                                                                <p className="text-muted mb-0">Total Students</p>
                                                        </Card.Body>
                                                </Card>
                                        </Col>
                                        <Col md={3} sm={6} className="mb-3">
                                                <Card className="stats-card text-center h-100">
                                                        <Card.Body>
                                                                <div className="stats-icon">📈</div>
                                                                <h3 className="text-success">{stats.average}</h3>
                                                                <p className="text-muted mb-0">Average Marks</p>
                                                        </Card.Body>
                                                </Card>
                                        </Col>
                                        <Col md={3} sm={6} className="mb-3">
                                                <Card className="stats-card text-center h-100">
                                                        <Card.Body>
                                                                <div className="stats-icon">🏆</div>
                                                                <h3 className="text-warning">{stats.highest}</h3>
                                                                <p className="text-muted mb-0">Highest Score</p>
                                                        </Card.Body>
                                                </Card>
                                        </Col>
                                        <Col md={3} sm={6} className="mb-3">
                                                <Card className="stats-card text-center h-100">
                                                        <Card.Body>
                                                                <div className="stats-icon">⭐</div>
                                                                <h3 className="text-info">{stats.topStudent}</h3>
                                                                <p className="text-muted mb-0">Top Performer</p>
                                                        </Card.Body>
                                                </Card>
                                        </Col>
                                </Row>

                                {/* Chart Controls */}
                                <Row className="mb-4">
                                        <Col>
                                                <Card className="control-panel">
                                                        <Card.Body>
                                                                <Row className="align-items-center">
                                                                        <Col md={4}>
                                                                                <Form.Group>
                                                                                        <Form.Label>📊 Chart Type</Form.Label>
                                                                                        <Form.Select
                                                                                                value={chartType}
                                                                                                onChange={(e) => setChartType(e.target.value)}
                                                                                        >
                                                                                                <option value="bar">📊 Bar Chart</option>
                                                                                                <option value="line">📈 Line Chart</option>
                                                                                                <option value="doughnut">🍩 Grade Distribution</option>
                                                                                                <option value="scatter">📍 Scatter Plot</option>
                                                                                        </Form.Select>
                                                                                </Form.Group>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                                <Form.Group>
                                                                                        <Form.Label>🔄 Sort By</Form.Label>
                                                                                        <Form.Select
                                                                                                value={sortBy}
                                                                                                onChange={(e) => setSortBy(e.target.value)}
                                                                                        >
                                                                                                <option value="rollno">Roll Number</option>
                                                                                                <option value="marks">Marks (High to Low)</option>
                                                                                                <option value="name">Name (A to Z)</option>
                                                                                        </Form.Select>
                                                                                </Form.Group>
                                                                        </Col>
                                                                        <Col md={4} className="d-flex align-items-end">
                                                                                <Button variant="primary" onClick={fetchData} className="w-100">
                                                                                        🔄 Refresh Data
                                                                                </Button>
                                                                        </Col>
                                                                </Row>
                                                        </Card.Body>
                                                </Card>
                                        </Col>
                                </Row>

                                {/* Main Chart */}
                                <Row className="mb-4">
                                        <Col>
                                                <Card className="chart-card">
                                                        <Card.Body>
                                                                <div className="chart-container">
                                                                        {renderChart()}
                                                                </div>
                                                        </Card.Body>
                                                </Card>
                                        </Col>
                                </Row>

                                {/* Secondary Charts */}
                                {chartType !== 'doughnut' && (
                                        <Row>
                                                <Col md={6} className="mb-4">
                                                        <Card className="chart-card">
                                                                <Card.Body>
                                                                        <div className="chart-container" style={{ height: '300px' }}>
                                                                                <Doughnut data={doughnutData} options={doughnutOptions} />
                                                                        </div>
                                                                </Card.Body>
                                                        </Card>
                                                </Col>
                                                <Col md={6} className="mb-4">
                                                        <Card className="chart-card">
                                                                <Card.Body>
                                                                        <div className="chart-container" style={{ height: '300px' }}>
                                                                                <Line data={lineChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: 'Performance Trend' } } }} />
                                                                        </div>
                                                                </Card.Body>
                                                        </Card>
                                                </Col>
                                        </Row>
                                )}
                        </Container>
                </div>
        );
}

export default Analytics;