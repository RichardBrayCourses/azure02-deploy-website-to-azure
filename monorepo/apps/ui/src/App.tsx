import { Route, Routes, BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import AuthProvider from "./context/AuthContext";
import ThemeProvider, { useTheme } from "./context/ThemeContext";
import {
  AdminHome,
  CaseDetailPage,
  CaseManagementHome,
  CheckDetailPage,
  CompaniesPage,
  CompanyDetailPage,
  ConsoleHome,
  CasesListPage,
  PlaceholderResourcePage,
  VerificationPortalPage,
} from "./pages/ConsolePages";
import NotFound from "./pages/NotFound";

const AppContent = () => {
  const { dark } = useTheme();
  document.documentElement.classList.toggle("dark", dark);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Routes>
        <Route path="/" element={<ConsoleHome />} />

        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/companies" element={<CompaniesPage />} />
        <Route path="/admin/companies/:companyId" element={<CompanyDetailPage />} />
        <Route path="/admin/verification-years" element={<PlaceholderResourcePage app="admin" />} />
        <Route path="/admin/check-templates" element={<PlaceholderResourcePage app="admin" />} />
        <Route path="/admin/users" element={<PlaceholderResourcePage app="admin" />} />

        <Route path="/cases" element={<CaseManagementHome />} />
        <Route path="/cases/list" element={<CasesListPage />} />
        <Route path="/cases/:caseId" element={<CaseDetailPage />} />
        <Route path="/cases/:caseId/checks/:checkId" element={<CheckDetailPage />} />
        <Route path="/cases/checks" element={<PlaceholderResourcePage app="cases" />} />
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
