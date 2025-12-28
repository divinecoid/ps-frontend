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
import { Link } from "react-router-dom"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card {...props} className="select-none">
      <CardHeader>
        <CardTitle>Membuat akun</CardTitle>
        <CardDescription>
          Masukkan informasi anda di bawah untuk membuat akun anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
              <Input id="name" type="text" placeholder="John Doe" required autoFocus />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="email@contoh.com"
                required
              />
              <FieldDescription>
                Kami akan menggunakan ini untuk menghubungi anda. Kami tidak akan membagikan email anda kepada siapapun.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
              <Input id="password" type="password" required />
              <FieldDescription>
                Setidaknya memiliki 8 karakter.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Konfirmasi Kata Sandi
              </FieldLabel>
              <Input id="confirm-password" type="password" required />
              <FieldDescription>Tolong konfirmasikan kata sandi anda.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Membuat Akun</Button>
                <FieldDescription className="px-6 text-center">
                  Sudah memiliki akun? <Link to="/login">Masuk</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
