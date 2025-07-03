import StudentForm from "../components/StudentForm";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Create() {
	const nav = useNavigate();

	const handleSubmit = async (values, formikHelpers) => {
		try {
			const url = "https://day27-mern-sms-app-backend.onrender.com/save-student";
			const res = await axios.post(url, values);
			if (res.data.insertedId) {
				toast.success("🎉 Student created successfully!");
				nav("/");
			} else if (res.data.code === 11000) {
				toast.error("⚠️ Roll number already exists");
			} else {
				toast.warning("🤔 Something went wrong");
			}
		} catch (err) {
			toast.error("❌ Server error");
		} finally {
			formikHelpers.setSubmitting(false);
		}
	};

	return (
		<div className="fade-in-up">
			<h2 className="text-center mb-4">➕ Create New Student</h2>
			<div className="row justify-content-center">
				<div className="col-md-8 col-lg-6">
					<StudentForm
						initialValues={{ rno: "", name: "", marks: "" }}
						isUpdate={false}
						onSubmit={handleSubmit}
					/>
				</div>
			</div>
		</div>
	);
}

export default Create;