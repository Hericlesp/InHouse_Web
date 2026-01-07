import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthView from './views/AuthView';
import FeedView from './views/FeedView';
import MarketplaceView from './views/MarketplaceView';
import PropertyDetailView from './views/PropertyDetailView';
import ProfileView from './views/ProfileView';
import SettingsView from './views/SettingsView';
import FavoritesView from './views/FavoritesView';
import OwnerDashboardView from './views/OwnerDashboardView';
import OwnerLeadsView from './views/OwnerLeadsView';
import OwnerPropertiesView from './views/OwnerPropertiesView';
import AddPropertyView from './views/AddPropertyView';
import ChatView from './views/ChatView';
import ChatWindow from './views/ChatWindow';
import NotificationsView from './views/NotificationsView';
import Sidebar from './components/Sidebar';
import './styles/theme.css';
import './App.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/auth" />;
};

// Main Layout with Sidebar
const MainLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthView />} />

      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <MainLayout>
              <FeedView />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/marketplace"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MarketplaceView />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/property/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PropertyDetailView />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ChatView />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/messages/:chatId"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ChatWindow />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <MainLayout>
              <FavoritesView />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <MainLayout>
              <NotificationsView />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfileView />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SettingsView />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <OwnerDashboardView />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/leads"
        element={
          <ProtectedRoute>
            <MainLayout>
              <OwnerLeadsView />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/properties"
        element={
          <ProtectedRoute>
            <MainLayout>
              <OwnerPropertiesView />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/properties/new"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AddPropertyView />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={<Navigate to="/feed" />}
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
