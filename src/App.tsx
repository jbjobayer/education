/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { Toast } from './components/Toast';

// Views
import { HomeView } from './components/views/HomeView';
import { CoursesView } from './components/views/CoursesView';
import { ExamsView } from './components/views/ExamsView';
import { TamreenAIView } from './components/views/TamreenAIView';
import { ProfileView } from './components/views/ProfileView';

// Modals & Drawers
import { CourseDetailsModal } from './components/modals/CourseDetailsModal';
import { CheckoutDrawer } from './components/modals/CheckoutDrawer';
import { ExamModal } from './components/modals/ExamModal';
import { ResultViewModal } from './components/modals/ResultViewModal';
import { RoutineModal } from './components/modals/RoutineModal';
import { NotificationDrawer } from './components/modals/NotificationDrawer';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-[#e9edf5] text-slate-800 flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      {/* Neumorphic Top Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-5 md:p-6">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'courses' && <CoursesView />}
        {activeTab === 'exams' && <ExamsView />}
        {activeTab === 'ai' && <TamreenAIView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Neumorphic Bottom Navigation */}
      <BottomNavigation />

      {/* Modals & Overlays */}
      <CourseDetailsModal />
      <CheckoutDrawer />
      <ExamModal />
      <ResultViewModal />
      <RoutineModal />
      <NotificationDrawer />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
