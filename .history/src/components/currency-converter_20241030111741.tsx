"use client"; // Enables client-side rendering for this component

import { useState, useEffect, ChangeEvent } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ClipLoader from "react-spinners/ClipLoader";

// Define the ExchangeRates type
type ExchangeRates = {
  [key: string]: number;
};

// Define the Currency type
type Currency = "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "PKR";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number | null>(null);
  const [sourceCurrency, setSourceCurrency] = useState<Currency>("USD");
  const [targetCurrency, setTargetCurrency] = useState<Currency>("PKR");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [convertedAmount, setConvertedAmount] = useState<string>("0.00");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        setError("Error fetching exchange rates.");
      } finally {
        setLoading(false);
      }
    };
    fetchExchangeRates();
  }, []);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setAmount(parseFloat(e.target.value));
  };

  const handleSourceCurrencyChange = (value: Currency): void => {
    setSourceCurrency(value);
  };

  const handleTargetCurrencyChange = (value: Currency): void => {
    setTargetCurrency(value);
  };

  const calculateConvertedAmount = (): void => {
    if (sourceCurrency && targetCurrency && amount && exchangeRates) {
      const rate =
        sourceCurrency === "USD"
          ? exchangeRates[targetCurrency]
          : exchangeRates[targetCurrency] / exchangeRates[sourceCurrency];
      const result = amount * rate;
      setConvertedAmount(result.toFixed(2));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="w-full max-w-2xl p-8 rounded-lg shadow-2xl bg-gray-800 border border-gray-700 transition-all hover:border-blue-500 hover:shadow-blue-500/50">
        {/* Header section */}
        <div className="text-center space-y-2 mb-6">
        <h1 className="text-4xl font-extrabold">
  <span className="text-purple-500">Currency</span>{" "}
  <span className="text-pink-500">Converter</span>
</h1>

          <p className="text-gray-400">
            Quickly convert between different currencies with live exchange rates.
          </p>
        </div>

        {/* Card section */}
        <Card className="bg-gray-900 text-white">
          <CardHeader className="text-center mb-4">
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Convert Your Currency
            </CardTitle>
            <CardDescription>
              Enter the amount and select currencies to convert.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center">
                <ClipLoader size={35} color="#3B82F6" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              <div className="grid gap-6">
                {/* Amount input and source currency selection */}
                <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                  <Label htmlFor="from" className="text-gray-400">
                    From
                  </Label>
                  <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={amount || ""}
                      onChange={handleAmountChange}
                      className="w-full text-gray-900"
                      id="from"
                    />
                    <Select
                      value={sourceCurrency}
                      onValueChange={handleSourceCurrencyChange}
                    >
                      <SelectTrigger className="w-24 bg-gray-800 border border-gray-600">
                        <SelectValue placeholder="USD" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="JPY">JPY</SelectItem>
                          <SelectItem value="AUD">AUD</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                          <SelectItem value="PKR">PKR</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Converted amount display and target currency selection */}
                <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                  <Label htmlFor="to" className="text-gray-400">
                    To
                  </Label>
                  <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                    <div className="text-2xl font-bold">{convertedAmount}</div>
                    <Select
                      value={targetCurrency}
                      onValueChange={handleTargetCurrencyChange}
                    >
                      <SelectTrigger className="w-24 bg-gray-800 border border-gray-600">
                        <SelectValue placeholder="PKR" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="JPY">JPY</SelectItem>
                          <SelectItem value="AUD">AUD</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                          <SelectItem value="PKR">PKR</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
              onClick={calculateConvertedAmount}
            >
              Convert
            </Button>
          </CardFooter>
        </Card>
      </div>
            {/* Footer section */}
            <footer className="mt-4 text-sm text-muted-foreground">
        Created By Ismail Ahmed Shah
      </footer>
    </div>
  );
}