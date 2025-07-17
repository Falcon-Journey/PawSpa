"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, DollarSign, MessageSquare, Settings, Upload, Users } from "lucide-react"

export default function AdminPage() {
  const [customPrice, setCustomPrice] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [smsTemplate, setSmsTemplate] = useState(
    "Hi {customerName}! This is a reminder that {dogName} has a {service} appointment tomorrow at {time}. Reply RESCHEDULE to change your appointment.",
  )

  const customers = [
    {
      id: "1",
      name: "Sarah Johnson",
      dog: "Buddy",
      breed: "Golden Retriever",
      nextAppointment: "2024-01-28",
      service: "Full Grooming",
      currentPrice: 95,
      totalVisits: 12,
    },
    {
      id: "2",
      name: "Mike Chen",
      dog: "Luna",
      breed: "Poodle",
      nextAppointment: "2024-01-29",
      service: "Bath & Retouch",
      currentPrice: 55,
      totalVisits: 8,
    },
  ]

  const upcomingAppointments = [
    {
      id: "1",
      customer: "Sarah Johnson",
      dog: "Buddy",
      service: "Full Grooming",
      date: "2024-01-28",
      time: "10:00 AM",
      price: 95,
      reminderSent: false,
    },
    {
      id: "2",
      customer: "Mike Chen",
      dog: "Luna",
      service: "Bath & Retouch",
      date: "2024-01-29",
      time: "2:00 PM",
      price: 55,
      reminderSent: true,
    },
  ]

  const handlePriceOverride = () => {
    alert(`Price updated for ${customers.find((c) => c.id === selectedCustomer)?.name}`)
    setCustomPrice("")
    setSelectedCustomer("")
  }

  const handleSendReminder = (appointmentId: string) => {
    alert("SMS reminder sent!")
  }

  const handleUploadPhoto = () => {
    alert("Photo upload functionality would be implemented here")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Settings className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>

          <Tabs defaultValue="appointments" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="pricing">Custom Pricing</TabsTrigger>
              <TabsTrigger value="photos">Photo Management</TabsTrigger>
              <TabsTrigger value="reminders">SMS Reminders</TabsTrigger>
            </TabsList>

            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Appointments
                  </CardTitle>
                  <CardDescription>Manage today's and upcoming appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Dog</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Reminder</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium">{appointment.customer}</TableCell>
                          <TableCell>{appointment.dog}</TableCell>
                          <TableCell>{appointment.service}</TableCell>
                          <TableCell>
                            {appointment.date} at {appointment.time}
                          </TableCell>
                          <TableCell>${appointment.price}</TableCell>
                          <TableCell>
                            <Badge variant={appointment.reminderSent ? "default" : "secondary"}>
                              {appointment.reminderSent ? "Sent" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                              {!appointment.reminderSent && (
                                <Button size="sm" onClick={() => handleSendReminder(appointment.id)}>
                                  Send Reminder
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Custom Pricing Override
                    </CardTitle>
                    <CardDescription>Set custom prices for specific customers</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Customer</Label>
                      <Select onValueChange={setSelectedCustomer}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name} - {customer.dog} ({customer.breed})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedCustomer && (
                      <>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm">
                            <div>
                              <strong>Current Price:</strong> $
                              {customers.find((c) => c.id === selectedCustomer)?.currentPrice}
                            </div>
                            <div>
                              <strong>Service:</strong> {customers.find((c) => c.id === selectedCustomer)?.service}
                            </div>
                            <div>
                              <strong>Total Visits:</strong>{" "}
                              {customers.find((c) => c.id === selectedCustomer)?.totalVisits}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>New Custom Price</Label>
                          <Input
                            type="number"
                            placeholder="Enter new price"
                            value={customPrice}
                            onChange={(e) => setCustomPrice(e.target.value)}
                          />
                        </div>

                        <Button onClick={handlePriceOverride} disabled={!customPrice}>
                          Update Price
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Customer Pricing Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {customers.map((customer) => (
                        <div key={customer.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold">{customer.name}</div>
                              <div className="text-sm text-gray-600">
                                {customer.dog} - {customer.breed}
                              </div>
                              <div className="text-sm text-gray-600">{customer.totalVisits} visits</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">${customer.currentPrice}</div>
                              <div className="text-sm text-gray-600">{customer.service}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="photos">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Photo Management
                  </CardTitle>
                  <CardDescription>Upload and manage grooming photos for customer profiles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Customer</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose customer to add photos" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} - {customer.dog}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">Drag and drop photos here, or click to browse</p>
                    <Button onClick={handleUploadPhoto}>Choose Files</Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Grooming Notes</Label>
                    <Textarea placeholder="Add notes about the grooming session, customer preferences, etc." />
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="favorite" />
                    <Label htmlFor="favorite">Mark as customer's favorite style</Label>
                  </div>

                  <Button>Save Photos & Notes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reminders">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      SMS Reminder Settings
                    </CardTitle>
                    <CardDescription>Customize automatic reminder messages</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Reminder Template</Label>
                      <Textarea value={smsTemplate} onChange={(e) => setSmsTemplate(e.target.value)} rows={4} />
                      <div className="text-xs text-gray-600">
                        Available variables: {"{customerName}"}, {"{dogName}"}, {"{service}"}, {"{time}"}, {"{date}"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Send Reminder</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="24 hours before appointment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24h">24 hours before</SelectItem>
                          <SelectItem value="12h">12 hours before</SelectItem>
                          <SelectItem value="6h">6 hours before</SelectItem>
                          <SelectItem value="2h">2 hours before</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button>Save Settings</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Reminder Preview</CardTitle>
                    <CardDescription>How your message will look to customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <div className="text-sm font-mono">
                        Hi Sarah Johnson! This is a reminder that Buddy has a Full Grooming appointment tomorrow at
                        10:00 AM. Reply RESCHEDULE to change your appointment.
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        <strong>Features:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Automatic personalization</li>
                        <li>Reply-to-reschedule option</li>
                        <li>Delivery confirmation</li>
                        <li>Failed delivery alerts</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
