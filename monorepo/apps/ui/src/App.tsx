import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import AuthProvider, { useAuth } from "./context/AuthContext";
import ThemeProvider, { useTheme } from "./context/ThemeContext";
import { getDefaultConsolePath } from "./data/console";
import {
  CaseDetailPage,
  CaseManagementHome,
  TaskDetailPage,
  OperationalParticipantsPage,
  OperationalParticipantDetailPage,
  PlaceholderResourcePage,
  VerificationPortalPage,
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

        <Route path="/admin" element={<Navigate to="/admin/operational-participants" replace />} />
        <Route path="/admin/operational-participants" element={<OperationalParticipantsPage />} />
        <Route path="/admin/operational-participants/:operationalParticipantId" element={<OperationalParticipantDetailPage />} />
        <Route path="/admin/case-types" element={<PlaceholderResourcePage app="admin" />} />
        <Route path="/admin/task-templates" element={<PlaceholderResourcePage app="admin" />} />
        <Route path="/admin/users" element={<PlaceholderResourcePage app="admin" />} />

        <Route path="/cases" element={<CaseManagementHome />} />
        <Route path="/cases/:caseId" element={<CaseDetailPage />} />
        <Route path="/cases/:caseId/tasks/:taskId" element={<TaskDetailPage />} />
        <Route path="/cases/tasks" element={<PlaceholderResourcePage app="cases" />} />
        <Route path="/cases/evidence" element={<PlaceholderResourcePage app="cases" />} />
        <Route path="/cases/customer-preview" element={<PlaceholderResourcePage app="cases" />} />
        <Route path="/verification" element={<VerificationPortalPage />} />

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
