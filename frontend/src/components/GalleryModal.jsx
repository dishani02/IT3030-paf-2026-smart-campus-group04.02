import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';

export default function GalleryModal({ images = [], initialIndex = 0, isOpen, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            setZoom(1);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen, initialIndex]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex, images.length]);

    if (!isOpen || images.length === 0) return null;

    const navigate = (direction) => {
        setZoom(1);
        setCurrentIndex((prev) => {
            const next = prev + direction;
            if (next < 0) return images.length - 1;
            if (next >= images.length) return 0;
            return next;
        });
    };

    const handleZoom = (delta) => {
        setZoom(prev => Math.max(1, Math.min(3, prev + delta)));
    };

    const handleDownload = () => {
        const url = `http://localhost:8080${images[currentIndex]}`;
        const link = document.createElement('a');
        link.href = url;
        link.download = url.split('/').pop() || 'image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-md animate-fade-in">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 text-white/80">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold tracking-widest uppercase">{currentIndex + 1} / {images.length}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleDownload} className="p-2 hover:bg-white/10 rounded-full transition-colors tooltip-trigger" title="Download">
                        <Download className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleZoom(0.25)} disabled={zoom >= 3} className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30">
                        <ZoomIn className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleZoom(-0.25)} disabled={zoom <= 1} className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30">
                        <ZoomOut className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-white/20 mx-2" />
                    <button onClick={onClose} className="p-2 hover:bg-rose-500/20 hover:text-rose-400 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Main Image Area */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden" onClick={onClose}>
                {images.length > 1 && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                        className="absolute left-4 p-3 bg-black/50 text-white rounded-full hover:bg-white/20 hover:scale-110 transition-all z-10"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                )}

                <div 
                    className="w-full h-full flex items-center justify-center p-4 cursor-zoom-in"
                    onClick={(e) => { e.stopPropagation(); handleZoom(zoom === 1 ? 1 : -zoom + 1); }}
                >
                    <img 
                        src={`http://localhost:8080${images[currentIndex]}`} 
                        alt={`Gallery ${currentIndex}`}
                        className="max-w-full max-h-full object-contain transition-transform duration-300"
                        style={{ transform: `scale(${zoom})` }}
                    />
                </div>

                {images.length > 1 && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); navigate(1); }}
                        className="absolute right-4 p-3 bg-black/50 text-white rounded-full hover:bg-white/20 hover:scale-110 transition-all z-10"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <div className="h-24 bg-black/50 flex items-center justify-center gap-2 px-4 overflow-x-auto no-scrollbar py-3 shrink-0">
                    {images.map((url, idx) => (
                        <button
                            key={url}
                            onClick={() => { setZoom(1); setCurrentIndex(idx); }}
                            className={`relative h-full aspect-video rounded-lg overflow-hidden border-2 transition-all shrink-0
                                ${idx === currentIndex ? 'border-white scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
                        >
                            <img src={`http://localhost:8080${url}`} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
