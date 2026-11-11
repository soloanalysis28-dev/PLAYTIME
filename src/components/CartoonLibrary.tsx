import React, { useState, useRef } from 'react';
import {
  Search,
  Plus,
  Play,
  Film,
  Upload,
  Link as LinkIcon,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react';
import { CartoonVideo } from '../types';

interface CartoonLibraryProps {
  cartoons: CartoonVideo[];
  selectedVideoId: string;
  onSelectVideo: (video: CartoonVideo) => void;
  onAddCustomVideo: (video: CartoonVideo) => void;
}

export const CartoonLibrary: React.FC<CartoonLibraryProps> = ({
  cartoons,
  selectedVideoId,
  onSelectVideo,
  onAddCustomVideo,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<CartoonVideo['category']>('Cartoons');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'Cartoons', 'Animals & Nature', 'Nursery Rhymes', 'Adventures', 'Custom'];

  const filteredCartoons = cartoons.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      const newVideo: CartoonVideo = {
        id: `custom-file-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: 'Custom',
        description: 'Locally selected video from parent phone/tablet storage.',
        duration: 'Device File',
        thumbnail: 'custom',
        videoUrl: blobUrl,
        ageRating: 'Family Safe',
        isCustom: true,
      };
      onAddCustomVideo(newVideo);
      onSelectVideo(newVideo);
      setShowAddModal(false);
    }
  };

  const handleAddUrlVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim() || !customTitle.trim()) return;

    const newVideo: CartoonVideo = {
      id: `custom-url-${Date.now()}`,
      title: customTitle.trim(),
      category: customCategory,
      description: 'Custom video stream added by parent.',
      duration: 'Stream',
      thumbnail: 'custom',
      videoUrl: customUrl.trim(),
      ageRating: 'Selected by Parent',
      isCustom: true,
    };
    onAddCustomVideo(newVideo);
    onSelectVideo(newVideo);
    setCustomTitle('');
    setCustomUrl('');
    setShowAddModal(false);
  };

  // Render stylized, resilient SVG illustration cards
  const renderCardArtwork = (thumbnailKey: string, category: string) => {
    switch (thumbnailKey) {
      case 'bunny':
        return (
          <div className="w-full h-full bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-emerald-400/20 blur-xl" />
            <div className="text-4xl mb-1">🐰 🌳</div>
            <span className="text-[11px] font-bold text-emerald-200 tracking-wider uppercase">Big Buck Bunny</span>
          </div>
        );
      case 'joyride':
        return (
          <div className="w-full h-full bg-gradient-to-br from-amber-500 via-orange-600 to-rose-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute -left-4 -top-4 w-28 h-28 rounded-full bg-amber-400/20 blur-xl" />
            <div className="text-4xl mb-1">🦙 🚗</div>
            <span className="text-[11px] font-bold text-amber-200 tracking-wider uppercase">Cartoon Joyride</span>
          </div>
        );
      case 'dragon':
        return (
          <div className="w-full h-full bg-gradient-to-br from-violet-600 via-purple-700 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-28 h-28 rounded-full bg-violet-400/20 blur-xl" />
            <div className="text-4xl mb-1">🐉 ✨</div>
            <span className="text-[11px] font-bold text-purple-200 tracking-wider uppercase">Dragon Quest</span>
          </div>
        );
      case 'forest':
        return (
          <div className="w-full h-full bg-gradient-to-br from-lime-600 via-green-700 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="text-4xl mb-1">🦊 🏕️</div>
            <span className="text-[11px] font-bold text-lime-200 tracking-wider uppercase">Forest Campers</span>
          </div>
        );
      case 'critters':
        return (
          <div className="w-full h-full bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="text-4xl mb-1">🐿️ 🎈</div>
            <span className="text-[11px] font-bold text-sky-200 tracking-wider uppercase">Tiny Critters</span>
          </div>
        );
      case 'carnival':
        return (
          <div className="w-full h-full bg-gradient-to-br from-pink-500 via-rose-600 to-purple-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="text-4xl mb-1">🎪 🎠</div>
            <span className="text-[11px] font-bold text-pink-200 tracking-wider uppercase">Sunny Carnival</span>
          </div>
        );
      case 'clockwork':
        return (
          <div className="w-full h-full bg-gradient-to-br from-cyan-600 via-slate-700 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="text-4xl mb-1">⚙️ 🤖</div>
            <span className="text-[11px] font-bold text-cyan-200 tracking-wider uppercase">Wonderland</span>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex flex-col items-center justify-center p-4">
            <Film className="w-8 h-8 text-amber-400 mb-2" />
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{category}</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cartoons or stories..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Add Video Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-medium text-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add Custom Video / File</span>
        </button>
      </div>

      {/* Category Pills / Filter bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCartoons.map((video) => {
          const isSelected = video.id === selectedVideoId;
          return (
            <div
              key={video.id}
              onClick={() => onSelectVideo(video)}
              className={`group relative rounded-2xl overflow-hidden bg-slate-900 border transition-all duration-200 cursor-pointer flex flex-col ${
                isSelected
                  ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-lg shadow-amber-400/10'
                  : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                {renderCardArtwork(video.thumbnail, video.category)}

                {/* Duration Badge */}
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[10px] font-mono text-white/90">
                  {video.duration}
                </span>

                {/* Rating badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-semibold text-amber-300 border border-white/10">
                  {video.ageRating}
                </span>

                {/* Play Hover Overlay */}
                <div
                  className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 p-1 rounded-full bg-amber-400 text-slate-950">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Info Container */}
              <div className="p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="font-semibold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {video.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-800/60">
                  <span>{video.category}</span>
                  <span className="text-amber-400/80 font-medium">Safe for Kids</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCartoons.length === 0 && (
        <div className="text-center py-12 rounded-2xl bg-slate-900/50 border border-slate-800/60 p-6">
          <Film className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-300">No videos found</h4>
          <p className="text-xs text-slate-500 mt-1">Try another search keyword or add a custom video.</p>
        </div>
      )}

      {/* Add Custom Video / File Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-display text-white mb-1">
              Add Kid Video to Play Time
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Pick your child's favorite downloaded cartoons from device storage or enter a direct MP4 link.
            </p>

            {/* Option A: Upload from Device */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                1. Select from Phone / Tablet Files
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 px-4 rounded-2xl border-2 border-dashed border-slate-700 hover:border-amber-400 bg-slate-850 hover:bg-slate-800 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                <div className="p-2.5 rounded-full bg-slate-800 group-hover:bg-amber-400/20 text-slate-300 group-hover:text-amber-400 transition-colors">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-200">
                  Browse Device Videos (MP4, WebM)
                </span>
                <span className="text-[10px] text-slate-500">
                  Plays offline directly from storage with full child lock
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider">
                Or direct URL
              </span>
            </div>

            {/* Option B: Enter Web URL */}
            <form onSubmit={handleAddUrlVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Cartoon Title
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Bluey Episode 1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Video Stream URL (MP4 / WebM)
                </label>
                <input
                  type="url"
                  required
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  Save & Play Cartoon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
