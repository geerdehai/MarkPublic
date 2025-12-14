import React, { useState, useEffect } from 'react';
import { Plus, Search, Sparkles, ChevronLeft, Trash2, Edit2, Share } from 'lucide-react';
import { Idea, ViewState, IdeaFormData } from './types';
import { Button, Input, TextArea, Tag } from './components/UIComponents';
import IdeaCard from './components/IdeaCard';
import { enhanceIdeaWithAI, generateSampleIdeas } from './services/geminiService';

const MOCK_IDEAS: Idea[] = [
  {
    id: '1',
    title: 'Gemini Sous Chef',
    description: 'A cooking assistant that watches your video feed in real-time to track cooking steps, warn about burning, and suggest next steps based on ingredients seen on the counter.',
    author: 'Alex D.',
    tags: ['Vision', 'Real-time', 'Lifestyle'],
    likes: 42,
    createdAt: Date.now() - 10000000,
    aiGenerated: false
  },
  {
    id: '2',
    title: 'Code Review Buddy',
    description: 'Upload a screen recording of a bug reproduction. Gemini 3 analyzes the UI behavior and the accompanying log files to pinpoint the exact line of code causing the crash.',
    author: 'Sarah J.',
    tags: ['DevTool', 'Video Analysis', 'Productivity'],
    likes: 128,
    createdAt: Date.now() - 5000000,
    aiGenerated: false
  }
];

const App = () => {
  // State
  const [ideas, setIdeas] = useState<Idea[]>(() => {
    const saved = localStorage.getItem('gemini_ideas');
    return saved ? JSON.parse(saved) : MOCK_IDEAS;
  });
  
  const [view, setView] = useState<ViewState>(ViewState.LIST);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [formData, setFormData] = useState<IdeaFormData>({
    title: '',
    description: '',
    author: '',
    tags: []
  });
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isGeneratingSamples, setIsGeneratingSamples] = useState(false);

  // Effects
  useEffect(() => {
    localStorage.setItem('gemini_ideas', JSON.stringify(ideas));
  }, [ideas]);

  // Actions
  const handleIdeaClick = (idea: Idea) => {
    setSelectedIdea(idea);
    setView(ViewState.DETAIL);
  };

  const handleBack = () => {
    if (view === ViewState.EDIT) {
      setView(ViewState.DETAIL);
    } else {
      setView(ViewState.LIST);
      setSelectedIdea(null);
    }
  };

  const handleAddNew = () => {
    setFormData({ title: '', description: '', author: '', tags: [] });
    setView(ViewState.ADD);
  };

  const handleEdit = () => {
    if (selectedIdea) {
      setFormData({
        title: selectedIdea.title,
        description: selectedIdea.description,
        author: selectedIdea.author,
        tags: selectedIdea.tags
      });
      setView(ViewState.EDIT);
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.author) return;

    if (view === ViewState.EDIT && selectedIdea) {
      const updatedIdeas = ideas.map(idea => 
        idea.id === selectedIdea.id 
          ? { ...idea, ...formData } 
          : idea
      );
      setIdeas(updatedIdeas);
      setSelectedIdea({ ...selectedIdea, ...formData });
      setView(ViewState.DETAIL);
    } else {
      const newIdea: Idea = {
        id: Date.now().toString(),
        ...formData,
        likes: 0,
        createdAt: Date.now(),
        aiGenerated: isAiLoading // Rough approximation if they used the button recently
      };
      setIdeas([newIdea, ...ideas]);
      setView(ViewState.LIST);
    }
  };

  const handleDelete = () => {
    if (selectedIdea) {
      setIdeas(ideas.filter(i => i.id !== selectedIdea.id));
      handleBack();
    }
  };

  const handleAiEnhance = async () => {
    if (!formData.title) return;
    setIsAiLoading(true);
    const result = await enhanceIdeaWithAI(formData.title);
    setFormData(prev => ({
      ...prev,
      description: result.description,
      tags: result.tags
    }));
    setIsAiLoading(false);
  };

  const handleGenerateSamples = async () => {
    setIsGeneratingSamples(true);
    const samples = await generateSampleIdeas();
    if (samples && samples.length > 0) {
      const newIdeas = samples.map(s => ({
        id: Math.random().toString(36).substr(2, 9),
        title: s.title || 'Untitled',
        description: s.description || '',
        author: 'Gemini AI',
        tags: s.tags || [],
        likes: 0,
        createdAt: Date.now(),
        aiGenerated: true
      }));
      setIdeas(prev => [...newIdeas, ...prev]);
    }
    setIsGeneratingSamples(false);
  };

  const filteredIdeas = ideas.filter(i => 
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Components within App for easier state access
  
  // Navigation Bar
  const Navbar = ({ title, left, right }: { title: string, left?: React.ReactNode, right?: React.ReactNode }) => (
    <div className="sticky top-0 z-50 bg-ios-bg/80 backdrop-blur-xl border-b border-gray-200/50 pt-safe-top">
      <div className="h-12 flex items-center justify-between px-4">
        <div className="w-20 flex justify-start">{left}</div>
        <h1 className="font-semibold text-lg text-black truncate">{title}</h1>
        <div className="w-20 flex justify-end">{right}</div>
      </div>
    </div>
  );

  // Main Render
  return (
    // Responsive Container: 
    // On Desktop (sm:): Black background, centered "iPhone" frame.
    // On Mobile (default): Full screen, native white/gray background.
    <div className="min-h-screen w-full bg-ios-bg sm:bg-black sm:flex sm:items-center sm:justify-center font-sans antialiased text-gray-900">
      
      {/* App Container */}
      <div className="w-full h-[100dvh] sm:max-w-md sm:h-[844px] bg-ios-bg relative overflow-hidden flex flex-col sm:rounded-[3rem] sm:border-[8px] sm:border-gray-900 sm:shadow-2xl">
        
        {/* LIST VIEW */}
        {view === ViewState.LIST && (
          <>
            <Navbar 
              title="Gemini 3 Showcase" 
              right={
                <button onClick={handleAddNew} className="text-ios-blue hover:opacity-70 transition-opacity">
                  <Plus size={26} />
                </button>
              }
            />
            
            <div className="px-4 py-2 bg-ios-bg/80 backdrop-blur-md sticky top-[calc(3rem+env(safe-area-inset-top))] z-40 pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input 
                  type="text"
                  placeholder="Search ideas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-200/50 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:bg-gray-200 transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-safe-bottom no-scrollbar">
              <div className="pb-32"> {/* Extra padding for bottom scroll */}
                {filteredIdeas.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center px-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                      <Search size={32} />
                    </div>
                    <h3 className="font-semibold text-gray-600 mb-2">No ideas found</h3>
                    <p className="text-sm text-gray-400 mb-6">
                      Be the first to create a Gemini 3 app idea or let AI inspire you.
                    </p>
                    <Button variant="secondary" onClick={handleGenerateSamples} isLoading={isGeneratingSamples}>
                      <Sparkles size={16} />
                      Auto-Generate Ideas
                    </Button>
                  </div>
                ) : (
                  filteredIdeas.map(idea => (
                    <IdeaCard key={idea.id} idea={idea} onClick={handleIdeaClick} />
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* DETAIL VIEW */}
        {view === ViewState.DETAIL && selectedIdea && (
          <>
            <Navbar 
              title=""
              left={
                <button onClick={handleBack} className="flex items-center text-ios-blue -ml-2">
                  <ChevronLeft size={26} />
                  <span className="text-base">Back</span>
                </button>
              }
              right={
                <button onClick={handleEdit} className="text-ios-blue text-base">
                  Edit
                </button>
              }
            />
            <div className="flex-1 overflow-y-auto bg-white p-6 no-scrollbar pb-safe-bottom">
              <div className="mb-20">
                <span className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-2 block">
                  {selectedIdea.aiGenerated ? 'AI Generated Concept' : 'Community Idea'}
                </span>
                <h1 className="text-3xl font-bold mb-4 leading-tight">{selectedIdea.title}</h1>
                <div className="flex flex-wrap gap-2 mb-6">
                   {selectedIdea.tags.map(t => <Tag key={t} text={t}/>)}
                </div>
                
                <div className="h-px bg-gray-100 w-full mb-6"></div>
                
                <h2 className="text-lg font-semibold mb-2 text-gray-800">About this App</h2>
                <p className="text-gray-600 leading-relaxed text-lg mb-8">
                  {selectedIdea.description}
                </p>

                <div className="bg-gray-50 rounded-xl p-4 mb-8">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-sm text-gray-500">Submitted by</span>
                     <span className="font-medium">{selectedIdea.author}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-sm text-gray-500">Date</span>
                     <span className="font-medium">{new Date(selectedIdea.createdAt).toLocaleDateString()}</span>
                   </div>
                </div>
              </div>
            </div>
            <div className="bg-white border-t border-gray-100 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => {}}>
                <Share size={20} />
                Share
              </Button>
            </div>
          </>
        )}

        {/* ADD / EDIT VIEW */}
        {(view === ViewState.ADD || view === ViewState.EDIT) && (
          <div className="absolute inset-0 z-50 bg-ios-bg flex flex-col animate-in slide-in-from-bottom duration-300">
            <Navbar 
              title={view === ViewState.ADD ? "New Idea" : "Edit Idea"}
              left={
                <button onClick={handleBack} className="text-ios-blue text-base">
                  Cancel
                </button>
              }
              right={
                <button onClick={handleSave} className="font-semibold text-ios-blue text-base" disabled={!formData.title}>
                  Done
                </button>
              }
            />
            
            <div className="flex-1 overflow-y-auto p-4 pb-safe-bottom no-scrollbar">
              <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
                <Input 
                  label="App Name"
                  placeholder="e.g. Dream Scaper"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
                <Input 
                  label="Your Name"
                  placeholder="John Doe"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                />
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm mb-6 relative">
                 <div className="flex justify-between items-end mb-2">
                   <label className="text-sm font-medium text-gray-500 ml-1">Description</label>
                   <button 
                    onClick={handleAiEnhance}
                    disabled={!formData.title || isAiLoading}
                    className="flex items-center gap-1 text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full active:bg-purple-100 transition-colors disabled:opacity-50"
                   >
                     <Sparkles size={12} />
                     {isAiLoading ? 'Magic Thinking...' : 'AI Enhance'}
                   </button>
                 </div>
                <TextArea 
                  rows={6}
                  placeholder="Describe what the app does..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
                <p className="text-xs text-gray-400 mt-[-10px] px-1">
                  Tip: Use the AI Enhance button to auto-generate a description based on your title.
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm mb-8">
                <Input 
                  label="Tags (comma separated)"
                  placeholder="Vision, Audio, Kids..."
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})}
                />
                 <div className="flex flex-wrap gap-2 mt-2">
                   {formData.tags.filter(t => t).map((t, i) => <Tag key={i} text={t} />)}
                 </div>
              </div>

              {view === ViewState.EDIT && (
                <Button variant="destruct" className="w-full mb-8" onClick={handleDelete}>
                  <Trash2 size={18} />
                  Delete Idea
                </Button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;