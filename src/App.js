import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Mail, Search, X, Plus, Clock, ChevronsRight, Calendar, Star, Send, Link as LinkIcon, ChevronDown, ChevronUp } from 'lucide-react';

// --- 가상 데이터 ---
// 실제 애플리케이션에서는 백엔드 API를 통해 이 데이터를 받아옵니다.
const MOCK_NEWS_DATA = {
  "인공지능": [
    { id: 1, title: "정부, AI 일상화 실행 계획 발표... 국민 체감 성과 창출 목표", press: "연합뉴스", date: "2025-06-11", url: "#", clicks: 1200, content: "정부가 인공지능(AI) 기술을 국민 생활과 산업 현장 곳곳에 확산하기 위한 'AI 일상화 실행 계획'을 발표했습니다. 이번 계획에는 대규모 언어 모델(LLM) 개발 지원, AI 윤리 확립, 그리고 공공 서비스의 AI 도입 방안 등이 포함되었습니다.", group: 1, isRepresentative: true },
    { id: 4, title: "새로운 AI 칩 'Phoenix-V' 공개, 성능 2배 향상", press: "디지털데일리", date: "2025-06-09", url: "#", clicks: 2500, content: "국내 스타트업 'AI칩스'가 기존 제품 대비 2배의 성능을 자랑하는 새로운 AI 반도체 'Phoenix-V'를 공개하여 업계의 주목을 받고 있습니다.", group: 2, isRepresentative: true },
  ],
  "부동산 정책": [
    { id: 7, title: "정부, 2.4 부동산 공급 대책 후속 조치 발표", press: "한국경제", date: "2025-06-10", url: "#", clicks: 3200, content: "정부가 지난 2월 4일 발표한 부동산 공급 대책의 후속 조치로, 신규 택지 후보지를 공개하고 도심 고밀 개발 사업에 대한 구체적인 로드맵을 제시했습니다.", group: 4, isRepresentative: true },
  ]
};

// --- 컴포넌트 ---

const Tooltip = ({ children, text }) => (
  <div className="relative group flex items-center">
    {children}
    <div className="absolute left-full ml-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
      {text}
    </div>
  </div>
);

const KeywordManager = ({ keywords, setKeywords }) => {
  const [newKeyword, setNewKeyword] = useState("");

  const addKeyword = (e) => {
    e.preventDefault();
    if (newKeyword && !keywords.includes(newKeyword)) {
      setKeywords([...keywords, newKeyword]);
      setNewKeyword("");
    }
  };

  const deleteKeyword = (keywordToDelete) => {
    setKeywords(keywords.filter(k => k !== keywordToDelete));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-3 text-gray-700">키워드 관리</h2>
      <form onSubmit={addKeyword} className="flex gap-2 mb-3">
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          placeholder="키워드 추가..."
          className="flex-grow p-2 border rounded-md focus:ring-2 focus:ring-indigo-400 transition"
        />
        <button type="submit" className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition">
          <Plus size={20} />
        </button>
      </form>
      <div className="space-y-2">
        {keywords.map(keyword => (
          <div
            key={keyword}
            className="flex justify-between items-center p-2 rounded-md bg-gray-50 hover:bg-gray-100"
          >
            <span className="font-medium text-gray-800">{keyword}</span>
            <button onClick={() => deleteKeyword(keyword)} className="text-gray-400 hover:text-red-500">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ... (이전 코드의 다른 컴포넌트들은 생략 없이 모두 포함되어야 합니다)
// 여기서는 지면상 생략하지만, 실제로는 모든 컴포넌트 코드가 필요합니다.
const SourceUrlManager = ({ sourceUrls, setSourceUrls, showModal, setModalContent }) => {
  const [newUrl, setNewUrl] = useState("");
  const addUrl = (e) => { e.preventDefault(); /* ... */ };
  const deleteUrl = (urlToDelete) => { /* ... */ };
  // ... (이전과 동일)
  return <div>Source URL Manager</div>; // 임시 표시
};
const SearchOptions = ({ searchPeriod, setSearchPeriod, onSearch }) => { /* ... */ return <div>Search Options</div>; }; // 임시
const NewsCard = ({ article, onToggleSimilar, similarCount }) => { /* ... */ return <div>News Card</div>; }; // 임시
const SimilarArticleItem = ({ article }) => { /* ... */ return <div>Similar Article</div>; }; // 임시
const TimelineView = ({ articles }) => { /* ... */ return <div>Timeline View</div>; }; // 임시
const MailSettings = ({ onSend }) => { /* ... */ return <div>Mail Settings</div>; }; // 임시
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
    </div>
);


const App = () => {
  const [keywords, setKeywords] = useState(["인공지능", "부동산 정책"]);
  // ... (이전 App 컴포넌트의 모든 state와 함수들)
  const [sourceUrls, setSourceUrls] = useState(["https://news.naver.com"]);
  const [searchPeriod, setSearchPeriod] = useState('1w');
  const [searchResults, setSearchResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [openSimilarGroups, setOpenSimilarGroups] = useState({});
  const [collapsedKeywords, setCollapsedKeywords] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({title: '', message: ''});
  
  const handleSearch = useCallback(() => {
    if (keywords.length === 0) {
      setSearchResults({});
      return;
    }
    setIsLoading(true);
    setSearchResults({});
    
    setTimeout(() => {
      const allResults = {};
      keywords.forEach(keyword => {
        allResults[keyword] = (MOCK_NEWS_DATA[keyword] || []).map(article => [article]);
      });
      setSearchResults(allResults);
      setIsLoading(false);
    }, 1000);
  }, [keywords]);

  useEffect(() => {
    handleSearch();
  }, [keywords, handleSearch]);

  // ... (기타 모든 핸들러 함수들)
  const handleSendMail = () => {};
  const toggleSimilarGroup = () => {};
  const toggleKeywordSection = () => {};

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800">
       <header className="bg-white shadow-sm sticky top-0 z-20">
         <div className="container mx-auto px-4 py-3 flex justify-between items-center">
             <h1 className="text-2xl font-bold text-indigo-600">NewsFlow</h1>
         </div>
       </header>
       <main className="container mx-auto p-4">
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           <aside className="lg:col-span-1 space-y-6">
             <KeywordManager keywords={keywords} setKeywords={setKeywords} />
           