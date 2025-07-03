import { useLocation, useNavigate } from "react-router-dom";
import StudentForm from "../components/StudentForm";
import axios from "axios";
import { toast } from "react-toastify";

function Update() {
	const { state } = useLocation();
	const nav = useNavigate();

	// Redirect to home if no state is provided
	if (!state) {
		nav("/");
		return null;
	}

	const handleSubmit = async (values, formikHelpers) => {
		try {
			await axios.put("https://day27-mern-sms-app-backend.onrender.com/update-student", values);
			toast.success("✅ Student updated successfully!");
			nav("/");
		} catch {
			toast.error("❌ Update failed");
		} finally {
			formikHelpers.setSubmitting(false);
		}
	};

	return (
		<div className="fade-in-up">
			<h2 className="text-center mb-4">✏️ Update Student</h2>
			<div className="row justify-content-center">
				<div className="col-md-8 col-lg-6">
					<StudentForm
						initialValues={{
							rno: state._id,
							name: state.name,
							marks: state.marks
						}}
						isUpdate={true}
						onSubmit={handleSubmit}
					/>
				</div>
			</div>
		</div>
	);
}

export default Update;