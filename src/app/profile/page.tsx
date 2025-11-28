'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Settings, Edit, User, Trash2 } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { badges } from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const passwordHistory = [
    { password: 'P@ss123!', strength: 'Very Strong', strengthValue: 92, status: 'Safe', date: 'Nov 28' },
    { password: 'Secure#2024', strength: 'Very Strong', strengthValue: 88, status: 'Safe', date: 'Nov 27' },
    { password: 'MyPass#456', strength: 'Strong', strengthValue: 75, status: 'Safe', date: 'Nov 27' },
    { password: 'weak123', strength: 'Weak', strengthValue: 34, status: 'At Risk', date: 'Nov 26' },
    { password: 'Password!', strength: 'Fair', strengthValue: 55, status: 'Safe', date: 'Nov 25' },
]

export default function ProfilePage() {
  const avatar = PlaceHolderImages.find((img) => img.id === "avatar-1");
  const { theme, setTheme } = useTheme();

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto mb-8">
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-2 border-primary">
            {avatar && <AvatarImage src={avatar.imageUrl} alt="John Doe" data-ai-hint={avatar.imageHint}/>}
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl font-bold">John Doe</h1>
            <p className="text-muted-foreground">john@example.com</p>
            <p className="text-sm text-muted-foreground">Member since: Nov 28, 2023</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon"><Edit className="h-4 w-4"/></Button>
            <Button variant="outline" size="icon"><Settings className="h-4 w-4"/></Button>
            <Button variant="destructive" size="icon"><LogOut className="h-4 w-4"/></Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          <TabsTrigger value="history">🔐 History</TabsTrigger>
          <TabsTrigger value="settings">⚙️ Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Your Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <p>Level: 5 | XP: 1,250 / 1,500 (83% to Level 6)</p>
                        <Progress value={83} className="h-3 mt-1" />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4">
                            <h4 className="font-semibold">Passwords</h4>
                            <ul className="text-sm text-muted-foreground mt-2">
                                <li>Checked: 12</li>
                                <li>Strong: 10</li>
                                <li>Weak: 2</li>
                                <li>Avg. Strength: 78/100</li>
                            </ul>
                        </Card>
                         <Card className="p-4">
                            <h4 className="font-semibold">Quizzes</h4>
                            <ul className="text-sm text-muted-foreground mt-2">
                                <li>Completed: 8</li>
                                <li>Avg. Score: 76%</li>
                                <li>Current Streak: 5 days</li>
                            </ul>
                        </Card>
                         <Card className="p-4">
                            <h4 className="font-semibold">Emails</h4>
                            <ul className="text-sm text-muted-foreground mt-2">
                                <li>Checked: 3</li>
                                <li>At Risk: 1</li>
                                <li>Monitoring: 2</li>
                            </ul>
                        </Card>
                     </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Badges & Achievements</CardTitle>
                    <CardDescription>You have unlocked {badges.filter(b => b.unlocked).length} of {badges.length} badges.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {badges.map(b => (
                        <div key={b.id} className={`p-3 rounded-lg text-center ${b.unlocked ? 'bg-card border' : 'bg-secondary opacity-60'}`}>
                            <p className="text-2xl">🏆</p>
                            <p className="text-sm font-semibold">{b.name}</p>
                            <p className="text-xs text-muted-foreground">{b.unlocked ? `Unlocked ${b.date}`: `Locked`}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Password History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Password</TableHead>
                                <TableHead>Strength</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {passwordHistory.map(p => (
                                <TableRow key={p.password}>
                                    <TableCell className="font-mono">**********</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={p.strengthValue} className="w-24 h-2"/> 
                                            <span>{p.strength}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={p.status === 'Safe' ? 'default' : 'destructive'} className={`${p.status === 'Safe' ? 'bg-success' : ''}`}>{p.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6 space-y-6" id="settings">
            <Card>
                <CardHeader><CardTitle>Settings & Preferences</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className="font-semibold mb-2">Appearance</h4>
                         <RadioGroup value={theme} onValueChange={setTheme}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="light" id="light" />
                                <Label htmlFor="light">Light</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dark" id="dark" />
                                <Label htmlFor="dark">Dark</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="system" id="system" />
                                <Label htmlFor="system">System</Label>
                            </div>
                        </RadioGroup>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2">Notifications</h4>
                        <div className="space-y-2">
                             <div className="flex items-center space-x-2"><Switch id="n-badge" defaultChecked/><Label htmlFor="n-badge">New badge alerts</Label></div>
                             <div className="flex items-center space-x-2"><Switch id="n-tip" defaultChecked/><Label htmlFor="n-tip">Daily security tip</Label></div>
                             <div className="flex items-center space-x-2"><Switch id="n-breach" defaultChecked/><Label htmlFor="n-breach">Breach alerts</Label></div>
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2">Data Management</h4>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline">Export My Data (JSON)</Button>
                            <Button variant="outline">Import Data</Button>
                            <Button variant="destructive">Clear All Data</Button>
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2">Account</h4>
                         <div className="flex flex-wrap gap-2">
                            <Button variant="secondary">Change Password</Button>
                            <Button variant="destructive">Delete Account</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
