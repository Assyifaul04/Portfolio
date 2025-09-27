// app/dashboard/page.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Activity,
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  Star,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Selamat datang kembali, Syn_Taxx! 👋
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300"
        >
          <Clock className="mr-1 h-3 w-3" />
          Last updated: 5 min ago
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              $45,231.89
            </div>
            <div className="flex items-center text-xs text-slate-500">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +20.1% dari bulan lalu
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Projects
            </CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              12
            </div>
            <div className="flex items-center text-xs text-slate-500">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +3 project baru
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Sales
            </CardTitle>
            <CreditCard className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              +12,234
            </div>
            <div className="flex items-center text-xs text-slate-500">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +19% dari bulan lalu
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Active Now
            </CardTitle>
            <Activity className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              +573
            </div>
            <div className="flex items-center text-xs text-slate-500">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +201 sejak jam lalu
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Projects */}
        <Card className="col-span-2 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">
              Recent Projects
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Project terbaru yang sedang dikerjakan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                name: "Hotel Booking App",
                progress: 85,
                status: "In Progress",
                priority: "High",
              },
              {
                name: "RFID Absensi System",
                progress: 60,
                status: "Development",
                priority: "Medium",
              },
              {
                name: "E-commerce Dashboard",
                progress: 30,
                status: "Planning",
                priority: "Low",
              },
              {
                name: "Portfolio Website v2",
                progress: 95,
                status: "Testing",
                priority: "High",
              },
            ].map((project, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {project.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs"
                      >
                        {project.status}
                      </Badge>
                      <Badge
                        variant={
                          project.priority === "High"
                            ? "destructive"
                            : project.priority === "Medium"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {project.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500">
                    {project.progress}%
                  </div>
                </div>
                <Progress
                  value={project.progress}
                  className="h-2 bg-slate-200 dark:bg-slate-800"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Aktivitas terbaru dalam 24 jam
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                user: "Syn_Taxx",
                action: "deployed new version",
                target: "Portfolio Website",
                time: "2 hours ago",
                avatar: "ST",
              },
              {
                user: "Syn_Taxx",
                action: "fixed critical bug in",
                target: "Hotel Booking App",
                time: "4 hours ago",
                avatar: "ST",
              },
              {
                user: "Syn_Taxx",
                action: "completed task",
                target: "RFID Integration",
                time: "6 hours ago",
                avatar: "ST",
              },
              {
                user: "Syn_Taxx",
                action: "started working on",
                target: "Dashboard UI",
                time: "1 day ago",
                avatar: "ST",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {activity.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-slate-600 dark:text-slate-400">
                      {activity.action}
                    </span>{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-slate-500 flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">
            Quick Actions
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Aksi cepat untuk mempercepat workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button
              className="h-20 bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900"
              variant="default"
            >
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm">New Project</div>
              </div>
            </Button>
            <Button
              className="h-20 border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              variant="outline"
            >
              <div className="text-center">
                <Star className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm">View Analytics</div>
              </div>
            </Button>
            <Button
              className="h-20 border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              variant="outline"
            >
              <div className="text-center">
                <CreditCard className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm">Billing</div>
              </div>
            </Button>
            <Button
              className="h-20 border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              variant="outline"
            >
              <div className="text-center">
                <Activity className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm">Settings</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
