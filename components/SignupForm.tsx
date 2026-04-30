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
import { CheckCircle, Loader2, Lock, Phone, User } from "lucide-react";
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
      router.push("/");
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || "Something went wrong");
    },
  });

  return (
    <Card className="border-0 shadow-xl" {...props}>
      <CardHeader className="space-y-3 pb-6">
        <CardTitle className="text-2xl">Get Started</CardTitle>
        <CardDescription>
          Create your account and start booking amazing journeys
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))}>
          <FieldGroup className="space-y-5">
            <Field>
              <FieldLabel htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                Full Name
              </FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <FieldDescription className="mt-2 flex items-center gap-1 text-red-500">
                  ⚠ {form.formState.errors.name.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                Phone Number
              </FieldLabel>
              <Input
                id="phone"
                placeholder="01XXXXXXXXX"
                required
                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
                <FieldDescription className="mt-2 flex items-center gap-1 text-red-500">
                  ⚠ {form.formState.errors.phone.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel
                htmlFor="password"
                className="flex items-center gap-2"
              >
                <Lock className="h-4 w-4 text-blue-600" />
                Password
              </FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <FieldDescription className="mt-2 flex items-center gap-1 text-red-500">
                  ⚠ {form.formState.errors.password.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel
                htmlFor="confirm-password"
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4 text-blue-600" />
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                required
                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword && (
                <FieldDescription className="mt-2 flex items-center gap-1 text-red-500">
                  ⚠ {form.formState.errors.confirmPassword.message}
                </FieldDescription>
              )}
            </Field>

            <Field className="pt-2">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-2.5 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700 disabled:opacity-70"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
