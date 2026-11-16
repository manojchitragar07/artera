import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Palette,
  Upload,
  FolderKanban,
  MessageSquare,
  BarChart3,
  UserCheck,
  Settings,
  LogOut,
  Heart,
  Users,
  Clock,
  ShieldCheck,
  Layers,
  Sparkles,
  FileText,
  Home,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, subtitle }) => {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getArtistNav = () => [
    { label: 'Overview', path: '/artist/overview', icon: LayoutDashboard },
    { label: 'My Artwork', path: '/artist/artwork', icon: Palette },
    { label: 'Upload Artwork', path: '/artist/upload', icon: Upload },
    { label: 'Collections / Series', path: '/artist/collections', icon: FolderKanban },
    { label: 'Studio Enquiries', path: '/artist/enquiries', icon: MessageSquare },
    { label: 'Analytics', path: '/artist/analytics', icon: BarChart3 },
    { label: 'Edit Profile', path: '/artist/profile', icon: UserCheck },
  ];

  const getVisitorNav = () => [
    { label: 'My Salon Overview', path: '/visitor/overview', icon: LayoutDashboard },
    { label: 'Saved Artworks', path: '/visitor/saved', icon: Heart },
    { label: 'Following Artists', path: '/visitor/following', icon: Users },
    { label: 'My Enquiries', path: '/visitor/enquiries', icon: MessageSquare },
    { label: 'Account Settings', path: '/visitor/settings', icon: Settings },
  ];

  const getAdminNav = () => [
    { label: 'Curator Overview', path: '/admin/overview', icon: LayoutDashboard },
    { label: 'Artist Applications', path: '/admin/artists', icon: Users },
    { label: 'Artwork Approvals', path: '/admin/artworks', icon: Palette },
    { label: 'Curated Exhibitions', path: '/admin/exhibitions', icon: Sparkles },
    { label: 'Categories & Mediums', path: '/admin/categories', icon: Layers },
    { label: 'Reports & Audit Log', path: '/admin/reports', icon: FileText },
  ];

  let navItems = getVisitorNav();
  let portalRoleBadge = 'Art Enthusiast';

  if (role === 'ARTIST') {
    navItems = getArtistNav();
    portalRoleBadge = 'Traditional Artist';
  } else if (role === 'ADMIN') {
    navItems = getAdminNav();
    portalRoleBadge = 'Chief Curator';
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#252321] text-[#EAE2D5] flex-shrink-0 flex flex-col justify-between border-r border-[#47382F]">
        <div>
          {/* Dashboard Header */}
          <div className="p-6 border-b border-[#3A3633]">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <span className="font-serif text-2xl tracking-widest text-[#FAF7F2] group-hover:text-[#B49A65] transition-colors">
                ARTÉRA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#B49A65]" />
            </Link>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-[#B49A65] font-semibold">
                {portalRoleBadge}
              </span>
              {user?.status === 'PENDING_APPROVAL' && (
                <span className="text-[10px] px-2 py-0.5 bg-amber-900/60 text-amber-200 border border-amber-700/50 rounded">
                  Pending Approval
                </span>
              )}
            </div>
            <p className="text-xs text-[#FAF7F2] font-medium truncate mt-1">
              {user?.artistProfile?.name || user?.visitorProfile?.name || user?.email}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-wider transition-all rounded-none ${
                    isActive
                      ? 'bg-[#B49A65] text-[#FAF7F2] font-medium shadow-sm'
                      : 'text-[#858078] hover:text-[#FAF7F2] hover:bg-[#332F2D]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FAF7F2]' : 'text-[#B49A65]'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#3A3633] space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-wider text-[#858078] hover:text-[#FAF7F2] transition-colors"
          >
            <Home className="w-4 h-4 text-[#B49A65]" />
            Back to Public Gallery
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-xs uppercase tracking-wider text-[#858078] hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-[#FAF7F2] border-b border-[#E2D9CB] px-6 sm:px-10 py-6">
          <h1 className="font-serif text-2xl sm:text-3xl text-[#252321] font-semibold">{title}</h1>
          {subtitle && <p className="text-xs sm:text-sm text-[#858078] mt-1">{subtitle}</p>}
        </header>

        {/* Dynamic Page Content */}
        <div className="p-6 sm:p-10 flex-1">{children}</div>
      </main>
    </div>
  );
};

