"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Dog, Heart, Phone, Plus, Settings, Star, User, CalendarIcon } from "lucide-react"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"


interface Booking {
  id: string;
  dog: string;
  service: string;
  date: string;
  time: string;
  price: number;
}

type GroomingEntry = {
  id: string;
  created_at: string;
  rating: number;
  notes: string;
  photos: string[];
  dogs?: {
    name: string;
  };
  bookings?:
  {
    booking_date: string;
    ritual_type: string;
  };
};



export default function DashboardPage() {
  const [selectedDog, setSelectedDog] = useState("buddy")
  const [upcomingAppointments, setUpcomingAppointments] = useState<Booking[]>([]);
  const [groomingHistory, setGroomingHistory] = useState<GroomingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null)
  const [newDate, setNewDate] = useState<Date | undefined>(new Date())

  const handleRescheduleClick = (id: string) => {
    setReschedulingId(id === reschedulingId ? null : id)
    setNewDate(undefined)
  }

  const handleConfirm = async (id: string) => {
    if (!newDate) return
    await fetch("/api/bookings/reschedule-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId: id,
        newBookingDate: newDate.toISOString().split("T")[0],
      }),
    })
    setReschedulingId(null)
    // Optionally refresh appointments list here
  }



  const dogs = [
    {
      id: "buddy",
      name: "Buddy",
      breed: "Golden Retriever",
      weight: "65 lbs",
      age: "4 years",
      lastGroomed: "2024-01-15",
      favoriteStyle: "Summer Cut",
      photos: ["/placeholder.svg?height=100&width=100"],
      pricing: { bath: 45, retouch: 65, grooming: 95 },
    },
  ]

useEffect(() => {
  const fetchBookings = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.log("No userId found in localStorage.");
      return;
    }

    try {
      console.log("Fetching bookings for userId:", userId);
      const res = await fetch(`/api/bookings/get-bookings?user_id=${userId}`);
      const data = await res.json();
      console.log("Raw API response:", data);

      if (res.ok && data.length > 0) {
      const bookings = data.map((booking: any) => ({
          id: booking.id,
          dog: booking.dog || "Unknown",
          service: booking.service || "N/A",
          date: booking.date,
          time: booking.time,
          price: booking.price,
        }));

        console.log("Mapped bookings:", bookings);
        setUpcomingAppointments(bookings);
      } else {
        console.log("No bookings found or bad response.");
        setUpcomingAppointments([]); // clear old state just in case
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  fetchBookings();
}, []);


  useEffect(() => {
    const fetchGroomingHistory = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.log("No userId found in localStorage.");
        return;
      }
      try {
        const res = await fetch("/api/grooming-history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const result = await res.json();

        if (res.ok && result.grooming_feedback) {
          setGroomingHistory(result.grooming_feedback);
        } else {
          console.error("API error:", result.error || result.details);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

     fetchGroomingHistory();
  }, []);

  const currentDog = dogs.find((dog) => dog.id === selectedDog) || dogs[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, Sarah!</h1>
              <p className="text-gray-600">Manage your appointments and dog profiles</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <Link href="/booking">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Book New
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex flex-col gap-2 p-4 border rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <CalendarIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-semibold">
                                  {appointment.service} - {appointment.dog}
                                </div>
                                <div className="text-sm text-gray-600 flex items-center gap-4">
                                  <span>{appointment.date}</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {appointment.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right space-y-2">
                              <div className="font-semibold">${appointment.price}</div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRescheduleClick(appointment.id)}
                              >
                                <Phone className="h-4 w-4 mr-1" />
                                Reschedule
                              </Button>
                            </div>
                          </div>

                          {reschedulingId === appointment.id && (
                            <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                              <Calendar
                                mode="single"
                                selected={newDate}
                                onSelect={setNewDate}
                              />
                              <div className="flex justify-end gap-2 mt-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setReschedulingId(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleConfirm(appointment.id)}
                                  disabled={!newDate}
                                >
                                  Confirm
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No upcoming appointments</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Book Services</CardTitle>
                  <CardDescription>Your personalized pricing for {currentDog.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">${currentDog.pricing.bath}</div>
                      <div className="font-semibold">Bath Service</div>
                      <Button className="w-full mt-2 bg-transparent" variant="outline">
                        Book Now
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">${currentDog.pricing.retouch}</div>
                      <div className="font-semibold">Bath & Retouch</div>
                      <Button className="w-full mt-2 bg-transparent" variant="outline">
                        Book Now
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">${currentDog.pricing.grooming}</div>
                      <div className="font-semibold">Full Grooming</div>
                      <Button className="w-full mt-2">Book Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dog className="h-5 w-5" />
                    {currentDog.name}'s Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src={currentDog.photos[0]} />
                      <AvatarFallback>{currentDog.name[0]}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">{currentDog.name}</h3>
                    <p className="text-sm text-gray-600">{currentDog.breed}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Weight:</span>
                      <span>{currentDog.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Age:</span>
                      <span>{currentDog.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Groomed:</span>
                      <span>{currentDog.lastGroomed}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="font-semibold text-sm">Favorite Style</span>
                    </div>
                    <Badge variant="secondary">{currentDog.favoriteStyle}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Grooming History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {groomingHistory.slice(0, 2).map((session) => (
                      <div key={session.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-semibold">{session.bookings?.ritual_type}</div>
                          <div className="flex items-center gap-1">
                            {[...Array(session.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          {session.bookings?.booking_date} • {session.dogs?.name}
                        </div>
                        <div className="flex gap-2 mb-2">
                          {session.photos.map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt="Grooming result"
                              className="w-12 h-12 rounded object-cover"
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">{session.notes}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View All History
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
