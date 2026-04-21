import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { QrCode, Loader2, AlertCircle, X } from 'lucide-react';

const QRCodeDisplay = ({ bookingId, onClose }) => {
    const [qrCode, setQrCode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQRCode = async () => {
            try {
                setLoading(true);
                const response = await bookingService.getQRCode(bookingId);
                setQrCode(response.qrCode);
                setError(null);
            } catch (err) {
                console.error('Error fetching QR code:', err);
                setError(err.response?.data?.message || 'Failed to load QR code');
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchQRCode();
        }
    }, [bookingId]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <QrCode className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800">Booking Check-in QR</h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 flex flex-col items-center justify-center min-h-[350px]">
                    {loading ? (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                            <p className="text-slate-500 font-medium">Generating your secure QR code...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="p-4 bg-rose-50 rounded-full text-rose-500">
                                <AlertCircle className="w-12 h-12" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 mb-1">Could Not Generate QR</h4>
                                <p className="text-slate-500 text-sm">{error}</p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="mt-4 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-6">
                            <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
                                <img 
                                    src={`data:image/png;base64,${qrCode}`} 
                                    alt="Booking QR Code" 
                                    className="w-64 h-64 object-contain"
                                />
                            </div>
                            <div className="text-center">
                                <p className="text-slate-600 font-medium px-4">
                                    Present this QR code to the administrator for check-in.
                                </p>
                                <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-bold">
                                    Secure Signed Payload
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400">
                        This QR code contains booking details and a secure signature to prevent tampering.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRCodeDisplay;
