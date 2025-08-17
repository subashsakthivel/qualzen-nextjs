import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Gift, Percent, Star, Tag } from "lucide-react";

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground">
                Exclusive Offers
              </h1>
              <p className="font-serif text-muted-foreground mt-2">
                Discover premium fashion deals and limited-time offers
              </p>
            </div>
            <Badge variant="secondary" className="hidden md:flex items-center gap-2">
              <Star className="h-4 w-4" />
              Premium Member
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Ongoing Offers Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Percent className="h-6 w-6 text-primary" />
            <h2 className="font-sans text-2xl font-semibold text-foreground">Ongoing Offers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                  <img
                    src="/placeholder.svg?height=200&width=350"
                    alt="Summer Collection"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardTitle className="font-sans text-xl">Summer Collection</CardTitle>
                <CardDescription className="font-serif">
                  Up to 40% off on selected summer styles
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full font-serif">Shop Now</Button>
              </CardFooter>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                  <img
                    src="/placeholder.svg?height=200&width=350"
                    alt="Accessories Sale"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardTitle className="font-sans text-xl">Accessories Sale</CardTitle>
                <CardDescription className="font-serif">
                  Buy 2 get 1 free on all accessories
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full font-serif">Shop Now</Button>
              </CardFooter>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                  <img
                    src="/placeholder.svg?height=200&width=350"
                    alt="Designer Shoes"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardTitle className="font-sans text-xl">Designer Shoes</CardTitle>
                <CardDescription className="font-serif">
                  30% off on premium footwear collection
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full font-serif">Shop Now</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Ending Soon Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-6 w-6 text-destructive" />
            <h2 className="font-sans text-2xl font-semibold text-foreground">Ending Soon</h2>
            <Badge variant="destructive" className="font-serif">
              Limited Time
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-destructive/20 bg-destructive/5 group hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="destructive" className="font-serif">
                    Ends in 2 days
                  </Badge>
                  <span className="font-sans text-2xl font-bold text-destructive">50% OFF</span>
                </div>
                <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                  <img
                    src="/placeholder.svg?height=200&width=400"
                    alt="Winter Sale"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardTitle className="font-sans text-xl">Winter Clearance</CardTitle>
                <CardDescription className="font-serif">
                  Final markdowns on winter collection
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="destructive" className="w-full font-serif">
                  Shop Before It Ends
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5 group hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="destructive" className="font-serif">
                    Ends in 5 hours
                  </Badge>
                  <span className="font-sans text-2xl font-bold text-destructive">70% OFF</span>
                </div>
                <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                  <img
                    src="/placeholder.svg?height=200&width=400"
                    alt="Flash Sale"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardTitle className="font-sans text-xl">Flash Sale</CardTitle>
                <CardDescription className="font-serif">
                  Midnight flash sale on selected items
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="destructive" className="w-full font-serif">
                  Grab Now
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Special Promotions */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Tag className="h-6 w-6 text-primary" />
            <h2 className="font-sans text-2xl font-semibold text-foreground">Special Promotions</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="font-serif">New Customer</Badge>
                  <span className="font-sans text-3xl font-bold text-primary">20% OFF</span>
                </div>
                <h3 className="font-sans text-xl font-semibold mb-2">Welcome Offer</h3>
                <p className="font-serif text-muted-foreground mb-4">
                  Get 20% off your first purchase when you sign up for our newsletter
                </p>
                <Button className="font-serif">Claim Offer</Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20 group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="font-serif">
                    VIP Members
                  </Badge>
                  <span className="font-sans text-3xl font-bold text-accent">Free Shipping</span>
                </div>
                <h3 className="font-sans text-xl font-semibold mb-2">VIP Benefits</h3>
                <p className="font-serif text-muted-foreground mb-4">
                  Enjoy free shipping on all orders plus early access to sales
                </p>
                <Button variant="outline" className="font-serif bg-transparent">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
