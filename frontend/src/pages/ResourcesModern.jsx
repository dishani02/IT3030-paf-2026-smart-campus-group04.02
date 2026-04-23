import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resourceService } from "../services/resourceService";
import {
  MapPin,
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Building2,
  FlaskConical,
  Wrench,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ResourceForm from "../components/ResourceForm";
import ConfirmDelete from "../components/ConfirmDelete";
import GalleryModal from "../components/GalleryModal";

const TYPE_CONFIG = {
  ROOM: {
    icon: Building2,
    label: "Room",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
  },
  LAB: {
    icon: FlaskConical,
    label: "Lab",
    bg: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-100",
  },
  EQUIPMENT: {
    icon: Wrench,
    label: "Equipment",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
  },
};

// Placeholder images for resource types
const TYPE_IMAGES = {
  ROOM: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop&q=80",
  LAB: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=400&fit=crop&q=80",
  EQUIPMENT:
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop&q=80",
};

export default function ResourcesModern() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async (params = {}) => {
    setLoading(true);
    try {
      const data = await resourceService.getAll(params);
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load resources:", err);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = (resources || [])
    .filter((r) => {
      if (!r) return false;
      const s = search.toLowerCase();
      const matchSearch =
        !search ||
        (r.name || "").toLowerCase().includes(s) ||
        (r.location || "").toLowerCase().includes(s);
      const matchType = !typeFilter || r.type === typeFilter;
      const matchStatus = !statusFilter || r.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "type") return (a.type || "").localeCompare(b.type || "");
      if (sortBy === "status")
        return (a.status || "").localeCompare(b.status || "");
      return 0;
    });

  const handleBook = (resource) =>
    navigate("/bookings", { state: { resourceId: resource.id } });
  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };
  const openEdit = (r) => {
    setEditing(r);
    setShowForm(true);
  };
  const handleSaved = () => {
    setShowForm(false);
    loadResources();
  };

  const toggleStatus = async (resource) => {
    const newStatus =
      resource.status === "ACTIVE" ? "OUT_OF_SERVICE" : "ACTIVE";
    await resourceService.update(resource.id, {
      ...resource,
      status: newStatus,
    });
    loadResources();
  };

  const confirmDelete = (r) => {
    setDeletingId(r.id);
    setShowConfirm(true);
  };
  const handleDelete = async () => {
    await resourceService.delete(deletingId);
    setShowConfirm(false);
    setDeletingId(null);
    loadResources();
  };

  const getType = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.ROOM;

  const isAdmin = user?.role === "ADMIN";
  const activeCount = resources.filter((r) => r.status === "ACTIVE").length;
  const typeFilters = [
    { key: "", label: "All Resources" },
    ...Object.entries(TYPE_CONFIG).map(([k, v]) => ({
      key: k,
      label: v.label,
    })),
  ];

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-7 h-7 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-8">
      {/* ── Editorial Header ──────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100/50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white text-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-600/5 border border-blue-50">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Facilities & Assets
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Discover and reserve academic spaces for research and
              collaboration.
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={openCreate}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Resource
          </button>
        )}
      </header>

      {/* ── Search & Filter Bar ──────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, location, or facility type"
            className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-100 focus:ring-2 focus:ring-blue-100 focus:border-blue-200 text-[13px] text-slate-900 placeholder-slate-400 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {typeFilters.map((tf) => (
            <button
              key={tf.key}
              onClick={() => setTypeFilter(tf.key)}
              className={`px-4 py-3 rounded-xl text-[13px] font-medium whitespace-nowrap transition-colors ${
                typeFilter === tf.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sort & Results Meta ──────────────────────────────── */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <span className="text-[13px] text-slate-500 font-medium">
          {activeCount} Available Assets
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-none text-blue-600 text-[13px] font-semibold focus:ring-0 cursor-pointer p-0"
          >
            <option value="name">Name</option>
            <option value="type">Type</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* ── Resources Grid ───────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <Search className="w-10 h-10 text-slate-200 mx-auto mb-4" />
          <h3 className="text-[15px] font-semibold text-slate-800 mb-1">
            No resources found
          </h3>
          <p className="text-[13px] text-slate-400">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl">
          {filtered.map((resource) => {
            const config = getType(resource.type);
            const TypeIcon = config.icon;
            const isActive = resource.status === "ACTIVE";
            return (
              <div
                key={resource.id}
                className={`group bg-white rounded-xl overflow-hidden border border-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-900/5 hover:border-blue-100 ${!isActive ? "opacity-70" : ""}`}
              >
                {/* Resource Main Image */}
                {resource.images && resource.images.length > 0 && (
                  <div
                    className="w-full h-40 bg-slate-100 relative cursor-pointer overflow-hidden group/img"
                    onClick={() => {
                      setGalleryImages(resource.images);
                      setShowGallery(true);
                    }}
                  >
                    <img
                      src={`http://localhost:8080${resource.images[0]}`}
                      alt={resource.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                    {resource.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[10px] font-bold shadow flex items-center gap-1">
                        📷 {resource.images.length}
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 bg-black/20 transition-opacity">
                      <span className="text-white text-[11px] font-bold tracking-wider uppercase backdrop-blur-md px-4 py-2 rounded-xl bg-black/40">
                        View Gallery
                      </span>
                    </div>
                  </div>
                )}

                {/* Light Color Header */}
                <div
                  className={`${config.bg} px-4 py-3 flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 bg-white rounded-lg flex items-center justify-center ${config.border}`}
                    >
                      <TypeIcon className={`w-3.5 h-3.5 ${config.text}`} />
                    </div>
                    <span
                      className={`${config.text} text-[10px] font-bold uppercase tracking-widest`}
                    >
                      {config.label}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                      isActive
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                  >
                    {isActive ? "Active" : "Unavailable"}
                  </span>
                </div>

                {/* Content */}
                <div className="px-4 py-3">
                  <h3 className="text-[13px] font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1 truncate">
                    {resource.name}
                  </h3>

                  {resource.description && (
                    <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                      {resource.description}
                    </p>
                  )}

                  <div className="space-y-1 mb-3">
                    {resource.capacity && (
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span className="text-[11px] font-medium">
                          {resource.capacity} Seats
                        </span>
                      </div>
                    )}
                    {resource.location && (
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="text-[11px] font-medium">
                          {resource.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {isActive && (
                      <button
                        onClick={() => handleBook(resource)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white py-2 rounded-lg text-[11px] font-semibold hover:bg-blue-700 active:scale-[0.97] transition-all"
                      >
                        <Calendar className="w-3 h-3" /> Book
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/resources/${resource.id}`)}
                      className="flex-1 py-2 rounded-lg bg-slate-50 text-slate-500 font-semibold text-[11px] hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Resource Form Modal ──────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-100">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-slate-900">
                {editing ? "Edit Resource" : "Create New Resource"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <ResourceForm
                resource={editing}
                onSaved={handleSaved}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ──────────────────────────────── */}
      {showConfirm && (
        <ConfirmDelete
          title="Delete resource?"
          message="This action cannot be undone. The resource will be permanently removed."
          onConfirm={handleDelete}
          onCancel={() => {
            setShowConfirm(false);
            setDeletingId(null);
          }}
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
