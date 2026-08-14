/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { FontProvider } from './context/FontContext';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { Toast } from './components/Toast';

// Views
import { HomeView } from './components/views/HomeView';
import { CoursesView } from './components/views/CoursesView';
import { ExamsView } from './components/views/ExamsView';
import { TamreenAIView } from './components/views/TamreenAIView';
import { ProfileView } from './components/views/ProfileView';
import { CircularsView } from './components/views/CircularsView';
import { SubjectWiseView } from './components/views/SubjectWiseView';
import { ResultView } from './components/views/ResultView';

// Modals & Drawers
import { CourseDetailsModal } from './components/modals/CourseDetailsModal';
import { CheckoutDrawer } from './components/modals/CheckoutDrawer';
import { ExamModal } from './components/modals/ExamModal';
import { RoutineModal } from './components/modals/RoutineModal';
import { NotificationDrawer } from './components/modals/NotificationDrawer';
import { FontSettingsModal } from './components/modals/FontSettingsModal';

const MainContent: React.FC = () => {
  const { activeTab, viewingResult } = useApp();

  return (
    <div className="min-h-screen bg-[#e9edf5] dark:bg-[#0d1522] text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-emerald-600 selection:text-white transition-colors duration-200">
      {/* Neumorphic Top Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-5 md:p-6 pb-20 md:pb-8">
        {/* If viewing a completed exam result, render as a dedicated inline page (No popup) */}
        {viewingResult ? (
          <ResultView />
        ) : (
          <>
            {activeTab === 'home' && <HomeView />}
            {activeTab === 'courses' && <CoursesView />}
            {activeTab === 'exams' && <ExamsView />}
            {activeTab === 'ai' && <TamreenAIView />}
            {activeTab === 'circular' && <CircularsView />}
            {activeTab === 'subject_wise' && <SubjectWiseView />}
            {activeTab === 'profile' && <ProfileView />}
          </>
        )}
      </main>

      {/* Neumorphic Bottom Navigation */}
      <BottomNavigation />

      {/* Modals & Overlays */}
      <CourseDetailsModal />
      <CheckoutDrawer />
      <ExamModal />
      <RoutineModal />
      <NotificationDrawer />
      <FontSettingsModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <FontProvider>
        <AppProvider>
          <MainContent />
        </AppProvider>
      </FontProvider>
    </ThemeProvider>
  );
}

