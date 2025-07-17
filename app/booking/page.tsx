"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CalendarIcon, Clock, Dog } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"


export default function BookingPage() {
  const [selectedDog, setSelectedDog] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [dogWeight, setDogWeight] = useState("")
  const [dogAge, setDogAge] = useState("")
  const [coatCondition, setCoatCondition] = useState("")
  const [healthConditions, setHealthConditions] = useState("")
  const [behavioralNotes, setBehavioralNotes] = useState("")
  const [lastGroomed, setLastGroomed] = useState("")
  const [vaccinations, setVaccinations] = useState("")
  const [medications, setMedications] = useState("")

  const dogs = [{ id: "buddy", name: "Buddy", breed: "Golden Retriever" }]

  const services = [
    { id: "bath", name: "Bath Service", price: 45, duration: "1 hour" },
    { id: "retouch", name: "Bath & Retouch", price: 65, duration: "1.5 hours" },
    { id: "grooming", name: "Full Grooming", price: 95, duration: "2-3 hours" },
  ]

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

 const handleBooking = () => {
  const bookingData = {
    dog: selectedDog,
    service: selectedService,
    date: selectedDate,
    time: selectedTime,
    dogWeight,
    dogAge,
    coatCondition,
    healthConditions,
    behavioralNotes,
    lastGroomed,
    vaccinations,
    medications,
    specialRequests,
    totalPrice,
  }

  console.log("Booking data:", bookingData)
  alert("Booking confirmed! You'll receive an SMS confirmation shortly.")
  window.location.href = "/dashboard"
}

  const selectedServiceData = services.find((s) => s.id === selectedService)

  const  totalPrice = useMemo(() => {
  if (!selectedServiceData) return 0

  let total = selectedServiceData.price

  if (dogWeight === "over-100") total += 15
  if (coatCondition === "poor") total += 20
  if (coatCondition === "severely-matted") total += 35
  if (lastGroomed === "over-6-months") total += 10
  if (lastGroomed === "never") total += 15

  return total
}, [selectedServiceData, dogWeight, coatCondition, lastGroomed])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Book an Appointment</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Your Dog</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select onValueChange={setSelectedDog}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your dog" />
                    </SelectTrigger>
                    <SelectContent>
                      {dogs.map((dog) => (
                        <SelectItem key={dog.id} value={dog.id}>
                          <div className="flex items-center gap-2">
                            <Dog className="h-4 w-4" />
                            {dog.name} ({dog.breed})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Dog Details</CardTitle>
                  <CardDescription>
                    Please update your dog's current information for accurate pricing and care
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Current Weight</Label>
                      <Select onValueChange={setDogWeight}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select weight range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-10">Under 10 lbs</SelectItem>
                          <SelectItem value="10-25">10-25 lbs</SelectItem>
                          <SelectItem value="25-50">25-50 lbs</SelectItem>
                          <SelectItem value="50-75">50-75 lbs</SelectItem>
                          <SelectItem value="75-100">75-100 lbs</SelectItem>
                          <SelectItem value="over-100">Over 100 lbs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Current Age</Label>
                      <Select onValueChange={setDogAge}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select age range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="puppy">Puppy (under 1 year)</SelectItem>
                          <SelectItem value="young">Young (1-3 years)</SelectItem>
                          <SelectItem value="adult">Adult (3-7 years)</SelectItem>
                          <SelectItem value="senior">Senior (7+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Coat Condition</Label>
                      <Select onValueChange={setCoatCondition}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select coat condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent - Well maintained</SelectItem>
                          <SelectItem value="good">Good - Regular brushing</SelectItem>
                          <SelectItem value="fair">Fair - Some matting</SelectItem>
                          <SelectItem value="poor">Poor - Heavily matted</SelectItem>
                          <SelectItem value="severely-matted">Severely matted - May need shaving</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Last Groomed</Label>
                      <Select onValueChange={setLastGroomed}>
                        <SelectTrigger>
                          <SelectValue placeholder="When was last grooming?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2-weeks">1-2 weeks ago</SelectItem>
                          <SelectItem value="3-4-weeks">3-4 weeks ago</SelectItem>
                          <SelectItem value="1-2-months">1-2 months ago</SelectItem>
                          <SelectItem value="3-6-months">3-6 months ago</SelectItem>
                          <SelectItem value="over-6-months">Over 6 months ago</SelectItem>
                          <SelectItem value="never">Never professionally groomed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Health Conditions</Label>
                    <Textarea
                      placeholder="Any current health issues, skin conditions, allergies, or physical limitations..."
                      value={healthConditions}
                      onChange={(e) => setHealthConditions(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Behavioral Notes</Label>
                    <Textarea
                      placeholder="How does your dog behave during grooming? Any fears, preferences, or special handling needed..."
                      value={behavioralNotes}
                      onChange={(e) => setBehavioralNotes(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Current Medications</Label>
                      <Textarea
                        placeholder="List any medications your dog is currently taking..."
                        value={medications}
                        onChange={(e) => setMedications(e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Vaccination Status</Label>
                      <Select onValueChange={setVaccinations}>
                        <SelectTrigger>
                          <SelectValue placeholder="Vaccination status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="up-to-date">Up to date - within 1 year</SelectItem>
                          <SelectItem value="recent">Recent - within 6 months</SelectItem>
                          <SelectItem value="overdue">Overdue - over 1 year</SelectItem>
                          <SelectItem value="unknown">Unknown/Not sure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {(dogWeight || coatCondition) && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Pricing Adjustments:</h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        {dogWeight === "over-100" && <div>• Large breed surcharge: +$15</div>}
                        {coatCondition === "poor" && <div>• Matted coat fee: +$20</div>}
                        {coatCondition === "severely-matted" && <div>• Severe matting fee: +$35</div>}
                        {lastGroomed === "over-6-months" && <div>• Extended service time: +$10</div>}
                        {lastGroomed === "never" && <div>• First-time grooming: +$15</div>}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Choose Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedService === service.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{service.name}</div>
                            <div className="text-sm text-gray-600">{service.duration}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold">${service.price}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Select Date & Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Choose Date</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-md border"
                    />
                  </div>

                  {selectedDate && (
                    <div>
                      <Label>Available Times</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Special Requests</CardTitle>
                  <CardDescription>Any specific instructions for your groomer?</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="e.g., Please use the summer cut style, be gentle around ears..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedDog && (
                    <div>
                      <Label>Dog</Label>
                      <div className="font-semibold">{dogs.find((d) => d.id === selectedDog)?.name}</div>
                    </div>
                  )}

                  {selectedServiceData && (
                    <div>
                      <Label>Service</Label>
                      <div className="font-semibold">{selectedServiceData.name}</div>
                      <div className="text-sm text-gray-600">{selectedServiceData.duration}</div>
                    </div>
                  )}

                  {selectedDate && (
                    <div>
                      <Label>Date</Label>
                      <div className="font-semibold">{selectedDate.toLocaleDateString()}</div>
                    </div>
                  )}

                  {selectedTime && (
                    <div>
                      <Label>Time</Label>
                      <div className="font-semibold">{selectedTime}</div>
                    </div>
                  )}

                  {selectedServiceData && (
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold">${totalPrice}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Badge variant="secondary" className="w-full justify-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      SMS reminder 24hrs before
                    </Badge>
                    <Badge variant="secondary" className="w-full justify-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Free rescheduling up to 4hrs before
                    </Badge>
                  </div>

                  {!dogWeight || !dogAge ? (
                    <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                      Please complete dog details to continue
                    </div>
                  ) : null}

                  <Button
                    className="w-full"
                    onClick={handleBooking}
                    disabled={
                      !selectedDog || !selectedService || !selectedDate || !selectedTime || !dogWeight || !dogAge
                    }
                  >
                    Confirm Booking
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
