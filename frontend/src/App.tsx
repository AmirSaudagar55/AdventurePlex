// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import CategoryPage from "./pages/CategoryPage";
import ActivityDetail from "./pages/ActivityDetail"; // You may remove if not needed
import ConferenceHallDetails from "./pages/ConferenceHallDetails"; 
import Book from "./pages/Book";
import BookingStepper from "./pages/BookingStepper";
import ConferenceHallBookingStepper from "./pages/ConferenceHallBookingStepper";
import About from "./pages/About";
import Contact from "./pages/Contact";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import BookingsPage from "./pages/BookingsPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/book" element={<Book />} />
            <Route path="/booking-stepper" element={<BookingStepper />} />
            <Route path="//conferenceHallBookingStepper" element={<ConferenceHallBookingStepper />} />
            <Route path="/about" element={<About />} />
            <Route path="/activity/:id" element={<ActivityDetail />} />
            <Route path="/conferenceHall/:id" element={<ConferenceHallDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/bookings" element={<BookingsPage />} />
          </Routes>
        </main>
        <ToastContainer />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
