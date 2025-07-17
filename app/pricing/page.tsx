"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Dog, Scissors, Sparkles } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)

  // Mock pricing calculation based on dog details
  const pricingData = {
    bath: { base: 35, current: 45 },
    retouch: { base: 55, current: 65 },
    grooming: { base: 75, current: 95 },
  }

  const services = [
    {
      id: "bath",
      name: "Bath Service",
      icon: Sparkles,
      price: pricingData.bath.current,
      originalPrice: pricingData.bath.base,
      features: [
        "Thorough wash with premium shampoo",
        "Complete blow dry",
        "Nail trimming",
        "Ear cleaning",
        "Basic brushing",
      ],
    },
    {
      id: "retouch",
      name: "Bath & Retouch",
      icon: Scissors,
      price: pricingData.retouch.current,
      originalPrice: pricingData.retouch.base,
      popular: true,
      features: [
        "Everything in Bath Service",
        "Light trimming around face",
        "Paw pad trimming",
        "Sanitary area cleanup",
        "Basic styling",
      ],
    },
    {
      id: "grooming",
      name: "Full Grooming",
      icon: Dog,
      price: pricingData.grooming.current,
      originalPrice: pricingData.grooming.base,
      features: [
        "Everything in Bath & Retouch",
        "Complete haircut/styling",
        "Breed-specific cuts available",
        "Teeth brushing",
        "Cologne spritz",
        "Bow or bandana",
      ],
    },
  ]

  const handleBookService = (serviceId: string) => {
    setSelectedService(serviceId)
    // In real app, proceed to booking calendar
    window.location.href = "/booking"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/register">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Your Personalized Pricing</h1>
              <p className="text-gray-600">Based on your Golden Retriever, 50-75 lbs</p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-blue-100 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Pricing Adjusted For:</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Large Breed</Badge>
              <Badge variant="secondary">Thick Coat</Badge>
              <Badge variant="secondary">Adult Dog</Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.id} className={`relative ${service.popular ? "ring-2 ring-blue-500" : ""}`}>
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <Icon className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <CardTitle>{service.name}</CardTitle>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold">${service.price}</div>
                      {service.price !== service.originalPrice && (
                        <div className="text-sm text-gray-500">
                          Base price: <span className="line-through">${service.originalPrice}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      onClick={() => handleBookService(service.id)}
                      variant={service.popular ? "default" : "outline"}
                    >
                      Book This Service
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Why Pricing Varies</CardTitle>
              <CardDescription>Our pricing is tailored to your dog's specific needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Factors that affect pricing:</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Dog size and weight</li>
                    <li>• Coat type and thickness</li>
                    <li>• Breed-specific requirements</li>
                    <li>• Behavioral considerations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Your dog qualifies for:</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Large breed handling</li>
                    <li>• Double coat treatment</li>
                    <li>• Extended grooming time</li>
                    <li>• Specialized tools</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
