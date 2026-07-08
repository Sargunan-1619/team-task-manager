import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { CalendarDays, CheckCircle2, Plus, Sparkles, Trash2, PencilLine, X } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageShell from '../../components/ui/PageShell';
import Surface from '../../components/ui/Surface';
import EmptyState from '../../components/ui/EmptyState';
import { createTask, deleteTask, getTasks, updateTask, updateTaskStatus } from '../../services/taskService';
import { getProjects } from '../../services/projectService';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editValues, setEditValues] = useState({ title: '', description: '', project: '', priority: 'Medium', dueDate: '', status: 'Todo' });
  const { userId } = useAuth();
  const { searchTerm } = useOutletContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksResponse, projectsResponse] = await Promise.all([getTasks(), getProjects()]);
      setTasks(tasksResponse.tasks || []);
      setProjects(projectsResponse.projects || []);
    } catch (error) {
      toast.error(error.message || 'Unable to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = async (values) => {
    try {
      setSubmitting(true);
      await createTask(
        {
          ...values,
          assignedTo: userId || undefined,
          dueDate: values.dueDate || undefined,
        },
        userId
      );
      toast.success('Task created');
      reset();
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTasks = useMemo(() => {
    if (!searchTerm) return tasks;
    return tasks.filter((task) => {
      return [task.title, task.description, task.project?.name, task.status, task.priority]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm);
    });
  }, [tasks, searchTerm]);

  const changeStatus = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      toast.success('Task updated');
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to update task');
    }
  };

  const removeTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      toast.success('Task deleted');
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete task');
    }
  };

  const groupedTasks = useMemo(() => {
    return {
      Todo: filteredTasks.filter((task) => task.status === 'Todo'),
      'In Progress': filteredTasks.filter((task) => task.status === 'In Progress'),
      Done: filteredTasks.filter((task) => task.status === 'Done'),
    };
  }, [filteredTasks]);

  const startEdit = (task) => {
    setEditingTaskId(task._id);
    setEditValues({
      title: task.title || '',
      description: task.description || '',
      project: task.project?._id || task.project || '',
      priority: task.priority || 'Medium',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '',
      status: task.status || 'Todo',
    });
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditValues({ title: '', description: '', project: '', priority: 'Medium', dueDate: '', status: 'Todo' });
  };

  const saveEdit = async (taskId) => {
    try {
      await updateTask(taskId, editValues);
      toast.success('Task updated');
      cancelEdit();
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to update task');
    }
  };

  return (
    <PageShell eyebrow="Execution" title="Task board" description="Move work across the pipeline with a clean, focused workflow.">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Surface className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Flow board</h2>
              <p className="mt-1 text-sm text-slate-500">Keep momentum visible from planning to delivery.</p>
            </div>
            <div className="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white">{tasks.length} tasks</div>
          </div>

          {loading ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-40 animate-pulse rounded-[24px] border border-slate-200/80 bg-slate-100/80" />
              ))}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {Object.entries(groupedTasks).map(([status, items]) => (
                <div key={status} className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-700">{status}</h3>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 shadow-sm">{items.length}</span>
                  </div>
                  <div className="space-y-3">
                    {items.length === 0 ? (
                      <EmptyState title="Nothing here" description="This lane is clear. Add the next task to keep the work moving." />
                    ) : (
                      items.map((task) => (
                        <div key={task._id} className="rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-slate-900">{task.title}</p>
                              <p className="mt-1 text-sm leading-6 text-slate-600">{task.description || 'No description'}</p>
                            </div>
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${task.priority === 'High' ? 'bg-rose-50 text-rose-700' : task.priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                              {task.priority}
                            </span>
                          </div>

                          <div className="mt-3 space-y-2 text-sm text-slate-600">
                            <p className="flex items-center gap-2"><Sparkles size={14} /> {task.project?.name || '—'}</p>
                            <p className="flex items-center gap-2"><CalendarDays size={14} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <select value={task.status} onChange={(event) => changeStatus(task._id, event.target.value)} className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-700">
                              <option value="Todo">Todo</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Done">Done</option>
                            </select>
                            <button type="button" onClick={() => startEdit(task)} className="flex items-center gap-2 rounded-xl border border-slate-200 px-2.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                              <PencilLine size={14} /> Edit
                            </button>
                            <button type="button" onClick={() => removeTask(task._id)} className="flex items-center gap-2 rounded-xl border border-rose-200 px-2.5 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50">
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                          {editingTaskId === task._id ? (
                            <div className="mt-4 rounded-[18px] border border-slate-200 bg-slate-50 p-3">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-slate-900">Edit task</p>
                                <button type="button" onClick={cancelEdit} className="rounded-full p-1 text-slate-500 transition hover:bg-white"><X size={14} /></button>
                              </div>
                              <div className="mt-3 space-y-3">
                                <input value={editValues.title} onChange={(event) => setEditValues((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" placeholder="Title" />
                                <textarea value={editValues.description} onChange={(event) => setEditValues((current) => ({ ...current, description: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" rows="2" placeholder="Description" />
                                <select value={editValues.project} onChange={(event) => setEditValues((current) => ({ ...current, project: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
                                  <option value="">Select project</option>
                                  {projects.map((project) => <option key={project._id} value={project._id}>{project.name}</option>)}
                                </select>
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <select value={editValues.status} onChange={(event) => setEditValues((current) => ({ ...current, status: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
                                    <option value="Todo">Todo</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                  </select>
                                  <select value={editValues.priority} onChange={(event) => setEditValues((current) => ({ ...current, priority: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                  </select>
                                </div>
                                <input type="date" value={editValues.dueDate} onChange={(event) => setEditValues((current) => ({ ...current, dueDate: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" />
                                <button type="button" onClick={() => saveEdit(task._id)} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white">Save changes</button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Surface>

        <Surface className="p-6">
          <h2 className="text-lg font-semibold text-slate-900">Create task</h2>
          <p className="mt-1 text-sm text-slate-500">Capture work cleanly and assign it instantly.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="title">Title</label>
              <input id="title" className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-sky-400" {...register('title', { required: 'Title is required' })} />
              {errors.title && <p className="mt-1 text-sm text-rose-600">{errors.title.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="description">Description</label>
              <textarea id="description" rows="3" className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-sky-400" {...register('description')} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="project">Project</label>
              <select id="project" className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-sky-400" {...register('project', { required: 'Project is required' })}>
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>{project.name}</option>
                ))}
              </select>
              {errors.project && <p className="mt-1 text-sm text-rose-600">{errors.project.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="assignedTo">Assigned to</label>
              <input id="assignedTo" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" value={userId || 'Current user'} readOnly placeholder="Auto-assigned" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="priority">Priority</label>
                <select id="priority" className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-sky-400" {...register('priority')}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="dueDate">Due date</label>
                <input id="dueDate" type="date" className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-sky-400" {...register('dueDate')} />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
              <Plus size={16} /> {submitting ? 'Creating...' : 'Create task'}
            </button>
          </form>
        </Surface>
      </div>
    </PageShell>
  );
}

export default Tasks;
