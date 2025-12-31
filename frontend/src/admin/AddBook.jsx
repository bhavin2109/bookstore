import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBook, createManyBooks } from "../services/bookServices";
import { toast } from "react-toastify";
import AdminHeader from "./AdminHeader";

const AddBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    genre: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [bulkData, setBulkData] = useState([]);
  const [isBulkImport, setIsBulkImport] = useState(false);
  const [importFileName, setImportFileName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    let isAdmin = false;

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (
          user.role === "admin" ||
          user.isAdmin === true ||
          user.isAdmin === "true"
        ) {
          isAdmin = true;
        }
      } catch (e) {
        console.error("Auth check failed", e);
      }
    }

    if (!isAdmin) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authorized. Please login.");

      if (isBulkImport) {
        // Bulk Import
        const response = await createManyBooks(bulkData, token);
        toast.success(response.message);
      } else {
        // Single Creation
        const payload = {
          title: formData.title,
          author: formData.author,
          description: formData.description,
          price: formData.price,
          genre: formData.genre,
          image: formData.image,
        };
        await createBook(payload, token);
        toast.success("Book created successfully!");
      }

      navigate("/admin/books-management");
    } catch (err) {
      toast.error(err.message || "Failed to create book(s)");
    } finally {
      setLoading(false);
    }
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);

        if (Array.isArray(json)) {
          // Validate array content briefly (optional, or rely on backend)
          const valid = json.every((item) => item.title && item.author);
          if (!valid) {
            toast.warn(
              "Some items in the list might be missing title or author."
            );
          }
          setBulkData(json);
          setIsBulkImport(true);
          toast.info(`Loaded ${json.length} books from ${file.name}`);
        } else {
          // Single Object Import
          const { title, author, description, price, genre, image } = json;
          setFormData((prev) => ({
            ...prev,
            title: title || prev.title,
            author: author || prev.author,
            description: description || prev.description,
            price: price || prev.price,
            genre: genre || prev.genre,
            image: image || prev.image,
          }));
          setIsBulkImport(false);
          setBulkData([]);
          toast.success("Single book data loaded from JSON");
        }
      } catch (err) {
        console.error(err);
        toast.error("Invalid JSON file");
      }
    };
    reader.readAsText(file, "UTF-8");
  };

  const cancelBulkImport = () => {
    setIsBulkImport(false);
    setBulkData([]);
    setImportFileName("");
    toast.info("Cancelled bulk import mode");
  };

  return (
    <AdminHeader title="Add New Book">
      <div className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-lg border border-slate-700 shadow-xl">
        <h2 className="text-2xl font-bold text-emerald-400 mb-6">
          {isBulkImport ? "Bulk Import Books" : "Add New Book"}
        </h2>

        <div className="mb-6 p-4 border border-slate-600 border-dashed rounded-lg bg-slate-700/30">
          <label className="block text-slate-300 text-sm mb-2 font-medium">
            Import from JSON (Single or Array)
          </label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileImport}
            className="block w-full text-sm text-slate-400
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-emerald-500 file:text-white
              hover:file:bg-emerald-600
              cursor-pointer"
          />
        </div>

        {isBulkImport ? (
          <div className="mb-6 bg-slate-700/50 p-4 rounded border border-slate-600">
            <p className="text-emerald-400 font-semibold text-lg mb-2">
              Ready to Import
            </p>
            <p className="text-slate-300">
              File: <span className="text-white">{importFileName}</span>
            </p>
            <p className="text-slate-300">
              Total Books: <span className="text-white">{bulkData.length}</span>
            </p>

            <div className="mt-4 flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-bold transition-colors disabled:opacity-50"
              >
                {loading ? "Importing..." : `Import ${bulkData.length} Books`}
              </button>
              <button
                type="button"
                onClick={cancelBulkImport}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-1">
                Book Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1">
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">
                  Genre
                </label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1">
                Image URL
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-bold transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Book"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/books-management")}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminHeader>
  );
};

export default AddBook;
