"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signup } from "@/lib/api/auth";
import { saveUser } from "@/lib/auth";
import { signupSchema } from "@/lib/validation/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  const form = useForm({
    resolver: yupResolver(signupSchema),
  });

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: ({ data }) => {
      saveUser(data);
      document.cookie = `auth_token=${data.token}`;
      router.push("/");
    },
    onError: (e: any) => {
      console.log({ e });

      toast.error(e.response?.data?.message);
    },
  });

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <FieldDescription className="text-red-500">
                  {form.formState.errors.name.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="phone">Phone</FieldLabel>
              <Input
                id="phone"
                placeholder="01XXXXXXXXX"
                required
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
                <FieldDescription className="text-red-500">
                  {form.formState.errors.phone.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                required
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <FieldDescription className="text-red-500">
                  {form.formState.errors.password.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                required
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword && (
                <FieldDescription className="text-red-500">
                  {form.formState.errors.confirmPassword.message}
                </FieldDescription>
              )}
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Create Account</Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/signin">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
