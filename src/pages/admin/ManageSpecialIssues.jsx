import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, Users, FileText } from 'lucide-react';
import { 
  getAllSpecialIssues, 
  createSpecialIssue, 
  updateSpecialIssue, 
  deleteSpecialIssue 
} from '../../services/specialIssuesService';

export default function ManageSpecialIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    guestEditors: '',
    status: 'active',
  });

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      const data = await getAllSpecialIssues();
      setIssues(data);
    } catch (error) {
      console.error('Error loading special issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingIssue) {
        await updateSpecialIssue(editingIssue.id, {
          ...formData,
          deadline: new Date(formData.deadline),
        });
      } else {
        await createSpecialIssue({
          ...formData,
          deadline: new Date(formData.deadline),
        });
      }
      
      await loadIssues();
      resetForm();
    } catch (error) {
      console.error('Error saving special issue:', error);
      alert('Failed to save special issue');
    }
  };

  const handleEdit = (issue) => {
    setEditingIssue(issue);
    setFormData({
      title: issue.title,
      description: issue.description,
      deadline: issue.deadline ? issue.deadline.toISOString().split('T')[0] : '',
      guestEditors: issue.guestEditors || '',
      status: issue.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this special issue?')) return;
    
    try {
      await deleteSpecialIssue(id);
      await loadIssues();
    } catch (error) {
      console.error('Error deleting special issue:', error);
      alert('Failed to delete special issue');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      deadline: '',
      guestEditors: '',
      status: 'active',
    });
    setEditingIssue(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Special Issues</h1>
          <p className="text-gray-600 mt-1">Create and manage special issues for manuscript submissions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          New Special Issue
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingIssue ? 'Edit Special Issue' : 'Create Special Issue'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Special Issue on AI in Healthcare"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the scope and focus of this special issue..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Submission Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest Editors
                </label>
                <input
                  type="text"
                  value={formData.guestEditors}
                  onChange={(e) => setFormData({ ...formData, guestEditors: e.target.value })}
                  placeholder="e.g., Dr. John Doe, Prof. Jane Smith"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  {editingIssue ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issues List */}
      <div className="space-y-4">
        {issues.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No special issues yet</p>
            <p className="text-sm text-gray-500 mt-1">Create your first special issue to get started</p>
          </div>
        ) : (
          issues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{issue.title}</h3>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        issue.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {issue.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{issue.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Deadline: {issue.deadline ? issue.deadline.toLocaleDateString() : 'Not set'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{issue.submissionCount || 0} submissions</span>
                    </div>
                    
                    {issue.guestEditors && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Editors:</span>
                        <span>{issue.guestEditors}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(issue)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(issue.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}