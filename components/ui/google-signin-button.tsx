import { Button } from "./button"
import { FcGoogle } from "react-icons/fc"

interface GoogleSignInButtonProps {
  onClick: () => void
}

export function GoogleSignInButton({ onClick }: GoogleSignInButtonProps) {
  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2 py-6"
      onClick={onClick}
    >
      <FcGoogle className="w-5 h-5" />
      <span>Continuar con Google</span>
    </Button>
  )
}