"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShadcnDataTable } from "@/components/ui/shadcn-data-table";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChevronDown } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { VercelTabs } from "@/components/ui/vercel-tabs";

const mockSummary = {
  totalCredits: 1234,
  change: 12.5,
  chartData: [
    { name: "Core Infrastructure", value: 482, color: "#6366f1" },
    { name: "Studio", value: 605, color: "#10b981" },
    { name: "Solutions", value: 147, color: "#f59e42" },
  ],
  table: [
    {
      name: "Core Infrastructure",
      credits: 482,
      percent: 39.1,
      change: 5.2,
    },
    { name: "Studio", credits: 605, percent: 49.0, change: 18.7 },
    { name: "Solutions", credits: 147, percent: 11.9, change: 8.9 },
  ],
};

const quickActions = [
  { label: "Export Report", variant: "outline" },
  { label: "Add Credits", variant: "default" },
  { label: "Billing Support", variant: "secondary" },
];

export default function BillingUsagePage() {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [openAccordion, setOpenAccordion] = useState(["summary"]);
  const [activeTab, setActiveTab] = useState("usage-statistics");

  const tabs = [
    { id: "credit-balance", label: "Credit Balance" },
    { id: "add-credits", label: "Add Credits" },
    { id: "usage-statistics", label: "Usage Statistics" }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <VercelTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          size="md"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {date ? date.from ? date.from.toLocaleDateString() : "Select Date Range" : "Select Date Range"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="range" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      {activeTab === "usage-statistics" && (
        <div>
          <Accordion
            type="multiple"
            value={openAccordion}
            onValueChange={setOpenAccordion}
            className="mb-6"
          >
            <AccordionItem value="summary">
              <AccordionTrigger className="text-lg font-semibold bg-muted px-4 rounded-t-md">
                Summary
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="col-span-1 flex flex-col justify-between">
                    <CardHeader>
                      <CardTitle>Total Credits Used</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold mb-2">
                        {mockSummary.totalCredits.toLocaleString()}
                      </div>
                      <div className="text-green-600 font-medium mb-4">
                        +{mockSummary.change}% vs previous period
                      </div>
                      {/* Placeholder for line chart */}
                      <div className="h-24 bg-muted rounded flex items-center justify-center text-muted-foreground">
                        Usage trend chart
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="col-span-1 flex flex-col items-center justify-center">
                    <CardHeader>
                      <CardTitle>Credit Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie
                            data={mockSummary.chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            label
                          >
                            {mockSummary.chartData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  <Card className="col-span-1">
                    <CardHeader>
                      <CardTitle>Service Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ShadcnDataTable
                        columns={[
                          {
                            key: "name",
                            label: "Service Name",
                            sortable: true,
                            searchable: true,
                            render: (value: string) => (
                              <div 
                                className="font-medium text-primary underline cursor-pointer text-sm"
                                onClick={() => setOpenAccordion([value.toLowerCase().replace(/ /g, "-")])}
                              >
                                {value}
                              </div>
                            ),
                          },
                          {
                            key: "credits",
                            label: "Credits Used",
                            sortable: true,
                            render: (value: number) => (
                              <div className="text-sm">{value}</div>
                            ),
                          },
                          {
                            key: "percent",
                            label: "% of Total",
                            sortable: true,
                            render: (value: number) => (
                              <div className="text-sm">{value}%</div>
                            ),
                          },
                          {
                            key: "change",
                            label: "Change vs Previous",
                            sortable: true,
                            render: (value: number) => (
                              <div className="text-green-600 font-medium text-sm">+{value}%</div>
                            ),
                          },
                        ]}
                        data={[
                          ...mockSummary.table,
                          {
                            name: "Total",
                            credits: mockSummary.totalCredits,
                            percent: 100,
                            change: mockSummary.change,
                          }
                        ]}
                        pageSize={10}
                        enableSearch={false}
                        enableColumnVisibility={false}
                        enablePagination={false}
                      />
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="core-infrastructure">
              <AccordionTrigger className="text-lg font-semibold bg-muted px-4">Core Infrastructure</AccordionTrigger>
              <AccordionContent>
                <div className="p-4 text-muted-foreground">Detailed Core Infrastructure usage goes here.</div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="studio">
              <AccordionTrigger className="text-lg font-semibold bg-muted px-4">Studio</AccordionTrigger>
              <AccordionContent>
                <div className="p-4 text-muted-foreground">Detailed Studio usage goes here.</div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="solutions">
              <AccordionTrigger className="text-lg font-semibold bg-muted px-4">Solutions</AccordionTrigger>
              <AccordionContent>
                <div className="p-4 text-muted-foreground">Detailed Solutions usage goes here.</div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Card className="mt-6">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-6">
              <div className="font-semibold text-lg mb-2 md:mb-0">Quick Actions</div>
              <div className="flex gap-2 flex-wrap">
                {quickActions.map((action) => (
                  <Button key={action.label} variant={action.variant as any}>
                    {action.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Credit Balance Tab */}
      {activeTab === "credit-balance" && (
        <div className="p-8 text-muted-foreground">Credit Balance details coming soon.</div>
      )}

      {/* Add Credits Tab */}
      {activeTab === "add-credits" && (
        <div className="p-8 text-muted-foreground">Add Credits functionality coming soon.</div>
      )}
    </div>
  );
} 