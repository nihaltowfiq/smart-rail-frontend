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
import { signin } from "@/lib/api/auth";
import { saveUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { loginSchema } from "@/lib/validation/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Lock, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const form = useForm({
    resolver: yupResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: signin,
    onSuccess: ({ data }) => {
      saveUser(data);
      router.push("/");
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || "Something went wrong");
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 shadow-xl">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account to continue booking your journeys
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            autoComplete="off"
            autoCorrect="off"
            onSubmit={form.handleSubmit((data) => {
              mutation.mutate(data);
            })}
          >
            <FieldGroup className="space-y-5">
              <Field>
                <FieldLabel htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-purple-600" />
                  Phone Number
                </FieldLabel>
                <Input
                  id="phone"
                  required
                  type="number"
                  placeholder="01XXXXXXXXX"
                  autoComplete="off"
                  autoCorrect="off"
                  className="border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
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
                  <Lock className="h-4 w-4 text-purple-600" />
                  Password
                </FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <FieldDescription className="mt-2 flex items-center gap-1 text-red-500">
                    ⚠ {form.formState.errors.password.message}
                  </FieldDescription>
                )}
              </Field>

              <Field className="pt-2">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 py-2.5 font-semibold text-white transition-all hover:from-purple-700 hover:to-purple-800 disabled:opacity-70"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
