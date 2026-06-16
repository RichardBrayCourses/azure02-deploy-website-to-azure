import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import AuthProvider, { useAuth } from "./context/AuthContext";
import DomainDataProvider, { useDomainData } from "./context/DomainDataContext";
import ThemeProvider, { useTheme } from "./context/ThemeContext";
import { getDefaultConsolePath } from "./data/console";
import {
  AccessGrantsPage,
  CaseDetailPage,
  CaseManagementHome,
  CaseTemplateDetailPage,
  CaseTemplatesPage,
  TaskDetailPage,
  AdminReferencePage,
  ParametersPage,
  ParticipantsPage,
  ParticipantDetailPage,
  StakeholderDetailPage,
  StakeholderCaseDetailPage,
  StakeholderParticipantDetailPage,
  StakeholdersPage,
  StakeholderPortalPage,
  HelperParticipantPage,
  HelperWorkspacePage,
} from "./pages/ConsolePages";
import NotFound from "./pages/NotFound";
import SignInPage from "./pages/SignInPage";

const AppContent = () => {
  const { dark } = useTheme();
  const { user } = useAuth();
  const { version } = useDomainData();
  void version;
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
        <Route path="/admin/stakeholders" element={<StakeholdersPage />} />
        <Route path="/admin/stakeholders/:stakeholderId" element={<StakeholderDetailPage />} />
        <Route path="/admin/case-templates" element={<CaseTemplatesPage />} />
        <Route path="/admin/case-templates/:templateId" element={<CaseTemplateDetailPage />} />
        <Route path="/admin/task-types" element={<AdminReferencePage />} />
        <Route path="/admin/users" element={<AdminReferencePage />} />
        <Route path="/admin/parameters" element={<ParametersPage />} />

        <Route path="/cases" element={<CaseManagementHome />} />
        <Route path="/cases/access-grants" element={<AccessGrantsPage />} />
        <Route path="/cases/:caseId" element={<CaseDetailPage />} />
        <Route path="/cases/:caseId/tasks/:taskId" element={<TaskDetailPage />} />
        <Route path="/stakeholder" element={<StakeholderPortalPage />} />
        <Route path="/stakeholder/participants/:participantId" element={<StakeholderParticipantDetailPage />} />
        <Route path="/stakeholder/:caseId" element={<StakeholderCaseDetailPage />} />
        <Route path="/helper" element={<HelperWorkspacePage />} />
        <Route path="/helper/participants/:participantId" element={<HelperParticipantPage />} />

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
          <DomainDataProvider>
            <AppContent />
          </DomainDataProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
