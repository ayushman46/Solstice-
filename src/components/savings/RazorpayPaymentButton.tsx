import { useEffect, useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";

// Declare the Razorpay global variable
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentButtonProps extends ButtonProps {
  amount: number;
  onSuccess?: (paymentId: string) => void;
  goalId?: string;
  goalName?: string;
}

export function RazorpayPaymentButton({
  amount,
  onSuccess,
  goalId,
  goalName,
  children,
  ...props
}: RazorpayPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    if (window.Razorpay) {
      setScriptLoaded(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      console.log("✅ Razorpay script loaded");
      setScriptLoaded(true);
    };

    script.onerror = () => {
      console.error("❌ Failed to load Razorpay script");
      toast.error("Failed to load payment gateway. Try again later.");
    };

    document.body.appendChild(script);
  }, []);

  const handlePayment = () => {
    if (!scriptLoaded) {
      toast.error("Payment gateway is still loading. Please wait...");
      return;
    }

    setIsLoading(true);

    try {
      const options = {
        key: "rzp_test_Jg6taV2qSuOdQV", // 🔑 Replace with your test key
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "Fin Pal",
        description: goalName
          ? `Contribution to ${goalName}`
          : "Contribution to savings",
        handler: function (response: any) {
          console.log("✅ Payment successful:", response);
          toast.success(
            "Payment successful! Transaction ID: " + response.razorpay_payment_id
          );

          if (onSuccess) {
            onSuccess(response.razorpay_payment_id);
          }

          setIsLoading(false);
        },
        prefill: {
          name: localStorage.getItem("userName") || "Demo User",
          email: localStorage.getItem("userEmail") || "demo@example.com",
          contact: "9876543210",
        },
        theme: {
          color: "#0f172a",
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            console.log("Payment modal closed without completing payment");
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on("payment.failed", function (response: any) {
        console.error("❌ Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setIsLoading(false);
      });

      razorpayInstance.open();
    } catch (error) {
      console.error("❌ Error initiating Razorpay payment:", error);
      toast.error("Something went wrong. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} disabled={isLoading || !scriptLoaded} {...props}>
      {isLoading ? "Processing..." : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {children || "Pay Now"}
        </>
      )}
    </Button>
  );
}