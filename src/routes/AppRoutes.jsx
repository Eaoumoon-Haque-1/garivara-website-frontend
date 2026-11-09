import { Navigate, Route, Routes } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import BlogsPage from "../pages/BlogsPage";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import WhyChooseUsPage from "../pages/WhyChooseUsPage";
import ContactUsPage from "../pages/ContactUsPage";
import VehicleSearchResultsPage from "../pages/VehicleSearchResultsPage";
import BookingDetailsPage from "../pages/BookingDetailsPage";
import TripBiddingPage from "../pages/TripBiddingPage";
import MyTravelsPage from "../pages/MyTravelsPage";
import ProtectedRoute from "./ProtectedRoutes";


function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Navigate to="/car" replace />} />
        <Route path="car" element={<HomePage />} />
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="login" element={<Login />} />
        <Route path="why-choose-us" element={<WhyChooseUsPage />} />
        <Route path="contact" element={<ContactUsPage />} />
        <Route
          path="car/search-results"
          element={<VehicleSearchResultsPage />}
        />
        <Route
          path="car/booking-details"
          element={
            <ProtectedRoute>
              <BookingDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="car/bidding/:tripId"
          element={
            <ProtectedRoute>
              <TripBiddingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-travels"
          element={
            <ProtectedRoute>
              <MyTravelsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
