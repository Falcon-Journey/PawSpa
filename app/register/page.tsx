"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"

interface Dog {
  id: string
  name: string
  breed: string
  weight: string
  age: string
  specialNeeds: string
}

export default function RegisterPage() {
  const [ownerInfo, setOwnerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })

  const [dogs, setDogs] = useState<Dog[]>([
    {
      id: "1",
      name: "",
      breed: "",
      weight: "",
      age: "",
      specialNeeds: "",
    },
  ])

  const addDog = () => {
    setDogs([
      ...dogs,
      {
        id: Date.now().toString(),
        name: "",
        breed: "",
        weight: "",
        age: "",
        specialNeeds: "",
      },
    ])
  }

  const removeDog = (id: string) => {
    if (dogs.length > 1) {
      setDogs(dogs.filter((dog) => dog.id !== id))
    }
  }

  const updateDog = (id: string, field: keyof Dog, value: string) => {
    setDogs(dogs.map((dog) => (dog.id === id ? { ...dog, [field]: value } : dog)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock registration - in real app, save to database
    window.location.href = "/pricing"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">New Customer Registration</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>We need your contact details for booking confirmations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={ownerInfo.name}
                      onChange={(e) => setOwnerInfo({ ...ownerInfo, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={ownerInfo.email}
                      onChange={(e) => setOwnerInfo({ ...ownerInfo, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={ownerInfo.phone}
                      onChange={(e) => setOwnerInfo({ ...ownerInfo, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={ownerInfo.password}
                      onChange={(e) => setOwnerInfo({ ...ownerInfo, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {dogs.map((dog, index) => (
              <Card key={dog.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Dog #{index + 1}</CardTitle>
                      <CardDescription>Tell us about your furry friend</CardDescription>
                    </div>
                    {dogs.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeDog(dog.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Dog's Name</Label>
                      <Input value={dog.name} onChange={(e) => updateDog(dog.id, "name", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Breed</Label>
                      <Select onValueChange={(value) => updateDog(dog.id, "breed", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select breed" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="golden-retriever">Golden Retriever</SelectItem>
                          <SelectItem value="labrador">Labrador</SelectItem>
                          <SelectItem value="german-shepherd">German Shepherd</SelectItem>
                          <SelectItem value="poodle">Poodle</SelectItem>
                          <SelectItem value="bulldog">Bulldog</SelectItem>
                          <SelectItem value="chihuahua">Chihuahua</SelectItem>
                          <SelectItem value="mixed">Mixed Breed</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Weight</Label>
                      <Select onValueChange={(value) => updateDog(dog.id, "weight", value)}>
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
                      <Label>Age</Label>
                      <Select onValueChange={(value) => updateDog(dog.id, "age", value)}>
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
                  <div className="space-y-2">
                    <Label>Special Needs or Notes</Label>
                    <Textarea
                      placeholder="Any behavioral issues, medical conditions, or special requests..."
                      value={dog.specialNeeds}
                      onChange={(e) => updateDog(dog.id, "specialNeeds", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={addDog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Another Dog
              </Button>
              <Button type="submit">Get My Pricing</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
