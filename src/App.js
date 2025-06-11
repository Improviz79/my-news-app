import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Mail, Search, X, Plus, Clock, ChevronsRight, Calendar, Star, Send, Link as LinkIcon, ChevronDown, ChevronUp } from 'lucide-react';

// --- 가상 데이터 ---
const MOCK_NEWS_DATA = {
  "인공지능": [
    { id: 1, title: "정부, AI 일상화 실행 계획 발표... 국민 체감 성과 창출 목표", press: "연합뉴스", date: "2025-06-11", url: "#", clicks: 1200, content: "정부가 인공지능(AI) 기술을 국민 생활과 산업 현장 곳곳에 확산하기 위한 'AI 일상화 실행 계획'을 발표했습니다.", group: 1, isRepresentative: true },
    { id: 2, title: "정부, 'AI 일상화' 선언... LLM 개발 등 전방위 지원", press: "전자신문", date: "2025-06-11", url: "#", clicks: 850, content: "AI 기술의 대중화를 목표로 정부가 새로운 실행 계획을 내놓았습니다.", group: 1 },
    { id: 3, title: "과기정통부, AI 확산 전략 공개", press: "YTN", date: "2025-06-11", url: "#", clicks: 730, content: "과학기술정보통신부는 오늘 브리핑을 통해 AI 기술 확산 전략을 공개했습니다.", group: 1 },
    { id: 4, title: "새로운 AI 칩 'Phoenix-V' 공개, 성능 2배 향상", press: "디지털데일리", date: "2025-06-09", url: "#", clicks: 2500, content: "국내 스타트업 'AI칩스'가 기존 제품 대비 2배의 성능을 자랑하는 새로운 AI 반도체 'Phoenix-V'를 공개하여 업계의 주목을 받고 있습니다.", group: 2, isRepresentative: true },
    { id: 5, title: "AI칩스, 차세대 AI 반도체 공개", press: "매일경제", date: "2025-06-09", url: "#", clicks: 1900, content: "AI칩스가 차세대 AI 반도체를 공개하며 기술력을 과시했습니다.", group: 2},
  ],
  "부동산 정책": [
    { id: 7, title: "정부, 2.4 부동산 공급 대책 후속 조치 발표", press: "한국경제", date: "2025-06-10", url: "#", clicks: 3200, content: "정부가 지난 2월 4일 발표한 부동산 공급 대책의 후속 조치로, 신규 택지 후보지를 공개하고 도심 고밀 개발 사업에 대한 구체적인 로드맵을 제시했습니다.", group: 4, isRepresentative: true },
    { id: 8, title: "국토부, 신규 택지 후보지 5곳 발표... '공급 확대'", press: "조선일보", date: "2025-06-10", url: "#", clicks: 2800, content: "국토교통부가 수도권 3곳과 지방 2곳의 신규 택지 후보지를 발표했습니다.", group: 4 },
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
          <div key={keyword} className="flex justify-between items-center p-2 rounded-md bg-gray-50 hover:bg-gray-100">
            <span className="font-medium text-gray-800">{keyword}</span>
            <button onClick={() => deleteKeyword(keyword)} className="text-gray-400 hover:text-red-500"><X size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const SourceUrlManager = ({ sourceUrls, setSourceUrls, showModal, setModalContent }) => {
  const [newUrl, setNewUrl] = useState("");
  const addUrl = (e) => {
    e.preventDefault();
    if (newUrl && !sourceUrls.includes(newUrl) && newUrl.startsWith('http')) {
      setSourceUrls([...sourceUrls, newUrl]);
      setNewUrl("");
    } else if (newUrl && !newUrl.startsWith('http')) {
        setModalContent({ title: '입력 오류', message: "URL은 'http://' 또는 'https://'로 시작해야 합니다." });
        showModal(true);
    }
  };
  const deleteUrl = (urlToDelete) => {
    setSourceUrls(sourceUrls.filter(url => url !== urlToDelete));
  };
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-3 text-gray-700 flex items-center"><LinkIcon size={18} className="mr-2" />검색 대상 사이트</h2>
      <form onSubmit={addUrl} className="flex gap-2 mb-3">
        <input type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://example.com" className="flex-grow p-2 border rounded-md focus:ring-2 focus:ring-indigo-400 transition" />
        <button type="submit" className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"><Plus size={20} /></button>
      </form>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {sourceUrls.map(url => (
          <div key={url} className="flex justify-between items-center p-2 rounded-md bg-gray-50">
            <span className="text-sm text-gray-600 truncate">{url}</span>
            <button onClick={() => deleteUrl(url)} className="text-gray-400 hover:text-red-500 flex-shrink-0 ml-2"><X size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const SearchOptions = ({ searchPeriod, setSearchPeriod, onSearch }) => {
  const periods = [ { value: '1d', label: '최근 1일' }, { value: '1w', label: '최근 1주' }, { value: '1m', label: '최근 1개월' } ];
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [showCustom, setShowCustom] = useState(false);

  const handlePeriodChange = (period) => {
    setSearchPeriod(period);
    setShowCustom(false);
  };
  const handleCustomRangeSearch = () => {
    if (customRange.start && customRange.end) { onSearch(); }
  };
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-3 text-gray-700">검색 옵션</h2>
      <div className="flex flex-wrap gap-2 mb-3">
        {periods.map(p => (<button key={p.value} onClick={() => handlePeriodChange(p.value)} className={`px-3 py-1 text-sm rounded-full transition ${searchPeriod === p.value ? 'bg-indigo-500 text-white font-semibold' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{p.label}</button>))}
        <button onClick={() => { setShowCustom(!showCustom); setSearchPeriod('custom'); }} className={`px-3 py-1 text-sm rounded-full transition ${showCustom ? 'bg-indigo-500 text-white font-semibold' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>기간 지정</button>
      </div>
      {showCustom && (
        <div className="space-y-2 p-3 bg-gray-50 rounded-md">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input type="date" value={customRange.start} onChange={e => setCustomRange({...customRange, start: e.target.value})} className="p-1 border rounded-md w-full" />
                <span className="hidden sm:inline">~</span>
                <input type="date" value={customRange.end} onChange={e => setCustomRange({...customRange, end: e.target.value})} className="p-1 border rounded-md w-full" />
            </div>
            <button onClick={handleCustomRangeSearch} className="w-full mt-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center justify-center gap-2"><Calendar size={16} /> 지정 기간으로 검색</button>
        </div>
      )}
      <button onClick={onSearch} className="w-full mt-4 p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition flex items-center justify-center gap-2"><Search size={20} /> 검색 실행</button>
    </div>
  );
};

const NewsCard = ({ article, onToggleSimilar, similarCount }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-semibold text-indigo-600">{article.press}</span>
            <span className="text-xs text-gray-500">{article.date}</span>
        </div>
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-gray-800 hover:text-indigo-700 transition-colors">{article.title}</a>
        <p className="text-gray-600 mt-2 text-sm">{article.content}</p>
        <div className="flex justify-between items-center mt-4">
            {similarCount > 0 && (<button onClick={onToggleSimilar} className="text-sm text-indigo-500 hover:underline">유사기사 {similarCount}건 보기</button>)}
        </div>
    </div>
);

const SimilarArticleItem = ({ article }) => (
    <div className="p-3 bg-gray-50 rounded-md ml-8 border-l-2 border-indigo-200">
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-700 hover:text-indigo-600">{article.title}</a>
        <div className="text-xs text-gray-500 mt-1">{article.press} | {article.date}</div>
    </div>
);

const TimelineNode = ({ article, isLast }) => (
    <div className="flex items-start">
        <div className="flex flex-col items-center mr-4">
            <div className={`w-4 h-4 rounded-full bg-indigo-500 ring-indigo-200 ring-4 z-10`}></div>
            {!isLast && <div className="w-0.5 flex-grow bg-gray-300"></div>}
        </div>
        <div className="flex-1 pb-8">
            <div className="bg-white p-4 rounded-lg shadow-md border -mt-2">
                <p className="text-sm text-gray-500 mb-1">{article.date}</p>
                <h3 className="font-bold text-gray-800 mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{article.content}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm font-semibold flex items-center">기사 원문 보기 <ChevronsRight size={16} className="ml-1" /></a>
            </div>
        </div>
    </div>
);

const TimelineView = ({ articles }) => {
    const sortedArticles = useMemo(() => {
        if (!articles || articles.length === 0) return [];
        return [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [articles]);
    return (
        <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center"><Clock className="mr-2 text-indigo-500"/>통합 주제 히스토리</h2>
            <div className="relative">
                {sortedArticles.len