"use client"

import type React from "react"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, X, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface Dog {
  id: string
  name: string
  breed: string
  weight: string
  dateOfBirth: string
  groomingBehavior: {
    calmAndRelaxed: boolean
    nervousButManageable: boolean
    veryAnxious: boolean
    energeticHardToKeepStill: boolean
    vocalDuringGrooming: boolean
    doesntLikePawsTouched: boolean
    sensitiveAroundEars: boolean
    doesntLikeNailsTrimmed: boolean
    getsAggressive: boolean
    aggressiveAreas: string
    snapsOrBites: boolean
    additionalNotes: string
  }
}

export default function RegisterPage() {
  
  const [ownerInfo, setOwnerInfo] = useState({
    name: "",
    surname: "",
    email: "",
    countryPrefix: "+1",
    phone: "",
    password: "",
  })

  const [dogs, setDogs] = useState<Dog[]>([
    {
      id: "1",
      name: "",
      breed: "",
      weight: "",
      dateOfBirth: "",
      groomingBehavior: {
        calmAndRelaxed: false,
        nervousButManageable: false,
        veryAnxious: false,
        energeticHardToKeepStill: false,
        vocalDuringGrooming: false,
        doesntLikePawsTouched: false,
        sensitiveAroundEars: false,
        doesntLikeNailsTrimmed: false,
        getsAggressive: false,
        aggressiveAreas: "",
        snapsOrBites: false,
        additionalNotes: "",
      },
    },
  ])

  const countryPrefixes = [
    { code: "+1", country: "US/Canada" },
    { code: "+44", country: "UK" },
    { code: "+33", country: "France" },
    { code: "+49", country: "Germany" },
    { code: "+39", country: "Italy" },
    { code: "+34", country: "Spain" },
    { code: "+31", country: "Netherlands" },
    { code: "+32", country: "Belgium" },
    { code: "+41", country: "Switzerland" },
    { code: "+43", country: "Austria" },
  ]

  const [breeds, setBreeds] = useState([]);
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const res = await fetch("/api/breeds");
        const data = await res.json();
        setBreeds(data);
      } catch (err) {
        console.error("Failed to fetch dog breeds", err);
      }
    };

    fetchBreeds();
  }, []);


  const addDog = () => {
    setDogs([
      ...dogs,
      {
        id: Date.now().toString(),
        name: "",
        breed: "",
        weight: "",
        dateOfBirth: "",
        groomingBehavior: {
          calmAndRelaxed: false,
          nervousButManageable: false,
          veryAnxious: false,
          energeticHardToKeepStill: false,
          vocalDuringGrooming: false,
          doesntLikePawsTouched: false,
          sensitiveAroundEars: false,
          doesntLikeNailsTrimmed: false,
          getsAggressive: false,
          aggressiveAreas: "",
          snapsOrBites: false,
          additionalNotes: "",
        },
      },
    ])
  }

  const removeDog = (id: string) => {
    if (dogs.length > 1) {
      setDogs(dogs.filter((dog) => dog.id !== id))
    }
  }

  const updateDog = (id: string, field: keyof Omit<Dog, "groomingBehavior">, value: string) => {
    setDogs(dogs.map((dog) => (dog.id === id ? { ...dog, [field]: value } : dog)))
  }

  const updateDogBehavior = (id: string, field: keyof Dog["groomingBehavior"], value: boolean | string) => {
    setDogs(
      dogs.map((dog) =>
        dog.id === id
          ? {
              ...dog,
              groomingBehavior: {
                ...dog.groomingBehavior,
                [field]: value,
              },
            }
          : dog,
      ),
    )
  }

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return ""
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + today.getMonth() - birthDate.getMonth()

    if (ageInMonths < 12) {
      return `${ageInMonths} months`
    } else {
      const years = Math.floor(ageInMonths / 12)
      const months = ageInMonths % 12
      return months > 0 ? `${years} years, ${months} months` : `${years} years`
    }
  }

  const getBehaviorComplexity = (behavior: Dog["groomingBehavior"]) => {
    let complexity = "Standard"
    let surcharge = 0

    if (behavior.veryAnxious || behavior.snapsOrBites || behavior.getsAggressive) {
      complexity = "High Risk"
      surcharge = 25
    } else if (
      behavior.energeticHardToKeepStill ||
      behavior.vocalDuringGrooming ||
      behavior.doesntLikePawsTouched ||
      behavior.sensitiveAroundEars ||
      behavior.doesntLikeNailsTrimmed
    ) {
      complexity = "Challenging"
      surcharge = 15
    } else if (behavior.nervousButManageable) {
      complexity = "Gentle Care"
      surcharge = 10
    }

    return { complexity, surcharge }
  }

const handleSubmit = async () => {
  const payload = {
    firstname: ownerInfo.name,
    last_name: ownerInfo.surname,
    phone_country_code: ownerInfo.countryPrefix,
    email: ownerInfo.email,
    phone: ownerInfo.phone,
    password: ownerInfo.password,
    dogs: dogs.map((dog) => ({
      name: dog.name,
      breed: dog.breed,
      weight: dog.weight,
      dob: dog.dateOfBirth,
      groomingBehaviour: Object.entries(dog.groomingBehavior)
        .filter(([_, val]) => val)
        .map(([key]) => key),
      other: dog.groomingBehavior.additionalNotes || "",
    })),
  };

  // 👇 Print dogs payload before sending
  console.log("🐶 Dogs Payload:", JSON.stringify(payload.dogs, null, 2));

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("✅ API Response:", result);
  } catch (error) {
    console.error("❌ Error submitting form:", error);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Create Your Account</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>
                  We need your contact details for booking confirmations and account setup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">First Name *</Label>
                    <Input
                      id="name"
                      value={ownerInfo.name}
                      onChange={(e) => setOwnerInfo({ ...ownerInfo, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="surname">Last Name *</Label>
                    <Input
                      id="surname"
                      value={ownerInfo.surname}
                      onChange={(e) => setOwnerInfo({ ...ownerInfo, surname: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={ownerInfo.email}
                    onChange={(e) => setOwnerInfo({ ...ownerInfo, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <div className="flex gap-2">
                    <Select onValueChange={(value) => setOwnerInfo({ ...ownerInfo, countryPrefix: value })}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="+1" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryPrefixes.map((prefix) => (
                          <SelectItem key={prefix.code} value={prefix.code}>
                            {prefix.code} {prefix.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="tel"
                      placeholder="Phone number"
                      value={ownerInfo.phone}
                      onChange={(e) => setOwnerInfo({ ...ownerInfo, phone: e.target.value })}
                      className="flex-1"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={ownerInfo.password}
                    onChange={(e) => setOwnerInfo({ ...ownerInfo, password: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {dogs.map((dog, index) => {
              const behaviorInfo = getBehaviorComplexity(dog.groomingBehavior)
              const age = calculateAge(dog.dateOfBirth)

              return (
                <Card key={dog.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Dog #{index + 1} Details</CardTitle>
                        <CardDescription>Complete information helps us provide the best care</CardDescription>
                      </div>
                      {dogs.length > 1 && (
                        <Button type="button" variant="outline" size="icon" onClick={() => removeDog(dog.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Dog's Name *</Label>
                        <Input value={dog.name} onChange={(e) => updateDog(dog.id, "name", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Breed *</Label>
                        <Select onValueChange={(value) => updateDog(dog.id, "breed", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select breed" />
                          </SelectTrigger>
                          <SelectContent>
                          {breeds.map((breed: { id: number; name: string }) => (
                              // <SelectItem key={breed} value={breed.toLowerCase().replace(/\s+/g, "-")}>
                              <SelectItem key={breed.id} value={breed.name}>
                                {breed.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Weight (in KG) *</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0.5"
                          max="100"
                          placeholder="e.g., 25.5"
                          value={dog.weight}
                          onChange={(e) => updateDog(dog.id, "weight", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Date of Birth *</Label>
                        <Input
                          type="date"
                          value={dog.dateOfBirth}
                          onChange={(e) => updateDog(dog.id, "dateOfBirth", e.target.value)}
                          max={new Date().toISOString().split("T")[0]}
                          required
                        />
                        {age && <div className="text-sm text-gray-600">Age: {age}</div>}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-base font-semibold">Grooming Behavior Assessment</Label>
                        <p className="text-sm text-gray-600 mb-4">
                          This information helps us prepare properly and affects service duration and pricing
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`calm-${dog.id}`}
                            checked={dog.groomingBehavior.calmAndRelaxed}
                            onCheckedChange={(checked) =>
                              updateDogBehavior(dog.id, "calmAndRelaxed", checked as boolean)
                            }
                          />
                          <Label htmlFor={`calm-${dog.id}`} className="text-sm">
                            Calm and relaxed during grooming
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`nervous-${dog.id}`}
                            checked={dog.groomingBehavior.nervousButManageable}
                            onCheckedChange={(checked) =>
                              updateDogBehavior(dog.id, "nervousButManageable", checked as boolean)
                            }
                          />
                          <Label htmlFor={`nervous-${dog.id}`} className="text-sm">
                            Nervous but manageable
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`anxious-${dog.id}`}
                            checked={dog.groomingBehavior.veryAnxious}
                            onCheckedChange={(checked) => updateDogBehavior(dog.id, "veryAnxious", checked as boolean)}
                          />
                          <Label htmlFor={`anxious-${dog.id}`} className="text-sm text-amber-700">
                            Very anxious or fearful
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`energetic-${dog.id}`}
                            checked={dog.groomingBehavior.energeticHardToKeepStill}
                            onCheckedChange={(checked) =>
                              updateDogBehavior(dog.id, "energeticHardToKeepStill", checked as boolean)
                            }
                          />
                          <Label htmlFor={`energetic-${dog.id}`} className="text-sm">
                            Energetic and hard to keep still
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`vocal-${dog.id}`}
                            checked={dog.groomingBehavior.vocalDuringGrooming}
                            onCheckedChange={(checked) =>
                              updateDogBehavior(dog.id, "vocalDuringGrooming", checked as boolean)
                            }
                          />
                          <Label htmlFor={`vocal-${dog.id}`} className="text-sm">
                            Vocal (barks, whines, etc.) during grooming
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`paws-${dog.id}`}
                            checked={dog.groomingBehavior.doesntLikePawsTouched}
                            onCheckedChange={(checked) =>
                              updateDogBehavior(dog.id, "doesntLikePawsTouched", checked as boolean)
                            }
                          />
                          <Label htmlFor={`paws-${dog.id}`} className="text-sm">
                            Doesn't like paws being touched
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`ears-${dog.id}`}
                            checked={dog.groomingBehavior.sensitiveAroundEars}
                            onCheckedChange={(checked) =>
                              updateDogBehavior(dog.id, "sensitiveAroundEars", checked as boolean)
                            }
                          />
                          <Label htmlFor={`ears-${dog.id}`} className="text-sm">
                            Sensitive around ears
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`nails-${dog.id}`}
                            checked={dog.groomingBehavior.doesntLikeNailsTrimmed}
                            onCheckedChange={(checked) =>
                              updateDogBehavior(dog.id, "doesntLikeNailsTrimmed", checked as boolean)
                            }
                          />
                          <Label htmlFor={`nails-${dog.id}`} className="text-sm">
                            Doesn't like nails being trimmed
                          </Label>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`aggressive-${dog.id}`}
                              checked={dog.groomingBehavior.getsAggressive}
                              onCheckedChange={(checked) =>
                                updateDogBehavior(dog.id, "getsAggressive", checked as boolean)
                              }
                            />
                            <Label htmlFor={`aggressive-${dog.id}`} className="text-sm text-red-700">
                              Gets aggressive if touched in certain areas
                            </Label>
                          </div>
                          {dog.groomingBehavior.getsAggressive && (
                            <Input
                              placeholder="Please specify which areas..."
                              value={dog.groomingBehavior.aggressiveAreas}
                              onChange={(e) => updateDogBehavior(dog.id, "aggressiveAreas", e.target.value)}
                              className="ml-6"
                            />
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`snaps-${dog.id}`}
                            checked={dog.groomingBehavior.snapsOrBites}
                            onCheckedChange={(checked) => updateDogBehavior(dog.id, "snapsOrBites", checked as boolean)}
                          />
                          <Label htmlFor={`snaps-${dog.id}`} className="text-sm text-red-700">
                            Snaps or tries to bite when uncomfortable
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Anything else we should know to make grooming a great experience for your dog?</Label>
                        <Textarea
                          placeholder="Additional behavioral notes, preferences, or special considerations..."
                          value={dog.groomingBehavior.additionalNotes}
                          onChange={(e) => updateDogBehavior(dog.id, "additionalNotes", e.target.value)}
                          rows={3}
                        />
                      </div>

                      {behaviorInfo.surcharge > 0 && (
                        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <span className="font-semibold text-amber-800">Behavior Assessment Impact</span>
                          </div>
                          <div className="text-sm text-amber-700">
                            <div>
                              Complexity Level: <strong>{behaviorInfo.complexity}</strong>
                            </div>
                            <div>
                              Additional Care Surcharge: <strong>+${behaviorInfo.surcharge}</strong>
                            </div>
                            <div className="mt-1 text-xs">
                              This helps us allocate extra time and specialized handling for your dog's comfort and
                              safety.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={addDog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Another Dog
              </Button>
              <Button type="submit">Create Account & Get Pricing</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
