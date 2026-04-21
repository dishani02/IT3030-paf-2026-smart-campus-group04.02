import React, { useState } from 'react';
import { bookingService } from '../services/bookingService';
import { Scan, AlertCircle, CheckCircle2, QrCode, ClipboardCheck, ArrowRight, User, Calendar, Clock, MapPin, Building } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const QRCheckin = () => {
    const [qrPayload, setQrPayload] = useState('');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleVerify = async (e) => {
        if (e) e.preventDefault();
        setError(null);
        setBookingDetails(null);

        if (!qrPayload.trim()) {
            setError('Please paste a valid QR code payload.');
            return;
        }

        try {
            setLoading(true);
            let payload;
            try {
                payload = JSON.parse(qrPayload);
            } catch (pErr) {
                console.error('JSON Parse Error:', pErr);
                setError('The text you pasted is not valid JSON. Please ensure you copied the entire payload string.');
                setLoading(false);
                return;
            }

            const details = await bookingService.verifyQRCode(payload);
            setBookingDetails(details);
        } catch (err) {
            console.error('Check-in error details:', err.response?.data);
            const msg = err.response?.data?.message || err.message || 'Verification failed. Check console for details.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ── Editorial Header ──────────────────────────────────── */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100/50">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white text-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-600/5 border border-blue-50">
                        <Scan className="w-7 h-7" />
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">Identity Verification</h1>
                        <p className="text-sm text-slate-500 font-medium">Verify user booking identities with secure QR code scanning.</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="card shadow-md border-0 bg-white/80 backdrop-blur-sm self-stretch">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <QrCode className="w-5 h-5 text-indigo-500" />
                            <h2 className="font-bold text-slate-800">Scan Input</h2>
                        </div>
                    </div>
                    <form onSubmit={handleVerify} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600 px-1">Past QR Payload JSON</label>
                            <textarea
                                className="w-full h-40 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono text-sm resize-none"
                                placeholder="Paste the JSON payload from the QR code here..."
                                value={qrPayload}
                                onChange={(e) => setQrPayload(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !qrPayload.trim()}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <ArrowRight className="w-5 h-5 animate-spin" /> Verifying...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <ClipboardCheck className="w-5 h-5" /> Verify & Check-in
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                <div className="space-y-6">
                    {error && (
                        <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl animate-in zoom-in-95 duration-200">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-rose-100 rounded-2xl text-rose-600">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-rose-800 mb-1">Verification Failed</h3>
                                    <p className="text-rose-600/80 text-sm">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!bookingDetails && !error && !loading && (
                        <div className="p-12 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4 bg-slate-50/50">
                            <div className="p-4 bg-white rounded-3xl shadow-sm text-slate-300">
                                <Scan className="w-12 h-12" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-400">Waiting for Input</h3>
                                <p className="text-slate-400/80 text-sm max-w-xs mx-auto">Paste the QR code payload to verify the booking details.</p>
                            </div>
                        </div>
                    )}

                    {bookingDetails && (
                        <div className="card shadow-xl border-0 bg-white overflow-hidden animate-in zoom-in-95 slide-in-from-right-4 duration-300">
                            <div className="p-6 bg-emerald-500 flex items-center gap-4 text-white">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black">Verified Successfully</h3>
                                    <p className="text-emerald-50/80 font-medium text-sm">Valid booking identity confirmed</p>
                                </div>
                            </div>
                            
                            <div className="p-8 space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Booked By</p>
                                            <h4 className="font-bold text-slate-800 text-lg">{bookingDetails.userName}</h4>
                                        </div>
                                    </div>
                                    <StatusBadge status={bookingDetails.status} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                                            <Building className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Resource</span>
                                        </div>
                                        <p className="font-bold text-slate-700">{bookingDetails.resourceName}</p>
                                        <p className="text-sm text-slate-500 flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" /> {bookingDetails.resourceLocation || 'Main Campus'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Scheduled For</span>
                                        </div>
                                        <p className="font-bold text-slate-700">{bookingDetails.date}</p>
                                        <p className="text-sm text-slate-500 flex items-center gap-1 font-mono">
                                            <Clock className="w-3.5 h-3.5" /> {bookingDetails.startTime} - {bookingDetails.endTime}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Purpose</p>
                                    <p className="text-slate-600 italic">"{bookingDetails.purpose || 'No purpose specified'}"</p>
                                </div>

                                <div className="flex justify-center pt-4">
                                    <button 
                                        onClick={() => {
                                            setBookingDetails(null);
                                            setQrPayload('');
                                        }}
                                        className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all active:scale-95"
                                    >
                                        Scan Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QRCheckin;
