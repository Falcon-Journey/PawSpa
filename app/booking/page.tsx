"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CalendarIcon, Clock, Dog, Heart, Sparkles, Crown, AlertTriangle } from "lucide-react"
import Link from "next/link"


interface Dog {
  id: string;
  name: string;
  breed: string;
}

export default function BookingPage() {
  const [selectedDog, setSelectedDog] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState("")
  const [dogs, setDogs] = useState<Dog[]>([]);

  // Dog condition assessment
  const [coatCondition, setCoatCondition] = useState("")
  const [lastGrooming, setLastGrooming] = useState("")

  // Health considerations
  const [healthConsiderations, setHealthConsiderations] = useState({
    seniorDog: false,
    heartBreathingIssues: false,
    medicationBehavior: false,
    medicationDetails: "",
    recentSurgery: false,
    surgeryDetails: "",
    otherHealth: "",
  })

  // Vaccination status
  const [vaccinations, setVaccinations] = useState({
    dhppVaccine: false,
    dhppDate: "",
    rabiesVaccine: false,
    rabiesDate: "",
  })

  // Veterinary reference
  const [veterinaryInfo, setVeterinaryInfo] = useState({
    clinicName: "",
    contactPerson: "",
    address: "",
    phone: "",
  })

  // Emergency contact
  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    phone: "",
  })

  // Other booking details
  const [specialRequests, setSpecialRequests] = useState("")
  const [discountCode, setDiscountCode] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)

  useEffect(() => {
    const fetchDogs = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await fetch("/api/dogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      setDogs(data.dogs || []);
    };

    fetchDogs();
  }, []);

  const services = [
    {
      id: "Pure Ritual",
      name: "Pure Ritual",
      icon: Sparkles,
      basePrice: 45,
      duration: "60-90 minutes",
      description: "Essential care for your dog's wellbeing",
      includes: [
        "Bath with Houndsly natural shampoo, matched to your dog's coat",
        "Blow dry",
        "Dog perfume",
        "Ozone water treatment",
        "Stress-free grooming techniques",
      ],
    },
    {
      id: "Refresh Ritual",
      name: "Refresh Ritual",
      icon: Heart,
      basePrice: 65,
      duration: "90-120 minutes",
      description: "Complete care with hygiene maintenance",
      includes: [
        "Everything in the Pure Ritual, plus:",
        "Nail care",
        "Ear cleaning",
        "Hygiene trim",
        "Paw pad shave",
        "Facial cleanse",
        "Light retouch for a tidy look",
      ],
      popular: true,
    },
    {
      id: "Signature Ritual",
      name: "Signature Ritual",
      icon: Crown,
      basePrice: 95,
      duration: "2-3 hours",
      description: "Premium styling and complete transformation",
      includes: [
        "Everything in the Refresh Ritual, plus:",
        "Full custom styling (scissoring or breed-specific cut)",
        "Premium finishing touches",
        "Professional photography of the final look",
      ],
    },
  ]

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

  const calculatePricing = async (dogBreed: string) => {
    console.log("Calling pricing API with:", {
  dogType: dogBreed,
  coatType: coatCondition,
  lastGroomingPeriod: lastGrooming,
});
    const baseService = services.find((s) => s.id === selectedService)
    if (!baseService) return { price: 0, adjustments: [] }

    let price = baseService.basePrice
    const adjustments = []

      try {
    const res = await fetch("/api/price-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dogType: dogBreed,           // e.g., "Small"
        coatType: coatCondition,         // e.g., "Short"
        lastGroomingPeriod: lastGrooming    // e.g., "over-6-months"
      }),
    });

    const result = await res.json();

    if (res.ok && result.price) {
      const apiPrice = parseFloat(result.price);
      price += apiPrice;
      adjustments.push(`Breed/Coat/Grooming surcharge: +$${apiPrice}`);
    }
  } catch (err) {
    adjustments.push("Failed to fetch pricing rule from server.");
  }

    // Coat condition adjustments
    if (coatCondition === "severely-matted") {
      price += 35
      adjustments.push("Severely matted coat: +$35")
    } else if (coatCondition === "fair") {
      price += 10
      adjustments.push("Some matting: +$10")
    }

    // Last grooming adjustments
    if (lastGrooming === "never") {
      price += 20
      adjustments.push("First professional grooming: +$20")
    } else if (lastGrooming === "3-6-months") {
      price += 10
      adjustments.push("3-6 months since grooming: +$10")
    }

    // Health considerations adjustments
    if (healthConsiderations.seniorDog || healthConsiderations.heartBreathingIssues) {
      price += 15
      adjustments.push("Special care required: +$15")
    }

    return { price, adjustments }
  }
const handleBooking = async () => {
  const user_id = localStorage.getItem("userId") // assuming you stored userId here
  if (!user_id) {
    alert("Please log in first.");
    return;
  }

  if (!selectedDog || !selectedDate || !selectedTime) {
    alert("Please complete all required fields before booking.");
    return;
  }

  const bookingData = {
    user_id,
    dog_id: selectedDog,
    booking_details: {
      coatCondition,
      lastGrooming,
      healthConsiderations,
      vaccinations,
      veterinaryInfo,
      emergencyContact,
    },
    booking_date: selectedDate,
    booking_slot_time: selectedTime,
    ritual_type: selectedService,
    discount_code: discountCode || null,
    special_requests: specialRequests || null,
    total_price: pricingInfo.price, // or include discounts logic here
  }

  try {
    const res = await fetch("/api/bookings/create-booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })

    const result = await res.json()

    if (!res.ok) {
      console.error("Booking failed:", result)
      alert("Booking failed. Please try again.")
      return
    }

    console.log("Booking successful:", result)
    alert("Booking confirmed! You'll receive an SMS confirmation shortly.")
    await fetch("/api/server/sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: "+917668239544",
        message: "Your grooming appointment is confirmed!",
      }),
    });
    await fetch("/api/server/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "madhurnarang2002@gmail.com", // Or bookingData.email if stored there
        subject: "Booking Confirmation - Grooming Appointment",
        body: `Hi ${result.user.firstname},\n\nYour grooming appointment for ${selectedService} is confirmed on ${selectedDate} at ${selectedTime}.\n\nThanks for booking with us! 🐾`,
      }),
    });
    window.location.href = "/dashboard"
  } catch (err) {
    console.error("Error submitting booking:", err)
    alert("Something went wrong. Please try again later.")
  }
}

  const selectedServiceData = services.find((s) => s.id === selectedService)
  const [pricingInfo, setPricingInfo] = useState({ price: 0, adjustments: [] as string[] })

  useEffect(() => {
    const fetchPricing = async () => {
      const dog = dogs.find((d) => d.id === selectedDog)
      const dogBreed = dog ? dog.breed : ""
      if (selectedService && dogBreed) {
        const result = await calculatePricing(dogBreed)
        setPricingInfo(result)
      } else {
        setPricingInfo({ price: 0, adjustments: [] })
      }
    }
    fetchPricing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDog, selectedService, coatCondition, lastGrooming, healthConsiderations])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Book Your Ritual</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Dog Selection */}
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

              {/* Current Condition Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Grooming Condition</CardTitle>
                  <CardDescription>This helps us prepare and affects service duration and pricing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>What's your dog's current grooming situation?</Label>
                    <Select onValueChange={setCoatCondition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select coat condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">1. Excellent – Well maintained, no tangles</SelectItem>
                        <SelectItem value="good">2. Good – Regular brushing, minimal knots</SelectItem>
                        <SelectItem value="fair">3. Fair – Some matting or tangles</SelectItem>
                        <SelectItem value="poor">4. Poor – Heavily matted, needs extra care</SelectItem>
                        <SelectItem value="severely-matted">5. Severely Matted – May require shaving</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Last Professional Grooming</Label>
                    <Select onValueChange={setLastGrooming}>
                      <SelectTrigger>
                        <SelectValue placeholder="When was the last grooming?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2-weeks">1-2 Weeks</SelectItem>
                        <SelectItem value="3-4-weeks">3-4 Weeks</SelectItem>
                        <SelectItem value="1-2-months">1-2 Months</SelectItem>
                        <SelectItem value="3-6-months">3-6 Months</SelectItem>
                        <SelectItem value="over-6-months">Over 6 months ago</SelectItem>
                        <SelectItem value="never">Never professionally groomed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Health Considerations */}
              <Card>
                <CardHeader>
                  <CardTitle>Health Considerations</CardTitle>
                  <CardDescription>Help us provide the safest and most comfortable experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="senior"
                        checked={healthConsiderations.seniorDog}
                        onCheckedChange={(checked) =>
                          setHealthConsiderations({ ...healthConsiderations, seniorDog: checked as boolean })
                        }
                      />
                      <Label htmlFor="senior">Senior dog / limited mobility</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="heart"
                        checked={healthConsiderations.heartBreathingIssues}
                        onCheckedChange={(checked) =>
                          setHealthConsiderations({ ...healthConsiderations, heartBreathingIssues: checked as boolean })
                        }
                      />
                      <Label htmlFor="heart">Has heart or breathing issues</Label>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="medication"
                          checked={healthConsiderations.medicationBehavior}
                          onCheckedChange={(checked) =>
                            setHealthConsiderations({ ...healthConsiderations, medicationBehavior: checked as boolean })
                          }
                        />
                        <Label htmlFor="medication">On medication that affects behavior</Label>
                      </div>
                      {healthConsiderations.medicationBehavior && (
                        <Input
                          placeholder="Please specify medications and effects..."
                          value={healthConsiderations.medicationDetails}
                          onChange={(e) =>
                            setHealthConsiderations({ ...healthConsiderations, medicationDetails: e.target.value })
                          }
                          className="ml-6"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="surgery"
                          checked={healthConsiderations.recentSurgery}
                          onCheckedChange={(checked) =>
                            setHealthConsiderations({ ...healthConsiderations, recentSurgery: checked as boolean })
                          }
                        />
                        <Label htmlFor="surgery">Recently had surgery or health issues</Label>
                      </div>
                      {healthConsiderations.recentSurgery && (
                        <Input
                          placeholder="Please specify details and any restrictions..."
                          value={healthConsiderations.surgeryDetails}
                          onChange={(e) =>
                            setHealthConsiderations({ ...healthConsiderations, surgeryDetails: e.target.value })
                          }
                          className="ml-6"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Any other health considerations we should know?</Label>
                      <Textarea
                        placeholder="Additional health information..."
                        value={healthConsiderations.otherHealth}
                        onChange={(e) =>
                          setHealthConsiderations({ ...healthConsiderations, otherHealth: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vaccination Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Vaccination Status</CardTitle>
                  <CardDescription>Required for the safety of all pets in our care</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="dhpp"
                          checked={vaccinations.dhppVaccine}
                          onCheckedChange={(checked) =>
                            setVaccinations({ ...vaccinations, dhppVaccine: checked as boolean })
                          }
                        />
                        <Label htmlFor="dhpp">DHPP Vaccine</Label>
                      </div>
                      {vaccinations.dhppVaccine && (
                        <Input
                          type="date"
                          placeholder="Last date administered"
                          value={vaccinations.dhppDate}
                          onChange={(e) => setVaccinations({ ...vaccinations, dhppDate: e.target.value })}
                          className="ml-6"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="rabies"
                          checked={vaccinations.rabiesVaccine}
                          onCheckedChange={(checked) =>
                            setVaccinations({ ...vaccinations, rabiesVaccine: checked as boolean })
                          }
                        />
                        <Label htmlFor="rabies">Rabies Vaccine</Label>
                      </div>
                      {vaccinations.rabiesVaccine && (
                        <Input
                          type="date"
                          placeholder="Last date administered"
                          value={vaccinations.rabiesDate}
                          onChange={(e) => setVaccinations({ ...vaccinations, rabiesDate: e.target.value })}
                          className="ml-6"
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Veterinary Reference */}
              <Card>
                <CardHeader>
                  <CardTitle>Veterinary Reference</CardTitle>
                  <CardDescription>Your dog's primary veterinary clinic information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Clinic Name</Label>
                      <Input
                        value={veterinaryInfo.clinicName}
                        onChange={(e) => setVeterinaryInfo({ ...veterinaryInfo, clinicName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Point of Contact</Label>
                      <Input
                        value={veterinaryInfo.contactPerson}
                        onChange={(e) => setVeterinaryInfo({ ...veterinaryInfo, contactPerson: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      value={veterinaryInfo.address}
                      onChange={(e) => setVeterinaryInfo({ ...veterinaryInfo, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={veterinaryInfo.phone}
                      onChange={(e) => setVeterinaryInfo({ ...veterinaryInfo, phone: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                  <CardDescription>Someone we can reach if needed during the appointment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={emergencyContact.name}
                        onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        type="tel"
                        value={emergencyContact.phone}
                        onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Choose Your Ritual</CardTitle>
                  <CardDescription>Select the perfect experience for your dog</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {services.map((service) => {
                      const Icon = service.icon
                      return (
                        <div
                          key={service.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors relative ${
                            selectedService === service.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedService(service.id)}
                        >
                          {service.popular && (
                            <Badge className="absolute -top-2 -right-2 bg-blue-500">Most Popular</Badge>
                          )}
                          <div className="flex items-start gap-4">
                            <Icon className="h-8 w-8 text-blue-600 mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="font-semibold text-lg">{service.name}</div>
                                  <div className="text-sm text-gray-600">{service.duration}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold">${service.basePrice}</div>
                                  <div className="text-xs text-gray-500">starting from</div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 mb-3">{service.description}</p>
                              <ul className="text-xs space-y-1">
                                {service.includes.map((item, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Date & Time Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Date & Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
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

              {/* Special Requests & Discount */}
              <Card>
                <CardHeader>
                  <CardTitle>Final Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Special Requests</Label>
                    <Textarea
                      placeholder="Any specific styling requests, preferences, or special instructions..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Discount Code</Label>
                    <Input
                      placeholder="Enter discount code if you have one"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I accept the{" "}
                        <a href="#" className="text-blue-600 underline">
                          Terms and Conditions
                        </a>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="privacy"
                        checked={acceptPrivacy}
                        onCheckedChange={(checked) => setAcceptPrivacy(checked as boolean)}
                      />
                      <Label htmlFor="privacy" className="text-sm">
                        I accept the{" "}
                        <a href="#" className="text-blue-600 underline">
                          Privacy Policy
                        </a>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
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
                      <Label>Ritual</Label>
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

                  {pricingInfo.adjustments.length > 0 && (
                    <div className="pt-4 border-t">
                      <Label>Pricing Adjustments</Label>
                      <div className="space-y-1">
                        {pricingInfo.adjustments.map((adjustment, index) => (
                          <div key={index} className="text-sm text-amber-700 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {adjustment}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedServiceData && (
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold">${pricingInfo.price}</span>
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

                  <Button
                    className="w-full"
                    onClick={handleBooking}
                    disabled={
                      !selectedDog ||
                      !selectedService ||
                      !selectedDate ||
                      !selectedTime ||
                      !acceptTerms ||
                      !acceptPrivacy
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
