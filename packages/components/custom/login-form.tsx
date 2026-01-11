import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/provider/auth-provider"
import { toast } from "sonner"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const username = form.username.value;
    const password = form.password.value;
    try {
      const response = await login(username, password);
      if (response) {
        navigate('/home');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { richColors: true })
      }
    }
  }
  return (
    <div className={cn("flex flex-col gap-6 select-none", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Masuk ke dalam akun anda</CardTitle>
          <CardDescription>
            Masukkan kredensial anda di bawah untuk masuk ke akun anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Nama pengguna</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="pengguna.contoh"
                  required
                  autoFocus
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Kata sandi</FieldLabel>
                  <a
                    href="#"
                    tabIndex={1}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Lupa kata sandi anda?
                  </a>
                </div>
                <Input id="password" type="password" required placeholder="kata-sandi.contoh.123" />
              </Field>
              <Field>
                <Button type="submit">Masuk</Button>
                {/* <Button variant="outline" type="button">
                  Login with Google
                </Button> */}
                <FieldDescription className="text-center">
                  Tidak memiliki akun? <Link tabIndex={2} to="/register">Daftar</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
