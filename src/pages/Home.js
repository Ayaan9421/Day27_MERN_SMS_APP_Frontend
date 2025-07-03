import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Home() {
	const [info, setInfo] = useState([]);
	const [search, setSearch] = useState("");
	const [sortKey, setSortKey] = useState("");
	const [loading, setLoading] = useState(true);
	const nav = useNavigate();

	const fetchData = () => {
		setLoading(true);
		axios.get("https://day27-mern-sms-app-backend.onrender.com/get-students")
			.then(res => {
				setInfo(res.data);
				setLoading(false);
			})
			.catch(() => {
				toast.error("Could not fetch students");
				setLoading(false);
			});
	};

	useEffect(() => { fetchData(); }, []);

	const delStu = (rno) => {
		if (!window.confirm("Are you sure you want to delete this record?")) return;
		axios.delete("https://day27-mern-sms-app-backend.onrender.com/delete-student", { data: { rno } })
			.then(() => {
				toast.success("Student deleted successfully! 🎉");
				fetchData();
			})
			.catch(() => toast.error("Deletion failed"));
	};

	const updStu = (r, n, m) => {
		nav("/update", { state: { _id: r, name: n, marks: m } });
	};

	const filtered = info.filter(stu =>
		stu.name.toLowerCase().includes(search.toLowerCase()) ||
		String(stu.marks).includes(search)
	);

	const sorted = [...filtered].sort((a, b) => {
		if (sortKey === "marks") return b.marks - a.marks;
		if (sortKey === "rno") return a._id - b._id;
		return 0;
	});

	if (loading) {
		return (
			<div className="text-center py-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				<p className="mt-3">Loading students...</p>
			</div>
		);
	}

	return (
		<div className="fade-in-up">
			<h1 className="text-center mb-4">🎓 Student Management System</h1>

			<div className="search-filter-section">
				<Row className="align-items-center">
					<Col md={6} className="mb-3 mb-md-0">
						<Form.Control
							type="text"
							placeholder="🔍 Search by name or marks..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="search-input"
						/>
					</Col>
					<Col md={4} className="mb-3 mb-md-0">
						<Form.Select
							onChange={(e) => setSortKey(e.target.value)}
							value={sortKey}
							className="sort-select"
						>
							<option value="">📊 Sort By</option>
							<option value="marks">📈 Marks (High to Low)</option>
							<option value="rno">🔢 Roll No (Ascending)</option>
						</Form.Select>
					</Col>
					<Col md={2}>
						<Button
							variant="primary"
							onClick={() => nav("/create")}
							className="w-100"
						>
							➕ Add Student
						</Button>
					</Col>
				</Row>
			</div>

			{sorted.length === 0 ? (
				<div className="empty-state">
					<h3>📚 No Students Found</h3>
					<p>
						{search ?
							"No students match your search criteria." :
							"Get started by adding your first student!"
						}
					</p>
					{!search && (
						<Button
							variant="primary"
							onClick={() => nav("/create")}
							className="mt-3"
						>
							Add First Student
						</Button>
					)}
				</div>
			) : (
				<>
					<div className="mb-3">
						<small className="text-muted">
							Showing {sorted.length} student{sorted.length !== 1 ? 's' : ''}
							{search && ` matching "${search}"`}
						</small>
					</div>
					<div className="student-grid">
						{sorted.map((stu, index) => (
							<Card key={stu._id} className="h-100 slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
								<Card.Body className="d-flex flex-column">
									<div className="mb-auto">
										<Card.Title className="d-flex align-items-center">
											<span className="me-2">🎓</span>
											Roll No: {stu._id}
										</Card.Title>
										<Card.Subtitle className="mb-2 d-flex align-items-center">
											<span className="me-2">👤</span>
											{stu.name}
										</Card.Subtitle>
										<Card.Text className="d-flex align-items-center">
											<span className="me-2">📊</span>
											<strong>Marks: {stu.marks}</strong>
											<span className="ms-2">
												{stu.marks >= 90 ? "🏆" : stu.marks >= 80 ? "🥉" : stu.marks >= 70 ? "📈" : "📚"}
											</span>
										</Card.Text>
									</div>
									<div className="d-flex justify-content-between gap-2 mt-3">
										<Button
											variant="danger"
											size="sm"
											onClick={() => delStu(stu._id)}
											className="flex-fill"
										>
											🗑️ Delete
										</Button>
										<Button
											variant="primary"
											size="sm"
											onClick={() => updStu(stu._id, stu.name, stu.marks)}
											className="flex-fill"
										>
											✏️ Update
										</Button>
									</div>
								</Card.Body>
							</Card>
						))}
					</div>
				</>
			)}
		</div>
	);
}

export default Home;