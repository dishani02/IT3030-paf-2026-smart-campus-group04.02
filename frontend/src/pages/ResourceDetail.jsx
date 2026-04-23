import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resourceService } from "../services/resourceService";
import { useAuth } from "../context/AuthContext";
import ConfirmDelete from "../components/ConfirmDelete";
import ResourceForm from "../components/ResourceForm";
import GalleryModal from "../components/GalleryModal";
import {
  Building2,
  MapPin,
  Users,
  Clock,
  Wifi,
  ArrowLeft,
  Calendar,
  Wrench,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info,
  FlaskConical,
  Zap,
} from "lucide-react";

// Consistent type-based styling
const TYPE_CONFIG = {
  ROOM: {
    icon: Building2,
    label: "Room",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
    bannerBg: "bg-gradient-to-br from-emerald-400/20 to-emerald-300/20",
  },
  LAB: {
    icon: FlaskConical,
    label: "Lab",
    bg: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-100",
    bannerBg: "bg-gradient-to-br from-violet-400/20 to-violet-300/20",
  },
  EQUIPMENT: {
    icon: Wrench,
    label: "Equipment",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
    bannerBg: "bg-gradient-to-br from-amber-400/20 to-amber-300/20",
  },
  DEFAULT: {
    icon: Building2,
    label: "Resource",
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-100",
    bannerBg: "bg-gradient-to-br from-slate-200/20 to-slate-100/20",
  },
};

export default function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    loadResource();
  }, [id]);

  const loadResource = async () => {
    setLoading(true);
    try {
      const data = await resourceService.getById(id);
      setResource(data);
    } catch (err) {
      console.error("Failed to load resource:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await resourceService.delete(id);
      navigate("/resources");
    } catch (err) {
      console.error("Delete failed:", err);
      if (err.response?.status === 409) {
        alert(
          "Conflict: This asset cannot be removed while active bookings exist.",
        );
      }
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );

  if (!resource)
    return (
      <div className="max-w-7xl mx-auto p-12 text-center">
        <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Asset Not Found
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          The campus resource you are looking for does not exist or has been
          retired.
        </p>
        <button
          onClick={() => navigate("/resources")}
          className="btn btn-primary"
        >
          Return to Catalog
        </button>
      </div>
    );

  const typeStyle =
    TYPE_CONFIG[resource.type?.toUpperCase()] || TYPE_CONFIG.DEFAULT;
  const Icon = typeStyle.icon;
  const isActive = resource.status === "ACTIVE";

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in bg-[#fdfdfd]">
      {/* ── Navigation ────────────────────────────── */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/resources")}
          className="flex items-center gap-2 text-[12px] font-medium text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to resources
        </button>
      </div>

      {/* ── Main Detail Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Resource Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Abstract Banner or Image Banner */}
          {resource.images && resource.images.length > 0 ? (
            <div
              className="relative w-full h-64 rounded-3xl overflow-hidden shadow-sm cursor-pointer group/banner"
              onClick={() => {
                setGalleryImages(resource.images);
                setShowGallery(true);
              }}
            >
              <img
                src={`http://localhost:8080${resource.images[0]}`}
                alt={resource.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/banner:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-6 left-8 flex items-end gap-6 z-10">
                <div
                  className={`p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg`}
                >
                  <Icon className={`w-8 h-8 stroke-[1.5px] text-white`} />
                </div>
                <div className="text-left mb-1">
                  <p className="text-white font-black text-2xl tracking-tight leading-none drop-shadow-md">
                    {resource.name}
                  </p>
                  <p className="text-white/80 text-[11px] font-bold uppercase tracking-widest mt-2">
                    {typeStyle.label} Unit #{resource.id}
                  </p>
                </div>
              </div>

              {resource.images.length > 1 && (
                <div className="absolute top-6 right-6 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl text-white text-[11px] font-bold shadow-lg flex items-center gap-2 border border-white/10 z-10">
                  📷 {resource.images.length} Photos
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/banner:opacity-100 bg-black/20 transition-opacity z-20">
                <span className="text-white text-[12px] font-bold tracking-wider uppercase backdrop-blur-md px-5 py-2.5 rounded-xl bg-black/40 border border-white/10 shadow-xl">
                  View Gallery
                </span>
              </div>
            </div>
          ) : (
            <div
              className={`relative p-8 rounded-3xl overflow-hidden border-2 border-white shadow-sm flex items-center gap-6 ${typeStyle.bannerBg}`}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/30 rounded-full -mr-24 -mt-24 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/20 rounded-full -ml-20 -mb-20 blur-2xl" />

              <div
                className={`p-4 bg-white rounded-2xl shadow-lg border ${typeStyle.border} relative z-10`}
              >
                <Icon
                  className={`w-10 h-10 stroke-[1.5px] ${typeStyle.text}`}
                />
              </div>
              <div className="relative z-10 text-left">
                <p className="text-slate-800 font-black text-2xl tracking-tight leading-none">
                  {resource.name}
                </p>
                <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-2">
                  {typeStyle.label} Unit #{resource.id}
                </p>
              </div>
            </div>
          )}

          {/* Specifications Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                Specifications
              </h3>
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                    isActive
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-rose-50 text-rose-600 border-rose-100"
                  }`}
                >
                  {resource.status?.replace("_", " ")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 border-y border-slate-50">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  Max Occupancy
                </p>
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                  <Users className="w-4 h-4 text-blue-500" />{" "}
                  {resource.capacity || "Flexible"} Seats
                </div>
              </div>
              <div className="space-y-1 text-left">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  Availability
                </p>
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                  <Clock className="w-4 h-4 text-blue-500" />{" "}
                  {resource.availabilityStart} – {resource.availabilityEnd}
                </div>
              </div>
              <div className="space-y-1 text-right md:text-left">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  Connectivity
                </p>
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                  <Wifi className="w-4 h-4 text-blue-500" /> High-Speed
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest leading-none">
                Description
              </p>
              <p className="text-[14px] text-slate-500 leading-relaxed font-medium">
                {resource.description ||
                  "No formal description provided for this campus asset."}
              </p>
            </div>

            {isAdmin && (
              <div className="flex items-center justify-end gap-2 mt-8 pt-6 border-t border-slate-50">
                <button
                  onClick={() => setShowEditForm(true)}
                  className="px-6 flex items-center justify-center gap-1.5 bg-blue-600 text-white py-2 rounded-lg text-[11px] font-semibold hover:bg-blue-700 active:scale-[0.97] transition-all"
                  title="Edit Asset"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit Asset
                </button>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="px-6 flex items-center justify-center gap-1.5 bg-rose-500 text-white py-2 rounded-lg text-[11px] font-semibold hover:bg-rose-600 active:scale-[0.97] transition-all"
                  title="Delete Asset"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Asset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions & Secondary Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Report Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto">
              <Wrench className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-[14px]">
                Report Malfunction
              </h4>
              <p className="text-[12px] text-slate-400 mt-1">
                If this resource is damaged or requires maintenance, please
                alert facilities.
              </p>
            </div>
            <button
              onClick={() =>
                navigate("/tickets", { state: { resourceId: resource.id } })
              }
              className="w-full py-3.5 bg-slate-50 text-slate-600 rounded-xl text-[12px] font-bold hover:bg-slate-100 transition-all border border-slate-100"
            >
              Open Support Ticket
            </button>
          </div>

          {/* Policy Card */}
          <div className="bg-blue-50/50 rounded-3xl p-7 border border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Info className="w-4 h-4 text-blue-500" />
              </div>
              <h5 className="font-bold text-slate-800 text-[14px]">
                Guidelines
              </h5>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              Reservations must be made at least 24 hours in advance. For
              recurring events, please contact the Department Head.
            </p>
          </div>

          {/* Utilization Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-6">
              Load Factor
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-bold text-slate-500">Utilization</span>
                <span className="text-blue-500 font-bold">42%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[42%] rounded-full shadow-sm shadow-blue-500/20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Form Modal ──────────────────────────────── */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
                <Edit className="w-4 h-4 text-blue-500" /> Edit Resource Details
              </h2>
              <button
                onClick={() => setShowEditForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="p-8">
              <ResourceForm
                resource={resource}
                onSaved={() => {
                  setShowEditForm(false);
                  loadResource();
                }}
                onCancel={() => setShowEditForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmDelete
          title={`Delete Resource?`}
          description="This will permanently remove the asset. This action is irreversible."
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}

      <GalleryModal
        isOpen={showGallery}
        images={galleryImages}
        onClose={() => setShowGallery(false)}
      />
    </div>
  );
}
