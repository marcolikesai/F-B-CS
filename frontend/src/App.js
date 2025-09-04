import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Predictions from './pages/Predictions';
import StandAnalysis from './pages/StandAnalysis';
import StaffingRecommendations from './pages/StaffingRecommendations';
import RiskAssessment from './pages/RiskAssessment';
import Methods from './pages/Methods';
import './App.css';

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', sans-serif;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Sidebar />
        <MainContent>
          <Header />
          <ContentArea>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/methods" element={<Methods />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/stand-analysis" element={<StandAnalysis />} />
              <Route path="/staffing" element={<StaffingRecommendations />} />
              <Route path="/risk-assessment" element={<RiskAssessment />} />
            </Routes>
          </ContentArea>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App; 