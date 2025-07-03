import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Update from "./pages/Update";
import NavBar from "./components/NavBar";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Import your custom CSS file

function App() {
	return (
		<BrowserRouter>
			<NavBar />
			<div className="container">
				<div className="main-content">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/create" element={<Create />} />
						<Route path="/update" element={<Update />} />
					</Routes>
				</div>
			</div>
			<ToastContainer
				position="bottom-center"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
			/>
		</BrowserRouter>
	);
}

export default App;