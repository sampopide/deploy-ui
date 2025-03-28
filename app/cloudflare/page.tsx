"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Search, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";

// Dummy data
const initialData = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  email: `user${i + 1}@example.com`,
  password: "SuperSecurePassword123!@#",
  globalKey: `cf_key_${Math.random().toString(36).substring(7)}${Math.random().toString(36).substring(7)}${Math.random().toString(36).substring(7)}`,
  ns1: `ns${i + 1}.cloudflare.com`,
  ns2: `ns${i + 1}.cloudflare.net`,
  landingUrl: `https://landing-${i + 1}.pages.dev`,
  status: i % 2 === 0 ? "active" : "passive",
}));

export default function CloudflarePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<{ [key: string]: boolean }>({});
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return initialData
      .filter(item => item.status === "active")
      .filter(item =>
        item.email.toLowerCase().includes(query) ||
        item.landingUrl.toLowerCase().includes(query)
      );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  const getCurrentPageData = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredData.slice(start, end);
  };

  const toggleVisibility = (id: number, field: string) => {
    const key = `${id}-${field}`;
    setVisibleItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleDelete = (id: number) => {
    // Handle delete action here
    console.log('Delete account:', id);
  };

  const SensitiveData = ({ id, value, field }: { id: number; value: string; field: string }) => {
    const key = `${id}-${field}`;
    const isVisible = visibleItems[key];

    return (
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="max-w-[200px] overflow-hidden overflow-ellipsis whitespace-nowrap">
                {isVisible ? value : "••••••••"}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[400px] break-all">{isVisible ? value : "••••••••"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => toggleVisibility(id, field)}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  };

  const TruncatedEmail = ({ email }: { email: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-block max-w-[200px]">
            {email.length > 20 ? `${email.substring(0, 20)}...` : email}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{email}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Active Accounts</h1>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email or landing URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={handleItemsPerPageChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select rows per page" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 50, 100, 200].map((value) => (
              <SelectItem key={value} value={value.toString()}>
                {value} rows per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Global Key</TableHead>
              <TableHead>NS1</TableHead>
              <TableHead>NS2</TableHead>
              <TableHead>Landing URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentPageData().map((account) => (
              <TableRow key={account.id}>
                <TableCell>
                  <TruncatedEmail email={account.email} />
                </TableCell>
                <TableCell>
                  <SensitiveData
                    id={account.id}
                    value={account.password}
                    field="password"
                  />
                </TableCell>
                <TableCell>
                  <SensitiveData
                    id={account.id}
                    value={account.globalKey}
                    field="globalKey"
                  />
                </TableCell>
                <TableCell>{account.ns1}</TableCell>
                <TableCell>{account.ns2}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="max-w-[200px] overflow-hidden overflow-ellipsis whitespace-nowrap">
                          {account.landingUrl}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{account.landingUrl}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    Active
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive/90"
                    onClick={() => handleDelete(account.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {getCurrentPageData().length} of {filteredData.length} results
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}