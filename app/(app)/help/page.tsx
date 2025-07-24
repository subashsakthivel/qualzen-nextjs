import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp, Mail, Phone, MessageCircle } from "lucide-react";

export const Help = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I track my order?",
      answer:
        "You can track your order by visiting the Orders page in your account or using the tracking number sent to your email.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for unworn items in original condition with tags attached.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to most countries worldwide. International shipping takes 7-14 business days.",
    },
    {
      question: "How do I change or cancel my order?",
      answer:
        "Orders can be modified or cancelled within 1 hour of placement. After that, please contact customer service.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and digital wallets like Apple Pay and Google Pay.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">How can we help you?</h1>
          <p className="text-muted-foreground mb-8">
            Find answers to common questions or get in touch with our support team
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get help via email within 24 hours
              </p>
              <Button variant="outline" size="sm">
                Send Email
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">Chat with our team in real-time</p>
              <Button variant="outline" size="sm">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Phone Support</h3>
              <p className="text-sm text-muted-foreground mb-4">Call us Mon-Fri, 9AM-6PM EST</p>
              <Button variant="outline" size="sm">
                Call Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                  <button
                    className="flex items-center justify-between w-full text-left"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <h3 className="font-medium pr-4">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="mt-3 text-muted-foreground">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No FAQ found matching your search.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
