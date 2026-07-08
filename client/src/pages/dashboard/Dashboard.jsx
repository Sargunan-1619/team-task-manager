import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FolderKanban, BarChart3, Sparkles, Clock3, ListTodo } from 'lucide-react';
import toast from 'react-hot-toast';
import PageShell from '../../components/ui/PageShell';
import Surface from '../../components/ui/Surface';
import StatCard from '../../components/ui/StatCard';
import { getProjects } from '../../services/projectService';
import { getTasks } from '../../services/taskService';
import { getDashboardSummary } from '../../services/dashbooardService';

function Dashboard() {
  const [summary, setSummary] = useState({
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
    overdueTasks: 0,
  });
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm } = useOutletContext();

  const filteredTasks = tasks.filter((task) => {
    if (!searchTerm) return true;
    return [task.title, task.description, task.project?.name, task.status, task.priority]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm);
  });

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const [summaryResponse, projectsResponse, tasksResponse] = await Promise.all([
          getDashboardSummary(),
          getProjects(),
          getTasks(),
        ]);
        setSummary(summaryResponse.data || {});
        setProjects(projectsResponse.projects || []);
        setTasks(tasksResponse.tasks || []);
      } catch (error) {
        toast.error(error.message || 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  return (
    <PageShell eyebrow="Overview" title="Command center" description="A calm view of your team’s momentum and outstanding work.">
      {loading ? (
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <Surface className="p-6">
            <div className="h-48 animate-pulse rounded-[24px] bg-slate-200/70" />
          </Surface>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-[24px] border border-slate-200/80 bg-slate-100/80" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total projects" value={projects.length} icon={FolderKanban} accent="bg-gradient-to-br from-sky-500 to-cyan-400" hint="Across your active workspace" />
            <StatCard title="Total tasks" value={filteredTasks.length} icon={ListTodo} accent="bg-gradient-to-br from-violet-500 to-fuchsia-400" hint="All tracked work" />
            <StatCard title="Todo" value={summary.todoTasks || 0} icon={Clock3} accent="bg-gradient-to-br from-sky-500 to-cyan-400" hint="Ready to start" />
            <StatCard title="In Progress" value={summary.inProgressTasks || 0} icon={BarChart3} accent="bg-gradient-to-br from-amber-500 to-orange-400" hint="Moving now" />
            <StatCard title="Done" value={summary.doneTasks || summary.completedTasks || 0} icon={CheckCircle2} accent="bg-gradient-to-br from-emerald-500 to-lime-400" hint="Finished with confidence" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <Surface className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Weekly momentum</p>
                  <p className="mt-1 text-sm text-slate-500">A view into your recent cadence</p>
                </div>
                <div className="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white">Live</div>
              </div>
              <div className="mt-6 rounded-[24px] border border-slate-200/80 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Delivery pulse</p>
                  <span className="text-sm text-slate-500">{tasks.length} tracked tasks</span>
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                      <span>Completed</span>
                      <span>{summary.doneTasks || summary.completedTasks || 0}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400" style={{ width: `${filteredTasks.length ? ((summary.doneTasks || summary.completedTasks || 0) / filteredTasks.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                      <span>Pending</span>
                      <span>{(summary.todoTasks || 0) + (summary.inProgressTasks || 0)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-400" style={{ width: `${filteredTasks.length ? (((summary.todoTasks || 0) + (summary.inProgressTasks || 0)) / filteredTasks.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </Surface>

            <div className="space-y-6">
              <Surface className="p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 p-3 text-white">
                    <BarChart3 size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Overdue work</p>
                    <p className="text-sm text-slate-500">Tasks past their due date</p>
                  </div>
                </div>
                <p className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">{summary.overdueTasks || 0}</p>
                <p className="mt-3 text-sm text-slate-500">Tracked directly from the database.</p>
              </Surface>

              <Surface className="p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-400 p-3 text-white">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Live workspace</p>
                    <p className="text-sm text-slate-500">Search and track work instantly</p>
                  </div>
                </div>
                <p className="mt-6 text-sm text-slate-500">The dashboard updates from your latest project and task data.</p>
              </Surface>
            </div>
          </div>
        </>
      )}
    </PageShell>
  );
}

export default Dashboard;
