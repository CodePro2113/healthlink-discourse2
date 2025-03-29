
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle, AlertCircle, Info } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        // Icon based on variant
        let icon = null
        if (variant === "destructive") {
          icon = <AlertCircle className="h-5 w-5 text-destructive" />
        } else if (variant === "success") {
          icon = <CheckCircle className="h-5 w-5 text-green-500" />
        } else {
          icon = <Info className="h-5 w-5 text-primary" />
        }

        return (
          <Toast key={id} {...props} variant={variant}>
            <div className="flex gap-3">
              {icon}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
