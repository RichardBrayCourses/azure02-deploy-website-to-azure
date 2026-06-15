import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import AuthProvider, { useAuth } from "./context/AuthContext";
import ThemeProvider, { useTheme } from "./context/ThemeContext";
import { getDefaultConsolePath } from "./data/console";
import {
  CaseDetailPage,
  CaseManagementHome,
  TaskDetailPage,
  ParticipantsPage,
  ParticipantDetailPage,
  PlaceholderResourcePage,
  StakeholderCaseDetailPage,
  StakeholderPortalPage,
} from "./pages/ConsolePages";
import NotFound from "./pages/NotFound";
import SignInPage from "./pages/SignInPage";

const AppContent = () => {
  const { dark } = useTheme();
  const { user } = useAuth();
  document.documentElement.classList.toggle("dark", dark);

  if (!user.isLoggedIn) {
    return <SignInPage />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to={getDefaultConsolePath(user.role)} replace />} />

        <Route path="/admin" element={<Navigate to="/admin/participants" replace />} />
        <Route path="/admin/participants" element={<ParticipantsPage />} />
        <Route path="/admin/participants/:participantId" element={<ParticipantDetailPage />} />
        <Route path="/admin/case-types" element={<PlaceholderResourcePage app="admin" />} />
        <Route path="/admin/task-templates" element={<PlaceholderResourcePage app="admin" />} />
        <Route path="/admin/users" element={<PlaceholderResourcePage app="admin" />} />

        <Route path="/cases" element={<CaseManagementHome />} />
        <Route path="/cases/:caseId" element={<CaseDetailPage />} />
        <Route path="/cases/:caseId/tasks/:taskId" element={<TaskDetailPage />} />
        <Route path="/cases/tasks" element={<PlaceholderResourcePage app="cases" />} />
        <Route path="/cases/evidence" element={<PlaceholderResourcePage app="cases" />} />
        <Route path="/cases/stakeholder-preview" element={<PlaceholderResourcePage app="cases" />} />
        <Route path="/stakeholder" element={<StakeholderPortalPage />} />
        <Route path="/stakeholder/:caseId" element={<StakeholderCaseDetailPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
