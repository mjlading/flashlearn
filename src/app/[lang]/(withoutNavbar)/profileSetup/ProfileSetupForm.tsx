"use client";

import { api } from "@/app/api/trpc/client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { academicLevelMap } from "@/lib/academicLevel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  nickname: z
    .string()
    .min(2, {
      message: "Kallenavn må være minst 2 tegn",
    })
    .max(50, {
      message: "Kallenavn kan være max 50 tegn",
    }),
  academicLevel: z.enum(Object.keys(academicLevelMap) as [string, ...string[]]),
});

export default function ProfileSetupForm() {
  const setNicknameMutation = api.user.setNickname.useMutation();
  const setAcademicLevelMutation = api.user.setAcademicLevel.useMutation();
  const session = useSession();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: "",
      academicLevel: "BACHELOR",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const response = await setNicknameMutation.mutateAsync(values.nickname);

    if (response === "NICKNAME_IN_USE") {
      toast.info("Kallenavnet er allerede tatt. Vennligst velg et annet");
      return;
    }

    setAcademicLevelMutation.mutate({
      academicLevel: values.academicLevel,
    });

    // Manually update the session
    await session.update({ nickname: values.nickname, preferencesSet: true });

    toast.success("Profilen din er oppdatert!");

    router.push("/dashboard");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Nickname input */}
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kallenavn</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 shadow-sm">
                    <AvatarImage
                      src={session.data?.user.image ?? ""}
                      alt="profil"
                    />
                    <AvatarFallback>meg</AvatarFallback>
                  </Avatar>
                  <Input placeholder="Ditt kallenavn" {...field} />
                </div>
              </FormControl>
              <FormDescription>Ditt offentlige visningsnavn</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Academic level select */}
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name="academicLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Akademisk nivå</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(academicLevelMap).map(
                      (academicLevelOption) => (
                        <SelectItem
                          value={academicLevelOption}
                          key={academicLevelOption}
                        >
                          {academicLevelMap[academicLevelOption]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={
            setNicknameMutation.isLoading || setNicknameMutation.isSuccess
          }
        >
          {setNicknameMutation.isLoading && (
            <LoadingSpinner className="mr-2" size={20} />
          )}
          Lagre
        </Button>
      </form>
    </Form>
  );
}
