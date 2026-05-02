import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import TeamPage from "./pages/TeamPage";
import RosterPage from "./pages/RosterPage";
import GalleryPage from "./pages/GalleryPage";
import EvaCaenPage from "./pages/EvaCaenPage";
import ContactPage from "./pages/ContactPage";
import SchedulePage from "./pages/SchedulePage";
import NotFoundPage from "./pages/NotFoundPage";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="roster" element={<RosterPage />} />
            <Route path="galerie" element={<GalleryPage />} />
            <Route path="eva-caen" element={<EvaCaenPage />} />
            <Route path="calendrier" element={<SchedulePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="mentions-legales" element={<MentionsLegales />} />
            <Route path="politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
