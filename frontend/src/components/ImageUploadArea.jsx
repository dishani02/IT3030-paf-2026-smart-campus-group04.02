import { useState, useCallback } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';

export default function ImageUploadArea({ images = [], onUpload, onDelete, maxImages = 5, loading = false }) {
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState('');

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const validateAndUpload = (files) => {
        setError('');
        if (images.length + files.length > maxImages) {
            setError(`You can only upload a maximum of ${maxImages} images.`);
            return;
        }

        const validFiles = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith('image/')) {
                setError('Only image files (JPG, PNG, WEBP) are allowed.');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setError('Each image must be under 2MB.');
                return;
            }
            validFiles.push(file);
        }

        if (validFiles.length > 0 && onUpload) {
            onUpload(validFiles);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndUpload(e.dataTransfer.files);
        }
    }, [images, maxImages, onUpload]);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndUpload(e.target.files);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Resource Images ({images.length}/{maxImages})</label>
                {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
            </div>

            {/* Upload Area */}
            {images.length < maxImages && (
                <div 
                    className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden group
                        ${dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        onChange={handleChange} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={loading}
                    />
                    
                    <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-blue-500 transition-colors">
                        {loading ? (
                            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                        ) : (
                            <UploadCloud className="w-10 h-10" />
                        )}
                        <div className="text-center">
                            <p className="text-sm font-bold text-slate-700">Drag & drop images here</p>
                            <p className="text-xs font-medium mt-1">or click to browse from device</p>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Max 2MB per image</p>
                    </div>
                </div>
            )}

            {/* Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                    {images.map((url, index) => (
                        <div key={url} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-100 shadow-sm bg-slate-50">
                            <img src={`http://localhost:8080${url}`} alt={`Preview ${index}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            
                            {/* Main Badge */}
                            {index === 0 && (
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider rounded shadow-sm">
                                    Main
                                </div>
                            )}

                            {/* Delete Button */}
                            <button 
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onDelete(url);
                                }}
                                disabled={loading}
                                className="absolute top-2 right-2 p-1.5 bg-rose-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600 hover:scale-110 shadow-sm disabled:opacity-0"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
