"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CompanyBudget from "@/components/company_budget";
import AllProject from "@/components/all_budget";
// import CategoryBudget from "@/components/analysis/category_budget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  const [selectedProject, setSelectedProject] = useState("project1");

  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of all projects and individual project details
        </p>
      </div>

      {/* All Projects Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Projects Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Duration Comparison Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#444444]">
                Projects Duration Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CompanyBudget title="Q2 Project Budgets" />
            </CardContent>
          </Card>

          {/* Budget Comparison Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#444444]">
                Projects Budget Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AllProject title="Q2 Project Budgets" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Visual separator using border and margin instead of Separator component */}
      <div className="border-t border-gray-200 my-6"></div>


    </div>
  );
}
