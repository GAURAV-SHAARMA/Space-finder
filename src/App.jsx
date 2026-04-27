import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Explorer from "./pages/Explorer";
import SpaceDetail from "./pages/SpaceDetail";
import AIRecommendations from "./pages/AIRecommendations";
import MapView from "./pages/MapView";
import Analytics from "./pages/Analytics";
import Community from "./pages/Community";
import "./styles/global.css";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar />
        <main style={{ paddingTop: "var(--nav-height)" }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/space/:id" element={<SpaceDetail />} />
            <Route path="/ai" element={<AIRecommendations />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </main>
        <Toast />
      </BrowserRouter>
    </AppProvider>
  );
}
