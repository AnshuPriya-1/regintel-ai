"use client";
import * as React from "react";
import { Copy, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { currentUser } from "@/lib/mock-data";

export default function SettingsPage() {
  const [showKey, setShowKey] = React.useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-foreground-muted">Manage your profile, organization and platform preferences.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="w-full overflow-x-auto no-scrollbar sm:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="org">Organization</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="max-w-2xl p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16"><AvatarFallback className="text-lg">{currentUser.initials}</AvatarFallback></Avatar>
              <div>
                <Button variant="outline" size="sm">Change Photo</Button>
                <p className="mt-1.5 text-[11px] text-foreground-muted">JPG or PNG, up to 2MB.</p>
              </div>
            </div>
            <Separator className="my-5" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full Name" defaultValue={currentUser.name} />
              <Field label="Role" defaultValue={currentUser.role} />
              <Field label="Email" defaultValue={currentUser.email} />
              <Field label="Phone" defaultValue="+91 98765 43210" />
            </div>
            <Button className="mt-5">Save Changes</Button>
          </Card>
        </TabsContent>

        <TabsContent value="org">
          <Card className="max-w-2xl p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Organization Name" defaultValue={currentUser.workspace} />
              <Field label="SEBI Registration No." defaultValue="INA000012345" />
              <Field label="Entity Type" defaultValue="Investment Adviser" />
              <Field label="Registered Address" defaultValue="Mumbai, Maharashtra" />
            </div>
            <Button className="mt-5">Save Changes</Button>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="max-w-2xl divide-y divide-border-soft p-2">
            {[
              ["Email notifications", "Get a summary email for high risk obligations."],
              ["Task reminders", "Reminders for tasks due within 48 hours."],
              ["Weekly digest", "A weekly compliance summary every Monday."],
              ["Critical alerts", "Immediate alert for critical risk detections."],
            ].map(([title, desc]) => (
              <div key={title} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="text-xs text-foreground-muted">{desc}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="max-w-2xl p-6">
            <p className="text-sm font-medium text-foreground">Change Password</p>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Current Password" type="password" />
              <Field label="New Password" type="password" />
            </div>
            <Separator className="my-5" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-foreground-muted">Add an extra layer of security to your account.</p>
              </div>
              <Switch />
            </div>
            <Button className="mt-5">Update Security Settings</Button>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="max-w-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Theme</p>
                <p className="text-xs text-foreground-muted">Switch between light and dark mode.</p>
              </div>
              <ThemeToggle />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card className="max-w-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">API Keys</p>
                <p className="text-xs text-foreground-muted">Use these to integrate RegIntel-AI with your internal systems.</p>
              </div>
              <Button size="sm"><Plus className="h-3.5 w-3.5" /> New Key</Button>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted p-3">
              <code className="flex-1 truncate text-xs text-foreground-muted">
                {showKey ? "rgi_live_7f3ac91b2d4e8091cf56a2d0" : "rgi_live_••••••••••••••••••••••"}
              </code>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowKey((v) => !v)}>
                {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7"><Copy className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-danger"><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue?: string; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12.5px] font-medium text-foreground-muted">{label}</label>
      <Input defaultValue={defaultValue} type={type} />
    </div>
  );
}
