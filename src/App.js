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
                {sortedArticles.length > 0 ? sortedArticles.map((article, index) => (<TimelineNode key={article.id} article={article} isLast={index === sortedArticles.length - 1} />)) : <p className="text-center text-gray-500 py-10">표시할 히스토리 기사가 없습니다.</p>}
            </div>
        </div>
    );
};

const MailSettings = ({ onSend }) => {
    const [recipient, setRecipient] = useState('');
    const [frequency, setFrequency] = useState('daily');
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-3 text-gray-700 flex items-center"><Mail className="mr-2" />메일 발송 설정</h2>
            <div className="space-y-3">
                <input type="email" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="수신자 이메일 주소" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-400"/>
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full p-2 border rounded-md bg-white">
                    <option value="daily">매일</option>
                    <option value="weekly">매주</option>
                    <option value="monthly">매월</option>
                </select>
                <button onClick={() => onSend(recipient, frequency)} className="w-full p-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition flex items-center justify-center gap-2"><Send size={16} /> 설정 저장 및 테스트 발송</button>
            </div>
            <p className="text-xs text-gray-500 mt-3">* 실제 서비스에서는 설정된 주기에 따라 요약된 뉴스 리포트를 메일로 자동 발송합니다.</p>
        </div>
    );
};

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
    </div>
);

const App = () => {
  const [keywords, setKeywords] = useState(["인공지능", "부동산 정책"]);
  const [sourceUrls, setSourceUrls] = useState(["https://news.naver.com", "https://www.chosun.com", "https://www.joongang.co.kr"]);
  const [searchPeriod, setSearchPeriod] = useState('1w');
  const [searchResults, setSearchResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [openSimilarGroups, setOpenSimilarGroups] = useState({});
  const [collapsedKeywords, setCollapsedKeywords] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({title: '', message: ''});

  const displayModal = (shouldShow) => {
    setShowModal(shouldShow);
  };

  const handleSearch = useCallback(() => {
    if (keywords.length === 0) {
      setSearchResults({});
      return;
    }
    setIsLoading(true);
    setSearchResults({}); 
    console.log("검색 실행. 대상 URL:", sourceUrls, "기간:", searchPeriod);

    setTimeout(() => {
      const allResults = {};
      keywords.forEach(keyword => {
        const resultsForKeyword = MOCK_NEWS_DATA[keyword] || [];
        const groupedResults = resultsForKeyword.reduce((acc, article) => {
          const key = article.group;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(article);
          return acc;
        }, {});
        allResults[keyword] = Object.values(groupedResults);
      });
      
      setSearchResults(allResults);
      setIsLoading(false);
      setCollapsedKeywords({});
    }, 1000);
  }, [keywords, sourceUrls, searchPeriod]);

  useEffect(() => {
    handleSearch();
  }, [keywords, handleSearch]);

  const handleSendMail = (recipient, frequency) => {
    if (!recipient) {
      setModalContent({ title: '오류', message: '메일을 받을 사람의 주소를 입력해주세요.' });
      setShowModal(true);
      return;
    }
    setModalContent({ title: '메일 발송', message: `${recipient} 주소로 테스트 메일이 성공적으로 발송되었습니다. 실제 서비스에서는 '${frequency}' 주기로 리포트가 발송됩니다.` });
    setShowModal(true);
  };
  
  const toggleSimilarGroup = (groupId) => {
    setOpenSimilarGroups(prev => ({...prev, [groupId]: !prev[groupId]}));
  };

  const toggleKeywordSection = (keyword) => {
    setCollapsedKeywords(prev => ({...prev, [keyword]: !prev[keyword]}));
  };

  const allArticlesForTimeline = useMemo(() => {
    return Object.values(searchResults).flat(2);
  }, [searchResults]);

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">NewsFlow</h1>
            <div className="flex items-center gap-2">
                <Tooltip text="즐겨찾기"><button className="p-2 rounded-full hover:bg-gray-200 transition"><Star className="text-gray-600" /></button></Tooltip>
                <Tooltip text="메일 설정"><button className="p-2 rounded-full hover:bg-gray-200 transition"><Mail className="text-gray-600" /></button></Tooltip>
            </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 space-y-6">
            <KeywordManager keywords={keywords} setKeywords={setKeywords} />
            <SourceUrlManager sourceUrls={sourceUrls} setSourceUrls={setSourceUrls} showModal={displayModal} setModalContent={setModalContent} />
            <SearchOptions searchPeriod={searchPeriod} setSearchPeriod={setSearchPeriod} onSearch={handleSearch} />
            <MailSettings onSend={handleSendMail} />
          </aside>
          <div className="lg:col-span-3">
            <div className="bg-white p-4 rounded-lg shadow-md min-h-[60vh]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">전체 키워드 검색 결과</h2>
                    <div className="flex gap-2">
                        <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-md text-sm font-semibold ${viewMode === 'list' ? 'bg-indigo-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>리스트 보기</button>
                        <button onClick={() => setViewMode('timeline')} className={`px-4 py-2 rounded-md text-sm font-semibold ${viewMode === 'timeline' ? 'bg-indigo-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>히스토리 보기</button>
                    </div>
                </div>
                {isLoading ? <LoadingSpinner /> : (
                    <>
                        {viewMode === 'list' && (
                            <div className="space-y-6">
                                {Object.keys(searchResults).length > 0 ? Object.entries(searchResults).map(([keyword, groups]) => {
                                    const isCollapsed = collapsedKeywords[keyword];
                                    const representativeArticles = groups.map(group => group.find(a => a.isRepresentative) || group[0]);
                                    return (
                                        <div key={keyword} className="border-t pt-4">
                                            <button onClick={() => toggleKeywordSection(keyword)} className="w-full flex justify-between items-center text-left mb-3">
                                                <h3 className="text-2xl font-semibold text-indigo-700">{keyword}</h3>
                                                {isCollapsed ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
                                            </button>
                                            {!isCollapsed && (
                                                <div className="space-y-4">
                                                    {representativeArticles.length > 0 ? representativeArticles.map(article => {
                                                        const group = groups.find(g => g.includes(article));
                                                        const similarArticles = group.filter(a => a.id !== article.id);
                                                        const isSimilarOpen = openSimilarGroups[article.group];
                                                        return (
                                                            <div key={article.id}>
                                                                <NewsCard article={article} onToggleSimilar={() => toggleSimilarGroup(article.group)} similarCount={similarArticles.length} />
                                                                {isSimilarOpen && (
                                                                    <div className="mt-2 space-y-2">
                                                                        {similarArticles.map(sim => <SimilarArticleItem key={sim.id} article={sim} />)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    }) : <p className="text-gray-500">검색 결과가 없습니다.</p>}
                                                </div>
                                            )}
                                        </div>
                                    )
                                }) : <p className="text-center text-gray-500 py-10">검색된 결과가 없습니다. 키워드를 추가하고 검색을 실행해주세요.</p>}
                            </div>
                        )}
                        {viewMode === 'timeline' && <TimelineView articles={allArticlesForTimeline} />}
                    </>
                )}
            </div>
          </div>
        </div>
      </main>
      {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
                    <h3 className="text-lg font-bold mb-4">{modalContent.title}</h3>
                    <p className="text-gray-700 mb-6">{modalContent.message}</p>
                    <button onClick={() => setShowModal(false)} className="w-full bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 transition">확인</button>
                </div>
            </div>
        )}
    </div>
  );
};

export default App;
