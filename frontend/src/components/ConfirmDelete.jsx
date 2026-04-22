import React from 'react'
import { AlertCircle, X } from 'lucide-react'

export default function ConfirmDelete({ 
  title = 'Confirm', 
  description = '', 
  onConfirm, 
  onCancel, 
  loading = false,
  confirmText = 'Delete',
  confirmClass = 'btn-danger' 
}) {
  return (
    <div className="fixed inset-0 bg-sky-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up border border-sky-100">
        <div className="px-6 py-4 border-b border-sky-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <AlertCircle className={`w-5 h-5 ${confirmClass === 'btn-danger' ? 'text-rose-500' : 'text-sky-500'}`} />
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          </div>
          <button onClick={onCancel} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {description}
          </p>
        </div>

        <div className="px-6 py-4 bg-slate-50/50 border-t border-sky-50 flex justify-end gap-3">
          <button 
            className="btn btn-outline border-slate-200 text-slate-600 hover:bg-slate-100" 
            onClick={onCancel} 
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className={`btn ${confirmClass} px-6 py-2 rounded-xl font-bold shadow-lg transition-all active:scale-95`} 
            onClick={onConfirm} 
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
