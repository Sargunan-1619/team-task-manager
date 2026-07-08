import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
import { FolderKanban, Plus, Sparkles, Users, Edit3, Trash2, X } from 'lucide-react';
import PageShell from '../../components/ui/PageShell';
import Surface from '../../components/ui/Surface';
import EmptyState from '../../components/ui/EmptyState';
import { createProject, deleteProject, getProjects, updateProject } from '../../services/projectService';
import { getTasks } from '../../services/taskService';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editValues, setEditValues] = useState({ name: '', description: '' });
  const { searchTerm } = useOutletContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const loadProjects = async () => {
    try {
      setLoading(true);
      const [projectsResponse, tasksResponse] = await Promise.all([getProjects(), getTasks()]);
      setProjects(projectsResponse.projects || []);
      setTasks(tasksResponse.tasks || []);
    } catch (error) {
      toast.error(error.message || 'Unable to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const onSubmit = async (values) => {
    try {
      setSubmitting(true);
      await createProject(values);
      toast.success('Project created');
      reset();
      await loadProjects();
    } catch (error) {
      toast.error(error.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;
    return projects.filter((project) => {
      return [project.name, project.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm);
    });
  }, [projects, searchTerm]);

  const taskCountByProject = useMemo(() => {
    const counts = {};
    tasks.forEach((task) => {
      const projectId = task.project?._id || task.project;
      if (projectId) {
        counts[projectId] = (counts[projectId] || 0) + 1;
      }
    });
    return counts;
  }, [tasks]);

  const handleEditStart = (project) => {
    setEditingProjectId(project._id);
    setEditValues({ name: project.name, description: project.description || '' });
  };

  const handleEditCancel = () => {
    setEditingProjectId(null);
    setEditValues({ name: '', description: '' });
  };

  const handleEditSave = async (projectId) => {
    try {
      await updateProject(projectId, editValues);
      toast.success('Project updated');
      handleEditCancel();
      await loadProjects();
    } catch (error) {
      toast.error(error.message || 'Failed to update project');
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await deleteProject(projectId);
      toast.success('Project deleted');
      if (editingProjectId === projectId) {
        handleEditCancel();
      }
      await loadProjects();
    } catch (error) {
      toast.error(error.message || 'Failed to delete project');
    }
  };

  return (
    <PageShell eyebrow="Planning" title="Projects" description="Shape initiatives with a calm, structured view of your team’s work.">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Surface className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Your projects</h2>
              <p className="mt-1 text-sm text-slate-500">A refined overview of every active initiative.</p>
            </div>
            <div className="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white">{filteredProjects.length} active</div>
          </div>

          {loading ? (
            <div className="mt-6 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-[24px] border border-slate-200/80 bg-slate-100/90" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="mt-6">
              <EmptyState title="No projects yet" description="Start your first initiative and bring structure to your planning flow." action={<button type="button" onClick={() => document.getElementById('create-project-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Create project</button>} />
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {filteredProjects.map((project) => (
                <div key={project._id} className="rounded-[24px] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 p-3 text-white">
                        <FolderKanban size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{project.name}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{project.description || 'No description provided.'}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${taskCountByProject[project._id] ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {taskCountByProject[project._id] ? (taskCountByProject[project._id] > 0 ? 'In progress' : 'Planned') : 'Planned'}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-2"><Users size={15} /> {project.members?.length || 0} members</span>
                    <span className="flex items-center gap-2"><Sparkles size={15} /> {taskCountByProject[project._id] || 0} tasks</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={() => handleEditStart(project)} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                      <Edit3 size={14} /> Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(project._id)} className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-100">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                  {editingProjectId === project._id ? (
                    <div className="mt-4 rounded-[20px] border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900">Edit project</p>
                        <button type="button" onClick={handleEditCancel} className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100">
                          <X size={16} />
                        </button>
                      </div>
                      <div className="mt-3 space-y-3">
                        <input value={editValues.name} onChange={(event) => setEditValues((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none" placeholder="Project name" />
                        <textarea value={editValues.description} onChange={(event) => setEditValues((current) => ({ ...current, description: event.target.value }))} className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none" rows="3" placeholder="Description" />
                        <button type="button" onClick={() => handleEditSave(project._id)} className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white">Save changes</button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </Surface>

        <Surface className="p-6">
          <h2 className="text-lg font-semibold text-slate-900">Create project</h2>
          <p className="mt-1 text-sm text-slate-500">A focused form for launching a new initiative.</p>
          <form id="create-project-form" className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="name">Project name</label>
              <input id="name" className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-sky-400" {...register('name', { required: 'Name is required' })} />
              {errors.name && <p className="mt-1 text-sm text-rose-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="description">Description</label>
              <textarea id="description" rows="4" className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-sky-400" {...register('description')} />
            </div>

            <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
              <Plus size={16} /> {submitting ? 'Creating...' : 'Create project'}
            </button>
          </form>
        </Surface>
      </div>
    </PageShell>
  );
}

export default Projects;
